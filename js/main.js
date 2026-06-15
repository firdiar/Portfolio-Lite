(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const shapes = ['circle', 'triangle', 'diamond'];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.3 + 0.05,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
    };
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = '#00e5ff';
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.5);
      ctx.lineTo(-p.size * 1.3, p.size);
      ctx.lineTo(p.size * 1.3, p.size);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.5);
      ctx.lineTo(p.size * 1.2, 0);
      ctx.lineTo(0, p.size * 1.5);
      ctx.lineTo(-p.size * 1.2, 0);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      drawParticle(p);
    });
    animFrameId = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener('resize', function () {
    resizeCanvas();
    initParticles();
  });

  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  var hoverTargets = 'a, button, .compendium-card, .social-card, .chapter-card, .trophy-card, .attribute-card, input, textarea';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hover');
    }
  });

  var screens = document.querySelectorAll('.screen');
  var navItems = document.querySelectorAll('.nav-item');
  var screenTransition = document.querySelector('.screen-transition');
  var currentScreen = 'title';
  var isTransitioning = false;
  var screenOrder = ['title', 'status', 'skills', 'chapters', 'trophies', 'social', 'compendium', 'terminal'];

  function navigateTo(targetName) {
    if (targetName === currentScreen || isTransitioning) return;
    isTransitioning = true;

    var currentEl = document.querySelector('.screen[data-screen="' + currentScreen + '"]');
    var targetEl = document.querySelector('.screen[data-screen="' + targetName + '"]');
    if (!targetEl) { isTransitioning = false; return; }

    navItems.forEach(function (item) {
      item.classList.toggle('active', item.dataset.target === targetName);
    });

    var tl = gsap.timeline({
      onComplete: function () {
        currentScreen = targetName;
        isTransitioning = false;
        onScreenEnter(targetName);
      }
    });

    tl.to(screenTransition, {
      scaleX: 1,
      duration: 0.3,
      ease: 'power2.in',
      transformOrigin: 'left center',
    });

    tl.add(function () {
      currentEl.classList.remove('active');
      currentEl.style.display = 'none';
      currentEl.style.opacity = '0';

      targetEl.style.display = 'flex';
      targetEl.style.opacity = '0';
      targetEl.classList.add('active');
      targetEl.scrollTop = 0;
    });

    tl.to(screenTransition, {
      scaleX: 0,
      duration: 0.3,
      ease: 'power2.out',
      transformOrigin: 'right center',
      delay: 0.05,
    });

    tl.to(targetEl, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.25');
  }

  function onScreenEnter(name) {
    if (name === 'skills') animateSkillBars();
    if (name === 'trophies') animateTrophies();
    if (name === 'chapters') animateChapters();
    if (name === 'social') animateSocialCards();
    if (name === 'compendium') animateCompendium();
    if (name === 'status') animateStatus();
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      navigateTo(this.dataset.target);
      if (window.innerWidth <= 768) {
        document.getElementById('navMenu').classList.remove('open');
        document.getElementById('mobileMenuBtn').classList.remove('active');
      }
    });
  });

  var pressStart = document.getElementById('pressStart');
  if (pressStart) {
    pressStart.addEventListener('click', function () {
      navigateTo('status');
    });
  }

  function animateSkillBars() {
    var fills = document.querySelectorAll('.skill-row__fill');
    fills.forEach(function (fill, i) {
      fill.classList.remove('animate');
      void fill.offsetWidth;
      setTimeout(function () {
        fill.classList.add('animate');
      }, i * 150);
    });

    var cards = document.querySelectorAll('.attribute-card');
    cards.forEach(function (card, i) {
      gsap.fromTo(card, { opacity: 0, y: 20, scale: 0.9 }, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.4,
        delay: 0.3 + i * 0.08,
        ease: 'back.out(1.7)',
      });
    });
  }

  function animateTrophies() {
    var cards = document.querySelectorAll('.trophy-card');
    cards.forEach(function (card, i) {
      gsap.fromTo(card, { opacity: 0, x: -20 }, {
        opacity: 1, x: 0,
        duration: 0.4,
        delay: i * 0.08,
        ease: 'power2.out',
      });
    });
  }

  function animateChapters() {
    var cards = document.querySelectorAll('.chapter-card');
    cards.forEach(function (card, i) {
      gsap.fromTo(card, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0,
        duration: 0.5,
        delay: i * 0.1,
        ease: 'power2.out',
      });
    });
  }

  function animateSocialCards() {
    var cards = document.querySelectorAll('.social-card');
    cards.forEach(function (card, i) {
      gsap.fromTo(card, { opacity: 0, y: 30, rotateY: -15 }, {
        opacity: 1, y: 0, rotateY: 0,
        duration: 0.5,
        delay: i * 0.1,
        ease: 'power2.out',
      });
    });
  }

  function animateCompendium() {
    var cards = document.querySelectorAll('.compendium-grid:not(.hidden) .compendium-card, .compendium-grid:not(.hidden) .compendium-mini');
    cards.forEach(function (card, i) {
      gsap.fromTo(card, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0,
        duration: 0.3,
        delay: i * 0.05,
        ease: 'power2.out',
      });
    });
  }

  function animateStatus() {
    var portrait = document.querySelector('.status-portrait');
    var stats = document.querySelectorAll('.status-stat');
    var bio = document.querySelector('.status-bio');
    var edu = document.querySelector('.status-education');

    if (portrait) {
      gsap.fromTo(portrait, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
      });
    }

    stats.forEach(function (stat, i) {
      gsap.fromTo(stat, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.4, delay: 0.2 + i * 0.1, ease: 'power2.out',
      });
    });

    if (bio) {
      gsap.fromTo(bio, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.4, delay: 0.5, ease: 'power2.out',
      });
    }

    if (edu) {
      gsap.fromTo(edu, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.4, delay: 0.7, ease: 'power2.out',
      });
    }
  }

  function runTitleAnimation() {
    var sub = document.querySelector('.title-sub');
    var name = document.querySelector('.title-name');
    var line = document.querySelector('.title-line');
    var desc = document.querySelector('.title-desc');
    var start = document.querySelector('.title-start');

    var tl = gsap.timeline({ delay: 0.3 });

    tl.to(sub, { opacity: 1, duration: 0.6, ease: 'power2.out' });

    tl.to(name, {
      opacity: 1,
      duration: 0.1,
      ease: 'none',
    }, '+=0.2');

    tl.fromTo(name, {
      'clip-path': 'inset(0 100% 0 0)',
    }, {
      'clip-path': 'inset(0 0% 0 0)',
      duration: 0.8,
      ease: 'power4.out',
    }, '-=0.1');

    tl.to(line, {
      opacity: 1,
      scaleX: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.3');

    tl.to(desc, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.1');

    tl.to(start, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, '+=0.2');
  }

  runTitleAnimation();

  document.querySelectorAll('.social-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.social-card__link')) return;
      this.classList.toggle('flipped');
    });
  });

  var compendiumTabs = document.querySelectorAll('.compendium-tab');
  var compendiumGrids = document.querySelectorAll('.compendium-grid');

  compendiumTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = this.dataset.filter;

      compendiumTabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      compendiumGrids.forEach(function (grid) {
        if (grid.dataset.category === filter) {
          grid.classList.remove('hidden');
          grid.style.display = '';
        } else {
          grid.classList.add('hidden');
        }
      });

      animateCompendium();
    });
  });

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var subject = document.getElementById('subject').value.trim();
      var message = document.getElementById('message').value.trim();
      if (!name || !email || !message) return;

      var recipient = 'firdi.ansyah20@gmail.com';
      var subjectLine = subject || 'Portfolio Contact from ' + name;
      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;

      if (email.toLowerCase().endsWith('@gmail.com')) {
        var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' +
          encodeURIComponent(recipient) +
          '&su=' + encodeURIComponent(subjectLine) +
          '&body=' + encodeURIComponent(body);
        window.open(gmailUrl, '_blank');
      } else {
        window.open('mailto:' + recipient + '?subject=' +
          encodeURIComponent(subjectLine) + '&body=' + encodeURIComponent(body), '_blank');
      }

      contactForm.reset();
    });
  }

  var modal = document.getElementById('videoModal');
  var modalOverlay = document.getElementById('modalOverlay');
  var modalClose = document.getElementById('modalClose');
  var modalIframe = document.getElementById('modalIframe');

  function openVideoModal(videoId) {
    if (!modal || !modalIframe) return;
    modalIframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
    modal.classList.add('active');
  }

  function closeVideoModal() {
    if (!modal || !modalIframe) return;
    modal.classList.remove('active');
    modalIframe.src = '';
  }

  document.addEventListener('click', function (e) {
    var playBtn = e.target.closest('.compendium-card__play');
    if (playBtn) {
      var card = playBtn.closest('.compendium-card');
      var videoId = card && card.dataset.videoId;
      if (videoId) {
        e.preventDefault();
        openVideoModal(videoId);
        return;
      }
    }

    if (e.target.closest('.compendium-card__link')) return;

    var cardWithVideo = e.target.closest('.compendium-card[data-video-id]');
    if (cardWithVideo) {
      var vid = cardWithVideo.dataset.videoId;
      if (vid) {
        e.preventDefault();
        openVideoModal(vid);
      }
    }
  });

  if (modalOverlay) modalOverlay.addEventListener('click', closeVideoModal);
  if (modalClose) modalClose.addEventListener('click', closeVideoModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeVideoModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    var idx = screenOrder.indexOf(currentScreen);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (idx < screenOrder.length - 1) navigateTo(screenOrder[idx + 1]);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (idx > 0) navigateTo(screenOrder[idx - 1]);
    } else if (e.key >= '1' && e.key <= '8') {
      e.preventDefault();
      navigateTo(screenOrder[parseInt(e.key) - 1]);
    } else if (e.key === 'Enter' && currentScreen === 'title') {
      e.preventDefault();
      navigateTo('status');
    }
  });

  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 768 &&
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  }
})();
