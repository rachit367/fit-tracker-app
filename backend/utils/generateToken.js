const jwt=require('jsonwebtoken');
module.exports.generateToken=function(user){
    return jwt.sign({_id:user._id,email:user.email},process.env.SECRET_KEY);
}