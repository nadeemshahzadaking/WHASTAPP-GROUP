
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';
import { supabase } from '../utils/supabase';

const AddGroup: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    category: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePaste = async (field: 'name' | 'link') => {
    setError('');
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      setError(t.dir === 'rtl' ? 'آپ کا براؤزر کلپ بورڈ تک رسائی کی اجازت نہیں دیتا۔' : 'Your browser does not support clipboard access.');
      return;
    }
    
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({ ...prev, [field]: text }));
      }
    } catch (err) {
      setError(t.dir === 'rtl' ? 'کلپ بورڈ تک رسائی کی اجازت نہیں ملی۔ براہ کرم مینوئل پیسٹ کریں۔' : 'Clipboard access denied. Please paste manually.');
    }
  };

  const handleClear = (field: 'name' | 'link') => {
    setFormData(prev => ({ ...prev, [field]: '' }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.category) {
      setError(t.dir === 'rtl' ? 'براہ کرم گروپ کا نام اور کیٹیگری لازمی منتخب کریں۔' : 'Please fill Group Name and Category!');
      return;
    }

    if (!formData.link.trim() || !formData.link.includes('whatsapp.com')) {
      setError(t.dir === 'rtl' ? 'براہ کرم درست واٹس ایپ لنک درج کریں۔' : 'Invalid WhatsApp link!');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: existing } = await supabase
        .from('whatsapp_groups')
        .select('id')
        .eq('link', formData.link.trim())
        .maybeSingle();

      if (existing) {
        setError(t.linkError);
        setIsSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('whatsapp_groups')
        .insert([{
          name: formData.name.trim(),
          link: formData.link.trim(),
          category: formData.category,
          description: formData.description.trim(),
          addedat: new Date().toISOString(),
          clicks: 0,
          approved: true 
        }]);

      if (insertError) throw insertError;
      
      setShowSuccess(true);
    } catch (error: any) {
      setError(t.dir === 'rtl' ? 'گروپ محفوظ کرتے وقت غلطی پیش آئی۔' : 'Error occurred while saving!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setFormData({
      ...formData,
      name: '',
      link: '',
      description: ''
    });
    setShowSuccess(false);
    setError('');
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-slate-50">
        <div className="max-w-xl w-full bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
          <div className="bg-[#25D366] p-10 md:p-16 text-center text-white">
            <div className="text-6xl md:text-8xl mb-6">✅</div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 urdu-font uppercase">{t.successTitle}</h1>
            <p className="text-white/80 font-bold urdu-font">{t.successMsg}</p>
          </div>
          
          <div className={`p-8 md:p-12 space-y-6 md:space-y-8 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.groupName}</label>
              <p className="text-xl md:text-3xl font-black text-slate-900 urdu-font">{formData.name}</p>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-slate-50">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.groupLink}</label>
              <p className="text-xs md:text-sm font-bold text-indigo-600 break-all select-all">{formData.link}</p>
            </div>

            <div className="flex flex-col gap-3 pt-6">
              <button 
                onClick={handleAddAnother}
                className="w-full bg-black text-white py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl hover:scale-105 active:scale-95 transition-all urdu-font"
              >
                {t.dir === 'rtl' ? 'مزید گروپ شامل کریں' : 'Add Another Group'}
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-slate-100 text-slate-600 py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-slate-200 active:scale-95 transition-all urdu-font"
              >
                {t.dir === 'rtl' ? 'ہوم سکرین پر جائیں' : 'Go to Home'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <BackButton />
      
      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-black p-10 md:p-16 text-center text-white relative">
          <div className="text-5xl md:text-7xl mb-6 animate-pulse">⭐</div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase urdu-font">{t.addNewGroup}</h1>
          <p className="text-[#25D366] font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em]">{t.dir === 'rtl' ? 'براہ کرم تمام معلومات درست فراہم کریں' : 'Please provide accurate information'}</p>
        </div>

        <form onSubmit={handleSubmit} className={`p-8 md:p-12 space-y-8 md:space-y-10 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 md:p-6 rounded-2xl font-black border-2 border-red-100 animate-bounce text-center urdu-font text-sm md:text-base">
              ⚠️ {error}
            </div>
          )}

          {/* Group Name Field with Paste & Clear */}
          <div className="group relative">
            <label className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3 md:mb-4 ${t.dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
              {t.groupName} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full ${t.dir === 'rtl' ? 'pl-20 pr-6 md:pl-28 md:pr-8' : 'pr-20 pl-6 md:pr-28 md:pl-8'} py-4 md:py-6 rounded-2xl md:rounded-3xl border-4 border-slate-50 focus:border-black outline-none font-bold text-lg md:text-xl transition-all urdu-font ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
                placeholder={t.dir === 'rtl' ? 'نام لکھیں' : 'Enter name'}
              />
              <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2 ${t.dir === 'rtl' ? 'left-3 md:left-5' : 'right-3 md:right-5'}`}>
                {formData.name && (
                  <button type="button" onClick={() => handleClear('name')} className="p-2 hover:bg-red-50 text-red-400 rounded-full transition-colors" title="Clear">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                )}
                <button type="button" onClick={() => handlePaste('name')} className="p-2 bg-indigo-50 text-indigo-600 rounded-full transition-all active:scale-90 hover:bg-indigo-100" title="Paste">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Group Link Field with Paste & Clear */}
          <div className="group relative">
            <label className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3 md:mb-4 ${t.dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
              {t.groupLink} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                required
                type="text"
                dir="ltr"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                placeholder="chat.whatsapp.com/..."
                className="w-full pr-20 pl-6 md:pr-28 md:pl-8 py-4 md:py-6 rounded-2xl md:rounded-3xl border-4 border-slate-50 focus:border-black outline-none font-bold text-lg md:text-xl text-left transition-all"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-3 md:right-5 flex items-center gap-1 md:gap-2">
                {formData.link && (
                  <button type="button" onClick={() => handleClear('link')} className="p-2 hover:bg-red-50 text-red-400 rounded-full transition-colors" title="Clear">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                )}
                <button type="button" onClick={() => handlePaste('link')} className="p-2 bg-indigo-50 text-indigo-600 rounded-full transition-all active:scale-90 hover:bg-indigo-100" title="Paste">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="group">
            <label className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3 md:mb-4 ${t.dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
              {t.selectCategory} <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className={`w-full px-6 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-3xl border-4 border-slate-50 focus:border-black outline-none font-bold text-lg md:text-xl appearance-none urdu-font ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
            >
              <option value="">{t.dir === 'rtl' ? 'منتخب کریں...' : 'Choose...'}</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{t.categories[cat]}</option>
              ))}
            </select>
          </div>

          <div className="group">
            <label className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3 md:mb-4 ${t.dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
              {t.descriptionLabel} <span className="text-slate-300 font-normal">({t.dir === 'rtl' ? 'اختیاری' : 'Optional'})</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`w-full px-6 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-3xl border-4 border-slate-50 focus:border-black outline-none resize-none font-bold text-lg md:text-xl transition-all urdu-font ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
              placeholder={t.dir === 'rtl' ? 'تفصیل لکھیں...' : 'Description...'}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#25D366] text-white py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black text-xl md:text-2xl shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest urdu-font"
          >
            {isSubmitting ? (t.dir === 'rtl' ? 'انتظار کریں...' : 'UPLOADING...') : t.submitBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
