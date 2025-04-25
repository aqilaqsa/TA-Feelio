import { User } from '../types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    name: 'Budi',
    email: 'budi@example.com',
    segment: '7-9',
    totalScore: 150,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
  {
    id: '2',
    name: 'Siti',
    email: 'siti@example.com',
    segment: '10-12',
    totalScore: 400,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    id: '3',
    name: 'Andi',
    email: 'andi@example.com',
    segment: '7-9',
    totalScore: 75,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
];

// Function to authenticate user (mock)
export const authenticateUser = (email: string, password: string): User | null => {
  // In a real app, you would verify the password here
  // For demo purposes, we'll just find the user by email
  return users.find(user => user.email === email) || null;
};

// Function to get user by ID
export const getUserById = (userId: string): User | null => {
  return users.find(user => user.id === userId) || null;
};

// Function to create a new user (mock)
export const createUser = (name: string, email: string, segment: '7-9' | '10-12'): User => {
  const newUser: User = {
    id: `${users.length + 1}`,
    name,
    email,
    segment,
    totalScore: 0,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  return newUser;
};

// Function to update user score
export const updateUserScore = (userId: string, additionalScore: number): User | null => {
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return null;
  }
  
  users[userIndex] = {
    ...users[userIndex],
    totalScore: users[userIndex].totalScore + additionalScore,
  };
  
  return users[userIndex];
};