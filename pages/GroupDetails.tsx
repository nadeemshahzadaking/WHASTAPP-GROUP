
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { WhatsAppGroup } from '../types';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';

const GroupDetails: React.FC = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [group, setGroup] = useState<WhatsAppGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('whatsapp_groups')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          navigate('/');
          return;
        }

        setGroup({
          id: data.id.toString(),
          name: data.name,
          link: data.link,
          category: data.category,
          description: data.description,
          addedAt: data.addedat,
          clicks: data.clicks,
          custom_color: data.custom_color,
          image_url: data.image_url
        });
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id, navigate]);

  const handleJoin = async () => {
    if (!group) return;
    try {
      await supabase.from('whatsapp_groups').update({ clicks: (group.clicks || 0) + 1 }).eq('id', group.id);
    } catch (e) {}
    window.open(group.link, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (!group) return;
    const siteUrl = window.location.origin;
    const groupPageUrl = window.location.href;
    const msg = `🔥 *${group.name}*\n📁 Category: ${t.categories[group.category] || group.category}\n\nJoin Now: ${group.link}\nWebsite: ${siteUrl}\n\nJoin this active community!`;
    
    if (navigator.share) {
      navigator.share({ title: group.name, text: msg, url: groupPageUrl });
    } else {
      navigator.clipboard.writeText(msg);
      alert(language === 'ur' ? 'لنک کاپی ہو گیا!' : 'Link copied!');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!group) return null;

  const headerStyle = group.custom_color 
    ? { backgroundColor: group.custom_color }
    : { background: 'linear-gradient(to bottom right, #128C7E, #075E54)' };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 page-fade">
      <BackButton />
      
      <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100">
        <div style={headerStyle} className="p-16 text-center text-white relative">
          <button 
            onClick={handleShare}
            className="absolute top-10 right-10 bg-white/20 p-4 rounded-full hover:bg-white/40 transition-all shadow-lg"
          >
            📤
          </button>

          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-2xl border-4 border-white/30 overflow-hidden">
            {group.image_url ? (
              <img src={group.image_url} alt={group.name} className="w-full h-full object-cover" />
            ) : '💬'}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase leading-tight urdu-font">{group.name}</h1>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="bg-white/20 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">{t.categories[group.category]}</span>
            <span className="bg-white/20 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">👁️ {group.clicks} {t.clicksLabel}</span>
          </div>
        </div>

        {/* LARGE DISPLAY IMAGE */}
        {group.image_url && (
          <div className="px-8 md:px-16 pt-12">
            <div className="w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50 bg-slate-50">
               <img 
                src={group.image_url} 
                alt={group.name} 
                className="w-full h-auto max-h-[600px] object-contain mx-auto" 
               />
            </div>
            <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Verified Community Media</p>
          </div>
        )}

        <div className={`p-12 space-y-12 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <div className="space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{t.descriptionLabel}</h2>
            <p className="text-2xl font-bold text-slate-800 leading-relaxed urdu-font whitespace-pre-wrap">
              {group.description || 'اس واٹس ایپ گروپ کی کوئی تفصیلی معلومات فراہم نہیں کی گئیں۔'}
            </p>
          </div>

          <div className="pt-12 border-t border-slate-50 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-2">Verified Link</span>
                  <span className="font-black text-slate-900 truncate block">{group.link}</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-2">Safe Community</span>
                  <span className="font-black text-slate-900">End-to-End Encrypted</span>
                </div>
             </div>

             <button
              onClick={handleJoin}
              className="w-full bg-[#25D366] text-white py-8 rounded-[3rem] font-black text-3xl shadow-2xl hover:bg-black transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-6"
            >
              <span>{t.joinNow}</span>
              <span className="text-4xl">➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
