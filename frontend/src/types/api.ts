import { Workout, WorkoutExercise } from './fitness';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    details?: string;
    message?: string;
}

export interface WorkoutResponse extends Workout {
    exercises: WorkoutExercise[];
}

export interface TodayWorkoutResponse {
    message: string;
    streak: number;
    totalWorkouts: number;
    lastWorkoutDate?: string;
    hoursSinceLastWorkout?: number;
}

export interface ExerciseUpdate {
    sets?: Array<{
        weight?: number;
        reps?: number;
        completed?: boolean;
    }>;
    notes?: string;
    completed?: boolean;
}

export interface WorkoutUpdate {
    workoutId: string;
    workoutData: Partial<Workout>;
}

export interface WorkoutCreate {
    workoutData: Omit<Workout, '_id' | 'userId'>;
} 