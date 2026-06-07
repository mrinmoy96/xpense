import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export function useDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/summary');
      setSummary(res.data.summary);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard');
    } finally { setLoading(false); }
  }, []);

  return { summary, loading, fetchSummary };
}
