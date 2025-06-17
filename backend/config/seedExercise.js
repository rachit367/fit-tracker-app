const exerciseModel=require('../models/Exercise');
const predefinedExercises = [
  // Chest
  { name: 'Bench Press', muscleGroup: 'Chest', isCustom: false },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', isCustom: false },
  { name: 'Push-ups', muscleGroup: 'Chest', isCustom: false },
  { name: 'Dumbbell Flyes', muscleGroup: 'Chest', isCustom: false },
  
  // Back
  { name: 'Deadlift', muscleGroup: 'Back', isCustom: false },
  { name: 'Pull-ups', muscleGroup: 'Back', isCustom: false },
  { name: 'Barbell Rows', muscleGroup: 'Back', isCustom: false },
  { name: 'Lat Pulldowns', muscleGroup: 'Back', isCustom: false },
  
  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'Shoulders', isCustom: false },
  { name: 'Lateral Raises', muscleGroup: 'Shoulders', isCustom: false },
  { name: 'Rear Delt Flyes', muscleGroup: 'Shoulders', isCustom: false },
  
  // Arms
  { name: 'Bicep Curls', muscleGroup: 'Arms', isCustom: false },
  { name: 'Tricep Dips', muscleGroup: 'Arms', isCustom: false },
  { name: 'Hammer Curls', muscleGroup: 'Arms', isCustom: false },
  { name: 'Close-Grip Bench Press', muscleGroup: 'Arms', isCustom: false },
  
  // Legs
  { name: 'Squats', muscleGroup: 'Legs', isCustom: false },
  { name: 'Leg Press', muscleGroup: 'Legs', isCustom: false },
  { name: 'Lunges', muscleGroup: 'Legs', isCustom: false },
  { name: 'Leg Curls', muscleGroup: 'Legs', isCustom: false },
  { name: 'Calf Raises', muscleGroup: 'Legs', isCustom: false },
  
  // Core
  { name: 'Plank', muscleGroup: 'Core', isCustom: false },
  { name: 'Crunches', muscleGroup: 'Core', isCustom: false },
  { name: 'Russian Twists', muscleGroup: 'Core', isCustom: false },
  { name: 'Mountain Climbers', muscleGroup: 'Core', isCustom: false },
  
  // Cardio
  { name: 'Treadmill', muscleGroup: 'Cardio', isCustom: false },
  { name: 'Cycling', muscleGroup: 'Cardio', isCustom: false },
  { name: 'Elliptical', muscleGroup: 'Cardio', isCustom: false },
  { name: 'Rowing', muscleGroup: 'Cardio', isCustom: false }
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