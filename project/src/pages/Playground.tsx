import React, { useEffect, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_BASE;

const generateNonOverlappingPositions = (count: number) => {
  const positions: { top: string; left: string }[] = [];

  const isTooClose = (a: any, b: any) => {
    const at = parseFloat(a.top);
    const al = parseFloat(a.left);
    const bt = parseFloat(b.top);
    const bl = parseFloat(b.left);
    return Math.abs(at - bt) < 10 && Math.abs(al - bl) < 10;
  };

  while (positions.length < count) {
    const newPos = {
      top: (Math.random() * 70 + 10).toFixed(2) + "%",
      left: (Math.random() * 80 + 10).toFixed(2) + "%",
    };

    if (!positions.some((p) => isTooClose(p, newPos))) {
      positions.push(newPos);
    }
  }

  return positions;
};

const Cat: React.FC<{ id: number; position: { top: string; left: string } }> = ({
  id,
  position,
}) => {
  return (
    <motion.img
      src={`/img/cats/cat${(id % 10) + 1}.gif`}
      alt={`Cat ${id + 1}`}
      className="absolute w-24 h-24"
      style={position}
      animate={{ y: [0, -1, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    />
  );
};

const Playground: React.FC = () => {
  const { user } = useAuth();
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API}/user/${user.id}/summary`);
        const data = await res.json();
        setTotalScore(data.total_score || 0);
      } catch (err) {
        console.error("❌ Error fetching score:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [user]);

  const catCount = Math.min(Math.floor(totalScore / 50), 10);
  const positions = generateNonOverlappingPositions(catCount);

  return (
    <MainLayout>
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="w-full h-screen bg-[url('/img/playground-bg.png')] bg-no-repeat bg-center bg-cover">
          <div className="w-full h-full relative flex items-center justify-center">
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-gray-800 px-4 py-3 rounded-xl shadow-lg text-xl">
              <p className="font-bold">🐾 Halo, {user?.name || "Teman"}!</p>
              <p>
                Total Poin: <span className="font-semibold">{totalScore}</span>
              </p>
              <p>
                Kucing Dimiliki:{" "}
                <span className="font-semibold">{catCount}</span> / 10
              </p>
            </div>

            {loading ? (
              <p className="text-gray-800 text-center text-xl">
                Memuat kucing...
              </p>
            ) : (
              <>
                {positions.map((pos, i) => (
                  <Cat key={i} id={i} position={pos} />
                ))}
                {catCount === 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-100 text-gray-800 px-6 py-4 rounded-xl text-xl shadow-lg text-center max-w-md">
                    Dapatkan poin untuk mengundang kucing bermain di taman ini!
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Playground;
