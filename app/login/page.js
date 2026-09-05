'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Kertavira</h1>
        <p>Catat kas harian usahamu, tanpa ribet.</p>

        {sent ? (
          <p className="success">
            Link login sudah dikirim ke {email}. Buka email kamu untuk masuk.
          </p>
        ) : (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@usaha.com"
            />
            <button type="submit">Kirim link login</button>
            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
