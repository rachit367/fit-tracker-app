const userModel=require('../models/User');
const jwt=require('jsonwebtoken');

const isLoggedIn=async(req,res,next)=>{
    const token=req.cookies.token;  //_id:_id,email:email
    if(!token){
        return res.status(401).json({ message: 'Unauthorized: No token' });
    }
    try{
        let decoded=jwt.verify(token,process.env.SECRET_KEY);
        const user=await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        req.user=user;
        next();
    }catch(err){
        console.error('ERROR',err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports=isLoggedIn;