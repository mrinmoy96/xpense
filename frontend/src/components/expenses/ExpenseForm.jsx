import React, { useState } from 'react';
import { CATEGORIES, CAT_ICONS, formatDateInput } from '../../utils/helpers';

const EMPTY = { title: '', amount: '', category: 'Food & Dining', date: formatDateInput(new Date()), note: '' };

export default function ExpenseForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial ? {
    ...initial, amount: String(initial.amount), date: formatDateInput(initial.date)
  } : EMPTY);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) e.amount = 'Enter a valid positive amount';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
  };

  const inp = (k) => `form-input${errors[k] ? ' error' : ''}`;

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input className={inp('title')} type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Coffee at Cafe Day" maxLength={100} />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input className={inp('amount')} type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" min="0.01" step="0.01" />
          {errors.amount && <p className="form-error">{errors.amount}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input className={inp('date')} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: '24px' }}>
        <label className="form-label">Note (optional)</label>
        <textarea className="form-input" value={form.note} onChange={e => set('note', e.target.value)} placeholder="Any additional details..." rows={3} maxLength={500} style={{ resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : (initial ? '✓ Update Expense' : '+ Add Expense')}
        </button>
      </div>
    </form>
  );
}
