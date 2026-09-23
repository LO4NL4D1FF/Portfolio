/**
 * live: the real app running in an iframe (static builds only).
 * screens: real screenshots captured from the running apps, shown in device frames.
 */
export type Demo =
  | { kind: 'live'; url: string }
  | { kind: 'screens'; phone?: string[]; desktop?: string[] };

export interface Project {
  id: string;
  name: string;
  /** Label under the dock icon; defaults to name. */
  short?: string;
  year: string;
  kind: string;
  summary: string;
  stack: string[];
  details?: string[];
  logo?: string;
  /** Tile color behind a transparent logo; defaults to white. */
  logoBg?: string;
  repo?: string;
  status?: string;
  /** What opens when someone asks to see the project. */
  demo?: Demo;
  /** Brand colors for the featured card. */
  brand?: { bg: string; accent: string };
}

/** Large rows at the top of the work section. */
export const featured: Project[] = [
  {
    id: 'karrio',
    demo: { kind: 'screens', desktop: ['/images/screens/karrio-desk.jpg'], phone: ['/images/screens/karrio-1.jpg'] },
    name: 'Karrio',
    year: '2026',
    kind: 'Delivery platform',
    status: 'Heading to launch',
    summary:
      'A multi-vendor delivery app for Monrovia covering restaurants and supermarkets. Four apps share one Supabase backend: customer and driver apps in Expo, plus web apps for vendors and admins. It started as my thesis and is now being prepared for real customers.',
    stack: ['React Native', 'Expo', 'Supabase', 'PostgreSQL', 'PWA'],
    details: [
      'Customer, vendor, driver and admin apps with their own roles and permissions on one database',
      'Order and vendor flows designed as state machines before any screen was drawn',
      'Payments built against test mode first, with mobile money support planned for launch',
    ],
    logo: '/images/projects/karrio-logo.png',
    brand: { bg: '#041A2F', accent: '#FE5500' },
  },
  {
    id: 'gamefy',
    demo: { kind: 'screens', desktop: ['/images/screens/gamefy-desk.jpg'], phone: ['/images/screens/gamefy-1.jpg'] },
    name: 'Gamefy',
    year: '2026',
    kind: 'Multiplayer web games',
    status: 'In progress',
    summary:
      'Two TV quiz formats rebuilt as browser games for one to six players in the same room. Staff manage questions from an admin studio, target them at different audiences, and each player reads the same question in their own language.',
    stack: ['Angular', 'NestJS', 'Colyseus', 'TypeScript', 'Zod'],
    details: [
      'Authoritative game server so every screen in a room stays in step',
      'Shared game rules and message protocol live in their own packages, tested first',
      'Translations are linked per question and layouts are ready for right-to-left scripts',
    ],
    logo: '/images/projects/gamefy-logo.png',
    brand: { bg: '#1C1410', accent: '#E0A93B' },
  },
  {
    id: 'audify',
    name: 'Audify',
    year: '2025',
    kind: 'Music streaming app',
    summary:
      'A streaming app that pairs Spotify metadata with YouTube playback so full songs stay available, then drops short AI DJ commentary into a playlist to make it feel like radio.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'Spotify API', 'OpenAI'],
    details: [
      'Track matching across sources, with a fallback when one provider has nothing',
      'A mini player that keeps playing and keeps its place as you move around',
      '“Because you listened to” rows that recommend without spending AI tokens',
    ],
    logo: '/images/projects/audify-logo.png',
    brand: { bg: '#0B0710', accent: '#9B5CF6' },
  },
];

