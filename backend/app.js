const express=require('express');
const app=express();
const cors=require('cors');
const path=require('path');
const jwt=require('jsonwebtoken')
const DB=require('./config/db');
const {seedExercises} = require('./config/seedExercise');
const userRouter=require('./routes/userRouter');
const cookieParser=require('cookie-parser');
const dashboardRouter=require('./routes/dashboardRouter');
const workoutRouter=require('./routes/workoutRouter');
const isLoggedIn = require('./middlewares/isLoggedIn');
const exerciseRouter=require('./routes/exerciseRouter');


require('dotenv').config();
DB().then(async()=>{
  await seedExercises();
});


app.use(cors({
  origin: process.env.FRONTEND_URL ,
  credentials: true 
}));


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));


app.use('/user',userRouter);
app.use('/dashboard',dashboardRouter);
app.use('/workout',isLoggedIn,workoutRouter);
app.use('/exercise',isLoggedIn,exerciseRouter);


app.listen(3000);