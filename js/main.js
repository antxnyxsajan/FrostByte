// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link:not(.btn-nav)');

  // Mobile Menu Toggle
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('nav-open');
    });
  }

  // Close mobile menu when a regular link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const matchingLink = document.querySelector(`.nav-link[data-target="${id}"]`);
        if (matchingLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }, { root: null, threshold: 0.3 });
  
  sections.forEach(s => sectionObserver.observe(s));

  // Scroll Reveal Animation
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        revealObserver.unobserve(e.target);
      }
    });
  }, { root: null, threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Countdown Timer for FrostByte (Dec 18, 2025, 10:00 AM)
  (function countdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    
    // Set to Dec 18, 2025
    const eventDate = new Date('2025-12-18T10:00:00');

    function update() {
      const now = new Date();
      let diff = Math.max(0, eventDate - now);
      
      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000);
      diff -= hours * 3600000;
      const mins = Math.floor(diff / 60000);
      diff -= mins * 60000;
      const secs = Math.floor(diff / 1000);
      
      el.textContent = `${days}d : ${String(hours).padStart(2,'0')}h : ${String(mins).padStart(2,'0')}m : ${String(secs).padStart(2,'0')}s`;
    }
    update();
    setInterval(update, 1000);
  })();

  // Optimized Canvas Snow Effect
  const canvas = document.getElementById('snow-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const isMobile = width < 768;
    const snowflakeCount = isMobile ? 100 : 300;
    const snowflakes = [];

    function createSnowflakes() {
      for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (isMobile ? 3 : 4) + 1, // used for font size
          density: Math.random() * 10, // used for sine wave offset
          speed: Math.random() * (isMobile ? 1 : 1.5) + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          drift: Math.random() * (isMobile ? 0.5 : 1) + 0.5,
        });
      }
    }

    function drawSnowflakes() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < snowflakes.length; i++) {
        const snowflake = snowflakes[i];
        ctx.font = `${snowflake.radius * 3}px serif`; // Scale font size based on radius
        ctx.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`; // Use random opacity
        ctx.fillText('❄', snowflake.x, snowflake.y);
      }
      updateSnowflakes();
    }

    let angle = 0;
    function updateSnowflakes() {
      angle += 0.01;
      for (let i = 0; i < snowflakes.length; i++) {
        const snowflake = snowflakes[i];
        // Update position
        snowflake.y += Math.pow(snowflake.radius, 0.5) * snowflake.speed;
        snowflake.x += Math.sin(angle + snowflake.density) * snowflake.drift;

        // Reset if off-screen
        if (snowflake.y > height) {
          snowflakes[i] = {
            x: Math.random() * width,
            y: -10,
            radius: Math.random() * (isMobile ? 2 : 3) + 1,
            density: Math.random() * 10,
            speed: Math.random() * (isMobile ? 0.5 : 1) + 0.5,
            opacity: Math.random() * 0.5 + 0.5,
            drift: Math.random() * (isMobile ? 0.5 : 1) + 0.5,
          };
        }
      }
    }

    function animate() {
      drawSnowflakes();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      snowflakes.length = 0;
      createSnowflakes();
    });

    createSnowflakes();
    animate();
  }
});