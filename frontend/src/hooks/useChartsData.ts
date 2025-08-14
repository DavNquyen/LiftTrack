import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

export const useChartsData = (weeks: number = 12) => {
  const [volumeData, setVolumeData] = useState({});
  const [prData, setPrData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [volumeRes, prRes] = await Promise.all([
          api.get(`/workouts/stats/volume?weeks=${weeks}`),
          api.get('/workouts/stats/pr')
        ]);
        setVolumeData(volumeRes.data);
        setPrData(prRes.data);
      } catch (error) {
        console.error('Error fetching charts data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weeks]);

  const memoizedVolumeData = useMemo(() => volumeData, [volumeData]);
  const memoizedPrData = useMemo(() => prData, [prData]);

  return { 
    volumeData: memoizedVolumeData, 
    prData: memoizedPrData, 
    loading 
  };
};