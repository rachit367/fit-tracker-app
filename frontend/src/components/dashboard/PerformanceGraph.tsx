import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import axios from 'axios';
const URL=import.meta.env.VITE_BACKEND_URL;
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';
import {Exercise} from '../../types/fitness';

export const PerformanceGraph: React.FC = () => {
  const { workouts, getPerformanceData } = useWorkouts();
  const [selectedExercise, setSelectedExercise] = useState('');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [DEFAULT_EXERCISES, setD_E] = useState<Exercise[]>([]);
  const [selectedExerciseInfo, setSEI] = useState<Exercise>();
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  
  const days = useMemo(() => 
    timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90,
    [timeRange]
  );

  const performanceData = useMemo(() => 
    getPerformanceData(selectedExercise, days),
    [selectedExercise, days, getPerformanceData]
  );

  const stats = useMemo(() => {
    const totalSessions = performanceData.length;
    const avgWeight = totalSessions > 0 
      ? Math.round(performanceData.reduce((sum, data) => sum + data.maxWeight, 0) / totalSessions)
      : 0;
    const totalVolume = Math.round(performanceData.reduce((sum, data) => sum + data.totalVolume, 0));
    const progressPercentage = totalSessions > 1
      ? Math.round(((performanceData[performanceData.length - 1]?.maxWeight || 0) - 
                    (performanceData[0]?.maxWeight || 0)) / (performanceData[0]?.maxWeight || 1) * 100)
      : 0;

    return { totalSessions, avgWeight, totalVolume, progressPercentage };
  }, [performanceData]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoadingExercises(true);
        const response = await axios.get(`${URL}/exercise/defaultexercises`, { withCredentials: true });
        setD_E(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
        setD_E([]);
      } finally {
        setIsLoadingExercises(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const exerciseInfo = async () => {
      if (!selectedExercise) return;
      
      try {
        const response = await axios.post(
          `${URL}/exercise/exerciseinfo`,
          { selectedExercise },
          { withCredentials: true }
        );
        if (isMounted && response.data) {
          setSEI(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch exercise info:', error);
        if (isMounted) {
          setSEI(undefined);
        }
      }
    };

    exerciseInfo();

    return () => {
      isMounted = false;
    };
  }, [selectedExercise]);

  return (
    <div className="space-y-6">
    
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
          <div className="flex items-center space-x-3">
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoadingExercises}
            >
              <option value="">{isLoadingExercises ? 'Loading exercises...' : 'Select an exercise'}</option>
              {Array.isArray(DEFAULT_EXERCISES) ? DEFAULT_EXERCISES.map(exercise => (
                <option key={exercise._id} value={exercise._id}>
                  {exercise.name}
                </option>
              )) : []}
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'quarter')}
              className="px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
            </select>
          </div>
        </div>

      
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full mb-2 mx-auto">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSessions}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full mb-2 mx-auto">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.avgWeight}Kg</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Weight</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full mb-2 mx-auto">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalVolume}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full mb-2 mx-auto">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className={`text-2xl font-bold ${stats.progressPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {stats.progressPercentage > 0 ? '+' : ''}{stats.progressPercentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
          </div>
        </div>
      </div>

    
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {selectedExerciseInfo?.name} Progress Chart
        </h3>
        
        {performanceData.length > 0 ? (
          <div className="space-y-6">

            <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 p-6 rounded-xl">
              <div className="h-80 flex items-end space-x-2 overflow-x-auto">
                {performanceData.map((data, index) => {
                  const maxWeight = Math.max(...performanceData.map(d => d.maxWeight));
                  const height = maxWeight > 0 ? ((data.maxWeight / maxWeight) * 80) + 20 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center min-w-[50px] group">
                      <div className="relative">
                       
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          {data.maxWeight}Kg<br/>
                          Vol: {data.totalVolume}<br/>
                          {new Date(data.date).toLocaleDateString()}
                        </div>
                        
                        <div
                          className="bg-gradient-to-t from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-300 dark:hover:to-blue-400 min-w-[40px] cursor-pointer shadow-lg hover:shadow-xl"
                          style={{ height: `${height}%`, minHeight: '20px' }}
                        >
                          
                          {index > 0 && (
                            <div className="absolute top-0 left-full w-2 h-0.5 bg-blue-400 dark:bg-blue-300 transform -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 transform rotate-45 origin-left">
                        {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Weight Progress Over Time</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span>Max Weight</span>
                  </div>
                </div>
              </div>
            </div>
            
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-400 border-b dark:border-gray-700">
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-right py-3 px-2">Max Weight</th>
                    <th className="text-right py-3 px-2">Total Volume</th>
                    <th className="text-right py-3 px-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.slice(-10).map((data, index, array) => {
                    const prevData = index > 0 ? array[index - 1] : null;
                    const weightChange = prevData ? data.maxWeight - prevData.maxWeight : 0;
                    
                    return (
                      <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">
                          {new Date(data.date).toLocaleDateString()}
                        </td>
                        <td className="text-right py-3 px-2 font-bold text-gray-900 dark:text-white">
                          {data.maxWeight}Kg
                        </td>
                        <td className="text-right py-3 px-2 text-gray-900 dark:text-white">
                          {data.totalVolume}
                        </td>
                        <td className={`text-right py-3 px-2 font-medium ${
                          weightChange > 0 ? 'text-green-600 dark:text-green-400' : 
                          weightChange < 0 ? 'text-red-600 dark:text-red-400' : 
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {weightChange > 0 ? '+' : ''}{weightChange || '--'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No performance data available</p>
            <p className="text-sm">Complete some workouts to see your progress</p>
          </div>
        )}
      </div>
    </div>
  );
};