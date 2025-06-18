import React, { useState, useEffect } from 'react';
import { WorkoutExercise } from '../../types/fitness';
import { useWorkouts } from '../../context/WorkoutContext';
import { CheckCircle, Circle, TrendingUp, Edit3, Zap, Target, Plus, Minus } from 'lucide-react';
import axios from 'axios';
const URL=import.meta.env.VITE_BACKEND_URL;

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  onUpdate: (updates: Partial<WorkoutExercise>) => void;
  showPerformance?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onUpdate,
  showPerformance = false
}) => {
  const { getPerformanceData } = useWorkouts();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSets, setEditingSets] = useState(exercise.sets);
  
  useEffect(() => {
    setEditingSets(exercise.sets);
  }, [exercise.sets]);

  const performanceData = showPerformance ? 
    getPerformanceData(exercise._id, 7) : [];
  const lastWeekMax = performanceData.length > 1 ? 
    performanceData[performanceData.length - 2]?.maxWeight : null;

  const getLastWorkoutWeight = () => {
    if (performanceData.length > 0) {
      return performanceData[performanceData.length - 1]?.maxWeight || 0;
    }
    return 0;
  };

  const handleSetToggle = (setIndex: number) => {
    const updatedSets = exercise.sets.map((set, index) =>
      index === setIndex ? { ...set, completed: !set.completed } : set
    );
    onUpdate({ sets: updatedSets });
  };

  const handleSetUpdate = (setIndex: number, field: 'reps' | 'weight', value: number) => {
    const updatedSets = editingSets.map((set, index) =>
      index === setIndex ? { ...set, [field]: value } : set
    );
    setEditingSets(updatedSets);
  };

  const handleDone = () => {
    onUpdate({ sets: editingSets });
    setIsEditing(false);
  };

  const handleAddSet = async () => {
    try {
      const lastWeight = getLastWorkoutWeight();
      const newSet = {
        reps: 8,
        weight: lastWeight,
        completed: false
      };
      
      const response = await axios.post(
        `${URL}/set/add`,
        { newSet, exercise },
        { withCredentials: true }
      );
      
      if (response.data) {
        const updatedSets = [...exercise.sets, response.data];
        onUpdate({ sets: updatedSets });
      }
    } catch (error) {
      console.error('Failed to add set:', error);
    }
  };

  const handleRemoveSet = () => {
    if (exercise.sets.length > 1) {
      onUpdate({ sets: exercise.sets.slice(0, -1) });
    }
  };

  const allSetsCompleted = exercise.sets.every(set => set.completed);
  const completedSets = exercise.sets.filter(set => set.completed).length;

  return (
    <div className={`rounded-2xl shadow-lg border-2 transition-all duration-300 ${
      allSetsCompleted 
        ? 'border-green-300 dark:border-green-600 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 shadow-green-200' 
        : 'border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl'
    }`}>
      <div className="p-6">
      
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              allSetsCompleted 
                ? 'bg-gradient-to-br from-green-500 to-green-600' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              {allSetsCompleted ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <Target className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exercise.exercise.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                {exercise.exercise.muscleGroup}
                {allSetsCompleted && (
                  <>
                    <span className="mx-2">•</span>
                    <Zap className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400 font-medium">Completed!</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {showPerformance && lastWeekMax && (
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                Last: {lastWeekMax}Kg
              </div>
            )}
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {completedSets}/{exercise.sets.length} sets
            </div>
          </div>
        </div>

   
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Sets</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRemoveSet}
              disabled={exercise.sets.length <= 1}
              className="p-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[2rem] text-center">
              {exercise.sets.length}
            </span>
            <button
              onClick={handleAddSet}
              className="p-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

  
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 px-2">
            <div>Set</div>
            <div>Weight</div>
            <div>Reps</div>
            <div></div>
          </div>
          
          {(isEditing ? editingSets : exercise.sets).map((set, index) => (
            <div
              key={`${exercise._id}-set-${index}`}
              className={`grid grid-cols-4 gap-2 items-center p-3 rounded-xl transition-all duration-300 ${
                set.completed 
                  ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 border border-green-300 dark:border-green-600' 
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="font-bold text-gray-700 dark:text-gray-300 flex items-center">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                  set.completed ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  {index + 1}
                </span>
              </div>
              
              <div>
                {isEditing ? (
                  <input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => handleSetUpdate(index, 'weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    step="0.5"
                    placeholder=""
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {set.weight ? `${set.weight}Kg` : '--'}
                  </span>
                )}
              </div>
              
              <div>
                {isEditing ? (
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleSetUpdate(index, 'reps', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{set.reps}</span>
                )}
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSetToggle(index);
                  }}
                  className={`transition-all duration-300 transform hover:scale-110 ${
                    set.completed
                      ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
                  }`}
                >
                  {set.completed ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : (
                    <Circle className="w-7 h-7" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => isEditing ? handleDone() : setIsEditing(true)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>

      
        {showPerformance && performanceData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Recent Progress</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Last 3 sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              {performanceData.slice(-3).map((data, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden relative"
                >
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-600 w-full transition-all duration-500 rounded-full flex items-end justify-center text-xs font-bold text-white"
                    style={{
                      height: `${Math.min((data.maxWeight / Math.max(...performanceData.map(d => d.maxWeight))) * 100, 100)}%`,
                      minHeight: '20px'
                    }}
                  >
                    {data.maxWeight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
