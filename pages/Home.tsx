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
    const loadGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/get-groups?cache_bust=${Date.now()}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setGroups(data);
        } else {
          console.error('Data is not an array:', data);
          setGroups([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
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
    <div className="flex flex-col min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative pt-24 pb-16 px-4 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest mb-8">
            پاکستان کی سب سے بڑی ڈائریکٹری
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.2] urdu-font">
            {t.title} <br/>
            <span className="text-[#25D366]">صحیح معلومات، صحیح گروپ</span>
          </h1>
          
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 urdu-font opacity-80">
            {t.subtitle}
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mb-12 px-4">
            <div className="flex bg-white rounded-[2rem] p-2 border-2 border-slate-100 shadow-2xl focus-within:border-[#25D366] transition-all">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 px-6 py-4 rounded-2xl outline-none text-xl font-bold text-right text-slate-800 urdu-font"
              />
              <button type="submit" className="btn-gradient text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-green-200 hover:scale-105 transition-all active:scale-95">
                {t.searchBtn}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/groups')} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              {t.viewGroupsBtn}
            </button>
            <button onClick={() => navigate('/add')} className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black hover:border-[#25D366] transition-all shadow-sm">
              + {t.addBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => navigate(`/groups?cat=${encodeURIComponent(cat)}`)}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-green-50 transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{getEmoji(cat)}</span>
                <span className="font-bold text-slate-700 urdu-font">{t.categories[cat]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-slate-900 urdu-font">تازہ ترین گروپس</h2>
          <div className="h-px flex-1 bg-slate-100 mx-8 hidden md:block"></div>
          <button onClick={() => navigate('/groups')} className="text-[#25D366] font-black hover:underline urdu-font">سب دیکھیں ←</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-2xl font-black text-slate-400 urdu-font">فی الحال کوئی گروپ دستیاب نہیں ہے</h3>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">پہلا گروپ آپ شامل کریں!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {groups.slice(0, 12).map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;