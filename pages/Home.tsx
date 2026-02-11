
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import GroupCard from '../components/GroupCard';
import LoadingCharacter from '../components/LoadingCharacter';
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
        setTimeout(() => setLoading(false), 500); // Small delay for smooth effect
      }
    };
    loadGroups();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/groups?q=${encodeURIComponent(search)}`);
  };

  const seoPhrases = ["WhatsApp Groups", "Join Now", "Pakistan Groups", "Active Links", "2026 Directory"];
  const massiveSEO = Array(15).fill(seoPhrases).flat().sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col min-h-screen bg-white page-fade">
      {/* Search Header Section - Compact & Pro */}
      <section className="relative pt-12 pb-16 px-4 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight urdu-font uppercase">
            {t.title}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-10">
            <div className="group flex bg-white rounded-2xl p-1.5 border-2 border-slate-200 focus-within:border-black transition-all shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`flex-1 px-5 py-3 outline-none text-base font-bold text-slate-800 bg-transparent urdu-font ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
              />
              <button type="submit" className="bg-black text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-[#25D366] transition-colors uppercase urdu-font">
                {t.searchBtn}
              </button>
            </div>
          </form>

          {/* MAIN ACTION BUTTONS GROUPED TOGETHER */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => navigate('/add')} 
                className="px-6 py-4 bg-[#25D366] text-white rounded-xl font-black text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-lg urdu-font uppercase flex items-center gap-2"
              >
                <span>+</span> {t.addBtn}
              </button>
              
              <button 
                onClick={() => navigate('/trending')} 
                className="px-6 py-4 bg-rose-600 text-white rounded-xl font-black text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-lg urdu-font uppercase flex items-center gap-2"
              >
                <span>🔥</span> {t.trendingLink}
              </button>

              <button 
                onClick={() => navigate('/groups')} 
                className="px-6 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-lg urdu-font uppercase flex items-center gap-2"
              >
                <span>📂</span> {t.viewGroupsBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST GROUPS - Compact Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-lg md:text-xl font-black text-slate-900 urdu-font uppercase tracking-tight">
            {t.dir === 'rtl' ? 'تازہ ترین کمیونٹیز' : 'LATEST COMMUNITIES'}
          </h2>
          <div className="h-1 w-12 bg-[#25D366] rounded-full"></div>
        </div>

        {loading ? (
          <LoadingCharacter />
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-base font-black text-slate-400 urdu-font">
               {t.dir === 'rtl' ? 'ابھی کوئی گروپ موجود نہیں ہے۔' : 'No groups found yet.'}
            </p>
          </div>
        )}
      </section>

      {/* FOOTER SEO */}
      <section className="bg-white py-10 px-4 mt-auto border-t border-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 opacity-[0.1] select-none text-[7px] font-bold uppercase tracking-widest">
            {massiveSEO.map((word, i) => (
              <span key={i} className="whitespace-nowrap">{word}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
