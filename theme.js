// Apply the saved choice before first paint; keep controls local to this browser.
(() => {
  const root = document.documentElement;
  let theme = 'dark';
  try { if (localStorage.getItem('portfolio-theme') === 'light') theme = 'light'; } catch {}
  const labels = {
    en: { light: 'Light', dark: 'Black', toLight: 'Switch to light background', toDark: 'Switch to black background' },
    fa: { light: 'روشن', dark: 'مشکی', toLight: 'تغییر به پس‌زمینه روشن', toDark: 'تغییر به پس‌زمینه مشکی' },
    da: { light: 'Lys', dark: 'Sort', toLight: 'Skift til lys baggrund', toDark: 'Skift til sort baggrund' }
  };
  function render() {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#f7f7f2' : '#101010';
    const button = document.getElementById('themeToggle');
    if (!button) return;
    const copy = labels[root.lang] || labels.en;
    const light = theme === 'light';
    button.setAttribute('aria-label', light ? copy.toDark : copy.toLight);
    button.title = light ? copy.toDark : copy.toLight;
    button.firstElementChild.textContent = light ? '◐' : '☀';
    button.querySelector('.theme-label').textContent = light ? copy.dark : copy.light;
  }
  render();
  document.addEventListener('DOMContentLoaded', () => {
    render();
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      theme = theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('portfolio-theme', theme); } catch {}
      render();
    });
  });
  window.addEventListener('portfolio-render', render);
  window.addEventListener('storage', event => {
    if (event.key === 'portfolio-theme') { theme = event.newValue === 'light' ? 'light' : 'dark'; render(); }
  });
})();
