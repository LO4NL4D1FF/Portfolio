export interface Service {
  id: string;
  name: string;
  price: string;
  description: string;
  /** Lower-case fragments, rendered as one sentence. */
  includes: string[];
}

export const services: Service[] = [
  {
    id: 'web',
    name: 'Websites',
    price: 'From $450',
    description: 'Fast, responsive sites in Next.js or plain HTML, depending on what you need.',
    includes: ['works on phone, tablet and desktop', 'search and social previews set up', 'a CMS if you want one', 'deployment and handover'],
  },
  {
    id: 'mobile',
    name: 'Mobile apps',
    price: 'From $1,200',
    description: 'One codebase for iOS and Android with React Native and Expo.',
    includes: ['sign-in, notifications and analytics', 'a Supabase backend or your own API', 'help with store submission'],
  },
  {
    id: 'frontend',
    name: 'Frontend work in your product',
    price: 'From $35 an hour',
    description: 'Features, refactors and design-system work inside an existing React or Next.js codebase.',
    includes: ['accessibility and performance passes', 'code review and pairing'],
  },
  {
    id: 'ai',
    name: 'AI features',
    price: 'From $600',
    description: 'Chat, summaries and search wired into a real product, with costs you can predict.',
    includes: ['OpenAI, Claude or Gemini', 'streaming, caching and rate limits', 'a written handover'],
  },
  {
    id: 'design',
    name: 'Interface design',
    price: 'From $300',
    description: 'Flows and screens in Figma, ready for a developer to build.',
    includes: ['wireframes and prototypes', 'component libraries'],
  },
  {
    id: 'video',
    name: 'Video editing',
    price: 'From $90 a project',
    description: 'Reels, long-form edits and brand pieces in Premiere Pro and CapCut.',
    includes: ['color and sound', 'titles and motion'],
  },
];
