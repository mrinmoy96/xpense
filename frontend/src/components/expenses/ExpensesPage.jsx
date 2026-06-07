import React, { useState, useEffect, useCallback } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { CATEGORIES } from '../../utils/helpers';
import Modal      from '../ui/Modal';
import ExpenseForm from './ExpenseForm';
import ExpenseRow  from './ExpenseRow';

export default function ExpensesPage() {
  const { expenses, total, pages, loading, fetchExpenses, createExpense, updateExpense, deleteExpense, exportCSV } = useExpenses();
  const [filters, setFilters] = useState({ search: '', category: 'All', sortBy: 'date', order: 'desc', page: 1 });
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [saving,     setSaving]     = useState(false);

  const load = useCallback(() => {
    const p = { ...filters };
    if (p.category === 'All') delete p.category;
    fetchExpenses(p);
  }, [filters, fetchExpenses]);

  useEffect(() => { load(); }, [load]);

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing) await updateExpense(editing._id, data);
      else         await createExpense(data);
      setShowModal(false); setEditing(null); load();
    } catch (err) {
      // toast handled in hook
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    await deleteExpense(confirmDel._id);
    setConfirmDel(null); load();
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Expenses</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={exportCSV}>📥 Export CSV</button>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}>+ Add Expense</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 150px 130px', gap: '12px', alignItems: 'end' }}>
          <div>
            <label className="form-label">Search</label>
            <input className="form-input" type="text" value={filters.search} onChange={e => setF('search', e.target.value)} placeholder="Search by title or note…" />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select className="form-input" value={filters.category} onChange={e => setF('category', e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Sort By</label>
            <select className="form-input" value={filters.sortBy} onChange={e => setF('sortBy', e.target.value)}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="title">Title</option>
            </select>
          </div>
          <div>
            <label className="form-label">Order</label>
            <select className="form-input" value={filters.order} onChange={e => setF('order', e.target.value)}>
              <option value="desc">Desc ↓</option>
              <option value="asc">Asc ↑</option>
            </select>
          </div>
        </div>
      </div>

      <p className="text-dim text-xs" style={{ marginBottom: '12px' }}>
        {total} expense{total !== 1 ? 's' : ''} found
      </p>

      {loading ? (
        <div className="loading-overlay"><span className="spinner" /></div>
      ) : expenses.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">🔍</div>
          <p className="empty-state-title">No expenses found</p>
          <p className="empty-state-desc">Try adjusting your filters or add a new expense.</p>
        </div>
      ) : (
        <>
          {expenses.map(e => (
            <ExpenseRow key={e._id} expense={e}
              onEdit={exp => { setEditing(exp); setShowModal(true); }}
              onDelete={setConfirmDel}
            />
          ))}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              <button className="btn btn-ghost btn-sm" disabled={filters.page === 1}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`btn btn-sm ${filters.page === p ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setFilters(f => ({ ...f, page: p }))}>{p}</button>
              ))}
              <button className="btn btn-ghost btn-sm" disabled={filters.page === pages}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setEditing(null); }}
        title={editing ? 'Edit Expense' : 'Add Expense'}>
        <ExpenseForm initial={editing} onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditing(null); }} loading={saving} />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Delete Expense" maxWidth="400px">
        {confirmDel && (
          <div>
            <p className="text-muted" style={{ marginBottom: '8px' }}>
              Delete <strong style={{ color: 'var(--text)' }}>"{confirmDel.title}"</strong>?
            </p>
            <p className="text-dim text-sm" style={{ marginBottom: '24px' }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
