
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

  // Real-time link duplicate checker
  const checkDuplicateLink = async (link: string) => {
    if (!link || !link.includes('whatsapp.com')) return;
    
    setCheckingLink(true);
    setLinkError('');
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('id')
        .eq('link', link.trim())
        .maybeSingle();
      
      if (data) {
        setLinkError(language === 'ur' ? 'یہ لنک پہلے سے ہمارے پاس موجود ہے!' : 'This link already exists!');
      }
    } catch (e) {
      console.error("Check failed", e);
    } finally {
      setCheckingLink(false);
    }
  };

  const handlePaste = async (field: 'name' | 'link') => {
    setError('');
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      setError(t.dir === 'rtl' ? 'براہ کرم مینوئل پیسٹ کریں۔' : 'Please paste manually.');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({ ...prev, [field]: text }));
        if (field === 'link') checkDuplicateLink(text);
      }
    } catch (err) {
      setError(t.dir === 'rtl' ? 'پیسٹ کرنے کی اجازت نہیں ملی۔' : 'Paste denied.');
    }
  };

  const startPress = () => {
    setIsPressing(true);
    pressTimer.current = window.setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      setIsPressing(false);
    }, 5000);
  };

  const endPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setIsPressing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // Reduced to 1MB for DB performance
        setError(t.dir === 'rtl' ? 'تصویر کا سائز 1MB سے کم ہونا چاہیے۔' : 'Image must be under 1MB.');
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
      setError(t.dir === 'rtl' ? 'نام اور کیٹیگری لازمی ہے۔' : 'Name and Category required!');
      return;
    }

    if (!formData.link.trim() || !formData.link.includes('whatsapp.com')) {
      setError(t.dir === 'rtl' ? 'درست واٹس ایپ لنک درج کریں۔' : 'Invalid WhatsApp link!');
      return;
    }

    setIsSubmitting(true);
    try {
      // Final sanity check for duplicate
      const { data: existing } = await supabase.from('whatsapp_groups').select('id').eq('link', formData.link.trim()).maybeSingle();
      if (existing) {
        setLinkError(t.linkError);
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
          throw new Error(language === 'ur' ? 'ڈیٹا بیس میں امیج کالم موجود نہیں ہے۔ براہ کرم SQL کمانڈ چلائیں۔' : 'Database column image_url missing.');
        }
        throw insertError;
      }
      
      setShowSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Error occurred while saving!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 page-fade">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-[#25D366] p-10 text-center text-white">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-black urdu-font uppercase">{t.successTitle}</h1>
            <p className="text-white/80 font-bold urdu-font text-sm">{t.successMsg}</p>
          </div>
          <div className={`p-8 space-y-4 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.groupName}: <span className="text-slate-900">{formData.name}</span></p>
            <div className="flex flex-col gap-3 pt-6">
              <button onClick={() => { setShowSuccess(false); setFormData({name: '', link: '', category: formData.category, description: '', custom_color: '#128C7E', image_url: ''}); }} className="w-full bg-black text-white py-4 rounded-xl font-black text-base urdu-font">
                {t.dir === 'rtl' ? 'مزید شامل کریں' : 'Add Another'}
              </button>
              <button onClick={() => navigate('/')} className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-black text-base urdu-font">
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
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center text-white">
          <h1 className="text-2xl font-black uppercase urdu-font">{t.addNewGroup}</h1>
        </div>

        <form onSubmit={handleSubmit} className={`p-6 space-y-6 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-black text-xs text-center border border-red-100">⚠️ {error}</div>}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.groupName} *</label>
               <div className="relative">
                 <button 
                  type="button" 
                  onMouseDown={startPress}
                  onMouseUp={endPress}
                  onMouseLeave={endPress}
                  onTouchStart={startPress}
                  onTouchEnd={endPress}
                  className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center transition-all ${isPressing ? 'scale-110 bg-indigo-100' : 'hover:bg-slate-200'} ${formData.image_url ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
                  title="تصویر لگانے کے لیے 5 سیکنڈ دبا کر رکھیں"
                 >
                   {formData.image_url ? '✅' : '📷'}
                 </button>
                 {isPressing && (
                   <div className="absolute -bottom-2 left-0 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600 animate-[secret-progress_5s_linear_forwards] origin-left"></div>
                   </div>
                 )}
               </div>
            </div>
            <div className="relative">
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-black outline-none font-bold text-base urdu-font shadow-sm" />
              <button type="button" onClick={() => handlePaste('name')} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-[10px] uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">Paste</button>
            </div>
          </div>

          {formData.image_url && (
            <div className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-indigo-100 group shadow-inner">
              <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => setFormData({...formData, image_url: ''})}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center shadow-lg"
              >✕</button>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.groupLink} *</label>
            <div className="relative">
              <input 
                required 
                type="text" 
                dir="ltr" 
                value={formData.link} 
                onBlur={() => checkDuplicateLink(formData.link)}
                onChange={(e) => {
                  setFormData({...formData, link: e.target.value});
                  if(linkError) setLinkError('');
                }} 
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none font-bold text-base text-left transition-all ${linkError ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-black'}`} 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {checkingLink && <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
                <button type="button" onClick={() => handlePaste('link')} className="text-indigo-600 font-bold text-[10px] uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">Paste</button>
              </div>
            </div>
            {linkError && <p className="text-red-500 text-[10px] font-black uppercase mt-1 animate-bounce">❌ {linkError}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.selectCategory} *</label>
            <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-black outline-none font-bold text-base urdu-font shadow-sm">
              <option value="">{t.dir === 'rtl' ? 'منتخب کریں...' : 'Select...'}</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{t.categories[cat]}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">گروپ کارڈ کا رنگ</label>
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
               <input 
                type="color" 
                value={formData.custom_color} 
                onChange={(e) => setFormData({...formData, custom_color: e.target.value})}
                className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 bg-transparent overflow-hidden"
               />
               <span className="text-[9px] font-bold text-slate-500 uppercase urdu-font leading-tight">کارڈ کے لیے اپنا پسندیدہ رنگ چنیں</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.descriptionLabel}</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-black outline-none resize-none font-bold text-base urdu-font shadow-sm" />
          </div>

          <button type="submit" disabled={isSubmitting || !!linkError} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black text-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50 urdu-font uppercase shadow-lg shadow-green-100">
            {isSubmitting ? 'جمع ہو رہا ہے...' : t.submitBtn}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes secret-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
};

export default AddGroup;
