import React, { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { MUSCLE_GROUPS } from '../../types/fitness';
import { Target, TrendingUp, Calendar, Award, Edit3, Check, X } from 'lucide-react';

export const MuscleTargets: React.FC = () => {
  const { getThisWeeksWorkouts, workouts } = useWorkouts();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    () => {
      const saved = localStorage.getItem('selectedMuscleGroups');
      return saved ? JSON.parse(saved) : MUSCLE_GROUPS.filter(group => group !== 'Cardio');
    }
  );
  
  const thisWeeksWorkouts = getThisWeeksWorkouts();
  
  
  const muscleGroupStats = selectedMuscleGroups.map(group => {
    const exercisesThisWeek = thisWeeksWorkouts.flatMap(workout =>
      workout.exercises.filter(exercise => exercise.exercise.muscleGroup === group)
    );
    
    const totalSets = exercisesThisWeek.reduce((sum, exercise) => sum + exercise.sets.length, 0);
    const completedSets = exercisesThisWeek.reduce(
      (sum, exercise) => sum + exercise.sets.filter(set => set.completed).length, 
      0
    );
    const totalVolume = exercisesThisWeek.reduce(
      (sum, exercise) => sum + exercise.sets.reduce((setSum, set) => setSum + (set.reps * set.weight), 0),
      0
    );
    
    return {
      muscleGroup: group,
      exerciseCount: exercisesThisWeek.length,
      totalSets,
      completedSets,
      totalVolume,
      completionRate: totalSets > 0 ? (completedSets / totalSets) * 100 : 0
    };
  }).sort((a, b) => b.exerciseCount - a.exerciseCount);


  const totalWorkouts = thisWeeksWorkouts.length;
  const completedWorkouts = thisWeeksWorkouts.filter(w => w.completed).length;
  const totalExercises = thisWeeksWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
  const weeklyVolume = muscleGroupStats.reduce((sum, stat) => sum + stat.totalVolume, 0);


  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const workoutsByDay = daysOfWeek.map(day => {
    const dayIndex = daysOfWeek.indexOf(day);
    const workoutsOnDay = thisWeeksWorkouts.filter(workout => {
      const workoutDay = new Date(workout.date).getDay();
      return workoutDay === dayIndex;
    });
    return {
      day,
      count: workoutsOnDay.length,
      completed: workoutsOnDay.filter(w => w.completed).length
    };
  });

  const handleMuscleGroupToggle = (group: string) => {
    setSelectedMuscleGroups(prev => {
      const newSelection = prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group];
      return newSelection;
    });
  };

  const handleSaveSelection = () => {
    localStorage.setItem('selectedMuscleGroups', JSON.stringify(selectedMuscleGroups));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    const saved = localStorage.getItem('selectedMuscleGroups');
    setSelectedMuscleGroups(saved ? JSON.parse(saved) : MUSCLE_GROUPS.filter(group => group !== 'Cardio'));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
    
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Summary</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full mb-2 mx-auto">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedWorkouts}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Workouts Completed</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full mb-2 mx-auto">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalExercises}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Exercises</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full mb-2 mx-auto">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Math.round(weeklyVolume)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full mb-2 mx-auto">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
          </div>
        </div>
      </div>

   
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Schedule</h3>
        <div className="grid grid-cols-7 gap-2">
          {workoutsByDay.map((day, index) => (
            <div key={day.day} className="text-center">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {day.day.substring(0, 3)}
              </div>
              <div className={`
                w-full h-12 rounded-lg flex items-center justify-center text-sm font-medium
                ${day.count > 0 
                  ? day.completed === day.count 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-400 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }
              `}>
                {day.count > 0 ? day.completed : '—'}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            Completed
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
            In Progress
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 rounded mr-2"></div>
            Rest Day
          </div>
        </div>
      </div>

  
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Muscle Group Focus</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit Focus
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveSelection}
                className="flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium px-3 py-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Select muscle groups to focus on:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {MUSCLE_GROUPS.map(group => (
                <button
                  key={group}
                  onClick={() => handleMuscleGroupToggle(group)}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedMuscleGroups.includes(group)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {muscleGroupStats.length > 0 ? (
          <div className="space-y-4">
            {muscleGroupStats.map((stat) => (
              <div key={stat.muscleGroup} className="border dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{stat.muscleGroup}</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.exerciseCount} exercise{stat.exerciseCount !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Sets</div>
                    <div className="font-medium text-gray-900 dark:text-white">{stat.completedSets}/{stat.totalSets}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Volume</div>
                    <div className="font-medium text-gray-900 dark:text-white">{Math.round(stat.totalVolume)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Completion</div>
                    <div className="font-medium text-gray-900 dark:text-white">{Math.round(stat.completionRate)}%</div>
                  </div>
                </div>
                
               
                <div className="mt-3">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stat.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No muscle groups selected</p>
            <p className="text-sm">Click "Edit Focus" to select muscle groups to track</p>
          </div>
        )}
      </div>

    
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Smart Recommendations</h3>
        
        <div className="space-y-3">
          {muscleGroupStats.slice(0, 3).map((stat, index) => {
            let recommendation = '';
            let color = 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
            let priority = 'Normal';
            
            if (stat.exerciseCount === 0) {
              recommendation = `Consider adding ${stat.muscleGroup.toLowerCase()} exercises to your routine`;
              color = 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
              priority = 'High';
            } else if (stat.completionRate < 70) {
              recommendation = `Focus on completing your ${stat.muscleGroup.toLowerCase()} sets`;
              color = 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
              priority = 'Medium';
            } else {
              recommendation = `Great progress on ${stat.muscleGroup.toLowerCase()}! Keep it up`;
              color = 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
              priority = 'Low';
            }
            
            return (
              <div key={index} className={`p-4 rounded-lg ${color} border border-current border-opacity-20`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{recommendation}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                    priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  }`}>
                    {priority} Priority
                  </span>
                </div>
                <div className="text-xs opacity-75">
                  Current: {stat.exerciseCount} exercises, {Math.round(stat.completionRate)}% completion
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};