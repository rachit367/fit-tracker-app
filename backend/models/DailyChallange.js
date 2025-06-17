const mongoose=require('mongoose');

const DailyChallangeSchema=mongoose.Schema({
    title: String,
  description: String,
  target: Number,
  progress: Number,
  xpReward: Number,
  completed: Boolean,
  type:{
    type:String,
    enum:['reps','weight','exercises','duration']
}
});


module.exports = mongoose.model('DailyChallange', DailyChallangeSchema);