'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy, Star, Eye, Mail, Clock, Gamepad2 } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  unlocked: boolean;
}

export default function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'explorer',
      title: 'EXPLORER',
      description: 'Viewed all main sections',
      icon: Gamepad2,
      color: 'pixel-lime',
      unlocked: false,
    },
    {
      id: 'project-viewer',
      title: 'PROJECT VIEWER',
      description: 'Opened a project detail',
      icon: Star,
      color: 'pixel-yellow',
      unlocked: false,
    },
    {
      id: 'time-traveler',
      title: 'TIME TRAVELER',
      description: 'Spent 5+ minutes here',
      icon: Clock,
      color: 'pixel-pink',
      unlocked: false,
    },
    {
      id: 'contact',
      title: 'COMMUNICATOR',
      description: 'Visited contact section',
      icon: Mail,
      color: 'pixel-indigo',
      unlocked: false,
    },
    {
      id: 'completionist',
      title: 'COMPLETIONIST',
      description: 'Unlocked all achievements',
      icon: Trophy,
      color: 'pixel-orange',
      unlocked: false,
    },
  ]);

  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);
  const [unlockedCount, setUnlockedCount] = useState(0);

  // Load achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-achievements');
    if (saved) {
      const savedAchievements = JSON.parse(saved);
      setAchievements(savedAchievements);
      const count = savedAchievements.filter((a: Achievement) => a.unlocked).length;
      setUnlockedCount(count);
    }
  }, []);

  // Save achievements to localStorage
  const saveAchievements = (newAchievements: Achievement[]) => {
    localStorage.setItem('portfolio-achievements', JSON.stringify(newAchievements));
    setAchievements(newAchievements);
    const count = newAchievements.filter(a => a.unlocked).length;
    setUnlockedCount(count);
  };

  // Unlock achievement function
  const unlockAchievement = (id: string) => {
    const newAchievements = achievements.map(achievement => {
      if (achievement.id === id && !achievement.unlocked) {
        setNewUnlock(achievement);
        setTimeout(() => setNewUnlock(null), 3000);
        return { ...achievement, unlocked: true };
      }
      return achievement;
    });

    // Check if completionist should be unlocked
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

  // Track time spent (5 minutes for time-traveler)
  useEffect(() => {
    const timer = setTimeout(() => {
      unlockAchievement('time-traveler');
    }, 300000); // 5 minutes

    return () => clearTimeout(timer);
  }, []);

  // Expose unlock function globally so other components can use it
  useEffect(() => {
    (window as any).unlockAchievement = unlockAchievement;
  }, [achievements]);

  return (
    <>
      {/* Achievement Counter - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-20 left-4 z-40 safe-area-bottom"
      >
        <div className="bg-pixel-black border-4 border-pixel-white p-3 shadow-pixel">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-pixel-yellow" strokeWidth={3} />
            <span className="font-game text-lg text-pixel-white">
              {unlockedCount}/{achievements.length}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Achievement Unlock Notification */}
      <AnimatePresence>
        {newUnlock && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 safe-area-top"
          >
            <div className="bg-gradient-to-r from-pixel-yellow to-pixel-orange border-4 border-pixel-white p-6 shadow-pixel-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-pixel-white border-4 border-pixel-black shadow-pixel flex items-center justify-center">
                  <newUnlock.icon className="w-10 h-10 text-pixel-black" strokeWidth={3} />
                </div>
                <div>
                  <p className="font-game text-sm text-pixel-black mb-1">
                    ACHIEVEMENT UNLOCKED!
                  </p>
                  <h3 className="font-game text-xl text-pixel-black leading-relaxed">
                    {newUnlock.title}
                  </h3>
                  <p className="font-pixel text-base text-pixel-black">
                    {newUnlock.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement List Modal (hidden, can be toggled) */}
      <div className="hidden">
        {achievements.map(achievement => (
          <div key={achievement.id}>
            {achievement.title}
          </div>
        ))}
      </div>
    </>
  );
}
