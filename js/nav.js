/**
 * SmartCost Research Portal - Dynamic Navigation & ScrollSpy
 * Automatically updates active nav items, header scrolled state,
 * scroll progress bar, and breadcrumb indicator as the user scrolls.
 */

(function () {
  'use strict';

  // Section definitions in page order
  const sections = [
    { id: 'home', label: 'HOME', isDomainSub: false },
    { id: 'solution', label: 'SOLUTION', isDomainSub: false },
    { id: 'domain', label: 'DOMAIN', isDomainSub: false },
    { id: 'literature-survey', label: 'LIT SURVEY', isDomainSub: true },
    { id: 'research-gap', label: 'RESEARCH GAP', isDomainSub: true },
    { id: 'research-problem', label: 'RESEARCH PROBLEM', isDomainSub: true },
    { id: 'research-objectives', label: 'OBJECTIVES', isDomainSub: true },
    { id: 'methodology', label: 'METHODOLOGY', isDomainSub: true },
    { id: 'research-novelties', label: 'NOVELTIES', isDomainSub: true },
    { id: 'technologies', label: 'TECHNOLOGIES', isDomainSub: true },
    { id: 'milestones', label: 'MILESTONES', isDomainSub: false },
    { id: 'documents', label: 'DOCUMENTS', isDomainSub: false },
    { id: 'presentations', label: 'PRESENTATIONS', isDomainSub: false },
    { id: 'about-us', label: 'ABOUT US', isDomainSub: false },
    { id: 'contact-us', label: 'CONTACT US', isDomainSub: false }
  ];

  const header = document.querySelector('header');
  const progressBar = document.getElementById('nav-scroll-progress');
  const activeCrumb = document.getElementById('nav-active-crumb');
  const mobileToggle = document.getElementById('mobile-toggle');

  const desktopNavLinks = document.querySelectorAll('.nav-link');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const domainSubnavBtns = document.querySelectorAll('.domain-subnav-btn');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const mobileSublinks = document.querySelectorAll('.mobile-sublink');

  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // 1. Header Scrolled Glassmorphism State
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 2. Scroll Progress Bar
    if (progressBar) {
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }

    // 3. Detect Current Active Section
    let current = sections[0]; // default 'home'

    // If reached bottom of page, highlight contact-us
    if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50) {
      current = sections[sections.length - 1]; // 'contact-us'
    } else {
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Offset 140px accounts for header height + visual threshold
          if (rect.top <= 140) {
            current = sec;
          }
        }
      }
    }

    // 4. Update Header Subtitle Crumb
    if (activeCrumb) {
      if (current.id === 'home') {
        activeCrumb.textContent = '';
      } else if (current.isDomainSub) {
        activeCrumb.textContent = ' • DOMAIN / ' + current.label;
      } else {
        activeCrumb.textContent = ' • ' + current.label;
      }
    }

    // 5. Update Desktop Nav Links
    const activeMainId = current.isDomainSub ? 'domain' : current.id;
    desktopNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + activeMainId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 6. Update Dropdown Sub-Items
    dropdownItems.forEach(item => {
      const href = item.getAttribute('href');
      if (current.isDomainSub && href === '#' + current.id) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 7. Update In-Page Domain Sub-nav Buttons
    domainSubnavBtns.forEach(btn => {
      const href = btn.getAttribute('href');
      if (current.isDomainSub && href === '#' + current.id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 8. Update Mobile Nav Links & Sublinks
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + activeMainId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileSublinks.forEach(sublink => {
      const href = sublink.getAttribute('href');
      if (current.isDomainSub && href === '#' + current.id) {
        sublink.classList.add('active');
      } else {
        sublink.classList.remove('active');
      }
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  // Auto-close mobile menu when tapping any mobile link
  function setupMobileMenuClose() {
    if (!mobileToggle) return;
    const allMobileLinks = document.querySelectorAll('.mobile-link, .mobile-sublink');
    allMobileLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileToggle.checked = false;
      });
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      updateNavbar();
      setupMobileMenuClose();
    });
  } else {
    updateNavbar();
    setupMobileMenuClose();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();
