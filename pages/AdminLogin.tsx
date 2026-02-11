
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { supabase } from '../utils/supabase';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captchaInput: ''
  });
  
  const [captchaCode, setCaptchaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptchaCode(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.captchaInput.toUpperCase() !== captchaCode) {
      setError('کیپچا غلط ہے');
      generateCaptcha();
      return;
    }

    setLoading(true);

    try {
      // سپربیس سے ایڈمن کی تصدیق
      const { data, error: dbError } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('username', formData.username.trim())
        .eq('password', formData.password.trim())
        .maybeSingle();

      if (dbError) throw dbError;

      if (data) {
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('adminUser', data.username);
        navigate('/admin-dashboard');
      } else {
        setError('یوزر نیم یا پاس ورڈ غلط ہے');
        generateCaptcha();
      }
    } catch (err: any) {
      setError('سسٹم سے رابطہ نہیں ہو سکا');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <BackButton />
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-10 text-center text-white">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-2xl font-black uppercase tracking-widest">Admin Secure Access</h1>
            <p className="text-slate-400 text-xs font-bold mt-2">DATABASE VERIFICATION REQUIRED</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 text-center">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4 text-right">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 mr-1">Username</label>
                <input 
                  required
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-slate-900 outline-none font-bold"
                  placeholder="ایڈمن یوزر نیم"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 mr-1">Password</label>
                <input 
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-slate-900 outline-none font-bold"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2 border-t border-slate-50">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 mr-1">Human Verification</label>
                <div className="flex gap-3">
                  <div className="bg-slate-900 text-[#25D366] px-6 py-4 rounded-2xl font-black text-xl italic line-through flex-1 flex items-center justify-center">
                    {captchaCode}
                  </div>
                  <input 
                    required
                    type="text"
                    maxLength={5}
                    value={formData.captchaInput}
                    onChange={(e) => setFormData({...formData, captchaInput: e.target.value.toUpperCase()})}
                    className="w-24 px-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-slate-900 outline-none font-black text-center text-xl"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'LOGIN TO DASHBOARD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
