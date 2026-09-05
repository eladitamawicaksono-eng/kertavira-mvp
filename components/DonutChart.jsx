'use client';

import { useLanguage } from './LanguageProvider';

export default function DonutChart({ masuk, keluar }) {
  const { t } = useLanguage();
  const total = masuk + keluar;
  const size = 132;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const masukPct = total > 0 ? masuk / total : 0;
  const masukLength = circumference * masukPct;
  const pctLabel = total > 0 ? Math.round(masukPct * 100) : 0;

  return (
    <div className="donut-card">
      <div className="donut-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#FEE2E2" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#059669"
            strokeWidth={stroke}
            strokeDasharray={`${masukLength} ${circumference - masukLength}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="donut-arc"
          />
        </svg>
        <div className="donut-center">
          <strong>{pctLabel}%</strong>
          <span>{t('income')}</span>
        </div>
      </div>
      <div className="donut-legend">
        <div className="legend-row">
          <span className="dot in" />
          {t('income')}
        </div>
        <div className="legend-row">
          <span className="dot out" />
          {t('expense')}
        </div>
      </div>
    </div>
  );
}
