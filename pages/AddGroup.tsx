
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePaste = async (field: 'name' | 'link') => {
    setError('');
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      setError(t.dir === 'rtl' ? 'براہ کرم مینوئل پیسٹ کریں۔' : 'Please paste manually.');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (text) setFormData(prev => ({ ...prev, [field]: text }));
    } catch (err) {
      setError(t.dir === 'rtl' ? 'پیسٹ کرنے کی اجازت نہیں ملی۔' : 'Paste denied.');
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
      setError(t.dir === 'rtl' ? 'نام اور کیٹیگری لازمی ہے۔' : 'Name and Category required!');
      return;
    }

    if (!formData.link.trim() || !formData.link.includes('whatsapp.com')) {
      setError(t.dir === 'rtl' ? 'درست واٹس ایپ لنک درج کریں۔' : 'Invalid WhatsApp link!');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: existing } = await supabase.from('whatsapp_groups').select('id').eq('link', formData.link.trim()).maybeSingle();
      if (existing) {
        setError(t.linkError);
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
        approved: true 
      }]);
      if (insertError) throw insertError;
      setShowSuccess(true);
    } catch (error: any) {
      setError('Error occurred!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-[#25D366] p-10 text-center text-white">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-black urdu-font uppercase">{t.successTitle}</h1>
            <p className="text-white/80 font-bold urdu-font text-sm">{t.successMsg}</p>
          </div>
          <div className={`p-8 space-y-4 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.groupName}: <span className="text-slate-900">{formData.name}</span></p>
            <div className="flex flex-col gap-3 pt-6">
              <button onClick={() => { setShowSuccess(false); setFormData({name: '', link: '', category: formData.category, description: ''}); }} className="w-full bg-black text-white py-4 rounded-xl font-black text-base urdu-font">
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
    <div className="max-w-xl mx-auto px-4 py-10">
      <BackButton />
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center text-white">
          <h1 className="text-2xl font-black uppercase urdu-font">{t.addNewGroup}</h1>
        </div>

        <form onSubmit={handleSubmit} className={`p-6 space-y-6 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-black text-xs text-center">⚠️ {error}</div>}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.groupName} *</label>
            <div className="relative">
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-black outline-none font-bold text-base urdu-font" />
              <button type="button" onClick={() => handlePaste('name')} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-xs uppercase">Paste</button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.groupLink} *</label>
            <div className="relative">
              <input required type="text" dir="ltr" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-black outline-none font-bold text-base text-left" />
              <button type="button" onClick={() => handlePaste('link')} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-xs uppercase">Paste</button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.selectCategory} *</label>
            <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-black outline-none font-bold text-base urdu-font">
              <option value="">{t.dir === 'rtl' ? 'منتخب کریں...' : 'Select...'}</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{t.categories[cat]}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.descriptionLabel}</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-black outline-none resize-none font-bold text-base urdu-font" />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black text-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50 urdu-font uppercase">
            {isSubmitting ? '...' : t.submitBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
