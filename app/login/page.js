'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) setError(error.message);
      else router.push('/dashboard');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setInfo('Akun berhasil dibuat. Silakan masuk dengan email & password tadi.');
        setMode('login');
      }
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Kertavira</h1>
        <p>Catat kas harian usahamu, tanpa ribet.</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Masuk
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@usaha.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>

          {error && <p className="error">{error}</p>}
          {info && <p className="success">{info}</p>}
        </form>
      </div>
    </div>
  );
}
