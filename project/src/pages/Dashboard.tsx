import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Award, BookOpen, Trophy, BarChart2 } from "lucide-react";

const API = import.meta.env.VITE_API_BASE;

interface Activity {
  id: string;
  narrative_id: string;
  user_answer: string;
  is_correct: boolean;
  feedback: string;
  created_at: string;
  score: number;
  narrative?: {
    content: string;
    title?: string;
    image_path?: string;
  };
}

const Dashboard: React.FC = () => {
  const { user, isImpersonating } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      const [responsesRes, statsRes] = await Promise.all([
        fetch(`${API}/user/${user.id}/responses?limit=3`),
        fetch(`${API}/user/${user.id}/stats`),
      ]);

      const responseData = await responsesRes.json();
      const statsData = await statsRes.json();

      setActivities(responseData);
      setScore(statsData.total_score || 0);
    };

    fetchDashboardData();
  }, [user]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center mb-10">
          <div>
            <img
              src="/src/img/greet.png"
              alt="Feelio Mascot"
              className="w-40 h-40 mr-5"
            />
          </div>
          <div>
            <h1 className="text-4xl md:text-4xl font-bold text-gray-800">
              Halo, {user.name}!
            </h1>
            <p className="text-xl text-gray-800 mt-2">
              Selamat datang kembali di Feelio. Ayo lanjutkan petualanganmu
              belajar emosi!
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-yellow-100 rounded-xl p-4 ml-auto flex items-center">
            <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
            <span className="font-bold text-lg text-gray-800">
              Kamu punya: {score} Poin!
            </span>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            user.role !== "kid" || isImpersonating
              ? "lg:grid-cols-3"
              : "lg:grid-cols-2"
          } gap-8 mb-12`}
        >
          <Card className="bg-gradient-to-br from-sky-500 to-sky-700 text-white hover:shadow-lg transform transition-all hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <BookOpen className="w-8 h-8 mr-4" />
              Mulai Pembelajaran
            </h3>
            <p className="text-lg mb-6">
              Belajar mengenali emosi melalui cerita dan skenario interaktif.
            </p>
            <Button variant="accent" onClick={() => navigate("/learn")}>
              Mulai Belajar
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-700 text-white hover:shadow-lg transform transition-all hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <Award className="w-8 h-8 mr-4" />
              Pencapaianmu
            </h3>
            <p className="text-lg mb-6">
              Lihat semua lencana dan prestasi yang telah kamu dapatkan.
            </p>
            <Button variant="accent" onClick={() => navigate("/achievements")}>
              Lihat Pencapaian
            </Button>
          </Card>

          {(user.role !== "kid" || isImpersonating) && (
            <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:shadow-lg transform transition-all hover:-translate-y-1">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <BarChart2 className="w-8 h-8 mr-4" />
                Statistik Belajar
              </h3>
              <p className="text-lg mb-6">
                Lihat kemajuan belajarmu dan area yang perlu ditingkatkan.
              </p>
              <Button variant="accent" onClick={() => navigate("/statistics")}>
                Lihat Statistik
              </Button>
            </Card>
          )}
        </div>

        {/* Playground Card */}

        <Card className="mb-12 bg-gradient-to-br from-pink-300 to-pink-500 text-white hover:shadow-lg transform transition-all hover:-translate-y-1">
          <h3 className="text-2xl font-bold mb-4 flex justify-center items-center">
            🐱 Playground!
          </h3>
          <p className="text-lg mb-6 flex justify-center">
            Lihat kucing-kucing yang kamu miliki berdasarkan poinmu!
          </p>
          <div className="flex justify-center">
            <Button variant="accent" onClick={() => navigate("/playground")}>
              Kunjungi Playground
            </Button>
          </div>
        </Card>

        <div className="relative bg-yarn-pattern bg-repeat rounded-3xl overflow-hidden p-6">
          {/* White fog overlay */}
          <div className="absolute inset-0 bg-white/80 z-0" />

          {/* Foreground content */}
          <div className="relative z-10">
            <div className="flex justify-center">
              <img
                src="/src/img/2cats.png"
                alt="Feelio Cats"
                className="w-90 h-60"
              />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800 flex justify-center">
              Kemajuan Terbaru
            </h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-4 bg-sky-50 rounded-xl border-l-4 border-sky-400 shadow-md"
                >
                  <div className="w-16 h-16 rounded-full bg-sky-200 flex items-center justify-center mr-4">
                    <BookOpen className="w-8 h-8 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2 text-lg">
                      Cerita: {activity.narrative_id}
                    </h4>
                    {activity.narrative?.content && (
                      <p className="text-lg text-base text-gray-800 mb-2 italic">
                        "{activity.narrative.content}"
                      </p>
                    )}
                    <p className="text-base text-gray-500">
                      Dijawab: {formatDate(activity.created_at)}
                    </p>
                  </div>
                  <span className="text-md bg-green-100 text-green-800 text-base font-semibold py-1 px-3 rounded-full">
                    +{activity.score} poin
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="text-lg px-6 py-3"
                onClick={() => navigate("/statistics")}
              >
                Lihat Semua Aktivitas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
