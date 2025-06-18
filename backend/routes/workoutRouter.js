const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const { validateWorkoutUpdate, validateWorkoutCreate } = require('../middlewares/validateRequest');
const { savedWorkout, updateWorkout, addWorkout, todaysWorkout } = require('../controllers/workoutController');

router.get('/savedworkouts', isLoggedIn, savedWorkout);
router.put('/updateworkout', isLoggedIn, validateWorkoutUpdate, updateWorkout);
router.post('/addworkout', isLoggedIn, validateWorkoutCreate, addWorkout);
router.get('/todaysworkout', isLoggedIn, todaysWorkout);

module.exports = router;