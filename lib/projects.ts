export type ProjectCategory = 'app' | 'service' | 'creative';

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  tagline: string;
  summary: string;
  stack: string[];
  highlights: string[];
  logo?: string;
  accent: string;
  source: {
    public: boolean;
    note: string;
  };
}

export const projects: Project[] = [
  {
    id: 'easysave',
    name: 'EasySave',
    category: 'app',
    tagline: 'Personal finance assistant for weekly savings goals.',
    summary:
      'A focused web app for tracking savings, setting weekly goals, and following progress with a clean dashboard. Includes user profiles, motivational prompts, and an admin panel for oversight.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'API Routes'],
    highlights: [
      'Weekly goal framework that beats vague monthly targets in practice',
      'Profile and progress dashboard built around clarity, not novelty',
      'Self-hosted auth via Next.js API routes, no third-party lock-in',
    ],
    logo: '/images/projects/easysave-logo.png',
    accent: 'from-emerald-400/20 via-emerald-500/10 to-transparent',
    source: { public: true, note: 'Open source on GitHub.' },
  },
  {
    id: 'audify',
    name: 'Audify',
    category: 'app',
    tagline: 'AI-assisted music streaming with a DJ-style listening flow.',
    summary:
      'A streaming experience that blends Spotify metadata with YouTube playback for full-song coverage, then layers AI commentary at playlist midpoints for a radio-like feel.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Spotify API', 'YouTube API', 'GPT'],
    highlights: [
      'Hybrid source matching keeps tracks playable when one provider fails',
      'Persistent mini player keeps context across the app',
      'Sixty-frame animations and a quiet, considered dark UI',
    ],
    logo: '/images/projects/audify-logo.png',
    accent: 'from-violet-400/20 via-violet-500/10 to-transparent',
    source: { public: false, note: 'Private repo, access on request.' },
  },
  {
    id: 'devmatch',
    name: 'DevMatch',
    category: 'app',
    tagline: 'Location-aware networking for developers.',
    summary:
      'A swipe-style discovery app pairing developers based on intent, skill overlap, and proximity. Built for finding co-founders, freelance partners, and mentors.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PostgreSQL', 'PostGIS'],
    highlights: [
      'Intent matching prevents misaligned connections from the start',
      'PostGIS-driven proximity for real local discovery',
      'Realtime chat triggered the moment a match lands',
    ],
    logo: '/images/projects/devmatch-logo.png',
    accent: 'from-sky-400/20 via-indigo-500/10 to-transparent',
    source: { public: false, note: 'Private repo, access on request.' },
  },
  {
    id: 'sharry',
    name: 'Sharry',
    category: 'app',
    tagline: 'Offline file sharing across many devices at once.',
    summary:
      'A peer-to-peer file sharing app using Wi-Fi hotspot transport. Works fully offline, supports ten or more devices in one session, and preserves original file quality.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'Socket.io', 'Express'],
    highlights: [
      'In-app HTTP server and websockets for live transfer state',
      'Original quality kept for 4K images and full resolution media',
      'QR pairing and explicit device approval for safe sessions',
    ],
    logo: '/images/projects/sharry-logo.png',
    accent: 'from-teal-400/20 via-emerald-500/10 to-transparent',
    source: { public: false, note: 'Private repo, access on request.' },
  },
  {
    id: 'notefy',
    name: 'Notefy',
    category: 'app',
    tagline: 'A fast, offline Markdown vault with no build step.',
    summary:
      'A lightweight notes app written in vanilla JavaScript. Tabbed editor, live tag highlighting, full-text search, cover images, and complete offline support as a PWA.',
    stack: ['Vanilla JS', 'HTML5', 'CSS3', 'IndexedDB', 'Service Workers', 'PWA'],
    highlights: [
      'No framework, no bundler, around fifty kilobytes shipped',
      'LocalStorage for metadata, IndexedDB for image-heavy notes',
      'Sanitized Markdown, debounced autosave, fifty-step undo',
    ],
    logo: '/images/projects/notefy-logo.png',
    accent: 'from-amber-400/20 via-orange-500/10 to-transparent',
    source: { public: true, note: 'Open source on GitHub.' },
  },
  {
    id: 'lsh',
    name: 'Liberia Smart Health',
    category: 'app',
    tagline: 'A voice-first AI health companion for Liberian communities.',
    summary:
      'A conversational health assistant tailored for Liberia. Voice input via Whisper, text-to-speech responses, and a system prompt tuned for empathetic, safety-aware guidance.',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind', 'shadcn/ui', 'Supabase', 'GPT-4', 'Whisper'],
    highlights: [
      'Voice-first design lowers the literacy barrier for rural users',
      'Conversation memory enables real continuity across sessions',
      'Mobile-first UI tuned for low-bandwidth conditions',
    ],
    logo: '/images/projects/lsh-logo.png',
    accent: 'from-cyan-400/20 via-sky-500/10 to-transparent',
    source: { public: false, note: 'Private repo, access on request.' },
  },
  {
    id: 'videography',
    name: 'Videography Studio',
    category: 'creative',
    tagline: 'Cinematic short films, reels, and experimental edits.',
    summary:
      'A separate creative practice. I edit short-form and long-form video with a focus on pacing, rhythm, and emotional restraint. Premiere Pro for cinematic work, CapCut for fast mobile cuts.',
    stack: ['Adobe Premiere Pro', 'After Effects', 'CapCut', 'DaVinci Resolve'],
    highlights: [
      'Pacing carries the emotion, effects only support it',
      'Cuts on beat for subconscious rhythm with the viewer',
      'Color and sound design tuned to mood, not trend',
    ],
    accent: 'from-rose-400/20 via-orange-500/10 to-transparent',
    source: { public: false, note: 'Reels and full pieces shared on request.' },
  },
];

