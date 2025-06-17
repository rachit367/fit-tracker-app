const mongoose=require('mongoose');
require('dotenv').config();

const DB=async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}`);
    }catch(err)
    {
        console.error('mongoDB ran into probelm',err);
    }
};
module.exports=DB