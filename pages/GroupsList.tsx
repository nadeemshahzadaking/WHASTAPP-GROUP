
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
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  
  const query = searchParams.get('q') || '';
  const catFilter = searchParams.get('cat') || 'All';

  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    fetch('/api/get-groups')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setGroups(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesSearch = 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        group.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = catFilter === 'All' || group.category === catFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, catFilter, groups]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />
      <BackButton />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.groupsListTitle}</h1>
          <p className="text-slate-500">{filteredGroups.length} {t.groupsFound}</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <select
            value={catFilter}
            onChange={(e) => setSearchParams({ q: searchTerm, cat: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#25D366] outline-none bg-white font-medium"
          >
            <option value="All">{t.allCategories}</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{t.categories[cat]}</option>)}
          </select>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#25D366] outline-none min-w-[200px]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-green-200 border-t-[#25D366] rounded-full animate-spin"></div>
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{t.noGroups}</h3>
          <p className="text-slate-500">{t.noGroupsSub}</p>
        </div>
      )}
    </div>
  );
};

export default GroupsList;
