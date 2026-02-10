
import React, { useState, useEffect } from 'react';
// @ts-ignore - Ignoring missing exports error for react-router-dom
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const SecurityCheck: React.FC = () => {
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [sliders, setSliders] = useState({ s1: 0, s2: 0, s3: 0 });
  const [targets] = useState({ 
    s1: Math.floor(Math.random() * 80) + 10,
    s2: Math.floor(Math.random() * 80) + 10,
    s3: Math.floor(Math.random() * 80) + 10
  });
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  const generateCaptcha = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    const tolerance = 4;
    const isS1Correct = Math.abs(sliders.s1 - targets.s1) <= tolerance;
    const isS2Correct = Math.abs(sliders.s2 - targets.s2) <= tolerance;
    const isS3Correct = Math.abs(sliders.s3 - targets.s3) <= tolerance;
    const isCaptchaCorrect = captchaInput.toUpperCase() === captcha;

    if (isS1Correct && isS2Correct && isS3Correct && isCaptchaCorrect) {
      setStatus('success');
      // Redirect to Admin Login for the second layer of security
      setTimeout(() => navigate('/admin-login'), 1200);
    } else {
      setStatus('error');
      // On security failure, send back to home immediately to prevent brute force
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <BackButton />
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden text-center">
          <div className="bg-slate-900 p-8 text-white">
            <div className="text-5xl mb-4">🛡️</div>
            <h1 className="text-2xl font-black uppercase tracking-widest">Security Layer 1</h1>
            <p className="text-slate-400 text-sm font-bold mt-2 tracking-tighter uppercase">Algorithm Shield Protected</p>
          </div>

          <div className="p-8 space-y-8">
            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-bold border border-red-100 animate-pulse">
                ❌ Verification Failed! Redirecting...
              </div>
            )}

            {status === 'success' && (
              <div className="bg-green-50 text-green-600 p-4 rounded-2xl font-bold border border-green-100">
                ✅ Layer 1 Cleared! Next Step...
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Verify Human Identity</label>
              <div className="flex gap-4">
                <div 
                  onClick={generateCaptcha}
                  className="bg-slate-100 px-6 py-4 rounded-2xl font-black text-2xl text-slate-300 select-none cursor-pointer border-2 border-slate-200 flex-1 line-through italic"
                >
                  {captcha}
                </div>
                <input 
                  type="text"
                  maxLength={6}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="CODE"
                  className="w-32 bg-white px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-slate-900 outline-none font-black text-center text-xl uppercase"
                />
              </div>
            </div>

            <div className="space-y-8 py-4 border-t border-slate-50">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Coordinate Alignment</label>
              
              {[1, 2, 3].map((num) => {
                const key = `s${num}` as keyof typeof sliders;
                const target = targets[key];
                const value = sliders[key];
                const isMatched = Math.abs(value - target) <= 4;

                return (
                  <div key={num} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                      <span>Variable {num}</span>
                      <span className={isMatched ? 'text-green-500' : ''}>{isMatched ? 'LOCKED' : 'SCANNING...'}</span>
                    </div>
                    <div className="relative h-6 flex items-center">
                      <div 
                        className="absolute h-4 w-6 bg-slate-100 rounded-lg border border-slate-200 opacity-50"
                        style={{ left: `${target}%` }}
                      ></div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={value}
                        onChange={(e) => setSliders({...sliders, [key]: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={handleVerify}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              INITIALIZE LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCheck;
