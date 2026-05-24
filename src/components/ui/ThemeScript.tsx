// Inline script to set theme before React hydrates, preventing flash
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var t = localStorage.getItem('portfolio-theme');
        if (t && ['colorful','dark-gold','light-gold'].includes(t)) {
          document.documentElement.setAttribute('data-theme', t);
        } else {
          document.documentElement.setAttribute('data-theme', 'colorful');
        }
      } catch(e) {
        document.documentElement.setAttribute('data-theme', 'colorful');
      }
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
