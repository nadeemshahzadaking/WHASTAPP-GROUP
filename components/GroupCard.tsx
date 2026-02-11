
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
      await supabase.rpc('increment_clicks', { row_id: group.id });
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

  // Three-color auto system logic using the group ID to determine the color
  const getAutoGradient = () => {
    if (group.custom_color) return { backgroundColor: group.custom_color };
    
    const gradients = [
      'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', // WhatsApp Green
      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Professional Blue
      'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'  // Elegant Indigo
    ];
    
    // Use the last digit of the ID to cycle through colors
    const index = parseInt(group.id.slice(-1)) % gradients.length || 0;
    return { background: gradients[index] };
  };

  return (
    <div 
      style={getAutoGradient()}
      className={`relative p-3 md:p-4 transition-all duration-500 ease-out flex flex-col h-full text-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 group overflow-hidden ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
    >
      {/* Moving Animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-card {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .group:hover {
          animation: float-card 3s ease-in-out infinite;
        }
      `}} />

      {/* Share Button */}
      <button 
        onClick={handleShare}
        className="absolute top-12 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all z-10 active:scale-90 shadow-lg border border-white/10"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {/* Small Image Thumbnail */}
      <div className="mb-3 w-full h-24 rounded-xl overflow-hidden bg-black/10 border border-white/5 shadow-inner flex items-center justify-center">
        {group.image_url ? (
           <img 
            src={group.image_url} 
            alt={group.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            onError={(e) => (e.currentTarget.style.display = 'none')}
           />
        ) : (
          <span className="text-3xl opacity-20">💬</span>
        )}
      </div>
      
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
        {group.description || 'اس کمیونٹی سے جڑیں اور فائدہ اٹھائیں۔'}
      </p>

      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={handleJoin}
          className="w-full bg-white text-slate-900 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow hover:bg-slate-50"
        >
          <span>{t.joinNow}</span>
          <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <Link 
          to={`/group/${group.id}`}
          className="text-center text-[8px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity py-1"
        >
          {t.dir === 'rtl' ? 'تفصیل دیکھیں' : 'Full Details'}
        </Link>
      </div>
    </div>
  );
};

export default GroupCard;
