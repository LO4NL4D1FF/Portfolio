import type { ReactNode } from 'react';
import Image from 'next/image';

interface BrowserFrameProps {
  url: string;
  title: string;
  favicon?: string;
  children: ReactNode;
}

/** Chrome's dark window chrome on Windows: tab strip, address bar, window controls. */
export default function BrowserFrame({ url, title, favicon, children }: BrowserFrameProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[#3C3C3C] bg-[#202124] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
      style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}
    >
      <div className="flex h-9 items-end gap-2 bg-[#202124] pl-2">
        <div className="flex h-8 min-w-0 max-w-[240px] flex-1 items-center gap-2 rounded-t-lg bg-[#35363A] px-3 text-[12px] text-[#E8EAED]">
          {favicon && <Image src={favicon} alt="" width={14} height={14} unoptimized className="rounded-sm" />}
          <span className="truncate">{title}</span>
          <span className="ml-auto text-[#9AA0A6]">✕</span>
        </div>
        <span className="mb-1.5 text-lg leading-none text-[#9AA0A6]">+</span>
        <span className="ml-auto flex h-full items-center gap-5 px-4 text-[12px] text-[#9AA0A6]" aria-hidden>
          <span>─</span>
          <span>▢</span>
          <span>✕</span>
        </span>
      </div>
      <div className="flex h-10 items-center gap-3 bg-[#35363A] px-3 text-[#9AA0A6]">
        <span className="text-sm" aria-hidden>
          ←&nbsp;&nbsp;→&nbsp;&nbsp;↻
        </span>
        <span className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#202124] px-3 text-[12.5px]">
          <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden>
            <rect x="1" y="5" width="9" height="6.5" rx="1.2" fill="#9AA0A6" />
            <path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="#9AA0A6" strokeWidth="1.3" />
          </svg>
          <span className="truncate text-[#E8EAED]">{url}</span>
        </span>
      </div>
      <div className="relative bg-white">{children}</div>
    </div>
  );
}
