import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg shadow-green-200 group-active:scale-90 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">{t.title}</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-bold transition-all ${isActive('/') ? 'text-[#25D366]' : 'text-slate-500 hover:text-slate-900'}`}>
            {t.homeLink}
          </Link>
          <Link to="/groups" className={`text-sm font-bold transition-all ${isActive('/groups') ? 'text-[#25D366]' : 'text-slate-500 hover:text-slate-900'}`}>
            {t.viewLink}
          </Link>
          <Link to="/promotion" className={`text-sm font-bold transition-all ${isActive('/promotion') ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>
            {t.promoLink}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/add" className="bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:bg-slate-900 transition-all active:scale-95">
            + {t.addBtn}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;