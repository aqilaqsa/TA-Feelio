import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Button from '../components/ui/Button';
import { Smile, Brain, Award, Heart } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sky-700 to-sky-500 text-white py-16 md:py-24">
        <div className="container mx-24 px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Belajar Mengenali Emosi bersama Feelio!
            </h1>
            <p className="text-xl mb-8 text-sky-100">
              Aplikasi edukatif yang membantu anak-anak umur 7-12 tahun memahami dan mengelola emosi mereka dengan cara yang menyenangkan.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                variant="accent"
                onClick={() => navigate('/signup')}
              >
                Mulai Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-sky-600"
                onClick={() => navigate('/login')}
              >
                Masuk
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-64 h-64 bg-yellow-400 rounded-full flex items-center justify-center">
              <Smile className="w-40 h-40 text-sky-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Fitur Utama Feelio
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-sky-50 rounded-2xl p-6 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-sky-700">Pembelajaran Interaktif</h3>
              <p className="text-gray-600">
                Belajar tentang emosi melalui cerita menarik dan pertanyaan interaktif.
              </p>
            </div>
            
            <div className="bg-sky-50 rounded-2xl p-6 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-sky-700">Sistem Penghargaan</h3>
              <p className="text-gray-600">
                Dapatkan skor dan lencana yang menarik setiap kali menyelesaikan tantangan.
              </p>
            </div>
            
            <div className="bg-sky-50 rounded-2xl p-6 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-sky-700">Umpan Balik Personal</h3>
              <p className="text-gray-600">
                Dapatkan umpan balik yang disesuaikan untuk membantu pemahaman emosi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;