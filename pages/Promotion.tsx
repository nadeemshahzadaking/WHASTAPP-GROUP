
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';

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
    'YouTube Channel',
    'Mobile Application',
    'E-commerce Store',
    'Educational Service',
    'Real Estate Listing',
    'Freelance Portfolio',
    'Gaming Community',
    'News & Media',
    'Business Consultancy',
    'Other'
  ];

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.userEmail || !formData.promoType || !formData.details) {
      setError('Please fill all required fields correctly.');
      return;
    }

    if (!formData.userEmail.includes('@gmail.com')) {
      setError('Only @gmail.com addresses are accepted.');
      return;
    }

    const type = formData.promoType === 'Other' ? formData.customType : formData.promoType;
    const subject = encodeURIComponent(`PROMOTION REQUEST: ${type}`);
    const body = encodeURIComponent(
      `--- Promotion Request ---\n\n` +
      `Name: ${formData.name}\n` +
      `User Email: ${formData.userEmail}\n` +
      `Type: ${type}\n` +
      `Details: ${formData.details}\n\n` +
      `Requested via WhatsApp Directory (${language.toUpperCase()})`
    );

    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

  const handleDirectEmail = () => {
    window.location.href = `mailto:${adminEmail}?subject=Direct Promotion Inquiry`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton />
      
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black p-12 text-center text-white relative">
          <div className="absolute top-4 right-8 opacity-20 text-[10px] font-black tracking-widest uppercase">Global Network v2.5</div>
          <div className="text-7xl mb-6 inline-block animate-float">🚀</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">{t.promoPageTitle}</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
            {t.promoPageSub}
          </p>
        </div>

        <div className={`p-8 md:p-14 space-y-12 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {/* Policy Section */}
          <section className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">📜</div>
             <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-3">
               <span>🛡️</span> {t.promoPolicyTitle}
             </h2>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800 font-bold text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px]">1</span>
                  {language === 'ur' ? 'صرف قانونی اور معیاری مواد قبول ہے۔' : 'Only legal and quality content is accepted.'}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px]">2</span>
                  {language === 'ur' ? 'غیر اخلاقی مواد کی پروموشن ممنوع ہے۔' : 'Explicit content is strictly prohibited.'}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px]">3</span>
                  {language === 'ur' ? 'یہ ایک پیڈ سروس ہے۔' : 'This is a premium paid service.'}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px]">4</span>
                  {language === 'ur' ? 'ایس ای او سپورٹ شامل ہے۔' : 'Full SEO support is included.'}
                </li>
             </ul>
          </section>

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
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none focus:border-[#25D366] bg-slate-50/50 transition-all font-bold" 
                    placeholder="e.g. Ali Khan"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.promoGmailLabel} *</label>
                  <input 
                    required
                    type="email" 
                    value={formData.userEmail}
                    onChange={(e) => setFormData({...formData, userEmail: e.target.value.replace(/\s/g, '')})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none focus:border-[#25D366] bg-slate-50/50 transition-all font-bold" 
                    placeholder="yourname@gmail.com"
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
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none focus:border-[#25D366] bg-slate-50/50 transition-all font-bold"
                  >
                    <option value="">{t.selectCategory}</option>
                    {promoTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                {formData.promoType === 'Other' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Custom Type Details</label>
                    <input 
                      type="text"
                      value={formData.customType}
                      onChange={(e) => setFormData({...formData, customType: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none focus:border-[#25D366] bg-slate-50/50 transition-all font-bold" 
                      placeholder="Specify your promotion type"
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
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none focus:border-[#25D366] bg-slate-50/50 transition-all font-bold resize-none"
                placeholder={language === 'ur' ? 'پروموشن کی تمام تفصیلات یہاں لکھیں...' : 'Write complete promotion details here...'}
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

          {/* Contact Alternative */}
          <div className="flex flex-col items-center justify-center pt-10 border-t border-slate-100 gap-6">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{t.dir === 'rtl' ? 'براہ راست رابطہ کریں' : 'OR CONTACT DIRECTLY'}</p>
            
            <button 
              onClick={handleDirectEmail}
              className="group flex items-center gap-6 bg-slate-900 text-white pl-8 pr-4 py-3 rounded-full hover:bg-black transition-all shadow-xl active:scale-95"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{t.promoEmailLabel}</span>
                <span className="font-bold text-sm tracking-tight">{adminEmail}</span>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  );
};

export default Promotion;
