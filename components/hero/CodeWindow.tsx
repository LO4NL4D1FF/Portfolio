'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { snippet, syntax } from '@/lib/editorSnippet';

gsap.registerPlugin(useGSAP);

/** VS Code "Dark Modern" chrome colors. */
const vs = {
  title: '#1F1F1F',
  bar: '#181818',
  editor: '#1F1F1F',
  border: '#2B2B2B',
  gutter: '#6E7681',
  accent: '#0078D4',
  text: '#CCCCCC',
  dim: '#9D9D9D',
};

const MONO = "'Cascadia Code', Consolas, 'SF Mono', Menlo, monospace";

/** A faithful VS Code window typing out real Karrio code, line by line, on a loop. */
export default function CodeWindow() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-line]'));
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 1 });
        tl.set(lines, { width: 0 });
        lines.forEach((line) => {
          const chars = Math.max(line.textContent?.length ?? 0, 1);
          tl.to(line, { width: `${chars}ch`, duration: Math.min(chars * 0.028, 1.2), ease: `steps(${chars})` });
        });
      });
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="overflow-hidden rounded-lg border shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]"
      style={{ background: vs.editor, borderColor: vs.border, color: vs.text, fontFamily: 'Segoe UI, system-ui, sans-serif' }}
    >
      <TitleBar />
      <div className="flex">
        <ActivityBar />
        <Explorer />
        <div className="min-w-0 flex-1">
          <Tabs />
          <p className="px-3 py-1 text-[10px]" style={{ color: vs.dim }}>
            apps › customer › lib › <span style={{ color: vs.text }}>geo.ts</span>
          </p>
          <div className="relative flex">
            <pre className="min-w-0 flex-1 overflow-hidden py-1 text-[10.5px] leading-[17px]" style={{ fontFamily: MONO }}>
              {snippet.map((tokens, i) => (
                <div key={i} className="flex">
                  <span className="w-8 shrink-0 select-none pr-3 text-right" style={{ color: vs.gutter }}>
                    {i + 1}
                  </span>
                  <code data-line className="block overflow-hidden whitespace-pre">
                    {tokens.length === 0
                      ? ' '
                      : tokens.map(([text, tone], j) => (
                          <span key={j} style={{ color: syntax[tone] }}>
                            {text}
                          </span>
                        ))}
                  </code>
                </div>
              ))}
            </pre>
            <Minimap />
          </div>
        </div>
      </div>
      <StatusBar />
    </div>
  );
}

function TitleBar() {
  return (
    <div className="flex h-7 items-center gap-3 border-b px-2 text-[10px]" style={{ background: vs.title, borderColor: vs.border, color: vs.dim }}>
      <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
        <path d="M17.5 2 8 10.6 3.8 7.4 2 8.3v7.4l1.8.9L8 13.4l9.5 8.6 4.5-2.2V4.2z" fill="#0A7ACC" />
        <path d="M17.5 7.3v9.4L11 12z" fill={vs.title} />
      </svg>
      <span className="hidden sm:inline">File</span>
      <span className="hidden sm:inline">Edit</span>
      <span className="hidden sm:inline">View</span>
      <span className="mx-auto flex h-[18px] w-40 items-center justify-center gap-1.5 rounded border text-[10px]" style={{ borderColor: vs.border, background: '#2A2A2A' }}>
        <svg width="9" height="9" viewBox="0 0 16 16" aria-hidden>
          <circle cx="7" cy="7" r="5" fill="none" stroke={vs.dim} strokeWidth="1.6" />
          <path d="M11 11l4 4" stroke={vs.dim} strokeWidth="1.6" />
        </svg>
        karrio
      </span>
      <span className="flex gap-3 pr-1" aria-hidden>
        <span>─</span>
        <span>▢</span>
        <span>✕</span>
      </span>
    </div>
  );
}

