'use client';

import { useLanguage } from './LanguageProvider';

export default function WeeklyTrend({ transactions }) {
  const { t } = useLanguage();
  const dayLabels = t('days');

  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const totals = days.map((date) => {
    const dayTx = transactions.filter((tx) => tx.transaction_date === date);
    const masuk = dayTx
      .filter((tx) => tx.type === 'masuk')
      .reduce((s, tx) => s + Number(tx.amount), 0);
    const keluar = dayTx
      .filter((tx) => tx.type === 'keluar')
      .reduce((s, tx) => s + Number(tx.amount), 0);
    return { date, net: masuk - keluar };
  });

  const maxAbs = Math.max(1, ...totals.map((tv) => Math.abs(tv.net)));

  function dayLabel(dateStr) {
    const d = new Date(dateStr);
    return dayLabels[d.getDay()];
  }

  return (
    <div className="trend">
      <h2>{t('weeklyTrend')}</h2>
      <div className="trend-chart">
        {totals.map((tv) => (
          <div className="trend-col" key={tv.date}>
            <div className="trend-bar-wrap">
              <div
                className={`trend-bar ${tv.net >= 0 ? 'pos' : 'neg'}`}
                style={{ height: `${Math.max(4, (Math.abs(tv.net) / maxAbs) * 60)}px` }}
              />
            </div>
            <span className="trend-day">{dayLabel(tv.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
