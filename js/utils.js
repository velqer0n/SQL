export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function mdBold(str) {
  return str.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

export const ICONS = {
  book: `<svg viewBox="0 0 24 24"><path d="M4 5c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v14a1 1 0 0 1-1 1H7a3 3 0 0 0-3 3V5z"/></svg>`,
  dumbbell: `<svg viewBox="0 0 24 24"><path d="M2 12h2M20 12h2M6 8v8M18 8v8M6 12h12"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4zM7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3"/></svg>`,
  flag: `<svg viewBox="0 0 24 24"><path d="M5 21V4l14 5-14 5"/></svg>`,
  flame: `<svg viewBox="0 0 24 24"><path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-1 .3-2 1-3 .3 1.3 1.3 2 2 2 0-3-2-4-2-7 1.5 1 4 3 4 8z" fill="currentColor" stroke="none"/></svg>`,
  coin: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="9"/></svg>`,
  ruby: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l6 6-6 14L6 8z"/></svg>`,
  bot: `<svg viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="11" rx="3"/><circle cx="9" cy="13" r="1.3" fill="currentColor"/><circle cx="15" cy="13" r="1.3" fill="currentColor"/><path d="M12 8V4M9 4h6"/></svg>`,
  close: `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"/></svg>`,
  x: `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  expand: `<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/></svg>`,
};
