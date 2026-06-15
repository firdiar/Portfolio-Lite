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
const fadeElements = document.querySelectorAll('.project-card, .ach-card, .edu-card, .project-mini, .about__avatar, .timeline__item, .rec-card, .contact__title');

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
const submitBtn = form.querySelector('button[type="submit"]');
const formStatus = document.getElementById('formStatus');

function openMailtoFallback() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const recipient = 'firdi.ansyah20@gmail.com';
  const subject = 'Portfolio Inquiry';
  const body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message + '\n\n---\nSent from my portfolio website';
  const mailtoUrl = 'mailto:' + encodeURIComponent(recipient)
    + '?subject=' + encodeURIComponent(subject)
    + '&body=' + encodeURIComponent(body);
  window.open(mailtoUrl, '_blank');
}

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = 'form-status form-status--' + type;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  formStatus.className = 'form-status';
  formStatus.textContent = '';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form)
    });
    const data = await response.json();

    if (response.ok && data.success) {
      showStatus('Message sent successfully!', 'success');
      form.reset();
    } else {
      openMailtoFallback();
      showStatus('Opened your email client as fallback.', 'error');
    }
  } catch (error) {
    openMailtoFallback();
    showStatus('Opened your email client as fallback.', 'error');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
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

// Active nav highlight
const navLinks = document.querySelectorAll('.header__nav a[href^="#"]');
const sections = [];
navLinks.forEach(function(link) {
  var sec = document.querySelector(link.getAttribute('href'));
  if (sec) sections.push({ el: sec, link: link });
});

const updateActiveNav = () => {
  var current = null;
  var offset = window.innerHeight * 0.35;
  sections.forEach(function(s) {
    var rect = s.el.getBoundingClientRect();
    if (rect.top <= offset && rect.bottom > 0) current = s;
  });
  navLinks.forEach(function(l) { l.classList.remove('active'); });
  if (current) current.link.classList.add('active');
};

// Hide scroll hint when leaving hero
const scrollHint = document.querySelector('.hero__scroll-hint');
const heroSection = document.getElementById('hero');

const toggleScrollHint = () => {
  if (!scrollHint || !heroSection) return;
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  if (heroBottom < window.innerHeight * 0.5) {
    scrollHint.classList.add('hide');
  } else {
    scrollHint.classList.remove('hide');
  }
};

// Event listeners
window.addEventListener('scroll', () => {
  animateSkills();
  fadeInOnScroll();
  toggleScrollHint();
  updateActiveNav();
});

window.addEventListener('load', () => {
  animateSkills();
  fadeInOnScroll();
  updateActiveNav();
});

// Swiper projects carousel
(function() {
  const swiperEl = document.getElementById('projectsSwiper');
  if (!swiperEl) return;

  const swiper = new Swiper(swiperEl, {
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 28,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true,
    },
    navigation: {
      nextEl: '.carousel__btn--next',
      prevEl: '.carousel__btn--prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    on: {
      init: function() {
        this.el.addEventListener('click', (e) => {
          const link = e.target.closest('.project-card__video-trigger');
          if (!link) return;
          e.preventDefault();
          openModal(link.dataset.videoId);
        });
      }
    }
  });

  swiperEl.addEventListener('mouseenter', () => swiper.autoplay.stop());
  swiperEl.addEventListener('mouseleave', () => swiper.autoplay.start());

  const checkVisibility = () => {
    const r = swiperEl.getBoundingClientRect();
    const visible = r.top < window.innerHeight && r.bottom > 0;
    if (visible && !swiper.autoplay.running) swiper.autoplay.start();
    if (!visible && swiper.autoplay.running) swiper.autoplay.stop();
  };

  window.addEventListener('scroll', checkVisibility, { passive: true });
  checkVisibility();
})();

