
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
    window.scrollTo(0, 0);
    const loadGroups = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('whatsapp_groups')
          .select('*')
          .order('addedat', { ascending: false })
          .limit(12);

        if (error) throw error;
        if (data) {
          setGroups(data.map((item: any) => ({
            id: item.id?.toString(),
            name: item.name || 'Untitled',
            link: item.link || '',
            category: item.category || 'Other',
            description: item.description || '',
            addedAt: item.addedat || new Date().toISOString(),
            clicks: parseInt(item.clicks) || 0
          })));
        }
      } catch (err) {
        console.error('Fetch error');
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

  const seoPhrases = ["WhatsApp Groups", "Join Now", "Pakistan Groups", "Active Links", "2026 Directory"];
  const massiveSEO = Array(20).fill(seoPhrases).flat().sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Search Header Section - Compact */}
      <section className="relative pt-12 pb-16 px-4 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight urdu-font">
            {t.title}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-10">
            <div className="group flex bg-white rounded-2xl p-2 border-2 border-slate-200 focus-within:border-black transition-all shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`flex-1 px-5 py-3 outline-none text-base font-bold text-slate-800 bg-transparent urdu-font ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
              />
              <button type="submit" className="bg-black text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-[#25D366] transition-colors uppercase urdu-font">
                {t.searchBtn}
              </button>
            </div>
          </form>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => navigate('/add')} className="px-8 py-4 bg-[#25D366] text-white rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg urdu-font uppercase">
                + {t.addBtn}
              </button>
              <button onClick={() => navigate('/trending')} className="px-8 py-4 bg-black text-white rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg urdu-font uppercase">
                🔥 {t.trendingLink}
              </button>
            </div>
            
            <button 
              onClick={() => navigate('/groups')} 
              className="px-12 py-4 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-black transition-all shadow-lg uppercase tracking-widest urdu-font"
            >
              {t.viewGroupsBtn}
            </button>
          </div>
        </div>
      </section>

      {/* LATEST GROUPS - More Compact Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 urdu-font uppercase tracking-tight">
            {t.dir === 'rtl' ? 'تازہ ترین کمیونٹیز' : 'LATEST COMMUNITIES'}
          </h2>
          <div className="h-1 w-16 bg-[#25D366] rounded-full"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-56 bg-slate-50 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-lg font-black text-slate-400 urdu-font">
               {t.dir === 'rtl' ? 'ابھی کوئی گروپ موجود نہیں ہے۔' : 'No groups found yet.'}
            </p>
          </div>
        )}
      </section>

      {/* SEO SECTION - Smaller Footer */}
      <section className="bg-slate-900 py-20 px-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 opacity-[0.05] select-none text-[8px] font-bold uppercase tracking-widest">
            {massiveSEO.map((word, i) => (
              <span key={i} className="text-white whitespace-nowrap">{word}</span>
            ))}
          </div>
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-slate-600 font-black text-[9px] tracking-[0.4em] uppercase">© 2026 WhatsApp Hub Professional Directory</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
