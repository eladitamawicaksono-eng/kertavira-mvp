'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { ensureDefaultCategories } from '../../lib/seedCategories';
import TransactionForm from '../../components/TransactionForm';
import TransactionList from '../../components/TransactionList';
import SummaryCard from '../../components/SummaryCard';
import CategoryBreakdown from '../../components/CategoryBreakdown';
import WeeklyTrend from '../../components/WeeklyTrend';
import { exportToCsv } from '../../lib/exportCsv';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (data?.business_name) setBusinessName(data.business_name);
  }, []);

  const loadCategories = useCallback(async (merchantId) => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('name');
    setCategories(data || []);
  }, []);

  const loadTransactions = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false })
      .limit(100);
    setTransactions(data || []);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (!session) return;
    loadMerchant(session.user.id);
    ensureDefaultCategories(session.user.id).then(() => loadCategories(session.user.id));
    loadTransactions();
  }, [session, loadMerchant, loadCategories, loadTransactions]);

  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'masuk') acc.masuk += Number(t.amount);
      else acc.keluar += Number(t.amount);
      return acc;
    },
    { masuk: 0, keluar: 0 }
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  function handleCategoryAdded(newCategory) {
    setCategories((prev) => [...prev, newCategory]);
  }

  if (!session) return null;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Kertavira</h1>
          {businessName && <span className="greeting">{businessName}</span>}
        </div>
        <button className="ghost" onClick={handleLogout}>
          Keluar
        </button>
      </header>

      <SummaryCard masuk={totals.masuk} keluar={totals.keluar} />

      <TransactionForm
        merchantId={session.user.id}
        categories={categories}
        onSaved={loadTransactions}
        onCategoryAdded={handleCategoryAdded}
      />

      <WeeklyTrend transactions={transactions} />
      <CategoryBreakdown transactions={transactions} categories={categories} />

      <div className="list-header">
        <h2>Transaksi terbaru</h2>
        <button className="ghost" onClick={() => exportToCsv(transactions)}>
          Ekspor CSV
        </button>
      </div>

      {loading ? <p>Memuat...</p> : <TransactionList transactions={transactions} />}
    </div>
  );
}