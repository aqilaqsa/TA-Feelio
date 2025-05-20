import React, { useEffect, useState } from "react";
import NarrativeTileGrid from "../components/NarrativeTileGrid.tsx";
import MainLayout from "../components/layouts/MainLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BookOpen } from "lucide-react";

const API = import.meta.env.VITE_API_BASE;

interface EmotionStat {
  emotion: string;
  correct: number;
  total: number;
}

interface ResponseRecord {
  id: string;
  narrative_id: string;
  user_answer: string;
  predicted_emotion: string[];
  is_correct: boolean;
  feedback: string;
  created_at: string;
}

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const [emotionStats, setEmotionStats] = useState<EmotionStat[]>([]);
  const [recentResponses, setRecentResponses] = useState<ResponseRecord[]>([]);
  const [summary, setSummary] = useState<{ total: number; correct: number }>({
    total: 0,
    correct: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const [statRes, recentRes] = await Promise.all([
        fetch(`${API}/user/${user.id}/stats`),
        fetch(`${API}/user/${user.id}/responses?limit=5`),
      ]);

      const statsData = await statRes.json();
      const recentData = await recentRes.json();

      setEmotionStats(statsData.per_emotion);
      setSummary({
        total: statsData.total_attempted,
        correct: statsData.total_correct,
      });
      setRecentResponses(recentData);
    };

    fetchStats();
  }, [user]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Statistik Belajar
        </h1>

        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Ringkasan Kemajuan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-sky-600">{summary.total}</p>
              <p className="text-lg text-gray-700 mt-1">Total Cerita Dijawab</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {summary.correct}
              </p>
              <p className="text-lg text-gray-700 mt-1">Jawaban Benar</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-yellow-600">
                {summary.total > 0
                  ? Math.round((summary.correct / summary.total) * 100)
                  : 0}
                %
              </p>
              <p className="text-lg text-gray-700 mt-1">Akurasi</p>
            </div>
          </div>
        </Card>

        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Akurasi Berdasarkan Emosi
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={emotionStats.map((e) => {
                const map: Record<string, string> = {
                  happy: "Senang",
                  sad: "Sedih",
                  angry: "Marah",
                  embarrassed: "Malu",
                  fear: "Takut",
                  envy: "Iri",
                };
                return {
                  name: map[e.emotion] || e.emotion,
                  correct: e.correct,
                  total: e.total,
                };
              })}              
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="correct" fill="#0ea5e9" name="Benar" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <NarrativeTileGrid />

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Aktivitas Terbaru
          </h2>
          <ul className="space-y-4">
            {recentResponses.map((resp) => (
              <li
                key={resp.id}
                className="bg-sky-50 p-4 rounded-xl flex items-start gap-4 border-l-4 border-sky-400"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-sky-200 rounded-full">
                  <BookOpen className="w-8 h-8 text-sky-700" />
                </div>
                <div className="flex-1">
                  <p className="text-md font-medium text-gray-800 mb-1">
                    Cerita ID: {resp.narrative_id}
                  </p>
                  {resp.narrative?.content && (
                    <p className="text-md text-gray-600 mb-1 italic">
                      "{resp.narrative.content}"
                    </p>
                  )}

                  <p className="text-md mt-1 text-gray-600">
                    Jawaban: <em>{resp.user_answer}</em>
                  </p>
                  <p className="text-md mt-1 text-gray-600">
                    Feedback: {resp.feedback}
                  </p>
                  <p className="text-sm mt-1 text-gray-500">
                    {formatDate(resp.created_at)}
                  </p>
                </div>
                <span
                  className={`text-md px-3 py-1 rounded-full ${
                    resp.is_correct
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {resp.is_correct ? "Benar" : "Salah"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Statistics;
