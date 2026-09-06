'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';

function Icon({ name, active }) {
  const color = active ? 'var(--indigo)' : 'var(--grey)';
  const size = 22;

  if (name === 'home') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    );
  }
  if (name === 'list') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3.4a2 2 0 010-4h.09A1.65 1.65 0 005 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 5c.36.14.7.34 1 .6a1.65 1.65 0 001.51-1H12a2 2 0 014 0v.09c.36.14.7.34 1 .6a1.65 1.65 0 001.51 1c.31-.26.65-.46 1-.6l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019 9c.14.36.34.7.6 1H21a2 2 0 010 4h-.09c-.14.36-.34.7-.6 1z" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    { href: '/dashboard', label: t('navHome'), icon: 'home' },
    { href: '/riwayat', label: t('navHistory'), icon: 'list' },
    { href: '/settings', label: t('navSettings'), icon: 'gear' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} replace className={active ? 'nav-item active' : 'nav-item'}>
            <Icon name={item.icon} active={active} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
