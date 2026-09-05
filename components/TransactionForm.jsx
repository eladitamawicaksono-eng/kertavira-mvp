'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from './LanguageProvider';
import CategorySelect from './CategorySelect';

export default function TransactionForm({ merchantId, categories, onSaved, onCategoryAdded }) {
  const { t } = useLanguage();
  const [type, setType] = useState('masuk');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  function handleTypeChange(newType) {
    setType(newType);
    setCategoryId('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;
    setSaving(true);

    await supabase.from('transactions').insert({
      merchant_id: merchantId,
      type,
      category_id: categoryId || null,
      amount: Number(amount),
      note,
      transaction_date: new Date().toISOString().slice(0, 10),
    });

    setAmount('');
    setNote('');
    setCategoryId('');
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1100);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="tx-form">
      <div className="toggle">
        <button
          type="button"
          className={type === 'masuk' ? 'active in' : 'in'}
          onClick={() => handleTypeChange('masuk')}
        >
          {t('income')}
        </button>
        <button
          type="button"
          className={type === 'keluar' ? 'active out' : 'out'}
          onClick={() => handleTypeChange('keluar')}
        >
          {t('expense')}
        </button>
      </div>

      <CategorySelect
        categories={categories}
        type={type}
        merchantId={merchantId}
        value={categoryId}
        onChange={setCategoryId}
        onCategoryAdded={onCategoryAdded}
      />

      <input
        type="number"
        inputMode="numeric"
        placeholder={t('amount')}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder={t('note')}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button type="submit" disabled={saving} className={justSaved ? 'save-success' : ''}>
        {justSaved ? '✓' : saving ? t('saving') : t('save')}
      </button>
    </form>
  );
}
