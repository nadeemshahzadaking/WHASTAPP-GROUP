
import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';
import SafetyModal from '../components/SafetyModal';
import AdInterstitial from '../components/AdInterstitial';
import { containsBannedWords } from '../utils/wordFilter';

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
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const handleFieldChange = (val: string, field: keyof typeof formData) => {
    if (containsBannedWords(val)) {
      setFormData(prev => ({ ...prev, [field]: '' }));
      setIsSafetyOpen(true);
      return;
    }
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleLinkChange = (val: string) => {
    setFormData({ ...formData, link: val });
    if (val && !val.startsWith('https://chat.whatsapp.com/')) {
      setLinkError(t.linkError);
    } else {
      setLinkError('');
    }
  };

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
          name: formData.name,
          link: formData.link,
          category: formData.category,
          description: formData.description,
          addedAt: new Date().toISOString()
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorMessage = data.error || 'Error saving data. Please try again.';
        alert(errorMessage + (data.details ? `\n\nDetails: ${data.details}` : ''));
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-50 p-10 rounded-3xl border border-green-100 animate-in zoom-in-95 duration-300">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">{t.successTitle}</h2>
          <p className="text-green-700 text-lg mb-8 leading-relaxed whitespace-pre-line">
            {t.successMsg}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#128C7E] transition-all"
          >
            Add Another Group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <AdInterstitial isOpen={showAd} onClose={() => setShowAd(false)} onComplete={handleSubmit} />
      <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />
      <BackButton />
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className={`bg-[#25D366] p-8 text-white text-left`}>
          <h1 className="text-3xl font-bold mb-2">{t.addNewGroup}</h1>
          <p className="opacity-90">{t.subtitle.split('.')[0]}.</p>
        </div>

        <form onSubmit={onPreSubmit} className={`p-8 space-y-6 text-left`}>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.groupName}</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => handleFieldChange(e.target.value, 'name')}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#25D366] outline-none transition-all text-left`}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.groupLink}</label>
            <input
              required
              type="text"
              dir="ltr"
              value={formData.link}
              onChange={(e) => handleLinkChange(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className={`w-full px-4 py-3 rounded-xl border ${linkError ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-[#25D366] outline-none transition-all text-left`}
            />
            {linkError && (
              <p className="mt-2 text-sm text-red-600 font-bold">{linkError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.selectCategory}</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as any})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#25D366] outline-none bg-white"
            >
              <option value="">{t.selectCategory}</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{t.categories[cat]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.descriptionLabel}</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleFieldChange(e.target.value, 'description')}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#25D366] outline-none resize-none transition-all text-left`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSubmitting && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
            {isSubmitting ? 'Submitting...' : t.submitBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
