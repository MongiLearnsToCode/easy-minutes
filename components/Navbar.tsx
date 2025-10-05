import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-md ${
          isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'
        }`
      }
    >
      {children}
    </NavLink>
  );
};

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-10 flex items-center">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF8A65] to-[#ff7043] rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" fillOpacity="0.5"/>
                <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-lg font-bold text-slate-800">Easy Minutes</h1>
        </div>
        <div className="flex items-center space-x-4">
          <NavItem to="/">Generator</NavItem>
          <NavItem to="/dashboard">Dashboard</NavItem>
          <NavItem to="/pricing">Pricing</NavItem>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;