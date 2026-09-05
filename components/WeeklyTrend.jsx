export default function WeeklyTrend({ transactions }) {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const totals = days.map((date) => {
    const dayTx = transactions.filter((t) => t.transaction_date === date);
    const masuk = dayTx
      .filter((t) => t.type === 'masuk')
      .reduce((s, t) => s + Number(t.amount), 0);
    const keluar = dayTx
      .filter((t) => t.type === 'keluar')
      .reduce((s, t) => s + Number(t.amount), 0);
    return { date, net: masuk - keluar };
  });

  const maxAbs = Math.max(1, ...totals.map((t) => Math.abs(t.net)));

  function dayLabel(dateStr) {
    const d = new Date(dateStr);
    return ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()];
  }

  return (
    <div className="trend">
      <h2>Arus kas 7 hari terakhir</h2>
      <div className="trend-chart">
        {totals.map((t) => (
          <div className="trend-col" key={t.date}>
            <div className="trend-bar-wrap">
              <div
                className={`trend-bar ${t.net >= 0 ? 'pos' : 'neg'}`}
                style={{ height: `${Math.max(4, (Math.abs(t.net) / maxAbs) * 60)}px` }}
              />
            </div>
            <span className="trend-day">{dayLabel(t.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
