const validateWorkoutUpdate = (req, res, next) => {
    const { workoutId, workoutData } = req.body;
    if (!workoutId || !workoutData) {
        return res.status(400).json({ error: 'Missing required fields: workoutId and workoutData' });
    }
    next();
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