
import React from 'react';
import { WhatsAppGroup } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabase';
import { Link } from 'react-router-dom';

interface GroupCardProps {
  group: WhatsAppGroup;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { t, language } = useLanguage();

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Direct update for faster response
      await supabase
        .from('whatsapp_groups')
        .update({ clicks: (group.clicks || 0) + 1 })
        .eq('id', group.id);
    } catch (e) {}
    window.open(group.link, '_blank', 'noopener,noreferrer');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const siteUrl = window.location.origin;
    const groupPageUrl = `${siteUrl}/#/group/${group.id}`;
    const directJoinUrl = group.link;
    
    const shareMessage = `🔥 *${group.name}*\n` +
      `📂 Category: ${t.categories[group.category] || group.category}\n\n` +
      `✨ بہترین واٹس ایپ گروپس کے لیے ہماری ویب سائٹ وزٹ کریں:\n` +
      `🌐 Website: ${siteUrl}\n\n` +
      `🚀 گروپ جوائن کرنے کے لیے اس لنک پر کلک کریں:\n` +
      `🔗 Join Link: ${directJoinUrl}\n\n` +
      `📝 تفصیلات دیکھیں: ${groupPageUrl}\n\n` +
      `Join this amazing community via *WhatsApp Hub 2026*!`;

    if (navigator.share) {
      navigator.share({
        title: group.name,
        text: shareMessage,
      }).catch(() => {
        navigator.clipboard.writeText(shareMessage);
        alert(language === 'ur' ? 'لنک کاپی کر لیا گیا ہے!' : 'Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareMessage);
      alert(language === 'ur' ? 'شیئر لنک کاپی کر لیا گیا ہے!' : 'Link copied to clipboard!');
    }
  };

  const getCardStyle = () => {
    if (group.custom_color) {
      return { 
        backgroundColor: group.custom_color,
        boxShadow: `0 20px 25px -5px ${group.custom_color}33, 0 8px 10px -6px ${group.custom_color}33`
      };
    }
    return { background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)' };
  };

  return (
    <div 
      style={getCardStyle()}
      className={`relative p-3 md:p-4 transition-all duration-500 ease-out flex flex-col h-full text-white rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 group overflow-hidden ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
    >
      {/* Share Button */}
      <button 
        onClick={handleShare}
        className="absolute top-3 left-3 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all z-10 active:scale-90 border border-white/10"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {/* Main Visible Image Section */}
      <div className="mb-4 w-full h-32 md:h-36 rounded-2xl overflow-hidden bg-black/10 border border-white/5 flex items-center justify-center relative shadow-inner">
        {group.image_url ? (
           <img 
            src={group.image_url} 
            alt={group.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
            loading="lazy"
           />
        ) : (
          <div className="flex flex-col items-center opacity-20">
            <span className="text-4xl mb-1">💬</span>
            <span className="text-[8px] font-black uppercase tracking-widest">No Image</span>
          </div>
        )}
        {/* Badge on Image */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[8px] font-black border border-white/10">
          👁️ {group.clicks || 0}
        </div>
      </div>
      
      {/* Content */}
      <div className="mb-1">
        <span className="inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-white/10 border border-white/10 mb-2">
          {t.categories[group.category] || group.category}
        </span>
        <h3 className="text-sm md:text-base font-black mb-1 line-clamp-1 urdu-font leading-tight">
          {group.name}
        </h3>
        <p className="text-[9px] md:text-[10px] opacity-70 mb-4 line-clamp-2 urdu-font leading-relaxed min-h-[2.5em]">
          {group.description || 'اس واٹس ایپ گروپ سے جڑیں اور بہترین معلومات حاصل کریں۔'}
        </p>
      </div>

      <div className="mt-auto pt-2 space-y-2">
        <button
          onClick={handleJoin}
          className="w-full bg-white text-slate-900 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl hover:bg-slate-50"
        >
          <span>{t.joinNow}</span>
          <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <Link 
          to={`/group/${group.id}`}
          className="block text-center text-[8px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
        >
          {t.dir === 'rtl' ? 'مزید تفصیلات' : 'View Details'}
        </Link>
      </div>
    </div>
  );
};

export default GroupCard;
