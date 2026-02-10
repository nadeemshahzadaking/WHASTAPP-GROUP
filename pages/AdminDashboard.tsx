
import React, { useEffect } from 'react';
// @ts-ignore - Ignoring missing exports error for react-router-dom
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Admin Dashboard</h1>
            <p className="text-slate-500 font-bold">Welcome back, Administrator</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-100 transition-all"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Future Functionalities Slots */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Group Management</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Approve, Edit or Delete WhatsApp groups from the directory.</p>
            <div className="h-10 w-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 font-bold text-xs uppercase">Coming Soon</div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ads Control</h3>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ads Control</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Update advertisement codes and toggle visibility across pages.</p>
            <div className="h-10 w-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 font-bold text-xs uppercase">Coming Soon</div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Promo Settings</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Update the VIP Promotion box content, video, and links.</p>
            <div className="h-10 w-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 font-bold text-xs uppercase">Coming Soon</div>
          </div>
        </div>

        <div className="mt-12 bg-slate-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <h2 className="text-2xl font-black mb-4">System Overview</h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto">
            This panel is currently in build mode. More functions will be added as requested.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
