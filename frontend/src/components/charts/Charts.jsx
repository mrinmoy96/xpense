import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { CAT_COLORS, formatCurrency, formatMonthYear } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function CategoryDonut({ breakdown }) {
  if (!breakdown || breakdown.length === 0) return (
    <div className="empty-state" style={{ padding: '40px 20px' }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
      <p className="text-dim text-sm">No data yet</p>
    </div>
  );
  const labels = breakdown.map(b => b.category);
  const data = { labels, datasets: [{ data: breakdown.map(b => b.total), backgroundColor: labels.map(l => CAT_COLORS[l] || '#888'), borderWidth: 2, borderColor: 'transparent', hoverOffset: 4 }] };
  const options = { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: i => ` ${i.label}: ${formatCurrency(i.raw)}` } } } };
  return (
    <div style={{ position: 'relative', height: '200px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export function MonthlyBar({ trend }) {
  if (!trend || trend.length === 0) return (
    <div className="empty-state" style={{ padding: '60px 20px' }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
      <p className="text-dim text-sm">Add expenses to see trends</p>
    </div>
  );
  const data = {
    labels: trend.map(t => formatMonthYear(t.month)),
    datasets: [{ label: 'Monthly Spend', data: trend.map(t => t.total), backgroundColor: 'rgba(124,106,247,0.7)', borderRadius: 6, borderSkipped: false }]
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: i => formatCurrency(i.raw) } } },
    scales: {
      x: { ticks: { color: '#9090a8', font: { family: 'Inter' }, maxRotation: 45 }, grid: { display: false } },
      y: { ticks: { color: '#9090a8', callback: v => formatCurrency(v), font: { size: 11, family: 'Inter' } }, grid: { color: 'rgba(128,128,128,0.1)' } }
    }
  };
  return (
    <div style={{ position: 'relative', height: '220px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
