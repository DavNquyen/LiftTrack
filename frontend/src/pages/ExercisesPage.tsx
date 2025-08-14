import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Exercise } from '../types';
import { StarIcon, PlusIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ExercisesPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: 'other',
    muscleGroup: '',
    equipment: 'other'
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await api.get('/exercises');
      setExercises(res.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (exerciseId: string) => {
    try {
      const res = await api.patch(`/exercises/${exerciseId}/favorite`);
      setExercises(exercises.map(ex => 
        ex._id === exerciseId ? { ...ex, isFavorite: res.data.isFavorite } : ex
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/exercises', newExercise);
      setExercises([...exercises, res.data]);
      setNewExercise({ name: '', category: 'other', muscleGroup: '', equipment: 'other' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const filteredExercises = exercises.filter(ex => {
    if (filter === 'favorites') return ex.isFavorite;
    if (filter === 'custom') return ex.isCustom;
    return true;
  });

  const categories = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'other'];

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Exercises</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Exercise
        </button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-md ${
              filter === 'favorites' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setFilter('custom')}
            className={`px-4 py-2 rounded-md ${
              filter === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Exercise</h2>
            <form onSubmit={addExercise}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newExercise.category}
                    onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Muscle Group
                  </label>
                  <input
                    type="text"
                    required
                    value={newExercise.muscleGroup}
                    onChange={(e) => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment
                  </label>
                  <select
                    value={newExercise.equipment}
                    onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="barbell">Barbell</option>
                    <option value="dumbbell">Dumbbell</option>
                    <option value="machine">Machine</option>
                    <option value="cable">Cable</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(exercise => (
          <div key={exercise._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {exercise.category} • {exercise.muscleGroup}
                </p>
                {exercise.equipment && (
                  <p className="text-xs text-gray-500 mt-1">
                    Equipment: {exercise.equipment}
                  </p>
                )}
                {exercise.isCustom && (
                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    Custom
                  </span>
                )}
              </div>
              <button
                onClick={() => toggleFavorite(exercise._id)}
                className="ml-2 p-1 hover:bg-gray-100 rounded"
              >
                {exercise.isFavorite ? (
                  <StarIconSolid className="h-5 w-5 text-yellow-500" />
                ) : (
                  <StarIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesPage;