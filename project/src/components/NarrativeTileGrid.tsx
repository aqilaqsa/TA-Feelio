import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, X } from "lucide-react";
import ConfirmPINModal from "./modals/ConfirmPINModal";

const API = import.meta.env.VITE_API_BASE;

interface TileData {
  id: number;
  narrative_id: string;
  is_correct: boolean;
  repeatable: boolean;
  flagged: boolean;
  user_answer: string;
  feedback: string;
  predicted_emotion: string[];
  expected_emotions: string[];
  narrative_text: string;
  created_at: string;
}

const NarrativeTileGrid: React.FC = () => {
  const { user } = useAuth();
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const refetchTiles = async () => {
    if (!user) return;
    const res = await fetch(`${API}/user/${user.id}/responses`);
    const data = await res.json();

    const latest = data.reduce((acc, item) => {
      const existing = acc[item.narrative_id];
      const isNewer =
        !existing || new Date(item.created_at) > new Date(existing.created_at);
      if (isNewer) acc[item.narrative_id] = item;
      return acc;
    }, {} as Record<string, TileData>);

    setTiles(Object.values(latest));
    setSelectedTile(null);
  };

  useEffect(() => {
    refetchTiles();
  }, [user]);

  const openPINModal = (action: () => Promise<void>) => {
    setPendingAction(() => action);
    setPinModalOpen(true);
    setPinError("");
  };

  const handlePINSubmit = async (pin: string) => {
    setPinError(""); // Clear any previous error
    const res = await fetch(`${API}/user/${user?.id}/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pin }),
    });

    const data = await res.json();
    if (data.valid) {
      setPinModalOpen(false);
      alert("✅ PIN benar. Aksi berhasil.");
      if (pendingAction) await pendingAction();
    } else {
      setPinError("❌ PIN salah. Coba lagi.");
    }
  };

  const handleMarkCorrect = (id: number) => {
    openPINModal(async () => {
      await Promise.all([
        fetch(`${API}/responses/${id}/override-correct`, { method: "PATCH" }),
        fetch(`${API}/responses/${id}/unflag`, { method: "PATCH" }),
      ]);
      await refetchTiles();
    });
  };

  const handleMarkIncorrect = (id: number) => {
    openPINModal(async () => {
      await Promise.all([
        fetch(`${API}/responses/${id}/override-incorrect`, { method: "PATCH" }),
        fetch(`${API}/responses/${id}/unflag`, { method: "PATCH" }),
      ]);
      await refetchTiles();
    });
  };

  const handleMarkRepeatable = async (id: number) => {
    await fetch(`${API}/responses/${id}/mark-repeatable`, { method: "PATCH" });
    await refetchTiles();
  };

  const handleUnmarkRepeatable = async (id: number) => {
    await fetch(`${API}/responses/${id}/unmark-repeatable`, {
      method: "PATCH",
    });
    await refetchTiles();
  };

  const renderTileColor = (narrative_id: string) => {
    const match = tiles.find((t) => t.narrative_id === narrative_id);
    let base = "bg-white border-sky-400";

    if (match) {
      base = match.is_correct
        ? "bg-green-200 border-green-400"
        : "bg-red-300 border-red-500";

      if (match.flagged) {
        base += " ring-4 ring-yellow-400";
      }
    }

    return `shadow-sm border-l-4 ${base}`;
  };

  const narrativeIds = Array.from({ length: 50 }, (_, i) =>
    user?.segment === "7-9" ? `A${i + 1}` : `B${i + 1}`
  );

  const emotionMap: Record<string, string> = {
    happy: "Senang",
    sad: "Sedih",
    angry: "Marah",
    embarrassed: "Malu",
    fear: "Takut",
    envy: "Iri",
  };

  const renderEmotions = (emotions: string[]) => (
    <div className="flex flex-wrap gap-2 mt-1">
      {emotions.map((e, i) => (
        <span
          key={i}
          className="px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-800"
        >
          {emotionMap[e] || e}
        </span>
      ))}
    </div>
  );

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Cerita</h2>
      <div className="grid grid-cols-5 gap-4">
        {narrativeIds.map((id) => {
          const match = tiles.find((t) => t.narrative_id === id);
          return (
            <div key={id}>
              <button
                className={`w-full text-center py-2 rounded font-semibold relative ${renderTileColor(
                  id
                )}`}
                onClick={() => match && setSelectedTile(match)}
              >
                {id}
                {match?.flagged && (
                  <span className="absolute top-1 right-1 text-yellow-500 text-lg">
                    🚩
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedTile && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl max-w-3xl w-full relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
                onClick={() => setSelectedTile(null)}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <h3
                  className={`text-xl font-bold mb-2 px-4 py-2 rounded text-white inline-block ${
                    selectedTile.is_correct ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  Cerita: {selectedTile.narrative_id}
                </h3>
                {selectedTile.flagged && (
                  <div className="text-yellow-700 bg-yellow-100 px-3 py-1 rounded font-medium mt-2 flex justify-center">
                    🚩 Jawaban ini ditandai untuk direview
                  </div>
                )}
              </div>

              <p className="text-gray-700 italic mb-3">
                {selectedTile.narrative_text}
              </p>
              <p className="text-gray-700 italic mb-3">
                <strong>Jawaban Anak: </strong>
                {selectedTile.user_answer}
              </p>
              <p className="text-md text-gray-800 mb-1">
                <strong>Kunci Jawaban:</strong>
              </p>
              {renderEmotions(selectedTile.expected_emotions)}
              <p className="text-md text-gray-800 mt-3 mb-1">
                <strong>Prediksi Model:</strong>
              </p>
              {renderEmotions(selectedTile.predicted_emotion)}

              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {!selectedTile.is_correct && (
                  <Button
                    variant="nice"
                    onClick={() => handleMarkCorrect(selectedTile.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Tandai sebagai
                    Benar
                  </Button>
                )}
                {selectedTile.is_correct && (
                  <Button
                    variant="destructive"
                    onClick={() => handleMarkIncorrect(selectedTile.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Tandai sebagai Salah
                  </Button>
                )}
                {selectedTile.repeatable ? (
                  <Button
                    variant="outline2"
                    onClick={() => handleUnmarkRepeatable(selectedTile.id)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" /> Keluarkan dari Daftar
                    Soal Belajar
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleMarkRepeatable(selectedTile.id)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" /> Masukkan Kembali ke
                    Daftar Soal Belajar
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {pinModalOpen && (
        <ConfirmPINModal
          onSubmit={handlePINSubmit}
          onCancel={() => setPinModalOpen(false)}
          error={pinError}
        />
      )}
    </div>
  );
};

export default NarrativeTileGrid;
