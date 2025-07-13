import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workout, PerformanceData } from '../types/fitness';
import { useAuth } from './AuthContext';
import { ApiResponse, WorkoutResponse } from '../types/api';
const URL=import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, '_id' | 'userId'>) => Promise<Workout>;
  updateWorkout: (workoutId: string, workoutData: Workout) => Promise<Workout>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  getWorkoutByDate: (date: string) => Workout | undefined;
  getPerformanceData: (exerciseId: string, days?: number) => PerformanceData[];
  getTodaysWorkout: () => Workout | undefined;
  getThisWeeksWorkouts: () => Workout[];
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSavedWorkout = async () => {
      if(user){
        try {
          const response = await axios.get<ApiResponse<WorkoutResponse[]>>(`${URL}/workout/savedworkouts`, { withCredentials: true });
          if(response.data.success && response.data.data) {
            setWorkouts(response.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch workouts:', error);
        }
      }
    }
    fetchSavedWorkout();
  }, [user]);

  const saveWorkouts = async (updatedWorkouts: Workout[]) => {
    if (user) {
      try {
        console.log('Saving workouts:', updatedWorkouts.length, 'workouts');
        const response = await axios.put<ApiResponse<WorkoutResponse[]>>(
          `${URL}/workout/updateworkout`,
          { updatedWorkouts },
          { withCredentials: true }
        );
        if(response.data.success && response.data.data) {
          setWorkouts(response.data.data);
          console.log('Workouts saved successfully');
        }
      } catch (error: any) {
        console.error('Failed to save workouts:', error);
        console.error('Error details:', error.response?.data);
        throw error;
      }
    }
  };

  const addWorkout = async (workoutData: Omit<Workout, '_id' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const response = await axios.post<ApiResponse<WorkoutResponse>>(
        `${URL}/workout/addworkout`,
        { workoutData },
        { withCredentials: true }
      );
      
      if(response.data.success && response.data.data) {
        setWorkouts(prev => [...prev, response.data.data]);
        return response.data.data;
      }
      throw new Error('Failed to add workout');
    } catch (error) {
      console.error('Failed to add workout:', error);
      throw error;
    }
  };

  const updateWorkout = async (workoutId: string, workoutData: Workout) => {
    try {
      // Preserve the original workout's date
      const originalWorkout = workouts.find(w => w._id === workoutId);
      if (originalWorkout) {
        workoutData.date = originalWorkout.date;
      }

      const response = await axios.put<ApiResponse<WorkoutResponse>>(
        `${URL}/workout/updateworkout`,
        { workoutId, workoutData },
        { withCredentials: true }
      );
      
      if (response.data.success && response.data.data) {
        setWorkouts(prevWorkouts => {
          const workoutIndex = prevWorkouts.findIndex(w => w._id === workoutId);
          if (workoutIndex === -1) return prevWorkouts;
          
          const newWorkouts = [...prevWorkouts];
          newWorkouts[workoutIndex] = response.data.data;
          return newWorkouts;
        });
        return response.data.data;
      }
      throw new Error('Failed to update workout');
    } catch (error) {
      console.error('Failed to update workout:', error);
      throw error;
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    try {
      console.log('Deleting workout:', workoutId);
      const updatedWorkouts = workouts.filter(workout => workout._id !== workoutId);
      await saveWorkouts(updatedWorkouts);
      console.log('Workout deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete workout:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  };

  const getWorkoutByDate = (date: string) => {
    return workouts.find(workout => {
      const workoutDate = new Date(workout.date).toISOString().split('T')[0];
      return workoutDate === date;
    });
  };

  const getPerformanceData = (exercisename: string, days = 30): PerformanceData[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return workouts
      .filter(workout => new Date(workout.date) >= cutoffDate)
      .flatMap(workout =>
        workout.exercises
          .filter(exercise => exercise.exercisename === exercisename)
          .map(exercise => ({
            date: workout.date,
            exercisename,
            maxWeight: Math.max(...exercise.sets.map(set => set.weight)),
            totalVolume: exercise.sets.reduce((sum, set) => sum + (set.reps * set.weight), 0),
          }))
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getTodaysWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    return getWorkoutByDate(today);
  };

  const getThisWeeksWorkouts = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);

    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek && workoutDate <= today;
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getWorkoutByDate,
        getPerformanceData,
        getTodaysWorkout,
        getThisWeeksWorkouts,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};
