import React from 'react';
import { CAT_ICONS, formatCurrency, formatDate } from '../../utils/helpers';

export default function ExpenseRow({ expense, onEdit, onDelete }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', marginBottom: '10px', transition: 'border-color 0.2s' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
        {CAT_ICONS[expense.category]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{expense.title}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-default">{expense.category}</span>
          <span className="text-dim" style={{ fontSize: '11px' }}>{formatDate(expense.date)}</span>
          {expense.note && <span className="text-dim" style={{ fontSize: '11px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{expense.note}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--red)', fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap' }}>
          -{formatCurrency(expense.amount)}
        </p>
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(expense)}>✏️</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(expense)}>🗑️</button>
      </div>
    </div>
  );
}
