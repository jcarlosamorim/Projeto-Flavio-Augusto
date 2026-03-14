import React from 'react';

const variants = {
  default: 'bg-zinc-800 text-zinc-300',
  success: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/20 text-amber-400',
  danger: 'bg-red-500/20 text-red-400',
} as const;

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
} as const;

interface BadgeProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', size = 'md', className = '', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-semibold rounded-full uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
