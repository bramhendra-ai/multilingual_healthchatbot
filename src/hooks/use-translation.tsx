'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';

type Language = 'English' | 'Hindi' | 'Telugu' | 'Tamil';

const translations = {
  English: en,
  Hindi: hi,
  Telugu: te,
  Tamil: ta,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('English');

  useEffect(() => {
    const storedLang = localStorage.getItem('appLanguage') as Language;
    if (storedLang && translations[storedLang]) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  const t = (key: keyof typeof en): string => {
    return translations[language][key] || translations['English'][key] || key;
  };

  const value = { language, setLanguage: handleSetLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
