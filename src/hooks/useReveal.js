import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Blendet jedes Element mit [data-reveal] beim Scrollen ein und legt
 * einen dezenten Parallax auf die Hero-Elemente.
 * data-reveal="120" = 120 ms Verzoegerung.
 *
 * Läuft nach jedem Routenwechsel neu (Abhängigkeit von location.pathname),
 * damit Shop-Seiten dieselbe Einblend-Animation bekommen wie die Startseite.
 */
export default function useReveal() {
  const location = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll('[data-reveal]'));

    if (reduce) {
      els.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition =
        'opacity .75s cubic-bezier(.22,.7,.3,1), transform .75s cubic-bezier(.22,.7,.3,1)';
      el.style.transitionDelay = (Number(el.dataset.reveal) || 0) + 'ms';
      el.style.willChange = 'opacity, transform';
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));

    const nav = document.getElementById('ag-nav');
    const bloom = document.getElementById('ag-bloom');
    const art = document.getElementById('ag-hero-art');
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        if (nav) nav.dataset.stuck = y > 12 ? 'true' : 'false';
        if (bloom) bloom.style.transform = 'translateY(' + y * 0.12 + 'px)';
        if (art) art.style.transform = 'translateY(' + y * -0.045 + 'px)';
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [location.pathname]);
}
