export function exportToCsv(transactions) {
  const header = 'Tanggal,Tipe,Jumlah,Catatan\n';
  const rows = transactions
    .map(
      (t) =>
        `${t.transaction_date},${t.type},${t.amount},"${(t.note || '').replace(/"/g, '""')}"`
    )
    .join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kertavira-rekap-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
