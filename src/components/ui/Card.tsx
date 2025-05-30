import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  highlight?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  className, 
  children, 
  highlight = false,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'card',
        'transition-all duration-200',
        highlight && 'border-2 border-primary shadow-lg',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div 
      className={cn('mb-4', className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <h3 
      className={cn('text-xl font-bold', className)} 
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <p 
      className={cn('text-slate-500 mt-1', className)} 
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div 
      className={cn('', className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div 
      className={cn('mt-6 flex items-center justify-end gap-4', className)} 
      {...props}
    >
      {children}
    </div>
  );
};