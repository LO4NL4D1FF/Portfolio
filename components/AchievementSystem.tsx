'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy, Star, Mail, Clock, Gamepad2 } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  unlocked: boolean;
}

const initialAchievements: Achievement[] = [
  {
    id: 'explorer',
    title: 'STREET SCANNER',
    description: 'Breached all main subsystems',
    icon: Gamepad2,
    color: 'neon-cyan',
    unlocked: false,
  },
  {
    id: 'project-viewer',
    title: 'FIRST GIG',
    description: 'Cracked open a contract brief',
    icon: Star,
    color: 'neon-yellow',
    unlocked: false,
  },
  {
    id: 'time-traveler',
    title: 'TIME JUMPER',
    description: 'Ran the net for 5+ minutes',
    icon: Clock,
    color: 'neon-magenta',
    unlocked: false,
  },
  {
    id: 'contact',
    title: 'FIXER CONTACT',
    description: 'Opened the uplink channel',
    icon: Mail,
    color: 'neon-cyan',
    unlocked: false,
  },
  {
    id: 'completionist',
    title: 'LEGEND OF NIGHT CITY',
    description: 'Unlocked every data shard',
    icon: Trophy,
    color: 'neon-yellow',
    unlocked: false,
  },
];

export default function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-achievements');
    if (saved) {
      const savedAchievements = JSON.parse(saved) as Array<{ id: string; unlocked: boolean }>;
      const restoredAchievements = initialAchievements.map(initial => {
        const s = savedAchievements.find((x) => x.id === initial.id);
        return {
          ...initial,
          unlocked: s?.unlocked || false,
        };
      });
      setAchievements(restoredAchievements);
      const count = restoredAchievements.filter(a => a.unlocked).length;
      setUnlockedCount(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAchievements = (newAchievements: Achievement[]) => {
    const toSave = newAchievements.map(({ id, unlocked }) => ({ id, unlocked }));
    localStorage.setItem('portfolio-achievements', JSON.stringify(toSave));
    setAchievements(newAchievements);
    const count = newAchievements.filter(a => a.unlocked).length;
    setUnlockedCount(count);
  };

  const unlockAchievement = (id: string) => {
    const newAchievements = achievements.map(achievement => {
      if (achievement.id === id && !achievement.unlocked) {
        setNewUnlock(achievement);
        setTimeout(() => setNewUnlock(null), 3000);
        return { ...achievement, unlocked: true };
      }
      return achievement;
    });

    const unlockedCount = newAchievements.filter(a => a.unlocked && a.id !== 'completionist').length;
    if (unlockedCount === achievements.length - 1) {
      const completionist = newAchievements.find(a => a.id === 'completionist');
      if (completionist && !completionist.unlocked) {
        setTimeout(() => {
          const finalAchievements = newAchievements.map(a =>
            a.id === 'completionist' ? { ...a, unlocked: true } : a
          );
          saveAchievements(finalAchievements);
          setNewUnlock(completionist);
          setTimeout(() => setNewUnlock(null), 3000);
        }, 3500);
      }
    }

    saveAchievements(newAchievements);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      unlockAchievement('time-traveler');
    }, 300000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (window as unknown as { unlockAchievement: (id: string) => void }).unlockAchievement = unlockAchievement;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievements]);

  return (
    <>
      {/* HUD counter */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-20 left-4 z-40 safe-area-bottom"
      >
        <div
          className="relative bg-cyber-dark border border-neon-yellow px-3 py-2"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            boxShadow: '0 0 10px rgba(252,238,10,0.4)',
          }}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-neon-yellow" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 4px #fcee0a)' }} />
            <span className="font-mono text-sm tracking-widest text-neon-yellow">
              {unlockedCount}/{achievements.length}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Unlock notification */}
      <AnimatePresence>
        {newUnlock && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 safe-area-top w-full max-w-sm px-4"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-neon-yellow opacity-40 blur-lg" />
              <div
                className="relative bg-cyber-dark border-2 border-neon-yellow p-4"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                  boxShadow: '0 0 24px #fcee0a',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 bg-cyber-void border-2 border-neon-yellow flex items-center justify-center flex-shrink-0"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                      boxShadow: 'inset 0 0 8px rgba(252,238,10,0.3)',
                    }}
                  >
                    {(() => {
                      const IconComponent = newUnlock.icon as React.ElementType;
                      return <IconComponent className="w-8 h-8 text-neon-yellow" strokeWidth={2} />;
                    })()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-widest text-neon-cyan">
                      [ DATA SHARD UNLOCKED ]
                    </p>
                    <h3 className="font-cyber font-black text-base md:text-lg tracking-widest text-neon-yellow truncate" style={{ textShadow: '0 0 6px #fcee0a' }}>
                      {newUnlock.title}
                    </h3>
                    <p className="font-hud text-xs md:text-sm text-cyber-bone">
                      {newUnlock.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
