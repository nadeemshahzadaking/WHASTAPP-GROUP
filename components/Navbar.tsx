
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
    <nav className="sticky top-0 z-[60] bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-36 flex items-center justify-between">
        {/* Logo and Language Toggle Area */}
        <div className="flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </div>
            <span className="text-xl font-black text-slate-900 urdu-font leading-none">{t.title}</span>
          </Link>
          <LanguageSelector />
        </div>
        
        {/* Stylish Three-Dot Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100 transition-all border border-slate-200 shadow-sm"
        >
          <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
        </button>
      </div>

      {/* Modern Overlay Menu with Large Red Text that turns Green on Interaction */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-3xl animate-in slide-in-from-right duration-500 overflow-y-auto">
          <div className="p-8 min-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <span className="text-3xl font-black text-slate-900 urdu-font uppercase tracking-widest">{t.dir === 'rtl' ? 'مینو' : 'MENU'}</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-16 h-16 flex items-center justify-center bg-slate-100 rounded-2xl text-3xl font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
              >✕</button>
            </div>
            
            <div className="flex flex-col gap-4 text-center py-10">
              {navLinks.map((link) => {
                const isCurrent = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-5xl md:text-7xl font-black transition-all urdu-font py-4 outline-none ${
                      isCurrent 
                        ? 'text-[#25D366] scale-110 drop-shadow-sm' 
                        : 'text-red-600 hover:text-[#25D366] hover:scale-110 active:scale-95'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-16 border-t border-slate-100 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[10px]">WhatsApp Hub Official 2026</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
