/** Content for the animated hero stage. */

export const rotatingWords = [
  'delivery apps',
  'multiplayer games',
  'AI assistants',
  'offline-first tools',
  'bank software',
  'school systems',
];

export interface PhoneScreen {
  id: string;
  name: string;
  line: string;
  logo: string;
  bg: string;
  accent: string;
  /** Real screenshot at 393x852 @2x, when one has been captured. */
  shot?: string;
}

/** Each "splash screen" the phone mockup cycles through; colors come from each app's own brand. */
export const phoneScreens: PhoneScreen[] = [
  { id: 'karrio', name: 'Karrio', line: 'Let’s carry on', logo: '/images/projects/karrio-logo.png', bg: '#041A2F', accent: '#FE5500', shot: '/images/screens/karrio-1.jpg' },
  { id: 'gamefy', name: 'Gamefy', line: 'Play with the room', logo: '/images/projects/gamefy-logo.png', bg: '#1C1410', accent: '#E0A93B', shot: '/images/screens/gamefy-1.jpg' },
  { id: 'devmatch', name: 'DevMatch', line: 'Find your co-founder', logo: '/images/projects/devmatch-logo.png', bg: '#0D1330', accent: '#3BC6E0', shot: '/images/screens/devmatch-1.jpg' },
  { id: 'sharry', name: 'Sharry', line: 'Share without internet', logo: '/images/projects/sharry-logo.png', bg: '#166534', accent: '#22C55E', shot: '/images/screens/sharry-1.jpg' },
  { id: 'audify', name: 'Audify', line: 'Your AI DJ is on', logo: '/images/projects/audify-logo.png', bg: '#0B0710', accent: '#9B5CF6' },
  { id: 'pixel-perfect', name: 'Pixel Perfect', line: 'Agency site', logo: '/images/projects/pixelperfect-logo.png', bg: '#111', accent: '#ED1C24', shot: '/images/screens/pp-1.jpg' },
  { id: 'zenix', name: 'Zenix', line: 'Study with AI', logo: '/images/projects/zenix-logo.png', bg: '#0B2A6B', accent: '#2196F3', shot: '/images/screens/zenix-1.jpg' },
];

export const stats = [
  { value: 15, suffix: '+', label: 'apps and sites built' },
  { value: 3, suffix: '+', label: 'years writing code' },
  { value: 2, suffix: '', label: 'countries, one keyboard' },
];

export const marqueeItems = [
  'Claude',
  'Claude Code',
  'React Native',
  'Next.js',
  'TypeScript',
  'Supabase',
  'NestJS',
  'Angular',
  'Colyseus',
  'Python',
  'Django',
  'Figma',
  'Premiere Pro',
  'OpenAI',
  'Gemini',
];
