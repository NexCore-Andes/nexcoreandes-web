import Loader from '@/components/Loader';
import Cursor from '@/components/Cursor';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import Process from '@/components/Process';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Interactions from '@/components/Interactions';
import { ConsultProvider } from '@/components/ConsultContext';

export default function Home() {
  return (
    <ConsultProvider>
      <Loader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <About />
        {/* Sección de Instagram desactivada por ahora: para volver a mostrarla,
            importá Instagram desde '@/components/Instagram' y agregá <Instagram /> acá. */}
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Interactions />
    </ConsultProvider>
  );
}
