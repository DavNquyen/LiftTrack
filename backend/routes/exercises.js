const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const exercises = await Exercise.find({
      $or: [
        { isCustom: false },
        { createdBy: req.userId }
      ]
    }).sort('name');

    const user = await User.findById(req.userId);
    const favoriteIds = user.preferences.favoriteExercises.map(id => id.toString());

    const exercisesWithFavorites = exercises.map(exercise => ({
      ...exercise.toObject(),
      isFavorite: favoriteIds.includes(exercise._id.toString())
    }));

    res.json(exercisesWithFavorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', [
  authMiddleware,
  body('name').trim().notEmpty(),
  body('category').isIn(['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'other']),
  body('muscleGroup').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const exercise = new Exercise({
      ...req.body,
      isCustom: true,
      createdBy: req.userId
    });
    await exercise.save();
    res.status(201).json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    
    const favoriteIndex = user.preferences.favoriteExercises.indexOf(id);
    
    if (favoriteIndex > -1) {
      user.preferences.favoriteExercises.splice(favoriteIndex, 1);
    } else {
      user.preferences.favoriteExercises.push(id);
    }
    
    await user.save();
    res.json({ isFavorite: favoriteIndex === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;