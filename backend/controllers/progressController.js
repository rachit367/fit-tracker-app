const userModel=require('../models/User');

module.exports.addXp=async(req,res)=>{
    try{
        let user=await userModel.findById(req.user._id);
        user.level=req.body.level;
        user.xp=req.body.xp;
        await user.save();
        return res.json(user);
    }catch(err){
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.addAchievement=async(req,res)=>{
    try{
        const achievements=req.body.achievements;
        const user=await userModel.findById(req.body.id);
        const newAchievements = req.body.achievements.filter(a =>
            !user.achievements.some(existing => existing.id === a.id)
        );
        user.achievements.push(...newAchievements);
        await user.save();
        return res.json(user);
    }catch(err){
        return res.status(500).send("Internal Server Error");
    }
}