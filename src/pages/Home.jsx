import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Specs from '../components/Specs.jsx';
import ControlGrid from '../components/ControlGrid.jsx';
import Climate from '../components/Climate.jsx';
import AppControl from '../components/AppControl.jsx';
import TentTour from '../components/TentTour.jsx';
import Quality from '../components/Quality.jsx';
import Shop from '../components/Shop.jsx';
import Contact from '../components/Contact.jsx';
import useSeo from '../hooks/useSeo.js';

/** Die bisherige Einseiten-Landingpage — unverändert, nur aus App.jsx ausgelagert. */
export default function Home() {
  const location = useLocation();

  useSeo({ path: '/' });

  // Nav-Links verweisen jetzt auf "/#kontroller" o.ä. (auch von /shop aus erreichbar).
  // React Router springt bei client-seitiger Navigation nicht automatisch zum Anker,
  // das holen wir hier nach.
  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash]);

  return (
    <main id="top">
      <Hero />
      <Specs />
      <ControlGrid />
      <Climate />
      <AppControl />
      <TentTour />
      <Quality />
      <Shop />
      <Contact />
    </main>
  );
}
