# Windows 11 Portfolio OS

An immersive, interactive portfolio system designed to feel like a real Windows 11 desktop.

![Windows 11](https://img.shields.io/badge/Windows%2011-Inspired-0078D4?style=for-the-badge&logo=windows11)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## Overview

This is not a traditional website — it's a **simulated Windows 11 operating system** used to showcase projects, services, and creative work by **Mr. Sedo-Ta Loan Ladiff**.

## ✨ Features

### 🖥️ Authentic Windows 11 Experience

- **Full Desktop Environment**: Complete Windows 11 desktop with gradient wallpaper
- **Centered Taskbar**: Functional taskbar with Windows logo, search, pinned apps, and system tray
- **Start Menu**: Beautiful Start menu with app grid, search bar, and user profile
- **Draggable Windows**: Real Windows 11 windows you can drag around the desktop
- **Mica Material**: Translucent backgrounds that integrate with desktop wallpaper
- **Acrylic Effects**: Frosted-glass blur for menus and panels

### 🎨 Fluent Design System

- **Design Language**: Microsoft's Fluent Design 2.0
- **Typography**: Segoe UI Variable (Windows 11's official font)
- **Colors**: Authentic Windows 11 color palette
- **Rounded Corners**: Soft 8px radius throughout
- **Shadows**: Proper elevation and layering
- **Animations**: Smooth spring-based transitions

### 📂 Your Projects as Windows Apps

Every project opens in a beautiful Windows 11 window:
- **Zenix** - AI-powered adaptive learning
- **Audify** - Audio visualization platform
- **CORELM** - Document to podcast learning
- **MSI Portal** - Property management system
- **Smart Save** - Analytics-driven savings
- **Videography Studio** - Video production portfolio

Plus a **Services** app showcasing your professional offerings!

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

1. **Click the Windows logo** in the taskbar to open the Start menu
2. **Click any app tile** to open that project in a window
3. **Drag windows** around the desktop by their title bars
4. **Click the X button** to close windows
5. **Hover over taskbar buttons** for hover effects
6. **Click the clock** or system icons for future features

## 🎨 Design Details

### Color Palette

```css
/* Light Mode (Default) */
--win-bg: #F3F3F3
--win-surface: #FFFFFF
--win-accent: #0078D4

/* Dark Mode (Auto-detected) */
--win-bg-dark: #202020
--win-surface-dark: #2C2C2C
--win-accent: #0078D4 (same)
```

### Typography

- **Primary**: Segoe UI Variable
- **Fallbacks**: Segoe UI → system-ui → -apple-system

### Border Radius

- **Standard**: 8px (win)
- **Large**: 12px (win-lg)
- **Small**: 4px (win-sm)

### Shadows

- **Small**: Subtle elevation
- **Medium**: Standard depth
- **Large**: Prominent depth

## 📁 Project Structure

```
myPortfolio/
├── components/
│   ├── Windows11Desktop.tsx      # Desktop container
│   ├── Windows11Taskbar.tsx      # Taskbar with all features
│   ├── Windows11StartMenu.tsx    # Start menu
│   ├── Windows11Window.tsx       # Draggable window
│   ├── AppViewWin11.tsx          # Project details
│   └── ServicesViewWin11.tsx     # Services view
│
├── app/
│   ├── page.tsx                  # Main entry point
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── lib/
│   └── projects.ts               # Project data
│
└── tailwind.config.js            # Windows 11 design tokens
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## 🎯 Windows 11 Features Implemented

✅ Centered taskbar with Windows logo
✅ Functional Start menu with app grid
✅ Draggable, resizable windows
✅ Mica material backgrounds
✅ Acrylic blur effects
✅ Rounded corners (8px)
✅ Segoe UI Variable font
✅ Windows 11 color palette
✅ Smooth spring animations
✅ System tray with clock
✅ Search bar
✅ Pinned apps
✅ Light & dark mode support

## 🔧 Customization

### Change Wallpaper

Edit `components/Windows11Desktop.tsx`:
```tsx
className="w-full h-screen bg-gradient-to-br from-[#YOUR_COLOR]..."
```

### Change Accent Color

Edit `tailwind.config.js`:
```js
'win-accent': '#YOUR_BLUE_COLOR',
```

### Add More Pinned Apps

Edit `app/page.tsx`:
```tsx
const pinnedApps = projects.slice(0, 10) // Show more apps
```

## 📱 PWA Support

Installable as a Progressive Web App:
- Manifest configured
- Windows 11 branding
- Standalone mode

## 🌐 Browser Support

- ✅ **Chrome/Edge** (Best experience with full backdrop-filter support)
- ✅ **Firefox** (Good support)
- ✅ **Safari** (Limited backdrop-filter, but functional)
- ⚠️ **Older browsers** (May lack blur effects)

## 📚 Resources & Inspiration

- [Microsoft Fluent Design System](https://fluent2.microsoft.design/)
- [Windows 11 Design Principles](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/design-principles)
- [Mica Material Guidelines](https://learn.microsoft.com/en-us/windows/apps/design/style/mica)
- [Windows 11 Geometry](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/geometry)

## 🎓 What You'll Learn

This project demonstrates:
- Modern React patterns (hooks, context, composition)
- Framer Motion animations and gestures
- Tailwind CSS custom design system
- TypeScript for type safety
- Next.js App Router
- Component architecture
- Drag and drop interactions
- Responsive design
- PWA configuration

## 📄 License

© 2025 Mr. Sedo-Ta Loan Ladiff. All rights reserved.

## 📞 Contact

For inquiries about projects, collaborations, or services:
- **Email**: contact@example.com
- **GitHub**: Available upon request

---

**Built with ❤️ using Next.js, React, Tailwind CSS, and Framer Motion**

**Designed to authentically recreate the Windows 11 experience**
