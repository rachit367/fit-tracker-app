import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkouts } from '../../context/WorkoutContext';
import { calculateLevel, getXpForNextLevel } from '../../data/achievements';
import { Trophy, Flame, Target, TrendingUp, Star, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const UserStats: React.FC = () => {
  const { user } = useAuth();
  const { getThisWeeksWorkouts } = useWorkouts();
  const [showStreakReset, setShowStreakReset] = useState(false);
  
  if (!user) return null;

  const thisWeeksWorkouts = useMemo(() => getThisWeeksWorkouts(), [getThisWeeksWorkouts]);
  const completedThisWeek = useMemo(() => 
    thisWeeksWorkouts.filter(w => w.completed).length,
    [thisWeeksWorkouts]
  );

  const { xpForNextLevel, xpProgress } = useMemo(() => {
    const xpForNext = getXpForNextLevel(user.xp);
    const progress = (((user.xp ?? 0) % 1000) / 1000) * 100;
    return { xpForNextLevel: xpForNext, xpProgress: progress };
  }, [user.xp]);

  const latestAchievement = useMemo(() => 
    user.achievements?.[(user.achievements?.length || 0) - 1],
    [user.achievements]
  );

  // Check for streak reset
  useEffect(() => {
    const lastWorkout = thisWeeksWorkouts[0];
    if (lastWorkout) {
      const lastWorkoutDate = new Date(lastWorkout.date);
      const today = new Date();
      const hoursSinceLastWorkout = (today - lastWorkoutDate) / (1000 * 60 * 60);
      
      if (hoursSinceLastWorkout > 24 && user.streak > 0) {
        setShowStreakReset(true);
        toast.error('Your streak has been reset! Complete a workout today to start a new streak.', {
          duration: 5000,
          icon: '🔥',
        });
      }
    }
  }, [thisWeeksWorkouts, user.streak]);

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-blue-800">
      {/* Streak Reset Alert */}
      {showStreakReset && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-300">Streak Reset</p>
              <p className="text-sm text-red-600 dark:text-red-400">Complete a workout today to start a new streak!</p>
            </div>
          </div>
        </div>
      )}

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress to Level {user.level + 1}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{xpForNextLevel} XP to go</span>
        </div>
        <div className="relative">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${xpProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
          <div className="absolute right-0 top-0 transform translate-x-2 -translate-y-1">
            <Star className="w-4 h-4 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{completedThisWeek}</div>
              <div className="text-xs text-green-600 dark:text-green-400">This Week</div>
            </div>
          </div>
          <p className="text-sm font-medium text-green-800 dark:text-green-300">Workouts</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{user.totalWorkouts}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">All Time</div>
            </div>
          </div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Total</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{user.achievements?.length || 0}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Unlocked</div>
            </div>
          </div>
          <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Badges</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{user.level}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Current</div>
            </div>
          </div>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Level</p>
        </div>
      </div>

      {/* Recent Achievements */}
      {user.achievements?.length > 0 && latestAchievement && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
            Latest Achievement
          </h3>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{latestAchievement.icon}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{latestAchievement.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{latestAchievement.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};