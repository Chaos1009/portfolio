/* =========================
   NAV Underline + Active Logic
   ========================= */
const nav = document.querySelector('nav');
const links = document.querySelectorAll('nav a');
let underline = document.querySelector('.nav-underline');

// Create Hover Line
let hoverline = document.createElement('div');
hoverline.classList.add('nav-hoverline');
nav.appendChild(hoverline);

let activeLink = document.querySelector('nav a.active') || links[0];

const moveUnderline = (el) => {
  if (!el) return;
  underline.style.width = el.offsetWidth + 'px';
  underline.style.transform = `translateX(${el.offsetLeft}px)`;
};

// Initial position
window.addEventListener('load', () => moveUnderline(activeLink));
window.addEventListener('resize', () => moveUnderline(activeLink));

// Hover Effects
links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    hoverline.style.width = link.offsetWidth + 'px';
    hoverline.style.transform = `translateX(${link.offsetLeft}px)`;
  });
  link.addEventListener('mouseleave', () => {
    hoverline.style.width = '0px';
  });
});

/* =========================
   Projects: Show / Hide Logic
   ========================= */
const projectCards = document.querySelectorAll('.project-card');
const projectSections = document.querySelectorAll('.project-detail');
const projectsSection = document.getElementById('projects');
const backBtns = document.querySelectorAll('[data-back]');

function restoreMainView() {
  projectsSection.style.display = 'block';
  projectSections.forEach(sec => sec.style.display = 'none');
}

// Main function to switch view
function switchView(targetId) {
  projectsSection.style.display = 'none';
  projectSections.forEach(sec => sec.style.display = 'none');

  if (targetId === 'projects') {
    projectsSection.style.display = 'block';
    updateNavState('#projects');

    const pSec = document.getElementById('projects');
    if (pSec) {
      window.scrollTo({ top: pSec.offsetTop, behavior: 'smooth' });
    }
  } else {
    const target = document.getElementById(targetId);
    if (target) {
      target.style.display = 'block';
      updateNavState('#projects');

      window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }
  }
}

// Update Nav highlight manually
function updateNavState(hash) {
  const targetLink = document.querySelector(`nav a[href="${hash}"]`);
  if (targetLink) {
    links.forEach(l => l.classList.remove('active'));
    targetLink.classList.add('active');
    activeLink = targetLink;
    moveUnderline(activeLink);
  }
}

// Click Project Card
projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const id = card.getAttribute('data-target');
    history.pushState({ id: id }, '', `#${id}`);
    switchView(id);
  });
});

// Click Back Button
backBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    history.pushState({ id: 'projects' }, '', '#projects');
    switchView('projects');
  });
});

// Handle Browser "Back/Forward" Buttons (Popstate)
window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && hash.startsWith('project-')) {
    switchView(hash);
  } else {
    restoreMainView();
    const target = hash ? document.getElementById(hash) : document.getElementById('about');
    if (target) {
      window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      updateNavState(`#${target.id}`);
    }
  }
});

// Initial Load check
const initialHash = window.location.hash.replace('#', '');
if (initialHash && initialHash.startsWith('project-')) {
  switchView(initialHash);
}

/* =========================
   Smooth Scroll for Nav Links
   ========================= */
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');

    // If clicking "Projects", ensure we exit detail view
    if (href === '#projects') {
      history.pushState(null, '', '#projects');
      switchView('projects');
    } else {
      // Normal scroll
      const target = document.querySelector(href);
      if (target) {
        restoreMainView();
        window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        history.pushState(null, '', href);
        updateNavState(href);
      }
    }
  });
});

/* =========================
   Scroll Observer (Update Nav on Scroll)
   ========================= */
const mainSections = Array.from(document.querySelectorAll('main > section'))
  .filter(sec => !sec.classList.contains('project-detail'));

const observerOptions = {
  root: null,
  rootMargin: '-30% 0px -60% 0px', // Active when element is in middle of screen
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  // If showing a project detail, stop updating nav based on scroll
  if (projectsSection.style.display === 'none') return;

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      // Don't update if we are just scrolling past short sections quickly
      if(id) updateNavState(`#${id}`);
    }
  });
}, observerOptions);

mainSections.forEach(sec => observer.observe(sec));

/* =========================
   Image Lightbox
   ========================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('caption');
const closeLightbox = document.querySelector('.close-lightbox');
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

function openLightbox(img) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || '';
  if (lightboxCaption) lightboxCaption.textContent = img.alt || '';
  lightbox.classList.add('is-open');
  document.body.classList.add('lightbox-open');
}

function closeLightboxView() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('is-open');
  document.body.classList.remove('lightbox-open');
  lightboxImg.src = '';
}

lightboxTriggers.forEach(img => {
  img.addEventListener('click', () => openLightbox(img));
});

if (closeLightbox) {
  closeLightbox.addEventListener('click', closeLightboxView);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightboxView();
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightboxView();
});
