export interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  password:string;
  weight: number;
  fitnessGoal: 'bulking' | 'cutting' | 'strength';
  createdAt: string;
  streak: number;
  totalWorkouts: number;
  achievements?: Achievement[];
  level: number;
  xp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date |string;
  category: 'streak' | 'workout' | 'strength' | 'consistency';
}

export interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
  isCustom: boolean;
  user:string;
}

export interface PerformanceData {
  date: Date|string;
  exercisename: string;
  maxWeight: number;
  totalVolume: number;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  _id: string;
  exercisename: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  _id: string;
  userId: string;
  date: Date | string;
  name: string;
  exercises: WorkoutExercise[];
  duration?: number;
  completed: boolean;
  xpEarned?: number;
}



export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  xpReward: number;
  completed: boolean;
  type: 'reps' | 'weight' | 'exercises' | 'duration';
}

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Cardio'
] as const;

export type MuscleGroup = typeof MUSCLE_GROUPS[number];