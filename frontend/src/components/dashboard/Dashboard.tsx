import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { TodaysWorkout } from './TodaysWorkout';
import { Calendar } from './Calendar';
import { PerformanceGraph } from './PerformanceGraph';
import { MuscleTargets } from './MuscleTargets';
import { UserStats } from './UserStats';
import { ActivityHeatmap } from './ActivityHeatmap';
import { Calendar as CalendarIcon, TrendingUp, Target, Home, Trophy, Zap, Activity, Moon, Sun } from 'lucide-react';

type TabType = 'today' | 'calendar' | 'performance' | 'targets' | 'heatmap';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const { isDarkMode, toggleDarkMode } = useTheme();

  const tabs = [
    { id: 'today' as TabType, label: 'Today', icon: Home },
    { id: 'heatmap' as TabType, label: 'Heatmap', icon: Activity },
    { id: 'calendar' as TabType, label: 'Calendar', icon: CalendarIcon },
    { id: 'performance' as TabType, label: 'Stats', icon: TrendingUp },
    { id: 'targets' as TabType, label: 'Progress', icon: Target },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <div className="space-y-6">
            <UserStats />
            <TodaysWorkout />
          </div>
        );
      case 'heatmap':
        return (
          <div className="space-y-6">
            <ActivityHeatmap />
            <UserStats />
          </div>
        );
      case 'calendar':
        return <Calendar />;
      case 'performance':
        return <PerformanceGraph />;
      case 'targets':
        return <MuscleTargets />;
      default:
        return (
          <div className="space-y-6">
            <UserStats />
            <TodaysWorkout />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
  
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FitTracker Pro</h1>
                <p className="text-blue-100 dark:text-gray-300 text-sm">Your fitness journey starts here</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
             
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </button>
              <div className="text-right">
                <div className="text-white font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-blue-100 dark:text-gray-300 text-sm">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

   
      <div className="max-w-6xl mx-auto px-4 py-6">
        {renderContent()}
      </div>

      
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 shadow-2xl transition-colors duration-300">
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center py-3 px-3 transition-all duration-300 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 transform -translate-y-1'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                )}
                <div className={`relative ${isActive ? 'animate-bounce' : ''}`}>
                  <Icon className="w-6 h-6 mb-1" />
                  {isActive && (
                    <div className="absolute -inset-2 bg-blue-100 dark:bg-blue-900/30 rounded-full -z-10 animate-pulse"></div>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      
      <div className="h-24"></div>
    </div>
  );
};