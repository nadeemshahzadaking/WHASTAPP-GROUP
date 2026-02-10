
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
  const { t, requestAction } = useLanguage();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/get-groups?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        setGroups(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/groups?q=${encodeURIComponent(search)}`);
  };

  const featuredCats = ['Education', 'Jobs', 'Business', 'Islamic', 'Videos', 'Hot'] as const;
  const getEmoji = (cat: string) => ({
    Education: '📚', Jobs: '💼', Business: '📈', Islamic: '🕌', Videos: '🎥', Hot: '🔥'
  }[cat] || '📁');

  return (
    <div className="flex flex-col pb-20">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 urdu-text leading-tight">
          {t.title} <span className="text-[#25D366]">پاکستان</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium mb-10 urdu-text">
          {t.subtitle}
        </p>

        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-10 group">
          <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-lg focus-within:ring-2 ring-green-100 transition-all">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 px-5 py-3.5 rounded-xl outline-none text-right font-bold"
            />
            <button type="submit" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#25D366] transition-all">
              {t.searchBtn}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate('/groups')} className="px-8 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            {t.viewGroupsBtn}
          </button>
          <button onClick={() => requestAction(() => navigate('/add'))} className="px-8 py-3.5 bg-[#25D366] text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-md">
            + {t.addBtn}
          </button>
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-7xl mx-auto w-full px-4 overflow-x-auto no-scrollbar py-8 flex gap-4">
        {featuredCats.map((cat) => (
          <button 
            key={cat} 
            onClick={() => navigate(`/groups?cat=${encodeURIComponent(cat)}`)} 
            className="bg-white px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3 hover:border-green-500 shadow-sm transition-all whitespace-nowrap min-w-max"
          >
            <span className="text-2xl">{getEmoji(cat)}</span>
            <span className="font-bold text-slate-700">{t.categories[cat]}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 mt-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#25D366] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.slice(0, 9).map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
