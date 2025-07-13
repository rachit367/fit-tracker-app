const validateWorkoutUpdate = (req, res, next) => {
    const { workoutId, workoutData, updatedWorkouts } = req.body;
    
    // Allow bulk updates with updatedWorkouts array
    if (updatedWorkouts && Array.isArray(updatedWorkouts)) {
        return next();
    }
    
    // Allow single workout updates with workoutId and workoutData
    if (workoutId && workoutData) {
        return next();
    }
    
    return res.status(400).json({ 
        error: 'Missing required fields: either (workoutId and workoutData) or (updatedWorkouts array)' 
    });
};

const validateWorkoutCreate = (req, res, next) => {
    const { workoutData } = req.body;
    if (!workoutData || !workoutData.name || !workoutData.exercises) {
        return res.status(400).json({ error: 'Missing required fields: name and exercises' });
    }
    next();
};

const validateExerciseUpdate = (req, res, next) => {
    const { exerciseId, updates } = req.body;
    if (!exerciseId || !updates) {
        return res.status(400).json({ error: 'Missing required fields: exerciseId and updates' });
    }
    next();
};

module.exports = {
    validateWorkoutUpdate,
    validateWorkoutCreate,
    validateExerciseUpdate
}; 