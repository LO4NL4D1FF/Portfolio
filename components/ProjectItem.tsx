import type { Project } from '@/lib/projects';
import ProjectMark from './ProjectMark';

export default function ProjectItem({ project }: { project: Project }) {
  return (
    <li id={project.id} className="flex gap-5">
      <ProjectMark project={project} size={52} />
      <div>
        <h4 className="text-lg font-bold tracking-tight">
          {project.name}
          <span className="ml-2 font-normal text-mist/55">{project.year}</span>
        </h4>
        <p className="text-[15px] text-mist/60">{project.kind}</p>
        <p className="mt-2 leading-relaxed text-mist/85">{project.summary}</p>
        <p className="mt-2 text-sm text-mist/55">{project.stack.join(', ')}</p>
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noreferrer" className="link mt-2 inline-block text-sm text-mist">
            Source on GitHub
          </a>
        )}
      </div>
    </li>
  );
}
