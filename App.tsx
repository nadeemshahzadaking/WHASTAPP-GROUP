
import React from 'react';
// @ts-ignore
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GroupsList from './pages/GroupsList';
import AddGroup from './pages/AddGroup';
import Trending from './pages/Trending';
import GroupDetails from './pages/GroupDetails';
import About from './pages/About';
import OfficialLinks from './pages/OfficialLinks';
import FloatingBackButton from './components/FloatingBackButton';
import AdSlot from './components/AdSlot';
import Promotion from './pages/Promotion';
import SecurityCheck from './pages/SecurityCheck';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductPromoBox from './components/ProductPromoBox';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans relative selection:bg-indigo-600 selection:text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto w-full px-4">
        <AdSlot position="headerAd" />
      </div>

      <FloatingBackButton />
      <ProductPromoBox />

      <main className="flex-grow bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<GroupsList />} />
          <Route path="/group/:id" element={<GroupDetails />} />
          <Route path="/add" element={<AddGroup />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/about" element={<About />} />
          <Route path="/official" element={<OfficialLinks />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/security-check" element={<SecurityCheck />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>

      <footer className="bg-black py-32 text-center text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="flex flex-wrap justify-center gap-12 mb-8">
            <Link to="/" className="text-sm font-black text-white hover:text-[#25D366] transition-all uppercase tracking-widest">Home</Link>
            <Link to="/groups" className="text-sm font-black text-white hover:text-[#25D366] transition-all uppercase tracking-widest">Browse</Link>
            <Link to="/trending" className="text-sm font-black text-white hover:text-[#25D366] transition-all uppercase tracking-widest">Trending</Link>
            <Link to="/add" className="text-sm font-black text-white hover:text-[#25D366] transition-all uppercase tracking-widest">Add Group</Link>
          </div>
          
          <div className="pt-16 border-t border-white/10">
            <div className="text-5xl font-black text-white mb-6 tracking-tighter">WHATSAPP HUB</div>
            <p className="text-[10px] font-bold text-slate-600 max-w-lg mx-auto leading-relaxed uppercase tracking-[0.4em] opacity-80">
              Professional Global Directory for Secure WhatsApp Communities.
              © 2026 All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
};

export default App;
