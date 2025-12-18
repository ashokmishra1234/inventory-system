import React from 'react';
import { cn } from '../../utils/cn';

// Allow Card to accept onClick and other div props
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={cn(
      "bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl",
      className
    )} {...props}>
      {children}
    </div>
  );
};
