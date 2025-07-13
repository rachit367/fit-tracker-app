const mongoose=require('mongoose');

const workoutSetSchema=mongoose.Schema({
    reps: Number,
    weight: Number,
    completed: Boolean,
});


module.exports = mongoose.model('WorkoutSet', workoutSetSchema);