import Image from 'next/image';
import type { Project } from '@/lib/projects';

interface ProjectMarkProps {
  project: Project;
  size: number;
  className?: string;
}

/** App icon for a project, or a lettered tile when there is no logo. */
export default function ProjectMark({ project, size, className = '' }: ProjectMarkProps) {
  const shape = `shrink-0 overflow-hidden rounded-icon ${className}`;

  if (project.logo) {
    return (
      <Image
        src={project.logo}
        alt=""
        width={size}
        height={size}
        unoptimized={project.logo.endsWith('.svg')}
        className={`${shape} object-cover`}
        style={{ width: size, height: size, background: project.logoBg ?? '#fff' }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`${shape} grid place-items-center bg-sun font-extrabold text-black`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {project.name.charAt(0)}
    </span>
  );
}
