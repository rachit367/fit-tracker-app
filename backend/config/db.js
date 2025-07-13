const mongoose=require('mongoose');
require('dotenv').config();

const DB=async ()=>{
    try{
        console.log('Connecting to MongoDB...');
        console.log('MONGO_URI:', process.env.MONGO_URI || 'NOT SET');
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log('✅ MongoDB connected successfully!');
    }catch(err)
    {
        console.error('❌ MongoDB connection failed:', err);
    }
};
module.exports=DB