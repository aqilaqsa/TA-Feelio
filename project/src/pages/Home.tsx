import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import Button from "../components/ui/Button";
import { Smile, Brain, Award, Heart } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sky-700 to-sky-500 text-white py-16 md:py-16">
        <div className="container mx-24 px-6 flex flex-col md:flex-row items-center">
          <div className="bg-transparent rounded-2xl text-center">
            <img
              src="/src/img/mascot.png"
              alt="Feelio Mascot"
              className="w-80 h-80 mx-auto mr-20"
            />
          </div>
          <div className="md:w-2/3 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-5xl font-bold leading-tight">
              Belajar Mengenali Emosi bersama
            </h1>
            <h1 className="text-5xl md:text-5xl font-extrabold mb-6 leading-tight text-red-200">
              Feelio!
            </h1>
            <p className="text-xl mb-8 mr-16 text-white">
              Aplikasi edukatif yang membantu anak-anak umur 7-12 tahun memahami
              dan mengelola emosi mereka dengan cara yang menyenangkan.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                variant="accent"
                onClick={() => navigate("/signup")}
              >
                Mulai Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-sky-600"
                onClick={() => navigate("/login")}
              >
                Masuk
              </Button>
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

          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div className="bg-sky-50 rounded-2xl p-6 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-sky-700">
                Pembelajaran Interaktif
              </h3>
              <p className="text-gray-600">
                Belajar tentang emosi melalui cerita menarik dan pertanyaan
                interaktif.
              </p>
            </div>

            <div className="bg-sky-50 rounded-2xl p-6 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-sky-700">
                Sistem Penghargaan
              </h3>
              <p className="text-gray-600">
                Dapatkan skor dan lencana yang menarik setiap kali menyelesaikan
                tantangan.
              </p>
            </div>

            <div className="bg-sky-50 rounded-2xl p-6 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-sky-700">
                Umpan Balik Personal
              </h3>
              <p className="text-gray-600">
                Dapatkan umpan balik yang disesuaikan untuk membantu pemahaman
                emosi.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Panduan Penggunaan Section */}
      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Panduan Penggunaan
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-md text-lg text-gray-700 space-y-6">
            <div>
              <h3 className="font-bold text-xl text-sky-700 mb-2">
                🎯 Tujuan Aplikasi
              </h3>
              <p className="text-justify px-9">
                Feelio dirancang sebagai alat bantu ajar untuk anak-anak usia
                dasar dalam memahami dan mengelola emosi mereka melalui cerita,
                tantangan, dan umpan balik personal yang menyenangkan.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl text-sky-700 mb-2">
                👶 Segmen Usia
              </h3>
              <ul className="list-disc list-inside text-justify px-9">
                <li>
                  <strong>7–9 tahun:</strong> Fokus pada mengenali emosi dasar
                  melalui cerita.
                </li>
                <li>
                  <strong>10–12 tahun:</strong> Mengenali emosi dan mengasah
                  kemampuan menghadapi situasi.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl text-sky-700 mb-2">
                📚 Alur Penggunaan
              </h3>
              <ol className="list-decimal list-inside text-justify">
                <li>Pendamping membuat akun baru.</li>
                <li>
                  Pendamping membuatkan akun anak dan memilih segmen usia.
                </li>
                <li>
                  Anak bisa masuk ke akun mereka sendiri dengan catatan
                  pendamping menyimpan kredensial akun anak. Untuk anak usia 7-9
                  tahun dan anak autis perlu pendampingan orang dewasa.
                </li>
                <li>
                  Anak menjawab pertanyaan di fitur "Belajar". Apabila sistem
                  memprediksi jawaban dengan salah, anak/pendamping bisa
                  menandai jawaban tersebut untuk direview melalui akun
                  pendamping.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold text-xl text-sky-700 mb-2">
                🏆 Sistem Penghargaan
              </h3>
              <p className="text-justify">
                Pengguna mengumpulkan poin berdasarkan jawaban benar dan bisa
                memperoleh lencana dan kucing berdasarkan pencapaian seperti
                total skor, emosi yang dikenali, dan banyaknya cerita
                diselesaikan.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl text-sky-700 mb-2">
                👨‍👩‍👧 Untuk Pendamping
              </h3>
              <p className="text-justify">
                Pendamping dapat masuk melalui akun khusus untuk melihat jawaban
                anak, skor, dan menandai ulang cerita untuk diulang. Juga bisa
                melihat pertanyaan yang ditandai sebagai kurang tepat oleh anak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni & Validasi Section */}
      <section className="py-16 bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🧩 Soal Dirancang Berdasarkan Aspek SEL
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-justify mb-14">
            Feelio mengacu pada 5 aspek utama dalam Social-Emotional Learning
            (SEL) untuk membentuk pembelajaran yang holistik. Setiap cerita dan
            tantangan dirancang agar anak dapat memahami, mengenali, dan
            mengelola emosinya secara utuh.
          </p>
          <div className="flex flex-col md:flex-row items-start mt-12 mr-24">
            <div className="md:w-1/2 w-full flex justify-center">
              <img
                src="/img/SEL.png"
                alt="Diagram Aspek SEL"
                className="w-96"
              />
            </div>
            <div className="space-y-3">
              <details className="bg-sky-50 p-5 rounded-lg border-l-4 border-sky-400">
                <summary className="text-md font-semibold text-sky-700 cursor-pointer">
                  🤔 Self-Awareness (Kesadaran Diri)
                </summary>
                <p className="mt-2 text-gray-700">
                  Kemampuan mengenali emosi sendiri, kelebihan, kekurangan,
                  serta kepercayaan diri.
                </p>
              </details>

              <details className="bg-sky-50 p-5 rounded-lg border-l-4 border-sky-400">
                <summary className="text-md font-semibold text-sky-700 cursor-pointer">
                  🎯 Self-Management (Manajemen Diri)
                </summary>
                <p className="mt-2 text-gray-700">
                  Mengelola stres, mengontrol impuls, dan menetapkan tujuan
                  secara positif.
                </p>
              </details>

              <details className="bg-sky-50 p-5 rounded-lg border-l-4 border-sky-400">
                <summary className="text-md font-semibold text-sky-700 cursor-pointer">
                  🧠 Responsible Decision-Making (Pengambilan Keputusan
                  Bertanggung Jawab)
                </summary>
                <p className="mt-2 text-gray-700">
                  Membuat keputusan yang konstruktif dan etis tentang perilaku
                  pribadi dan sosial.
                </p>
              </details>

              <details className="bg-sky-50 p-5 rounded-lg border-l-4 border-sky-400">
                <summary className="text-md font-semibold text-sky-700 cursor-pointer">
                  💞 Social Awareness (Kesadaran Sosial)
                </summary>
                <p className="mt-2 text-gray-700">
                  Memahami perspektif orang lain, menunjukkan empati, dan
                  menghargai keberagaman.
                </p>
              </details>

              <details className="bg-sky-50 p-5 rounded-lg border-l-4 border-sky-400">
                <summary className="text-md font-semibold text-sky-700 cursor-pointer">
                  🤝 Relationship Skills (Keterampilan Relasi)
                </summary>
                <p className="mt-2 text-gray-700">
                  Menjalin dan mempertahankan hubungan sehat, bekerja sama, dan
                  menyelesaikan konflik secara positif.
                </p>
              </details>
            </div>
          </div>
          <div className="inline-block bg-green-100 text-green-800 text-xl px-4 py-2 rounded-full mt-14 mb-8 font-semibold">
            ✅ Telah Divalidasi oleh Psikolog Anak
          </div>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto text-justify mb-2">
            Feelio dikembangkan dengan masukan dari Psikolog Klinis Anak &
            Remaja dengan pengalaman 5 tahun di bidang terkait,{" "}
            <strong>Angel Mikha Clara Sepang, S.Psi, M.Psi.</strong> Materi dan
            pendekatan interaktifnya telah disesuaikan dengan panduan
            pembelajaran sosial-emosional. Terdapat fitur tambahan yang
            dirancang untuk memudahkan anak dalam menggunakan sistem. Pemilihan
            font, warna, dan fitur gamifikasi juga dibuat untuk pengalaman
            belajar yang menyenangkan.
          </p>
        </div>
      </section>

      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Apa Kata Mereka?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-lg text-gray-700 italic mb-4">
                “Anak saya jadi lebih terbuka tentang perasaannya setelah rutin
                bermain di Feelio. Ceritanya mudah dipahami, dan anak jadi lebih
                percaya diri mengekspresikan emosi.”
              </p>
              <p className="font-bold text-sky-700">
                — Ibu Marsha, Ibu pengguna dengan anak berumur 7 tahun
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-lg text-gray-700 italic mb-4">
                “Feelio membantu anak kami mengelola emosi marah dan cemas.
                Fitur lencananya memotivasi anak untuk belajar terus tanpa
                merasa dipaksa.”
              </p>
              <p className="font-bold text-sky-700">
                — Ibu Febie, Ibu pengguna dengan anak berumur 10 dan 12 tahun
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
