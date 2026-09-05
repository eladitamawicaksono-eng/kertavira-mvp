'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TransactionList({ transactions, categories, onChanged }) {
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editType, setEditType] = useState('masuk');
  const [editCategoryId, setEditCategoryId] = useState('');

  function startEdit(t) {
    setEditingId(t.id);
    setEditAmount(String(t.amount));
    setEditNote(t.note || '');
    setEditType(t.type);
    setEditCategoryId(t.category_id || '');
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id) {
    await supabase
      .from('transactions')
      .update({
        amount: Number(editAmount),
        note: editNote,
        type: editType,
        category_id: editCategoryId || null,
      })
      .eq('id', id);
    setEditingId(null);
    onChanged();
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus transaksi ini? Tindakan ini tidak bisa dibatalkan.')) return;
    await supabase.from('transactions').delete().eq('id', id);
    onChanged();
  }

  if (!transactions.length) {
    return <p className="empty">Belum ada transaksi. Mulai catat hari ini.</p>;
  }

  return (
    <ul className="tx-list">
      {transactions.map((t) => {
        if (editingId === t.id) {
          const filtered = categories.filter((c) => c.type === editType);
          return (
            <li key={t.id} className="editing">
              <div className="edit-row">
                <div className="toggle small">
                  <button
                    type="button"
                    className={editType === 'masuk' ? 'active in' : 'in'}
                    onClick={() => setEditType('masuk')}
                  >
                    Masuk
                  </button>
                  <button
                    type="button"
                    className={editType === 'keluar' ? 'active out' : 'out'}
                    onClick={() => setEditType('keluar')}
                  >
                    Keluar
                  </button>
                </div>
                <select
                  className="category-select"
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                >
                  <option value="">Tanpa kategori</option>
                  {filtered.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="Jumlah (Rp)"
                />
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Catatan"
                />
                <div className="edit-actions">
                  <button type="button" className="save-btn" onClick={() => saveEdit(t.id)}>
                    Simpan
                  </button>
                  <button type="button" className="ghost" onClick={cancelEdit}>
                    Batal
                  </button>
                </div>
              </div>
            </li>
          );
        }

        return (
          <li key={t.id} className={t.type}>
            <div>
              <strong>{t.note || (t.type === 'masuk' ? 'Pemasukan' : 'Pengeluaran')}</strong>
              <span>{t.transaction_date}</span>
            </div>
            <div className="tx-right">
              <span className="amount">
                {t.type === 'masuk' ? '+' : '-'}Rp{Number(t.amount).toLocaleString('id-ID')}
              </span>
              <div className="tx-actions">
                <button type="button" className="icon-btn" onClick={() => startEdit(t)} title="Edit">
                  ✎
                </button>
                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => handleDelete(t.id)}
                  title="Hapus"
                >
                  🗑
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
