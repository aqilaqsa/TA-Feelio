import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { Award, Star, Target, Brain, Heart, Smile } from 'lucide-react';
import { Badge } from '../types';

// Mock badges data
const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Pemula Emosi',
    description: 'Menyelesaikan 5 sesi pembelajaran pertama',
    imageSrc: 'badge-beginner',
  },
  {
    id: '2',
    name: 'Pelacak Perasaan',
    description: 'Berhasil mengidentifikasi 10 emosi dengan benar',
    imageSrc: 'badge-tracker',
  },
  {
    id: '3',
    name: 'Master Empati',
    description: 'Mengenali semua jenis emosi dengan benar',
    imageSrc: 'badge-master',
  }
];

// Mock achievements for the user
const mockUserAchievements = [
  {
    id: '1',
    userId: '1',
    badge: mockBadges[0],
    points: 50,
    dateEarned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: '2',
    userId: '1',
    badge: mockBadges[1],
    points: 100,
    dateEarned: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  }
];

// Mock upcoming badges (not yet achieved)
const mockUpcomingBadges = [mockBadges[2]];

const BadgeIcon: React.FC<{ badgeId: string }> = ({ badgeId }) => {
  switch (badgeId) {
    case '1':
      return <Star className="w-10 h-10 text-yellow-500" />;
    case '2':
      return <Target className="w-10 h-10 text-teal-500" />;
    case '3':
      return <Brain className="w-10 h-10 text-sky-600" />;
    default:
      return <Award className="w-10 h-10 text-blue-500" />;
  }
};

const Achievements: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // This will be handled by ProtectedRoute
  }

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Pencapaianmu
            </h1>
            <p className="text-gray-600 mt-2">
              Lihat semua lencana dan prestasi yang telah kamu kumpulkan!
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-yellow-100 rounded-xl p-3 flex items-center">
            <Award className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="font-bold text-gray-800">Total: {user.totalScore} Poin</span>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mb-10 bg-gradient-to-r from-sky-500 to-sky-700 text-white p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{mockUserAchievements.length}</h3>
              <p>Lencana Diperoleh</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{mockUpcomingBadges.length}</h3>
              <p>Lencana Tersisa</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Smile className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-1">10</h3>
              <p>Sesi Diselesaikan</p>
            </div>
          </div>
        </Card>

        {/* Earned Badges */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Lencana yang Kamu Dapatkan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockUserAchievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow"
              >
                <div className="bg-sky-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <BadgeIcon badgeId={achievement.badge.id} />
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-sky-700">
                  {achievement.badge.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {achievement.badge.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Diperoleh {formatDate(achievement.dateEarned)}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 text-sm py-1 px-3 rounded-full">
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
            {mockUpcomingBadges.map((badge) => (
              <Card 
                key={badge.id}
                className="flex flex-col items-center text-center p-6 bg-gray-50 border border-dashed border-gray-300"
              >
                <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <BadgeIcon badgeId={badge.id} />
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-700">
                  {badge.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {badge.description}
                </p>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">30% selesai</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Achievements;