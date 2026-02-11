
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import GroupCard from '../components/GroupCard';
import { WhatsAppGroup } from '../types';
import { supabase } from '../utils/supabase';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        // براہ راست سپربیس سے ڈیٹا لینا
        const { data, error } = await supabase
          .from('whatsapp_groups')
          .select('*')
          .order('addedat', { ascending: false })
          .limit(15);

        if (error) throw error;

        if (data) {
          const formatted = data.map((item: any) => ({
            id: item.id?.toString(),
            name: item.name || 'Untitled',
            link: item.link || '',
            category: item.category || 'Other',
            description: item.description || '',
            addedAt: item.addedat || new Date().toISOString(),
            clicks: parseInt(item.clicks) || 0
          }));
          setGroups(formatted);
        }
      } catch (err) {
        console.error('Supabase fetch failed:', err);
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
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Modern Hero Section */}
      <section className="relative pt-20 pb-24 px-4 bg-white border-b border-slate-100 overflow-hidden text-right">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60"></div>
        
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
            <div className="group flex bg-white rounded-[2.5rem] p-2 border-2 border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] focus-within:border-[#25D366] transition-all duration-300">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 px-8 py-5 rounded-3xl outline-none text-xl font-bold text-right text-slate-800 urdu-font bg-transparent"
              />
              <button type="submit" className="btn-gradient text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-lg hover:scale-[1.02] transition-all">
                {t.searchBtn}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-5">
            <button onClick={() => navigate('/groups')} className="px-12 py-6 bg-slate-900 text-white rounded-[1.8rem] font-black hover:bg-slate-800 transition-all flex items-center gap-3">
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
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bg-white border border-slate-100 rounded-[3rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {groups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
