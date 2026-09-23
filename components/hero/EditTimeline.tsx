'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const LOOP_SECONDS = 12;
const FPS = 25;
const RULER_SECONDS = 12;

/** Premiere Pro dark UI and default label colors. */
const pr = {
  panel: '#1D1D1D',
  header: '#232323',
  track: '#262626',
  line: '#141414',
  text: '#B8B8B8',
  dim: '#7A7A7A',
  blue: '#2D8CEB',
  video: '#A38BE0',
  videoEdge: '#7D66C1',
  audio: '#4FAE72',
  audioEdge: '#338653',
};

type Clip = { start: number; length: number; name: string; fx?: boolean };

const videoTracks: { label: string; clips: Clip[] }[] = [
  { label: 'V2', clips: [{ start: 3.2, length: 2.4, name: 'title_lower3.mogrt', fx: true }, { start: 8.1, length: 2.1, name: 'logo_sting.mov' }] },
  {
    label: 'V1',
    clips: [
      { start: 0, length: 3.1, name: 'A001_monrovia_broll.mp4', fx: true },
      { start: 3.1, length: 4.2, name: 'A002_interview.mp4', fx: true },
      { start: 7.3, length: 4.7, name: 'A003_street_cut.mp4' },
    ],
  },
];

const audioTracks: { label: string; clips: Clip[] }[] = [
  { label: 'A1', clips: [{ start: 0, length: 7.3, name: 'interview_vo.wav' }, { start: 7.3, length: 4.7, name: 'ambience.wav' }] },
  { label: 'A2', clips: [{ start: 0.6, length: 11.4, name: 'score_final.wav' }] },
];

const pct = (seconds: number) => `${(seconds / RULER_SECONDS) * 100}%`;

