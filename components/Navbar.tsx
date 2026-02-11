
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t.homeLink },
    { path: '/groups', label: t.viewLink },
    { path: '/trending', label: t.trendingLink },
    { path: '/add', label: t.addBtn },
    { path: '/official', label: t.officialLink },
    { path: '/about', label: t.aboutLink },
    { path: '/promotion', label: t.dir === 'rtl' ? 'پروموشن' : 'Promotion' },
  ];

  return (
    <nav className="sticky top-0 z-[60] bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#25D366] rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-90">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <span className="text-lg font-black text-slate-900 urdu-font leading-none uppercase tracking-tighter">{t.title}</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block scale-90">
            <LanguageSelector />
          </div>
          {/* Compact Three-Dot Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="w-11 h-11 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-all border border-slate-200"
          >
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          </button>
        </div>
      </div>

      {/* Modern Overlay Menu - Smaller and Cleaner */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-black text-slate-400 urdu-font uppercase tracking-widest">{t.dir === 'rtl' ? 'مینو' : 'MENU'}</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl text-xl font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
              >✕</button>
            </div>
            
            <div className="flex flex-col gap-1 py-4">
              <div className="sm:hidden mb-6 flex justify-center">
                <LanguageSelector />
              </div>
              {navLinks.map((link) => {
                const isCurrent = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-2xl md:text-3xl font-black transition-all urdu-font py-3 px-4 rounded-2xl flex items-center gap-4 ${
                      isCurrent 
                        ? 'text-[#25D366] bg-green-50' 
                        : 'text-slate-800 hover:text-[#25D366] hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 bg-current rounded-full opacity-30"></span>
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[9px]">WhatsApp Hub 2026</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
