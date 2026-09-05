'use client';

import { useLanguage } from './LanguageProvider';

export default function CategoryBreakdown({ transactions, categories }) {
  const { t } = useLanguage();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const totals = {};
  transactions
    .filter((tx) => tx.type === 'keluar')
    .forEach((tx) => {
      const label = categoryMap[tx.category_id] || t('noCategory');
      totals[label] = (totals[label] || 0) + Number(tx.amount);
    });

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 0;

  if (!entries.length) return null;

  return (
    <div className="breakdown">
      <h2>{t('expenseByCategory')}</h2>
      <div className="breakdown-list">
        {entries.map(([label, value]) => (
          <div className="breakdown-row" key={label}>
            <div className="breakdown-label">
              <span>{label}</span>
              <span>Rp{value.toLocaleString('id-ID')}</span>
            </div>
            <div className="breakdown-track">
              <div
                className="breakdown-bar"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
