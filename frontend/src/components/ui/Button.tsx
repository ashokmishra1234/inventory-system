import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className, 
  disabled, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    ghost: "hover:bg-slate-800 text-slate-400 hover:text-white"
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
