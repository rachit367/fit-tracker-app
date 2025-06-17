const { decodeCookie } = require('../utils/cookie');
const exerciseModel=require('../models/Exercise');


module.exports.defaultExercises=async(req,res)=>{
    try{
        const DEFAULT_EXERCISES=await exerciseModel.find({user:'default'});
        return res.json(DEFAULT_EXERCISES);
    }catch(err){
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

module.exports.exerciseInfo=async(req,res)=>{
    let info=exerciseModel.findOne({name:req.body.selectedExercise});
    return res.json(info);
}

