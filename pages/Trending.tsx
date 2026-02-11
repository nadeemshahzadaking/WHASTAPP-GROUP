
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { WhatsAppGroup } from '../types';
import GroupCard from '../components/GroupCard';
import BackButton from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';

const Trending: React.FC = () => {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('whatsapp_groups')
          .select('*')
          .eq('approved', true)
          .order('clicks', { ascending: false })
          .limit(20);

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col items-center mb-24 gap-6">
        <div className="w-full flex justify-start">
          <BackButton />
        </div>
        <div className="w-24 h-24 bg-rose-500 rounded-3xl flex items-center justify-center text-white text-5xl animate-bounce shadow-2xl shadow-rose-200">🔥</div>
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase text-center">{t.trendingLink}</h1>
        <p className="text-slate-400 font-black text-xs tracking-[0.5em] uppercase">Most Popular Groups Ranked by Views</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-slate-50 rounded-[3rem] animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {groups.map((group, index) => (
            <div key={group.id} className="relative group/parent">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-black text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl z-30 shadow-2xl border-4 border-white group-hover/parent:scale-110 group-hover/parent:bg-rose-500 transition-all">
                #{index + 1}
              </div>
              <GroupCard group={group} styleId={(index % 10) + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;
