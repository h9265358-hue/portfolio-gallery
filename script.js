document.getElementById('year').textContent = new Date().getFullYear();

const projects = [...document.querySelectorAll('.project')];
const viewer = document.getElementById('viewer');

if (projects.length && viewer) {
  const viewerImage = document.getElementById('viewerImage');
  const viewerCaption = document.getElementById('viewerCaption');
  const closeButton = document.getElementById('viewerClose');
  const prevButton = document.getElementById('viewerPrev');
  const nextButton = document.getElementById('viewerNext');
  let currentIndex = 0;

  function showProject(index) {
    currentIndex = (index + projects.length) % projects.length;
    const project = projects[currentIndex];
    viewerImage.src = project.dataset.full;
    viewerImage.alt = project.querySelector('img').alt;
    viewerCaption.textContent = project.dataset.title || '';
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-open');
  }

  function closeViewer() {
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open');
    viewerImage.src = '';
  }

  projects.forEach((project, index) => {
    project.addEventListener('click', () => showProject(index));
  });

  closeButton.addEventListener('click', closeViewer);
  prevButton.addEventListener('click', () => showProject(currentIndex - 1));
  nextButton.addEventListener('click', () => showProject(currentIndex + 1));

  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) closeViewer();
  });

  document.addEventListener('keydown', (event) => {
    if (!viewer.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'ArrowLeft') showProject(currentIndex - 1);
    if (event.key === 'ArrowRight') showProject(currentIndex + 1);
  });
}
