# loansedota.com

Portfolio of Loan Ladiff Sedo-Ta, software engineer in Monrovia, Liberia.

A single static page built with Next.js 15 (App Router), React 18, TypeScript and Tailwind CSS. Deployed on Vercel from `master`.

## Run it

```bash
npm install
npm run dev
```

## Where things live

- `lib/profile.ts`: bio, facts, skills and contact details
- `lib/projects.ts`: featured and other projects (logos in `public/images/projects`)
- `lib/services.ts`: services and starting prices
- `app/globals.css`: color tokens (light and dark) and the dock animation
- `components/`: one file per page section

## Design notes

- Palette: mist `#E6EAEE`, Atlantic navy `#0E1A2B`, slate `#4C5A6B`, rule `#C3CCD5`, mango `#F0B429`. Mango is only ever a fill, never text on the light background.
- Type: Schibsted Grotesk throughout.
- The hero dock of app icons is the one animated moment; it is skipped when reduced motion is on.
