import type { Project } from '@/lib/projects';
import ProjectMark from './ProjectMark';

export default function FeaturedProject({ project }: { project: Project }) {
  return (
    <article id={project.id} className="grid gap-6 py-12 sm:grid-cols-[auto_1fr] sm:gap-10 lg:py-16">
      <ProjectMark project={project} size={112} className="sm:mt-1" />

      <div className="max-w-3xl">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{project.name}</h3>
          <p className="text-mist/60">
            {project.kind}, {project.year}
          </p>
          {project.status && (
            <span className="rounded-full bg-sun px-3 py-0.5 text-sm font-semibold text-[rgb(14_26_43)]">
              {project.status}
            </span>
          )}
        </div>

        <p className="mt-4 text-lg leading-relaxed text-mist/85">{project.summary}</p>
        <p className="mt-4 text-[15px] text-mist/60">Built with {project.stack.join(', ')}</p>

        {project.details && (
          <details className="group mt-6">
            <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-2 font-semibold text-mist [&::-webkit-details-marker]:hidden">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-mist/40 text-sm transition-transform group-open:rotate-45">
                +
              </span>
              How it’s built
            </summary>
            <ul className="mt-3 space-y-2 border-l-2 border-sun pl-5 text-mist/80">
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
