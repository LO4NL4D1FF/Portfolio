# Project Structure

Complete file structure of Portfolio OS - Samsung One UI 8.5 Dark Mode

```
myPortfolio/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main entry point
│   ├── loading.tsx               # Loading state
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
│
├── components/                   # React Components
│   ├── PhoneMockup.tsx           # Desktop device frame
│   ├── StatusBar.tsx             # Android status bar
│   ├── HomeScreen.tsx            # Home screen layout
│   ├── AppGrid.tsx               # App icon grid
│   ├── AppIcon.tsx               # Individual app icons
│   ├── AppView.tsx               # Project detail view
│   ├── ServicesView.tsx          # Services/pricing view
│   └── LoadingScreen.tsx         # Loading animation
│
├── hooks/                        # Custom React Hooks
│   └── useSwipeBack.ts           # Swipe-back gesture hook
│
├── lib/                          # Utilities & Data
│   └── projects.ts               # Project and service data
│
├── public/                       # Static Assets
│   ├── manifest.json             # PWA manifest
│   ├── favicon.ico               # Favicon (placeholder)
│   ├── icon-192.png              # PWA icon 192x192 (to be added)
│   ├── icon-512.png              # PWA icon 512x512 (to be added)
│   └── ICONS_README.txt          # Icon generation instructions
│
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS theme
├── tsconfig.json                 # TypeScript configuration
│
├── README.md                     # Main documentation
├── INSTALLATION.md               # Setup guide
├── CUSTOMIZATION.md              # How to customize
├── DEPLOYMENT.md                 # Deployment guide
└── PROJECT_STRUCTURE.md          # This file
```

---

## Key Files Explained

### Configuration Files

**`package.json`**
- All project dependencies
- Scripts for dev, build, start

**`tailwind.config.js`**
- Custom One UI color palette
- Typography settings
- Responsive breakpoints
- Custom animations

**`tsconfig.json`**
- TypeScript compiler settings
- Path aliases (@/ for root)

**`next.config.mjs`**
- Next.js configuration
- PWA headers
- Image optimization
- Performance settings

---

### App Router (`app/`)

**`layout.tsx`**
- Root layout wrapper
- Metadata (title, description, PWA settings)
- Font loading
- Analytics setup point

**`page.tsx`**
- Main application logic
- State management for open apps
- AnimatePresence for transitions
- PhoneMockup wrapper

**`loading.tsx`**
- Loading state shown during navigation
- Animated loading screen

**`not-found.tsx`**
- Custom 404 error page
- One UI styled error view

**`globals.css`**
- Tailwind imports
- Custom scrollbar styles
- Safe area support
- Animation keyframes

---

### Components (`components/`)

**`PhoneMockup.tsx`**
- Desktop: Shows realistic phone frame
- Mobile: Immersive full-screen
- Responsive breakpoints

**`StatusBar.tsx`**
- Real-time clock
- Battery/WiFi icons (simulated)
- Safe area support

**`HomeScreen.tsx`**
- Wallpaper gradient
- Layout wrapper
- Gesture bar at bottom

**`AppGrid.tsx`**
- Grid layout for app icons
- Staggered animations
- System info section
- Header with owner name

**`AppIcon.tsx`**
- Individual app icon component
- Press animations
- 3D shadow effects (One UI 8.5 style)
- Haptic-style feedback

**`AppView.tsx`**
- Full project detail view
- README-style content layout
- Swipe-back gesture support
- Smooth slide-up transition

**`ServicesView.tsx`**
- Services grid layout
- Pricing tiers
- Contact CTAs
- Swipe-back support

**`LoadingScreen.tsx`**
- Animated loading spinner
- Portfolio OS branding
- Used during initial load

---

### Hooks (`hooks/`)

**`useSwipeBack.ts`**
- Custom hook for swipe-back gesture
- Edge detection (50px from left)
- Horizontal swipe only
- Threshold-based triggering

---

### Library (`lib/`)

**`projects.ts`**
- TypeScript interfaces for projects and services
- All project data (Zenix, Audify, CORELM, etc.)
- All service data (pricing, features)
- GitHub access notes
- Single source of truth for content

---

### Public Assets (`public/`)

**`manifest.json`**
- PWA configuration
- App name, description
- Icon paths
- Theme colors
- Display mode (standalone)

**`favicon.ico`**
- Browser tab icon
- Currently a placeholder

**`icon-192.png` / `icon-512.png`**
- PWA installation icons
- Need to be generated (see ICONS_README.txt)

---

## Data Flow

```
User clicks app icon
    ↓
AppIcon onClick → onAppOpen callback
    ↓
page.tsx setOpenApp(project)
    ↓
AnimatePresence switches view
    ↓
AppView or ServicesView renders
    ↓
Content loaded from projects.ts
    ↓
User swipes back or clicks back button
    ↓
onClose callback → setOpenApp(null)
    ↓
AnimatePresence returns to HomeScreen
```

---

## Component Hierarchy

```
app/page.tsx
└── PhoneMockup
    └── AnimatePresence
        ├── HomeScreen
        │   ├── StatusBar
        │   └── AppGrid
        │       └── AppIcon (multiple)
        │
        ├── AppView
        │   ├── StatusBar
        │   └── Project content
        │
        └── ServicesView
            ├── StatusBar
            └── Services content
```

---

## Styling Architecture

### Tailwind Utility Classes
- Used for all styling
- Custom color palette defined in config
- Responsive modifiers (md:, lg:)
- Dark mode only (no light mode classes)

### Framer Motion
- All animations and transitions
- Spring physics for natural feel
- AnimatePresence for enter/exit
- Gesture detection (tap, swipe)

### CSS Custom Properties
- Safe area insets
- Font loading
- Minimal global styles

---

## State Management

**Local State Only**
- No Redux, Zustand, or Context needed
- Single `openApp` state in page.tsx
- Callbacks passed down to children
- Simple and performant

---

## Performance Optimizations

1. **Code Splitting**
   - Next.js automatic code splitting
   - Components lazy load as needed

2. **Image Optimization**
   - Next.js Image component (if used)
   - WebP/AVIF format support

3. **Animation Performance**
   - GPU-accelerated transforms
   - 60fps target
   - Optimized spring physics

4. **PWA**
   - Service worker caching
   - Installable on all devices
   - Offline support (basic)

---

## Extension Points

### Add a New Project
1. Edit `lib/projects.ts`
2. Add object to `projects` array
3. Icon appears automatically

### Add a New Page/View
1. Create component in `components/`
2. Update routing logic in `app/page.tsx`
3. Add data to `lib/projects.ts` if needed

### Add Analytics
1. Install package (`@vercel/analytics`, etc.)
2. Add provider to `app/layout.tsx`
3. Track events in components

### Add Database
1. Install Prisma/Supabase/etc.
2. Create API routes in `app/api/`
3. Fetch data in components

---

## Build Process

```bash
npm run dev   # Development server (fast refresh)
npm run build # Production build (optimized)
npm start     # Production server (after build)
npm run lint  # ESLint check
```

**Build Output:**
- `.next/` folder contains compiled app
- Static pages pre-rendered
- Dynamic pages server-rendered
- Optimized JavaScript bundles

---

## Environment Support

- **Node.js:** 18+
- **Browsers:** Chrome, Safari, Firefox, Edge (modern)
- **Mobile:** iOS Safari, Chrome Android
- **Desktop:** macOS, Windows, Linux

---

**This structure is designed for:**
- Easy customization
- Fast development
- Production-ready deployment
- Scalability
- Maintainability
