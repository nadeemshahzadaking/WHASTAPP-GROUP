
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`mb-10 flex items-center gap-3 text-[#25D366] font-black hover:underline group ${t.dir === 'rtl' ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-slate-50 transition-all ${t.dir === 'rtl' ? 'rotate-180' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-xl urdu-font">{t.backBtn}</span>
    </button>
  );
};

export default BackButton;
