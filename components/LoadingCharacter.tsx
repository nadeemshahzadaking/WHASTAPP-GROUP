
import React from 'react';

interface LoadingCharacterProps {
  version?: number;
}

const LoadingCharacter: React.FC<LoadingCharacterProps> = ({ version = 5 }) => {
  // VERSION 5: Flipping 3D Card (SELECTED BY USER)
  if (version === 5) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-16 h-20 bg-slate-900 rounded-xl border-t-4 border-[#25D366] shadow-2xl animate-[flip_2s_infinite] flex items-center justify-center">
          <div className="text-white font-black text-2xl">W</div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes flip {
            0% { transform: perspective(400px) rotateY(0); }
            100% { transform: perspective(400px) rotateY(360deg); }
          }
        `}} />
        <p className="mt-6 text-slate-400 font-black text-[10px] tracking-widest uppercase urdu-font animate-pulse">
          پروگریس ہو رہا ہے...
        </p>
      </div>
    );
  }

  // Other versions for testing/reference
  if (version === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="relative w-20 h-20 character-3d">
          <div className="absolute inset-0 bg-[#25D366] rounded-2xl shadow-xl border-4 border-white flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
          </div>
          <div className="absolute -bottom-1 left-4 w-4 h-4 bg-[#25D366] border-r-4 border-b-4 border-white rotate-45 rounded-sm"></div>
        </div>
        <p className="mt-4 text-slate-400 font-black text-[9px] tracking-widest uppercase urdu-font">لوڈ ہو رہا ہے...</p>
      </div>
    );
  }

  if (version === 2) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 bg-[#25D366] rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-[spin_2s_linear_infinite] [transform-style:preserve-3d]">
          <div className="text-white text-2xl">⚡</div>
        </div>
        <p className="mt-6 text-[#25D366] font-black text-[10px] uppercase urdu-font">تیز رفتار پروسیسنگ</p>
      </div>
    );
  }

  if (version === 3) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-[#25D366] rounded-full animate-bounce shadow-lg"></div>
          <div className="w-4 h-4 bg-[#25D366] rounded-full animate-bounce shadow-lg [animation-delay:0.2s]"></div>
          <div className="w-4 h-4 bg-[#25D366] rounded-full animate-bounce shadow-lg [animation-delay:0.4s]"></div>
        </div>
        <p className="mt-6 text-slate-400 font-black text-[9px] uppercase tracking-[0.3em]">Connecting...</p>
      </div>
    );
  }

  if (version === 4) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-[#25D366] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-slate-50 rounded-full flex items-center justify-center text-xl">🛡️</div>
        </div>
        <p className="mt-4 text-slate-900 font-black text-[8px] uppercase tracking-widest">Security Scan</p>
      </div>
    );
  }

  if (version === 6) {
    return (
      <div className="flex flex-col items-center justify-center py-10 overflow-hidden">
        <div className="text-4xl animate-bounce">🚀</div>
        <div className="w-16 h-1 bg-slate-100 rounded-full mt-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600 animate-[slide_1s_infinite]"></div>
        </div>
        <p className="mt-4 text-indigo-600 font-black text-[8px] uppercase tracking-widest">Turbo Loading</p>
      </div>
    );
  }

  if (version === 7) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex items-end gap-1 h-8">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-1.5 bg-[#25D366] rounded-full animate-[wave_1s_infinite]" style={{ height: `${20 + i*15}%`, animationDelay: `${i*0.1}s` }}></div>
          ))}
        </div>
        <p className="mt-4 text-slate-400 font-bold text-[9px] uppercase">Processing Data</p>
      </div>
    );
  }

  if (version === 8) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-5 h-5 bg-[#25D366] rounded-md animate-pulse shadow-md"></div>
          <div className="absolute top-0 right-0 w-5 h-5 bg-black rounded-md animate-pulse shadow-md [animation-delay:0.2s]"></div>
          <div className="absolute bottom-0 left-0 w-5 h-5 bg-slate-200 rounded-md animate-pulse shadow-md [animation-delay:0.4s]"></div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#25D366] rounded-md animate-pulse shadow-md [animation-delay:0.6s]"></div>
        </div>
        <p className="mt-6 text-slate-900 font-black text-[9px] uppercase tracking-widest urdu-font">جدید ترین ٹیکنالوجی</p>
      </div>
    );
  }

  return null;
};

export default LoadingCharacter;
