'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';

const ACTIVE_PATHS = ['/dashboard', '/riwayat', '/settings'];

export default function ExitGuard() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [showToast, setShowToast] = useState(false);
  const lastBackTime = useRef(0);
  const toastTimeout = useRef(null);

  const active = ACTIVE_PATHS.includes(pathname);

  useEffect(() => {
    if (!active) return;

    // Selalu ada 1 history entry ekstra supaya tombol Back memicu popstate,
    // bukan langsung menutup aplikasi.
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
  }, [active, pathname]);

  if (!active || !showToast) return null;

  return <div className="exit-toast">{t('pressBackAgainToExit')}</div>;
}
