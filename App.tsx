
import React from 'react';
// @ts-ignore - Ignoring missing exports error for react-router-dom
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GroupsList from './pages/GroupsList';
import AddGroup from './pages/AddGroup';
import Promotion from './pages/Promotion';
import About from './pages/About';
import OfficialLinks from './pages/OfficialLinks';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SecurityCheck from './pages/SecurityCheck';
import FloatingBackButton from './components/FloatingBackButton';
import ProductPromoBox from './components/ProductPromoBox';
import AdSlot from './components/AdSlot';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Global LanguageSelector removed from here */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto w-full px-4">
        <AdSlot position="headerAd" />
      </div>

      <FloatingBackButton />
      <ProductPromoBox />
      <AdSlot position="floatingAd" />

      <main className="flex-grow bg-[#fcfdfe]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<GroupsList />} />
          <Route path="/add" element={<AddGroup />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/about" element={<About />} />
          <Route path="/official" element={<OfficialLinks />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/security-check" element={<SecurityCheck />} />
        </Routes>
      </main>

      <div className="max-w-7xl mx-auto w-full px-4">
        <AdSlot position="footerAd" />
      </div>

      <footer className="bg-white border-t border-slate-200 py-12 text-center text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm font-bold text-slate-400">© 2024 WhatsApp Directory. Professional & Secure.</p>
          <p className="text-xs mt-2 opacity-60 font-medium">This site is not affiliated with WhatsApp Inc.</p>
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
