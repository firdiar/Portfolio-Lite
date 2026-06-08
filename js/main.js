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
