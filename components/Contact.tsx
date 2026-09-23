import { profile } from '@/lib/profile';

export default function Contact() {
  const { email, github, githubHandle } = profile.contacts;

  return (
    <section id="contact" className="bg-sun py-20 text-[rgb(14_26_43)] sm:py-28">
      <div className="page">
        <h2 className="heading max-w-[18ch]">Building something? Tell me about it.</h2>
        <p className="mt-5 max-w-prose text-lg leading-relaxed">
          Project briefs, collaborations and internship offers are all welcome. I usually reply within a day.
        </p>

        <a
          href={`mailto:${email}`}
          className="mt-10 inline-block break-all text-3xl font-extrabold underline decoration-2 underline-offset-[6px] transition-[text-decoration-thickness] hover:decoration-[5px] sm:text-5xl lg:text-6xl"
          style={{ letterSpacing: '-0.035em' }}
        >
          {email}
        </a>

        <p className="mt-8 text-lg">
          Code lives on GitHub at{' '}
          <a href={github} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4">
            {githubHandle}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
