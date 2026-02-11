
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
    <div className={`relative p-4 md:p-6 transition-all duration-500 flex flex-col h-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl hover:scale-[1.02] group ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <span className="px-2.5 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
          {t.categories[group.category] || group.category}
        </span>
        <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full">
          <span className="text-[9px] md:text-[11px] font-black">👁️ {group.clicks || 0}</span>
        </div>
      </div>

      <h3 className="text-base md:text-xl font-black mb-1 md:mb-2 line-clamp-1 urdu-font leading-tight">
        {group.name}
      </h3>

      <p className="text-[10px] md:text-xs opacity-80 mb-4 md:mb-6 flex-grow line-clamp-2 urdu-font leading-relaxed">
        {group.description || 'Join this community to connect.'}
      </p>

      <div className="flex flex-col gap-2 mt-auto">
        <Link 
          to={`/group/${group.id}`}
          className="text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest py-1 opacity-60 hover:opacity-100 transition-opacity"
        >
          {t.dir === 'rtl' ? 'تفصیل' : 'Details'}
        </Link>
        
        <button
          onClick={handleJoin}
          className="w-full bg-white text-indigo-700 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.1em] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:bg-opacity-90"
        >
          <span>{t.joinNow}</span>
          <span className="text-sm md:text-base group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
