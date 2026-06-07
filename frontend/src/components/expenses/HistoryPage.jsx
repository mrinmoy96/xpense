import React, { useState, useEffect, useCallback } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { CATEGORIES, formatCurrency, formatDate, CAT_ICONS } from '../../utils/helpers';
import Modal from '../ui/Modal';
import ExpenseForm from '../expenses/ExpenseForm';

export default function HistoryPage() {
  const { expenses, total, loading, fetchExpenses, updateExpense, deleteExpense } = useExpenses();
  const [filters, setFilters] = useState({ search: '', category: 'All', sortBy: 'date', order: 'desc', startDate: '', endDate: '', page: 1, limit: 50 });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    const p = { ...filters };
    if (p.category === 'All') delete p.category;
    if (!p.startDate) delete p.startDate;
    if (!p.endDate) delete p.endDate;
    fetchExpenses(p);
  }, [filters, fetchExpenses]);

  useEffect(() => { load(); }, [load]);

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));

  const handleSave = async (data) => {
    setSaving(true);
    try { await updateExpense(editing._id, data); setEditing(null); load(); }
    finally { setSaving(false); }
  };

  const grouped = expenses.reduce((acc, e) => {
    const key = e.date.slice(0, 7);
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">History</h2>
        <p className="text-muted text-sm">{total} total records</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label className="form-label">Search</label>
            <input className="form-input" type="text" value={filters.search} onChange={e => setF('search', e.target.value)} placeholder="Search expenses..." />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select className="form-input" value={filters.category} onChange={e => setF('category', e.target.value)} style={{ width: '160px' }}>
              <option value="All">All</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Sort</label>
            <select className="form-input" value={filters.order} onChange={e => setF('order', e.target.value)} style={{ width: '130px' }}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="form-label">From Date</label>
            <input className="form-input" type="date" value={filters.startDate} onChange={e => setF('startDate', e.target.value)} />
          </div>
          <div>
            <label className="form-label">To Date</label>
            <input className="form-input" type="date" value={filters.endDate} onChange={e => setF('endDate', e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay"><span className="spinner" /></div>
      ) : expenses.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">📭</div>
          <p className="empty-state-title">No expenses found</p>
          <p className="empty-state-desc">Try adjusting your date range or filters.</p>
        </div>
      ) : (
        Object.entries(grouped).sort((a, b) => filters.order === 'desc' ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0])).map(([month, items]) => {
          const monthTotal = items.reduce((s, e) => s + e.amount, 0);
          const [y, m] = month.split('-');
          const label = new Date(+y, +m - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
          return (
            <div key={month} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'Syne, sans-serif' }}>{label}</h3>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--red)' }}>{formatCurrency(monthTotal)}</span>
              </div>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {items.map((e, i) => (
                  <div key={e._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      {CAT_ICONS[e.category]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</p>
                      <p className="text-dim" style={{ fontSize: '11px', marginTop: '2px' }}>{e.category} · {formatDate(e.date)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--red)', fontFamily: 'Syne, sans-serif' }}>-{formatCurrency(e.amount)}</p>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(e)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={async () => { await deleteExpense(e._id); load(); }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Expense">
        {editing && <ExpenseForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} loading={saving} />}
      </Modal>
    </div>
  );
}
