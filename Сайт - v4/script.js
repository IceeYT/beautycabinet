(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav-menu');
  const bookingForm = document.getElementById('booking-form');
  const bookingSuccess = document.getElementById('booking-success');
  const phoneInput = document.getElementById('booking-phone');
  const dateInput = document.getElementById('booking-date');
  const reviewsTrack = document.getElementById('reviews-track');
  const reviewsDots = document.getElementById('reviews-dots');
  const body = document.body;

  let reviewIndex = 0;
  const dikidiUrl = 'http://dikidi.ru/ru/profile/zimfira_1710689';

  /* Smooth scroll helper */
  function smoothScrollTo(targetEl) {
    const headerHeight = header.offsetHeight;
    const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /* Header scroll */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* Hero "Записаться" button — first scroll, second Dikidi */
  const heroBookingBtn = document.querySelector('.hero-actions .btn');
  const heroPricingBtn = document.querySelectorAll('.hero-actions .btn')[1];
  const bookingSection = document.getElementById('booking');
  const pricingSection = document.getElementById('pricing');
  let hasScrolledToBooking = false;

  if (heroBookingBtn && bookingSection) {
    heroBookingBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (!hasScrolledToBooking) {
        smoothScrollTo(bookingSection);
        hasScrolledToBooking = true;
        setTimeout(() => {
          hasScrolledToBooking = false;
        }, 2000);
      } else {
        window.location.href = dikidiUrl;
      }
    });
  }

  /* Hero "Посмотреть прайс" button — smooth scroll to pricing */
  if (heroPricingBtn && pricingSection) {
    heroPricingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo(pricingSection);
    });
  }

  /* Mobile nav toggle */
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    if (isOpen) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      nav.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  /* Close nav on overlay click */
  const overlay = document.querySelector('.nav-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  }

  /* Logo click — smooth scroll to top on mobile */
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* Nav items — smooth scroll for all links (desktop + mobile) */
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          /* Close mobile menu if open */
          nav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          smoothScrollTo(targetEl);
        }
      }
    });
  });

  /* Accordion — JS-driven scrollHeight animation (0.6s, very smooth) */
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(trigger => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    if (!panel) return;

    // Step 1: Let panel render with full height first to compute scrollHeight
    panel.classList.toggle('is-open', expanded);

    if (expanded) {
      // Opened panel: content must be visible
      panel.querySelectorAll('.price-list, .price-item, p').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    } else {
      // Closed panel: hide content
      panel.querySelectorAll('.price-list, .price-item, p').forEach(el => {
        el.style.opacity = '';
        el.style.transform = '';
      });
      panel.style.height = '0px';
      panel.style.overflow = 'hidden';
      panel.style.transition = 'none';
    }

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        // Close: animate to 0
        const currentH = panel.scrollHeight;
        panel.querySelectorAll('.price-list, .price-item, p').forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(6px)';
        });
        panel.style.transition = 'height 0.5s cubic-bezier(0.55, 0.06, 0.68, 0.19)';
        panel.style.height = '0px';
        panel.classList.remove('is-open');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        // Open: animate from 0 to full height
        const targetH = panel.scrollHeight;
        panel.classList.add('is-open');
        panel.querySelectorAll('.price-list, .price-item, p').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
        panel.style.transition = 'none';
        panel.style.height = '0px';
        panel.offsetHeight; // reflow
        panel.style.transition = 'height 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        panel.style.height = targetH + 'px';
      }
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  /* Reveal delays */
  document.querySelectorAll('.reveal[data-delay]').forEach(el => {
    el.style.setProperty('--delay', el.dataset.delay);
  });

  /* Scroll reveal */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* Hero entrance on load */
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 150);
  });

  /* Illustration draw animation */
  const illustrationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          illustrationObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.draw-illustration').forEach(el => illustrationObserver.observe(el));

  /* Parallax */
  if (!prefersReducedMotion) {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    const illustrations = document.querySelectorAll('.section-illustration, .hero-illustration');

    function updateParallax() {
      const scrollY = window.scrollY;

      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });

      illustrations.forEach(el => {
        const rect = el.getBoundingClientRect();
        const offset = (rect.top - window.innerHeight / 2) * 0.03;
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  } else {
    document.querySelectorAll('.draw-illustration').forEach(el => el.classList.add('visible'));
  }

  /* Reviews slider */
  const reviewCards = reviewsTrack.querySelectorAll('.review-card');
  const totalReviews = reviewCards.length;

  reviewCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0);
    dot.addEventListener('click', () => goToReview(i));
    reviewsDots.appendChild(dot);
  });

  /* Swipe support for reviews slider */
  let isDragging = false;
  let startDragX = 0;
  let currentTranslate = 0;
  let targetTranslate = 0;
  let cardWidth = 0;
  let maxTranslate = 0;
  let velocity = 0;
  let lastDragX = 0;
  let lastDragTime = 0;
  let rafId = null;
  let isAnimating = false;

  function calcDimensions() {
    const trackW = reviewsTrack.scrollWidth;
    const containerW = reviewsTrack.parentElement.offsetWidth;
    cardWidth = trackW / totalReviews;
    maxTranslate = -(trackW - containerW);
  }

  function setTranslate(x) {
    if (x > 0) x = 0;
    if (x < maxTranslate) x = maxTranslate;
    currentTranslate = x;
    reviewsTrack.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  function goToReview(index) {
    reviewIndex = index;
    targetTranslate = -index * cardWidth;
    isAnimating = true;

    const start = currentTranslate;
    const diff = targetTranslate - start;
    const duration = 400;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // cubic-bezier(0.25, 0.46, 0.45, 0.94) approximation
      const ease = 1 - Math.pow(1 - progress, 3);
      setTranslate(start + diff * ease);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        isAnimating = false;
        reviewsDots.querySelectorAll('.reviews-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
          dot.setAttribute('aria-selected', i === index);
        });
      }
    }

    reviewsDots.querySelectorAll('.reviews-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index);
    });

    rafId = requestAnimationFrame(animate);
  }

  function snapToCard() {
    const index = Math.round(-currentTranslate / cardWidth);
    const clampedIndex = Math.max(0, Math.min(index, totalReviews - 1));
    goToReview(clampedIndex);
  }

  function handleDragStart(e) {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    isDragging = true;
    isAnimating = false;
    calcDimensions();
    targetTranslate = -reviewIndex * cardWidth;
    currentTranslate = targetTranslate;
    startDragX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    lastDragX = startDragX;
    lastDragTime = Date.now();
    velocity = 0;
    reviewsTrack.style.transition = 'none';
    reviewsTrack.style.willChange = 'transform';
  }

  function handleDragMove(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diff = currentX - startDragX;
    const now = Date.now();
    const dt = now - lastDragTime;

    if (dt > 0) {
      velocity = (currentX - lastDragX) / dt;
    }

    lastDragX = currentX;
    lastDragTime = now;
    setTranslate(targetTranslate + diff);
  }

  function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const threshold = cardWidth * 0.2;
    const diff = lastDragX - startDragX;

    if (Math.abs(velocity) > 0.8) {
      const dir = velocity > 0 ? -1 : 1;
      const newIndex = Math.max(0, Math.min(reviewIndex + dir, totalReviews - 1));
      goToReview(newIndex);
    } else if (Math.abs(diff) > threshold) {
      if (diff > 0 && reviewIndex > 0) {
        goToReview(reviewIndex - 1);
      } else if (diff < 0 && reviewIndex < totalReviews - 1) {
        goToReview(reviewIndex + 1);
      } else {
        goToReview(reviewIndex);
      }
    } else {
      goToReview(reviewIndex);
    }

    reviewsTrack.style.willChange = 'auto';
  }

  reviewsTrack.addEventListener('touchstart', handleDragStart, { passive: true });
  reviewsTrack.addEventListener('touchmove', handleDragMove, { passive: true });
  reviewsTrack.addEventListener('touchend', handleDragEnd, { passive: true });
  reviewsTrack.addEventListener('mousedown', handleDragStart);
  reviewsTrack.addEventListener('mousemove', handleDragMove);
  reviewsTrack.addEventListener('mouseup', handleDragEnd);
  reviewsTrack.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      snapToCard();
      reviewsTrack.style.willChange = 'auto';
    }
  });

  reviewsTrack.style.cursor = 'grab';
  reviewsTrack.addEventListener('mousedown', () => { reviewsTrack.style.cursor = 'grabbing'; });
  reviewsTrack.addEventListener('mouseup', () => { reviewsTrack.style.cursor = 'grab'; });

  /* Booking form */
  if (bookingForm) {
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }
      if (bookingSuccess) {
        bookingSuccess.hidden = false;
      }
      bookingForm.reset();
      if (bookingSuccess) {
        bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { bookingSuccess.hidden = true; }, 6000);
      }
    });
  }

  /* Phone mask */
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (!val.startsWith('7') && val.length) val = '7' + val;

      let formatted = '';
      if (val.length > 0) formatted = '+7';
      if (val.length > 1) formatted += ' (' + val.slice(1, 4);
      if (val.length > 4) formatted += ') ' + val.slice(4, 7);
      if (val.length > 7) formatted += '-' + val.slice(7, 9);
      if (val.length > 9) formatted += '-' + val.slice(9, 11);

      e.target.value = formatted;
    });
  }

  /* Theme toggle */
  const themeToggle = document.querySelector('.theme-toggle');

  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark');
    } else {
      /* Force light theme on first load */
      localStorage.setItem('theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      const isDark = body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  /* Back to top */
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Particles */
  if (!prefersReducedMotion) {
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let animationId;
      let w, h;

      function resize() {
        const hero = canvas.parentElement;
        w = canvas.width = hero.offsetWidth;
        h = canvas.height = hero.offsetHeight;
      }

      function createParticles() {
        particles = [];
        const count = Math.floor((w * h) / 18000);
        for (let i = 0; i < Math.max(count, 15); i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3 - 0.1,
            opacity: Math.random() * 0.5 + 0.2,
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, w, h);
        const isDark = body.classList.contains('dark');
        const baseColor = isDark ? '200, 200, 200' : '180, 165, 150';

        particles.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${baseColor}, ${p.opacity})`;
          ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(${baseColor}, ${0.08 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        animationId = requestAnimationFrame(draw);
      }

      resize();
      createParticles();
      draw();

      window.addEventListener('resize', () => {
        resize();
        createParticles();
      });
    }
  }
})();
