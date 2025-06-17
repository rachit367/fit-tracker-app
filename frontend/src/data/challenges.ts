import { DailyChallenge } from '../types/fitness';

export const generateDailyChallenge = (): DailyChallenge => {
  const challenges = [
    {
      title: 'Push-up Power',
      description: 'Complete 50 push-ups today',
      target: 50,
      xpReward: 200,
      type: 'reps' as const
    },
    {
      title: 'Squat Squad',
      description: 'Perform 100 squats',
      target: 100,
      xpReward: 250,
      type: 'reps' as const
    },
    {
      title: 'Exercise Explorer',
      description: 'Try 5 different exercises',
      target: 5,
      xpReward: 300,
      type: 'exercises' as const
    },
    {
      title: 'Iron Warrior',
      description: 'Lift a total of 5000 kg',
      target: 5000,
      xpReward: 400,
      type: 'weight' as const
    },
    {
      title: 'Endurance Elite',
      description: 'Work out for 45 minutes',
      target: 45,
      xpReward: 350,
      type: 'duration' as const
    }
  ];

  const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  
  return {
    id: `challenge-${Date.now()}`,
    ...randomChallenge,
    progress: 0,
    completed: false
  };
};