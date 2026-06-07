import React, { useEffect } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, CAT_ICONS, CAT_COLORS } from '../../utils/helpers';
import { CategoryDonut, MonthlyBar } from '../charts/Charts';

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={{ color: color || 'var(--text)' }}>{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { summary, loading, fetchSummary } = useDashboard();
  const { user } = useAuth();

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  if (loading) return <div className="loading-overlay"><span className="spinner" /></div>;

  const s = summary;
  const topCat = s?.categoryBreakdown?.[0];
  const monthChange = s?.monthChange;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="text-muted text-sm" style={{ marginTop: '4px' }}>Welcome back, {user?.name?.split(' ')[0]} 👋</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchSummary}>↻ Refresh</button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total Spent" value={formatCurrency(s?.totalSpent)} sub={`${s?.totalTransactions || 0} transactions`} color="var(--accent)" icon="💰" />
        <StatCard label="This Month"
          value={formatCurrency(s?.monthlySpent)}
          sub={monthChange != null ? `${monthChange > 0 ? '↑' : '↓'} ${Math.abs(monthChange)}% vs last month` : `${s?.monthlyTransactions || 0} this month`}
          color={monthChange == null ? 'var(--green)' : monthChange > 0 ? 'var(--red)' : 'var(--green)'} icon="📅" />
        <StatCard label="Top Category" value={topCat ? `${CAT_ICONS[topCat.category]} ${topCat.category.split(' ')[0]}` : '—'} sub={topCat ? formatCurrency(topCat.total) : 'No data yet'} color="var(--amber)" icon="🏆" />
        <StatCard label="Avg / Transaction" value={s?.avgPerTransaction ? formatCurrency(s.avgPerTransaction) : '—'} sub="per expense" color="var(--blue)" icon="📊" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text2)', fontFamily: 'Syne, sans-serif' }}>By Category</h3>
          <CategoryDonut breakdown={s?.categoryBreakdown} />
          {s?.categoryBreakdown?.length > 0 && (
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {s.categoryBreakdown.slice(0, 6).map(c => (
                <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text2)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: CAT_COLORS[c.category] || '#888', flexShrink: 0 }} />
                  <span>{c.category.split(' ')[0]}</span>
                  <span className="text-dim">{formatCurrency(c.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text2)', fontFamily: 'Syne, sans-serif' }}>Monthly Trend</h3>
          <MonthlyBar trend={s?.monthlyTrend} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text2)', fontFamily: 'Syne, sans-serif' }}>Recent Transactions</h3>
        {!s?.recentExpenses?.length ? (
          <div className="empty-state" style={{ padding: '30px' }}>
            <p className="text-dim text-sm">No expenses yet. Add your first one!</p>
          </div>
        ) : (
          s.recentExpenses.map(e => (
            <div key={e._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                {CAT_ICONS[e.category]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{e.title}</p>
                <p className="text-dim" style={{ fontSize: '11px', marginTop: '2px' }}>{e.category} · {formatDate(e.date)}</p>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--red)', fontFamily: 'Syne, sans-serif' }}>-{formatCurrency(e.amount)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
