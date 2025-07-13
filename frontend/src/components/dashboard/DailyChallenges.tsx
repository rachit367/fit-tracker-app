import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DailyChallenge } from '../../types/fitness';
import { generateDailyChallenge } from '../../data/challenges';
import { Target, Gift, CheckCircle, Clock, Zap } from 'lucide-react';

export const DailyChallenges: React.FC = () => {
  const { user, addXp } = useAuth();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);

  useEffect(() => {
    
    const today = new Date().toDateString();
    const savedChallenge = localStorage.getItem(`challenge_${today}`);
    
    if (savedChallenge) {
      setChallenge(JSON.parse(savedChallenge));
    } else {
      const newChallenge = generateDailyChallenge();
      setChallenge(newChallenge);
      localStorage.setItem(`challenge_${today}`, JSON.stringify(newChallenge));
    }
  }, []);

  const completeChallenge = () => {
    if (challenge && !challenge.completed) {
      const completedChallenge = { ...challenge, completed: true, progress: challenge.target };
      setChallenge(completedChallenge);
      
      
      const today = new Date().toDateString();
      localStorage.setItem(`challenge_${today}`, JSON.stringify(completedChallenge));
      
     
      addXp(challenge.xpReward);
    }
  };

  if (!challenge) return null;

  const progressPercentage = (challenge.progress / challenge.target) * 100;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border border-orange-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Daily Challenge</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Resets in {24 - new Date().getHours()} hours
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-orange-600 mb-1">
            <Zap className="w-5 h-5 mr-1" />
            <span className="font-bold">{challenge.xpReward} XP</span>
          </div>
          {challenge.completed && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Completed!</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-1">{challenge.title}</h4>
        <p className="text-gray-600 text-sm">{challenge.description}</p>
      </div>

 
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {challenge.progress}/{challenge.target}
          </span>
        </div>
        <div className="relative">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                challenge.completed 
                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              {challenge.completed && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              )}
            </div>
          </div>
          {challenge.completed && (
            <div className="absolute right-0 top-0 transform translate-x-2 -translate-y-1">
              <Gift className="w-4 h-4 text-green-500 animate-bounce" />
            </div>
          )}
        </div>
      </div>

   
      {!challenge.completed && (
        <button
          onClick={completeChallenge}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Mark as Complete
        </button>
      )}

      {challenge.completed && (
        <div className="text-center py-3">
          <div className="inline-flex items-center text-green-600 font-medium">
            <CheckCircle className="w-5 h-5 mr-2" />
            Challenge Completed! +{challenge.xpReward} XP
          </div>
        </div>
      )}
    </div>
  );
};