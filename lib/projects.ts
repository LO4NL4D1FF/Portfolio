import { LucideIcon, Video, Globe, Smartphone, Bot, Palette, Clapperboard } from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  icon: string | LucideIcon;
  iconBg: string;
  logoBorderColor?: string;
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
    id: 'easysave',
    name: 'EasySave',
    icon: '/images/projects/easysave-logo.png',
    iconBg: 'from-green-500/20 to-emerald-500/20',
    logoBorderColor: 'border-green-600',
    category: 'app',
    mission: 'Personal Finance Assistant - Track savings and achieve financial goals with ease',
    problem: 'Personal finance tracking is tedious, lacks motivation, and fails to provide actionable weekly goal-setting frameworks.',
    overview: 'EasySave is a modern web application for tracking savings and achieving financial goals. Features user authentication with profile management, dashboard with savings tips and progress tracking, weekly goal setting and monitoring, motivational quotes, and admin panel for user management. Built with Next.js for server-side rendering and optimized performance.',
    stack: ['React', 'Next.js', 'Tailwind CSS', 'Next.js API Routes', 'Custom CSS'],
    insights: [
      'Weekly goal-setting framework drives consistent savings behavior vs monthly targets',
      'Profile avatars and motivational quotes increase user engagement and personalization',
      'Next.js API routes enable secure authentication without external auth providers',
      'Progress tracking dashboard with savings tips provides actionable financial insights',
      'Admin panel enables centralized user management and oversight',
      'Tailwind CSS with custom styling delivers modern, responsive UI with minimal overhead'
    ],
    images: ['/images/projects/easysave-logo.png'],
    github: {
      available: true,
      accessNote: 'Available on GitHub. MIT licensed open-source project.'
    }
  },
  {
    id: 'audify',
    name: 'Audify',
    icon: '/images/projects/audify-logo.png',
    iconBg: 'from-purple-500/20 to-purple-600/20',
    logoBorderColor: 'border-purple-500',
    category: 'app',
    mission: 'AI-Powered Music Streaming with Spotify DJ-inspired Experience',
    problem: 'Music streaming apps lack AI-powered personalization and fail to create an immersive, interactive listening experience with seamless playback.',
    overview: 'Audify is a beautiful Spotify-like music streaming app with AI DJ capabilities. It features a hybrid audio system combining Spotify metadata with YouTube playback for full songs, GPT-powered DJ commentary at playlist midpoints, and smart track matching. The app includes comprehensive library management, context-aware recommendations, and a premium dark UI with black, purple, and white theming.',
    stack: ['React Native', 'Expo', 'Spotify API', 'YouTube API', 'GPT-4', 'TypeScript'],
    insights: [
      'Hybrid Spotify + YouTube system ensures 100% track availability with smart matching',
      'AI DJ commentary at playlist midpoints creates personalized, radio-like experience',
      'Mini player with persistent controls increases session duration by maintaining context',
      'Spotify-style recommendation rows drive discovery without consuming AI tokens',
      'Premium black + purple UI with 60fps animations delivers professional streaming experience',
      'Multi-source search with fallback system prevents "track not found" scenarios'
    ],
    images: ['/images/projects/audify-logo.png'],
    github: {
      available: true,
      accessNote: 'Private repository. Access can be granted upon request for evaluation or collaboration.'
    }
  },
  {
    id: 'devmatch',
    name: 'DevMatch',
    icon: '/images/projects/devmatch-logo.png',
    iconBg: 'from-blue-500/20 to-indigo-500/20',
    logoBorderColor: 'border-blue-500',
    category: 'app',
    mission: 'Location-based networking app for developers to find collaborators, co-founders, and project partners',
    problem: 'Developers struggle to find local collaborators with compatible skills, shared interests, and matching intentions (co-founder vs freelance vs mentoring).',
    overview: 'DevMatch is a Tinder-style networking app for developers that combines location-based discovery with smart matching algorithms. Features include swipe deck with nearby developer cards, mutual matching with real-time chat, interactive map view, and authentication via email, Google, and GitHub. The smart algorithm matches based on skill overlap, intent compatibility (co-founder, freelance, mentoring), and proximity.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PostgreSQL', 'PostGIS', 'React Navigation', 'React Context API'],
    insights: [
      'Tinder-style swipe interface reduces friction in developer networking',
      'PostGIS-powered location matching enables discovery of nearby collaborators',
      'Multi-platform auth (Email, Google, GitHub) increases signup conversion',
      'Intent-based matching (co-founder, freelance, mentoring) prevents misaligned connections',
      'Skill overlap algorithm ensures technical compatibility before matching',
      'Real-time chat via Supabase Realtime drives immediate engagement after matches',
      'Map view provides spatial context for finding local developer communities'
    ],
    images: ['/images/projects/devmatch-logo.png'],
    github: {
      available: true,
      accessNote: 'Private repository. Access can be granted upon request for evaluation or collaboration.'
    }
  },
  {
    id: 'sharry',
    name: 'Sharry',
    icon: '/images/projects/sharry-logo.png',
    iconBg: 'from-green-500/20 to-emerald-500/20',
    logoBorderColor: 'border-green-700',
    category: 'app',
    mission: 'Multi-Device File Sharing App - Share files with 10+ devices simultaneously',
    problem: 'Traditional file sharing requires internet, compresses files, and struggles with multiple devices. Cloud services compromise privacy and quality.',
    overview: 'Sharry is a peer-to-peer file sharing application that enables users to share files between 10+ devices simultaneously using Wi-Fi hotspot technology. Works completely offline with no internet required, maintaining original file quality for 4K images and full resolution media. Features a clean, minimalistic interface with secure device approval and real-time transfer progress tracking.',
    stack: ['React Native', 'Expo SDK 50+', 'TypeScript', 'Zustand', 'Socket.io', 'Express.js', 'Expo File System'],
    insights: [
      'P2P Wi-Fi hotspot eliminates need for internet while supporting 10+ concurrent devices',
      'In-app Express.js HTTP server + Socket.io WebSockets enable real-time transfer tracking',
      'Original file quality preservation (4K images, full resolution media) unlike cloud services',
      'Secure device approval system prevents unauthorized access during offline sharing',
      'Local transfers via Wi-Fi provide faster speeds than internet-based solutions',
      'QR code connection streamlines device pairing without manual configuration'
    ],
    images: ['/images/projects/sharry-logo.png'],
    github: {
      available: true,
      accessNote: 'Private repository. Access can be granted upon request for evaluation or collaboration.'
    }
  },
  {
    id: 'notefy',
    name: 'Notefy',
    icon: '/images/projects/notefy-logo.png',
    iconBg: 'from-amber-700/20 to-stone-700/20',
    logoBorderColor: 'border-amber-800',
    category: 'app',
    mission: 'Fast, offline-capable Markdown notes vault built with vanilla JavaScript - no frameworks, no build tools',
    problem: 'Note-taking apps are bloated with frameworks, require build processes, lack offline support, and depend on cloud services that compromise privacy.',
    overview: 'Notefy is a lightweight, fast Markdown notes vault built entirely with vanilla JavaScript. Features tabbed interface for multi-note editing, live tag highlighting with inline hashtags, full-text search, cover images with drag-to-reposition, LocalStorage persistence, IndexedDB for efficient image storage, and complete offline support as a PWA. No frameworks, no dependencies to install—just open index.html and use.',
    stack: ['Vanilla JavaScript', 'HTML5', 'CSS3', 'Marked.js', 'DOMPurify', 'LocalStorage', 'IndexedDB', 'Service Workers', 'PWA'],
    insights: [
      'Zero-framework vanilla JS approach eliminates build complexity and reduces bundle size to ~50KB',
      'LocalStorage for metadata + IndexedDB for images provides efficient offline-first storage architecture',
      'PWA with Service Workers enables full offline capability and installable app experience',
      'Debounced 400ms autosave with 50-state undo stack balances UX and performance',
      'DOMPurify sanitization ensures XSS-safe user-generated Markdown content',
      'Live inline tag highlighting (#tag syntax) improves organization without separate tagging UI',
      'Export/import as JSON + individual .md/.txt enables portable backup without vendor lock-in',
      'Lazy-loading JSZip library on-demand optimizes initial load performance'
    ],
    images: ['/images/projects/notefy-logo.png'],
    github: {
      available: true,
      accessNote: 'Available on GitHub. Open-source project with full documentation.'
    }
  },
  {
    id: 'lsh',
    name: 'LSH - Liberia Smart Health',
    icon: '/images/projects/lsh-logo.png',
    iconBg: 'from-cyan-500/20 to-blue-500/20',
    logoBorderColor: 'border-cyan-500',
    category: 'app',
    mission: 'AI Health Companion for Liberia - Empowering communities with accessible, empathetic healthcare guidance',
    problem: 'Healthcare information is inaccessible in Liberia due to language barriers, limited internet, and lack of local medical resources for basic health concerns.',
    overview: 'LSH (Liberia Smart Health) is a conversational AI health companion designed specifically for Liberian communities. The app provides empathetic, safety-focused health guidance through voice and text interactions powered by GPT-4. Features include voice input via Whisper for low-literacy accessibility, text-to-speech responses for audio feedback, context-aware health conversations with memory, and culturally-sensitive responses tailored to Liberia. Built with Supabase for secure authentication and health data storage.',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Supabase', 'OpenAI GPT-4', 'Whisper API', 'Text-to-Speech API'],
    insights: [
      'Voice-first interface with Whisper API removes literacy barriers for rural communities',
      'GPT-4 with health-focused system prompts ensures empathetic, safety-aware responses',
      'Context-aware conversation memory enables continuity in multi-turn health consultations',
      'Text-to-speech feedback provides accessibility for users with low reading proficiency',
      'Supabase Auth + Database enables secure health data storage with user privacy',
      'shadcn/ui components deliver clean, accessible interface optimized for mobile-first usage',
      'App Router architecture with server components reduces client bundle for low-bandwidth users'
    ],
    images: ['/images/projects/lsh-logo.png'],
    github: {
      available: true,
      accessNote: 'Private repository. Access can be granted upon request for evaluation or collaboration.'
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
    pricing: 'From $350 (Organizations: Contact for quote)',
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
    pricing: 'From $800 (Organizations: Contact for quote)',
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
    description: 'Intelligent systems powered by GPT, Claude, and any AI model you need',
    pricing: 'From $400 (Organizations: Custom quote)',
    details: [
      'AI chatbot development',
      'Workflow automation',
      'Document processing & analysis',
      'Custom AI model integration (GPT, Claude, etc.)',
      'API design & development',
      'Training & documentation'
    ]
  },
  {
    id: 'ui-ux',
    name: 'UI / UX Design',
    icon: Palette,
    description: 'User-centered design focused on clarity and engagement',
    pricing: 'From $250 (Organizations: Contact for quote)',
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
    pricing: 'From $80/project (Organizations: Contact for quote)',
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
