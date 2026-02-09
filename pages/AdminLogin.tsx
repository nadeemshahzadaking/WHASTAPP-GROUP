
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    captchaInput: ''
  });
  
  const [captchaCode, setCaptchaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Hard-coded or env-based admin credentials
  const ADMIN_CREDS = {
    name: process.env.ADMIN_NAME || 'Admin Master',
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'mrbadshahoftheking@gmail.com',
    password: process.env.ADMIN_PASSWORD || '9999'
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Strict Validation Rules
  const validations = useMemo(() => ({
    name: formData.name.trim().length > 0,
    username: /^[a-z]+$/.test(formData.username), // Only lowercase English, no spaces
    email: /^[^\s@]+@gmail\.com$/.test(formData.email), // Gmail only, no spaces
    password: formData.password.length > 0 && !/\s/.test(formData.password), // Any char, no spaces
    captcha: formData.captchaInput === captchaCode // Exact match
  }), [formData, captchaCode]);

  const progress = useMemo(() => {
    const validCount = Object.values(validations).filter(v => v).length;
    return (validCount / 5) * 100;
  }, [validations]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isMatch = 
      formData.name === ADMIN_CREDS.name &&
      formData.username === ADMIN_CREDS.username &&
      formData.email === ADMIN_CREDS.email &&
      formData.password === ADMIN_CREDS.password &&
      formData.captchaInput === captchaCode;

    if (isMatch) {
      setTimeout(() => {
        sessionStorage.setItem('isAdmin', 'true');
        navigate('/admin-dashboard');
      }, 2000);
    } else {
      // Security protocol: Any mismatch results in direct kick-back to home
      setError(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <BackButton />
        
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative">
          {/* Top Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
            <div 
              className="h-full bg-[#25D366] transition-all duration-500 shadow-[0_0_10px_rgba(37,211,102,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="bg-slate-900 p-10 text-center text-white relative">
            <div className="absolute top-4 right-8 font-black text-xs text-white/20 tracking-widest uppercase">
              Auth System v3.0
            </div>
            <div className="text-5xl mb-4 animate-float">🔐</div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Administrator Access</h1>
            <p className="text-slate-400 text-xs font-bold mt-2 tracking-widest opacity-60">VERIFYING PERMISSIONS</p>
          </div>

          <form onSubmit={handleLogin} className="p-10 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-sm font-black border border-red-100 animate-pulse text-center uppercase tracking-widest">
                Verification Failed. Terminating Session.
              </div>
            )}

            {/* Step-by-Step Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold text-sm ${validations.name ? 'border-green-100 bg-green-50/20' : 'border-slate-50 focus:border-slate-900'}`}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <input 
                  required
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                  className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold text-sm ${validations.username ? 'border-green-100 bg-green-50/20' : 'border-slate-50 focus:border-slate-900'}`}
                  placeholder="admin-only-lowercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gmail Address</label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value.replace(/\s/g, '')})}
                className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold text-sm ${validations.email ? 'border-green-100 bg-green-50/20' : 'border-slate-50 focus:border-slate-900'}`}
                placeholder="yourname@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <input 
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value.replace(/\s/g, '')})}
                className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold text-sm ${validations.password ? 'border-green-100 bg-green-50/20' : 'border-slate-50 focus:border-slate-900'}`}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2 border-t border-slate-50">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Encrypted Key Verification</label>
              <div className="flex gap-4">
                <div 
                  onClick={generateCaptcha}
                  className="bg-slate-50 px-8 py-3.5 rounded-2xl font-black text-xl tracking-wider text-slate-400 select-none cursor-pointer flex items-center justify-center border border-slate-100 line-through italic"
                >
                  {captchaCode}
                </div>
                <input 
                  required
                  type="text"
                  value={formData.captchaInput}
                  onChange={(e) => setFormData({...formData, captchaInput: e.target.value})}
                  className={`flex-1 px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-black text-center text-xl uppercase ${validations.captcha ? 'border-green-100 bg-green-50/20' : 'border-slate-50 focus:border-slate-900'}`}
                  placeholder="KEY"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-4 shadow-xl shadow-slate-100"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="tracking-widest uppercase text-sm">Validating Identity...</span>
                </>
              ) : (
                'ESTABLISH SECURE LINK'
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-2 opacity-30">
          <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">Global Directory Infrastructure</p>
          <div className="flex gap-1">
             {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 h-1 bg-slate-400 rounded-full"></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
