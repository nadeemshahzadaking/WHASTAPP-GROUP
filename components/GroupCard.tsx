
import React, { useState } from 'react';
import { WhatsAppGroup } from '../types';
import { useLanguage } from '../context/LanguageContext';
import AdInterstitial from './AdInterstitial';

interface GroupCardProps {
  group: WhatsAppGroup;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { t, requestAction } = useLanguage();
  const [showAd, setShowAd] = useState(false);
  
  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      'Education': 'bg-blue-50 text-blue-600 border-blue-100',
      'Jobs': 'bg-orange-50 text-orange-600 border-orange-100',
      'Business': 'bg-indigo-50 text-indigo-600 border-indigo-100',
      'Islamic': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Hot': 'bg-rose-50 text-rose-600 border-rose-100',
      'Girls': 'bg-pink-50 text-pink-600 border-pink-100',
      'Max': 'bg-purple-50 text-purple-600 border-purple-100',
    };
    return map[cat] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    requestAction(() => {
        setShowAd(true);
    });
  };

  const completeJoin = async () => {
    setShowAd(false);
    fetch('/api/update-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: group.link })
    }).catch(err => console.error("Click update failed", err));
    window.open(group.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 group">
      <AdInterstitial 
        isOpen={showAd} 
        onClose={() => setShowAd(false)} 
        onComplete={completeJoin} 
      />
      
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
           <h3 className="text-lg font-extrabold text-slate-900 leading-tight truncate group-hover:text-[#25D366] transition-colors">{group.name}</h3>
           <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
             <span className="bg-slate-100 px-1.5 py-0.5 rounded">🖱️ {group.clicks || 0}</span>
             <span>•</span>
             <span>{new Date(group.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
           </div>
        </div>
        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getCategoryColor(group.category)}`}>
          {t.categories[group.category]}
        </span>
      </div>
      
      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-grow mb-6">
        {group.description || 'No description provided. Click join to explore this community.'}
      </p>

      <button
        onClick={handleJoinClick}
        className="w-full bg-[#25D366] hover:bg-slate-900 text-white py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-green-100 hover:shadow-slate-200"
      >
        <span>{t.joinNow}</span>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.115c1.53.813 3.333 1.243 5.171 1.243 5.582 0 10.124-4.542 10.124-10.125 0-2.705-1.053-5.247-2.966-7.161-1.912-1.912-4.454-2.965-7.16-2.965-5.581 0-10.122 4.542-10.122 10.125-.001 1.884.508 3.723 1.47 5.352l-1.121 4.09 4.197-1.102l-.413-.257zm11.362-3.577c-.312-.156-1.848-.912-2.134-1.017-.286-.104-.494-.156-.703.156-.208.312-.807 1.017-.989 1.223-.182.208-.364.234-.676.078-.312-.156-1.316-.484-2.507-1.545-.927-.827-1.552-1.848-1.734-2.16-.182-.312-.02-.481.136-.636.141-.139.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.703-1.693-.963-2.316-.252-.605-.51-.522-.703-.532-.182-.008-.39-.011-.598-.011s-.546.078-.832.39c-.286.312-1.092 1.067-1.092 2.601s1.118 3.018 1.274 3.227c.156.208 2.2 3.36 5.33 4.715.745.322 1.327.514 1.78.658.748.237 1.429.204 1.967.123.6-.09 1.848-.755 2.108-1.483.26-.728.26-1.353.182-1.483-.078-.13-.286-.208-.598-.364z"/>
        </svg>
      </button>
    </div>
  );
};

export default GroupCard;
