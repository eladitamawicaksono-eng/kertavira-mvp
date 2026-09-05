export default function TransactionList({ transactions }) {
  if (!transactions.length) {
    return <p className="empty">Belum ada transaksi. Mulai catat hari ini.</p>;
  }

  return (
    <ul className="tx-list">
      {transactions.map((t) => (
        <li key={t.id} className={t.type}>
          <div>
            <strong>{t.note || (t.type === 'masuk' ? 'Pemasukan' : 'Pengeluaran')}</strong>
            <span>{t.transaction_date}</span>
          </div>
          <span className="amount">
            {t.type === 'masuk' ? '+' : '-'}Rp{Number(t.amount).toLocaleString('id-ID')}
          </span>
        </li>
      ))}
    </ul>
  );
}
