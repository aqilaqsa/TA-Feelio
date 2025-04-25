import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, Trophy, BarChart2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // This will be handled by ProtectedRoute
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Halo, {user.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Selamat datang kembali di Feelio. Ayo lanjutkan petualanganmu belajar emosi!
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-yellow-100 rounded-xl p-3 flex items-center">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="font-bold text-gray-800">{user.totalScore} Poin</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-sky-500 to-sky-700 text-white hover:shadow-lg transform transition-all hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              Mulai Pembelajaran
            </h3>
            <p className="mb-6">
              Belajar mengenali emosi melalui cerita dan skenario interaktif.
            </p>
            <Button 
              variant="accent" 
              onClick={() => navigate('/learn')}
            >
              Mulai Belajar
            </Button>
          </Card>
          
          <Card className="bg-gradient-to-br from-teal-500 to-teal-700 text-white hover:shadow-lg transform transition-all hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2" />
              Pencapaianmu
            </h3>
            <p className="mb-6">
              Lihat semua lencana dan prestasi yang telah kamu dapatkan.
            </p>
            <Button 
              variant="accent" 
              onClick={() => navigate('/achievements')}
            >
              Lihat Pencapaian
            </Button>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:shadow-lg transform transition-all hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <BarChart2 className="w-6 h-6 mr-2" />
              Statistik Belajar
            </h3>
            <p className="mb-6">
              Lihat kemajuan belajarmu dan area yang perlu ditingkatkan.
            </p>
            <Button 
              variant="accent"
              onClick={() => navigate('/statistics')}
            >
              Lihat Statistik
            </Button>
          </Card>
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Kemajuan Terbaru</h2>
          
          <div className="space-y-4">
            {/* This would be dynamically generated based on user's recent activity */}
            <div className="flex items-center p-4 bg-sky-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center mr-4">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Mengenali Emosi Marah</h4>
                <p className="text-sm text-gray-600">Selesai 3 hari yang lalu</p>
              </div>
              <span className="bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full">
                +15 poin
              </span>
            </div>
            
            <div className="flex items-center p-4 bg-sky-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center mr-4">
                <Award className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Mendapatkan Lencana "Pemula Emosi"</h4>
                <p className="text-sm text-gray-600">Selesai 5 hari yang lalu</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-sm py-1 px-3 rounded-full">
                Lencana
              </span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              variant="outline"
              onClick={() => navigate('/history')}
            >
              Lihat Semua Aktivitas
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;