import React, { useState, useEffect } from "react";
import MainLayout from "../components/layouts/MainLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Mic, Send, Award } from "lucide-react";
import { Narrative, Emotion } from "../types";
import toast, { Toaster } from "react-hot-toast";

const API = import.meta.env.VITE_API_BASE;

const SpeechRecognition =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "id-ID";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace("senang", "happy")
    .replace("sedih", "sad")
    .replace("marah", "angry")
    .replace("iri", "envy")
    .replace("malu", "embarrassed")
    .replace("takut", "fear");

const Learn: React.FC = () => {
  const { user } = useAuth();
  const [showAutismAid, setShowAutismAid] = useState(false);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<number[]>([]);
  const [newBadgeNames, setNewBadgeNames] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [currentNarrative, setCurrentNarrative] = useState<Narrative | null>(
    null
  );
  const isSegment2 = user?.segment === "10-12";
  const [userStrategy, setUserStrategy] = useState("");
  const [gptAdvice, setGptAdvice] = useState<string | null>(null);
  const [hasAnsweredEmotion, setHasAnsweredEmotion] = useState(false);
  const [responseId, setResponseId] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [result, setResult] = useState<{
    predictedEmotions: Emotion[];
    feedback: string;
    score: number;
    isCorrect: boolean;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchNarratives = async () => {
      try {
        const responsesRes = await fetch(`${API}/user/${user.id}/responses`);
        const responsesData = await responsesRes.json();

        const latestMap = new Map();
        responsesData.forEach((r: any) => {
          const existing = latestMap.get(r.narrative_id);
          const isNewer =
            !existing || new Date(r.created_at) > new Date(existing.created_at);
          if (isNewer) latestMap.set(r.narrative_id, r);
        });

        const alreadyDone = Array.from(latestMap.values())
          .filter((r) => !r.repeatable)
          .map((r) => r.narrative_id);

        const segment = user.segment === "7-9" ? 1 : 2;
        const res = await fetch(`${API}/narratives?segment=${segment}`);
        const data = await res.json();
        setNarratives(data);

        const unseen = data.filter(
          (n: Narrative) => !alreadyDone.includes(n.id)
        );
        if (unseen.length > 0) {
          const random = unseen[Math.floor(Math.random() * unseen.length)];
          setCurrentNarrative(random);
        } else {
          setCurrentNarrative(null);
        }

        const badgeRes = await fetch(`${API}/user/${user.id}/achievements`);
        const badgeData = await badgeRes.json();
        setEarnedBadgeIds(badgeData.map((b: any) => b.badge.id));
      } catch (error) {
        console.error("❌ Error fetching narratives:", error);
      }
    };

    fetchNarratives();

    if (recognition) {
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserAnswer(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    }

    return () => {
      if (recognition && isRecording) recognition.abort();
    };
  }, [user]);

  const toggleRecording = () => {
    if (!recognition)
      return alert("Browser tidak mendukung speech recognition.");
    isRecording ? recognition.stop() : recognition.start();
    setUserAnswer("");
    setIsRecording(!isRecording);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentNarrative || !user) return;
    setIsProcessing(true);

    try {
      const predictRes = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userAnswer }),
      });

      const predictData = await predictRes.json();
      const emotionLabels: Emotion[] = [
        "happy",
        "sad",
        "angry",
        "envy",
        "embarrassed",
        "fear",
      ];
      const predictedEmotions = predictData.probabilities
        .map((prob: number, idx: number) =>
          prob > 0.5 ? emotionLabels[idx] : null
        )
        .filter((e): e is Emotion => e !== null);

      const correctEmotions = currentNarrative.expectedEmotions.map(
        normalize
      ) as Emotion[];
      const isCorrect = predictedEmotions.some((e) =>
        correctEmotions.includes(e)
      );
      const score = isCorrect ? 10 : 0;

      let feedback = "Terima kasih atas jawabanmu!";

      if (!isSegment2) {
        const gptRes = await fetch(`${API}/gpt-feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answer: userAnswer,
            expected_emotions: correctEmotions,
            is_correct: isCorrect,
            narrative: currentNarrative.text,
          }),
        });

        const gptData = await gptRes.json();
        feedback = gptData.feedback || feedback;
      }

      setResult({ predictedEmotions, feedback, score, isCorrect });

      const responseRes = await fetch(`${API}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          narrative_id: currentNarrative.id,
          user_answer: userAnswer,
          predicted_emotion: predictedEmotions,
          is_correct: isCorrect,
          score,
          feedback,
        }),
      });

      const resData = await responseRes.json();
      setResponseId(resData.id);

      if (isSegment2) {
        setHasAnsweredEmotion(true);
        return;
      }

      const badgeCheck = await fetch(`${API}/user/${user.id}/achievements`);
      const latestBadges = await badgeCheck.json();
      const latestIds = latestBadges.map((b: any) => b.badge.id);
      const newBadgeObjects = latestBadges.filter(
        (b: any) => !earnedBadgeIds.includes(b.badge.id)
      );
      const newNames = newBadgeObjects.map((b: any) => b.badge.name);

      if (newBadgeObjects.length > 0) {
        setNewBadgeNames(newNames);
        setShowCelebration(true);
        setEarnedBadgeIds(latestIds);
        toast.success(`🎉 Kamu mendapatkan ${newNames.length} lencana baru!`);
      }
    } catch (err) {
      alert("Gagal memproses jawaban.");
      console.error("❌ Error during submission:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFollowupSubmit = async () => {
    if (!userStrategy.trim() || !currentNarrative || !result || !user) return;

    try {
      const gptRes = await fetch(`${API}/gpt-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          narrative: currentNarrative.text,
          answer: userStrategy,
          expected_emotions: currentNarrative.expectedEmotions,
          is_correct: result.isCorrect,
          segment: user.segment,
          followup: true,
        }),
      });

      const gptData = await gptRes.json();
      const feedback = gptData.feedback || "Terima kasih atas jawabanmu!";
      setGptAdvice(feedback);

      await fetch(`${API}/responses/${responseId}/add_followup`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback,
        }),
      });

      const badgeCheck = await fetch(`${API}/user/${user.id}/achievements`);
      const latestBadges = await badgeCheck.json();
      const latestIds = latestBadges.map((b: any) => b.badge.id);
      const newBadgeObjects = latestBadges.filter(
        (b: any) => !earnedBadgeIds.includes(b.badge.id)
      );
      const newNames = newBadgeObjects.map((b: any) => b.badge.name);

      if (newBadgeObjects.length > 0) {
        setNewBadgeNames(newNames);
        setShowCelebration(true);
        setEarnedBadgeIds(latestIds);
        toast.success(`🎉 Kamu mendapatkan ${newNames.length} lencana baru!`);
      }
    } catch (err) {
      toast.error("❌ Gagal menyimpan jawaban lanjutan.");
    }
  };

  const handleNextNarrative = async () => {
    setUserAnswer("");
    setResult(null);
    setGptAdvice(null); // clear GPT suggestion
    setUserStrategy(""); // clear strategy textarea
    setHasAnsweredEmotion(false); // reset answer phase

    if (!user || !narratives.length) return;

    try {
      const fetchResponses = await fetch(`${API}/user/${user.id}/responses`);
      const responseData = await fetchResponses.json();

      const latestMap = new Map();
      responseData.forEach((r: any) => {
        const existing = latestMap.get(r.narrative_id);
        const isNewer =
          !existing || new Date(r.created_at) > new Date(existing.created_at);
        if (isNewer) latestMap.set(r.narrative_id, r);
      });

      const alreadyDone = Array.from(latestMap.values())
        .filter((r) => !r.repeatable)
        .map((r) => r.narrative_id);

      const unseen = narratives.filter(
        (n: Narrative) =>
          n.id !== currentNarrative?.id && !alreadyDone.includes(n.id)
      );

      if (unseen.length > 0) {
        const random = unseen[Math.floor(Math.random() * unseen.length)];
        setCurrentNarrative(random);
      } else {
        setCurrentNarrative(null);
      }
    } catch (err) {
      console.error("❌ Failed to load next narrative:", err);
    }
  };

  const getEmotionName = (emotion: Emotion): string => {
    const map: Record<Emotion, string> = {
      happy: "Senang",
      sad: "Sedih",
      angry: "Marah",
      envy: "Iri",
      embarrassed: "Malu",
      fear: "Takut",
    };
    return map[emotion];
  };

  const handleFlagIncorrectModel = async () => {
    try {
      if (!currentNarrative || !user) return;

      await fetch(`${API}/responses/flag-latest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          narrative_id: currentNarrative.id,
        }),
      });

      toast.success(
        "Pertanyaan berhasil ditandai di halaman Statistik untuk pendamping."
      );
    } catch (err) {
      toast.error("❌ Gagal menandai pertanyaan.");
      console.error("Flag error:", err);
    }
  };

  if (!currentNarrative) {
    return (
      <MainLayout>
        <div className="text-center px-8 py-24 text-xl text-gray-700 max-w-xl mx-auto mt-9 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl shadow">
          🎉 Semua cerita telah dijawab!
          <br />
          Tidak ada cerita yang dimasukkan kembali ke daftar belajar.
          <br />
          Kamu bisa mengatur ulang cerita yang ingin diulang dari halaman{" "}
          <strong>Statistik</strong>.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Belajar Emosi</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-xl px-4 py-2 rounded-full bg-sky-100 text-sky-800 hover:bg-sky-200"
          >
            {showGuide
              ? "Sembunyikan Panduan Emosi"
              : "Tampilkan Panduan Emosi"}
          </button>
        </div>

        {showGuide && (
          <Card className="mb-6 bg-yellow-50 border-l-4 border-yellow-400">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3">
              Petunjuk Emosi
            </h2>
            <p className="text-lg text-gray-700 mb-3">
              Cerita ini mungkin mengandung emosi berikut. Yuk dikenali!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {["happy", "sad", "angry", "envy", "embarrassed", "fear"].map(
                (key) => (
                  <div
                    key={key}
                    className="flex flex-col items-center space-y-2 bg-white p-3 rounded-lg shadow-sm"
                  >
                    <img
                      src={`/src/img/${key}.svg`}
                      alt={key}
                      className="w-12 h-12"
                    />
                    <span className="text-lg font-medium text-gray-700">
                      {getEmotionName(key as Emotion)}
                    </span>
                  </div>
                )
              )}
              <div className="mt-6">
                <button
                  onClick={() => setShowAutismAid((prev) => !prev)}
                  className="text-base px-4 py-2 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition"
                >
                  {showAutismAid
                    ? "Sembunyikan Bantuan Tambahan"
                    : "Bantuan Tambahan: Contoh Ekspresi"}
                </button>

                {showAutismAid && (
                  <div className="flex gap-6 mt-4 justify-between flex-wrap sm:flex-nowrap">
                    {[
                      { id: "autism-happy", label: "Senang" },
                      { id: "autism-sad", label: "Sedih" },
                      { id: "autism-angry", label: "Marah" },
                      { id: "autism-fear", label: "Takut" },
                      { id: "autism-embarrassed", label: "Malu" },
                      { id: "autism-envy", label: "Iri" },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col items-center space-y-2 bg-white p-3 rounded-lg shadow-sm"
                      >
                        <img
                          src={`/img/autism-expressions/${item.id}.jpeg`}
                          alt={item.label}
                          className="flex-1 min-w-0 max-w-[160px]"
                        />
                        <span className="text-base font-medium text-gray-700">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        <Card className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-700">Cerita</h2>
          <div className="flex justify-center gap-12 items-center mb-4 bg-sky-50 p-6 rounded-xl border-l-4 border-sky-500">
            {currentNarrative.image_path && (
              <img
                src={`/${currentNarrative.image_path}`}
                alt="Ilustrasi cerita"
                className="w-[580px] h-auto rounded-md object-cover flex-shrink-0"
              />
            )}
            <p className="text-2xl text-justify leading-relaxed text-gray-800 justify-text font-medium p-4 w-[480px]">
              {currentNarrative.text}
            </p>
          </div>
          <p className="text-xl text-sky-700 font-medium">
            Apa emosi yang ada dalam cerita di atas? Tuliskan jawabanmu.
          </p>
        </Card>

        {!result ? (
          <Card>
            <h2 className="text-3xl font-bold mb-4 text-gray-700">Jawabanmu</h2>
            <textarea
              className="text-xl w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[120px]"
              placeholder="Ceritakan emosi apa yang kamu dapatkan dari cerita tersebut..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            ></textarea>
            <div className="flex flex-col sm:flex-row justify-between mt-4">
              <Button
                variant="outline"
                className="mb-4 sm:mb-0"
                onClick={toggleRecording}
              >
                <Mic
                  className={`w-5 h-5 mr-2 ${
                    isRecording ? "text-red-500 animate-pulse" : ""
                  }`}
                />
                {isRecording ? "Mendengarkan..." : "Gunakan Suara"}
              </Button>
              <Button
                onClick={handleSubmitAnswer}
                disabled={isProcessing || !userAnswer.trim()}
              >
                {isProcessing ? "Memproses..." : "Kirim Jawaban"}
                {!isProcessing && <Send className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Hasil</h2>
            <div
              className={`p-6 rounded-xl mb-6 ${
                result.isCorrect
                  ? "bg-green-50 border-l-4 border-green-500"
                  : "bg-red-50 border-l-4 border-red-500"
              }`}
            >
              <p className="text-lg font-medium mb-2">{result.feedback}</p>
              <div className="mt-4">
                <p className="font-medium">Emosi yang terdeteksi:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.predictedEmotions.map((emotion, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-lg ${
                        currentNarrative.expectedEmotions.includes(emotion)
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getEmotionName(normalize(emotion) as Emotion)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="font-medium">Emosi yang diharapkan:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentNarrative.expectedEmotions.map((emotion, i) => (
                    <span
                      key={i}
                      className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-lg"
                    >
                      {getEmotionName(normalize(emotion) as Emotion)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="font-bold text-lg">+{result.score} poin</span>
              </div>
            </div>
          </Card>
        )}

        {result && isSegment2 && hasAnsweredEmotion && !gptAdvice && (
          <Card className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              💭 Apa yang bisa kamu lakukan di situasi tersebut?
            </h2>
            <textarea
              className="text-lg w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[120px]"
              placeholder="Tulis strategi atau tindakan yang bisa kamu ambil..."
              value={userStrategy}
              onChange={(e) => setUserStrategy(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleFollowupSubmit}>Kirim Jawaban</Button>
            </div>
          </Card>
        )}

        {gptAdvice && (
          <Card className="mt-6 bg-green-50 border-l-4 border-green-400">
            <h2 className="text-xl font-bold text-green-700 mb-2">
              💡 Saran dari Feelio
            </h2>
            <p className="text-lg text-gray-800">{gptAdvice}</p>
          </Card>
        )}

        {isSegment2 && gptAdvice && (
          <div className="mt-6 flex justify-center">
            {isSegment2 && gptAdvice && (
              <div className="mt-6 flex justify-between flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center">
                <Button variant="outline" onClick={handleFlagIncorrectModel}>
                  🚩 Salah prediksi? Tandai jawaban model
                </Button>
                <Button onClick={handleNextNarrative}>Cerita Berikutnya</Button>
              </div>
            )}
          </div>
        )}
      </div>
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm animate-bounce">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              🎉 Selamat!
            </h2>
            <p className="text-gray-700 mb-4">Kamu mendapatkan lencana baru:</p>
            <ul className="text-sky-700 font-medium mb-4">
              {newBadgeNames.map((name, i) => (
                <li key={i}>🏅 {name}</li>
              ))}
            </ul>
            <Button onClick={() => setShowCelebration(false)}>Tutup</Button>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </MainLayout>
  );
};

export default Learn;
