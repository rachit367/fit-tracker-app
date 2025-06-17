const mongoose=require('mongoose');

const WorkoutSchema=mongoose.Schema({
  userId: String,
  date: {
    type:Date,
    default:Date.now
  },
  name: String,
  exercises: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'WorkoutExercise'
  }],
  duration: Number,
  completed: Boolean,
  xpEarned: Number
});


module.exports = mongoose.model('Workout', WorkoutSchema);