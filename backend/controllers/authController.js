const userModel=require('../models/User');
const bcrypt=require('bcrypt');
const cookieParser=require('cookie-parser');
const {generateToken}=require('../utils/generateToken');

module.exports.loginUser = async function (req, res) {
    try {
        console.log('Login attempt for email:', req.body.email);
        
        let user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            console.log('User not found for email:', req.body.email);
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        let encrypted = user.password;
        let result = await bcrypt.compare(req.body.password, encrypted);

        if (result == true) {
            let token = generateToken(user);

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000  
            });

            console.log('Login successful for user:', user.email);
            return res.json({
                success: true,
                ...user.toObject()
            });
        } else {
            console.log('Invalid password for user:', req.body.email);
            res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false, 
            message: "Server error during login" 
        });
    }
};


module.exports.registerUser=async function(req,res){
    try{
        console.log('Registration attempt for email:', req.body.email);
        
        let existinguser=await userModel.findOne({email:req.body.email});
        if(existinguser){
            console.log('User already exists:', req.body.email);
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
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
            sameSite: 'None',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        console.log('Registration successful for user:', user.email);
        return res.json({
            success: true,
            ...user.toObject()
        });
        }catch(err){
            console.error('Registration error:', err);
            res.status(500).json({
                success: false,
                message: "Server error during registration"
            });
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