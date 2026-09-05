'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from './LanguageProvider';

export default function CategorySelect({
  categories,
  type,
  merchantId,
  value,
  onChange,
  onCategoryAdded,
}) {
  const { t } = useLanguage();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const filtered = categories.filter((c) => c.type === type);

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newName.trim()) return;

    const { data } = await supabase
      .from('categories')
      .insert({ merchant_id: merchantId, name: newName.trim(), type })
      .select()
      .single();

    if (data) {
      onCategoryAdded(data);
      onChange(data.id);
    }
    setNewName('');
    setAdding(false);
  }

  if (adding) {
    return (
      <form className="category-add" onSubmit={handleAddCategory}>
        <input
          autoFocus
          type="text"
          placeholder={t('newCategoryName')}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit">{t('add')}</button>
        <button type="button" className="ghost" onClick={() => setAdding(false)}>
          {t('cancel')}
        </button>
      </form>
    );
  }

  return (
    <select
      className="category-select"
      value={value}
      onChange={(e) => {
        if (e.target.value === '__add__') setAdding(true);
        else onChange(e.target.value);
      }}
    >
      <option value="">{t('noCategory')}</option>
      {filtered.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
      <option value="__add__">{t('addNewCategory')}</option>
    </select>
  );
}