const timecode = (seconds: number) => {
  const whole = Math.floor(seconds);
  const frames = Math.floor((seconds - whole) * FPS);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:00:${pad(whole)}:${pad(frames)}`;
};

/** Deterministic pseudo-random waveform so server and client render the same bars. */
const waveform = (seed: number, count: number) =>
  Array.from({ length: count }, (_, i) => {
    const v = Math.abs(Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1;
    return 0.25 + v * 0.75;
  });

/** A Premiere Pro timeline with the playhead running through a real-looking edit. */
export default function EditTimeline() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const head = root.querySelector<HTMLElement>('[data-playhead]');
      const clocks = root.querySelectorAll<HTMLElement>('[data-timecode]');
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const state = { t: 0 };
        gsap.to(state, {
          t: LOOP_SECONDS,
          duration: LOOP_SECONDS,
          ease: 'none',
          repeat: -1,
          onUpdate: () => {
            if (head) head.style.left = pct(state.t);
            clocks.forEach((c) => (c.textContent = timecode(state.t)));
          },
        });
      });
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="overflow-hidden rounded-lg border shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]"
      style={{ background: pr.panel, borderColor: '#2E2E2E', color: pr.text, fontFamily: 'Segoe UI, system-ui, sans-serif' }}
    >
      <div className="flex h-6 items-center gap-2 border-b px-2 text-[10px]" style={{ background: pr.header, borderColor: pr.line }}>
        <span className="text-white/40">✕</span>
        <span className="font-semibold text-white">monrovia_reel_v3</span>
        <span style={{ color: pr.dim }}>≡</span>
      </div>

      <div className="flex">
        <div className="w-[82px] shrink-0 border-r" style={{ borderColor: pr.line }}>
          <p data-timecode className="flex h-7 items-center pl-2 font-mono text-[10.5px] font-semibold tabular-nums" style={{ color: pr.blue }}>
            00:00:00:00
          </p>
          {videoTracks.map((t) => (
            <TrackHeader key={t.label} label={t.label} kind="video" />
          ))}
          <div className="h-[3px]" style={{ background: pr.line }} />
          {audioTracks.map((t) => (
            <TrackHeader key={t.label} label={t.label} kind="audio" />
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <Ruler />
          {videoTracks.map((t) => (
            <Lane key={t.label}>
              {t.clips.map((c) => (
                <VideoClip key={c.name} clip={c} />
              ))}
            </Lane>
          ))}
          <div className="h-[3px]" style={{ background: pr.line }} />
          {audioTracks.map((t, i) => (
            <Lane key={t.label}>
              {t.clips.map((c, j) => (
                <AudioClip key={c.name} clip={c} seed={i * 10 + j + 1} />
              ))}
            </Lane>
          ))}

          <div data-playhead className="pointer-events-none absolute inset-y-0 left-0 z-10 w-px" style={{ background: pr.blue }}>
            <svg width="11" height="12" viewBox="0 0 11 12" className="absolute -left-[5px] top-[9px]" aria-hidden>
              <path d="M0 0h11v6l-5.5 6L0 6z" fill={pr.blue} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackHeader({ label, kind }: { label: string; kind: 'video' | 'audio' }) {
  return (
    <div className="flex h-7 items-center gap-1 border-b px-1.5 text-[9px]" style={{ background: pr.header, borderColor: pr.line }}>
      <svg width="8" height="9" viewBox="0 0 8 9" aria-hidden>
        <rect x="0.5" y="4" width="7" height="4.5" rx="1" fill="none" stroke={pr.dim} />
        <path d="M2 4V2.6a2 2 0 0 1 4 0V4" fill="none" stroke={pr.dim} />
      </svg>
      <span className="rounded-sm px-1 font-semibold" style={{ background: '#3A3A3A', color: '#E0E0E0' }}>
        {label}
      </span>
      {kind === 'video' ? (
        <span style={{ color: pr.dim }}>◉</span>
      ) : (
        <>
          <span className="rounded-sm px-[3px]" style={{ background: '#333', color: pr.dim }}>M</span>
          <span className="rounded-sm px-[3px]" style={{ background: '#333', color: pr.dim }}>S</span>
        </>
      )}
    </div>
  );
}

function Ruler() {
  const seconds = Array.from({ length: RULER_SECONDS + 1 }, (_, i) => i);
  return (
    <div className="relative h-7 border-b" style={{ background: pr.header, borderColor: pr.line }}>
      {seconds.map((s) => (
        <span key={s} className="absolute bottom-0 h-full" style={{ left: pct(s) }}>
          <span className="absolute bottom-0 h-2 w-px" style={{ background: '#5A5A5A' }} />
          {s % 3 === 0 && (
            <span className="absolute left-1 top-1 whitespace-nowrap font-mono text-[8px]" style={{ color: pr.dim }}>
              00:00:{String(s).padStart(2, '0')}:00
            </span>
          )}
          <span className="absolute bottom-0 left-[50%] h-1 w-px" style={{ background: '#444' }} />
        </span>
      ))}
    </div>
  );
}

function Lane({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-7 border-b" style={{ background: pr.track, borderColor: pr.line }}>
      {children}
    </div>
  );
}

function VideoClip({ clip }: { clip: Clip }) {
  return (
    <span
      className="absolute inset-y-[2px] flex items-start gap-1 overflow-hidden rounded-[2px] border px-1 pt-[2px] text-[8.5px] text-black/80"
      style={{ left: pct(clip.start), width: pct(clip.length), background: pr.video, borderColor: pr.videoEdge }}
    >
      {clip.fx && (
        <span className="rounded-[2px] px-[2px] text-[7px] font-bold" style={{ background: '#E3C94F' }}>
          fx
        </span>
      )}
      <span className="truncate">{clip.name}</span>
    </span>
  );
}

function AudioClip({ clip, seed }: { clip: Clip; seed: number }) {
  const bars = waveform(seed, Math.round(clip.length * 9));
  return (
    <span
      className="absolute inset-y-[2px] overflow-hidden rounded-[2px] border"
      style={{ left: pct(clip.start), width: pct(clip.length), background: pr.audio, borderColor: pr.audioEdge }}
    >
      <svg viewBox={`0 0 ${bars.length} 10`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {bars.map((h, i) => (
          <rect key={i} x={i + 0.15} y={5 - h * 4.5} width="0.7" height={h * 9} fill="#1F5A36" />
        ))}
      </svg>
    </span>
  );
}
