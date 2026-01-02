# Portfolio OS - Samsung One UI 8.5 Dark Mode

An immersive, interactive portfolio system designed to feel like a real Samsung Android device running One UI 8.5 in Dark Mode.

## Overview

This is not a traditional website — it's a **simulated operating system** used to showcase real projects, systems, services, and creative work by **Mr. Sedo-Ta Loan Ladiff** (Mr. Loan Ladiff Sedo-Ta).

## Key Features

- **Authentic One UI 8.5 Design**: Dark mode only, with 3D shadows, liquid glass-inspired floating elements, and true black backgrounds
- **Phone Mockup on Desktop**: Centered Samsung device shell with realistic bezels and punch-hole camera
- **Immersive Mobile Experience**: Full-screen native feel on phones and tablets
- **App-Based Navigation**: Every project is represented as an Android app icon
- **Smooth Animations**: Spring physics and gesture-based interactions powered by Framer Motion
- **PWA Enabled**: Installable on Android and iOS devices
- **README-Style Project Views**: Clean, technical documentation for each project
- **Services Showcase**: Professional services with pricing tiers

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Design Philosophy

The UI strictly follows Samsung One UI 8.5 design principles:
- True black backgrounds (#000000)
- Dark charcoal surfaces (#1C1C1E, #2C2C2E)
- Soft off-white text (#F5F5F7)
- Muted accent colors (used sparingly)
- Large typography and generous spacing
- Bottom-weighted, thumb-first ergonomics
- Subtle 3D shadows for depth
- Blur and translucency effects

## Projects Showcased

1. **Zenix** - AI-powered adaptive learning platform
2. **Audify** - Audio-first experience with real-time visualizers
3. **CORELM** - Document to podcast learning system
4. **MSI Portal** - Enterprise property management
5. **Smart Save** - Analytics-driven savings dashboard
6. **Videography Studio** - Short films and experimental edits

## Services Offered

- Website Development
- Mobile App Development
- AI & Automation Solutions
- UI / UX Design
- Video Editing & Motion Design

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
myPortfolio/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main entry point
│   └── globals.css      # Global styles
├── components/
│   ├── PhoneMockup.tsx  # Device frame
│   ├── StatusBar.tsx    # Android status bar
│   ├── HomeScreen.tsx   # Home screen
│   ├── AppGrid.tsx      # App icon grid
│   ├── AppIcon.tsx      # Individual app icons
│   ├── AppView.tsx      # Project detail view
│   └── ServicesView.tsx # Services/pricing view
├── lib/
│   └── projects.ts      # Project data
└── public/
    └── manifest.json    # PWA manifest
```

## Customization

### Adding a New Project

Edit `lib/projects.ts` and add a new project object to the `projects` array:

```typescript
{
  id: 'your-project',
  name: 'Your Project Name',
  icon: '🚀',
  iconBg: 'from-blue-500/20 to-green-500/20',
  category: 'app',
  mission: 'Your mission statement',
  problem: 'Problem it solves',
  overview: 'System overview',
  stack: ['Tech', 'Stack'],
  insights: ['Key insight 1', 'Key insight 2'],
  github: {
    available: true,
    accessNote: 'Access note'
  }
}
```

### Updating Services

Edit the `services` array in `lib/projects.ts`.

### Changing Colors

Update the color palette in `tailwind.config.js`.

## Deployment

This project can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- Any static hosting platform

## PWA Installation

On mobile devices, tap "Add to Home Screen" to install as a native-like app.

## Performance

- Optimized for 60fps animations
- Lazy loading for images
- Minimal bundle size
- Fast initial load times

## License

© 2025 Mr. Sedo-Ta Loan Ladiff. All rights reserved.

## Contact

For inquiries about projects, collaborations, or services:
- Email: contact@example.com
- GitHub: Available upon request

---

Built with ❤️ using Next.js + React + Tailwind + Framer Motion
