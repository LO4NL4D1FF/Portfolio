import { services } from '@/lib/services';

export default function Services() {
  return (
    <section id="services" className="page py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="heading">Hire me for</h2>
          <p className="mt-5 max-w-sm leading-relaxed text-slate">
            Starting prices for individuals and small teams. Organizations get a quote after a short call about scope.
          </p>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {services.map((s) => (
            <li key={s.id} className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:gap-x-8">
              <h3 className="text-xl font-bold tracking-tight">{s.name}</h3>
              <p className="font-semibold sm:row-span-2 sm:text-right">{s.price}</p>
              <div>
                <p className="leading-relaxed text-slate">{s.description}</p>
                <p className="mt-1 text-[15px] text-slate/80">Includes: {s.includes.join('; ')}.</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
