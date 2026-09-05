'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function SettingsPage() {
  const router = useRouter();
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
    setInfo('Nama usaha berhasil disimpan.');
  }

  async function handleResetPassword() {
    if (!session) return;
    setResetInfo('Mengirim...');
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, { redirectTo });
    setResetInfo(
      error ? error.message : `Link ganti password sudah dikirim ke ${session.user.email}.`
    );
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
          <h1>Pengaturan</h1>
          <span className="greeting">{session.user.email}</span>
        </div>
      </header>

      <form className="tx-form" onSubmit={handleSave}>
        <label style={{ fontSize: 13, fontWeight: 700 }}>Nama Usaha</label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Nama usaha kamu"
        />
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Nama Usaha'}
        </button>
        {info && <p className="success">{info}</p>}
      </form>

      <div className="tx-form">
        <label style={{ fontSize: 13, fontWeight: 700 }}>Keamanan Akun</label>
        <button type="button" className="ghost" style={{ width: '100%', textAlign: 'center', padding: 12 }} onClick={handleResetPassword}>
          Kirim link ganti password
        </button>
        {resetInfo && <p className="success">{resetInfo}</p>}
      </div>

      <div className="tx-form">
        <button type="button" className="btn-danger" onClick={handleLogout}>
          Keluar dari akun
        </button>
      </div>
    </div>
  );
}
