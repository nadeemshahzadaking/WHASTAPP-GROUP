
import React, { useState, useEffect } from 'react';
// @ts-ignore - Ignoring missing exports error for react-router-dom
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SafetyModal from '../components/SafetyModal';
import GroupCard from '../components/GroupCard';
import { WhatsAppGroup } from '../types';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{title: string, msg: string, details?: string} | null>(null);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  
  const navigate = useNavigate();
  const { t, requestAction } = useLanguage();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/get-groups?t=${Date.now()}`)
      .then(async res => {
        if (!res.ok) throw new Error(`SERVER_ERROR: Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        setGroups(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError({
          title: "Connection Error",
          msg: "Unable to load the directory. Please check your internet connection.",
          details: err.message
        });
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/groups?q=${encodeURIComponent(search)}`);
  };

  const featured = ['Education', 'Jobs', 'Business', 'Islamic', 'Entertainment', 'Videos', 'Hot', 'Pro'] as const;

  const getEmoji = (cat: string) => {
    const emojis: Record<string, string> = {
      Education: '📚', Jobs: '💼', Business: '📈', Islamic: '🕌', 
      Entertainment: '🎬', Videos: '🎥', Hot: '🔥', Pro: '👑'
    };
    return emojis[cat] || '📁';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />
      
      {/* Premium Hero Section */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-green-400/10 blur-[120px] rounded-full -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100 text-[#25D366] text-[10px] font-black uppercase tracking-widest animate-pulse-subtle">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Directory Status: Active
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            {t.title.split(' ')[0]} <span className="whatsapp-green-text">{t.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed px-4">
            {t.subtitle}
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-3xl p-1.5 border border-slate-200 shadow-2xl shadow-slate-200/50">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 px-6 py-4 rounded-2xl outline-none text-lg font-medium"
              />
              <button type="submit" className="bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-green-200">
                {t.searchBtn}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/groups')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all active:scale-95">
              {t.viewGroupsBtn}
            </button>
            <button onClick={() => requestAction(() => navigate('/add'))} className="bg-white border-2 border-[#25D366] text-[#25D366] px-8 py-4 rounded-2xl font-bold hover:bg-green-50 transition-all active:scale-95">
              {t.addBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Scroller */}
      <section className="py-8 bg-white/50 border-y border-slate-100 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 min-w-max">
          {featured.map((cat) => (
            <button 
              key={cat} 
              onClick={() => navigate(`/groups?cat=${encodeURIComponent(cat)}`)} 
              className="bg-white px-6 py-4 rounded-3xl border border-slate-100 flex items-center gap-3 hover:border-[#25D366] hover:shadow-lg hover:shadow-slate-100 transition-all active:scale-95 group"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">{getEmoji(cat)}</span>
              <span className="font-extrabold text-slate-700 text-xs uppercase tracking-tighter">{t.categories[cat]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 max-w-7xl mx-auto w-full px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-green-100 border-t-[#25D366] rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse">Syncing Database...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-rose-50 rounded-[3rem] border border-rose-100 px-8 max-w-lg mx-auto shadow-xl">
            <div className="text-5xl mb-6">🏜️</div>
            <h3 className="text-2xl font-black text-rose-900 mb-2">{error.title}</h3>
            <p className="text-rose-700 font-medium mb-8 leading-relaxed">{error.msg}</p>
            <button onClick={() => window.location.reload()} className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-700 transition-all">Retry Link</button>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[3rem]">
             <div className="text-6xl mb-6 opacity-30">📭</div>
             <p className="text-slate-400 font-black text-lg">No groups registered yet.</p>
             <button onClick={() => navigate('/add')} className="mt-4 text-[#25D366] font-black hover:underline">+ Share First Group</button>
          </div>
        ) : (
          <div className="space-y-24">
            {featured.slice(0, 4).map((cat) => {
              const categoryGroups = groups.filter(g => g.category === cat).slice(0, 3);
              if (categoryGroups.length === 0) return null;
              
              return (
                <div key={cat} className="group/section">
                  <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-5">
                      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 text-3xl">{getEmoji(cat)}</div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.categories[cat]}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Recently Verified Communities</p>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/groups?cat=${encodeURIComponent(cat)}`)} className="px-5 py-2.5 bg-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                      {t.viewGroupsBtn}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryGroups.map(group => (
                      <GroupCard key={group.id} group={group} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
