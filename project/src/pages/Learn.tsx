import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Mic, Send, Award } from 'lucide-react';
import { Narrative, Emotion } from '../types';

const mockNarratives: Narrative[] = [
  {
    id: '1',
    text: 'Hari ini Budi mendapatkan nilai bagus di sekolah. Dia tersenyum lebar karena semua usaha belajarnya terbayar.',
    isYoungSegment: true,
    expectedEmotions: ['happy', 'sad'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    text: 'Saat istirahat sekolah, Maya tidak sengaja menumpahkan minumannya ke baju Lisa. Semua teman-teman di sekitar mereka tertawa melihat kejadian itu. Lisa terlihat kesal!',
    isYoungSegment: true,
    expectedEmotions: ['embarrassed', 'angry'],
    createdAt: new Date().toISOString(),
  },
];

const mockFeedback = {
  correct: [
    'Hebat! Kamu berhasil mengenali emosi dengan tepat!',
    'Wah, kamu sungguh pandai memahami perasaan dalam cerita ini!',
    'Luar biasa! Kamu memiliki pemahaman emosi yang sangat baik!',
  ],
  partial: [
    'Kamu sudah hampir benar! Coba pikirkan apa emosi lain yang mungkin dirasakan dalam situasi ini?',
    'Bagus! Kamu sudah mengenali sebagian emosi dengan tepat. Ada emosi lain yang terlewat?',
    'Kamu di jalur yang benar! Coba perhatikan lagi apa yang terjadi dan rasakan lebih dalam.',
  ],
  incorrect: [
    'Hmm, coba pikirkan lagi. Bagaimana perasaanmu jika berada dalam situasi tersebut?',
    'Belum tepat, tapi tidak apa-apa! Belajar mengenali emosi memang butuh latihan.',
    'Coba bayangkan dirimu berada di posisi itu. Perasaan apa yang akan kamu rasakan?',
  ],
};

const getRandomFeedback = (type: 'correct' | 'partial' | 'incorrect') => {
  const options = mockFeedback[type];
  return options[Math.floor(Math.random() * options.length)];
};

const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'id-ID';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

const Learn: React.FC = () => {
  const { user } = useAuth();
  const [currentNarrative, setCurrentNarrative] = useState<Narrative | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [result, setResult] = useState<{
    predictedEmotions: Emotion[];
    feedback: string;
    score: number;
    isCorrect: boolean;
    isPartial: boolean;
  } | null>(null);

  useEffect(() => {
    const isYoungSegment = user?.segment === '7-9';
    const relevantNarratives = mockNarratives.filter(n => n.isYoungSegment === isYoungSegment);
    const randomIndex = Math.floor(Math.random() * relevantNarratives.length);
    setCurrentNarrative(relevantNarratives[randomIndex] || mockNarratives[0]);

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
    if (!recognition) return alert('Browser tidak mendukung speech recognition.');
    isRecording ? recognition.stop() : recognition.start();
    setUserAnswer('');
    setIsRecording(!isRecording);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return alert('Silakan masukkan jawaban.');
    if (!currentNarrative) return;

    setIsProcessing(true);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userAnswer }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      const emotionLabels: Emotion[] = ['happy', 'sad', 'angry', 'embarrassed', 'fear', 'envy'];
      const predictedEmotions = data.probabilities
        .map((prob: number, idx: number) => prob > 0.5 ? emotionLabels[idx] : null)
        .filter((e): e is Emotion => e !== null);

      const correctEmotions = currentNarrative.expectedEmotions;
      const correctCount = predictedEmotions.filter(e => correctEmotions.includes(e)).length;

      let score = 0;
      let feedback = '';
      let isCorrect = false;
      let isPartial = false;

      if (correctCount === correctEmotions.length && predictedEmotions.length === correctEmotions.length) {
        score = 10; feedback = getRandomFeedback('correct'); isCorrect = true;
      } else if (correctCount > 0) {
        score = 5; feedback = getRandomFeedback('partial'); isPartial = true;
      } else {
        score = 0; feedback = getRandomFeedback('incorrect');
      }

      setResult({ predictedEmotions, feedback, score, isCorrect, isPartial });
    } catch (err) {
      alert('Gagal memproses jawaban. Coba lagi nanti.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextNarrative = () => {
    setUserAnswer('');
    setResult(null);
    const isYoungSegment = user?.segment === '7-9';
    const others = mockNarratives.filter(n => n.isYoungSegment === isYoungSegment && n.id !== currentNarrative?.id);
    const next = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : mockNarratives[Math.floor(Math.random() * mockNarratives.length)];
    setCurrentNarrative(next);
  };

  const getEmotionName = (emotion: Emotion): string => {
    const emotionMap: Record<Emotion, string> = {
      happy: 'Senang',
      sad: 'Sedih',
      angry: 'Marah',
      envy: 'Iri',
      embarrassed: 'Malu',
      fear: 'Takut'
    };
    return emotionMap[emotion];
  };

  if (!currentNarrative) return <MainLayout><div className="text-center p-8">Memuat cerita...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Belajar Emosi</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm px-4 py-2 rounded-full bg-sky-100 text-sky-800 hover:bg-sky-200"
          >
            {showGuide ? 'Sembunyikan Panduan Emosi' : 'Tampilkan Panduan Emosi'}
          </button>
        </div>

        {showGuide && (
          <Card className="mb-6 bg-yellow-50 border-l-4 border-yellow-400">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3">Petunjuk Emosi</h2>
            <p className="text-sm text-gray-700 mb-3">Cerita ini mungkin mengandung emosi berikut. Yuk dikenali!</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {["happy", "sad", "angry", "envy", "embarrassed", "fear"].map((key) => (
                <div key={key} className="flex flex-col items-center space-y-2 bg-white p-3 rounded-lg shadow-sm">
                  <img src={`/src/img/${key}.svg`} alt={key} className="w-12 h-12" />
                  <span className="text-md font-medium text-gray-700">{getEmotionName(key as Emotion)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Cerita */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Cerita</h2>
          <p className="text-lg leading-relaxed mb-4 text-gray-800 bg-sky-50 p-6 rounded-xl border-l-4 border-sky-500">
            {currentNarrative.text}
          </p>
          <p className="text-sky-700 font-medium">
            Apa emosi yang ada dalam cerita di atas? Tuliskan jawabanmu.
          </p>
        </Card>

        {/* Jawaban / Hasil */}
        {!result ? (
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Jawabanmu</h2>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[120px]"
              placeholder="Ceritakan emosi apa yang kamu dapatkan dari cerita tersebut..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            ></textarea>
            <div className="flex flex-col sm:flex-row justify-between mt-4">
              <Button variant="outline" className="mb-4 sm:mb-0" onClick={toggleRecording}>
                <Mic className={`w-5 h-5 mr-2 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                {isRecording ? 'Mendengarkan...' : 'Gunakan Suara'}
              </Button>
              <Button onClick={handleSubmitAnswer} disabled={isProcessing || !userAnswer.trim()}>
                {isProcessing ? 'Memproses...' : 'Kirim Jawaban'}
                {!isProcessing && <Send className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Hasil</h2>
            <div className={`p-6 rounded-xl mb-6 ${
              result.isCorrect ? 'bg-green-50 border-l-4 border-green-500' :
              result.isPartial ? 'bg-yellow-50 border-l-4 border-yellow-500' :
              'bg-red-50 border-l-4 border-red-500'
            }`}>
              <p className="text-lg font-medium mb-2">{result.feedback}</p>
              <div className="mt-4">
                <p className="font-medium">Emosi yang terdeteksi:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.predictedEmotions.map((emotion, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full text-sm ${
                      currentNarrative.expectedEmotions.includes(emotion)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'}`}>
                      {getEmotionName(emotion)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="font-medium">Emosi yang diharapkan:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentNarrative.expectedEmotions.map((emotion, i) => (
                    <span key={i} className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm">
                      {getEmotionName(emotion)}
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
              <Button onClick={handleNextNarrative}>Cerita Berikutnya</Button>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Learn;
