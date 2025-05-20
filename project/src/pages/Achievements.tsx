import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import {
  Award, Star, Target, Brain, Heart, Smile, Flame, ShieldCheck, Compass,
  Trophy, Sun, Moon, Feather, Puzzle, Lightbulb, Medal, Flag, Gem, BookOpen,
  Rocket, Bolt, Users, Globe, Leaf, Music, Ghost, Cloud, Handshake, Wand
} from 'lucide-react';
import { Badge } from '../types';

const API = import.meta.env.VITE_API_BASE;

const BadgeIcon: React.FC<{ badgeId: number }> = ({ badgeId }) => {
  switch (badgeId) {
    case 1: return <Star className="w-10 h-10 text-yellow-500" />;
    case 2: return <Target className="w-10 h-10 text-teal-500" />;
    case 3: return <Brain className="w-10 h-10 text-sky-600" />;
    case 4: return <Lightbulb className="w-10 h-10 text-amber-500" />;
    case 5: return <Rocket className="w-10 h-10 text-indigo-500" />;
    case 6: return <Feather className="w-10 h-10 text-pink-400" />;
    case 7: return <Heart className="w-10 h-10 text-red-500" />;
    case 8: return <Compass className="w-10 h-10 text-cyan-600" />;
    case 9: return <Flame className="w-10 h-10 text-orange-500" />;
    case 10: return <Smile className="w-10 h-10 text-green-500" />;
    case 11: return <Sun className="w-10 h-10 text-yellow-400" />;
    case 12: return <Moon className="w-10 h-10 text-blue-400" />;
    case 13: return <Leaf className="w-10 h-10 text-lime-600" />;
    case 14: return <Puzzle className="w-10 h-10 text-indigo-700" />;
    case 15: return <Trophy className="w-10 h-10 text-yellow-600" />;
    case 16: return <Handshake className="w-10 h-10 text-emerald-500" />;
    case 17: return <Medal className="w-10 h-10 text-orange-600" />;
    case 18: return <ShieldCheck className="w-10 h-10 text-slate-600" />;
    case 19: return <Bolt className="w-10 h-10 text-purple-500" />;
    case 20: return <BookOpen className="w-10 h-10 text-sky-700" />;
    case 21: return <Wand className="w-10 h-10 text-violet-600" />;
    case 22: return <Cloud className="w-10 h-10 text-gray-400" />;
    case 23: return <Music className="w-10 h-10 text-rose-500" />;
    case 24: return <Users className="w-10 h-10 text-cyan-500" />;
    case 25: return <Globe className="w-10 h-10 text-blue-600" />;
    case 26: return <Ghost className="w-10 h-10 text-indigo-300" />;
    case 27: return <Flag className="w-10 h-10 text-rose-600" />;
    case 28: return <Gem className="w-10 h-10 text-fuchsia-600" />;
    case 29: return <Award className="w-10 h-10 text-yellow-400" />;
    default: return <Award className="w-10 h-10 text-gray-400" />;
  }
};

const Achievements: React.FC = () => {
  const { user } = useAuth();
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);
  const [upcomingBadges, setUpcomingBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<{ total_score: number; total_responses: number }>({
    total_score: 0,
    total_responses: 0
  });

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;

      try {
        const [badgesRes, upcomingRes, statsRes] = await Promise.all([
          fetch(`${API}/user/${user.id}/achievements`),
          fetch(`${API}/user/${user.id}/upcoming-badges`),
          fetch(`${API}/user/${user.id}/summary`)
        ]);

        setEarnedBadges(await badgesRes.json());
        setUpcomingBadges(await upcomingRes.json());
        setStats(await statsRes.json());
      } catch (err) {
        console.error('❌ Failed fetching achievements:', err);
      }
    };

    fetchAll();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between mb-10">
          <div>
            <h1 className="text-4xl md:text-4xl font-bold text-gray-800">Pencapaianmu</h1>
            <p className="text-lg text-gray-600 mt-2">
              Lihat semua lencana dan prestasi yang telah kamu kumpulkan!
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-yellow-100 rounded-xl p-3 flex items-center">
            <Award className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="font-bold text-xl text-gray-800">Total: {stats.total_score} Poin</span>
          </div>
        </div>

        {/* Summary cards */}
        <Card className="mb-10 bg-gradient-to-r from-sky-500 to-sky-700 text-white p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold">{earnedBadges.length}</h3>
              <p className="text-lg">Lencana Diperoleh</p>
            </div>
            <div>
              <div className="bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold">{upcomingBadges.length}</h3>
              <p className="text-lg">Lencana Tersisa</p>
            </div>
            <div>
              <div className="bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Smile className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold">{stats.total_responses}</h3>
              <p className="text-lg">Soal Diselesaikan</p>
            </div>
          </div>
        </Card>

        {/* Earned Badges */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Lencana yang Kamu Dapatkan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((achievement) => (
              <Card key={achievement.id} className="flex flex-col items-center text-center p-6">
                <div className="bg-sky-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <BadgeIcon badgeId={achievement.badge.id} />
                </div>
                <h3 className="text-2xl font-bold text-sky-700">{achievement.badge.name}</h3>
                <p className="text-lg text-gray-600 mb-4">{achievement.badge.description}</p>
                <div className="mt-auto pt-4 border-t w-full">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Diperoleh {formatDate(achievement.dateEarned)}</span>
                    <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full">
                      +{achievement.points} poin
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Badges */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Lencana Berikutnya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBadges.map((badge) => (
              <Card key={badge.id} className="flex flex-col items-center text-center p-6 bg-gray-50 border border-dashed border-gray-300">
                <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <BadgeIcon badgeId={badge.id} />
                </div>
                <h3 className="text-xl font-bold text-gray-700">{badge.name}</h3>
                <p className="text-gray-600 mb-4">{badge.description}</p>
                <p className="text-sm text-gray-500 mt-2">Yuk, Kumpulkan semua!</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Achievements;
