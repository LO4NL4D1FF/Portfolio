import { profile } from '@/lib/profile';
import LogoMark from './LogoMark';

const RING = 'OPEN FOR NEW WORK • REPLIES WITHIN A DAY • ';

export default function Contact() {
  const { email, github, githubHandle } = profile.contacts;

  return (
    <section id="contact" className="relative overflow-hidden bg-sun py-20 text-black sm:py-28">
      <div className="page relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <h2 className="text-5xl font-extrabold leading-[0.95] sm:text-7xl lg:text-8xl" style={{ letterSpacing: '-0.05em' }}>
            Building
            <br />
            something?
          </h2>
          <p className="mt-6 max-w-prose text-lg leading-relaxed">
            Project briefs, collaborations and job offers are all welcome. Tell me what you’re making.
          </p>

          <a
            href={`mailto:${email}`}
            className="group mt-10 inline-flex max-w-full items-center gap-4 rounded-full bg-black py-3 pl-6 pr-3 text-mist transition-transform hover:scale-[1.02]"
          >
            <span className="truncate text-lg font-bold sm:text-2xl">{email}</span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sun text-xl text-black transition-transform duration-300 group-hover:rotate-[-45deg]">
              ➜
            </span>
          </a>

          <p className="mt-8 text-lg">
            Code lives on GitHub at{' '}
            <a href={github} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4">
              {githubHandle}
            </a>
            .
          </p>
        </div>

        <div aria-hidden className="relative mx-auto grid h-56 w-56 place-items-center sm:h-72 sm:w-72">
          <svg viewBox="0 0 120 120" className="badge-spin absolute inset-0 h-full w-full">
            <defs>
              <path id="contact-ring" d="M60 60 m-48 0 a48 48 0 1 1 96 0 a48 48 0 1 1 -96 0" />
            </defs>
            <text className="fill-current text-[9.5px] font-bold" letterSpacing="1.2">
              <textPath href="#contact-ring">{RING}</textPath>
            </text>
          </svg>
          <LogoMark size={110} tone="dark" className="rotate-[-8deg]" />
        </div>
      </div>
    </section>
  );
}
