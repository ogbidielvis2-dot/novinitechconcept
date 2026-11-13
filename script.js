document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking navigation items
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Intersection Observer for Scroll Animations
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger stat counters if inside a revealed section
        const counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(counter => animateCounter(counter));
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Stat Counter Animation Logic
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    let current = 0;
    const duration = 1500; // ms
    const increment = target / (duration / 16);

    const updateCount = () => {
      current += increment;
      if (current < target) {
        element.innerText = Math.ceil(current) + suffix;
        requestAnimationFrame(updateCount);
      } else {
        element.innerText = target + suffix;
      }
    };

    updateCount();
  }
});