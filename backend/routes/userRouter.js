const express=require('express');
const router=express.Router();
const isLoggedIn=require('../middlewares/isLoggedIn');
const {loginUser,registerUser,logoutUser,editUser}=require('../controllers/authController');
const jwt=require('jsonwebtoken');
const userModel=require('../models/User');

router.get('/',async function(req,res){
    let token=req.cookies.token;
    if (token) {
        let decoded=jwt.verify(token,process.env.SECRET_KEY);
        let user=await userModel.findById(decoded._id);
        return res.json(user);
    } 
    else {
    return res.json(null);
  }
})

router.post('/login',loginUser);

router.post('/register',registerUser);

router.post('/logout',logoutUser);

router.put('/edit',isLoggedIn,editUser);


module.exports = router;