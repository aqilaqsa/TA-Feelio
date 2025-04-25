import { Narrative } from '../types';

// Narratives for younger kids (7-9 years)
export const youngerNarratives: Narrative[] = [
  {
    id: '1',
    text: 'Hari ini Budi mendapatkan nilai bagus di sekolah. Dia sangat senang karena semua usaha belajarnya terbayar. Namun, ketika pulang, dia melihat temannya Anto menangis karena mendapat nilai rendah. Meskipun senang dengan nilainya sendiri, Budi merasa tidak enak melihat Anto sedih.',
    isYoungSegment: true,
    expectedEmotions: ['happy', 'sad'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    text: 'Saat istirahat sekolah, Maya tidak sengaja menumpahkan minumannya ke baju Lisa. Semua teman-teman di sekitar mereka tertawa melihat kejadian itu. Lisa terlihat kesal, sementara Maya merasa bersalah dan malu karena semua orang melihatnya.',
    isYoungSegment: true,
    expectedEmotions: ['embarrassed', 'angry'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    text: 'Doni diajak bermain bola oleh teman-temannya. Tapi ketika mereka membagi tim, Doni dipilih terakhir. Dia merasa sedih dan takut tidak bisa bermain dengan baik. Dia juga sedikit iri melihat temannya Rafi yang selalu dipilih pertama karena jago bermain bola.',
    isYoungSegment: true,
    expectedEmotions: ['sad', 'scared', 'jealous'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    text: 'Sinta mendapatkan sepeda baru di hari ulang tahunnya. Dia sangat senang dan tidak sabar untuk menunjukkannya pada teman-temannya. Tetapi ketika dia keluar, hujan turun dengan deras sehingga dia tidak bisa mencoba sepeda barunya. Sinta merasa sangat kecewa.',
    isYoungSegment: true,
    expectedEmotions: ['happy', 'sad'],
    createdAt: new Date().toISOString(),
  },
];

// Narratives for older kids (10-12 years)
export const olderNarratives: Narrative[] = [
  {
    id: '5',
    text: 'Amir telah berlatih selama berbulan-bulan untuk lomba cerdas cermat tingkat kota. Saat hari kompetisi tiba, dia merasa sangat gugup dan takut gagal. Ketika namanya dipanggil untuk menjawab pertanyaan final, tangannya gemetar. Meskipun begitu, dia berhasil menjawab dengan benar dan timnya memenangkan kompetisi. Amir merasa bangga, lega, dan sangat bahagia.',
    isYoungSegment: false,
    expectedEmotions: ['scared', 'happy'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    text: 'Ketika Rina pulang sekolah, dia mendengar teman-temannya berbisik dan tertawa di belakangnya. Dia kemudian mengetahui bahwa mereka membicarakan model rambutnya yang baru. Rina merasa malu dan sedikit marah karena teman-temannya tidak mengatakan langsung padanya dan malah membicarakannya di belakang.',
    isYoungSegment: false,
    expectedEmotions: ['embarrassed', 'angry'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    text: 'Dimas melihat temannya, Rafi, mendapatkan nilai yang lebih tinggi darinya dalam ujian matematika, padahal Dimas sudah belajar lebih keras. Dia merasa iri dengan keberhasilan Rafi, tetapi juga merasa bersalah karena seharusnya dia turut senang atas keberhasilan temannya. Dia juga sedikit takut ayahnya akan marah melihat nilainya yang tidak sebaik Rafi.',
    isYoungSegment: false,
    expectedEmotions: ['jealous', 'embarrassed', 'scared'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    text: 'Putri baru saja bergabung dengan klub drama di sekolah. Saat audisi untuk peran utama dalam pertunjukan, dia merasa sangat gugup. Ternyata, dia mendapatkan peran utama tersebut, mengalahkan siswa lain yang sudah lebih lama di klub. Putri merasa sangat senang, tetapi juga merasa tidak enak terhadap teman-temannya yang sudah lebih senior namun tidak mendapatkan peran utama.',
    isYoungSegment: false,
    expectedEmotions: ['happy', 'embarrassed'],
    createdAt: new Date().toISOString(),
  },
];

// Combined data for easy access
export const allNarratives: Narrative[] = [...youngerNarratives, ...olderNarratives];

// Function to get narratives by segment
export const getNarrativesBySegment = (isYoungSegment: boolean): Narrative[] => {
  return isYoungSegment ? youngerNarratives : olderNarratives;
};

// Function to get a random narrative by segment
export const getRandomNarrative = (isYoungSegment: boolean): Narrative => {
  const narratives = getNarrativesBySegment(isYoungSegment);
  const randomIndex = Math.floor(Math.random() * narratives.length);
  return narratives[randomIndex];
};