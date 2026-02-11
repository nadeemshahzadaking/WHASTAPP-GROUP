
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { WhatsAppGroup } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, clicks: 0 });

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/admin-login');
      return;
    }
    fetchGroups();
  }, [navigate]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .order('addedat', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted = data.map((item: any) => ({
          id: item.id?.toString(),
          name: item.name || 'Untitled',
          link: item.link || '',
          category: item.category || 'Other',
          description: item.description || '',
          addedAt: item.addedat || new Date().toISOString(),
          clicks: parseInt(item.clicks) || 0,
          approved: item.approved // Assuming column exists
        }));
        setGroups(formatted);
        
        // Stats calculation
        const totalClicks = formatted.reduce((acc: number, curr: any) => acc + curr.clicks, 0);
        const pending = data.filter((item: any) => item.approved === false).length;
        setStats({ total: formatted.length, pending, clicks: totalClicks });
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('whatsapp_groups')
        .update({ approved: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchGroups();
    } catch (err) {
      alert('Approval update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('کیا آپ واقعی یہ گروپ ختم کرنا چاہتے ہیں؟')) return;
    try {
      const { error } = await supabase
        .from('whatsapp_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchGroups();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900 text-white p-8 flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center">🛠️</div>
          <span className="text-xl font-black tracking-tight">ADMIN PANEL</span>
        </div>

        <nav className="flex-grow space-y-4">
          <button className="w-full flex items-center gap-4 px-6 py-4 bg-white/10 rounded-2xl font-bold text-sm">
            <span>📊</span> Dashboard
          </button>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 rounded-2xl font-bold text-sm transition-all text-slate-400">
            <span>🏠</span> View Site
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="bg-red-500/10 text-red-400 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
        >
          Logout Session
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-x-hidden">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 urdu-font">ایڈمن کنٹرول روم</h1>
            <p className="text-slate-500 font-bold">Welcome, {sessionStorage.getItem('adminUser')}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm text-center min-w-[120px]">
              <div className="text-xs font-black text-slate-400 uppercase mb-1">Total</div>
              <div className="text-2xl font-black text-slate-900">{stats.total}</div>
            </div>
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm text-center min-w-[120px]">
              <div className="text-xs font-black text-slate-400 uppercase mb-1">Pending</div>
              <div className="text-2xl font-black text-orange-500">{stats.pending}</div>
            </div>
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm text-center min-w-[120px]">
              <div className="text-xs font-black text-slate-400 uppercase mb-1">Clicks</div>
              <div className="text-2xl font-black text-[#25D366]">{stats.clicks}</div>
            </div>
          </div>
        </header>

        {/* Group Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right urdu-font">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">کارروائی</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">اسٹیٹس</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">ویوز</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">کیٹیگری</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">گروپ نام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center font-bold text-slate-400">Loading Groups...</td></tr>
                ) : groups.map((group: any) => (
                  <tr key={group.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDelete(group.id)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >🗑️</button>
                        <button 
                          onClick={() => window.open(group.link, '_blank')}
                          className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                        >🔗</button>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => handleToggleApprove(group.id, group.approved)}
                        className={`px-4 py-2 rounded-full text-xs font-black border-2 transition-all ${group.approved ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse'}`}
                      >
                        {group.approved ? 'منظور شدہ' : 'منظوری درکار'}
                      </button>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-600">{group.clicks}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 uppercase">{group.category}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-black text-slate-900">{group.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold truncate max-w-[200px]">{group.link}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
