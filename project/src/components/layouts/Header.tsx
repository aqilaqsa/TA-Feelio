import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="bg-sky-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <Smile className="w-10 h-10 mr-2" />
          <span className="text-2xl font-bold">Feelio</span>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <button 
                onClick={() => navigate('/dashboard')}
                className="hover:text-yellow-300 transition-colors"
              >
                Beranda
              </button>
              <button 
                onClick={() => navigate('/learn')}
                className="hover:text-yellow-300 transition-colors"
              >
                Belajar
              </button>
              <button 
                onClick={() => navigate('/achievements')}
                className="hover:text-yellow-300 transition-colors"
              >
                Prestasi
              </button>
              <Button 
                variant="accent" 
                size="sm"
                onClick={handleLogout}
              >
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/login')}
                className="border-white text-white hover:bg-white hover:text-sky-600"
              >
                Masuk
              </Button>
              <Button 
                variant="accent" 
                size="sm"
                onClick={() => navigate('/signup')}
              >
                Daftar
              </Button>
            </>
          )}
        </nav>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-sky-700 rounded-lg p-4 absolute top-16 right-4 z-50 shadow-lg">
          <nav className="flex flex-col space-y-3">
            {user ? (
              <>
                <button 
                  onClick={() => navigateTo('/dashboard')}
                  className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                >
                  Beranda
                </button>
                <button 
                  onClick={() => navigateTo('/learn')}
                  className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                >
                  Belajar
                </button>
                <button 
                  onClick={() => navigateTo('/achievements')}
                  className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                >
                  Prestasi
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-left py-2 px-4 bg-yellow-400 text-gray-900 rounded-lg"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigateTo('/login')}
                  className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => navigateTo('/signup')}
                  className="text-left py-2 px-4 bg-yellow-400 text-gray-900 rounded-lg"
                >
                  Daftar
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;