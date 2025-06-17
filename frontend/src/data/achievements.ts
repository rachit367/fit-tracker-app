import { Achievement } from '../types/fitness';

export const ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Complete workouts for 3 days in a row',
    icon: '🔥',
    category: 'streak'
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '⚡',
    category: 'streak'
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Achieve a 30-day workout streak',
    icon: '👑',
    category: 'streak'
  },
  
  // Workout Count Achievements
  {
    id: 'workouts-10',
    name: 'First Steps',
    description: 'Complete your first 10 workouts',
    icon: '🎯',
    category: 'workout'
  },
  {
    id: 'workouts-50',
    name: 'Dedicated Athlete',
    description: 'Complete 50 total workouts',
    icon: '💪',
    category: 'workout'
  },
  {
    id: 'workouts-100',
    name: 'Fitness Legend',
    description: 'Complete 100 total workouts',
    icon: '🏆',
    category: 'workout'
  },
  
  // Strength Achievements
  {
    id: 'bench-bodyweight',
    name: 'Bodyweight Bench',
    description: 'Bench press your bodyweight',
    icon: '🏋️',
    category: 'strength'
  },
  {
    id: 'squat-bodyweight',
    name: 'Bodyweight Squat',
    description: 'Squat your bodyweight',
    icon: '🦵',
    category: 'strength'
  },
  
  // Consistency Achievements
  {
    id: 'weekly-consistent',
    name: 'Weekly Warrior',
    description: 'Work out at least 3 times per week for 4 weeks',
    icon: '📅',
    category: 'consistency'
  }
];

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 1000) + 1;
};

export const getXpForNextLevel = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  return currentLevel * 1000 - currentXp;
};

export const getWorkoutXp = (exerciseCount: number, completed: boolean): number => {
  if (!completed) return 0;
  return Math.min(exerciseCount * 50 + 100, 500); // Base 100 XP + 50 per exercise, max 500
};