import Image from 'next/image';
import type { Project } from '@/lib/projects';
import DemoButton from './DemoButton';

interface FeaturedProjectProps {
  project: Project;
  /** Put the visual on the right instead of the left. */
  flip?: boolean;
}

const DEFAULT_BRAND = { bg: '#000000', accent: '#F5B82E' };

/** A two-part card: the app's own colors and logo on one side, the story on the other. */
export default function FeaturedProject({ project, flip = false }: FeaturedProjectProps) {
  const brand = project.brand ?? DEFAULT_BRAND;

  return (
    <article
      id={project.id}
      data-featured
      className="grid overflow-hidden rounded-[2rem] bg-white text-black lg:grid-cols-2"
    >
      <div
        className={`relative flex min-h-[320px] items-center justify-center overflow-hidden sm:min-h-[420px] ${flip ? 'lg:order-2' : ''}`}
        style={{ background: brand.bg }}
      >
        <span
          data-watermark
          aria-hidden
          className="absolute bottom-[-0.12em] left-0 whitespace-nowrap text-[9rem] font-extrabold leading-none text-transparent sm:text-[13rem]"
          style={{ WebkitTextStroke: `1.5px ${brand.accent}`, opacity: 0.35, letterSpacing: '-0.05em' }}
        >
          {project.name} {project.name}
        </span>
        <span aria-hidden className="absolute left-8 top-8 h-3 w-24 rounded-full" style={{ background: brand.accent }} />
        <span aria-hidden className="absolute left-8 top-14 h-3 w-14 rounded-full opacity-50" style={{ background: brand.accent }} />
        {project.logo && (
          <Image
            data-logo
            src={project.logo}
            alt={`${project.name} logo`}
            width={200}
            height={200}
            className="relative h-40 w-40 rounded-[22%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] sm:h-52 sm:w-52"
          />
        )}
      </div>

      <div className="flex flex-col justify-center p-7 sm:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-neutral-500">
            {project.kind}, {project.year}
          </p>
          {project.status && (
            <span className="rounded-full bg-sun px-3 py-0.5 text-sm font-semibold text-black">{project.status}</span>
          )}
        </div>
        <h3 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ letterSpacing: '-0.04em' }}>
          {project.name}
        </h3>
        <p className="mt-5 text-lg leading-relaxed">{project.summary}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600">
              {tech}
            </li>
          ))}
        </ul>

        <DemoButton
          project={project}
          className="btn mt-7 self-start rounded-full bg-black px-6 text-white transition-transform hover:scale-[1.03]"
        />

        {project.details && (
          <details className="group mt-6">
            <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-2 font-semibold [&::-webkit-details-marker]:hidden">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-black text-white transition-transform duration-300 group-open:rotate-45">
                +
              </span>
              How it’s built
            </summary>
            <ul className="mt-3 space-y-2 border-l-2 pl-5 text-neutral-600" style={{ borderColor: brand.accent }}>
              {project.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </article>
  );
}
