
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black whatsapp-green-text flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
              <span className="text-3xl drop-shadow-sm">💬</span>
              <span className="hidden sm:inline tracking-tight">{t.title}</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
                <Link
                  to="/"
                  className={`${isActive('/') ? 'text-[#25D366] font-black' : 'text-slate-500 font-bold hover:text-slate-800'} text-sm transition-all`}
                >
                  {t.homeLink}
                </Link>
                <Link
                  to="/groups"
                  className={`${isActive('/groups') ? 'text-[#25D366] font-black' : 'text-slate-500 font-bold hover:text-slate-800'} text-sm transition-all`}
                >
                  {t.viewLink}
                </Link>
                <Link
                  to="/add"
                  className={`${isActive('/add') ? 'text-[#25D366] font-black' : 'text-slate-500 font-bold hover:text-slate-800'} text-sm transition-all`}
                >
                  {t.addLink}
                </Link>
                <Link
                  to="/promotion"
                  className={`relative group ${isActive('/promotion') ? 'text-blue-600 font-black' : 'text-slate-500 font-bold hover:text-slate-800'} text-sm transition-all`}
                >
                  <span className="animate-ping absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-75"></span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                  {t.promoLink}
                </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
             <Link to="/official" className="p-3 bg-green-100 text-green-600 rounded-2xl shadow-sm active:scale-95">
                🔗
             </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
