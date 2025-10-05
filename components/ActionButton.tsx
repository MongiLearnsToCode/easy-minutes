import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ variant = 'primary', children, icon, ...props }) => {
  const baseClasses = 'px-5 py-2.5 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100';
  
  const variantClasses = {
    primary: 'bg-[#FF8A65] text-white hover:bg-[#ff7043] shadow-sm hover:shadow-md hover:-translate-y-px disabled:bg-[#ffab91] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sm focus:ring-[#FF8A65]',
    secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md hover:-translate-y-px disabled:bg-red-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sm focus:ring-red-600',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default ActionButton;