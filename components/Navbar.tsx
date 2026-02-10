
import React from 'react';
// @ts-ignore - Ignoring missing exports error for react-router-dom
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-[60] border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-black whatsapp-green-text flex items-center gap-2 hover:scale-105 transition-all">
              <span className="text-2xl">💬</span>
              <span className="hidden sm:inline tracking-tight text-slate-900">{t.title}</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-bold transition-colors ${isActive('/') ? 'text-[#25D366]' : 'text-slate-500 hover:text-slate-900'}`}>
              {t.homeLink}
            </Link>
            <Link to="/groups" className={`text-sm font-bold transition-colors ${isActive('/groups') ? 'text-[#25D366]' : 'text-slate-500 hover:text-slate-900'}`}>
              {t.viewLink}
            </Link>
            <Link to="/promotion" className={`relative text-sm font-bold transition-colors ${isActive('/promotion') ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>
              {t.promoLink}
              <span className="absolute -top-1 -right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </Link>
            <Link to="/official" className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-black tracking-wide hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              OFFICIAL
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
             <Link to="/add" className="bg-[#25D366] text-white p-2 rounded-xl active:scale-95 shadow-lg shadow-green-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
             </Link>
             <Link to="/official" className="bg-blue-50 text-blue-600 px-3 py-2 rounded-xl font-black text-[10px] tracking-tighter uppercase border border-blue-100">
                OFFICIAL
             </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
