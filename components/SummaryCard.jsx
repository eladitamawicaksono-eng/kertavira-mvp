'use client';

import { useLanguage } from './LanguageProvider';

export default function SummaryCard({ masuk, keluar }) {
  const { t } = useLanguage();
  const saldo = masuk - keluar;
  const format = (n) => 'Rp' + n.toLocaleString('id-ID');

  return (
    <div className="summary">
      <div className="summary-item">
        <div className="summary-icon in">↑</div>
        <span>{t('income')}</span>
        <strong className="in">{format(masuk)}</strong>
      </div>
      <div className="summary-item">
        <div className="summary-icon out">↓</div>
        <span>{t('expense')}</span>
        <strong className="out">{format(keluar)}</strong>
      </div>
      <div className="summary-item">
        <div className="summary-icon balance">Rp</div>
        <span>{t('balance')}</span>
        <strong>{format(saldo)}</strong>
      </div>
    </div>
  );
}
