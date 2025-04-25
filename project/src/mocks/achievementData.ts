import { Badge, Achievement } from '../types';

// Mock badges
export const badges: Badge[] = [
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
  },
  {
    id: '4',
    name: 'Komunikator Hebat',
    description: 'Menyelesaikan 20 sesi pembelajaran dengan jawaban yang jelas',
    imageSrc: 'badge-communicator',
  },
  {
    id: '5',
    name: 'Detektif Emosi',
    description: 'Berhasil mengidentifikasi emosi yang kompleks dalam 5 cerita berturut-turut',
    imageSrc: 'badge-detective',
  },
  {
    id: '6',
    name: 'Pakar Emosi',
    description: 'Mendapatkan skor sempurna dalam 10 sesi berturut-turut',
    imageSrc: 'badge-expert',
  },
];

// Mock achievements for different users
export const userAchievements: Record<string, Achievement[]> = {
  // For user with ID '1'
  '1': [
    {
      id: '1',
      userId: '1',
      badge: badges[0],
      points: 50,
      dateEarned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
    {
      id: '2',
      userId: '1',
      badge: badges[1],
      points: 100,
      dateEarned: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    }
  ],
  
  // For user with ID '2'
  '2': [
    {
      id: '3',
      userId: '2',
      badge: badges[0],
      points: 50,
      dateEarned: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
    {
      id: '4',
      userId: '2',
      badge: badges[2],
      points: 200,
      dateEarned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      id: '5',
      userId: '2',
      badge: badges[3],
      points: 150,
      dateEarned: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    }
  ]
};

// Function to get user achievements
export const getUserAchievements = (userId: string): Achievement[] => {
  return userAchievements[userId] || [];
};

// Function to get badges that user hasn't earned yet
export const getUserUnachievedBadges = (userId: string): Badge[] => {
  const userAchieved = getUserAchievements(userId);
  const achievedBadgeIds = userAchieved.map(a => a.badge.id);
  
  return badges.filter(badge => !achievedBadgeIds.includes(badge.id));
};