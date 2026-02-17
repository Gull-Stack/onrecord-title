// Mobile Navigation
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// Reveal on Scroll
const revealElements = document.querySelectorAll('.feature-card, .service-card, .team-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

revealElements.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Header scroll effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
  } else {
    header.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
  }
});
