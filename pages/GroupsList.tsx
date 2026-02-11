
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GroupCard from '../components/GroupCard';
import BackButton from '../components/BackButton';
import LoadingCharacter from '../components/LoadingCharacter';
import { CATEGORIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { WhatsAppGroup, Category } from '../types';
import { supabase } from '../utils/supabase';

const GroupsList: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  const query = searchParams.get('q') || '';
  const catFilter = searchParams.get('cat') || 'All';
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('whatsapp_groups')
          .select('*')
          .order('addedat', { ascending: false });

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
      } catch (err: any) {
        console.error("Fetch Error");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const name = (group.name || '').toLowerCase();
      const desc = (group.description || '').toLowerCase();
      const cat = (group.category || '').toLowerCase();
      const s = searchTerm.toLowerCase();
      
      const matchesSearch = name.includes(s) || desc.includes(s) || cat.includes(s);
      const matchesCategory = catFilter === 'All' || group.category === catFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, catFilter, groups]);

  const handleCatChange = (val: string) => {
    setSearchParams({ q: searchTerm, cat: val });
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 page-fade ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
      <BackButton />
      
      <div className="mb-12">
        {/* Selected Category Heading */}
        <div className="mb-6 text-center bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-black urdu-font uppercase">
            {catFilter === 'All' ? t.allCategories : t.categories[catFilter as Category]}
          </h1>
          <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">{filteredGroups.length} {t.groupsFound}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
             <select
              value={catFilter}
              onChange={(e) => handleCatChange(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 border-slate-100 outline-none bg-white font-black text-xs min-w-[180px] urdu-font ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
            >
              <option value="All">{t.allCategories}</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{t.categories[cat]}</option>)}
            </select>
          </div>

          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-5 py-3 rounded-xl border-2 border-slate-100 outline-none font-black text-xs urdu-font shadow-sm focus:border-black transition-all ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingCharacter />
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredGroups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-black text-slate-800 mb-1 urdu-font">{t.noGroups}</h3>
          <p className="text-slate-400 font-bold text-[10px] uppercase">{t.noGroupsSub}</p>
        </div>
      )}
    </div>
  );
};

export default GroupsList;
