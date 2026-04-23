'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy, Star, Mail, Clock, Circle } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
}

const initial: Achievement[] = [
  { id: 'explorer',       title: 'Explorer',       description: 'Viewed every section',   icon: Circle, unlocked: false },
  { id: 'project-viewer', title: 'Reader',         description: 'Opened a project brief', icon: Star,   unlocked: false },
  { id: 'time-traveler',  title: 'Long Visit',     description: 'Spent 5+ minutes',       icon: Clock,  unlocked: false },
  { id: 'contact',        title: 'Outreach',       description: 'Visited contact',        icon: Mail,   unlocked: false },
  { id: 'completionist',  title: 'Completionist',  description: 'Unlocked everything',    icon: Trophy, unlocked: false },
];

export default function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>(initial);
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-achievements');
    if (saved) {
      const parsed = JSON.parse(saved) as Array<{ id: string; unlocked: boolean }>;
      const restored = initial.map((a) => ({
        ...a,
        unlocked: parsed.find((p) => p.id === a.id)?.unlocked || false,
      }));
      setAchievements(restored);
      setCount(restored.filter((a) => a.unlocked).length);
    }
  }, []);

  const save = (list: Achievement[]) => {
    localStorage.setItem(
      'portfolio-achievements',
      JSON.stringify(list.map(({ id, unlocked }) => ({ id, unlocked })))
    );
    setAchievements(list);
    setCount(list.filter((a) => a.unlocked).length);
  };

  const unlock = (id: string) => {
    const next = achievements.map((a) => {
      if (a.id === id && !a.unlocked) {
        setNewUnlock(a);
        setTimeout(() => setNewUnlock(null), 2600);
        return { ...a, unlocked: true };
      }
      return a;
    });

    const others = next.filter((a) => a.unlocked && a.id !== 'completionist').length;
    if (others === initial.length - 1) {
      const c = next.find((a) => a.id === 'completionist');
      if (c && !c.unlocked) {
        setTimeout(() => {
          const final = next.map((a) => (a.id === 'completionist' ? { ...a, unlocked: true } : a));
          save(final);
          setNewUnlock(c);
          setTimeout(() => setNewUnlock(null), 2600);
        }, 2800);
      }
    }
    save(next);
  };

  useEffect(() => {
    const t = setTimeout(() => unlock('time-traveler'), 300000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (window as unknown as { unlockAchievement: (id: string) => void }).unlockAchievement = unlock;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievements]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="fixed bottom-16 left-4 z-30 safe-area-bottom"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
          <Trophy className="w-3.5 h-3.5 text-fg" strokeWidth={1.75} />
          <span className="text-xs text-fg font-medium tabular-nums">
            {count}/{achievements.length}
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {newUnlock && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4 safe-area-top"
          >
            <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-3">
              {(() => {
                const Icon = newUnlock.icon as React.ElementType;
                return (
                  <div className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-fg" strokeWidth={1.75} />
                  </div>
                );
              })()}
              <div className="min-w-0">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
                  Unlocked
                </p>
                <p className="text-sm text-fg font-semibold truncate">
                  {newUnlock.title}
                </p>
                <p className="text-xs text-muted truncate">
                  {newUnlock.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
