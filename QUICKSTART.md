# Quick Start Guide

Get your Portfolio OS running in 5 minutes.

## 1. Install Dependencies

```bash
npm install
```

Wait for all packages to install (~2 minutes).

---

## 2. Generate Icons (Optional but Recommended)

You need PWA icons for the app to be installable on mobile devices.

**Quick Option:** Use an online generator
1. Go to [RealFaviconGenerator.net](https://realfavicongenerator.net/)
2. Upload a simple black image with white "P" or phone emoji
3. Download and extract icons
4. Place `icon-192.png` and `icon-512.png` in `/public` folder

**Or Skip for Now:** The app works without icons, but won't be installable.

---

## 3. Customize Your Info

### Update Owner Name
**File:** `components/AppGrid.tsx` (line 80)
```typescript
<p>Owner: Your Name Here</p>
```

**File:** `app/layout.tsx` (line 5)
```typescript
title: 'Your Name | Portfolio OS',
```

### Update Contact Email
**Files to update:**
- `components/AppView.tsx` (line 166)
- `components/ServicesView.tsx` (lines 96, 132)

Replace `contact@example.com` with your email.

---

## 4. Add Your Projects (Optional)

**File:** `lib/projects.ts`

Edit the `projects` array to showcase your work:

```typescript
{
  id: 'my-project',
  name: 'My Amazing App',
  icon: '🚀',
  iconBg: 'from-blue-500/20 to-purple-500/20',
  category: 'app',
  mission: 'What your project does in one line',
  problem: 'Problem it solves',
  overview: 'Technical overview 2-3 sentences',
  stack: ['React', 'Node.js', 'TypeScript'],
  insights: ['Key insight 1', 'Key insight 2'],
  github: {
    available: true,
    accessNote: 'Available on request'
  }
}
```

---

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see:
- ✅ Phone mockup (on desktop)
- ✅ App grid with your projects
- ✅ Smooth animations
- ✅ Dark mode One UI theme

---

## 6. Test on Mobile

### Option A: Same WiFi Network
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open `http://YOUR_IP:3000` on your phone
3. Test swipe gestures and animations

### Option B: Deploy and Test
See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

---

## 7. Build for Production

When ready to deploy:

```bash
npm run build
npm start
```

This creates an optimized production build.

---

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript Errors
```bash
# Check all errors
npm run build
```

Fix any import paths or type issues.

---

## Next Steps

1. ✅ Read [CUSTOMIZATION.md](CUSTOMIZATION.md) - Learn how to personalize everything
2. ✅ Read [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to Vercel/Netlify
3. ✅ Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Understand the architecture
4. ✅ Add your projects and services
5. ✅ Generate proper PWA icons
6. ✅ Deploy and share!

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

---

## File Checklist

Before deploying, ensure you've customized:

- [ ] Owner name in `components/AppGrid.tsx`
- [ ] Page title in `app/layout.tsx`
- [ ] Contact email in all components
- [ ] Projects in `lib/projects.ts`
- [ ] Services in `lib/projects.ts`
- [ ] PWA icons in `/public` folder

---

## Support

- 📖 Full Documentation: [README.md](README.md)
- 🛠️ Installation Help: [INSTALLATION.md](INSTALLATION.md)
- 🎨 Customization: [CUSTOMIZATION.md](CUSTOMIZATION.md)
- 🚀 Deployment: [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Ready to showcase your work! 🎉**
