const exerciseModel=require('../models/Exercise');
const predefinedExercises = [
  // Chest
  { name: 'Bench Press', muscleGroup: 'Chest', isCustom: false, user: 'default' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', isCustom: false, user: 'default' },
  { name: 'Push-ups', muscleGroup: 'Chest', isCustom: false, user: 'default' },
  { name: 'Dumbbell Flyes', muscleGroup: 'Chest', isCustom: false, user: 'default' },
  
  // Back
  { name: 'Deadlift', muscleGroup: 'Back', isCustom: false, user: 'default' },
  { name: 'Pull-ups', muscleGroup: 'Back', isCustom: false, user: 'default' },
  { name: 'Barbell Rows', muscleGroup: 'Back', isCustom: false, user: 'default' },
  { name: 'Lat Pulldowns', muscleGroup: 'Back', isCustom: false, user: 'default' },
  
  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'Shoulders', isCustom: false, user: 'default' },
  { name: 'Lateral Raises', muscleGroup: 'Shoulders', isCustom: false, user: 'default' },
  { name: 'Rear Delt Flyes', muscleGroup: 'Shoulders', isCustom: false, user: 'default' },
  
  // Arms
  { name: 'Bicep Curls', muscleGroup: 'Arms', isCustom: false, user: 'default' },
  { name: 'Tricep Dips', muscleGroup: 'Arms', isCustom: false, user: 'default' },
  { name: 'Hammer Curls', muscleGroup: 'Arms', isCustom: false, user: 'default' },
  { name: 'Close-Grip Bench Press', muscleGroup: 'Arms', isCustom: false, user: 'default' },
  
  // Legs
  { name: 'Squats', muscleGroup: 'Legs', isCustom: false, user: 'default' },
  { name: 'Leg Press', muscleGroup: 'Legs', isCustom: false, user: 'default' },
  { name: 'Lunges', muscleGroup: 'Legs', isCustom: false, user: 'default' },
  { name: 'Leg Curls', muscleGroup: 'Legs', isCustom: false, user: 'default' },
  { name: 'Calf Raises', muscleGroup: 'Legs', isCustom: false, user: 'default' },
  
  // Core
  { name: 'Plank', muscleGroup: 'Core', isCustom: false, user: 'default' },
  { name: 'Crunches', muscleGroup: 'Core', isCustom: false, user: 'default' },
  { name: 'Russian Twists', muscleGroup: 'Core', isCustom: false, user: 'default' },
  { name: 'Mountain Climbers', muscleGroup: 'Core', isCustom: false, user: 'default' },
  
  // Cardio
  { name: 'Treadmill', muscleGroup: 'Cardio', isCustom: false, user: 'default' },
  { name: 'Cycling', muscleGroup: 'Cardio', isCustom: false, user: 'default' },
  { name: 'Elliptical', muscleGroup: 'Cardio', isCustom: false, user: 'default' },
  { name: 'Rowing', muscleGroup: 'Cardio', isCustom: false, user: 'default' }
];

module.exports.seedExercises=async()=>{
    try{
        const count=await exerciseModel.countDocuments();
        if(count===0){
            await exerciseModel.insertMany(predefinedExercises);
        }
    }catch(err){
        console.error('Error seeding exercises:', err);
    }
}