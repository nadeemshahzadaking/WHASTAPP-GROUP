
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GroupCard from '../components/GroupCard';
import BackButton from '../components/BackButton';
import SafetyModal from '../components/SafetyModal';
import { CATEGORIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { WhatsAppGroup } from '../types';

const GroupsList: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  
  const query = searchParams.get('q') || '';
  const catFilter = searchParams.get('cat') || 'All';

  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/get-groups?t=${Date.now()}`);
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `Error ${res.status}`);
        }

        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setGroups(data);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Fetch Error:", err.message);
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />
      <BackButton />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 text-right">
        <div className="text-start md:text-right w-full">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 urdu-font">{t.groupsListTitle}</h1>
          <p className="text-slate-500 font-bold">{filteredGroups.length} {t.groupsFound}</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full justify-end">
          <select
            value={catFilter}
            onChange={(e) => setSearchParams({ q: searchTerm, cat: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#25D366] outline-none bg-white font-bold text-right"
          >
            <option value="All">{t.allCategories}</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{t.categories[cat]}</option>)}
          </select>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-6 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#25D366] outline-none min-w-[280px] text-right font-bold urdu-font"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <div className="w-12 h-12 border-4 border-green-100 border-t-[#25D366] rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-24 bg-red-50 rounded-[3rem] border border-red-100">
          <div className="text-5xl mb-4">⚠️</div>
          <div className="text-red-600 font-black text-xl mb-2 urdu-font">ڈیٹا لوڈ کرنے میں دشواری ہوئی</div>
          <p className="text-red-400 font-bold text-sm tracking-widest uppercase">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold">دوبارہ کوشش کریں</button>
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredGroups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
          <div className="text-8xl mb-8 opacity-20">🔍</div>
          <h3 className="text-3xl font-black text-slate-800 mb-2 urdu-font">{t.noGroups}</h3>
          <p className="text-slate-500 font-bold">{t.noGroupsSub}</p>
        </div>
      )}
    </div>
  );
};

export default GroupsList;
