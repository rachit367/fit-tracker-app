const jwt=require('jsonwebtoken');
const generateToken=require('./generateToken');

module.exports.decodeCookie=(req,res)=>{
    let token=req.cookies.token;
    let decoded=jwt.verify(token,process.env.SECRET_KEY);
    return decoded;
}

module.exports.sendCookie=(req,res,user)=>{
    let token=generateToken(user);
    res.cookie('token',token);
}