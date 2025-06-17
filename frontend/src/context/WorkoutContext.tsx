import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workout, PerformanceData } from '../types/fitness';
import { useAuth } from './AuthContext';
const URL=import.meta.env.VITE_BACKEND_URL;
import axios from 'axios'

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id' | 'userId'>) => void;
  updateWorkout: (workoutId: string, updates: Partial<Workout>) => void;
  deleteWorkout: (workoutId: string) => void;
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
    const fetchSavedWorkout=async()=>{
      if(user){
        const savedWorkouts=await axios.get(`${URL}/workout/savedworkouts`);
        if(savedWorkouts.data.length!=0){
          setWorkouts(savedWorkouts.data);
          
        }
      }
    }
    fetchSavedWorkout();
  }, [user]);

  const saveWorkouts = async (updatedWorkouts: Workout[]) => {
    if (user) {
      setWorkouts(updatedWorkouts);
      await axios.post(`${URL}/workout/updateworkout`,{updatedWorkouts});
    }
  };

  const addWorkout = async (workoutData: Omit<Workout, '_id' | 'userId'>) => {
    if (!user) return;
    
    const newWorkout=await axios.post(`${URL}/workout/addworkout`,{workoutData}); 
    
    setWorkouts([...workouts, newWorkout.data])
  };

  const updateWorkout = async (workoutId: string, updates: Partial<Workout>) => {
    const updatedWorkout = workouts.find(workout => workout._id === workoutId);
  if (!updatedWorkout) return;

  const newWorkout = { ...updatedWorkout, ...updates };
  const updatedWorkouts = workouts.map(workout =>
    workout._id === workoutId ? newWorkout : workout
  );
  setWorkouts(updatedWorkouts);
  await axios.post(`${URL}/workout/updateworkout`,{ updatedWorkout: newWorkout });
  };

  const deleteWorkout = (workoutId: string) => {
    const updatedWorkouts = workouts.filter(workout => workout._id !== workoutId);
    saveWorkouts(updatedWorkouts);
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