// Recommendations Swiper
(function() {
  const swiperEl = document.getElementById('recommendationsSwiper');
  if (!swiperEl) return;

  const swiper = new Swiper(swiperEl, {
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 24,
    autoplay: {
      delay: 6000,
      disableOnInteraction: true,
    },
    navigation: {
      nextEl: '.carousel__btn--next',
      prevEl: '.carousel__btn--prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  swiperEl.addEventListener('mouseenter', () => swiper.autoplay.stop());
  swiperEl.addEventListener('mouseleave', () => swiper.autoplay.start());

  const checkVisibility = () => {
    const r = swiperEl.getBoundingClientRect();
    const visible = r.top < window.innerHeight && r.bottom > 0;
    if (visible && !swiper.autoplay.running) swiper.autoplay.start();
    if (!visible && swiper.autoplay.running) swiper.autoplay.stop();
  };

  window.addEventListener('scroll', checkVisibility, { passive: true });
  checkVisibility();
})();

// Arona Touch Position (object-fit: cover compensation)
(function() {
  var wrap = document.querySelector('.arona-gate__image-wrap');
  if (!wrap) return;
  var img = wrap.querySelector('.arona-gate__img');
  if (!img) return;

  function mapToContainer(pctX, pctY, cw, ch, nw, nh) {
    var scale = Math.max(cw / nw, ch / nh);
    var dw = nw * scale;
    var dh = nh * scale;
    var ox = (dw - cw) / 2;
    var oy = (dh - ch) / 2;
    return {
      x: ((pctX * dw - ox) / cw * 100),
      y: ((pctY * dh - oy) / ch * 100)
    };
  }

  function update() {
    if (!img.naturalWidth) return;
    var cw = wrap.clientWidth;
    var ch = wrap.clientHeight;
    var nw = img.naturalWidth;
    var nh = img.naturalHeight;

    var ix = parseFloat(wrap.dataset.imgX) / 100;
    var iy = parseFloat(wrap.dataset.imgY) / 100;
    if (!isNaN(ix) && !isNaN(iy)) {
      var t = mapToContainer(ix, iy, cw, ch, nw, nh);
      wrap.style.setProperty('--touch-x', t.x + '%');
      wrap.style.setProperty('--touch-y', t.y + '%');
    }

    var bx = parseFloat(wrap.dataset.bubbleX) / 100;
    var by = parseFloat(wrap.dataset.bubbleY) / 100;
    if (!isNaN(bx) && !isNaN(by)) {
      var b = mapToContainer(bx, by, cw, ch, nw, nh);
      wrap.style.setProperty('--bubble-x', b.x + '%');
      wrap.style.setProperty('--bubble-y', b.y + '%');
    }
  }

  img.addEventListener('load', update);
  window.addEventListener('resize', update);
  if (img.complete) update();
})();

// Arona Touch Gate
(function() {
  var aronaTouch = document.getElementById('aronaTouch');
  var aronaGate = document.getElementById('aronaGate');
  var aronaFlash = document.getElementById('aronaFlash');
  var contactGrid = document.getElementById('contactGrid');

  if (!aronaTouch || !aronaGate || !contactGrid) return;

  var aronaOverlay = document.getElementById('aronaOverlay');

  aronaTouch.addEventListener('click', function() {
    if (aronaFlash) aronaFlash.classList.add('active');
    setTimeout(function() {
      aronaGate.classList.add('touched');
      if (aronaOverlay) aronaOverlay.classList.add('active');
    }, 300);
    setTimeout(function() {
      contactGrid.classList.remove('contact--hidden');
      contactGrid.classList.add('contact--reveal');
    }, 700);
  });
})();

// Background Music
(function() {
  var audio = document.getElementById('bgAudio');
  var widget = document.getElementById('nowPlaying');
  var toggleBtn = document.getElementById('npToggle');
  var closeBtn = document.getElementById('npClose');
  var enableBtn = document.getElementById('npEnable');

  if (!audio || !widget) return;

  audio.volume = 0.4;
  var started = false;

  var setPlaying = function() { widget.classList.remove('paused'); };
  var setPaused = function() { widget.classList.add('paused'); };

  var removeListeners = function() {
    document.removeEventListener('click', onFirstInteract, true);
    document.removeEventListener('keydown', onFirstInteract, true);
    document.removeEventListener('touchstart', onFirstInteract, true);
  };

  var onFirstInteract = function() {
    if (started) return;
    started = true;
    removeListeners();
    audio.play().then(setPlaying).catch(function() { setPaused(); });
  };

  var showEnableBtn = function() {
    if (enableBtn) enableBtn.classList.remove('hidden');
  };

  var hideEnableBtn = function() {
    if (enableBtn) enableBtn.classList.add('hidden');
  };

  if (localStorage.getItem('musicDisabled') === 'true') {
    widget.classList.add('hidden');
    showEnableBtn();
  } else {
    hideEnableBtn();
    var autoplayResult = audio.play();
    if (autoplayResult !== undefined) {
      autoplayResult.then(function() {
        started = true;
        setPlaying();
        removeListeners();
      }).catch(function() {
        setPaused();
        document.addEventListener('click', onFirstInteract, true);
        document.addEventListener('keydown', onFirstInteract, true);
        document.addEventListener('touchstart', onFirstInteract, true);
      });
    }
  }

  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    started = true;
    removeListeners();
    if (audio.paused) {
      audio.play().then(setPlaying).catch(function() {});
    } else {
      audio.pause();
      setPaused();
    }
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    started = true;
    audio.pause();
    widget.classList.add('hidden');
    showEnableBtn();
    localStorage.setItem('musicDisabled', 'true');
    removeListeners();
  });

  if (enableBtn) {
    enableBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      localStorage.removeItem('musicDisabled');
      hideEnableBtn();
      widget.classList.remove('hidden');
      started = true;
      audio.play().then(setPlaying).catch(function() { setPaused(); });
    });
  }
})();
