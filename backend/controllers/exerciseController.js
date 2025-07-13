const { decodeCookie } = require('../utils/cookie');
const exerciseModel=require('../models/Exercise');
const { generateToken } = require('../utils/generateToken');


module.exports.defaultExercises=async(req,res)=>{
    try{
        let user;
        try {
            user = decodeCookie(req,res);
        } catch (error) {
            // If user is not authenticated, return only default exercises
            const DEFAULT_EXERCISES = await exerciseModel.find({user:'default'});
            return res.json(DEFAULT_EXERCISES || []);
        }
        
        const DEFAULT_EXERCISES=await exerciseModel.find({user:'default'});
        const USER_EXERCISE=await exerciseModel.find({user:user._id});
        if(USER_EXERCISE.length===0){
            return res.json(DEFAULT_EXERCISES || []);
        }
        const combined=[...DEFAULT_EXERCISES,...USER_EXERCISE];
        const unique = [];
        const seen = new Set();

        for (let exercise of combined) {
            const key = `${exercise.name.toLowerCase()}-${exercise.muscleGroup.toLowerCase()}`;
            if (!seen.has(key)) {
            seen.add(key);
            unique.push(exercise);
        }
    }
    return res.json(unique || []);
    
    }catch(err){
        console.error('Error in defaultExercises:', err);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports.addExercise=async(req,res)=>{
    try{
        let user=await decodeCookie(req,res);
        const exercise=req.body.exercise;
        let newExercise=await exerciseModel.create({name:exercise.name,
            muscleGroup:exercise.muscleGroup,
            isCustom:exercise.isCustom,
            user:user._id});
        return res.json(newExercise);
    }catch(err){
        res.status(500).json({ error: 'Failed to add exercise' });
    }
}

module.exports.removeExercise=async(req,res)=>{
    try{
        const id=req.body.exerciseId;
        await exerciseModel.deleteOne({_id:id,isCustom:true});
    }catch(err){
        return res.status(500).json({ success: false, message: 'Failed to delete exercise' });
    }
}

module.exports.exerciseInfo = async (req, res) => {
    try {
        const exercise = await exerciseModel.findById(req.body.selectedExercise);
        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        return res.json(exercise);
    } catch (err) {
        console.error('Error fetching exercise info:', err);
        return res.status(500).json({ error: 'Failed to fetch exercise info' });
    }
};

