import { profile } from '@/lib/profile';
import AppDock from './AppDock';
import MonroviaTime from './MonroviaTime';

export default function Hero() {
  return (
    <section id="top" className="page pb-16 pt-14 sm:pb-24 sm:pt-24">
      <p className="text-[15px] font-semibold text-slate">
        {profile.name}, {profile.role.toLowerCase()}
      </p>
      <h1
        className="mt-4 max-w-[17ch] text-[2.6rem] font-extrabold leading-[0.98] sm:text-7xl lg:text-[5.5rem]"
        style={{ letterSpacing: '-0.045em' }}
      >
        {profile.headline}
      </h1>
      <p className="mt-7 max-w-prose text-lg leading-relaxed text-slate">{profile.intro}</p>

      <div className="mt-9 flex flex-wrap gap-3">
        <a href="#work" className="btn-solid">
          See my work
        </a>
        <a href={`mailto:${profile.contacts.email}`} className="btn-line">
          Email me
        </a>
      </div>

      <div className="mt-16 sm:mt-20">
        <AppDock />
        <div className="mt-4 px-1">
          <MonroviaTime timeZone={profile.timeZone} />
        </div>
      </div>
    </section>
  );
}
