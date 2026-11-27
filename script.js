// Persist Dark/Light Mode across all independent HTML pages
(function initTheme() {
  const savedTheme = localStorage.getItem('rasleen_theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Button
  const themeBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    if (sunIcon && moonIcon) {
      sunIcon.classList.toggle('hidden', !isDark);
      moonIcon.classList.toggle('hidden', isDark);
    }
  }
  updateThemeIcons();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('rasleen_theme', isDark ? 'dark' : 'light');
      updateThemeIcons();
    });
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Smooth Exit Transition when navigating between separate HTML pages
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transform = 'translateY(-10px)';
      document.body.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
      setTimeout(() => {
        window.location.href = href;
      }, 260);
    });
  });

  // Load saved custom links for Projects and Socials if present
  const savedLinks = JSON.parse(localStorage.getItem('rasleen_custom_links') || '{}');
  Object.keys(savedLinks).forEach(key => {
    const el = document.getElementById(key);
    if (el && savedLinks[key]) {
      el.href = savedLinks[key];
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  });
});

// Helper to save custom URLs in browser localStorage
function saveCustomLinks(mapping, statusId) {
  const existing = JSON.parse(localStorage.getItem('rasleen_custom_links') || '{}');
  Object.entries(mapping).forEach(([targetId, inputId]) => {
    const input = document.getElementById(inputId);
    if (input && input.value.trim() !== '') {
      let url = input.value.trim();
      if (!/^https?:\/\//i.test(url) && !url.startsWith('mailto:')) {
        url = 'https://' + url;
      }
      existing[targetId] = url;
      const anchor = document.getElementById(targetId);
      if (anchor) {
        anchor.href = url;
        anchor.target = '_blank';
      }
    }
  });
  localStorage.setItem('rasleen_custom_links', JSON.stringify(existing));
  const status = document.getElementById(statusId);
  if (status) {
    status.classList.remove('hidden');
    setTimeout(() => status.classList.add('hidden'), 3200);
  }
}
