
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GroupCard from '../components/GroupCard';
import BackButton from '../components/BackButton';
import { CATEGORIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { WhatsAppGroup } from '../types';
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
        console.error("Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const name = group.name?.toLowerCase() || '';
      const desc = group.description?.toLowerCase() || '';
      const matchesSearch = 
        name.includes(searchTerm.toLowerCase()) || 
        desc.includes(searchTerm.toLowerCase());
      const matchesCategory = catFilter === 'All' || group.category === catFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, catFilter, groups]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-right">
      <BackButton />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 urdu-font">{t.groupsListTitle}</h1>
          <p className="text-slate-500 font-bold">{filteredGroups.length} {t.groupsFound}</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full justify-end">
          <select
            value={catFilter}
            onChange={(e) => setSearchParams({ q: searchTerm, cat: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white font-bold text-right"
          >
            <option value="All">{t.allCategories}</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{t.categories[cat]}</option>)}
          </select>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-6 py-2.5 rounded-xl border border-slate-200 outline-none min-w-[280px] text-right font-bold urdu-font"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[2rem] animate-pulse"></div>)}
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredGroups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
          <h3 className="text-3xl font-black text-slate-800 mb-2 urdu-font">{t.noGroups}</h3>
        </div>
      )}
    </div>
  );
};

export default GroupsList;
