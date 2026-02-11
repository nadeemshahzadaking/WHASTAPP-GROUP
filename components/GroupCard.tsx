
import React from 'react';
import { WhatsAppGroup } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabase';
import { Link } from 'react-router-dom';

interface GroupCardProps {
  group: WhatsAppGroup;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { t } = useLanguage();

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data: current } = await supabase
        .from('whatsapp_groups')
        .select('clicks')
        .eq('link', group.link)
        .maybeSingle();
      
      if (current) {
        await supabase
          .from('whatsapp_groups')
          .update({ clicks: (Number(current.clicks) || 0) + 1 })
          .eq('link', group.link);
      }
    } catch (e) {}
    window.open(group.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`relative p-3 md:p-4 transition-all duration-300 flex flex-col h-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl shadow-md hover:scale-[1.03] group ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
      
      <div className="flex justify-between items-center mb-2">
        <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-white/10 text-white/80">
          {t.categories[group.category] || group.category}
        </span>
        <span className="text-[9px] font-black opacity-60">👁️ {group.clicks || 0}</span>
      </div>

      <h3 className="text-sm md:text-base font-black mb-1 line-clamp-1 urdu-font leading-tight">
        {group.name}
      </h3>

      <p className="text-[9px] md:text-[10px] opacity-70 mb-4 flex-grow line-clamp-2 urdu-font leading-normal">
        {group.description || 'Connect with this WhatsApp community.'}
      </p>

      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={handleJoin}
          className="w-full bg-white text-indigo-700 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow hover:bg-slate-50"
        >
          <span>{t.joinNow}</span>
          <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <Link 
          to={`/group/${group.id}`}
          className="text-center text-[8px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity py-1"
        >
          {t.dir === 'rtl' ? 'تفصیل' : 'Details'}
        </Link>
      </div>
    </div>
  );
};

export default GroupCard;
