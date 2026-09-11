const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Fade between internal pages ---------- */
const internalPageLinks = [...document.querySelectorAll(
  'a[href$=".html"]:not([target="_blank"])'
)];

internalPageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    event.preventDefault();

    // Close the mobile menu first if it is open.
    document.body.classList.remove('mobile-menu-open');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) mobileMenu.classList.remove('is-open');

    document.body.classList.add('page-leaving');

    window.setTimeout(() => {
      window.location.href = href;
    }, 280);
  });
});

/* ---------- Mobile hamburger menu ---------- */
const header = document.querySelector('.site-header');
const desktopNav = document.querySelector('.site-header > .nav');

if (header && desktopNav) {
  const toggle = document.createElement('button');
  toggle.className = 'mobile-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  header.appendChild(toggle);

  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.setAttribute('aria-hidden', 'true');

  const close = document.createElement('button');
  close.className = 'mobile-menu-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Close menu');
  close.textContent = '×';

  const linksWrap = document.createElement('nav');
  linksWrap.className = 'mobile-menu-links';
  linksWrap.setAttribute('aria-label', 'Mobile navigation');

  [...desktopNav.querySelectorAll('a:not(.social)')].forEach((link) => {
    const clone = link.cloneNode(true);
    linksWrap.appendChild(clone);
  });

  const socialWrap = document.createElement('div');
  socialWrap.className = 'mobile-menu-social';

  const linkedin = desktopNav.querySelector('.linkedin');
  const instagram = desktopNav.querySelector('.instagram');

  if (linkedin) socialWrap.appendChild(linkedin.cloneNode(true));
  if (instagram) socialWrap.appendChild(instagram.cloneNode(true));

  mobileMenu.appendChild(close);
  mobileMenu.appendChild(linksWrap);
  mobileMenu.appendChild(socialWrap);
  document.body.appendChild(mobileMenu);

  // Fade internal links created in the mobile menu.
  [...linksWrap.querySelectorAll('a[href$=".html"]')].forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href) return;
      event.preventDefault();

      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('mobile-menu-open');
      document.body.classList.add('page-leaving');

      window.setTimeout(() => {
        window.location.href = href;
      }, 280);
    });
  });

  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-menu-open');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-menu-open');
  }

  toggle.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/* ---------- Artwork viewer with fade ---------- */
const projects = [...document.querySelectorAll('.project')];
const viewer = document.getElementById('viewer');

if (projects.length && viewer) {
  const viewerImage = document.getElementById('viewerImage');
  const viewerCaption = document.getElementById('viewerCaption');
  const closeButton = document.getElementById('viewerClose');
  const prevButton = document.getElementById('viewerPrev');
  const nextButton = document.getElementById('viewerNext');
  let currentIndex = 0;
  let swapTimer;

  function setViewerImage(index, initial = false) {
    currentIndex = (index + projects.length) % projects.length;
    const project = projects[currentIndex];
    const nextSrc = project.dataset.full;
    const nextAlt = project.querySelector('img').alt;
    const nextTitle = project.dataset.title || '';

    clearTimeout(swapTimer);

    if (!initial) {
      viewerImage.classList.add('is-changing');
    }

    swapTimer = window.setTimeout(() => {
      viewerImage.src = nextSrc;
      viewerImage.alt = nextAlt;
      viewerCaption.textContent = nextTitle;

      if (viewerImage.complete) {
        requestAnimationFrame(() => viewerImage.classList.remove('is-changing'));
      } else {
        viewerImage.addEventListener('load', () => {
          viewerImage.classList.remove('is-changing');
        }, { once: true });
      }
    }, initial ? 0 : 170);
  }

  function showProject(index) {
    setViewerImage(index, true);
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-open');
  }

  function closeViewer() {
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open');

    window.setTimeout(() => {
      if (!viewer.classList.contains('is-open')) {
        viewerImage.src = '';
      }
    }, 280);
  }

  projects.forEach((project, index) => {
    project.addEventListener('click', () => showProject(index));
  });

  closeButton.addEventListener('click', closeViewer);
  prevButton.addEventListener('click', () => setViewerImage(currentIndex - 1));
  nextButton.addEventListener('click', () => setViewerImage(currentIndex + 1));

  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) closeViewer();
  });

  document.addEventListener('keydown', (event) => {
    if (!viewer.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'ArrowLeft') setViewerImage(currentIndex - 1);
    if (event.key === 'ArrowRight') setViewerImage(currentIndex + 1);
  });
}

/* ---------- Design page image sliders ---------- */
const designSliders = [...document.querySelectorAll('[data-slider]')];

designSliders.forEach((designSlider) => {
  const slides = [...designSlider.querySelectorAll('[data-slide]')];
  const dots = [...designSlider.querySelectorAll('.design-slider-dot')];
  const prev = designSlider.querySelector('.design-slider-prev');
  const next = designSlider.querySelector('.design-slider-next');
  const viewport = designSlider.querySelector('.design-slider-viewport');
  const track = designSlider.querySelector('.design-slide-track');
  const slideMode = designSlider.dataset.sliderMode === 'slide';
  let currentSlide = 0;
  let touchStartX = null;

  if (!slides.length) return;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    if (slideMode && track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', i === currentSlide ? 'false' : 'true');
      });
    } else {
      slides.forEach((slide, i) => {
        const active = i === currentSlide;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
    }

    dots.forEach((dot, i) => {
      const active = i === currentSlide;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  prev?.addEventListener('click', () => showSlide(currentSlide - 1));
  next?.addEventListener('click', () => showSlide(currentSlide + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  designSlider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showSlide(currentSlide - 1);
    if (event.key === 'ArrowRight') showSlide(currentSlide + 1);
  });

  viewport?.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  viewport?.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;

    if (Math.abs(distance) < 45) return;
    if (distance < 0) showSlide(currentSlide + 1);
    if (distance > 0) showSlide(currentSlide - 1);
  }, { passive: true });

  showSlide(0);
});

/* ---------- Sticky header behavior ---------- */
const stickyHeader = document.querySelector('.site-header');
if (stickyHeader) {
  const updateStickyHeader = () => {
    stickyHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateStickyHeader();
  window.addEventListener('scroll', updateStickyHeader, { passive: true });
}
