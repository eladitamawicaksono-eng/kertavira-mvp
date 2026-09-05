'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

const HIDE_ON = ['/', '/login', '/reset-password'];

export default function AppChrome() {
  const pathname = usePathname();
  if (HIDE_ON.includes(pathname)) return null;
  return <BottomNav />;
}
