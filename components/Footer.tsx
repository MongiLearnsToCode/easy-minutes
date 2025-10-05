import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 py-6 px-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
        <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} Easy Minutes. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <Link to="/contact" className="hover:text-slate-800 transition-colors">Contact</Link>
          <Link to="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;