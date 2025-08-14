import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Workout } from '../types';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const WorkoutsPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await api.get('/workouts');
      setWorkouts(res.data.workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(workouts.filter(w => w._id !== id));
      if (selectedWorkout?._id === id) {
        setSelectedWorkout(null);
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Exercise', 'Weight', 'Reps', 'Notes'];
    const rows = workouts.flatMap(workout =>
      workout.sets.map(set => [
        new Date(workout.date).toLocaleDateString(),
        (set.exerciseId as any)?.name || '',
        set.weight,
        set.reps,
        workout.notes || ''
      ])
    );
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workouts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Workout History</h2>
          <div className="space-y-2">
            {workouts.map(workout => (
              <div
                key={workout._id}
                onClick={() => setSelectedWorkout(workout)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedWorkout?._id === workout._id
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-white border-2 border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(workout.date).toLocaleDateString()}
                    </div>
                    <p className="font-medium mt-1">
                      {workout.sets.length} sets
                    </p>
                  </div>
                  {workout.duration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {workout.duration} min
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedWorkout ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Workout Details</h2>
                  <p className="text-gray-600 mt-1">
                    {new Date(selectedWorkout.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => deleteWorkout(selectedWorkout._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              
              {selectedWorkout.notes && (
                <div className="mb-6 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">{selectedWorkout.notes}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Exercises</h3>
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Exercise</th>
                      <th className="text-left py-2">Weight</th>
                      <th className="text-left py-2">Reps</th>
                      <th className="text-left py-2">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWorkout.sets.map((set, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{(set.exerciseId as any)?.name}</td>
                        <td className="py-2">{set.weight} lbs</td>
                        <td className="py-2">{set.reps}</td>
                        <td className="py-2">{set.weight * set.reps} lbs</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="py-2 font-medium">Total Volume</td>
                      <td className="py-2 font-medium">
                        {selectedWorkout.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)} lbs
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-500">Select a workout to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutsPage;