const mongoose=require('mongoose');

const ExerciseSchema=mongoose.Schema({
  name: String,
  muscleGroup: {
    type:String,
    enum:['Chest','Back','Shoulders','Arms','Legs','Core','Cardio']
  },
  isCustom: Boolean,
  user:{
    type:String,
    default:'default'
  }
})

module.exports = mongoose.model('Exercise', ExerciseSchema);