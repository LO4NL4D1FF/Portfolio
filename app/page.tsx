import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/hero/Hero';
import Marquee from '@/components/Marquee';
import Work from '@/components/Work';
import DayJob from '@/components/DayJob';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import SiteFooter from '@/components/SiteFooter';

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-sun focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to work
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <DayJob />
        <Services />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
