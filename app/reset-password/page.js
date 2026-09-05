'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [validLink, setValidLink] = useState(true);

  useEffect(() => {
    // Supabase-js otomatis membaca token recovery dari URL saat halaman ini dibuka
    // lewat link dari email, lalu membuat session sementara untuk ganti password.
    supabase.auth.getSession().then(({ data }) => {
      setReady(true);
      setValidLink(!!data.session);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  }

  if (!ready) return null;

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Kertavira</h1>
        <p>Buat password baru</p>

        {!validLink && (
          <p className="error">
            Link reset ini sudah kadaluarsa atau tidak valid. Minta link baru dari halaman
            login (klik &quot;Lupa password?&quot;).
          </p>
        )}

        {validLink && success && (
          <p className="success">Password berhasil diganti. Mengalihkan ke dashboard...</p>
        )}

        {validLink && !success && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="password">Password baru</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />

            <label htmlFor="confirm">Ulangi password</label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password"
            />

            <button type="submit">Simpan password baru</button>
            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
