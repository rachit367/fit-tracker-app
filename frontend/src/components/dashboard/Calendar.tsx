import React, { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { WorkoutBuilder } from './WorkoutBuilder';
import { ChevronLeft, ChevronRight, Plus, Flame, Trophy, Target, Trash2 } from 'lucide-react';

export const Calendar: React.FC = () => {
  const { workouts, getWorkoutByDate, deleteWorkout } = useWorkouts();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setShowBuilder(true);
  };

  const getWorkoutIntensity = (date: Date): 'none' | 'light' | 'medium' | 'heavy' => {
    const dateString = date.toISOString().split('T')[0];
    const workout = getWorkoutByDate(dateString);
    
    if (!workout) return 'none';
    
    const exerciseCount = workout.exercises.length;
    if (exerciseCount <= 2) return 'light';
    if (exerciseCount <= 4) return 'medium';
    return 'heavy';
  };

  const monthlyStats = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate.getMonth() === month && workoutDate.getFullYear() === year;
  });

  const completedWorkouts = monthlyStats.filter(w => w.completed).length;
  const totalWorkouts = monthlyStats.length;
  const streak = 5; 

  const handleDeleteWorkout = async (date: Date, e: React.MouseEvent) => {
    e.stopPropagation(); 
    const dateString = date.toISOString().split('T')[0];
    const workout = getWorkoutByDate(dateString);
    if (workout) {
      if (window.confirm('Are you sure you want to delete this workout?')) {
        await deleteWorkout(workout._id);
      }
    }
  };

  if (showBuilder) {
    const selectedWorkout = selectedDate ? getWorkoutByDate(selectedDate) : undefined;
    return (
      <WorkoutBuilder
        workout={selectedWorkout}
        targetDate={selectedDate || undefined}
        onClose={() => {
          setShowBuilder(false);
          setSelectedDate(null);
        }}
        onSave={() => {
          setShowBuilder(false);
          setSelectedDate(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{completedWorkouts}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{totalWorkouts}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Total</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{streak}</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Streak</div>
            </div>
          </div>
        </div>
      </div>

   
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
       
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

      
        <div className="p-6">
     
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-bold text-gray-600 dark:text-gray-400 py-3">
                {day}
              </div>
            ))}
          </div>

          
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const isCurrentMonth = date.getMonth() === month;
              const isToday = date.toDateString() === today.toDateString();
              const workout = getWorkoutByDate(date.toISOString().split('T')[0]);
              const intensity = getWorkoutIntensity(date);
              const dateString = date.toISOString().split('T')[0];
              const isHovered = hoveredDate === dateString;
              
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => setHoveredDate(dateString)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`
                    relative aspect-square p-2 text-sm rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer
                    ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-white'}
                    ${isToday ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className={`font-bold ${isToday ? 'text-white' : ''}`}>
                      {date.getDate()}
                    </span>
                    
               
                    {intensity !== 'none' && !isToday && (
                      <div className={`
                        w-2 h-2 rounded-full mt-1 shadow-sm
                        ${intensity === 'light' ? 'bg-green-400' : ''}
                        ${intensity === 'medium' ? 'bg-yellow-400' : ''}
                        ${intensity === 'heavy' ? 'bg-red-400' : ''}
                      `} />
                    )}
                    
                  
                    {isToday && intensity !== 'none' && (
                      <div className="w-2 h-2 rounded-full mt-1 bg-white shadow-sm" />
                    )}
                    
               
                    {workout?.completed && (
                      <div className="absolute top-1 right-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}

                    
                    {isHovered && workout && (
                      <button
                        onClick={(e) => handleDeleteWorkout(date, e)}
                        className="absolute top-1 left-1 p-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-sm"></div>
                  <span className="text-gray-600 dark:text-gray-400">Light</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-sm"></div>
                  <span className="text-gray-600 dark:text-gray-400">Medium</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2 shadow-sm"></div>
                  <span className="text-gray-600 dark:text-gray-400">Heavy</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {completedWorkouts}/{totalWorkouts} workouts completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};