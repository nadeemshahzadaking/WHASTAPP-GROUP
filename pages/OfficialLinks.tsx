
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { OFFICIAL_LINKS } from '../config/official-links';
import BackButton from '../components/BackButton';

// SVG Icons for platforms
const Icons = {
  TikTok: () => (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.51 3.79-1.46 1.47-3.82 1.96-5.75 1.13-1.44-.63-2.51-2.03-2.61-3.59-.16-1.9 1.14-3.85 3.01-4.31.52-.12 1.06-.18 1.6-.12v4.04c-.37-.08-.75-.05-1.11.07-.63.22-1.03.9-1.01 1.57.02.73.65 1.34 1.38 1.3 1.05-.05 1.58-.9 1.54-1.81l.03-14.15Z" />
    </svg>
  ),
  WhatsApp: () => (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.604 6.012L0 24l6.117-1.604a11.803 11.803 0 005.925 1.585h.005c6.635 0 12.032-5.396 12.035-12.03a11.815 11.815 0 00-3.525-8.417z" />
    </svg>
  ),
  Facebook: () => (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Telegram: () => (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0C5.347 0 0 5.347 0 11.944c0 6.596 5.347 11.944 11.944 11.944 6.596 0 11.944-5.348 11.944-11.944C23.888 5.347 18.54 0 11.944 0zm5.727 7.788c-.167 1.76-.87 5.922-1.267 8.046-.168.9-.498 1.202-.82 1.23-.698.064-1.226-.462-1.902-.905-1.058-.693-1.656-1.124-2.684-1.803-1.188-.782-.417-1.21.26-1.91.176-.184 3.245-2.977 3.303-3.23.008-.032.014-.15-.056-.212s-.174-.042-.249-.024c-.106.024-1.793 1.14-5.06 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.242-1.865-.442-.75-.244-1.347-.374-1.295-.79.027-.216.324-.437.893-.663 3.507-1.523 5.844-2.528 7.012-3.014 3.333-1.386 4.025-1.627 4.476-1.635.1 0 .32.025.463.142.12.098.154.23.167.324.013.094.02.268.01.442z" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  Game: () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
      <path d="M6 12h4m-2-2v4m7-2h.01m2.99 0h.01"></path>
    </svg>
  )
};

interface LinkCardProps {
  icon: React.ReactNode;
  label: string;
  link: string;
  color: string;
}

const OfficialLinks: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    setIsPressing(true);
    timerRef.current = window.setTimeout(() => {
      navigate('/admin-login');
      setIsPressing(false);
    }, 4000); // 4 seconds secret trigger
  };

  const endPress = () => {
    setIsPressing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const LinkCard: React.FC<LinkCardProps> = ({ icon, label, link, color }) => (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col items-center gap-5 group active:scale-95 ${color}`}
    >
      <div className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="font-black text-slate-800 text-center tracking-tight text-sm uppercase">{label}</span>
    </a>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header Area with Secret Trigger & Security Icon */}
      <div className="flex justify-between items-center mb-10">
        <div className="inline-block relative">
          <div 
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={endPress}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            className="relative z-10 select-none cursor-pointer"
          >
            <BackButton />
            
            {/* Secret Progress Indicator */}
            {isPressing && (
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#25D366] animate-[secret-progress_4s_linear_forwards] origin-left"></div>
              </div>
            )}
          </div>
        </div>

        {/* New Security Icon for Verification Page */}
        <button 
          onClick={() => navigate('/security-check')}
          className="p-3 bg-white border border-slate-100 shadow-sm rounded-2xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
          title="Security Check"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes secret-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />

      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">{t.officialTitle}</h1>
        <div className="h-1.5 w-24 bg-[#25D366] mx-auto mb-6 rounded-full"></div>
        <p className="text-slate-500 font-bold text-xl">{t.officialSub}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        <LinkCard icon={<Icons.TikTok />} label="TikTok" link={OFFICIAL_LINKS.tiktok} color="hover:bg-black hover:text-white" />
        <LinkCard icon={<Icons.WhatsApp />} label="WhatsApp Number" link={OFFICIAL_LINKS.whatsapp.number} color="hover:bg-[#25D366] hover:text-white" />
        <LinkCard icon={<Icons.WhatsApp />} label="WhatsApp Channel" link={OFFICIAL_LINKS.whatsapp.channel} color="hover:bg-[#25D366] hover:text-white" />
        <LinkCard icon={<Icons.WhatsApp />} label="Official Group" link={OFFICIAL_LINKS.whatsapp.group} color="hover:bg-[#25D366] hover:text-white" />
        <LinkCard icon={<Icons.Facebook />} label="FB Profile" link={OFFICIAL_LINKS.facebook.profile} color="hover:bg-[#1877F2] hover:text-white" />
        <LinkCard icon={<Icons.Facebook />} label="FB Page" link={OFFICIAL_LINKS.facebook.page} color="hover:bg-[#1877F2] hover:text-white" />
        <LinkCard icon={<Icons.Facebook />} label="FB Marketplace" link={OFFICIAL_LINKS.facebook.marketplace} color="hover:bg-[#1877F2] hover:text-white" />
        <LinkCard icon={<Icons.Telegram />} label="TG Channel" link={OFFICIAL_LINKS.telegram.channel} color="hover:bg-[#0088cc] hover:text-white" />
        <LinkCard icon={<Icons.Telegram />} label="TG Group" link={OFFICIAL_LINKS.telegram.group} color="hover:bg-[#0088cc] hover:text-white" />
        {OFFICIAL_LINKS.games.map((g, i) => (
          <LinkCard key={i} icon={<Icons.Game />} label={g.name} link={g.link} color="hover:bg-indigo-600 hover:text-white" />
        ))}
        <LinkCard icon={<Icons.Globe />} label="Official Website" link={OFFICIAL_LINKS.website} color="hover:bg-slate-900 hover:text-white" />
      </div>
    </div>
  );
};

export default OfficialLinks;
