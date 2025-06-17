const express=require('express');
const router=express.Router();
const isLoggedIn=require('../middlewares/isLoggedIn');
const {loginUser,registerUser,logoutUser,editUser}=require('../controllers/authController');

router.get('/',isLoggedIn,function(req,res){
    if (req.user) {
        return res.json(req.user);
    } 
    else {
    return res.status(401).json({ message: 'Not logged in' });
  }
})

router.post('/login',loginUser);

router.post('/register',registerUser);

router.post('/logout',logoutUser);

router.put('/edit',isLoggedIn,editUser);


module.exports = router;