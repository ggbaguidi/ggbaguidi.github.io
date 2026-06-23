document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-button');
  const navLinks = document.querySelector('.nav-links');
  const progress = document.querySelector('.page-progress span');
  const cursorGlow = document.querySelector('.cursor-glow');

  document.getElementById('year').textContent = new Date().getFullYear();

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      navLinks.classList.toggle('open', !isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navLinks.classList.remove('open');
    }));
  }

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

    window.addEventListener('pointermove', (event) => {
      if (!cursorGlow) return;
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }, { passive: true });
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }
});
