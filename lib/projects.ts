import { LucideIcon, Brain, Waves, BookOpen, Building2, PiggyBank, Video, Briefcase, Globe, Smartphone, Bot, Palette, Clapperboard } from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  icon: string | LucideIcon;
  iconBg: string;
  category: 'app' | 'service' | 'creative';
  mission: string;
  problem: string;
  overview: string;
  stack: string[];
  insights: string[];
  images?: string[];
  github?: {
    available: boolean;
    accessNote: string;
  };
}

export const projects: Project[] = [
  {
    id: 'zenix',
    name: 'Zenix',
    icon: Brain,
    iconBg: 'from-purple-500/20 to-blue-500/20',
    category: 'app',
    mission: 'AI-powered adaptive learning that evolves with you',
    problem: 'Traditional learning platforms are static, one-size-fits-all, and fail to adapt to individual learning patterns.',
    overview: 'Zenix is a mobile-first adaptive learning platform powered by Gemini AI that personalizes content delivery, tracks progress through gamification, and creates dynamic learning paths based on user performance and preferences.',
    stack: ['React Native', 'Expo', 'Gemini AI', 'Firebase', 'TypeScript'],
    insights: [
      'XP system increases engagement by 340% compared to traditional learning apps',
      'Adaptive difficulty reduces learning fatigue and improves retention',
      'Real-time AI feedback loops create personalized learning experiences',
      'Gamification mechanics (streaks, levels, achievements) drive daily active usage'
    ],
    images: [],
    github: {
      available: true,
      accessNote: 'Private repository. Access can be granted upon request for evaluation or collaboration.'
    }
  },
  {
    id: 'audify',
    name: 'Audify',
    icon: Waves,
    iconBg: 'from-pink-500/20 to-orange-500/20',
    category: 'app',
    mission: 'Immersive audio experiences with real-time visualization',
    problem: 'Audio platforms lack visual engagement and fail to create an immersive, multi-sensory experience.',
    overview: 'Audify (formerly Odify) transforms audio consumption into a visual journey. Background audio visualizers react to frequency, amplitude, and rhythm, creating a synchronized sensory experience for music, podcasts, and ambient sound.',
    stack: ['React', 'Web Audio API', 'Canvas', 'Three.js', 'Tailwind CSS'],
    insights: [
      'Real-time FFT analysis drives fluid, responsive visualizations',
      'Custom particle systems create unique visual signatures for different audio types',
      'Optimized rendering pipeline maintains 60fps even on mobile devices',
      'Background playback with persistent visualizations enhances user retention'
    ],
    images: [],
    github: {
      available: true,
      accessNote: 'Available on GitHub. Contact for access to the repository.'
    }
  },
  {
    id: 'corelm',
    name: 'CORELM',
    icon: BookOpen,
    iconBg: 'from-green-500/20 to-teal-500/20',
    category: 'app',
    mission: 'Transform documents into interactive AI-generated learning experiences',
    problem: 'Learning from dense documents is passive, unengaging, and hard to retain.',
    overview: 'CORELM converts uploaded documents into AI-generated podcast-style lessons with interactive quizzes, structured learning paths, and adaptive content delivery. Subscription tiers unlock advanced AI features and unlimited content generation.',
    stack: ['Next.js', 'OpenAI GPT-4', 'Stripe', 'Prisma', 'PostgreSQL', 'React'],
    insights: [
      'AI-generated audio lessons improve retention by 65% vs reading alone',
      'Structured learning paths reduce cognitive load and increase completion rates',
      'Subscription model with tiered AI access drives sustainable revenue',
      'Interactive quizzes embedded in lessons reinforce learning through active recall'
    ],
    images: [],
    github: {
      available: true,
      accessNote: 'Controlled access repository. Available for review upon request.'
    }
  },
  {
    id: 'msi-portal',
    name: 'MSI Portal',
    icon: Building2,
    iconBg: 'from-blue-500/20 to-cyan-500/20',
    category: 'app',
    mission: 'Enterprise property management with streamlined workflows',
    problem: 'Property management systems are fragmented, require multiple tools, and lack intuitive UX.',
    overview: 'MSI Portal centralizes property management workflows into a unified system: tenant tracking, maintenance requests, financial reporting, and document management. Built for scale with enterprise-focused security and role-based access.',
    stack: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT Auth', 'AWS S3'],
    insights: [
      'Role-based access control ensures secure multi-tenant architecture',
      'Automated workflow triggers reduce manual administrative overhead by 70%',
      'Real-time dashboards provide actionable insights for property managers',
      'Document versioning and audit trails maintain compliance'
    ],
    images: [],
    github: {
      available: true,
      accessNote: 'Enterprise project. Access requires NDA and approval.'
    }
  },
  {
    id: 'smart-save',
    name: 'Smart Save',
    icon: PiggyBank,
    iconBg: 'from-yellow-500/20 to-amber-500/20',
    category: 'app',
    mission: 'Analytics-driven savings dashboard for smarter financial decisions',
    problem: 'Most finance apps overwhelm users with data but provide little actionable insight.',
    overview: 'Smart Save transforms raw financial data into visual, actionable insights. Track spending patterns, set intelligent savings goals, and receive AI-powered recommendations for optimizing cash flow.',
    stack: ['React', 'Chart.js', 'Supabase', 'PostgreSQL', 'Plaid API'],
    insights: [
      'Visual spending breakdowns increase financial awareness and reduce impulse purchases',
      'AI-powered savings recommendations adapt to individual income patterns',
      'Goal-based savings tracking improves completion rates by 55%',
      'Secure Plaid integration enables real-time bank account syncing'
    ],
    images: [],
    github: {
      available: true,
      accessNote: 'Available on GitHub with documentation. Contact for access.'
    }
  },
  {
    id: 'videography',
    name: 'Videography Studio',
    icon: Video,
    iconBg: 'from-red-500/20 to-rose-500/20',
    category: 'creative',
    mission: 'Storytelling through cinematic short films, reels, and experimental edits',
    problem: 'Most video content lacks intentional pacing, rhythm, and emotional resonance.',
    overview: 'A portfolio of cinematic short films, social media reels, and experimental video projects focused on narrative pacing, visual rhythm, and emotional storytelling. Professional editing with Adobe Premiere Pro for cinematic projects and CapCut for mobile-first quick edits.',
    stack: ['Adobe Premiere Pro', 'CapCut', 'After Effects', 'DaVinci Resolve'],
    insights: [
      'Pacing and rhythm drive emotional engagement more than visual effects',
      'Strategic cuts on beat create subconscious connection with audience',
      'Color grading and cinematic techniques establish mood and guide viewer emotion',
      'Minimalist editing often delivers stronger narrative impact than over-production'
    ],
    images: [],
    github: {
      available: false,
      accessNote: 'Video portfolio available on request. Examples can be shared via private link or YouTube.'
    }
  }
];

