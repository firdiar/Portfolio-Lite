// Mobile menu toggle
const toggle = document.querySelector('.header__toggle');
const nav = document.querySelector('.header__nav');

toggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Close menu on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
  });
});

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-bar__fill');

const animateSkills = () => {
  skillBars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 60;
    if (isVisible) {
      bar.style.setProperty('--fill-width', bar.dataset.width + '%');
      bar.classList.add('animate');
    }
  });
};

// Fade-in elements on scroll
const fadeElements = document.querySelectorAll('.project-card, .ach-card, .edu-card, .project-mini, .about__avatar, .timeline__item');

const fadeInOnScroll = () => {
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
};

// Contact form handler
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }

  const recipient = 'firdi.ansyah20@gmail.com';
  const emailSubject = subject || 'Portfolio Inquiry';
  const body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message + '\n\n---\nSent from my portfolio website';

  if (email.endsWith('@gmail.com')) {
    const gmailUrl = 'https://mail.google.com/mail/?view=cm&to=' + encodeURIComponent(recipient)
      + '&su=' + encodeURIComponent(emailSubject)
      + '&body=' + encodeURIComponent(body);
    window.open(gmailUrl, '_blank');
  } else {
    const mailtoUrl = 'mailto:' + encodeURIComponent(recipient)
      + '?subject=' + encodeURIComponent(emailSubject)
      + '&body=' + encodeURIComponent(body);
    window.open(mailtoUrl, '_blank');
  }

  form.reset();
});

// Video modal
const modal = document.getElementById('videoModal');
const iframe = document.getElementById('modalIframe');
const overlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('modalClose');

const openModal = (videoId) => {
  iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  iframe.src = '';
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

document.querySelectorAll('.project-card__video-trigger').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(link.dataset.videoId);
  });
});

overlay.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Event listeners
window.addEventListener('scroll', () => {
  animateSkills();
  fadeInOnScroll();
});

window.addEventListener('load', () => {
  animateSkills();
  fadeInOnScroll();
});

// Carousel
(function() {
  const grid = document.querySelector('.projects__grid');
  if (!grid) return;

  const realCards = [...grid.children];
  const realCount = realCards.length;
  if (realCount < 2) return;

  const carousel = document.querySelector('.projects__carousel');
  const prevBtn = carousel.querySelector('.carousel__btn--prev');
  const nextBtn = carousel.querySelector('.carousel__btn--next');
  const dotsContainer = carousel.querySelector('.carousel__dots');

  // Clone for infinite loop
  grid.appendChild(realCards[0].cloneNode(true));
  grid.insertBefore(realCards[realCount - 1].cloneNode(true), realCards[0]);

  const allCards = [...grid.children];
  let currentReal = 0;
  let isAnimating = false;
  let progScroll = false;
  let autoTimer, interactionTimer;

  // Create dots
  for (let i = 0; i < realCount; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
  const dots = [...dotsContainer.children];

  const updateDots = (i) => dots.forEach((d, j) => d.classList.toggle('active', j === i));

  const targetLeft = (i) => allCards[i + 1].offsetLeft;

  const scrollToCard = (allIdx) => {
    if (isAnimating || window.innerWidth <= 900) return;
    isAnimating = true;
    pauseAuto();

    progScroll = true;
    grid.scrollTo({ left: allCards[allIdx].offsetLeft, behavior: 'smooth' });

    setTimeout(() => {
      // Find closest card after scroll settles
      let nearest = 0;
      let minDist = Infinity;
      allCards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - grid.scrollLeft);
        if (d < minDist) { minDist = d; nearest = i; }
      });

      isAnimating = false;

      if (nearest === 0) {
        // Landed on start clone — jump to last real card
        progScroll = true;
        grid.scrollLeft = allCards[realCount].offsetLeft;
        currentReal = realCount - 1;
        setTimeout(() => { progScroll = false; }, 50);
      } else if (nearest === realCount + 1) {
        // Landed on end clone — jump to first real card
        progScroll = true;
        grid.scrollLeft = allCards[1].offsetLeft;
        currentReal = 0;
        setTimeout(() => { progScroll = false; }, 50);
      } else {
        currentReal = nearest - 1;
        progScroll = false;
      }

      updateDots(currentReal);
    }, 500);
  };

  const nextSlide = () => scrollToCard(Math.min(currentReal + 2, realCount + 1));
  const prevSlide = () => scrollToCard(Math.max(currentReal, 0));
  const goTo = (realIdx) => scrollToCard(realIdx + 1);

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => {
      if (window.innerWidth <= 900) return;
      const r = grid.getBoundingClientRect();
      if (r.top >= window.innerHeight || r.bottom <= 0) return;
      nextSlide();
    }, 5000);
  };

  const stopAuto = () => { clearInterval(autoTimer); clearTimeout(interactionTimer); };
  const pauseAuto = () => { stopAuto(); interactionTimer = setTimeout(startAuto, 5000); };

  // Init
  grid.scrollLeft = targetLeft(0);

  // Fix video triggers for cloned cards via delegation
  grid.addEventListener('click', (e) => {
    const link = e.target.closest('.project-card__video-trigger');
    if (!link) return;
    e.preventDefault();
    openModal(link.dataset.videoId);
  });

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  grid.addEventListener('mouseenter', stopAuto);
  grid.addEventListener('mouseleave', startAuto);

  grid.addEventListener('scroll', () => {
    if (progScroll || isAnimating) return;
    pauseAuto();
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !document.querySelector('.modal.active')) prevSlide();
    if (e.key === 'ArrowRight' && !document.querySelector('.modal.active')) nextSlide();
  });

  startAuto();
})();
