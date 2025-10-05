import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import { MeetingProvider } from './contexts/MeetingContext';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <MeetingProvider>
        <div className="flex flex-col md:h-screen bg-slate-100 text-slate-800">
          <Navbar />
          <main className="flex-grow pt-16 flex flex-col min-h-0">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </MeetingProvider>
    </HashRouter>
  );
};

export default App;