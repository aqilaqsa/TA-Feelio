import React from 'react';
import { Heart, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sky-800 text-white py-8 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-2">Feelio</h2>
            <p className="text-sky-200 text-lg">
              Belajar memahami emosi menjadi lebih menyenangkan
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-yellow-300 text-lg" />
              <span>kontak@feelio.id</span>
            </div>
            <p className="flex items-center justify-center md:justify-end mt-4 text-lg text-sky-200">
              Dibuat dengan <Heart className="w-4 h-4 mx-1 text-red-400" /> untuk anak-anak Indonesia
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-sky-700 text-center text-md text-sky-300">
          &copy; {new Date().getFullYear()} Tugas Akhir Aqila Aqsa: Feelio
        </div>
      </div>
    </footer>
  );
};

export default Footer;