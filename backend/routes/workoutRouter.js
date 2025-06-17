const express=require('express');
const router=express.Router();
const isLoggedIn=require('../middlewares/isLoggedIn');
const {savedWorkout, updateWorkout, addWorkout, todaysWorkout}=require('../controllers/workoutController');

router.get('/savedworkouts',savedWorkout);

router.post('/updateworkout',updateWorkout);

router.post('/addworkout',addWorkout);

router.get('/todaysworkout',todaysWorkout)

module.exports = router;