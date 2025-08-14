const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Workout = require('../models/Workout');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, limit = 20, skip = 0 } = req.query;
    
    const query = { userId: req.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const workouts = await Workout.find(query)
      .populate('sets.exerciseId', 'name category')
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Workout.countDocuments(query);
    
    res.json({ workouts, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('sets.exerciseId', 'name category');
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', [
  authMiddleware,
  body('sets').isArray().notEmpty(),
  body('sets.*.exerciseId').notEmpty(),
  body('sets.*.weight').isNumeric().custom(val => val >= 0),
  body('sets.*.reps').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const workout = new Workout({
      ...req.body,
      userId: req.userId
    });
    
    await workout.save();
    await workout.populate('sets.exerciseId', 'name category');
    
    res.status(201).json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', [
  authMiddleware,
  body('sets').isArray().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('sets.exerciseId', 'name category');
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats/volume', authMiddleware, async (req, res) => {
  try {
    const { weeks = 12 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));
    
    const workouts = await Workout.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    }).populate('sets.exerciseId', 'name category');
    
    const volumeByWeek = {};
    
    workouts.forEach(workout => {
      const weekStart = new Date(workout.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!volumeByWeek[weekKey]) {
        volumeByWeek[weekKey] = 0;
      }
      
      workout.sets.forEach(set => {
        volumeByWeek[weekKey] += set.weight * set.reps;
      });
    });
    
    res.json(volumeByWeek);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats/pr', authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId })
      .populate('sets.exerciseId', 'name');
    
    const prByExercise = {};
    
    workouts.forEach(workout => {
      workout.sets.forEach(set => {
        const exerciseName = set.exerciseId.name;
        const estimated1RM = Math.round(set.weight * (1 + set.reps / 30));
        
        if (!prByExercise[exerciseName] || estimated1RM > prByExercise[exerciseName].max1RM) {
          prByExercise[exerciseName] = {
            max1RM: estimated1RM,
            weight: set.weight,
            reps: set.reps,
            date: workout.date
          };
        }
      });
    });
    
    res.json(prByExercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;