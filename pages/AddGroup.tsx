
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';
import { supabase } from '../utils/supabase';

const AddGroup: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pressTimer = useRef<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    category: '',
    description: '',
    custom_color: '#128C7E',
    image_url: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [linkError, setLinkError] = useState('');
  const [isPressing, setIsPressing] = useState(false);
  const [checkingLink, setCheckingLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const checkDuplicateLink = async (link: string) => {
    const cleanLink = link.trim();
    if (!cleanLink || !cleanLink.includes('whatsapp.com')) return;
    
    setCheckingLink(true);
    setLinkError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('whatsapp_groups')
        .select('id')
        .eq('link', cleanLink)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (data) {
        setLinkError(language === 'ur' ? 'یہ لنک پہلے سے ہمارے پاس موجود ہے!' : 'This link already exists!');
      }
    } catch (e: any) {
      console.error("Check failed", e);
      // Don't block user if check fails due to temporary network, but log it
    } finally {
      setCheckingLink(false);
    }
  };

  const handlePaste = async (field: 'name' | 'link') => {
    setError('');
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({ ...prev, [field]: text }));
        if (field === 'link') checkDuplicateLink(text);
      }
    } catch (err) {
      setError(t.dir === 'rtl' ? 'براہ کرم مینوئل پیسٹ کریں۔' : 'Please paste manually.');
    }
  };

  const startPress = () => {
    setIsPressing(true);
    pressTimer.current = window.setTimeout(() => {
      if (fileInputRef.current) fileInputRef.current.click();
      setIsPressing(false);
    }, 5000);
  };

  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    setIsPressing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        setError(language === 'ur' ? 'تصویر 1MB سے کم ہونی چاہیے۔' : 'Image must be under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (linkError) {
      setError(linkError);
      return;
    }

    if (!formData.name.trim() || !formData.category) {
      setError(language === 'ur' ? 'نام اور کیٹیگری لازمی ہے۔' : 'Name and Category required!');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: existing, error: existError } = await supabase
        .from('whatsapp_groups')
        .select('id')
        .eq('link', formData.link.trim())
        .maybeSingle();
      
      if (existError && existError.code !== 'PGRST116') throw existError;
      if (existing) {
        setError(language === 'ur' ? 'یہ لنک پہلے سے موجود ہے۔' : 'Link already exists.');
        setIsSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase.from('whatsapp_groups').insert([{
        name: formData.name.trim(),
        link: formData.link.trim(),
        category: formData.category,
        description: formData.description.trim(),
        addedat: new Date().toISOString(),
        clicks: 0,
        approved: true,
        custom_color: formData.custom_color,
        image_url: formData.image_url || null
      }]);
      
      if (insertError) {
        if (insertError.message.includes('image_url')) {
          setError(language === 'ur' ? 'ڈیٹا بیس ایرر: تصویر محفوظ کرنے کا کالم غائب ہے۔' : 'Database Error: image_url column missing.');
          setIsSubmitting(false);
          return;
        }
        throw insertError;
      }
      
      setShowSuccess(true);
    } catch (error: any) {
      console.error(error);
      setError(language === 'ur' ? 'سسٹم سے رابطہ نہیں ہو سکا۔ انٹرنیٹ چیک کریں۔' : 'Connection failed. Check your internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 page-fade">
        <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-[#25D366] p-12 text-center text-white">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-black urdu-font uppercase">{t.successTitle}</h1>
            <p className="text-white/80 font-bold urdu-font">{t.successMsg}</p>
          </div>
          <div className={`p-10 space-y-6 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.groupName}</p>
              <p className="text-lg font-black text-slate-900">{formData.name}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setShowSuccess(false); setFormData({name: '', link: '', category: '', description: '', custom_color: '#128C7E', image_url: ''}); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-base urdu-font transition-all active:scale-95 shadow-lg">
                {language === 'ur' ? 'مزید شامل کریں' : 'Add Another'}
              </button>
              <button onClick={() => navigate('/')} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-sm urdu-font">
                {t.dir === 'rtl' ? 'ہوم پر جائیں' : 'Go to Home'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 page-fade">
      <BackButton />
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-10 text-center text-white relative">
          <h1 className="text-3xl font-black uppercase urdu-font tracking-tight">{t.addNewGroup}</h1>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#25D366] to-transparent opacity-30"></div>
        </div>

        <form onSubmit={handleSubmit} className={`p-8 space-y-8 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {error && (
            <div className="bg-red-50 text-red-600 p-5 rounded-2xl font-black text-xs text-center border-2 border-red-100 animate-shake">
              ⚠️ {error}
            </div>
          )}

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.groupName} *</label>
               <div className="relative">
                 <button 
                  type="button" 
                  onMouseDown={startPress} onMouseUp={endPress} onMouseLeave={endPress} onTouchStart={startPress} onTouchEnd={endPress}
                  className={`w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center transition-all ${isPressing ? 'scale-110 bg-indigo-50 shadow-inner' : 'hover:bg-slate-200'} ${formData.image_url ? 'ring-4 ring-green-100 border-2 border-green-400' : ''}`}
                 >
                   {formData.image_url ? '✅' : '📷'}
                 </button>
                 {isPressing && (
                   <div className="absolute -bottom-3 left-0 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600 animate-[secret-progress_5s_linear_forwards] origin-left"></div>
                   </div>
                 )}
               </div>
            </div>
            <div className="relative">
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-slate-900 outline-none font-bold text-lg urdu-font shadow-sm transition-all" />
              <button type="button" onClick={() => handlePaste('name')} className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white font-black text-[9px] uppercase px-3 py-1.5 rounded-lg shadow-md">Paste</button>
            </div>
          </div>

          {formData.image_url && (
            <div className="relative w-full h-40 rounded-[2rem] overflow-hidden border-4 border-slate-50 group shadow-2xl">
              <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-xl">✕</button>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.groupLink} *</label>
            <div className="relative">
              <input 
                required type="text" dir="ltr" value={formData.link} 
                onBlur={() => checkDuplicateLink(formData.link)}
                onChange={(e) => { setFormData({...formData, link: e.target.value}); if(linkError) setLinkError(''); }} 
                className={`w-full px-5 py-4 rounded-2xl border-2 outline-none font-bold text-base text-left transition-all ${linkError ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-slate-900 shadow-sm'}`} 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {checkingLink && <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
                <button type="button" onClick={() => handlePaste('link')} className="bg-slate-900 text-white font-black text-[9px] uppercase px-3 py-1.5 rounded-lg shadow-md">Paste</button>
              </div>
            </div>
            {linkError && <p className="text-red-500 text-[10px] font-black uppercase mt-1 animate-bounce">❌ {linkError}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.selectCategory} *</label>
              <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-slate-900 outline-none font-bold text-base urdu-font shadow-sm">
                <option value="">{t.dir === 'rtl' ? 'منتخب کریں...' : 'Select...'}</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{t.categories[cat]}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">کارڈ کا رنگ</label>
              <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shadow-inner">
                 <input type="color" value={formData.custom_color} onChange={(e) => setFormData({...formData, custom_color: e.target.value})} className="w-11 h-11 rounded-xl cursor-pointer border-none p-0 bg-transparent" />
                 <span className="text-[8px] font-bold text-slate-500 uppercase urdu-font leading-tight">پسندیدہ رنگ چنیں</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.descriptionLabel}</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-slate-900 outline-none resize-none font-bold text-base urdu-font shadow-sm" />
          </div>

          <button type="submit" disabled={isSubmitting || !!linkError} className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-green-100 uppercase tracking-widest">
            {isSubmitting ? 'پروسیسنگ ہو رہی ہے...' : t.submitBtn}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes secret-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}} />
    </div>
  );
};

export default AddGroup;
