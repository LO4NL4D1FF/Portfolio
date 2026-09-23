import { profile, skillGroups } from '@/lib/profile';

export default function About() {
  return (
    <section id="about" className="border-t border-line bg-surface py-20 sm:py-28">
      <div className="page grid gap-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-20">
        <div>
          <h2 className="heading">About me</h2>
          <div className="mt-8 max-w-prose space-y-5 text-lg leading-relaxed">
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <dl className="divide-y divide-line border-y border-line">
            {profile.facts.map((f) => (
              <div key={f.term} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5">
                <dt className="text-slate">{f.term}</dt>
                <dd className="font-medium">{f.detail}</dd>
              </div>
            ))}
          </dl>

          {skillGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-bold">{group.title}</h3>
              <p className="mt-2 leading-relaxed text-slate">{group.items.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
