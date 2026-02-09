
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';
import LanguageSelector from '../components/LanguageSelector';

const Promotion: React.FC = () => {
  const { t, language } = useLanguage();
  const adminEmail = "mrbadshahoftheking@gmail.com";

  const [formData, setFormData] = useState({
    name: '',
    userEmail: '',
    promoType: '',
    customType: '',
    details: ''
  });

  const [error, setError] = useState('');

  const promoTypes = [
    'WhatsApp Group (Standard)',
    'WhatsApp Group (VIP Top)',
    'WhatsApp Group (Featured)',
    'YouTube Channel Promotion',
    'Android App / PlayStore',
    'E-commerce Store / Website',
    'Real Estate Property',
    'Education / Academy Ads',
    'Digital Marketing Agency',
    'Freelancing Services',
    'Graphic Designing',
    'Video Editing Services',
    'Islamic Channel / Dawah',
    'Gaming Community',
    'News & Media Portal',
    'Health & Fitness Club',
    'Beauty & Fashion Brand',
    'Tour & Travels Agency',
    'Automobile Dealing',
    'Other (Specify Below)'
  ];

  // Validation Checkers
  const validations = useMemo(() => ({
    name: formData.name.trim().length >= 3,
    email: /^[^\s@]+@gmail\.com$/.test(formData.userEmail),
    type: formData.promoType !== '',
    details: formData.details.trim().length >= 10
  }), [formData]);

  // Calculate Progress
  const progress = useMemo(() => {
    const validCount = Object.values(validations).filter(v => v).length;
    return (validCount / 4) * 100;
  }, [validations]);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validations.email) {
      setError('Please enter a valid Gmail address (No spaces).');
      return;
    }

    if (!validations.name || !validations.type || !validations.details) {
      setError('Please fill all required fields correctly.');
      return;
    }

    const type = formData.promoType === 'Other (Specify Below)' ? formData.customType : formData.promoType;
    const subject = encodeURIComponent(`PROMOTION REQUEST: ${type}`);
    const body = encodeURIComponent(
      `--- Promotion Request Form ---\n\n` +
      `User Name: ${formData.name}\n` +
      `User Contact: ${formData.userEmail}\n` +
      `Target Type: ${type}\n` +
      `Description: ${formData.details}\n\n` +
      `Submitted via Promotion Dashboard (${language.toUpperCase()})`
    );

    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

  const handleDirectEmail = () => {
    window.location.href = `mailto:${adminEmail}?subject=Direct Ad Inquiry`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      {/* Local Language Selector for this page only */}
      <div className="absolute top-0 right-4">
        <LanguageSelector />
      </div>

      <BackButton />
      
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 relative">
        {/* Dynamic Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
          <div 
            className="h-full bg-[#25D366] transition-all duration-700 shadow-[0_0_15px_rgba(37,211,102,0.4)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Header Section */}
        <div className="bg-slate-900 p-12 text-center text-white relative">
          <div className="absolute top-6 right-10 opacity-20 text-[10px] font-black tracking-widest uppercase">Admin Verified Panel</div>
          <div className="text-7xl mb-6 inline-block animate-float">📊</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">{t.promoPageTitle}</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
            {t.promoPageSub}
          </p>
        </div>

        <div className={`p-8 md:p-14 space-y-12 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {/* Form Section */}
          <form onSubmit={handleSendEmail} className="space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-sm font-black border border-red-100 text-center animate-shake">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.promoNameLabel} *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${validations.name ? 'border-green-100 bg-green-50/20' : 'border-slate-50 focus:border-slate-900 bg-slate-50/50'}`} 
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.promoGmailLabel} *</label>
                  <input 
                    required
                    type="email" 
                    value={formData.userEmail}
                    onChange={(e) => setFormData({...formData, userEmail: e.target.value.replace(/\s/g, '')})}
                    className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${validations.email ? 'border-green-100 bg-green-50/20' : 'border-slate-50 focus:border-slate-900 bg-slate-50/50'}`} 
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.promoTypeLabel} *</label>
                  <select 
                    required
                    value={formData.promoType}
                    onChange={(e) => setFormData({...formData, promoType: e.target.value})}
                    className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${validations.type ? 'border-green-100 bg-green-50/20' : 'border-slate-50 focus:border-slate-900 bg-slate-50/50'}`}
                  >
                    <option value="">{t.selectCategory}</option>
                    {promoTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                {formData.promoType === 'Other (Specify Below)' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Custom Category Name</label>
                    <input 
                      type="text"
                      value={formData.customType}
                      onChange={(e) => setFormData({...formData, customType: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none focus:border-slate-900 bg-slate-50/50 transition-all font-bold" 
                      placeholder="e.g. TikTok Marketing"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.promoDetailsLabel} *</label>
              <textarea 
                required
                rows={5}
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-bold resize-none ${validations.details ? 'border-green-100 bg-green-50/20' : 'border-slate-50 focus:border-slate-900 bg-slate-50/50'}`}
                placeholder={language === 'ur' ? 'پروموشن کی مکمل تفصیلات یہاں درج کریں...' : 'Enter complete promotion details here...'}
              ></textarea>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full bg-[#25D366] text-white py-6 rounded-[2rem] font-black text-xl hover:bg-[#128C7E] shadow-2xl shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-tighter"
              >
                <span>{t.promoSendBtn}</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          </form>

          {/* Direct Email Option */}
          <div className="flex flex-col items-center justify-center pt-10 border-t border-slate-100 gap-6 text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
               {language === 'ur' ? 'یا براہ راست ای میل بھیجیں' : (language === 'ro' ? 'Ya direct email bhejein' : 'OR REACH US DIRECTLY')}
            </p>
            
            <button 
              onClick={handleDirectEmail}
              className="group flex flex-col md:flex-row items-center gap-6 bg-slate-50 border border-slate-100 px-10 py-5 rounded-[2.5rem] hover:border-slate-900 transition-all shadow-sm active:scale-95"
            >
              <div className="text-4xl">📩</div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.promoEmailLabel}</span>
                <span className="font-bold text-slate-800 text-lg tracking-tight">{adminEmail}</span>
              </div>
              <div className="hidden md:flex w-12 h-12 bg-white rounded-full items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <span className="text-xl">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotion;
