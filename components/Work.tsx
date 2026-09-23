import { featured, others } from '@/lib/projects';
import FeaturedProject from './FeaturedProject';
import ProjectItem from './ProjectItem';

/** Always-dark band: the part of the page that carries the most weight. */
export default function Work() {
  return (
    <section id="work" className="bg-navy py-20 text-mist sm:py-28">
      <div className="page">
        <div className="max-w-prose">
          <h2 className="heading">Selected work</h2>
          <p className="mt-5 text-lg leading-relaxed text-mist/70">
            Three projects I’d walk you through first, then everything else I’ve built over the last two years.
          </p>
        </div>

        <div className="mt-14 divide-y divide-mist/15 border-y border-mist/15">
          {featured.map((project) => (
            <FeaturedProject key={project.id} project={project} />
          ))}
        </div>

        <h3 className="mt-20 text-2xl font-bold tracking-tight">More projects</h3>
        <ul className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {others.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </ul>
      </div>
    </section>
  );
}
