const userModel=require('../models/User');
const bcrypt=require('bcrypt');
const cookieParser=require('cookie-parser');
const {generateToken}=require('../utils/generateToken');

module.exports.loginUser = async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.body.email });


        if (!user) {
            return res.status(404).send("User not found");
        }

        let encrypted = user.password;
        let result = await bcrypt.compare(req.body.password, encrypted);

        if (result == true) {
            let token = generateToken(user);

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'Lax',
                secure: false,  
                maxAge: 7 * 24 * 60 * 60 * 1000  
            });

            return res.json(user);
        } else {
            res.status(401).send("Invalid password");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};


module.exports.registerUser=async function(req,res){
    try{
        let existinguser=await userModel.findOne({email:req.body.email});
        if(existinguser){
            return res.send("User already exist");
        }
        let hash=await bcrypt.hash(req.body.password,10);
        let user=await userModel.create({
                name:req.body.name,
                email:req.body.email,
                age:req.body.age,
                password:hash,
                weight:req.body.weight,
                fitnessGoal:req.body.fitnessGoal
            });
        let token=generateToken(user);
        res.cookie('token',token,{
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
});
        return res.json(user);
        }catch(err){
            console.error(err);
            res.status(500).send(err.message);
        }
    }

module.exports.logoutUser=(req,res)=>{
    res.clearCookie('token');
    res.send("logged out");
}

module.exports.editUser=async (req,res)=>{
    try{
        let update=req.body;
        let user=await userModel.findById(update._id);
        user.name=update.name;
        user.email=update.email;
        user.age=update.age;
        user.fitnessGoal=update.fitnessGoal;
        user.weight=update.weight;
        await user.save();
        return res.json(user);
    }catch(err){
        res.status(500).send(err.message);
    }
}