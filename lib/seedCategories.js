import { supabase } from './supabaseClient';

const DEFAULT_CATEGORIES = [
  { name: 'Penjualan', type: 'masuk' },
  { name: 'Modal', type: 'masuk' },
  { name: 'Lainnya', type: 'masuk' },
  { name: 'Stok Barang', type: 'keluar' },
  { name: 'Operasional', type: 'keluar' },
  { name: 'Gaji', type: 'keluar' },
  { name: 'Lainnya', type: 'keluar' },
];

export async function ensureDefaultCategories(merchantId) {
  const { count } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true })
    .eq('merchant_id', merchantId);

  if (count && count > 0) return;

  await supabase
    .from('categories')
    .insert(DEFAULT_CATEGORIES.map((c) => ({ ...c, merchant_id: merchantId })));
}
