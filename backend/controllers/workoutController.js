const userModel = require('../models/User');
const workoutModel = require('../models/Workout');
const { decodeCookie } = require('../utils/cookie');
const workoutExerciseModel = require('../models/WorkoutExercise');
const workoutSetModel = require('../models/WorkoutSet');

module.exports.savedWorkout = async (req, res) => {
    try {
        let user = decodeCookie(req, res);
        if (!user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        let savedworkouts = await workoutModel.find({ userId: user._id })
            .populate({
                path: 'exercises',
                populate: [
                    { path: 'sets', model: 'WorkoutSet' },
                    { path: 'exercise', model: 'Exercise' }
                ]
            })
            .sort({ date: -1 });

        return res.json({
            success: true,
            data: savedworkouts,
            message: 'Workouts fetched successfully'
        });
    } catch (err) {
        console.error('Failed to fetch workouts', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch workouts',
            details: err.message 
        });
    }
}

module.exports.updateWorkout = async (req, res) => {
    try {
        const { workoutId, workoutData, updatedWorkouts } = req.body;
        console.log('Update workout request:', { 
            hasWorkoutId: !!workoutId, 
            hasWorkoutData: !!workoutData, 
            hasUpdatedWorkouts: !!updatedWorkouts,
            updatedWorkoutsLength: updatedWorkouts?.length || 0
        });
        
        // Handle bulk update of multiple workouts
        if (updatedWorkouts) {
            console.log('Processing bulk update for', updatedWorkouts.length, 'workouts');
            const results = [];
            for (const workout of updatedWorkouts) {
                try {
                    const updatedWorkout = await workoutModel.findByIdAndUpdate(
                        workout._id,
                        workout,
                        { new: true }
                    ).populate({
                        path: 'exercises',
                        populate: [
                            { path: 'sets', model: 'WorkoutSet' },
                            { path: 'exercise', model: 'Exercise' }
                        ]
                    });
                    results.push(updatedWorkout);
                } catch (error) {
                    console.error('Error updating workout', workout._id, ':', error);
                    throw error;
                }
            }
            console.log('Bulk update completed successfully');
            return res.json({
                success: true,
                data: results,
                message: 'Workouts updated successfully'
            });
        }
        
        // Handle single workout update
        if (!workoutId || !workoutData) {
            return res.status(400).json({ 
                success: false,
                error: 'Missing required fields: workoutId and workoutData' 
            });
        }

        // Find the workout
        const workout = await workoutModel.findById(workoutId);
        if (!workout) {
            return res.status(404).json({ 
                success: false,
                error: 'Workout not found' 
            });
        }

        // Update workout fields while preserving the date
        workout.name = workoutData.name;
        workout.completed = workoutData.completed;
        workout.duration = workoutData.duration;
        workout.xpEarned = workoutData.xpEarned;
        workout.date = workout.date || new Date().toISOString().split('T')[0];

        // Update exercises
        if (workoutData.exercises) {
            try {
                // Remove old exercises and their sets
                const oldExercises = await workoutExerciseModel.find({ _id: { $in: workout.exercises } });
                for (const exercise of oldExercises) {
                    await workoutSetModel.deleteMany({ _id: { $in: exercise.sets } });
                }
                await workoutExerciseModel.deleteMany({ _id: { $in: workout.exercises } });
                
                // Create new exercises
                const newExerciseIds = [];
                for (const exerciseData of workoutData.exercises) {
                    const setIds = [];
                    
                    // Create sets for the exercise
                    for (const setData of exerciseData.sets) {
                        // Remove _id to let MongoDB generate a new one
                        const { _id, ...setDataWithoutId } = setData;
                        const newSet = await workoutSetModel.create(setDataWithoutId);
                        setIds.push(newSet._id);
                    }

                    // Create the exercise with the sets
                    const newExercise = await workoutExerciseModel.create({
                        exercisename: exerciseData.exercisename,
                        exercise: exerciseData.exercise._id,
                        sets: setIds,
                        notes: exerciseData.notes
                    });

                    newExerciseIds.push(newExercise._id);
                }

                workout.exercises = newExerciseIds;
            } catch (exerciseErr) {
                console.error('Error updating exercises:', exerciseErr);
                return res.status(500).json({ 
                    success: false,
                    error: 'Failed to update workout exercises',
                    details: exerciseErr.message
                });
            }
        }

        await workout.save();

        // Fetch the updated workout with populated data
        const updatedWorkout = await workoutModel.findById(workoutId)
            .populate({
                path: 'exercises',
                populate: [
                    { path: 'sets', model: 'WorkoutSet' },
                    { path: 'exercise', model: 'Exercise' }
                ]
            });

        return res.json({
            success: true,
            data: updatedWorkout,
            message: 'Workout updated successfully'
        });
    } catch (err) {
        console.error('Error updating workout:', err);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to update workout',
            details: err.message 
        });
    }
};

