import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn(
      "bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl",
      className
    )}>
      {children}
    </div>
  );
};
