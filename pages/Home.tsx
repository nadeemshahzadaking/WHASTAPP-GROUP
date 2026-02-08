
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SafetyModal from '../components/SafetyModal';
import GroupCard from '../components/GroupCard';
import { WhatsAppGroup } from '../types';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  
  const navigate = useNavigate();
  const { t, requestAction } = useLanguage();

  useEffect(() => {
    // Adding timestamp to frontend fetch as well to bypass browser cache
    fetch(`/api/get-groups?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            // Sort by latest added
            const sorted = [...data].reverse();
            setGroups(sorted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Home fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/groups?q=${encodeURIComponent(search)}`);
  };

  const featured = ['Education', 'Jobs', 'Business', 'Islamic', 'Entertainment', 'Videos', 'Hot', 'Pro'] as const;

  const getEmoji = (cat: string) => {
    switch (cat) {
      case 'Education': return '📚';
      case 'Jobs': return '💼';
      case 'Business': return '📈';
      case 'Islamic': return '🕌';
      case 'Entertainment': return '🎬';
      case 'Videos': return '🎥';
      case 'Hot': return '🔥';
      case 'Pro': return '👑';
      default: return '📁';
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />
      
      <section className="bg-white py-12 md:py-24 px-4 border-b border-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50 -mr-48 -mt-48"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
            {t.title.split(' ')[0]} <span className="whatsapp-green-text">{t.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-xl text-slate-500 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row gap-2 bg-white rounded-3xl p-2 border-2 border-slate-100 shadow-2xl overflow-hidden">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 px-6 py-4 rounded-2xl outline-none text-lg"
              />
              <button type="submit" className="bg-[#25D366] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#128C7E] transition-all active:scale-95">
                {t.searchBtn}
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => navigate('/groups')} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              🔍 {t.viewGroupsBtn}
            </button>
            <button onClick={() => requestAction(() => navigate('/add'))} className="w-full sm:w-auto bg-white text-[#25D366] border-2 border-[#25D366] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all">
              ➕ {t.addBtn}
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {featured.map((cat) => (
              <div key={cat} onClick={() => navigate(`/groups?cat=${encodeURIComponent(cat)}`)} className="bg-white p-4 rounded-2xl border border-slate-200 text-center cursor-pointer hover:border-[#25D366] transition-all group active:scale-95">
                <div className="text-2xl mb-1">{getEmoji(cat)}</div>
                <div className="font-bold text-slate-700 text-[11px] uppercase tracking-tighter">{t.categories[cat]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-green-200 border-t-[#25D366] rounded-full animate-spin"></div>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-10 opacity-50">No groups found in the sheet.</div>
          ) : (
            featured.slice(0, 4).map((cat) => {
              const categoryGroups = groups.filter(g => g.category === cat).slice(0, 3);
              if (categoryGroups.length === 0) return null;
              
              return (
                <div key={cat} className="scroll-mt-20">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl bg-slate-50 p-3 rounded-2xl">{getEmoji(cat)}</span>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">{t.categories[cat]}</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase">Latest Groups</p>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/groups?cat=${encodeURIComponent(cat)}`)} className="bg-slate-100 text-slate-600 px-5 py-2 rounded-xl font-bold text-sm hover:bg-slate-200">
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryGroups.map(group => (
                      <GroupCard key={group.id} group={group} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
