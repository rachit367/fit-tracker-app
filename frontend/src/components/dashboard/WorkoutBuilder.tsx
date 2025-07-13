import React, { useState, useEffect, useRef } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { Workout, Exercise, MUSCLE_GROUPS } from '../../types/fitness';
import { X, Plus, Search, Trash2 } from 'lucide-react';
import axios from 'axios';

const URL = import.meta.env.VITE_BACKEND_URL;

interface WorkoutBuilderProps {
  workout?: Workout;
  targetDate?: string;
  onClose: () => void;
  onSave: () => void;
}

export const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  workout,
  targetDate,
  onClose,
  onSave
}) => {
  const { addWorkout, updateWorkout, getPerformanceData } = useWorkouts();
  const containerRef = useRef<HTMLDivElement>(null);

  const [workoutName, setWorkoutName] = useState(workout?.name || 'New Workout');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(
    workout?.exercises.map(e => e.exercise) || []
  );
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('All');
  const [customExerciseName, setCustomExerciseName] = useState('');
  const [customMuscleGroup, setCustomMuscleGroup] = useState<string>('Chest');

  // Preserve scroll position during component updates
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('workoutBuilderScroll');
    if (savedScroll && containerRef.current) {
      setTimeout(() => {
        containerRef.current!.scrollTop = parseInt(savedScroll);
      }, 100);
    }
  }, []);

  // Save scroll position before updates
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        sessionStorage.setItem('workoutBuilderScroll', containerRef.current.scrollTop.toString());
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);


  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`${URL}/exercise/defaultexercises`,{ withCredentials: true });
        setAvailableExercises(response.data);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = availableExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroup === 'All' || exercise.muscleGroup === selectedMuscleGroup;
    return matchesSearch && matchesMuscleGroup;
  });

  const getLastWorkoutWeight = (exerciseId: string) => {
    const performanceData = getPerformanceData(exerciseId, 7);
    if (performanceData.length > 0) {
      return performanceData[performanceData.length - 1]?.maxWeight || 0;
    }
    return 0;
  };

  const handleAddExercise = async (exercise: Exercise) => {
  if (!selectedExercises.find(e => e._id === exercise._id)) {
    try {
      setSelectedExercises([...selectedExercises, exercise]);
    } catch (error) {
      console.error('Failed to add exercise:', error);
    }
  }
};

  const handleRemoveExercise = async (exerciseId: string) => {
    try {
      setSelectedExercises(selectedExercises.filter(e => e._id !== exerciseId));
    } catch (error) {
      console.error('Failed to remove exercise:', error);
    }
  };

  const handleAddCustomExercise = async () => {
    if (customExerciseName.trim()) {
      const newExercise = {
        name: customExerciseName.trim(),
        muscleGroup: customMuscleGroup,
        isCustom: true
      };

      try {
        const response = await axios.post(`${URL}/exercise/add`, { exercise: newExercise },{ withCredentials: true });
      setSelectedExercises(prev => [...prev, response.data]);
      setAvailableExercises(prev => [...prev, response.data]);
        setCustomExerciseName('');
      } catch (error) {
        console.error('Failed to add custom exercise:', error);
      }
    }
  };

  const handleSave = () => {
    if (selectedExercises.length === 0) return;

    const workoutData: Workout = {
  _id: workout?._id || '',  
  userId: workout?.userId || '',
  name: workoutName,
  date: targetDate || new Date().toISOString().split('T')[0],
  exercises: selectedExercises.map(exercise => {
    const lastWeight = getLastWorkoutWeight(exercise._id);
    return {
      _id: exercise._id,
      exercisename: exercise.name,
      exercise: exercise,
      sets: [
        { id: `set-1`, reps: 8, weight: lastWeight, completed: false },
        { id: `set-2`, reps: 8, weight: lastWeight, completed: false },
        { id: `set-3`, reps: 8, weight: lastWeight, completed: false }
      ],
      notes: ''
    };
  }),
  completed: false
};

    if (workout) {
      updateWorkout(workout._id, workoutData);
    } else {
      addWorkout(workoutData);
    }

    // Clear scroll position when saving
    sessionStorage.removeItem('workoutBuilderScroll');
    onSave();
  };

  const handleClose = () => {
    // Clear scroll position when closing
    sessionStorage.removeItem('workoutBuilderScroll');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div ref={containerRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        
        <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {workout ? 'Edit Workout' : 'Create Workout'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {targetDate || new Date().toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">

          <div className="lg:w-1/2 p-6 border-r dark:border-gray-700 overflow-y-auto">

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workout Name
              </label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Enter workout name"
              />
            </div>


            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Search exercises..."
                />
              </div>
            </div>


            <div className="mb-4">
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="All">All Muscle Groups</option>
                {MUSCLE_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>


            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add Custom Exercise</h4>
              <input
                type="text"
                value={customExerciseName}
                onChange={(e) => setCustomExerciseName(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg mb-2 dark:bg-gray-600 dark:text-white"
                placeholder="Exercise name"
              />
              <div className="flex space-x-2">
                <select
                  value={customMuscleGroup}
                  onChange={(e) => setCustomMuscleGroup(e.target.value)}
                  className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
                >
                  {MUSCLE_GROUPS.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddCustomExercise}
                  disabled={!customExerciseName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>


            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Available Exercises</h4>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredExercises.map(exercise => (
                  <button
                    key={exercise._id}
                    onClick={() => handleAddExercise(exercise)}
                    disabled={selectedExercises.some(e => e._id === exercise._id)}
                    className="w-full text-left p-3 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{exercise.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{exercise.muscleGroup}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>


          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Selected Exercises</h4>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''}
              </span>
            </div>

            {selectedExercises.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No exercises selected</p>
                <p className="text-sm">Add exercises from the left panel</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedExercises.map(exercise => (
                  <div
                    key={exercise._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{exercise.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{exercise.muscleGroup}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveExercise(exercise._id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="p-6 border-t dark:border-gray-700 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedExercises.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {workout ? 'Update Workout' : 'Create Workout'}
          </button>
        </div>
      </div>
    </div>
  );
};
