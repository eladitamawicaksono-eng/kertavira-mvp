'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../components/LanguageProvider';

export default function SettingsPage() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const [session, setSession] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState('');
  const [resetInfo, setResetInfo] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login');
        return;
      }
      setSession(data.session);
      supabase
        .from('merchants')
        .select('business_name')
        .eq('id', data.session.user.id)
        .single()
        .then(({ data: merchant }) => {
          if (merchant?.business_name && !merchant.business_name.includes('@')) {
            setBusinessName(merchant.business_name);
          }
        });
    });
  }, [router]);

  async function handleSave(e) {
    e.preventDefault();
    if (!session) return;
    setSaving(true);
    setInfo('');
    await supabase
      .from('merchants')
      .update({ business_name: businessName.trim() })
      .eq('id', session.user.id);
    setSaving(false);
    setInfo(t('businessNameSaved'));
  }

  async function handleResetPassword() {
    if (!session) return;
    setResetInfo('...');
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, { redirectTo });
    setResetInfo(error ? error.message : `${t('sendPasswordResetLink')} → ${session.user.email}`);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (!session) return null;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>{t('settingsTitle')}</h1>
          <span className="greeting">{session.user.email}</span>
        </div>
      </header>

      <div className="tx-form">
        <label style={{ fontSize: 13, fontWeight: 700 }}>{t('language')}</label>
        <div className="auth-tabs">
          <button type="button" className={lang === 'id' ? 'active' : ''} onClick={() => setLang('id')}>
            Bahasa Indonesia
          </button>
          <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
            English
          </button>
        </div>
      </div>

      <form className="tx-form" onSubmit={handleSave}>
        <label style={{ fontSize: 13, fontWeight: 700 }}>{t('businessName')}</label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder={t('businessNamePlaceholder')}
        />
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? t('saving') : t('saveBusinessName')}
        </button>
        {info && <p className="success">{info}</p>}
      </form>

      <div className="tx-form">
        <label style={{ fontSize: 13, fontWeight: 700 }}>{t('accountSecurity')}</label>
        <button
          type="button"
          className="ghost"
          style={{ width: '100%', textAlign: 'center', padding: 12 }}
          onClick={handleResetPassword}
        >
          {t('sendPasswordResetLink')}
        </button>
        {resetInfo && <p className="success">{resetInfo}</p>}
      </div>

      <div className="tx-form">
        <button type="button" className="btn-danger" onClick={handleLogout}>
          {t('logout')}
        </button>
      </div>
    </div>
  );
}