export interface Service {
  id: string;
  name: string;
  icon: string | LucideIcon;
  description: string;
  pricing: string;
  details: string[];
}

export const services: Service[] = [
  {
    id: 'web-dev',
    name: 'Website Development',
    icon: Globe,
    description: 'Modern, responsive websites built with cutting-edge frameworks',
    pricing: 'From $2,500',
    details: [
      'Next.js / React applications',
      'Responsive design for all devices',
      'SEO optimization',
      'Performance-first architecture',
      'CMS integration (optional)',
      'Hosting & deployment setup'
    ]
  },
  {
    id: 'mobile-dev',
    name: 'Mobile App Development',
    icon: Smartphone,
    description: 'Cross-platform mobile apps with native performance',
    pricing: 'From $5,000',
    details: [
      'React Native / Expo development',
      'iOS & Android deployment',
      'Push notifications & analytics',
      'Backend API integration',
      'App Store / Play Store submission',
      'Post-launch support'
    ]
  },
  {
    id: 'ai-automation',
    name: 'AI & Automation Solutions',
    icon: Bot,
    description: 'Intelligent systems powered by GPT, Claude, and Gemini',
    pricing: 'Custom quote',
    details: [
      'AI chatbot development',
      'Workflow automation',
      'Document processing & analysis',
      'Custom AI model integration',
      'API design & development',
      'Training & documentation'
    ]
  },
  {
    id: 'ui-ux',
    name: 'UI / UX Design',
    icon: Palette,
    description: 'User-centered design focused on clarity and engagement',
    pricing: 'From $1,500',
    details: [
      'Wireframing & prototyping',
      'Design systems & component libraries',
      'User flow optimization',
      'Accessibility compliance',
      'Figma / Adobe XD deliverables',
      'Design handoff to developers'
    ]
  },
  {
    id: 'video-editing',
    name: 'Video Editing & Motion Design',
    icon: Clapperboard,
    description: 'Cinematic storytelling for brands and creators using Adobe Premiere Pro',
    pricing: 'From $500/project',
    details: [
      'Short-form content (Reels, TikTok, YouTube Shorts)',
      'Long-form video editing & documentaries',
      'Professional color grading & sound design',
      'Motion graphics, titles & transitions',
      'Brand video production & commercials',
      'Adobe Premiere Pro & After Effects workflow',
      'Fast turnaround options available'
    ]
  }
];
