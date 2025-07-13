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
const setRouter=require('./routes/setRouter');

require('dotenv').config();
console.log('🔧 Backend starting...');
console.log('Environment check:');
console.log('- MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
console.log('- SECRET_KEY:', process.env.SECRET_KEY ? 'SET' : 'NOT SET');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');

DB().then(async()=>{
  console.log('🌱 Seeding exercises...');
  await seedExercises();
  console.log('✅ Backend ready!');
});


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));


app.use('/user',userRouter);
app.use('/dashboard',isLoggedIn,dashboardRouter);
app.use('/workout',isLoggedIn,workoutRouter);
app.use('/exercise',isLoggedIn,exerciseRouter);
app.use('/set',isLoggedIn,setRouter);



app.listen(4000);