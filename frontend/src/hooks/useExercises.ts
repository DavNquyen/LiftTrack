import { useState, useEffect } from 'react';
import api from '../services/api';
import { Exercise } from '../types';

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await api.get('/exercises');
        setExercises(res.data);
        localStorage.setItem('cachedExercises', JSON.stringify(res.data));
      } catch (err) {
        setError('Failed to fetch exercises');
        const cached = localStorage.getItem('cachedExercises');
        if (cached) {
          setExercises(JSON.parse(cached));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return { exercises, loading, error };
};