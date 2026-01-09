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
    const eventDate = new Date('2026-01-09T10:00:00');

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

      el.textContent = `${days}d : ${String(hours).padStart(2, '0')}h : ${String(mins).padStart(2, '0')}m : ${String(secs).padStart(2, '0')}s`;
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
    const snowflakeCount = isMobile ? 50 : 200;
    const snowflakes = [];

    function createSnowflakes() {
      for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (isMobile ? 4 : 8) + 1, // used for font size
          density: Math.random() * 10, // used for sine wave offset
          speed: Math.random() * (isMobile ? 0.8 : 1.5) + 0.2,
          opacity: Math.random() * 0.5 + 0.5,
          drift: Math.random() * (isMobile ? 0.3 : 1) + 0.2,
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
            radius: Math.random() * (isMobile ? 2 : 5) + 1,
            density: Math.random() * 10,
            speed: Math.random() * (isMobile ? 0.8 : 1.5) + 0.2,
            opacity: Math.random() * 0.5 + 0.5,
            drift: Math.random() * (isMobile ? 0.3 : 1) + 0.2,
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

  // --- Registration Logic (Modal + Particles + Glitch) ---
  const registerForm = document.getElementById('registerForm');
  const modal = document.getElementById('registrationClosedModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const messageDiv = document.getElementById('message');

  // Helper: Create Snow/Confetti Burst
  function createSnowBurst() {
    const burstCount = 60;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < burstCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('snow-particle');
      document.body.appendChild(particle);

      // Random direction and distance
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 150;
      const tx = Math.cos(angle) * dist + 'px';
      const ty = Math.sin(angle) * dist + 'px';

      particle.style.setProperty('--tx', tx);
      particle.style.setProperty('--ty', ty);

      // Random animation duration
      particle.style.animation = `snowBurst ${0.8 + Math.random() * 0.5}s ease-out forwards`;

      // Cleanup
      setTimeout(() => {
        particle.remove();
      }, 1500);
    }
  }

  // Helper: Show Modal and Handle Callback
  function showRegistrationModal(onConfirmCallback) {
    if (!modal) return;

    // 1. Show Modal
    modal.classList.add('show');

    // 2. Trigger Effects
    createSnowBurst();

    // Convert to Border Glitch Effect
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.classList.add('glitch-border');
      modalContent.classList.add('show-effect'); // Trigger opacity
    }

    // 3. Define Clean-up & Confirm Logic
    const handleConfirm = () => {
      modal.classList.remove('show');

      // Stop glitch when closed
      if (modalContent) {
        modalContent.classList.remove('glitch-border');
        modalContent.classList.remove('show-effect');
      }

      if (typeof onConfirmCallback === 'function') {
        onConfirmCallback();
      }
    };

    // 4. Attach Listeners (One-time use)
    const oneTimeClose = () => {
      handleConfirm();
      modalCloseBtn.removeEventListener('click', oneTimeClose);
      modal.removeEventListener('click', outsideClick);
    };

    const outsideClick = (e) => {
      if (e.target === modal) {
        oneTimeClose();
      }
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', oneTimeClose);
    modal.addEventListener('click', outsideClick);
  }

  // A. Handle "Initialize Sequence" Form (register.html)
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      showRegistrationModal(() => {
        // Proceed with Form Submission logic
        const btn = registerForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = "Transmitting Data...";
        btn.disabled = true;
        if (messageDiv) messageDiv.textContent = "";

        const formData = new FormData(registerForm);

        fetch(registerForm.action, {
          method: 'POST',
          body: formData
        })
          .then(response => response.text())
          .then(text => {
            if (messageDiv) {
              messageDiv.textContent = "Registration Successful! Welcome to the system.";
              messageDiv.style.color = "#22d3ee"; // Cyan
            }
            registerForm.reset();
          })
          .catch(error => {
            if (messageDiv) {
              messageDiv.textContent = "Connection Error. Please try again.";
              messageDiv.style.color = "#ef4444"; // Red
            }
            console.error(error);
          })
          .finally(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          });
      });
    });
  }

  // B. Handle "Register" Links (index.html & Navbar)
  const registerLinks = document.querySelectorAll('a[href*="docs.google.com/forms"], a[href*="register.html"]'); // Broad capture
  // Note: register.html itself might have links to register.html, avoid recursion loops if necessary.

  registerLinks.forEach(link => {
    // Only intercept if it points to Google Forms OR if we want to intercept the internal navigation to register.html
    // User asked: "when I click the Register button... pop up... Do NOT remove google forms redirection"
    // The nav link to register.html just goes to the page. The modal should appear when clicking the "Button" to submit/register.
    // BUT on index.html, the Register button goes to Google Forms. So we intercept THAT.

    if (link.href.includes("docs.google.com/forms")) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetUrl = this.href;
        const targetWindow = this.target || '_self';

        showRegistrationModal(() => {
          window.open(targetUrl, targetWindow);
        });
      });
    }
  });

  const curtainOverlay = document.getElementById('curtain-overlay');
  if (curtainOverlay) {
    // Open the curtain after a short delay
    setTimeout(() => {
      curtainOverlay.classList.add('open');
    }, 500);
  }
});