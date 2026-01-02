'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Code, Zap, Target, Lightbulb, Download } from 'lucide-react';

export default function AboutSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const characterStats = [
    { label: 'NAME', value: 'Loan Ladiff Sedo-Ta', color: 'pixel-yellow' },
    { label: 'ALIASES', value: 'Diff • Link • Mr. Badboi', color: 'pixel-cyan' },
    { label: 'AGE', value: '21', color: 'pixel-lime' },
    { label: 'NATIONALITY', value: 'Cameroonian', color: 'pixel-pink' },
    { label: 'CURRENT BASE', value: 'Monrovia, Liberia', color: 'pixel-indigo' },
    { label: 'ROLE', value: 'Software Engineer • Product Builder', color: 'pixel-orange' },
    { label: 'YEARS CODING', value: '3+ Years', color: 'pixel-red' },
    { label: 'VISION PATH', value: 'Founder / CEO Trajectory', color: 'pixel-purple' },
  ];

  const levels = [
    {
      level: 1,
      title: 'THE INITIATE',
      description: 'HTML, CSS discovered → First static pages → Understanding structure, color, balance',
      color: 'pixel-gray',
    },
    {
      level: 2,
      title: 'LOGIC UNLOCKED',
      description: 'C++, C#, Python → Console games → Student Record Management System → Control flow mastered',
      color: 'pixel-cyan',
    },
    {
      level: 3,
      title: 'INTERFACE CRAFTER',
      description: 'React enters → Personal portfolio → Component thinking → UI responsiveness obsession begins',
      color: 'pixel-lime',
    },
    {
      level: 4,
      title: 'SYSTEM BUILDER',
      description: 'Smart Save → Web + Desktop budgeting tool → Real users, real constraints → Backend matters',
      color: 'pixel-yellow',
    },
    {
      level: 5,
      title: 'THE ARCHITECT',
      description: 'Zenix/CORELM/Audify → AI-powered learning → Subscription logic, gamification → Founder mindset awakens',
      color: 'pixel-pink',
    },
    {
      level: 6,
      title: 'THE STRATEGIST',
      description: 'Current Level → Rebuilding backends → Optimizing AI cost vs power → Preparing for scale',
      color: 'pixel-purple',
      current: true,
    },
  ];

  const techStack = {
    primary: ['HTML/CSS', 'JavaScript', 'React', 'React Native', 'TypeScript', 'Next.js', 'C# WinForms', 'Supabase', 'Firebase', 'Gemini AI'],
    secondary: ['C++', 'Python', 'Java', 'SQL', 'Linux', 'Node.js'],
    tools: ['VS Code', 'Claude Code CLI', 'Windsurf', 'Expo', 'GitHub', 'CapCut', 'Adobe Premiere Pro'],
  };

  const education = [
    { title: 'BSc in Software Engineering', institution: 'BlueCrest University College, Liberia', status: 'In Progress - Mid 2026', icon: '🎓' },
    { title: 'WASSCE', institution: 'Science Major', status: 'Completed', icon: '📚' },
    { title: 'FSLC', institution: 'First School Leaving Certificate', status: 'Completed', icon: '✏️' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-pixel-black border-4 border-pixel-white p-6 shadow-pixel-lg"
        >
          <h1 className="font-game text-3xl md:text-5xl text-pixel-yellow text-center text-outline leading-relaxed">
            PLAYER PROFILE
          </h1>
        </motion.div>

        {/* Bio Story */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-game-panel to-pixel-blue border-4 border-pixel-white p-6 md:p-8 shadow-pixel"
        >
          <div className="border-2 border-pixel-gray p-4 md:p-6">
            <p className="font-pixel text-xl md:text-2xl text-pixel-white leading-relaxed mb-4">
              I am a builder in motion — a fast-learning software engineer shaped by curiosity, restraint, and ambition. I design not just applications, but systems: systems that teach, systems that save, systems that listen.
            </p>
            <p className="font-pixel text-xl md:text-2xl text-pixel-white leading-relaxed mb-4">
              My work lives at the intersection of education, AI, design, and human behavior. I am drawn to tools that simplify chaos, teach with joy, and scale quietly until they cannot be ignored.
            </p>
            <p className="font-pixel text-xl md:text-2xl text-pixel-cyan leading-relaxed">
              I learn by building. I grow by breaking things — then rebuilding them better.
            </p>
          </div>
        </motion.div>

        {/* Character Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characterStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={mounted ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-pixel-black border-4 border-pixel-white p-4 shadow-pixel"
            >
              <div className="flex justify-between items-center">
                <span className="font-game text-sm md:text-base text-pixel-light">
                  {stat.label}
                </span>
                <span className={`font-pixel text-lg md:text-xl text-${stat.color}`}>
                  {stat.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Career Timeline */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            className="bg-pixel-black border-4 border-pixel-white p-4 shadow-pixel mb-6"
          >
            <h2 className="font-game text-2xl md:text-3xl text-pixel-yellow text-center text-outline leading-relaxed">
              CAREER TIMELINE
            </h2>
          </motion.div>

          <div className="space-y-4">
            {levels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ x: -100, opacity: 0 }}
                animate={mounted ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`border-4 ${level.current ? 'border-pixel-yellow bg-gradient-to-r from-pixel-yellow/20 to-pixel-orange/20' : 'border-pixel-white bg-pixel-black'} p-4 md:p-6 shadow-pixel`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 bg-${level.color} border-4 border-pixel-white shadow-pixel flex items-center justify-center flex-shrink-0`}>
                    <span className="font-game text-2xl text-pixel-black">
                      {level.level}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-game text-xl md:text-2xl text-${level.color} mb-2 leading-relaxed`}>
                      {level.title}
                      {level.current && <span className="ml-3 text-pixel-yellow animate-blink">▶</span>}
                    </h3>
                    <p className="font-pixel text-lg text-pixel-white leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            className="bg-pixel-black border-4 border-pixel-white p-4 shadow-pixel mb-6"
          >
            <h2 className="font-game text-2xl md:text-3xl text-pixel-cyan text-center text-outline leading-relaxed">
              TECH INVENTORY
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Stack */}
            <div className="bg-gradient-to-b from-pixel-indigo to-pixel-sky border-4 border-pixel-white p-6 shadow-pixel">
              <h3 className="font-game text-xl text-pixel-yellow mb-4 text-center">PRIMARY</h3>
              <div className="flex flex-wrap gap-2">
                {techStack.primary.map((tech, i) => (
                  <motion.div
                    key={tech}
                    initial={{ scale: 0 }}
                    animate={mounted ? { scale: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="bg-pixel-white border-2 border-pixel-black px-3 py-1 shadow-pixel-sm"
                  >
                    <span className="font-pixel text-sm text-pixel-black">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Secondary Stack */}
            <div className="bg-gradient-to-b from-pixel-purple to-pixel-pink border-4 border-pixel-white p-6 shadow-pixel">
              <h3 className="font-game text-xl text-pixel-yellow mb-4 text-center">SECONDARY</h3>
              <div className="flex flex-wrap gap-2">
                {techStack.secondary.map((tech, i) => (
                  <motion.div
                    key={tech}
                    initial={{ scale: 0 }}
                    animate={mounted ? { scale: 1 } : {}}
                    transition={{ delay: 0.9 + i * 0.05 }}
                    className="bg-pixel-white border-2 border-pixel-black px-3 py-1 shadow-pixel-sm"
                  >
                    <span className="font-pixel text-sm text-pixel-black">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="bg-gradient-to-b from-pixel-lime to-pixel-green border-4 border-pixel-white p-6 shadow-pixel">
              <h3 className="font-game text-xl text-pixel-yellow mb-4 text-center">TOOLS</h3>
              <div className="flex flex-wrap gap-2">
                {techStack.tools.map((tool, i) => (
                  <motion.div
                    key={tool}
                    initial={{ scale: 0 }}
                    animate={mounted ? { scale: 1 } : {}}
                    transition={{ delay: 1.1 + i * 0.05 }}
                    className="bg-pixel-white border-2 border-pixel-black px-3 py-1 shadow-pixel-sm"
                  >
                    <span className="font-pixel text-sm text-pixel-black">{tool}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            className="bg-pixel-black border-4 border-pixel-white p-4 shadow-pixel mb-6"
          >
            <h2 className="font-game text-2xl md:text-3xl text-pixel-lime text-center text-outline leading-relaxed">
              ACHIEVEMENTS UNLOCKED
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {education.map((edu, index) => (
              <motion.div
                key={edu.title}
                initial={{ y: 50, opacity: 0 }}
                animate={mounted ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="bg-gradient-to-br from-pixel-yellow to-pixel-orange border-4 border-pixel-white p-6 shadow-pixel"
              >
                <div className="text-center mb-3">
                  <span className="text-5xl">{edu.icon}</span>
                </div>
                <h3 className="font-game text-lg text-pixel-black text-center mb-2 leading-relaxed">
                  {edu.title}
                </h3>
                <p className="font-pixel text-base text-pixel-black text-center mb-2">
                  {edu.institution}
                </p>
                <div className="bg-pixel-black border-2 border-pixel-white p-2 text-center">
                  <span className="font-game text-xs text-pixel-lime">{edu.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Request CV */}
        <motion.div
          initial={{ scale: 0 }}
          animate={mounted ? { scale: 1 } : {}}
          transition={{ delay: 1.6, type: 'spring' }}
          className="text-center"
        >
          <a
            href="mailto:difflad@gmail.com?subject=CV%20Request%20-%20Sedo-Ta%20Portfolio&body=Hi%20Sedo-Ta%2C%0A%0AI'd%20like%20to%20request%20your%20CV%2FResume.%0A%0AThank%20you!"
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-pixel-red to-pixel-pink border-4 border-pixel-white p-6 md:p-8 shadow-pixel-lg hover:shadow-pixel transition-all btn-press cursor-pointer">
              <div className="flex items-center gap-4 justify-center">
                <Download className="w-12 h-12 text-pixel-white" strokeWidth={3} />
                <div className="text-left">
                  <h3 className="font-game text-2xl md:text-3xl text-pixel-white text-outline leading-relaxed">
                    REQUEST CV
                  </h3>
                  <p className="font-pixel text-lg text-pixel-yellow">
                    Email me for my CV!
                  </p>
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
