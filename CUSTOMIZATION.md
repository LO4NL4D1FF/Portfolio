# Customization Guide

This guide helps you personalize the Portfolio OS to showcase your own work.

## Table of Contents
1. [Updating Personal Information](#updating-personal-information)
2. [Adding/Removing Projects](#addingremoving-projects)
3. [Customizing Services](#customizing-services)
4. [Changing Colors & Theme](#changing-colors--theme)
5. [Modifying Animations](#modifying-animations)
6. [Adding Custom Pages](#adding-custom-pages)

---

## Updating Personal Information

### Owner Name

The owner name appears in multiple places:

**1. System Info (Bottom of Home Screen)**
- File: `components/AppGrid.tsx`
- Lines: 79-83

```typescript
<p>Owner: Mr. Sedo-Ta Loan Ladiff</p>
```

**2. Page Metadata**
- File: `app/layout.tsx`
- Lines: 5-7

```typescript
title: 'Your Name | Portfolio OS',
description: 'Interactive portfolio showcasing...',
```

**3. README Files**
- Update `README.md` and `INSTALLATION.md` with your name

### Contact Email

Replace `contact@example.com` throughout the project:

```bash
# Search and replace in all files
components/AppView.tsx (line 166)
components/ServicesView.tsx (lines 96, 132)
```

---

## Adding/Removing Projects

All projects are defined in `lib/projects.ts` in the `projects` array.

### Add a New Project

```typescript
{
  id: 'unique-project-id',
  name: 'Display Name',
  icon: '🎯', // Emoji or icon
  iconBg: 'from-color-500/20 to-color-500/20', // Gradient
  category: 'app', // 'app', 'service', or 'creative'
  mission: 'One-line mission statement',
  problem: 'What problem does it solve?',
  overview: 'Detailed technical overview (2-4 sentences)',
  stack: ['React', 'Node.js', 'PostgreSQL'], // Tech stack array
  insights: [
    'Key technical or product insight 1',
    'Key technical or product insight 2',
  ],
  images: [], // Optional: array of image URLs
  github: {
    available: true, // or false
    accessNote: 'How to request access'
  }
}
```

### Remove a Project

Simply delete the object from the `projects` array.

### Reorder Projects

The order in the array determines the order on the home screen.

---

## Customizing Services

Services are defined in `lib/projects.ts` in the `services` array.

### Modify Existing Service

```typescript
{
  id: 'service-id',
  name: 'Service Name',
  icon: '💼',
  description: 'Short description',
  pricing: 'From $X' or 'Custom quote',
  details: [
    'Feature 1',
    'Feature 2',
    'Feature 3',
  ]
}
```

### Add New Service

Add a new object to the `services` array following the same structure.

### Remove Service

Delete the object from the array.

---

## Changing Colors & Theme

### Color Palette

All colors are defined in `tailwind.config.js`:

```javascript
colors: {
  'android-bg': '#000000',              // True black background
  'android-surface': '#1C1C1E',          // Dark surface
  'android-surface-elevated': '#2C2C2E', // Elevated surface
  'android-text': '#F5F5F7',             // Primary text
  'android-text-secondary': '#AEAEB2',   // Secondary text
  'android-accent': '#0A84FF',           // Primary accent (blue)
  'android-accent-secondary': '#30D158', // Secondary accent (green)
  'android-divider': '#38383A',          // Divider lines
}
```

### Change Accent Color

Replace `#0A84FF` with your preferred color:
- One UI uses muted blues, purples, greens
- Keep colors at medium saturation for dark mode
- Test readability on dark backgrounds

### Gradient Backgrounds

Project icons use gradient backgrounds. Update in `lib/projects.ts`:

```typescript
iconBg: 'from-purple-500/20 to-blue-500/20'
// Change to any Tailwind gradient
```

### Background Wallpaper

The home screen has a subtle gradient wallpaper:

**File:** `components/HomeScreen.tsx` (line 19)

```tsx
<div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
```

---

## Modifying Animations

### Animation Speed

Framer Motion animations use spring physics. Adjust in component files:

```typescript
transition={{
  type: 'spring',
  stiffness: 300,  // Higher = faster, snappier
  damping: 30,     // Higher = less bounce
}}
```

**Where to find:**
- App open/close: `components/AppView.tsx`, `components/ServicesView.tsx`
- Icon press: `components/AppIcon.tsx`
- Home screen: `components/HomeScreen.tsx`

### Disable Animations (Performance)

For lower-end devices, reduce or remove animations:

```typescript
// Replace spring animations with simple transitions
transition={{ duration: 0.2 }}
```

### Custom Animations

Add new animations using Framer Motion:

```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  Your content
</motion.div>
```

---

## Adding Custom Pages

### Add a New App (Page)

1. **Create the data** in `lib/projects.ts`
2. **Update routing** in `app/page.tsx` to handle the new app type
3. **Create a view component** in `components/YourAppView.tsx`

Example for a "Blog" app:

**1. Add to projects array:**
```typescript
{
  id: 'blog',
  name: 'Blog',
  icon: '📝',
  // ... rest of data
}
```

**2. Create component:**
```tsx
// components/BlogView.tsx
export default function BlogView({ onClose }) {
  return (
    <motion.div /* ... */>
      {/* Your blog content */}
    </motion.div>
  );
}
```

**3. Update app/page.tsx:**
```tsx
import BlogView from '@/components/BlogView';

// In the render logic:
{openApp.id === 'blog' && <BlogView onClose={() => setOpenApp(null)} />}
```

### Add Image Galleries

Use the `images` array in project data:

```typescript
images: [
  '/images/project-1.png',
  '/images/project-2.png',
]
```

Then render in `AppView.tsx`:

```tsx
{project.images && project.images.length > 0 && (
  <div className="mt-4 space-y-2">
    {project.images.map((img, i) => (
      <img key={i} src={img} alt="" className="rounded-oneui" />
    ))}
  </div>
)}
```

---

## Advanced Customization

### Add Analytics

Install and configure analytics:

```bash
npm install @vercel/analytics
```

**Add to `app/layout.tsx`:**
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Add Custom Fonts

1. Download font files and add to `/public/fonts`
2. Update `app/layout.tsx`:

```tsx
import localFont from 'next/font/local';

const customFont = localFont({
  src: '../public/fonts/YourFont.woff2',
  variable: '--font-custom',
});

// Apply to body
<body className={customFont.variable}>
```

3. Update `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['var(--font-custom)', 'system-ui'],
}
```

### Add Dark/Light Mode Toggle

While this design is dark-mode only, you can add a toggle:

1. Create a theme context
2. Duplicate color variables in `tailwind.config.js`
3. Add toggle button in home screen
4. Use CSS variables to switch themes

---

## Tips

- Always test on mobile after changes
- Keep animations subtle for professionalism
- Maintain consistent spacing (use Tailwind's spacing scale)
- Test PWA installation after major changes
- Keep the design minimal - less is more

## Need Help?

- Check the `README.md` for general info
- Review the `INSTALLATION.md` for setup issues
- Consult Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Consult Framer Motion docs: [framer.com/motion](https://www.framer.com/motion/)

---

**Happy customizing! 🎨**
