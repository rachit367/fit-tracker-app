import React, { useState, useRef } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { WorkoutBuilder } from './WorkoutBuilder';
import { ExerciseCard } from './ExerciseCard';
import { getWorkoutXp } from '../../data/achievements';
import { MUSCLE_GROUPS } from '../../types/fitness';
import { Plus, Calendar, Clock, Target, Zap, Trophy, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
const URL=import.meta.env.VITE_BACKEND_URL;

interface ExerciseUpdate {
  sets?: Array<{
    weight?: number;
    reps?: number;
    completed?: boolean;
  }>;
  notes?: string;
  completed?: boolean;
}

export const TodaysWorkout: React.FC = () => {
  const { getTodaysWorkout, updateWorkout, getThisWeeksWorkouts } = useWorkouts();
  const { user, addXp, updateProfile, checkAchievements } = useAuth();
  const [showBuilder, setShowBuilder] = useState(false);
  const todaysWorkout = getTodaysWorkout();
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workoutContainerRef = useRef<HTMLDivElement>(null);

  const getRecommendedMuscleGroup = () => {
    const thisWeeksWorkouts = getThisWeeksWorkouts();
    const muscleGroupCounts = MUSCLE_GROUPS.reduce((acc, group) => {
      acc[group] = 0;
      return acc;
    }, {} as Record<string, number>);


    thisWeeksWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.exercise.muscleGroup !== 'Cardio') {
          muscleGroupCounts[exercise.exercise.muscleGroup]++;
        }
      });
    });


    const sortedGroups = Object.entries(muscleGroupCounts)
      .filter(([group]) => group !== 'Cardio')
      .sort(([,a], [,b]) => a - b);

    return sortedGroups[0]?.[0] || 'Chest';
  };

  const recommendedMuscleGroup = getRecommendedMuscleGroup();

  const handleUpdateExercise = (exerciseId: string, updates: ExerciseUpdate) => {
    if (todaysWorkout) {
      const scrollPosition = window.scrollY;
      const updatedExercises = todaysWorkout.exercises.map(exercise =>
        exercise._id === exerciseId ? { ...exercise, ...updates } : exercise
      );
      updateWorkout(todaysWorkout._id, { exercises: updatedExercises })
        .then(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, scrollPosition);
          });
        })
        .catch((err) => {
          setError('Failed to update exercise. Please try again.');
          console.error('Error updating exercise:', err);
        });
    }
  };

  const handleCompleteWorkout = async () => {
    if (todaysWorkout && user) {
      try {
        setIsCompleting(true);
        setError(null);
        const xpEarned = getWorkoutXp(todaysWorkout.exercises.length, true);
        
        await updateWorkout(todaysWorkout._id, {
          ...todaysWorkout,
          completed: true,
          xpEarned
        });
        
        await axios.get(`${URL}/workout/todaysworkout`, { withCredentials: true });
        addXp(xpEarned);
        
        setTimeout(() => {
          checkAchievements();
        }, 500);
      } catch (err) {
        setError('Failed to complete workout. Please try again.');
        console.error('Error completing workout:', err);
      } finally {
        setIsCompleting(false);
      }
    }
  };

  if (showBuilder) {
    return (
      <WorkoutBuilder
        workout={todaysWorkout}
        onClose={() => setShowBuilder(false)}
        onSave={() => setShowBuilder(false)}
      />
    );
  }

  if (!todaysWorkout) {
    return (
      <div className="space-y-6">

        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl shadow-xl p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Focus</h3>
              <p className="text-gray-600 dark:text-gray-400">Recommended muscle group</p>
            </div>
          </div>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {recommendedMuscleGroup}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              This muscle group needs attention based on your weekly routine
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-8 text-center border border-blue-200 dark:border-blue-800">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready for Today's Challenge?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Create a new workout focusing on {recommendedMuscleGroup} and start earning XP towards your next level!
          </p>
          <button
            onClick={() => setShowBuilder(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Today's Workout
          </button>
        </div>
      </div>
    );
  }

  const completedExercises = todaysWorkout.exercises.filter(ex => 
    ex.sets.every(set => set.completed)
  ).length;

  const potentialXp = getWorkoutXp(todaysWorkout.exercises.length, true);

  return (
    <div className="space-y-6" ref={workoutContainerRef}>
      {/* Enhanced Workout Header */}
      <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{todaysWorkout.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 flex items-center">
              <Zap className="w-4 h-4 mr-1 text-yellow-500" />
              Earn up to {potentialXp} XP
            </p>
          </div>
          <button
            onClick={() => setShowBuilder(true)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Edit Workout
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-2 mx-auto shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">Progress</div>
            <div className="font-bold text-green-800 dark:text-green-300 text-lg">
              {completedExercises}/{todaysWorkout.exercises.length}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-2 mx-auto shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Duration</div>
            <div className="font-bold text-blue-800 dark:text-blue-300 text-lg">
              {todaysWorkout.duration || '--'} min
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-2 mx-auto shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Exercises</div>
            <div className="font-bold text-purple-800 dark:text-purple-300 text-lg">{todaysWorkout.exercises.length}</div>
          </div>
        </div>

        {!todaysWorkout.completed && (
          <div className="space-y-3">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full transition-all duration-500 relative"
                style={{
                  width: `${(completedExercises / todaysWorkout.exercises.length) * 100}%`
                }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {completedExercises === todaysWorkout.exercises.length ? 
                '🎉 Amazing! All exercises completed!' : 
                `${todaysWorkout.exercises.length - completedExercises} exercises remaining`
              }
            </div>
          </div>
        )}
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        {todaysWorkout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise._id}
            exercise={exercise}
            onUpdate={(updates) => handleUpdateExercise(exercise._id, updates)}
            showPerformance={true}
          />
        ))}
      </div>

      {/* Complete Workout Button */}
      {!todaysWorkout.completed && completedExercises === todaysWorkout.exercises.length && (
        <div className="text-center py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <button
            onClick={handleCompleteWorkout}
            disabled={isCompleting}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Completing Workout...
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5 mr-2" />
                Complete Workout & Earn {potentialXp} XP
              </>
            )}
          </button>
        </div>
      )}

      {todaysWorkout.completed && (
        <div className="text-center py-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Workout Completed! 🎉</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">You earned {todaysWorkout.xpEarned || potentialXp} XP!</p>
          <div className="inline-flex items-center text-green-600 dark:text-green-400 font-medium">
            <Zap className="w-5 h-5 mr-2" />
            Keep up the amazing work!
          </div>
        </div>
      )}
    </div>
  );
};