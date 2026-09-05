'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getTemplates, deleteTemplate } from '../lib/templates';

export default function QuickTemplates({ merchantId, onAdded }) {
  const [templates, setTemplates] = useState([]);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  async function handleTap(tpl) {
    setAddingId(tpl.id);
    await supabase.from('transactions').insert({
      merchant_id: merchantId,
      type: tpl.type,
      category_id: tpl.category_id || null,
      amount: tpl.amount,
      note: tpl.label,
      transaction_date: new Date().toISOString().slice(0, 10),
    });
    setAddingId(null);
    onAdded();
  }

  function handleRemove(id, e) {
    e.stopPropagation();
    setTemplates(deleteTemplate(id));
  }

  if (!templates.length) return null;

  return (
    <div className="quick-templates">
      {templates.map((tpl) => (
        <button
          key={tpl.id}
          type="button"
          className={`template-chip ${tpl.type}`}
          onClick={() => handleTap(tpl)}
          disabled={addingId === tpl.id}
        >
          <span>{tpl.label}</span>
          <span className="chip-amount">Rp{Number(tpl.amount).toLocaleString('id-ID')}</span>
          <span className="chip-remove" onClick={(e) => handleRemove(tpl.id, e)}>
            ×
          </span>
        </button>
      ))}
    </div>
  );
}
