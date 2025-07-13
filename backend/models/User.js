const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    age:Number,
    weight:Number,
    fitnessGoal: {
    type: String,
    enum: ['bulking', 'cutting', 'strength'],
    required: true
  },
    streak: {
    type: Number,
    default: 0
  },
  totalWorkouts: {
    type: Number,
    default: 0
  },
  achievements: {
    type: [
      {
        id: String,
        name: String,
        description: String,
        icon: String,
        unlockedAt: {
          type: Date,
          default: Date.now
        },
        category: {
          type: String,
          enum: ['streak', 'workout', 'strength', 'consistency']
        }
      }
    ],
    default: []
  },
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('User', UserSchema);