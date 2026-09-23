import type { Project } from '@/lib/projects';
import ProjectMark from './ProjectMark';
import DemoButton from './DemoButton';

export default function ProjectItem({ project }: { project: Project }) {
  return (
    <li id={project.id} data-item className="group flex gap-5">
      <ProjectMark
        project={project}
        size={60}
        className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
      />
      <div className="border-b border-line pb-8">
        <h4 className="text-xl font-bold tracking-tight">
          {project.name}
          <span className="ml-2 font-normal text-slate">{project.year}</span>
        </h4>
        <p className="text-[15px] font-semibold text-slate">{project.kind}</p>
        <p className="mt-2 leading-relaxed">{project.summary}</p>
        <p className="mt-2 text-sm text-slate">{project.stack.join(', ')}</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <DemoButton
            project={project}
            className="rounded-full bg-sun px-4 py-1.5 text-sm font-bold text-black transition-transform hover:scale-105"
          />
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer" className="link text-sm font-semibold">
              Source on GitHub
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
