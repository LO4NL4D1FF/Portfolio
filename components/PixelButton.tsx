'use client';

import { ReactNode } from 'react';
import { getGameSounds } from '@/lib/sounds';

interface PixelButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export default function PixelButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: PixelButtonProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const variants = {
    primary:   'border border-amber text-amber hover:bg-amber hover:text-ink-0',
    secondary: 'border border-slate text-slate hover:bg-slate hover:text-ink-0',
    ghost:     'border border-ink-line text-bone hover:text-amber hover:border-amber',
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      const sounds = getGameSounds();
      sounds.playClick();
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        font-mono tracking-[0.25em] uppercase transition-colors btn-press
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
