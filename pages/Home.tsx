
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
        const { data, error } = await supabase
          .from('whatsapp_groups')
          .select('*')
          .order('addedat', { ascending: false })
          .limit(10);

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

  const seoPhrases = [
    "WhatsApp Group Links", "Join WhatsApp Groups", "Active Group Links 2026", "Best WhatsApp Communities",
    "Pakistan WhatsApp Group Links", "USA WhatsApp Groups", "Online Earning WhatsApp Groups", "Jobs Alerts WhatsApp",
    "Funny Groups WhatsApp", "Islamic WhatsApp Group Links", "Dawah WhatsApp", "Study Abroad WhatsApp",
    "IELTS Preparation WhatsApp", "Freelancing Groups", "Programming WhatsApp", "Crypto Trading WhatsApp",
    "News WhatsApp Channels", "Gaming Communities WhatsApp", "PUBG Mobile Groups", "Free Fire WhatsApp",
    "Real Estate Groups", "Business Deals WhatsApp", "Shopping Groups", "Girls WhatsApp Numbers",
    "Official WhatsApp Groups", "Official Directory WhatsApp", "Group Link Generator", "Community Links"
  ];
  const massiveSEO = Array(40).fill(seoPhrases).flat().sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Search Header Section */}
      <section className="relative pt-24 pb-24 px-6 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
          {Array(200).fill('GROUP').map((s, i) => <span key={i} className="inline-block p-6 text-6xl font-black">{s}</span>)}
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-12 tracking-tighter leading-none urdu-font">
            {t.title}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mb-16 px-4">
            <div className="group flex bg-white rounded-[2.5rem] p-3 border-4 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`flex-1 px-8 py-6 outline-none text-xl font-black text-slate-800 bg-transparent urdu-font ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
              />
              <button type="submit" className="bg-black text-white px-10 py-6 rounded-3xl font-black text-lg hover:bg-[#25D366] transition-colors uppercase urdu-font">
                {t.searchBtn}
              </button>
            </div>
          </form>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-6">
              <button onClick={() => navigate('/add')} className="px-12 py-6 bg-[#25D366] text-white rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl urdu-font">
                + {t.addBtn}
              </button>
              <button onClick={() => navigate('/trending')} className="px-12 py-6 bg-black text-white rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl urdu-font">
                🔥 {t.trendingLink}
              </button>
            </div>
            
            {/* View Groups Button moved here below Trending as requested */}
            <button 
              onClick={() => navigate('/groups')} 
              className="px-20 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-black transition-all shadow-2xl uppercase tracking-widest urdu-font"
            >
              {t.viewGroupsBtn}
            </button>
          </div>
        </div>
      </section>

      {/* LATEST GROUPS (Below the View All button) */}
      <section className="max-w-7xl mx-auto w-full px-6 py-24">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-3xl font-black text-slate-900 urdu-font uppercase tracking-tighter">
            {t.dir === 'rtl' ? 'تازہ ترین کمیونٹیز' : 'LATEST COMMUNITIES'}
          </h2>
          <div className="h-1.5 w-24 bg-indigo-600 rounded-full"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-96 bg-slate-50 rounded-[3rem] animate-pulse"></div>)}
          </div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
            <div className="text-7xl mb-6">🏜️</div>
            <p className="text-2xl font-black text-slate-400 urdu-font">
               {t.dir === 'rtl' ? 'ابھی کوئی گروپ موجود نہیں ہے۔' : 'No groups found yet.'}
            </p>
          </div>
        )}
      </section>

      {/* SEO SECTION */}
      <section className="bg-slate-900 py-32 px-6 overflow-hidden mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-white font-black text-4xl mb-20 urdu-font opacity-20">SEARCH OPTIMIZATION</h4>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 opacity-[0.05] select-none text-[10px] font-bold uppercase tracking-widest">
            {massiveSEO.map((word, i) => (
              <span key={i} className="text-white whitespace-nowrap">{word}</span>
            ))}
          </div>
          
          <div className="mt-32 pt-16 border-t border-white/5">
            <p className="text-slate-600 font-black text-sm tracking-[0.5em] uppercase">© 2026 WhatsApp Hub Professional Directory</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
