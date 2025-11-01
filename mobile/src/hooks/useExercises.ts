import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Exercise } from '@/types';

export function useExercises(filters?: any) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExercises();
  }, [filters]);

  async function loadExercises() {
    setLoading(true);
    setError(null);

    try {
      const data = filters ? await api.searchExercises(filters) : await api.getAllExercises();
      setExercises(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { exercises, loading, error, refresh: loadExercises };
}
