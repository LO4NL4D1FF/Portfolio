# Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A code editor (VS Code recommended)
- Git (optional, for version control)

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

This will install all required dependencies:
- Next.js
- React
- Framer Motion
- Tailwind CSS
- Lucide React (icons)
- TypeScript

## Step 2: Generate PWA Icons

The project requires PWA icons for installability. Follow these steps:

1. Read `/public/ICONS_README.txt` for detailed instructions
2. Create two PNG files:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)
3. Place them in the `/public` folder
4. Replace `/public/favicon.ico` with your favicon

**Quick Icon Generation:**
- Use [RealFaviconGenerator](https://realfavicongenerator.net/)
- Design in Figma/Canva with a black background + white "P" symbol
- Or use an AI image generator

## Step 3: Customize Your Portfolio

### Update Owner Information

Open `lib/projects.ts` and modify:
- Project details (name, mission, tech stack, etc.)
- Services and pricing
- GitHub access notes

### Update Contact Information

Search for `contact@example.com` across the project and replace with your email:
- `components/AppView.tsx`
- `components/ServicesView.tsx`

### Add Your Projects

Edit the `projects` array in `lib/projects.ts`:

```typescript
{
  id: 'your-project',
  name: 'Project Name',
  icon: '🚀',
  iconBg: 'from-blue-500/20 to-purple-500/20',
  category: 'app',
  mission: 'What it does',
  problem: 'Problem it solves',
  overview: 'Technical overview',
  stack: ['React', 'Node.js'],
  insights: ['Key insight 1', 'Key insight 2'],
  github: {
    available: true,
    accessNote: 'Your access note'
  }
}
```

## Step 4: Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Build for Production

```bash
npm run build
npm start
```

This creates an optimized production build.

## Step 6: Deploy

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`

### Deploy to Other Platforms

Works with any platform supporting Next.js:
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

## Environment Variables

No environment variables are required for the base setup. If you add features requiring API keys (analytics, databases, etc.), create a `.env.local` file:

```bash
# Example
NEXT_PUBLIC_ANALYTICS_ID=your-id
```

## Mobile Installation (PWA)

Once deployed:

### iOS (Safari)
1. Open the site in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

### Android (Chrome)
1. Open the site in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"

## Troubleshooting

### Icons Not Showing
- Ensure icon files are in `/public` folder
- Check file names match `manifest.json`
- Clear browser cache and reload

### Animations Laggy
- Check if you have GPU acceleration enabled
- Try reducing `stiffness` values in Framer Motion configs
- Ensure dev tools are closed (they slow animations)

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Ensure Node.js version is 18+

### TypeScript Errors
- Run `npm run build` to see all errors
- Check that all imports use correct paths
- Ensure `tsconfig.json` is properly configured

## Development Tips

- Hot reload is enabled - save files to see changes instantly
- Use browser DevTools to test mobile responsive design
- Test PWA features in production mode (`npm run build && npm start`)
- Use `console.log()` sparingly - they're removed in production

## Next Steps

- Add Google Analytics or Plausible for tracking
- Connect a real email service (EmailJS, SendGrid)
- Add a blog section if needed
- Integrate with a CMS (Sanity, Contentful)
- Add dark/light mode toggle (if desired)

## Support

For issues or questions:
- Check the main `README.md`
- Review Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Review Framer Motion docs: [framer.com/motion](https://www.framer.com/motion/)

---

**Built with Next.js 15, React 18, Tailwind CSS, and Framer Motion**
