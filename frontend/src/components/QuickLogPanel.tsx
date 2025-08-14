import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Exercise, WorkoutSet } from '../types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface QuickLogPanelProps {
  onWorkoutAdded: () => void;
}

const QuickLogPanel: React.FC<QuickLogPanelProps> = ({ onWorkoutAdded }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await api.get('/exercises');
      setExercises(res.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const addSet = () => {
    if (!selectedExercise || !weight || !reps) return;
    
    const newSet: WorkoutSet = {
      exerciseId: selectedExercise,
      weight: parseFloat(weight),
      reps: parseInt(reps)
    };
    
    setSets([...sets, newSet]);
    setWeight('');
    setReps('');
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const saveWorkout = async () => {
    if (sets.length === 0) return;
    
    setLoading(true);
    try {
      await api.post('/workouts', {
        sets,
        notes,
        date: new Date()
      });
      
      setSets([]);
      setNotes('');
      setSelectedExercise('');
      onWorkoutAdded();
      
      alert('Workout saved successfully!');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  const getExerciseName = (id: string) => {
    return exercises.find(e => e._id === id)?.name || '';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Log Workout</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercise
            </label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select exercise</option>
              {exercises.map(exercise => (
                <option key={exercise._id} value={exercise._id}>
                  {exercise.name} {exercise.isFavorite && '⭐'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reps
            </label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={addSet}
              disabled={!selectedExercise || !weight || !reps}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-5 w-5 mx-auto" />
            </button>
          </div>
        </div>
        
        {sets.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Sets</h3>
            <div className="space-y-2">
              {sets.map((set, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">
                    {getExerciseName(set.exerciseId as string)} - {set.weight} lbs × {set.reps} reps
                  </span>
                  <button
                    onClick={() => removeSet(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Add workout notes..."
          />
        </div>
        
        <button
          onClick={saveWorkout}
          disabled={sets.length === 0 || loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Workout'}
        </button>
      </div>
    </div>
  );
};

export default QuickLogPanel;