const STORAGE_KEY = 'biodiscovery-auth';
const PROJECT_KEY = 'biodiscovery-projects';

const getAuthState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (error) {
    return {};
  }
};

const setAuthState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const getProjects = () => {
  try {
    return JSON.parse(localStorage.getItem(PROJECT_KEY) || '[]');
  } catch (error) {
    return [];
  }
};

const setProjects = (projects) => {
  localStorage.setItem(PROJECT_KEY, JSON.stringify(projects));
};

const showToast = (message, type = 'info') => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 2400);
};

const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = 'index.html';
};

const initNavigation = () => {
  const navButtons = document.querySelectorAll('[data-link]');
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-link');
      if (target) {
        window.location.href = target;
      }
    });
  });

  const pageName = document.body.dataset.page;
  const navItems = document.querySelectorAll('.nav-item');

  if (pageName) {
    navItems.forEach((item) => {
      const rel = item.getAttribute('data-page');
      if (rel === pageName) {
        item.classList.add('active');
      }
    });
  }
};

const initLoginPage = () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const authState = getAuthState();
  if (authState.loggedIn) {
    window.location.href = 'dashboard.html';
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const status = document.getElementById('loginStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    const email = (emailInput.value || '').trim();
    const password = (passwordInput.value || '').trim();

    if (!email.includes('@') || password.length < 4) {
      if (status) status.textContent = 'Email ou mot de passe invalide.';
      showToast('Informations de connexion invalides.', 'error');
      return;
    }

    if (status) status.textContent = 'Vérification de vos identifiants...';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion...';
    showToast('Authentification en cours...', 'info');

    setTimeout(() => {
      setAuthState({
        loggedIn: true,
        email,
        name: 'Dr. R. Martin',
        role: 'Chef de projet'
      });

      if (status) status.textContent = 'Connexion réussie.';
      showToast('Connexion réussie. Redirection vers le tableau de bord.', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 900);
    }, 1200);
  });
};

const initSignupPage = () => {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (!name || !email.includes('@') || password.length < 6) {
      showToast('Merci de remplir les informations correctement.', 'error');
      return;
    }

    const account = {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('biodiscovery-users') || '[]');
    existing.push(account);
    localStorage.setItem('biodiscovery-users', JSON.stringify(existing));

    showToast('Compte créé avec succès. Redirection vers la connexion.', 'success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  });
};

const initDashboard = () => {
  const authState = getAuthState();
  if (!authState.loggedIn) {
    window.location.href = 'index.html';
    return;
  }

  const userName = document.querySelector('.user-name');
  const userRole = document.querySelector('.user-role');
  if (userName) userName.textContent = authState.name || 'Dr. R. Martin';
  if (userRole) userRole.textContent = authState.role || 'Chef de projet';

  const logoutButton = document.querySelector('.logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  }
};

const initProjectForm = () => {
  const form = document.getElementById('projectForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const project = {
      name: document.getElementById('projectName').value.trim(),
      disease: document.getElementById('projectDisease').value.trim(),
      target: document.getElementById('projectTarget').value.trim(),
      type: document.getElementById('projectType').value,
      description: document.getElementById('projectDescription').value.trim(),
      status: document.getElementById('projectStatus').value,
      createdAt: new Date().toISOString()
    };

    if (!project.name || !project.disease) {
      showToast('Le nom du projet et la maladie sont requis.', 'error');
      return;
    }

    const projects = getProjects();
    projects.unshift(project);
    setProjects(projects);

    showToast('Projet créé avec succès.', 'success');
    setTimeout(() => {
      window.location.href = 'projects.html';
    }, 1200);
  });
};

const initProjectList = () => {
  const list = document.getElementById('projectList');
  if (!list) return;

  const projects = getProjects();
  const fallback = [
    {
      name: 'Projet Onco-Alpha',
      disease: 'Oncologie',
      target: 'EGFR',
      type: 'Oncologie',
      status: 'Actif',
      description: 'Analyse intégrée des signatures oncologiques et priorisation de cibles sur les voies MAPK et PI3K.'
    },
    {
      name: 'Projet Inflammation-12',
      disease: 'Inflammation',
      target: 'TNF',
      type: 'Immunologie',
      status: 'En cours',
      description: 'Étude des biomarqueurs inflammatoires et évaluation de cibles immunomodulatrices.'
    }
  ];

  const items = projects.length ? projects : fallback;
  list.innerHTML = items.map((project, index) => `
    <article class="project-card">
      <h3>${project.name}</h3>
      <p>${project.description || 'Projet de recherche biomédicale.'}</p>
      <div class="project-meta">
        <span>${project.disease}</span>
        <span class="badge ${index % 2 === 0 ? 'high' : 'medium'}">${project.status || 'Actif'}</span>
      </div>
      <div class="project-meta">
        <span>Cible: ${project.target || 'EGFR'}</span>
        <span>${project.type || 'Oncologie'}</span>
      </div>
      <div class="progress"><span style="width: ${65 + index * 12}%"></span></div>
    </article>
  `).join('');
};

const initDynamicSearch = () => {
  const targetSearch = document.getElementById('targetSearch');
  if (targetSearch) {
    const rows = Array.from(document.querySelectorAll('.target-row'));
    const status = document.getElementById('targetSearchStatus');

    const runSearch = () => {
      const value = targetSearch.value.trim().toLowerCase();
      let visible = 0;

      rows.forEach((row) => {
        const text = (row.dataset.search || row.textContent || '').toLowerCase();
        const match = !value || text.includes(value);
        row.style.display = match ? '' : 'none';
        if (match) visible += 1;
      });

      if (status) status.textContent = `${visible} cible${visible > 1 ? 's' : ''} affichée${visible > 1 ? 's' : ''}`;
    };

    targetSearch.addEventListener('input', runSearch);
  }

  const moleculeSearch = document.getElementById('moleculeSearch');
  if (moleculeSearch) {
    const rows = Array.from(document.querySelectorAll('#moleculeTableBody tr'));
    const status = document.getElementById('moleculeSearchStatus');

    const runSearch = () => {
      const value = moleculeSearch.value.trim().toLowerCase();
      let visible = 0;

      rows.forEach((row) => {
        const text = (row.dataset.search || row.textContent || '').toLowerCase();
        const match = !value || text.includes(value);
        row.style.display = match ? '' : 'none';
        if (match) visible += 1;
      });

      if (status) status.textContent = `${visible} molécule${visible > 1 ? 's' : ''} affichée${visible > 1 ? 's' : ''}`;
    };

    moleculeSearch.addEventListener('input', runSearch);
  }
};

const initFilters = () => {
  const filters = document.querySelectorAll('.filter-bar input, .filter-bar select');
  const filterButton = document.querySelector('.filter-btn');

  if (filterButton) {
    filterButton.addEventListener('click', () => {
      const values = [...filters].map((input) => input.value || '');
      const empty = values.every((value) => !value || value === 'all');

      if (empty) {
        showToast('Aucun critère de filtre n’a été défini.', 'info');
        return;
      }

      showToast('Filtres appliqués avec succès.', 'success');
    });
  }
};

const initRowSelection = () => {
  const targetRows = document.querySelectorAll('.target-row');
  targetRows.forEach((row) => {
    row.addEventListener('click', () => {
      row.classList.toggle('selected');
    });
  });
};

initNavigation();
initLoginPage();
initSignupPage();
initDashboard();
initProjectForm();
initProjectList();
initDynamicSearch();
initFilters();
initRowSelection();
