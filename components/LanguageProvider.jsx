'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations } from '../lib/i18n';

const LanguageContext = createContext({
  lang: 'id',
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('id');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('kertavira_lang') : null;
    if (saved === 'id' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') window.localStorage.setItem('kertavira_lang', newLang);
  }, []);

  const t = useCallback(
    (key) => {
      const value = translations[lang]?.[key];
      return value !== undefined ? value : key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
