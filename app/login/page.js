'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
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
      return;
    }

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setInfo('Akun berhasil dibuat. Silakan masuk dengan email & password tadi.');
        setMode('login');
      }
      return;
    }

    if (mode === 'forgot') {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setLoading(false);
      if (error) setError(error.message);
      else setInfo(`Link reset password sudah dikirim ke ${email}. Cek email kamu (dan folder Spam).`);
      return;
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Kertavira</h1>
        <p>Catat kas harian usahamu, tanpa ribet.</p>

        {mode !== 'forgot' && (
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => { setMode('login'); setError(''); setInfo(''); }}
            >
              Masuk
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => { setMode('signup'); setError(''); setInfo(''); }}
            >
              Daftar
            </button>
          </div>
        )}

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

          {mode !== 'forgot' && (
            <>
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
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? 'Memproses...'
              : mode === 'login'
              ? 'Masuk'
              : mode === 'signup'
              ? 'Daftar'
              : 'Kirim link reset'}
          </button>

          {error && <p className="error">{error}</p>}
          {info && <p className="success">{info}</p>}
        </form>

        {mode === 'login' && (
          <button
            type="button"
            className="link-btn"
            onClick={() => { setMode('forgot'); setError(''); setInfo(''); }}
          >
            Lupa password?
          </button>
        )}
        {mode === 'forgot' && (
          <button
            type="button"
            className="link-btn"
            onClick={() => { setMode('login'); setError(''); setInfo(''); }}
          >
            Kembali ke halaman masuk
          </button>
        )}
      </div>
    </div>
  );
}
