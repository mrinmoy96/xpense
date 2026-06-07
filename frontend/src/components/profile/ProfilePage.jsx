import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [tab, setTab] = useState('profile');

  const [pForm, setPForm] = useState({ name: user?.name || '', currency: user?.currency || 'INR' });
  const [cForm, setCForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pLoading, setPLoading] = useState(false);
  const [cLoading, setCLoading] = useState(false);
  const [cErrors,  setCErrors]  = useState({});

  const saveProfile = async (e) => {
    e.preventDefault();
    setPLoading(true);
    try {
      const res = await api.put('/auth/profile', pForm);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setPLoading(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!cForm.currentPassword) errs.currentPassword = 'Required';
    if (cForm.newPassword.length < 6) errs.newPassword = 'Min 6 characters';
    if (cForm.newPassword !== cForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setCErrors(errs); return; }
    setCLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: cForm.currentPassword, newPassword: cForm.newPassword });
      toast.success('Password changed! Please log in again.');
      setTimeout(() => logout(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setCLoading(false); }
  };

  const TABS = [{ id: 'profile', label: '👤 Profile' }, { id: 'security', label: '🔒 Security' }];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
      </div>

      {/* Avatar + Name */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {getInitials(user?.name)}
        </div>
        <div>
          <p style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{user?.name}</p>
          <p className="text-muted text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: tab === t.id ? 'var(--accent)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text2)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card" style={{ maxWidth: '480px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Edit Profile</h3>
          <form onSubmit={saveProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} maxLength={50} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <p className="form-error" style={{ color: 'var(--text3)' }}>Email cannot be changed</p>
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Currency</label>
              <select className="form-input" value={pForm.currency} onChange={e => setPForm(f => ({ ...f, currency: e.target.value }))}>
                {['INR','USD','EUR','GBP','JPY'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={pLoading}>
              {pLoading ? <span className="spinner" /> : '✓ Save Changes'}
            </button>
          </form>
        </div>
      )}

      {tab === 'security' && (
        <div className="card" style={{ maxWidth: '480px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Change Password</h3>
          <form onSubmit={changePassword}>
            {[
              { label: 'Current Password', key: 'currentPassword', placeholder: '••••••' },
              { label: 'New Password',     key: 'newPassword',     placeholder: 'Min 6 characters' },
              { label: 'Confirm New Password', key: 'confirmPassword', placeholder: 'Repeat new password' },
            ].map(({ label, key, placeholder }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input className={`form-input${cErrors[key] ? ' error' : ''}`} type="password"
                  value={cForm[key]} placeholder={placeholder}
                  onChange={e => { setCForm(f => ({ ...f, [key]: e.target.value })); setCErrors(x => ({ ...x, [key]: '' })); }} />
                {cErrors[key] && <p className="form-error">{cErrors[key]}</p>}
              </div>
            ))}
            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={cLoading}>
              {cLoading ? <span className="spinner" /> : '🔒 Change Password'}
            </button>
          </form>

          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <p className="text-muted text-sm" style={{ marginBottom: '12px' }}>Danger Zone</p>
            <button className="btn btn-danger" onClick={logout}>Sign Out of All Devices</button>
          </div>
        </div>
      )}
    </div>
  );
}
