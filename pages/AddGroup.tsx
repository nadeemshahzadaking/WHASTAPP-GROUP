import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';
import AdInterstitial from '../components/AdInterstitial';

const AddGroup: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    category: '',
    description: ''
  });
  
  const [linkError, setLinkError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const isFormInvalid = useMemo(() => {
    return (
      !formData.link.startsWith('https://chat.whatsapp.com/') ||
      formData.name.length < 3 ||
      !formData.category ||
      isSubmitting
    );
  }, [formData, isSubmitting]);

  const onPreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;
    setShowAd(true);
  };

  const handleSubmit = async () => {
    setShowAd(false);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/save-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          addedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('کچھ غلط ہو گیا، دوبارہ کوشش کریں');
      }
    } catch (error) {
      alert('نیٹ ورک کا مسئلہ ہے');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-green-100">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">{t.successTitle}</h2>
          <p className="text-slate-500 font-bold mb-10 leading-relaxed urdu-text">{t.successMsg}</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-green-100"
          >
            ایک اور گروپ شامل کریں
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <AdInterstitial isOpen={showAd} onClose={() => setShowAd(false)} onComplete={handleSubmit} />
      <BackButton />
      
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-10 text-center">
          <h1 className="text-3xl font-black text-white mb-2">{t.addNewGroup}</h1>
          <p className="text-slate-400 font-bold text-sm urdu-text uppercase tracking-widest">مفت پروموشن کا موقع</p>
        </div>

        <form onSubmit={onPreSubmit} className="p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">گروپ کا نام</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-[#25D366] outline-none transition-all font-bold text-right text-slate-800 bg-slate-50/30"
              placeholder="گروپ کا نام لکھیں"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">واٹس ایپ لنک</label>
            <input
              required
              type="text"
              dir="ltr"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-[#25D366] outline-none transition-all font-bold text-left text-slate-800 bg-slate-50/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">کیٹیگری</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-[#25D366] outline-none font-bold bg-slate-50/30 text-right"
            >
              <option value="">منتخب کریں</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{t.categories[cat]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">گروپ کی تفصیل</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-[#25D366] outline-none resize-none transition-all font-bold text-right text-slate-800 bg-slate-50/30 urdu-text"
              placeholder="گروپ کے بارے میں کچھ لکھیں"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-green-100 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'جمع ہو رہا ہے...' : t.submitBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;