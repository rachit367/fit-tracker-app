const mongoose=require('mongoose');

const WorkoutExerciseSchema=mongoose.Schema({
  exercisename: String,
  exercise: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Exercise'
  },
  sets:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'WorkoutSet'
}],
  notes:{
    type:String,
    default:''
  }
})

module.exports = mongoose.model('WorkoutExercise', WorkoutExerciseSchema);