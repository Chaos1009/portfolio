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

// Main function to switch view
function switchView(targetId) {
  // 1. 先隐藏所有相关部分
  projectsSection.style.display = 'none';
  projectSections.forEach(sec => sec.style.display = 'none');

  if (targetId === 'projects') {
    // === 显示 Projects 列表 ===
    projectsSection.style.display = 'block';
    updateNavState('#projects');
    
    // ✅ 修复 1：这里原来是 offsetTop - 100，导致了偏移。
    // 现在改为直接 offsetTop，配合 CSS 的 padding-top，背景图就会完美贴顶。
    const pSec = document.getElementById('projects');
    if (pSec) {
      window.scrollTo({ top: pSec.offsetTop, behavior: 'smooth' });
    }
    
  } else {
    // === 显示 Project Detail (详情页) ===
    const target = document.getElementById(targetId);
    if (target) {
      target.style.display = 'block';
      updateNavState('#projects'); // 保持导航栏 Projects 高亮
      
      // ✅ 修复 2：这里原来是 top: 0，会导致点击详情页直接跳回网页最顶端(About)。
      // 改为 target.offsetTop，这样页面会准确滚动到详情页的起始位置。
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
    switchView('projects');
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
