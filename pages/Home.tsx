
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import GroupCard from '../components/GroupCard';
import { WhatsAppGroup } from '../types';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    const loadGroups = async () => {
      try {
        if (isMounted) setLoading(true);
        const res = await fetch(`/api/get-groups?v=${Date.now()}`);
        
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setGroups(data);
        }
      } catch (err) {
        console.error('Data loading failed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadGroups();
    return () => { isMounted = false; };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/groups?q=${encodeURIComponent(search)}`);
  };

  const categories = ['Education', 'Jobs', 'Business', 'Islamic', 'Videos', 'Hot'] as const;
  const getEmoji = (cat: string) => ({
    Education: '📚', Jobs: '💼', Business: '📈', Islamic: '🕌', Videos: '🎥', Hot: '🔥'
  }[cat] || '📁');

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Modern Hero Section */}
      <section className="relative pt-20 pb-24 px-4 bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-40"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-2xl text-[11px] font-black uppercase tracking-widest mb-10 border border-green-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            پاکستان کی نمبر 1 ڈائریکٹری
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] urdu-font tracking-tight">
            {t.title} <br/>
            <span className="text-[#25D366]">صحیح گروپ، صحیح معلومات</span>
          </h1>
          
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-14 urdu-font leading-relaxed opacity-90">
            {t.subtitle}
          </p>

          {/* Clean Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mb-12">
            <div className="group flex bg-white rounded-[2.5rem] p-2 border-2 border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] focus-within:border-[#25D366] focus-within:shadow-green-100 transition-all duration-300">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 px-8 py-5 rounded-3xl outline-none text-xl font-bold text-right text-slate-800 urdu-font bg-transparent"
              />
              <button type="submit" className="btn-gradient text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-lg shadow-green-200 hover:scale-[1.02] transition-all active:scale-95">
                {t.searchBtn}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-5">
            <button onClick={() => navigate('/groups')} className="px-12 py-6 bg-slate-900 text-white rounded-[1.8rem] font-black hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center gap-3">
              <span>{t.viewGroupsBtn}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <button onClick={() => navigate('/add')} className="px-12 py-6 bg-white border-2 border-slate-100 text-slate-900 rounded-[1.8rem] font-black hover:border-[#25D366] transition-all flex items-center gap-3">
              <span className="text-2xl">+</span>
              <span>{t.addBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 -mt-10 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 p-3 overflow-x-auto no-scrollbar flex justify-center">
          <div className="flex gap-3 min-w-max px-4">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => navigate(`/groups?cat=${encodeURIComponent(cat)}`)}
                className="flex items-center gap-3 px-8 py-5 rounded-3xl hover:bg-green-50 transition-all group border border-transparent hover:border-green-100"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{getEmoji(cat)}</span>
                <span className="font-bold text-slate-700 urdu-font text-lg">{t.categories[cat]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <section className="max-w-7xl mx-auto w-full px-6 py-24">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-1 bg-[#25D366] rounded-full"></div>
            <h2 className="text-4xl font-black text-slate-900 urdu-font">تازہ ترین گروپس</h2>
          </div>
          <button onClick={() => navigate('/groups')} className="bg-white px-6 py-3 rounded-2xl border border-slate-100 text-[#25D366] font-black hover:bg-green-50 transition-all urdu-font">سب دیکھیں</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bg-white border border-slate-100 rounded-[3rem] animate-pulse"></div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
            <div className="text-8xl mb-8 opacity-20">📂</div>
            <h3 className="text-3xl font-black text-slate-300 urdu-font">ابھی کوئی گروپ موجود نہیں ہے</h3>
            <p className="text-slate-400 mt-4 font-bold text-sm tracking-[0.2em] uppercase">Be the first to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {groups.slice(0, 15).map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </section>

      {/* Footer Branding */}
      <footer className="bg-slate-900 py-20 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-[#25D366] text-4xl font-black mb-6">WhatsApp Directory</div>
          <p className="text-slate-400 font-medium mb-10 max-w-md mx-auto urdu-font">
            پاکستان کی سب سے بڑی اور محفوظ ترین واٹس ایپ گروپ ڈائریکٹری۔
          </p>
          <div className="flex justify-center gap-8 text-slate-500 font-black text-xs uppercase tracking-widest">
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About</button>
            <button onClick={() => navigate('/promotion')} className="hover:text-white transition-colors">Promote</button>
            <button onClick={() => navigate('/official')} className="hover:text-white transition-colors">Official</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
