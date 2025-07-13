const express=require('express');
const router=express.Router();
const isLoggedIn=require('../middlewares/isLoggedIn');
const { defaultExercises,addExercise,removeExercise, exerciseInfo } = require('../controllers/exerciseController');


router.get('/defaultexercises',defaultExercises);

router.post('/add',addExercise);

router.put('/remove',removeExercise);

router.post('/exerciseinfo',exerciseInfo)

module.exports = router;