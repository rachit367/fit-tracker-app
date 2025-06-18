const workoutSetModel = require('../models/WorkoutSet');
const workoutExerciseModel = require('../models/WorkoutExercise');

module.exports.addSet = async (req, res) => {
    try {
        const { newSet, exercise } = req.body;
        
        // Create the new set
        const createdSet = await workoutSetModel.create(newSet);
        
        // Find the exercise and add the set to it
        const workoutExercise = await workoutExerciseModel.findById(exercise._id);
        if (!workoutExercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        
        workoutExercise.sets.push(createdSet._id);
        await workoutExercise.save();
        
        return res.json(createdSet);
    } catch (err) {
        console.error('Error adding set:', err);
        return res.status(500).json({ error: 'Failed to add set' });
    }
}; 