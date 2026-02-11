
import React from 'react';
import { WhatsAppGroup } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabase';

interface GroupCardProps {
  group: WhatsAppGroup;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { t } = useLanguage();

  const handleJoin = async () => {
    try {
      // براہ راست سپربیس میں کلک کاؤنٹ بڑھانا
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
    } catch (e) {
      console.error("Click tracking failed:", e);
    }
    window.open(group.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 flex flex-col h-full border border-slate-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 relative group overflow-hidden text-right">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="bg-green-50 text-[#25D366] px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-100/50">
          {t.categories[group.category] || group.category}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Views</span>
          <span className="text-lg font-black text-slate-900">{group.clicks || 0}</span>
        </div>
      </div>

      <h3 className="text-2xl font-black text-slate-900 mb-5 line-clamp-1 urdu-font leading-snug group-hover:text-[#25D366] transition-colors">
        {group.name}
      </h3>

      <div className="flex-grow mb-10 relative z-10">
        <p className="text-slate-500 text-base urdu-font line-clamp-3 leading-relaxed opacity-80 font-medium">
          {group.description || 'اس گروپ کی کوئی تفصیل دستیاب نہیں ہے۔'}
        </p>
      </div>

      <button
        onClick={handleJoin}
        className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-sm transition-all flex items-center justify-center gap-4 shadow-xl hover:bg-[#25D366] active:scale-95"
      >
        <span>{t.joinNow}</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.115c1.53.813 3.333 1.243 5.171 1.243 5.582 0 10.124-4.542 10.124-10.125 0-2.705-1.053-5.247-2.966-7.161-1.912-1.912-4.454-2.965-7.16-2.965-5.581 0-10.122 4.542-10.122 10.125-.001 1.884.508 3.723 1.47 5.352l-1.121 4.09 4.197-1.102l-.413-.257zm11.362-3.577c-.312-.156-1.848-.912-2.134-1.017-.286-.104-.494-.156-.703.156-.208.312-.807 1.017-.989 1.223-.182.208-.364.234-.676.078-.312-.156-1.316-.484-2.507-1.545-.927-.827-1.552-1.848-1.734-2.16-.182-.312-.02-.481.136-.636.141-.139.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.703-1.693-.963-2.316-.252-.605-.51-.522-.703-.532-.182-.008-.39-.011-.598-.011s-.546.078-.832.39c-.286.312-1.092 1.067-1.092 2.601s1.118 3.018 1.274 3.227c.156.208 2.2 3.36 5.33 4.715.745.322 1.327.514 1.78.658.748.237 1.429.204 1.967.123.6-.09 1.848-.755 2.108-1.483.26-.728.26-1.353.182-1.483-.078-.13-.286-.208-.598-.364z"/>
        </svg>
      </button>
    </div>
  );
};

export default GroupCard;
