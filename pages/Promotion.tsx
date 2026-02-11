
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';
import LanguageSelector from '../components/LanguageSelector';

/**
 * 🚀 PROMOTION PAGE (FULLY DIRECT WORKFLOW)
 * -----------------
 * This version ensures the user is taken to their email client
 * and provides clear instructions until the action is finalized.
 */
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
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    'Online Course / Tuition',
    'Social Media Management',
    'Other (Specify Below)'
  ];

  const validations = useMemo(() => ({
    name: formData.name.trim().length >= 3,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail),
    type: formData.promoType !== '',
    details: formData.details.trim().length >= 5
  }), [formData]);

  const progress = useMemo(() => {
    const validCount = Object.values(validations).filter(v => v).length;
    return (validCount / 4) * 100;
  }, [validations]);

  const handleAction = (isDirect = false) => {
    setError('');
    
    // If it's the main form submission
    if (!isDirect) {
      if (!validations.email) {
        setError(language === 'ur' ? 'براہ کرم درست ای میل ایڈریس درج کریں۔' : 'Please enter a valid email address.');
        return;
      }
      if (!validations.name || !validations.type || !validations.details) {
        setError(language === 'ur' ? 'تمام ضروری خانے پُر کریں۔' : 'Please fill all required fields.');
        return;
      }
    }

    const type = formData.promoType.includes('Other') ? formData.customType : formData.promoType;
    const subject = encodeURIComponent(isDirect ? `Ad Inquiry: Quick Contact` : `PROMOTION REQUEST: ${type}`);
    const body = encodeURIComponent(
      isDirect 
      ? `Hello, I want to inquire about advertisements and promotion packages.`
      : `--- Promotion Request Form ---\n\n` +
        `User Name: ${formData.name}\n` +
        `User Contact: ${formData.userEmail}\n` +
        `Target Type: ${type}\n` +
        `Description: ${formData.details}\n\n` +
        `Please finalize and send this email to complete your request.`
    );

    // Opening email client directly
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    
    // Show confirmation step to ensure they actually send it
    if (!isDirect) setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-2xl border-4 border-[#25D366]">
          <div className="text-8xl mb-8 animate-bounce">📤</div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 urdu-font uppercase">
            {language === 'ur' ? 'آخری مرحلہ!' : 'Final Step!'}
          </h2>
          <p className="text-slate-600 font-bold mb-10 text-xl leading-relaxed urdu-font">
            {language === 'ur' 
              ? 'آپ کی معلومات ای میل ایپ میں لوڈ کر دی گئی ہیں۔ اگر ای میل ایپ نہیں کھلی تو نیچے والے بٹن پر کلک کریں اور وہاں سے "سینڈ" ضرور دبائیں تاکہ ہمیں موصول ہو جائے۔' 
              : 'Your info is loaded in your email app. If it didn\'t open, click below and make sure to press "SEND" inside the app.'}
          </p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => handleAction()}
              className="bg-[#25D366] text-white px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-green-100"
            >
              {language === 'ur' ? 'ای میل ایپ دوبارہ کھولیں' : 'Re-open Email App'}
            </button>
            <button 
              onClick={() => setShowConfirmation(false)}
              className="text-slate-400 font-black text-xs uppercase hover:text-slate-900 transition-colors mt-4"
            >
              {language === 'ur' ? 'فارم میں تبدیلی کریں' : 'Edit Form Details'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative page-fade">
      <div className="absolute top-0 right-4">
        <LanguageSelector />
      </div>

      <BackButton />
      
      <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <div 
            className="h-full bg-[#25D366] transition-all duration-700" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="bg-slate-900 p-12 text-center text-white">
          <div className="text-7xl mb-6">📊</div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">{t.dir === 'rtl' ? 'پروموشن پینل' : 'PROMOTION HUB'}</h1>
          <p className="text-slate-400 text-lg font-medium urdu-font">
            فارم بھریں اور ہمیں ای میل کے ذریعے سینڈ کریں۔
          </p>
        </div>

        <div className={`p-8 md:p-14 space-y-12 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <form onSubmit={(e) => { e.preventDefault(); handleAction(); }} className="space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-sm font-black border border-red-100 text-center animate-shake">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.dir === 'rtl' ? 'آپ کا نام' : 'Your Name'} *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-slate-900 outline-none bg-slate-50/50 font-bold transition-all" 
                    placeholder={language === 'ur' ? 'اپنا نام لکھیں' : 'Full name'}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.dir === 'rtl' ? 'رابطہ ای میل' : 'Your Email'} *</label>
                  <input 
                    required
                    type="email" 
                    value={formData.userEmail}
                    onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-slate-900 outline-none bg-slate-50/50 font-bold transition-all" 
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.dir === 'rtl' ? 'پروموشن کی قسم' : 'Promo Type'} *</label>
                  <select 
                    required
                    value={formData.promoType}
                    onChange={(e) => setFormData({...formData, promoType: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-slate-900 outline-none bg-slate-50/50 font-bold transition-all"
                  >
                    <option value="">{t.selectCategory}</option>
                    {promoTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                {formData.promoType.includes('Other') && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Specify Category</label>
                    <input 
                      type="text"
                      value={formData.customType}
                      onChange={(e) => setFormData({...formData, customType: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-slate-900 outline-none bg-slate-50/50 font-bold" 
                      placeholder="e.g. Website Ad"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.dir === 'rtl' ? 'تفصیلات' : 'Details'} *</label>
              <textarea 
                required
                rows={4}
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-slate-900 outline-none bg-slate-50/50 font-bold resize-none transition-all"
                placeholder={language === 'ur' ? 'یہاں تفصیل لکھیں...' : 'Tell us more...'}
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#25D366] text-white py-6 rounded-[2rem] font-black text-xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-green-100 flex items-center justify-center gap-4 uppercase"
            >
              <span>{language === 'ur' ? 'ای میل ایپ میں جائیں' : 'GO TO EMAIL APP'}</span>
              <span className="text-2xl">➔</span>
            </button>
          </form>

          {/* Quick Action Gmail Box */}
          <div className="pt-10 border-t border-slate-100 flex flex-col items-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 urdu-font">یا فوری رابطہ کریں</p>
            
            <button 
              onClick={() => handleAction(true)}
              className="group w-full max-w-lg bg-slate-50 hover:bg-white border-2 border-slate-50 hover:border-[#25D366] p-6 rounded-[2.5rem] flex items-center gap-6 transition-all shadow-sm active:scale-95"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-md group-hover:bg-[#25D366] transition-colors">📩</div>
              <div className="flex-1 text-center md:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.dir === 'rtl' ? 'ہمارا ای میل' : 'OUR EMAIL'}</p>
                <p className="text-lg font-black text-slate-800 break-all">{adminEmail}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold border border-slate-100 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotion;
