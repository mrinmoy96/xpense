import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth }  from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';

const NAV_ITEMS = [
  { path: '/',          icon: '📊', label: 'Dashboard' },
  { path: '/expenses',  icon: '📋', label: 'Expenses'  },
  { path: '/history',   icon: '🕓', label: 'History'   },
  { path: '/profile',   icon: '⚙️', label: 'Settings'  },
];

export default function Sidebar() {
  const { user, logout }  = useAuth();
  const { dark, toggle }  = useTheme();
  const navigate           = useNavigate();
  const { pathname }       = useLocation();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        <h1 className="nav-brand-name" style={{ fontFamily: 'Syne, sans-serif' }}>
          💸 Xpense
        </h1>
        <p className="nav-brand-tagline">Personal Finance</p>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_ITEMS.map(n => (
          <button key={n.path}
            className={`nav-item${pathname === n.path ? ' active' : ''}`}
            onClick={() => navigate(n.path)}>
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom: theme + user */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <button className="nav-item" onClick={toggle} style={{ width: '100%', marginBottom: '8px' }}>
          <span className="nav-icon">{dark ? '☀️' : '🌙'}</span>
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            onClick={() => navigate('/profile')}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {getInitials(user.name)}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </p>
              <button onClick={(e) => { e.stopPropagation(); logout(); }}
                style={{ fontSize: '11px', color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
