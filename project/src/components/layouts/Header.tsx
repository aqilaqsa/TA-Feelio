import React from "react";
import { useNavigate } from "react-router-dom";
import { Smile, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Header: React.FC = () => {
  const { user, logout, isImpersonating, impersonator, returnToPendamping } =
    useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    window.location.href = "/login";
  };

  const handleReturnToPendamping = () => {
    returnToPendamping(navigate); // 👈 pass navigate to fix the bug
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="bg-sky-700 text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Smile className="w-10 h-10 mr-2" />
          <span className="text-2xl font-bold">Feelio</span>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              {user.role === "kid" && (
                <>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-yellow-300 transition-colors text-lg"
                  >
                    Beranda
                  </button>
                  <button
                    onClick={() => navigate("/learn")}
                    className="hover:text-yellow-300 transition-colors text-lg"
                  >
                    Belajar
                  </button>
                  <button
                    onClick={() => navigate("/achievements")}
                    className="hover:text-yellow-300 transition-colors text-lg"
                  >
                    Prestasi
                  </button>
                  {(user.role !== "kid" || isImpersonating) && (
                    <button
                      onClick={() => navigate("/statistics")}
                      className="hover:text-yellow-300 transition-colors text-lg"
                    >
                      Statistik
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/playground")}
                    className="hover:text-yellow-300 transition-colors text-lg"
                  >
                    Playground
                  </button>
                </>
              )}
              {user.role === "pendamping" && (
                <button
                  onClick={() => navigate("/pendamping")}
                  className="hover:text-yellow-300 transition-colors text-lg"
                >
                  Dashboard
                </button>
              )}
              <Button variant="accent" size="sm" onClick={handleLogout}>
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/login")}
                className="border-white text-white hover:bg-white hover:text-sky-600"
              >
                Masuk
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => navigate("/signup")}
              >
                Daftar
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* 🔁 Impersonation Banner */}
      {isImpersonating && impersonator && (
        <div className="bg-yellow-100 text-yellow-800 text-sm py-2 px-4 mt-2 rounded-md flex justify-between items-center container mx-auto">
          <span>
            🔒 Sedang login sebagai anak. Pendamping:{" "}
            <strong>{impersonator.name}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReturnToPendamping}
          >
            Kembali sebagai Pendamping
          </Button>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden mt-4 bg-sky-700 rounded-lg p-4 absolute top-16 right-4 z-50 shadow-lg">
          <nav className="flex flex-col space-y-3">
            {user ? (
              <>
                {user.role === "kid" && (
                  <>
                    <button
                      onClick={() => navigateTo("/dashboard")}
                      className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                    >
                      Beranda
                    </button>
                    <button
                      onClick={() => navigateTo("/learn")}
                      className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                    >
                      Belajar
                    </button>
                    <button
                      onClick={() => navigateTo("/achievements")}
                      className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                    >
                      Prestasi
                    </button>
                    {(user.role !== "kid" || isImpersonating) && (
                      <button
                        onClick={() => navigateTo("/statistics")}
                        className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                      >
                        Statistik
                      </button>
                    )}
                    <button
                      onClick={() => navigateTo("/playground")}
                      className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                    >
                      Playground
                    </button>
                  </>
                )}
                {user.role === "pendamping" && (
                  <button
                    onClick={() => navigateTo("/pendamping")}
                    className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                  >
                    Dashboard
                  </button>
                )}
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
                  onClick={() => navigateTo("/login")}
                  className="text-left py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigateTo("/signup")}
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
