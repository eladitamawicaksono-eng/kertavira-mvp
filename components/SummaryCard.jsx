export default function SummaryCard({ masuk, keluar }) {
  const saldo = masuk - keluar;
  const format = (n) => 'Rp' + n.toLocaleString('id-ID');

  return (
    <div className="summary">
      <div className="summary-item">
        <span>Pemasukan</span>
        <strong className="in">{format(masuk)}</strong>
      </div>
      <div className="summary-item">
        <span>Pengeluaran</span>
        <strong className="out">{format(keluar)}</strong>
      </div>
      <div className="summary-item">
        <span>Saldo</span>
        <strong>{format(saldo)}</strong>
      </div>
    </div>
  );
}
