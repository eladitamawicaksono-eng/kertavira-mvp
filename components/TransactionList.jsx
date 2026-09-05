'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from './LanguageProvider';

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

export default function TransactionList({ transactions, categories, onChanged }) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editType, setEditType] = useState('masuk');
  const [editCategoryId, setEditCategoryId] = useState('');

  function startEdit(tx) {
    setEditingId(tx.id);
    setEditAmount(String(tx.amount));
    setEditNote(tx.note || '');
    setEditType(tx.type);
    setEditCategoryId(tx.category_id || '');
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
    if (!window.confirm(t('confirmDelete'))) return;
    await supabase.from('transactions').delete().eq('id', id);
    onChanged();
  }

  if (!transactions.length) {
    return <p className="empty">{t('noTransactionsYet')}</p>;
  }

  return (
    <ul className="tx-list">
      {transactions.map((tx) => {
        if (editingId === tx.id) {
          const filtered = categories.filter((c) => c.type === editType);
          return (
            <li key={tx.id} className="editing">
              <div className="edit-row">
                <div className="toggle small">
                  <button
                    type="button"
                    className={editType === 'masuk' ? 'active in' : 'in'}
                    onClick={() => setEditType('masuk')}
                  >
                    {t('income')}
                  </button>
                  <button
                    type="button"
                    className={editType === 'keluar' ? 'active out' : 'out'}
                    onClick={() => setEditType('keluar')}
                  >
                    {t('expense')}
                  </button>
                </div>
                <select
                  className="category-select"
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                >
                  <option value="">{t('noCategory')}</option>
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
                  placeholder={t('amount')}
                />
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder={t('note')}
                />
                <div className="edit-actions">
                  <button type="button" className="save-btn" onClick={() => saveEdit(tx.id)}>
                    {t('save')}
                  </button>
                  <button type="button" className="ghost" onClick={cancelEdit}>
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </li>
          );
        }

        return (
          <li key={tx.id} className={tx.type}>
            <div>
              <strong>{tx.note || (tx.type === 'masuk' ? t('income') : t('expense'))}</strong>
              <span>{tx.transaction_date}</span>
            </div>
            <div className="tx-right">
              <span className="amount">
                {tx.type === 'masuk' ? '+' : '-'}Rp{Number(tx.amount).toLocaleString('id-ID')}
              </span>
              <div className="tx-actions">
                <button type="button" className="icon-btn" onClick={() => startEdit(tx)} title={t('edit')} aria-label={t('edit')}>
                  <EditIcon />
                </button>
                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => handleDelete(tx.id)}
                  title={t('delete')}
                  aria-label={t('delete')}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
