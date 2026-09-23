import type { CSSProperties } from 'react';
import { dock } from '@/lib/projects';
import ProjectMark from './ProjectMark';

/** A phone-style dock of the apps I've shipped; each icon jumps to its entry below. */
export default function AppDock() {
  return (
    <nav aria-label="Apps I’ve built">
      <ul className="flex gap-4 overflow-x-auto rounded-tray border border-line bg-surface p-4 sm:gap-6 sm:p-6 [scrollbar-width:none]">
        {dock.map((project, i) => (
          <li key={project.id} className="dock-item" style={{ '--i': i } as CSSProperties}>
            <a
              href={`#${project.id}`}
              className="group flex w-[4.5rem] flex-col items-center gap-2 sm:w-20"
            >
              <ProjectMark
                project={project}
                size={64}
                className="shadow-[0_1px_0_rgb(var(--line)),0_8px_18px_-10px_rgb(14_26_43/0.45)] transition-transform duration-200 group-hover:-translate-y-1"
              />
              <span className="w-full truncate text-center text-[13px] text-slate group-hover:text-ink">
                {project.short ?? project.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
