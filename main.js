// reMaestro site — light, dependency-free motion.
// Reveals enhance an already-visible default: if JS or IntersectionObserver is missing, or the visitor
// prefers reduced motion, everything shows immediately (the CSS reduced-motion block also forces this).

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav gets a hairline border once the page has scrolled past the hero's top.
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const revealers = document.querySelectorAll('.reveal');

  if (reduce || !('IntersectionObserver' in window)) {
    revealers.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        // Stagger siblings within the same container so a group reveals as a phrase, not a flash.
        const group = e.target.parentElement ? [...e.target.parentElement.querySelectorAll(':scope > .reveal')] : [e.target];
        const i = Math.max(0, group.indexOf(e.target));
        e.target.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
  );

  revealers.forEach((el) => io.observe(el));
})();
