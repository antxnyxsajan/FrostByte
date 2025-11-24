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

  // Simple JavaScript Snow Effect
  const snowflakeCount = 500; // Increased density significantly
  const snowflakes = [];

  function createSnowflake() {
    const snowflake = document.createElement('div'); // Still a div, but will contain text
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '❄'; // Use Unicode snowflake character
    document.body.appendChild(snowflake);

    // Initial random properties
    snowflake.style.position = 'fixed';
    snowflake.style.zIndex = '0';
    snowflake.style.pointerEvents = 'none';
    snowflake.style.color = 'white'; // Color of the Unicode character
    
    // Size and basic shape
    snowflake.size = Math.random() * 5 + 10; // Size between 10px and 15px for font-size
    snowflake.style.fontSize = snowflake.size + 'px'; // Use fontSize for text character
    // Remove width, height, and box-shadow styling, as character will define shape/size

    snowflake.x = Math.random() * window.innerWidth;
    snowflake.y = Math.random() * window.innerHeight; // Start anywhere on screen
    snowflake.speed = Math.random() * 2 + 1; // Speed between 1 and 3
    snowflake.opacity = Math.random() * 0.8 + 0.2; // Opacity between 0.2 and 1
    snowflake.style.opacity = snowflake.opacity; // Opacity for the character
    
    snowflake.driftOffset = Math.random() * Math.PI * 2; // Random offset for drift
    snowflake.driftAmplitude = Math.random() * 1 + 0.5; // Random amplitude for drift (0.5 to 1.5)

    // Apply blur based on size for more realism (smaller = more blurred)
    // Min size 10px, Max size 15px
    // Blur range 0.5px to 3px, inversely proportional to size
    snowflake.style.filter = `blur(${((15 - snowflake.size) / 5) * 2.5 + 0.5}px)`; // Blur 0.5 to 3px

    snowflake.rotation = Math.random() * 360; // Initial random rotation
    snowflake.rotationSpeed = Math.random() * 0.5 - 0.25; // Rotation speed between -0.25 and 0.25 deg/frame

    snowflakes.push(snowflake);
    return snowflake;
  }

  function animateSnowflakes() {
    for (let i = 0; i < snowflakes.length; i++) {
      const snowflake = snowflakes[i];
      snowflake.y += snowflake.speed;
      // More realistic horizontal drift with random amplitude and offset
      snowflake.x += Math.sin(snowflake.y * 0.01 + snowflake.driftOffset) * (0.7 + snowflake.driftAmplitude); // Increased base drift

      // Update rotation
      snowflake.rotation += snowflake.rotationSpeed;

      // Reset if off-screen
      if (snowflake.y > window.innerHeight) {
        snowflake.y = -snowflake.size;
        snowflake.x = Math.random() * window.innerWidth;
        // Re-randomize drift and rotation for continuity
        snowflake.driftOffset = Math.random() * Math.PI * 2;
        snowflake.driftAmplitude = Math.random() * 1 + 0.5;
        snowflake.rotation = Math.random() * 360;
        snowflake.rotationSpeed = Math.random() * 0.5 - 0.25;
      }
      // If it drifts too far left or right, bring it back
      if (snowflake.x < -snowflake.size) {
        snowflake.x = window.innerWidth;
      } else if (snowflake.x > window.innerWidth + snowflake.size) {
        snowflake.x = -snowflake.size;
      }

      snowflake.style.top = snowflake.y + 'px';
      snowflake.style.left = snowflake.x + 'px';
      snowflake.style.transform = `rotate(${snowflake.rotation}deg)`; // Apply rotation
    }
    requestAnimationFrame(animateSnowflakes);
  }

  // Create snowflakes
  for (let i = 0; i < snowflakeCount; i++) {
    createSnowflake();
  }

  // Start animation
  animateSnowflakes();
});