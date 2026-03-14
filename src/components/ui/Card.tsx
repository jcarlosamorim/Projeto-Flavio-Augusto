import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

interface CardSlotProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className = '', children }: CardSlotProps) {
  return (
    <div className={`px-6 pt-6 pb-0 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ className = '', children }: CardSlotProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children }: CardSlotProps) {
  return (
    <div className={`px-6 pb-6 pt-0 border-t border-zinc-800 ${className}`}>
      {children}
    </div>
  );
}
