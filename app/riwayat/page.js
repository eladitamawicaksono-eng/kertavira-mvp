'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { exportTransactionsAsImage } from '../../lib/exportImage';
import { formatMonthLabel, formatDateHeader } from '../../lib/i18n';
import { useLanguage } from '../../components/LanguageProvider';
import TransactionList from '../../components/TransactionList';

function currentMonthValue() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const PAGE_SIZE = 30;

export default function RiwayatPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [session, setSession] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [month, setMonth] = useState(currentMonthValue());
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/login');
      else setSession(data.session);
    });
  }, [router]);

  const loadMerchant = useCallback(async (merchantId) => {
    const { data } = await supabase
      .from('merchants')
      .select('business_name')
      .eq('id', merchantId)
      .single();
    if (data?.business_name && !data.business_name.includes('@')) {
      setBusinessName(data.business_name);
    }
  }, []);

  const loadCategories = useCallback(async (merchantId) => {
    const { data } = await supabase.from('categories').select('*').eq('merchant_id', merchantId);
    setCategories(data || []);
  }, []);

  const loadTransactions = useCallback(
    async (targetPage) => {
      if (!session) return;
      setLoading(true);

      const [year, mon] = month.split('-').map(Number);
      const start = `${year}-${String(mon).padStart(2, '0')}-01`;
      const lastDay = new Date(year, mon, 0).getDate();
      const end = `${year}-${String(mon).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const from = targetPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data } = await supabase
        .from('transactions')
        .select('*')
        .gte('transaction_date', start)
        .lte('transaction_date', end)
        .order('transaction_date', { ascending: false })
        .range(from, to);

      setTransactions((prev) => (targetPage === 0 ? data || [] : [...prev, ...(data || [])]));
      setHasMore((data || []).length === PAGE_SIZE);
      setLoading(false);
    },
    [session, month]
  );

  useEffect(() => {
    if (!session) return;
    loadMerchant(session.user.id);
    loadCategories(session.user.id);
  }, [session, loadMerchant, loadCategories]);

  useEffect(() => {
    if (!session) return;
    setPage(0);
    loadTransactions(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, month]);

  function loadMore() {
    const next = page + 1;
    setPage(next);
    loadTransactions(next);
  }

  function refreshAfterChange() {
    setPage(0);
    loadTransactions(0);
  }

  function handleExport() {
    exportTransactionsAsImage({
      businessName,
      periodLabel: formatMonthLabel(month, lang),
      transactions,
      lang,
      t,
    });
  }

  // Kelompokkan transaksi per tanggal biar rapi
  const groups = [];
  transactions.forEach((tx) => {
    const last = groups[groups.length - 1];
    if (last && last.date === tx.transaction_date) {
      last.items.push(tx);
    } else {
      groups.push({ date: tx.transaction_date, items: [tx] });
    }
  });

  if (!session) return null;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>{t('historyTitle')}</h1>
          <span className="greeting">{t('historySubtitle')}</span>
        </div>
      </header>

      <div className="tx-form">
        <label style={{ fontSize: 13, fontWeight: 700 }}>{t('selectMonth')}</label>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        <button
          type="button"
          className="ghost"
          style={{ width: '100%', textAlign: 'center', padding: 12 }}
          onClick={handleExport}
        >
          {t('exportImage')}
        </button>
      </div>

      {groups.length === 0 && !loading && <p className="empty">{t('noTransactionsYet')}</p>}

      {groups.map((group) => (
        <div key={group.date} className="date-group">
          <div className="date-header">{formatDateHeader(group.date, lang)}</div>
          <TransactionList transactions={group.items} categories={categories} onChanged={refreshAfterChange} />
        </div>
      ))}

      {hasMore && !loading && (
        <button
          type="button"
          className="ghost"
          style={{ width: '100%', textAlign: 'center', marginTop: 12, padding: 12 }}
          onClick={loadMore}
        >
          {t('loadMore')}
        </button>
      )}
      {loading && <p style={{ textAlign: 'center', color: 'var(--grey)', marginTop: 12 }}>{t('loading')}</p>}
    </div>
  );
}