module.exports.addWorkout = async (req, res) => {
    try {
        let data = req.body.workoutData;
        let user = decodeCookie(req, res);
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'User not authenticated' 
            });
        }

        const workoutExerciseIds = [];

        for (let exerciseData of data.exercises) {
            const setIds = [];

            for (let setData of exerciseData.sets) {
                // Remove _id to let MongoDB generate a new one
                const { _id, ...setDataWithoutId } = setData;
                const newSet = await workoutSetModel.create(setDataWithoutId);
                setIds.push(newSet._id);
            }

            const newExercise = await workoutExerciseModel.create({
                exercisename: exerciseData.exercisename,
                exercise: exerciseData.exercise._id,
                sets: setIds,
                notes: exerciseData.notes
            });

            workoutExerciseIds.push(newExercise._id);
        }

        let workout = await workoutModel.create({
            userId: user._id,
            name: data.name,
            exercises: workoutExerciseIds,
            duration: data.duration,
            completed: data.completed,
            xpEarned: data.xpEarned,
            date: data.date || new Date().toISOString().split('T')[0]
        });

        const fullWorkout = await workoutModel.findById(workout._id)
            .populate({
                path: 'exercises',
                populate: [
                    { path: 'sets', model: 'WorkoutSet' },
                    { path: 'exercise', model: 'Exercise' }
                ]
            });

        return res.json({
            success: true,
            data: fullWorkout,
            message: 'Workout created successfully'
        });
    } catch (err) {
        console.error('Failed to create workout', err);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to create workout',
            details: err.message 
        });
    }
}

module.exports.todaysWorkout = async (req, res) => {
    try {
        let token = decodeCookie(req, res);
        let user = await userModel.findById(token._id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }

        // Get the last workout date
        const lastWorkout = await workoutModel.findOne({ userId: user._id })
            .sort({ date: -1 })
            .limit(1);

        if (lastWorkout) {
            const lastWorkoutDate = new Date(lastWorkout.date);
            const today = new Date();
            
            // Reset streak if more than 24 hours have passed since last workout
            const hoursSinceLastWorkout = (today - lastWorkoutDate) / (1000 * 60 * 60);
            if (hoursSinceLastWorkout > 24) {
                user.streak = 0;
            }
        }

        user.totalWorkouts = user.totalWorkouts + 1;
        user.streak = user.streak + 1;
        await user.save();

        return res.json({
            success: true,
            data: {
                message: "Workout recorded successfully",
                streak: user.streak,
                totalWorkouts: user.totalWorkouts,
                lastWorkoutDate: lastWorkout?.date,
                hoursSinceLastWorkout: lastWorkout ? 
                    (new Date() - new Date(lastWorkout.date)) / (1000 * 60 * 60) : null
            }
        });
    } catch (error) {
        console.error('Error in todaysWorkout:', error);
        return res.status(500).json({ 
            success: false,
            error: "Failed to update workout",
            details: error.message 
        });
    }
};