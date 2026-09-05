'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  function switchMode(newMode) {
    setMode(newMode);
    setError('');
    setInfo('');
  }

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
      if (!businessName.trim()) {
        setError('Nama usaha wajib diisi.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password minimal 6 karakter.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Konfirmasi password tidak sama dengan password di atas.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await supabase
          .from('merchants')
          .update({ business_name: businessName.trim() })
          .eq('id', data.user.id);
      }

      setLoading(false);
      if (data.session) {
        router.push('/dashboard');
      } else {
        setInfo('Akun berhasil dibuat. Silakan masuk dengan email & password tadi.');
        switchMode('login');
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
              onClick={() => switchMode('login')}
            >
              Masuk
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => switchMode('signup')}
            >
              Daftar
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <label htmlFor="businessName">Nama Usaha</label>
              <input
                id="businessName"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Contoh: Warung Berkah Jaya"
              />
            </>
          )}

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

          {mode === 'signup' && (
            <>
              <label htmlFor="confirmPassword">Ulangi Password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password di atas"
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
          <button type="button" className="link-btn" onClick={() => switchMode('forgot')}>
            Lupa password?
          </button>
        )}
        {mode === 'forgot' && (
          <button type="button" className="link-btn" onClick={() => switchMode('login')}>
            Kembali ke halaman masuk
          </button>
        )}
      </div>
    </div>
  );
}