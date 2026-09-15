(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  if (!button) return;

  const label = button.querySelector('.theme-toggle__label');
  const apply = (theme) => {
    const light = theme === 'light';
    if (light) root.dataset.theme = 'light';
    else delete root.dataset.theme;
    button.setAttribute('aria-pressed', String(light));
    button.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} mode`);
    label.textContent = light ? 'Dark' : 'Light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f0eee8' : '#11110f');
  };

  apply(root.dataset.theme === 'light' ? 'light' : 'dark');
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    apply(next);
    try { localStorage.setItem('ckt-theme', next); } catch (error) {}
  });
})();
