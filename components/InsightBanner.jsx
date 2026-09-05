'use client';

import { useLanguage } from './LanguageProvider';

function rangeTotal(transactions, type, fromOffsetDays, toOffsetDays) {
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - fromOffsetDays);
  const to = new Date(now);
  to.setDate(now.getDate() - toOffsetDays);
  const fromStr = from.toISOString().slice(0, 10);
  const toStr = to.toISOString().slice(0, 10);

  return transactions
    .filter((tx) => tx.type === type && tx.transaction_date >= fromStr && tx.transaction_date <= toStr)
    .reduce((s, tx) => s + Number(tx.amount), 0);
}

export default function InsightBanner({ transactions }) {
  const { lang } = useLanguage();

  const thisWeekExpense = rangeTotal(transactions, 'keluar', 6, 0);
  const lastWeekExpense = rangeTotal(transactions, 'keluar', 13, 7);

  if (lastWeekExpense === 0 && thisWeekExpense === 0) return null;

  let message;
  let up = null;

  if (lastWeekExpense === 0) {
    message = lang === 'en' ? 'New expense activity this week.' : 'Ada aktivitas pengeluaran baru minggu ini.';
  } else {
    const diff = ((thisWeekExpense - lastWeekExpense) / lastWeekExpense) * 100;
    up = diff >= 0;
    const pct = Math.abs(Math.round(diff));
    message =
      lang === 'en'
        ? `Expenses ${up ? 'increased' : 'decreased'} ${pct}% vs last week.`
        : `Pengeluaran ${up ? 'naik' : 'turun'} ${pct}% dibanding minggu lalu.`;
  }

  return (
    <div className={`insight-banner ${up === true ? 'warn' : up === false ? 'good' : ''}`}>
      <span className="insight-icon">{up === false ? '↓' : '↑'}</span>
      <span>{message}</span>
    </div>
  );
}
