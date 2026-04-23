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
  children, onClick, variant = 'primary', size = 'md', className = '', disabled = false,
}: PixelButtonProps) {
  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const variants = {
    primary:   'bg-fg text-white hover:bg-black',
    secondary: 'glass glass-hover text-fg',
    ghost:     'text-muted hover:text-fg',
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      getGameSounds().playClick();
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        rounded-full font-medium tracking-tight transition-colors btn-press
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
