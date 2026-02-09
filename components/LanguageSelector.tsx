
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ur', label: 'اردو', flag: '🇵🇰' },
    { code: 'ro', label: 'Roman', flag: '🔡' }
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="fixed top-4 right-4 z-[100] group">
      <div 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="relative"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white border-2 border-slate-100 shadow-xl px-4 py-2 rounded-2xl flex items-center gap-2 hover:border-[#25D366] transition-all active:scale-95"
        >
          <span className="text-xl">{currentLang?.flag}</span>
          <span className="font-black text-xs uppercase tracking-widest text-slate-700">{currentLang?.label}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 min-w-[140px] animate-in slide-in-from-top-2 duration-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${language === lang.code ? 'bg-green-50 text-[#25D366]' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-bold text-sm">{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