/** Compact list below the featured rows. */
export const others: Project[] = [
  {
    id: 'lsh',
    demo: { kind: 'screens', desktop: ['/images/screens/lsh-desk.jpg'], phone: ['/images/screens/lsh-1.jpg'] },
    name: 'Liberia Smart Health',
    short: 'LSH',
    year: '2026',
    kind: 'AI health assistant',
    summary:
      'A health companion you can speak to. Whisper handles voice input, answers are read back aloud, and the prompts are tuned for careful, safety-first guidance.',
    stack: ['Next.js', 'Supabase', 'OpenAI', 'Whisper'],
    logo: '/images/projects/lsh-logo.png',
  },
  {
    id: 'dollar-na-hand',
    name: 'Dollar & Crypto Na Hand',
    short: 'Na Hand',
    year: '2026',
    kind: 'Exchange rate app',
    summary:
      'USD, USDT, BTC and ETH to Liberian dollars at a glance. Tap a rate to convert. Cached rates keep it useful when the connection drops.',
    stack: ['React Native', 'Expo', 'CoinGecko API'],
    logo: '/images/projects/dollarnahand-logo.png',
  },
  {
    id: 'hawkeye',
    name: 'HawkEye',
    year: '2026',
    kind: 'Activity monitoring',
    summary:
      'A browser extension and admin dashboard that give schools and companies a live view of device activity, with privacy limits built in.',
    stack: ['Chrome extension', 'React', 'Vite', 'Supabase Realtime'],
    logo: '/images/projects/hawkeye-logo.svg',
  },
  {
    id: 'securecam',
    name: 'SecureCam AI',
    year: '2026',
    kind: 'Security camera system',
    summary:
      'Watches USB and IP cameras, detects people with YOLOv8, asks a vision model when it is unsure, and sends alerts to a phone.',
    stack: ['Python', 'FastAPI', 'YOLOv8', 'WebSockets'],
    logo: '/images/projects/securecam-logo.svg',
  },
  {
    id: 'devmatch',
    demo: { kind: 'screens', phone: ['/images/screens/devmatch-1.jpg', '/images/screens/devmatch-2.jpg'] },
    name: 'DevMatch',
    year: '2025',
    kind: 'Networking app',
    summary:
      'Swipe to find developers nearby, matched on skills and on what they want: a co-founder, freelance work or a mentor.',
    stack: ['React Native', 'Supabase', 'PostGIS'],
    logo: '/images/projects/devmatch-logo.png',
  },
  {
    id: 'sharry',
    demo: { kind: 'screens', phone: ['/images/screens/sharry-1.jpg', '/images/screens/sharry-3.jpg'] },
    name: 'Sharry',
    year: '2025',
    kind: 'Offline file sharing',
    summary:
      'Send files to ten or more phones at once over a Wi-Fi hotspot. No internet, no compression, pair with a QR code.',
    stack: ['React Native', 'Express', 'Socket.io'],
    logo: '/images/projects/sharry-logo.png',
    logoBg: '#166534',
  },
  {
    id: 'smartbase',
    name: 'SmartBase',
    year: '2025',
    kind: 'School management system',
    summary:
      'Grades, attendance, timetables, report cards and fee receipts for a school, with separate views for admins, teachers and students.',
    stack: ['React', 'Vite', 'Firebase', 'Gemini'],
    logo: '/images/projects/smartbase-logo.svg',
  },
  {
    id: 'zenix',
    demo: { kind: 'screens', phone: ['/images/screens/zenix-1.jpg'] },
    name: 'Zenix',
    year: '2025',
    kind: 'AI learning app',
    summary:
      'Upload study material and get practice questions back, with streaks and subscription tiers that keep AI costs in check.',
    stack: ['Expo', 'Supabase', 'Gemini', 'Flutterwave'],
    logo: '/images/projects/zenix-logo.png',
    repo: 'https://github.com/LO4NL4D1FF/zenix-lite',
  },
  {
    id: 'notefy',
    name: 'Notefy',
    year: '2025',
    kind: 'Markdown notes',
    summary:
      'A fast notes vault in plain JavaScript. Tabs, inline tags, search and full offline support, in about 50 KB.',
    stack: ['JavaScript', 'IndexedDB', 'Service Workers'],
    demo: { kind: 'live', url: '/demos/notefy/index.html' },
    logo: '/images/projects/notefy-logo.png',
  },
  {
    id: 'easysave',
    name: 'EasySave',
    year: '2025',
    kind: 'Savings tracker',
    summary:
      'Weekly savings goals, a progress dashboard and an admin panel. Weekly targets turned out easier to keep than monthly ones.',
    stack: ['Next.js', 'Tailwind CSS'],
    logo: '/images/projects/easysave-logo.png',
    repo: 'https://github.com/LO4NL4D1FF/smart-save',
  },
  {
    id: 'libraryms',
    name: 'LibraryMS',
    year: '2026',
    kind: 'Library management',
    summary:
      'Books, members, categories and loans with overdue tracking, built on Django and SQLite.',
    stack: ['Python', 'Django', 'SQLite'],
    logo: '/images/projects/libraryms-logo.svg',
  },
  {
    id: 'pixel-perfect',
    demo: { kind: 'screens', desktop: ['/images/screens/pp-desk.jpg', '/images/screens/pp-desk2.jpg'], phone: ['/images/screens/pp-1.jpg'] },
    name: 'Pixel Perfect',
    year: '2026',
    kind: 'Agency website',
    summary:
      'A seven-page site for a Monrovia media and marketing agency. Static HTML and CSS, no build step, quick on any phone.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    logo: '/images/projects/pixelperfect-logo.png',
  },
];

/** Icons shown in the hero dock, in order. */
export const dock = [...featured, ...others].filter((p) => p.logo);
