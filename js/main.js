(() => {
  const PROJECTS = {
    arda: {
      title: 'ARDA',
      genre: '3D Action RPG',
      sections: [
        { id: 'sec-overview', label: 'Overview' },
        { id: 'sec-game', label: 'Game Overview' },
        { id: 'sec-loop', label: 'Core Loop' },
        { id: 'sec-arch', label: 'Architecture' },
        { id: 'sec-systems', label: 'Key Systems' },
        { id: 'sec-trouble', label: 'Trouble Shooting' },
        { id: 'sec-retro', label: 'Retrospective' },
      ],
    },
    harai: {
      title: 'HARAI',
      genre: '2D Horror',
      sections: [
        { id: 'sec-overview', label: 'Overview' },
        { id: 'sec-game', label: 'Game Overview' },
        { id: 'sec-loop', label: 'Core Gameplay' },
        { id: 'sec-systems', label: 'Key Systems' },
        { id: 'sec-trouble', label: 'Trouble Shooting' },
        { id: 'sec-retro', label: 'Retrospective' },
      ],
    },
  };

  const overlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalGenre = document.getElementById('modal-genre');
  const modalNav = document.getElementById('modal-nav');
  const modalPanel = document.getElementById('modal-panel');
  const modalClose = document.getElementById('modal-close');

  let activeProject = null;
  let activeSec = null;

  function renderNav() {
    modalNav.innerHTML = '';
    const meta = PROJECTS[activeProject];
    meta.sections.forEach((s) => {
      const btn = document.createElement('button');
      btn.className = 'modal-nav-item' + (s.id === activeSec ? ' active' : '');
      btn.innerHTML = '<span class="dot"></span>' + s.label;
      btn.addEventListener('click', () => goSection(s.id));
      modalNav.appendChild(btn);
    });
  }

  function goSection(id) {
    activeSec = id;
    renderNav();
    const target = document.getElementById(id + '-' + activeProject);
    if (target) {
      modalPanel.scrollTo({ top: target.offsetTop - 16, behavior: 'smooth' });
    }
  }

  function onPanelScroll() {
    if (!activeProject) return;
    const content = document.getElementById('content-' + activeProject);
    const secs = [...content.querySelectorAll('[data-sec]')];
    let cur = secs.length ? secs[0].dataset.sec : null;
    for (const s of secs) {
      if (s.offsetTop - 60 <= modalPanel.scrollTop) cur = s.dataset.sec;
    }
    if (cur && cur !== activeSec) {
      activeSec = cur;
      renderNav();
    }
  }

  function openProject(key) {
    activeProject = key;
    activeSec = 'sec-overview';
    const meta = PROJECTS[key];
    modalTitle.textContent = meta.title;
    modalGenre.textContent = meta.genre;
    renderNav();

    document.querySelectorAll('.modal-content').forEach((el) => { el.hidden = true; });
    document.getElementById('content-' + key).hidden = false;

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { modalPanel.scrollTop = 0; });
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => openProject(card.dataset.project));
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  modalClose.addEventListener('click', closeModal);
  modalPanel.addEventListener('scroll', onPanelScroll);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });

  document.querySelectorAll('.accordion-btn').forEach((btn) => {
    const key = btn.dataset.acc;
    const panel = document.querySelector('.accordion-panel[data-panel="' + key + '"]');
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.toggle('open');
      panel.classList.toggle('open', isOpen);
    });
  });
})();
