import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import Work from '@/components/Work';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import SiteFooter from '@/components/SiteFooter';

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-sun focus:px-4 focus:py-2 focus:text-[rgb(14_26_43)]"
      >
        Skip to work
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <Work />
        <Services />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
