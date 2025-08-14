const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Template = require('../models/Template');
const User = require('../models/User');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const templates = await Template.find({
      userId: req.userId,
      isActive: true
    })
    .populate('exercises.exerciseId', 'name category')
    .sort({ updatedAt: -1 });
    
    res.json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('exercises.exerciseId', 'name category');
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', [
  authMiddleware,
  body('name').trim().notEmpty(),
  body('exercises').isArray().notEmpty(),
  body('exercises.*.exerciseId').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const template = new Template({
      ...req.body,
      userId: req.userId
    });
    
    await template.save();
    await template.populate('exercises.exerciseId', 'name category');
    
    res.status(201).json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', [
  authMiddleware,
  body('name').trim().notEmpty(),
  body('exercises').isArray().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const template = await Template.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('exercises.exerciseId', 'name category');
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const template = await Template.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive: false },
      { new: true }
    );
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/use', authMiddleware, async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('exercises.exerciseId');
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    await User.findByIdAndUpdate(req.userId, {
      'preferences.lastTemplate': template._id
    });
    
    const workoutSets = template.exercises.flatMap(exercise => {
      const sets = [];
      for (let i = 0; i < exercise.sets; i++) {
        sets.push({
          exerciseId: exercise.exerciseId._id,
          weight: exercise.weight || 0,
          reps: exercise.reps || 10
        });
      }
      return sets;
    });
    
    res.json({ template, suggestedSets: workoutSets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;