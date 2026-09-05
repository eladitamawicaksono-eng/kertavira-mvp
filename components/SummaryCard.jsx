export default function SummaryCard({ masuk, keluar }) {
  const saldo = masuk - keluar;
  const format = (n) => 'Rp' + n.toLocaleString('id-ID');

  return (
    <div className="summary">
      <div className="summary-item">
        <div className="summary-icon in">↑</div>
        <span>Pemasukan</span>
        <strong className="in">{format(masuk)}</strong>
      </div>
      <div className="summary-item">
        <div className="summary-icon out">↓</div>
        <span>Pengeluaran</span>
        <strong className="out">{format(keluar)}</strong>
      </div>
      <div className="summary-item">
        <div className="summary-icon balance">Rp</div>
        <span>Saldo</span>
        <strong>{format(saldo)}</strong>
      </div>
    </div>
  );
}