function ActivityBar() {
  const icons = [
    <path key="files" d="M6 3h8l5 5v13H6z M14 3v5h5" />,
    <g key="search"><circle cx="11" cy="11" r="6" /><path d="M16 16l5 5" /></g>,
    <g key="scm"><circle cx="7" cy="6" r="2.2" /><circle cx="7" cy="18" r="2.2" /><circle cx="17" cy="9" r="2.2" /><path d="M7 8v8 M17 11c0 4-10 2-10 5" /></g>,
    <g key="run"><path d="M8 5l11 7-11 7z" /></g>,
    <g key="ext"><path d="M4 10h6v10H4z M10 14h6v6h-6z M14 4h6v6h-6z" /></g>,
  ];
  return (
    <div className="flex w-9 shrink-0 flex-col items-center gap-3 border-r py-2" style={{ background: vs.bar, borderColor: vs.border }}>
      {icons.map((icon, i) => (
        <span key={i} className="relative flex w-full justify-center">
          {i === 0 && <span className="absolute inset-y-[-3px] left-0 w-0.5" style={{ background: vs.accent }} />}
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? '#D7D7D7' : '#858585'} strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
            {icon}
          </svg>
        </span>
      ))}
    </div>
  );
}

function Explorer() {
  const rows: [string, number, boolean?][] = [
    ['KARRIO', 0],
    ['apps', 1],
    ['customer', 2],
    ['lib', 3],
    ['currency.ts', 4],
    ['geo.ts', 4, true],
    ['momo.ts', 4],
    ['ratings.ts', 4],
    ['supabase.ts', 4],
  ];
  return (
    <div className="hidden w-[108px] shrink-0 border-r py-1 text-[10px] lg:block" style={{ background: vs.bar, borderColor: vs.border }}>
      <p className="px-3 pb-1 text-[9px] font-semibold" style={{ color: vs.dim }}>
        EXPLORER
      </p>
      {rows.map(([name, depth, active]) => (
        <p
          key={name}
          className="truncate py-[1.5px]"
          style={{ paddingLeft: 6 + depth * 7, background: active ? '#37373D' : undefined, color: depth === 0 ? vs.text : vs.dim }}
        >
          {name.endsWith('.ts') ? <span style={{ color: '#3178C6' }} className="mr-1 font-bold">TS</span> : <span className="mr-1">›</span>}
          {name}
        </p>
      ))}
    </div>
  );
}

function Tabs() {
  return (
    <div className="flex h-7 text-[10.5px]" style={{ background: vs.bar }}>
      <span className="flex items-center gap-1.5 border-t px-3" style={{ background: vs.editor, borderColor: vs.accent, color: '#FFFFFF' }}>
        <span className="font-bold" style={{ color: '#3178C6' }}>TS</span> geo.ts <span style={{ color: vs.dim }}>✕</span>
      </span>
      <span className="flex items-center gap-1.5 px-3" style={{ color: vs.dim }}>
        <span className="font-bold" style={{ color: '#3178C6' }}>TS</span> ratings.ts
      </span>
    </div>
  );
}

/** The miniature code overview on the right edge. */
function Minimap() {
  const widths = [70, 60, 0, 72, 55, 20, 64, 58, 44, 0, 38, 80];
  return (
    <div className="hidden w-12 shrink-0 py-1.5 pl-1.5 sm:block" aria-hidden>
      <div className="absolute right-0 top-1 h-12 w-12" style={{ background: 'rgba(121,121,121,0.12)' }} />
      {widths.map((w, i) => (
        <span key={i} className="mb-[3px] block h-[2px] rounded-sm" style={{ width: `${w}%`, background: w ? '#6A6A6A' : 'transparent' }} />
      ))}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex h-[22px] items-center justify-between border-t text-[10px]" style={{ background: vs.bar, borderColor: vs.border, color: vs.dim }}>
      <span className="flex h-full items-center gap-2">
        <span className="flex h-full items-center px-2 text-white" style={{ background: vs.accent }}>
          ⟩⟨
        </span>
        <span>⎇ main</span>
        <span>⊗ 0 ⚠ 0</span>
      </span>
      <span className="flex gap-3 pr-3">
        <span>Ln 12, Col 61</span>
        <span className="hidden sm:inline">UTF-8</span>
        <span>TypeScript</span>
      </span>
    </div>
  );
}
