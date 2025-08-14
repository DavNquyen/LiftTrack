const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  rpe: {
    type: Number,
    min: 1,
    max: 10
  }
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  sets: [setSchema],
  notes: {
    type: String,
    maxlength: 500
  },
  duration: {
    type: Number
  },
  templateUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

workoutSchema.index({ userId: 1, date: -1 });

workoutSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);