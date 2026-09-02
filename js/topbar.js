import { el, ICONS } from './utils.js';
import { Store } from './state.js';

export function renderTopbar() {
  const s = Store.get();
  return el('div', { class: 'topbar' }, [
    el('div', { class: 'stat-group' }, [
      el('div', { class: 'stat-pill', style: 'color:var(--coral)' }, [htmlIcon(ICONS.flame), String(s.streak)]),
      el('div', { class: 'stat-pill', style: 'color:var(--amber)' }, [htmlIcon(ICONS.coin), String(s.coins)]),
    ]),
    el('div', { class: 'stat-pill', style: 'color:var(--text-faint);font-weight:700;font-size:13px;' }, '∞ ♥'),
  ]);
}

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex;width:18px;height:18px;' });
  span.innerHTML = svg;
  return span;
}
