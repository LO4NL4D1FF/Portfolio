'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { getGameSounds } from '@/lib/sounds';

interface PixelButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
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
  const variants = {
    primary: 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow',
    secondary: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan',
    success: 'border-neon-green text-neon-green hover:bg-neon-green',
    danger: 'border-neon-magenta text-neon-magenta hover:bg-neon-magenta',
  };

  const glow = {
    primary: '0 0 12px rgba(252,238,10,0.5)',
    secondary: '0 0 12px rgba(0,240,255,0.5)',
    success: '0 0 12px rgba(57,255,20,0.5)',
    danger: '0 0 12px rgba(255,0,60,0.5)',
  } as const;

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      const sounds = getGameSounds();
      sounds.playClick();
      onClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative
        bg-cyber-dark
        border-2
        font-cyber font-bold tracking-widest
        hover:text-cyber-void
        transition-all duration-200
        btn-press no-select
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        boxShadow: glow[variant],
        textShadow: '0 0 4px currentColor',
      }}
      whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
    >
      {children}
    </motion.button>
  );
}
