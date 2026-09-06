'use client';

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from './LanguageProvider';

export default function ExitGuard() {
  const { t } = useLanguage();
  const [showToast, setShowToast] = useState(false);
  const lastBackTime = useRef(0);
  const toastTimeout = useRef(null);

  useEffect(() => {
    // Push SATU entry "penjaga" sekali saja waktu komponen ini pertama kali aktif
    // (bukan tiap kali pindah tab), supaya riwayat tetap datar.
    window.history.pushState({ kvGuard: true }, '', window.location.href);

    function handlePopState() {
      const now = Date.now();
      if (now - lastBackTime.current < 2000) {
        // Tekan ke-2 dalam 2 detik -> biarkan keluar, JANGAN cegah lagi
        lastBackTime.current = 0;
        return;
      }
      // Tekan pertama -> batalkan navigasi, tampilkan toast peringatan
      lastBackTime.current = now;
      window.history.pushState({ kvGuard: true }, '', window.location.href);
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 2000);
    }

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(toastTimeout.current);
    };
    // Sengaja cuma jalan sekali (mount), bukan tiap ganti halaman
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!showToast) return null;

  return <div className="exit-toast">{t('pressBackAgainToExit')}</div>;
}
