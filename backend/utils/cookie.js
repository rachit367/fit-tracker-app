const jwt=require('jsonwebtoken');
const generateToken=require('./generateToken');

module.exports.decodeCookie=(req,res)=>{
    try {
        let token=req.cookies.token;
        if (!token) {
            throw new Error('No token provided');
        }
        let decoded=jwt.verify(token,process.env.SECRET_KEY);
        return decoded;
    } catch (error) {
        console.error('Error decoding cookie:', error);
        throw error;
    }
}

module.exports.sendCookie=(req,res,user)=>{
    let token=generateToken(user);
    res.cookie('token',token);
}