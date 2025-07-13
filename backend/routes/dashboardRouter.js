const express=require('express');
const router=express.Router();
const isLoggedIn=require('../middlewares/isLoggedIn');
const {addXp,addAchievement}=require('../controllers/progressController');

router.put('/xp',isLoggedIn,addXp);

router.put('/add-achievement',isLoggedIn,addAchievement);

module.exports = router;