const userModel=require('../models/User');
const workoutModel=require('../models/Workout');
const { decodeCookie } = require('../utils/cookie');
const workoutExerciseModel = require('../models/WorkoutExercise');

module.exports.savedWorkout=async (req,res)=>{
    try {
    let user = decodeCookie(req, res);

    let savedworkouts = await workoutModel.find({ userId: user._id })
      .populate({
        path: 'exercises',
        populate: [
          { path: 'sets', model: 'WorkoutSet' },
          { path: 'exercise', model: 'Exercise' }
        ]
      });

    return res.json(savedworkouts);
  } catch (err) {
    console.error('Failed to fetch workouts', err);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
}

module.exports.updateWorkout=async(req,res)=>{
    try {
    let updatedWorkout = req.body.updatedWorkout;

    let workout = await workoutModel.findById(updatedWorkout._id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    workout.name = updatedWorkout.name;
    workout.duration = updatedWorkout.duration;
    workout.completed = updatedWorkout.completed;
    workout.xpEarned = updatedWorkout.xpEarned;

    await workout.save();

    for (let exerciseData of updatedWorkout.exercises) {
      let workoutExercise = await workoutExerciseModel.findById(exerciseData._id);
      if (workoutExercise) {
        workoutExercise.exercisename = exerciseData.exercisename;
        workoutExercise.notes = exerciseData.notes;

        for (let setData of exerciseData.sets) {
          let workoutSet = await workoutSetModel.findById(setData._id);
          if (workoutSet) {
            workoutSet.reps = setData.reps;
            workoutSet.weight = setData.weight;
            workoutSet.completed = setData.completed;
            await workoutSet.save();
          }
        }

        await workoutExercise.save();
      }
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to update workout', err);
    return res.status(500).json({ error: 'Failed to update workout' });
  }
}

module.exports.addWorkout=async(req,res)=>{
    try {
    let data = req.body.workoutData;
    let user = decodeCookie(req, res);

    const workoutExerciseIds = [];

    for (let exerciseData of data.exercises) {
      const setIds = [];

      for (let setData of exerciseData.sets) {
        const newSet = await workoutSetModel.create(setData);
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
      xpEarned: data.xpEarned
    });

    const fullWorkout = await workoutModel.findById(workout._id)
      .populate({
        path: 'exercises',
        populate: [
          { path: 'sets', model: 'WorkoutSet' },
          { path: 'exercise', model: 'Exercise' }
        ]
      });

    return res.json(fullWorkout);
  } catch (err) {
    console.error('Failed to create workout', err);
    return res.status(500).json({ error: 'Failed to create workout' });
  }
}

module.exports.todaysWorkout=async()=>{
  let token=decodeCookie(req,res);
  let user=await userModel.find({_id:token._id});
  user.totalWorkouts=user.totalWorkouts+1;
  user.streak=user.streak+1;
  await user.save();
}