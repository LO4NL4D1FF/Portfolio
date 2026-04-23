# Sedo-Ta — Portfolio

Personal portfolio for Loan Ladiff Sedo-Ta — software engineer and product builder.

A liquid-glass UI on a soft tinted backdrop. Built with Next.js, Tailwind, and Framer Motion.

## Stack

- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Structure

```
app/
  layout.tsx        Root layout, metadata, fonts
  page.tsx          SPA shell — handles screen state machine
  globals.css       Liquid-glass utilities (.lg, .lg-sm, .lg-strong, .lg-pill, .btn-dark)
  loading.tsx       Loading fallback
  not-found.tsx     404
components/
  Background.tsx       Drifting tinted blobs that the glass refracts
  StartScreen.tsx      Landing
  MainMenu.tsx         Section picker
  NavigationBar.tsx    Floating glass nav pill
  AboutSection.tsx
  ProjectsGrid.tsx
  ProjectDetailView.tsx
  ServicesMenu.tsx
  SkillsBar.tsx
  ContactSection.tsx
  Dialog.tsx
  types.ts
lib/
  projects.ts       All portfolio content (projects + services)
public/
  images/projects/  Project logos
```

## Editing content

All copy lives in `lib/projects.ts` (projects + services arrays) and the section components.
