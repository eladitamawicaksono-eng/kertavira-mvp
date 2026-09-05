'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../components/LanguageProvider';

export default function LoginPage() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
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
        setError(t('businessNameRequired'));
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError(t('passwordMinLength'));
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError(t('passwordMismatch'));
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
        setInfo(t('signupSuccess'));
        switchMode('login');
      }
      return;
    }

    if (mode === 'forgot') {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setLoading(false);
      if (error) setError(error.message);
      else setInfo(`${t('sendResetLink')} → ${email}`);
      return;
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 8 }}>
          <button
            type="button"
            className="lang-pill"
            data-active={lang === 'id'}
            onClick={() => setLang('id')}
          >
            ID
          </button>
          <button
            type="button"
            className="lang-pill"
            data-active={lang === 'en'}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>

        <h1>{t('appName')}</h1>
        <p>{t('tagline')}</p>

        {mode !== 'forgot' && (
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}
            >
              {t('login')}
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => switchMode('signup')}
            >
              {t('signup')}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <label htmlFor="businessName">{t('businessName')}</label>
              <input
                id="businessName"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={t('businessNamePlaceholder')}
              />
            </>
          )}

          <label htmlFor="email">{t('email')}</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
          />

          {mode !== 'forgot' && (
            <>
              <label htmlFor="password">{t('password')}</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
              />
            </>
          )}

          {mode === 'signup' && (
            <>
              <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirmPasswordPlaceholder')}
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? t('processing')
              : mode === 'login'
              ? t('login')
              : mode === 'signup'
              ? t('signup')
              : t('sendResetLink')}
          </button>

          {error && <p className="error">{error}</p>}
          {info && <p className="success">{info}</p>}
        </form>

        {mode === 'login' && (
          <button type="button" className="link-btn" onClick={() => switchMode('forgot')}>
            {t('forgotPassword')}
          </button>
        )}
        {mode === 'forgot' && (
          <button type="button" className="link-btn" onClick={() => switchMode('login')}>
            {t('backToLogin')}
          </button>
        )}
      </div>
    </div>
  );
}
