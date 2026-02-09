
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations } from '../types';
import { TRANSLATIONS } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  hasAgreedTerms: boolean;
  setAgreedTerms: (agreed: boolean) => void;
  t: Translations;
  showSelector: boolean;
  setShowSelector: (show: boolean) => void;
  requestAction: (action: () => void) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'en';
  });

  const [hasAgreedTerms] = useState<boolean>(true);
  const [showSelector, setShowSelector] = useState(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const setAgreedTerms = (_agreed: boolean) => {};

  const requestAction = (action: () => void) => {
    action();
  };

  useEffect(() => {
    const t = TRANSLATIONS[language];
    document.documentElement.setAttribute('dir', t.dir);
    document.documentElement.setAttribute('lang', language);
    document.title = t.title;
  }, [language]);

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ 
      language, setLanguage, hasAgreedTerms, setAgreedTerms, t, 
      showSelector, setShowSelector, requestAction 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
