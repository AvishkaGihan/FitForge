import { useState } from 'react';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface ApiErrorResponse {
  response?: { data?: { error?: string } };
  message?: string;
}

export function useApi<T = unknown>(options?: UseApiOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(apiCall: () => Promise<T>) {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      const errorMessage =
        apiError.response?.data?.error || apiError.message || 'An error occurred';
      setError(errorMessage);
      options?.onError?.(new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setData(null);
    setError(null);
    setLoading(false);
  }

  return { data, loading, error, execute, reset };
}
