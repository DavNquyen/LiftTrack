const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'other']
  },
  muscleGroup: {
    type: String,
    required: true
  },
  equipment: {
    type: String,
    enum: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'other'],
    default: 'other'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

exerciseSchema.index({ name: 1, createdBy: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);