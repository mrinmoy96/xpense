import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const inputClass = (k) => `form-input${errors[k] ? ' error' : ''}`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💸</div>
          <h1 style={{ fontSize: '36px', color: 'var(--accent)', letterSpacing: '-1.5px' }}>Xpense</h1>
          <p className="text-muted text-sm" style={{ marginTop: '8px' }}>Track every rupee, every day</p>
        </div>

        <div className="card" style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '4px', marginBottom: '24px' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); }}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: mode === m ? 'var(--accent)' : 'transparent', color: mode === m ? '#fff' : 'var(--text2)' }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className={inputClass('name')} type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className={inputClass('email')} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Password</label>
              <input className={inputClass('password')} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ justifyContent: 'center', width: '100%' }}>
              {loading ? <span className="spinner" /> : (mode === 'login' ? 'Sign In →' : 'Create Account →')}
            </button>
          </form>
        </div>
        <p className="text-dim text-xs" style={{ textAlign: 'center', marginTop: '16px' }}>
          Your data is stored securely and never shared.
        </p>
      </div>
    </div>
  );
}
