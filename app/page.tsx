'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

import Background from '@/components/Background';
import StartScreen from '@/components/StartScreen';
import MainMenu from '@/components/MainMenu';
import NavigationBar from '@/components/NavigationBar';
import AboutSection from '@/components/AboutSection';
import ProjectsGrid from '@/components/ProjectsGrid';
import ServicesMenu from '@/components/ServicesMenu';
import SkillsBar from '@/components/SkillsBar';
import ContactSection from '@/components/ContactSection';
import Dialog from '@/components/Dialog';
import ProjectDetailView from '@/components/ProjectDetailView';

import { Project, projects, services } from '@/lib/projects';
import type { ScreenId } from '@/components/types';

type Screen = 'start' | 'menu' | ScreenId;

const TITLES: Record<Screen, string> = {
  start:    'Portfolio',
  menu:     'Portfolio',
  about:    'About',
  projects: 'Projects',
  services: 'Services',
  skills:   'Skills',
  contact:  'Contact',
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>('start');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleBack    = () => { setSelectedProject(null); setScreen('menu'); };
  const handleHome    = () => { setSelectedProject(null); setScreen('menu'); };
  const handleRestart = () => { setSelectedProject(null); setScreen('start'); };

  const renderSection = () => {
    switch (screen) {
      case 'about':    return <AboutSection />;
      case 'projects': return <ProjectsGrid projects={projects} onProjectClick={setSelectedProject} />;
      case 'services': return <ServicesMenu services={services} />;
      case 'skills':   return <SkillsBar />;
      case 'contact':  return <ContactSection />;
      default:         return null;
    }
  };

  return (
    <main className="relative w-full min-h-screen">
      <Background />

      {/* Restart pill */}
      {screen !== 'start' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleRestart}
          aria-label="Restart"
          className="btn-press lg-pill fixed bottom-4 left-4 z-50 w-10 h-10 rounded-full flex items-center justify-center text-fg safe-area-bottom"
        >
          <RotateCcw className="w-4 h-4 relative z-10" strokeWidth={2} />
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {screen === 'start' && <StartScreen key="start" onStart={() => setScreen('menu')} />}

        {screen === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <MainMenu onMenuSelect={(id) => setScreen(id)} />
          </motion.div>
        )}

        {screen !== 'start' && screen !== 'menu' && (
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-10"
          >
            <NavigationBar onBack={handleBack} onHome={handleHome} title={TITLES[screen]} />
            <div className="pt-24">
              {renderSection()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name || ''}
      >
        {selectedProject && <ProjectDetailView project={selectedProject} />}
      </Dialog>
    </main>
  );
}
