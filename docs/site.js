const languageKey = 'StrangeEuphoriaXR.RuntimeImageForge.Web.Language';
const languageLinks = [...document.querySelectorAll('[data-language]')];
languageLinks.forEach(link => link.addEventListener('click', () => {
  try { localStorage.setItem(languageKey, link.dataset.language); } catch { /* Links work without storage. */ }
}));
// Remember language on a fresh English home visit. Direct guides retain their URL language.
if (document.documentElement.lang === 'en' && document.querySelector('.hero')) {
  try {
    const saved = localStorage.getItem(languageKey);
    const target = languageLinks.find(link => link.dataset.language === saved);
    if (target && saved !== 'en') location.replace(target.href + location.hash);
  } catch { /* Storage may be denied; the page remains usable. */ }
}
const stage = document.querySelector('.object-stage');
if (stage) {
  const image = stage.querySelector('img');
  const label = document.querySelector('#output-label');
  const link = document.querySelector('#download-example');
  const assetBase = new URL('.', image.src);
  document.querySelectorAll('[data-item]').forEach(button => {
    button.addEventListener('click', () => {
      if (!button.dataset.file) return;
      image.src = new URL(button.dataset.file, assetBase).href;
      image.alt = button.dataset.alt;
      label.textContent = button.dataset.label;
      link.href = image.src;
      link.download = button.dataset.file;
      document.querySelectorAll('[data-item]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    });
  });
  document.querySelectorAll('[data-surface]').forEach(button => {
    button.addEventListener('click', () => {
      stage.dataset.background = button.dataset.surface;
      document.querySelectorAll('[data-surface]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    });
  });
}

