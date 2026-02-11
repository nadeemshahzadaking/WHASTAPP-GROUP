
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const isUrdu = language === 'ur';

  return (
    <div className="flex flex-col items-center gap-1.5 mt-2">
      <div 
        onClick={() => setLanguage(isUrdu ? 'en' : 'ur')}
        className="relative w-24 h-9 bg-slate-900 rounded-full cursor-pointer p-1 transition-all duration-300 border border-slate-700 shadow-inner group"
      >
        <div 
          className={`absolute top-1 bottom-1 w-10 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ease-out ${isUrdu ? 'right-1' : 'left-1'}`}
        >
          <span className="text-[10px] font-black text-white">{isUrdu ? 'UR' : 'EN'}</span>
        </div>
        <div className="flex justify-between items-center h-full px-3 text-[9px] font-black uppercase text-slate-500 pointer-events-none">
          <span className={!isUrdu ? 'opacity-0' : 'opacity-100'}>ENGLISH</span>
          <span className={isUrdu ? 'opacity-0' : 'opacity-100'}>اردو</span>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
