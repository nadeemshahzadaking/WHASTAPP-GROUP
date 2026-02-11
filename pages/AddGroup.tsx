
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';
import { supabase } from '../utils/supabase';

const AddGroup: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    category: '',
    description: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.link.includes('whatsapp.com')) {
      alert('براہ کرم درست واٹس ایپ لنک درج کریں');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('whatsapp_groups')
        .insert([{
          name: formData.name.trim(),
          link: formData.link.trim(),
          category: formData.category,
          description: formData.description.trim(),
          addedat: new Date().toISOString(),
          clicks: 0
        }]);

      if (error) throw error;
      setIsSubmitted(true);
    } catch (error: any) {
      alert('غلطی: ' + error.message);
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
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-100"
          >
            ایک اور گروپ شامل کریں
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-right">
      <BackButton />
      
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-10 text-center text-white">
          <h1 className="text-3xl font-black mb-2">{t.addNewGroup}</h1>
          <p className="text-slate-400 font-bold text-sm uppercase">مفت پروموشن کا موقع</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-2">گروپ کا نام</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-[#25D366] outline-none text-right font-bold"
              placeholder="گروپ کا نام لکھیں"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-2">واٹس ایپ لنک</label>
            <input
              required
              type="text"
              dir="ltr"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-[#25D366] outline-none text-left font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-2">کیٹیگری</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-[#25D366] outline-none font-bold text-right bg-white"
            >
              <option value="">منتخب کریں</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{t.categories[cat]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-2">گروپ کی تفصیل</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-[#25D366] outline-none resize-none font-bold text-right"
              placeholder="گروپ کے بارے میں کچھ لکھیں"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'جمع ہو رہا ہے...' : t.submitBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
