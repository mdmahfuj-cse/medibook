import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'sage'
    | 'woodland'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'slate'
    | 'outline'
    | 'ghost';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
  className?: string;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-tight transition-colors select-none';

  const variants = {
    default: 'bg-[#F0F4ED] text-[#2B352F] border border-[#C9DABF]/60',
    sage: 'bg-[#C9DABF]/40 text-[#2B352F] border border-[#9CA986]/50',
    woodland: 'bg-[#5F6F65] text-white',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    destructive: 'bg-rose-50 text-rose-800 border border-rose-200',
    slate: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    outline: 'border border-[#C4CFC0] text-[#5F6F65] bg-white',
    ghost: 'text-[#5F6F65] bg-transparent',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