export interface Service {
  id: string;
  name: string;
  description: string;
  pricing: string;
  details: string[];
}

export const services: Service[] = [
  {
    id: 'web-dev',
    name: 'Website Development',
    description: 'Modern, responsive sites with attention to performance and detail.',
    pricing: 'From $450',
    details: [
      'Next.js or React, depending on the brief',
      'Responsive across phone, tablet, and desktop',
      'On-page SEO and meta setup',
      'CMS integration on request',
      'Deployment to Vercel or your provider of choice',
    ],
  },
  {
    id: 'mobile-dev',
    name: 'Mobile App Development',
    description: 'Cross-platform apps with React Native and Expo.',
    pricing: 'From $1,200',
    details: [
      'iOS and Android from a single codebase',
      'Authentication, push notifications, analytics',
      'Backend integration or Supabase setup',
      'App Store and Play Store submission support',
    ],
  },
  {
    id: 'frontend-engineering',
    name: 'Frontend Engineering',
    description: 'Component work, refactors, and interface engineering inside your existing product.',
    pricing: 'From $35/hour',
    details: [
      'Feature work in React or Next.js codebases',
      'Design-system contributions and refactors',
      'Accessibility and performance passes',
      'Code review and pairing on request',
    ],
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    description: 'Practical AI features wired into real products, not demos.',
    pricing: 'From $600',
    details: [
      'Chat, summarization, and search features',
      'GPT and Claude integration with sane prompts',
      'Cost-aware streaming, caching, and rate limits',
      'Clear handoff with documentation',
    ],
  },
  {
    id: 'ui-ux',
    name: 'UI / UX Design',
    description: 'Interfaces designed for clarity first, novelty second.',
    pricing: 'From $300',
    details: [
      'Wireframes and prototypes in Figma',
      'Component-level design systems',
      'User flow review and simplification',
      'Developer-ready handoff',
    ],
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    description: 'Cinematic edits, reels, and brand pieces in Premiere Pro and CapCut.',
    pricing: 'From $90 per project',
    details: [
      'Short-form for Reels, TikTok, and Shorts',
      'Long-form edits and documentary work',
      'Color grading and sound design',
      'Titles, transitions, and motion accents',
    ],
  },
];
