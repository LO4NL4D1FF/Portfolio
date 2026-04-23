'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StartScreen from '@/components/StartScreen';
import MainMenu from '@/components/MainMenu';
import PixelArtContainer from '@/components/PixelArtContainer';
import ParallaxBackground from '@/components/ParallaxBackground';
import ProjectsGrid from '@/components/ProjectsGrid';
import ServicesMenu from '@/components/ServicesMenu';
import SkillsBar from '@/components/SkillsBar';
import ContactSection from '@/components/ContactSection';
import PixelDialogBox from '@/components/PixelDialogBox';
import ProjectDetailView from '@/components/ProjectDetailView';
import NavigationBar from '@/components/NavigationBar';
import SoundToggle from '@/components/SoundToggle';
import AboutSection from '@/components/AboutSection';
import AchievementSystem from '@/components/AchievementSystem';
import { Project, projects, services } from '@/lib/projects';
import { RotateCcw } from 'lucide-react';
import { getGameSounds } from '@/lib/sounds';

type Screen = 'start' | 'menu' | 'about' | 'projects' | 'services' | 'skills' | 'contact';

interface CustomWindow extends Window {
  unlockAchievement?: (id: string) => void;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleStart = () => {
    setCurrentScreen('menu');
  };

  const handleMenuSelect = (menu: Screen) => {
    setCurrentScreen(menu);
  };

  const handleBack = () => {
    setSelectedProject(null);
    setCurrentScreen('menu');
  };

  const handleHome = () => {
    setSelectedProject(null);
    setCurrentScreen('menu');
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleRestart = () => {
    const sounds = getGameSounds();
    sounds.playClose();
    setTimeout(() => {
      setSelectedProject(null);
      setCurrentScreen('start');
    }, 100);
  };

  // Track section visits and unlock achievements
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as unknown as CustomWindow).unlockAchievement) {
      // Track all viewed sections
      const viewedSections = JSON.parse(localStorage.getItem('viewed-sections') || '[]');

      if (currentScreen === 'projects' || currentScreen === 'services' || currentScreen === 'skills' || currentScreen === 'contact' || currentScreen === 'about') {
        if (!viewedSections.includes(currentScreen)) {
          viewedSections.push(currentScreen);
          localStorage.setItem('viewed-sections', JSON.stringify(viewedSections));
        }

        // Unlock explorer achievement if all 5 sections visited
        if (viewedSections.length >= 5) {
          (window as unknown as CustomWindow).unlockAchievement?.('explorer');
        }

        // Unlock contact achievement when visiting contact
        if (currentScreen === 'contact') {
          (window as unknown as CustomWindow).unlockAchievement?.('contact');
        }
      }
    }
  }, [currentScreen]);

  // Unlock project viewer achievement when opening a project
  useEffect(() => {
    if (selectedProject && typeof window !== 'undefined' && (window as unknown as CustomWindow).unlockAchievement) {
      (window as unknown as CustomWindow).unlockAchievement?.('project-viewer');
    }
  }, [selectedProject]);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'about':
        return 'About';
      case 'projects':
        return 'Projects';
      case 'services':
        return 'Services';
      case 'skills':
        return 'Skills';
      case 'contact':
        return 'Contact';
      default:
        return 'Portfolio';
    }
  };

  return (
    <PixelArtContainer showCRT={true}>
      <ParallaxBackground />

      {/* Sound Toggle */}
      <SoundToggle />

      {/* Achievement System */}
      <AchievementSystem />

      {/* Restart Button - show when not on start screen */}
      {currentScreen !== 'start' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleRestart}
          className="fixed bottom-4 left-4 z-50 w-10 h-10 rounded-full glass glass-hover flex items-center justify-center text-fg safe-area-bottom btn-press"
          title="Return to start"
          aria-label="Restart"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {currentScreen === 'start' && (
          <StartScreen key="start" onStart={handleStart} />
        )}

        {currentScreen === 'menu' && (
          <div key="menu" className="relative z-10">
            <MainMenu onMenuSelect={handleMenuSelect} />
          </div>
        )}

        {currentScreen === 'about' && (
          <div key="about" className="relative z-10">
            <NavigationBar
              onBack={handleBack}
              onHome={handleHome}
              title={getScreenTitle()}
            />
            <div className="pt-24">
              <AboutSection />
            </div>
          </div>
        )}

        {currentScreen === 'projects' && (
          <div key="projects" className="relative z-10">
            <NavigationBar
              onBack={handleBack}
              onHome={handleHome}
              title={getScreenTitle()}
            />
            <div className="pt-24">
              <ProjectsGrid projects={projects} onProjectClick={handleProjectClick} />
            </div>
          </div>
        )}

        {currentScreen === 'services' && (
          <div key="services" className="relative z-10">
            <NavigationBar
              onBack={handleBack}
              onHome={handleHome}
              title={getScreenTitle()}
            />
            <div className="pt-24">
              <ServicesMenu services={services} />
            </div>
          </div>
        )}

        {currentScreen === 'skills' && (
          <div key="skills" className="relative z-10">
            <NavigationBar
              onBack={handleBack}
              onHome={handleHome}
              title={getScreenTitle()}
            />
            <div className="pt-24">
              <SkillsBar />
            </div>
          </div>
        )}

        {currentScreen === 'contact' && (
          <div key="contact" className="relative z-10">
            <NavigationBar
              onBack={handleBack}
              onHome={handleHome}
              title={getScreenTitle()}
            />
            <div className="pt-24">
              <ContactSection />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Detail Dialog */}
      <PixelDialogBox
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name || ''}
        showArrow={true}
      >
        {selectedProject && <ProjectDetailView project={selectedProject} />}
      </PixelDialogBox>
    </PixelArtContainer>
  );
}
