require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');

const exercises = [
  // Chest
  { name: 'Bench Press', category: 'chest', muscleGroup: 'Pectorals', equipment: 'barbell' },
  { name: 'Incline Bench Press', category: 'chest', muscleGroup: 'Upper Pectorals', equipment: 'barbell' },
  { name: 'Dumbbell Press', category: 'chest', muscleGroup: 'Pectorals', equipment: 'dumbbell' },
  { name: 'Dumbbell Flyes', category: 'chest', muscleGroup: 'Pectorals', equipment: 'dumbbell' },
  { name: 'Push-ups', category: 'chest', muscleGroup: 'Pectorals', equipment: 'bodyweight' },
  
  // Back
  { name: 'Deadlift', category: 'back', muscleGroup: 'Erector Spinae', equipment: 'barbell' },
  { name: 'Pull-ups', category: 'back', muscleGroup: 'Latissimus Dorsi', equipment: 'bodyweight' },
  { name: 'Barbell Row', category: 'back', muscleGroup: 'Latissimus Dorsi', equipment: 'barbell' },
  { name: 'Lat Pulldown', category: 'back', muscleGroup: 'Latissimus Dorsi', equipment: 'cable' },
  { name: 'Seated Cable Row', category: 'back', muscleGroup: 'Middle Back', equipment: 'cable' },
  
  // Shoulders
  { name: 'Overhead Press', category: 'shoulders', muscleGroup: 'Deltoids', equipment: 'barbell' },
  { name: 'Dumbbell Shoulder Press', category: 'shoulders', muscleGroup: 'Deltoids', equipment: 'dumbbell' },
  { name: 'Lateral Raises', category: 'shoulders', muscleGroup: 'Lateral Deltoids', equipment: 'dumbbell' },
  { name: 'Front Raises', category: 'shoulders', muscleGroup: 'Anterior Deltoids', equipment: 'dumbbell' },
  { name: 'Face Pulls', category: 'shoulders', muscleGroup: 'Rear Deltoids', equipment: 'cable' },
  
  // Arms
  { name: 'Barbell Curl', category: 'arms', muscleGroup: 'Biceps', equipment: 'barbell' },
  { name: 'Dumbbell Curl', category: 'arms', muscleGroup: 'Biceps', equipment: 'dumbbell' },
  { name: 'Hammer Curl', category: 'arms', muscleGroup: 'Biceps', equipment: 'dumbbell' },
  { name: 'Tricep Dips', category: 'arms', muscleGroup: 'Triceps', equipment: 'bodyweight' },
  { name: 'Tricep Pushdown', category: 'arms', muscleGroup: 'Triceps', equipment: 'cable' },
  
  // Legs
  { name: 'Squat', category: 'legs', muscleGroup: 'Quadriceps', equipment: 'barbell' },
  { name: 'Front Squat', category: 'legs', muscleGroup: 'Quadriceps', equipment: 'barbell' },
  { name: 'Romanian Deadlift', category: 'legs', muscleGroup: 'Hamstrings', equipment: 'barbell' },
  { name: 'Leg Press', category: 'legs', muscleGroup: 'Quadriceps', equipment: 'machine' },
  { name: 'Leg Curl', category: 'legs', muscleGroup: 'Hamstrings', equipment: 'machine' },
  { name: 'Calf Raises', category: 'legs', muscleGroup: 'Calves', equipment: 'machine' },
  
  // Core
  { name: 'Plank', category: 'core', muscleGroup: 'Abs', equipment: 'bodyweight' },
  { name: 'Crunches', category: 'core', muscleGroup: 'Abs', equipment: 'bodyweight' },
  { name: 'Russian Twists', category: 'core', muscleGroup: 'Obliques', equipment: 'bodyweight' },
  { name: 'Leg Raises', category: 'core', muscleGroup: 'Lower Abs', equipment: 'bodyweight' }
];

async function seedExercises() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Exercise.deleteMany({ isCustom: false });
    console.log('Cleared existing default exercises');
    
    await Exercise.insertMany(exercises.map(e => ({ ...e, isCustom: false })));
    console.log(`Seeded ${exercises.length} exercises`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
}

seedExercises();