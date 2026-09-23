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

- Palette: black `#000000` first, white second, mango `#F5B82E` and signal blue `#5B8CFF` as accents.
- Type: Schibsted Grotesk throughout.
- Motion: GSAP (`gsap`, `@gsap/react`, ScrollTrigger). Every animation is skipped when reduced motion is on.
- Hero stage (`components/hero`): a real iPhone 17 frame (`public/images/devices`, free commercial licence from webmobilefirst.com) showing real app screenshots, a VS Code replica typing real Karrio code, and a Premiere Pro style timeline.
- Demos: `lib/projects.ts` `demo` field. Real screenshots live in `public/images/screens`; Notefy runs live from `public/demos/notefy`.
- The Day job section describes the bank role in general terms only. Never name the bank or its systems.
