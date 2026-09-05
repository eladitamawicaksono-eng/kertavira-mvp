function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export function exportTransactionsAsImage({ businessName, periodLabel, transactions, lang = 'id', t }) {
  const ROW_H = 32;
  const HEADER_H = 230;
  const FOOTER_H = 36;
  const width = 720;
  const height = Math.max(400, HEADER_H + transactions.length * ROW_H + FOOTER_H);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#F6F5FB';
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#4338CA');
  gradient.addColorStop(1, '#6D28D9');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 90);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 24px Arial';
  ctx.fillText('Kertavira', 24, 38);
  ctx.font = '400 14px Arial';
  ctx.fillText(businessName || '', 24, 60);
  ctx.font = '600 13px Arial';
  ctx.fillText(periodLabel, 24, 80);

  const masuk = transactions.filter((tx) => tx.type === 'masuk').reduce((s, tx) => s + Number(tx.amount), 0);
  const keluar = transactions.filter((tx) => tx.type === 'keluar').reduce((s, tx) => s + Number(tx.amount), 0);
  const saldo = masuk - keluar;
  const fmt = (n) => 'Rp' + n.toLocaleString('id-ID');

  const boxY = 106;
  const gap = 14;
  const boxW = (width - 24 * 2 - gap * 2) / 3;
  const labels = [t('income'), t('expense'), t('balance')];
  const values = [masuk, keluar, saldo];
  const colors = ['#059669', '#dc2626', '#1E1B4B'];

  labels.forEach((label, i) => {
    const x = 24 + i * (boxW + gap);
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, x, boxY, boxW, 58, 10);
    ctx.fill();
    ctx.fillStyle = '#6B7280';
    ctx.font = '600 11px Arial';
    ctx.fillText(label, x + 12, boxY + 22);
    ctx.fillStyle = colors[i];
    ctx.font = '700 16px Arial';
    ctx.fillText(fmt(values[i]), x + 12, boxY + 44);
  });

  let y = boxY + 58 + 34;
  const col1 = 24;
  const col2 = 130;
  const col3 = width - 24 - 130;

  ctx.fillStyle = '#1E1B4B';
  ctx.font = '700 12.5px Arial';
  ctx.fillText(t('dateLabel'), col1, y);
  ctx.fillText(t('noteLabel'), col2, y);
  ctx.fillText(t('amountLabel'), col3, y);

  y += 10;
  ctx.strokeStyle = '#ECE9F7';
  ctx.beginPath();
  ctx.moveTo(24, y);
  ctx.lineTo(width - 24, y);
  ctx.stroke();
  y += 22;

  ctx.font = '400 12.5px Arial';
  transactions.forEach((tx) => {
    ctx.fillStyle = '#1E1B4B';
    ctx.fillText(tx.transaction_date, col1, y);
    const noteText = tx.note || (tx.type === 'masuk' ? t('income') : t('expense'));
    ctx.fillText(truncate(noteText, 26), col2, y);
    ctx.fillStyle = tx.type === 'masuk' ? '#059669' : '#dc2626';
    const amtText = (tx.type === 'masuk' ? '+' : '-') + fmt(Number(tx.amount));
    ctx.fillText(amtText, col3, y);
    y += ROW_H;
  });

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 11px Arial';
  ctx.fillText(t('generatedBy'), 24, height - 14);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kertavira-${periodLabel.replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
