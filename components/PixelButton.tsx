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
    primary: 'from-pixel-indigo to-pixel-sky border-pixel-cyan',
    secondary: 'from-pixel-gray to-pixel-light border-pixel-white',
    success: 'from-pixel-green to-pixel-lime border-pixel-lime',
    danger: 'from-pixel-red to-pixel-orange border-pixel-pink',
  };

  const sizes = {
    sm: 'px-4 py-2 text-lg font-pixel',
    md: 'px-6 py-3 text-xl font-pixel',
    lg: 'px-8 py-4 text-2xl font-game',
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
        bg-gradient-to-b ${variants[variant]}
        ${sizes[size]}
        border-4
        shadow-pixel
        hover:shadow-pixel-sm
        transition-all duration-100
        btn-press
        no-select
        text-pixel-white
        text-outline
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
}
