import React, { useState, useEffect } from 'react';
import QuickLogPanel from '../components/QuickLogPanel';
import VolumeChart from '../components/VolumeChart';
import PRCard from '../components/PRCard';
import api from '../services/api';

const DashboardPage: React.FC = () => {
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [volumeData, setVolumeData] = useState({});
  const [prData, setPrData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [workoutsRes, volumeRes, prRes] = await Promise.all([
        api.get('/workouts?limit=5'),
        api.get('/workouts/stats/volume'),
        api.get('/workouts/stats/pr')
      ]);
      
      setRecentWorkouts(workoutsRes.data.workouts);
      setVolumeData(volumeRes.data);
      setPrData(prRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleWorkoutAdded = () => {
    fetchDashboardData();
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QuickLogPanel onWorkoutAdded={handleWorkoutAdded} />
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Weekly Training Volume</h2>
            <VolumeChart data={volumeData} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Records</h2>
          {Object.entries(prData).slice(0, 5).map(([exercise, data]: [string, any]) => (
            <PRCard key={exercise} exercise={exercise} data={data} />
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exercises
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentWorkouts.map((workout: any) => (
                <tr key={workout._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(workout.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {[...new Set(workout.sets.map((s: any) => s.exerciseId?.name))].join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workout.sets.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workout.duration ? `${workout.duration} min` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;