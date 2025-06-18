import React, { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { Activity, Calendar, X, BarChart3 } from 'lucide-react';

interface WorkoutDetail {
  date: string;
  workouts: Array<{
    name: string;
    exercises: Array<{
      name: string;
      muscleGroup: string;
      sets: Array<{
        reps: number;
        weight: number;
      }>;
    }>;
  }>;
}

export const ActivityHeatmap: React.FC = () => {
  const { workouts } = useWorkouts();
  const [selectedDate, setSelectedDate] = useState<WorkoutDetail | null>(null);


  const generateHeatmapData = () => {
    const heatmapData = [];
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayWorkouts = workouts.filter(w => w.date === dateString);
      const completedWorkouts = dayWorkouts.filter(w => w.completed);
      
      let intensity = 0;
      if (completedWorkouts.length === 0) intensity = 0;
      else if (completedWorkouts.length === 1) intensity = 1;
      else if (completedWorkouts.length === 2) intensity = 2;
      else if (completedWorkouts.length >= 3) intensity = 3;
      
      heatmapData.push({
        date: dateString,
        day: date.getDate(),
        intensity,
        workoutCount: completedWorkouts.length,
        dayOfWeek: date.getDay(),
        workouts: completedWorkouts
      });
    }
    
    return heatmapData;
  };

  const heatmapData = generateHeatmapData();
  

  const weeklyData = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeklyData.push(heatmapData.slice(i, i + 7));
  }

  const totalWorkouts = heatmapData.reduce((sum, d) => sum + d.workoutCount, 0);
  const activeDays = heatmapData.filter(d => d.workoutCount > 0).length;
  const consistency = Math.round((activeDays / heatmapData.length) * 100);

  const handleDateClick = (dayData: any) => {
    if (dayData.workouts.length > 0) {
      const workoutDetails: WorkoutDetail = {
        date: dayData.date,
        workouts: dayData.workouts.map((workout: any) => ({
          name: workout.name,
          exercises: workout.exercises.map((exercise: any) => ({
            name: exercise.exercise.name,
            muscleGroup: exercise.exercise.muscleGroup,
            sets: exercise.sets.map((set: any) => ({
              reps: set.reps,
              weight: set.weight
            }))
          }))
        }))
      };
      setSelectedDate(workoutDetails);
    }
  };

  const getMuscleGroupsForDate = (workouts: any[]) => {
    const muscleGroups = new Set();
    workouts.forEach(workout => {
      workout.exercises.forEach((exercise: any) => {
        muscleGroups.add(exercise.muscleGroup);
      });
    });
    return Array.from(muscleGroups);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activity Heatmap</h3>
            <p className="text-gray-600 dark:text-gray-400">Your workout consistency over time</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-1" />
          Last 13 weeks
        </div>
      </div>
      
  
      <div className="bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-700 dark:to-green-900/20 p-6 rounded-xl overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          
          <div className="flex flex-col space-y-1 mr-3">
            <div className="h-4"></div> 
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="h-4 text-xs text-gray-500 dark:text-gray-400 flex items-center font-medium">
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
       
          {weeklyData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col space-y-1">
            
              <div className="h-4 text-xs text-gray-600 dark:text-gray-400 text-center font-medium">
                {weekIndex % 4 === 0 && week[0] ? 
                  new Date(week[0].date).toLocaleDateString('en-US', { month: 'short' }) : 
                  ''
                }
              </div>
              
              
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const dayData = week[dayIndex];
                if (!dayData) {
                  return <div key={dayIndex} className="w-4 h-4"></div>;
                }
                
                return (
                  <div
                    key={dayIndex}
                    onClick={() => handleDateClick(dayData)}
                    className={`
                      w-4 h-4 rounded-sm cursor-pointer transition-all duration-300 hover:scale-125 hover:shadow-lg border
                      ${dayData.intensity === 0 ? 'bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500' : ''}
                      ${dayData.intensity === 1 ? 'bg-green-200 dark:bg-green-800 border-green-300 dark:border-green-700 hover:bg-green-300 dark:hover:bg-green-700' : ''}
                      ${dayData.intensity === 2 ? 'bg-green-400 dark:bg-green-600 border-green-500 dark:border-green-500 hover:bg-green-500 dark:hover:bg-green-500' : ''}
                      ${dayData.intensity === 3 ? 'bg-green-600 dark:bg-green-500 border-green-700 dark:border-green-400 hover:bg-green-700 dark:hover:bg-green-400' : ''}
                    `}
                    title={`${dayData.workoutCount} workout${dayData.workoutCount !== 1 ? 's' : ''} on ${new Date(dayData.date).toLocaleDateString()}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
  
      <div className="mt-6 space-y-4">
    
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Less active</span>
          <div className="flex items-center space-x-1">
            <span className="mr-2 font-medium">More active</span>
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-sm border border-gray-300 dark:border-gray-500"></div>
            <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded-sm border border-green-300 dark:border-green-700"></div>
            <div className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded-sm border border-green-500 dark:border-green-500"></div>
            <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm border border-green-700 dark:border-green-400"></div>
          </div>
        </div>
        

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{activeDays}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Active Days</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{totalWorkouts}</div>
            <div className="text-sm text-green-600 dark:text-green-400 font-medium">Total Workouts</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{consistency}%</div>
            <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Consistency</div>
          </div>
        </div>
      </div>

 
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {new Date(selectedDate.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Muscle Groups: {getMuscleGroupsForDate(selectedDate.workouts).join(', ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedDate.workouts.map((workout, workoutIndex) => (
                <div key={workoutIndex} className="mb-6 last:mb-0">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    {workout.name}
                  </h4>
                  
                  <div className="space-y-4">
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h5>
                          <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                            {exercise.muscleGroup}
                          </span>
                        </div>
                        
                     
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                            <div>Set</div>
                            <div>Weight</div>
                            <div>Reps</div>
                          </div>
                          {exercise.sets.map((set, setIndex) => (
                            <div key={setIndex} className="grid grid-cols-3 gap-2 text-sm">
                              <div className="font-medium text-gray-900 dark:text-white">{setIndex + 1}</div>
                              <div className="text-gray-700 dark:text-gray-300">{set.weight}Kg</div>
                              <div className="text-gray-700 dark:text-gray-300">{set.reps}</div>
                            </div>
                          ))}
                        </div>
                        
               
                        <div className="mt-4">
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight Distribution</h6>
                          <div className="flex items-end space-x-1 h-16 bg-gray-100 dark:bg-gray-600 rounded p-2">
                            {exercise.sets.map((set, setIndex) => {
                              const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
                              const height = maxWeight > 0 ? (set.weight / maxWeight) * 100 : 0;
                              return (
                                <div key={setIndex} className="flex-1 flex flex-col items-center">
                                  <div
                                    className="bg-gradient-to-t from-blue-500 to-blue-600 w-full rounded transition-all duration-300 min-h-[4px] flex items-end justify-center text-xs font-bold text-white"
                                    style={{ height: `${height}%` }}
                                    title={`Set ${setIndex + 1}: ${set.weight}Kg × ${set.reps}`}
                                  >
                                    {height > 30 && set.weight}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {setIndex + 1}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                       
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">Reps Distribution</h6>
                          <div className="flex items-end space-x-1 h-12 bg-gray-100 dark:bg-gray-600 rounded p-2">
                            {exercise.sets.map((set, setIndex) => {
                              const maxReps = Math.max(...exercise.sets.map(s => s.reps));
                              const height = maxReps > 0 ? (set.reps / maxReps) * 100 : 0;
                              return (
                                <div key={setIndex} className="flex-1 flex flex-col items-center">
                                  <div
                                    className="bg-gradient-to-t from-green-500 to-green-600 w-full rounded transition-all duration-300 min-h-[4px] flex items-end justify-center text-xs font-bold text-white"
                                    style={{ height: `${height}%` }}
                                    title={`Set ${setIndex + 1}: ${set.reps} reps`}
                                  >
                                    {height > 30 && set.reps}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};