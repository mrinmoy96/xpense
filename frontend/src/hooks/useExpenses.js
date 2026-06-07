import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { downloadCSV } from '../utils/helpers';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(false);

  const fetchExpenses = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/expenses', { params });
      setExpenses(res.data.expenses);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load expenses');
    } finally { setLoading(false); }
  }, []);

  const createExpense = useCallback(async (data) => {
    const res = await api.post('/expenses', data);
    toast.success('✅ Expense added!');
    return res.data.expense;
  }, []);

  const updateExpense = useCallback(async (id, data) => {
    const res = await api.put(`/expenses/${id}`, data);
    toast.success('✅ Expense updated!');
    return res.data.expense;
  }, []);

  const deleteExpense = useCallback(async (id) => {
    await api.delete(`/expenses/${id}`);
    toast.success('🗑️ Expense deleted');
  }, []);

  const exportCSV = useCallback(async () => {
    try {
      const res = await api.get('/expenses/export/csv', { responseType: 'text' });
      downloadCSV(res.data, 'xpense-export.csv');
      toast.success('📥 CSV exported!');
    } catch (err) {
      toast.error('Export failed');
    }
  }, []);

  return {
    expenses, total, pages, loading,
    fetchExpenses, createExpense, updateExpense, deleteExpense, exportCSV,
  };
}
