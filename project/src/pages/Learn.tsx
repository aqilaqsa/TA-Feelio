import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Mic, Send, Award } from 'lucide-react';
import { Narrative, Emotion } from '../types';

// Mock narrative data
const mockNarratives: Narrative[] = [
  {
    id: '1',
    text: 'Hari ini Budi mendapatkan nilai bagus di sekolah. Dia tersenyum lebar karena semua usaha belajarnya terbayar.',
    isYoungSegment: true,
    expectedEmotions: ['happy', 'sad'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    text: 'Saat istirahat sekolah, Maya tidak sengaja menumpahkan minumannya ke baju Lisa. Semua teman-teman di sekitar mereka tertawa melihat kejadian itu. Lisa terlihat kesal!',
    isYoungSegment: true,
    expectedEmotions: ['embarrassed', 'angry'],
    createdAt: new Date().toISOString(),
  },
];

// Mock feedback responses
const mockFeedback = {
  correct: [
    'Hebat! Kamu berhasil mengenali emosi dengan tepat!',
    'Wah, kamu sungguh pandai memahami perasaan dalam cerita ini!',
    'Luar biasa! Kamu memiliki pemahaman emosi yang sangat baik!'
  ],
  partial: [
    'Kamu sudah hampir benar! Coba pikirkan apa emosi lain yang mungkin dirasakan dalam situasi ini?',
    'Bagus! Kamu sudah mengenali sebagian emosi dengan tepat. Ada emosi lain yang terlewat?',
    'Kamu di jalur yang benar! Coba perhatikan lagi apa yang terjadi dan rasakan lebih dalam.'
  ],
  incorrect: [
    'Hmm, coba pikirkan lagi. Bagaimana perasaanmu jika berada dalam situasi tersebut?',
    'Belum tepat, tapi tidak apa-apa! Belajar mengenali emosi memang butuh latihan.',
    'Coba bayangkan dirimu berada di posisi itu. Perasaan apa yang akan kamu rasakan?'
  ]
};

const getRandomFeedback = (type: 'correct' | 'partial' | 'incorrect') => {
  const options = mockFeedback[type];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window['webkitSpeechRecognition'];
let recognition: any = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'id-ID';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

const Learn: React.FC = () => {
  const { user } = useAuth();
  const [currentNarrative, setCurrentNarrative] = useState<Narrative | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    predictedEmotions: Emotion[];
    feedback: string;
    score: number;
    isCorrect: boolean;
    isPartial: boolean;
  } | null>(null);

  useEffect(() => {
    // Get a random narrative based on user's segment
    const isYoungSegment = user?.segment === '7-9';
    const relevantNarratives = mockNarratives.filter(n => n.isYoungSegment === isYoungSegment);
    const randomIndex = Math.floor(Math.random() * relevantNarratives.length);
    setCurrentNarrative(relevantNarratives[randomIndex] || mockNarratives[0]);

    // Setup speech recognition event handlers
    if (recognition) {
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserAnswer(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognition && isRecording) {
        recognition.abort();
      }
    };
  }, [user]);

  const toggleRecording = () => {
    if (!recognition) {
      alert('Maaf, browser kamu tidak mendukung fitur speech recognition.');
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      setUserAnswer('');
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      alert('Silakan masukkan jawaban terlebih dahulu');
      return;
    }

    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      if (!currentNarrative) return;

      // Mock emotion detection (in real app, this would be from backend API)
      let predictedEmotions: Emotion[] = [];
      
      // Very simple keyword matching for demo purposes
      const answer = userAnswer.toLowerCase();
      
      if (answer.includes('senang') || answer.includes('bahagia') || answer.includes('gembira')) {
        predictedEmotions.push('happy');
      }
      
      if (answer.includes('sedih') || answer.includes('kecewa') || answer.includes('murung')) {
        predictedEmotions.push('sad');
      }
      
      if (answer.includes('marah') || answer.includes('kesal') || answer.includes('emosi')) {
        predictedEmotions.push('angry');
      }
      
      if (answer.includes('malu') || answer.includes('sungkan')) {
        predictedEmotions.push('embarrassed');
      }
      
      if (answer.includes('takut') || answer.includes('cemas') || answer.includes('khawatir')) {
        predictedEmotions.push('scared');
      }
      
      if (answer.includes('iri') || answer.includes('cemburu')) {
        predictedEmotions.push('jealous');
      }
      
      // If no emotions detected, provide a default one based on narrative
      if (predictedEmotions.length === 0) {
        predictedEmotions = [currentNarrative.expectedEmotions[0]];
      }
      
      // Check if answers match expected emotions
      const correctEmotions = currentNarrative.expectedEmotions;
      const correctCount = predictedEmotions.filter(emotion => 
        correctEmotions.includes(emotion)
      ).length;
      
      // Calculate score and determine feedback
      let score = 0;
      let feedback = '';
      let isCorrect = false;
      let isPartial = false;
      
      if (correctCount === correctEmotions.length && predictedEmotions.length === correctEmotions.length) {
        // All emotions correctly identified and no extras
        score = 10;
        feedback = getRandomFeedback('correct');
        isCorrect = true;
      } else if (correctCount > 0) {
        // Some emotions correctly identified
        score = 5;
        feedback = getRandomFeedback('partial');
        isPartial = true;
      } else {
        // No correct emotions
        score = 0;
        feedback = getRandomFeedback('incorrect');
      }
      
      setResult({
        predictedEmotions,
        feedback,
        score,
        isCorrect,
        isPartial
      });
      
      setIsProcessing(false);
    }, 1500);
  };

  const handleNextNarrative = () => {
    setUserAnswer('');
    setResult(null);
    
    // Get a different narrative
    const isYoungSegment = user?.segment === '7-9';
    const relevantNarratives = mockNarratives.filter(n => 
      n.isYoungSegment === isYoungSegment && n.id !== currentNarrative?.id
    );
    
    if (relevantNarratives.length > 0) {
      const randomIndex = Math.floor(Math.random() * relevantNarratives.length);
      setCurrentNarrative(relevantNarratives[randomIndex]);
    } else {
      // If we've gone through all narratives, cycle back
      const randomIndex = Math.floor(Math.random() * mockNarratives.length);
      setCurrentNarrative(mockNarratives[randomIndex]);
    }
  };

  // Helper function to display emotion names in Indonesian
  const getEmotionName = (emotion: Emotion): string => {
    const emotionMap: Record<Emotion, string> = {
      'happy': 'Senang',
      'sad': 'Sedih',
      'angry': 'Marah',
      'jealous': 'Iri',
      'embarrassed': 'Malu',
      'scared': 'Takut'
    };
    return emotionMap[emotion];
  };

  if (!currentNarrative) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-12 text-center">
          <p>Memuat cerita...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Belajar Emosi</h1>
        
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Cerita</h2>
          <p className="text-lg leading-relaxed mb-4 text-gray-800 bg-sky-50 p-6 rounded-xl border-l-4 border-sky-500">
            {currentNarrative.text}
          </p>
          <p className="text-sky-700 font-medium">
            Apa emosi yang ada dalam cerita di atas? Tuliskan jawabanmu.
          </p>
        </Card>
        
        {!result ? (
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Jawabanmu</h2>
            <div className="mb-4">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[120px]"
                placeholder="Ceritakan emosi apa yang kamu dapatkan dari cerita tersebut..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between">
              <Button
                variant="outline"
                className="mb-4 sm:mb-0 flex items-center justify-center"
                onClick={toggleRecording}
              >
                <Mic className={`w-5 h-5 mr-2 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                {isRecording ? 'Mendengarkan...' : 'Gunakan Suara'}
              </Button>
              
              <Button
                onClick={handleSubmitAnswer}
                disabled={isProcessing || !userAnswer.trim()}
                className="flex items-center justify-center"
              >
                {isProcessing ? 'Memproses...' : 'Kirim Jawaban'}
                {!isProcessing && <Send className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Hasil</h2>
            
            <div className={`p-6 rounded-xl mb-6 ${
              result.isCorrect 
                ? 'bg-green-50 border-l-4 border-green-500' 
                : result.isPartial 
                  ? 'bg-yellow-50 border-l-4 border-yellow-500'
                  : 'bg-red-50 border-l-4 border-red-500'
            }`}>
              <p className="text-lg font-medium mb-2">
                {result.feedback}
              </p>
              
              <div className="mt-4">
                <p className="font-medium">Emosi yang terdeteksi:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.predictedEmotions.map((emotion, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        currentNarrative.expectedEmotions.includes(emotion)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getEmotionName(emotion)}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="font-medium">Emosi yang diharapkan:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentNarrative.expectedEmotions.map((emotion, index) => (
                    <span 
                      key={index}
                      className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm"
                    >
                      {getEmotionName(emotion)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="font-bold text-lg">+{result.score} poin</span>
              </div>
              
              <Button onClick={handleNextNarrative}>
                Cerita Berikutnya
              </Button>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Learn;