
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
  const [language] = useState<Language>('en');

  // Terms agreement is now implicitly true as per user request
  const [hasAgreedTerms, setHasAgreedTermsState] = useState<boolean>(true);

  const [showSelector, setShowSelector] = useState(false);

  const setLanguage = (_lang: Language) => {};
  const setAgreedTerms = (_agreed: boolean) => {};

  const requestAction = (action: () => void) => {
    // Execute action immediately without showing terms modal
    action();
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
    document.title = TRANSLATIONS.en.title;
  }, []);

  const t = TRANSLATIONS.en;

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
