import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { itemsByCategory, RARITY_COLOR } from '../data/shop.js';

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex' });
  span.innerHTML = svg;
  return span;
}

const CATEGORY_LABELS = {
  avatar: 'Тело', hair: 'Причёски', outfit: 'Одежда', frame: 'Рамки', theme: 'Темы',
};

function tinyPreview(item) {
  if (item.category === 'avatar') return `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`;
  if (item.category === 'theme') return `linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]})`;
  if (item.style === 'none' || !item.color) return 'var(--bg-elev-2)';
  return item.color;
}

export function openCollection({ onClose } = {}) {
  const overlay = el('div', { class: 'lesson-overlay' });
  const topbar = el('div', { class: 'lesson-topbar' }, [
    el('button', { class: 'icon-btn', onclick: () => { overlay.remove(); if (onClose) onClose(); } }, htmlIcon(ICONS.close)),
    el('div', { style: 'font-weight:800;font-size:16px;' }, 'Коллекция'),
  ]);

  const tabs = el('div', { class: 'shop-tabs', style: 'position:static;overflow-x:auto;' });
  const categories = ['avatar', 'hair', 'outfit', 'frame', 'theme'];
  let activeCat = 'avatar';
  const tabButtons = {};
  categories.forEach((cat) => {
    const items = itemsByCategory(cat);
    const owned = items.filter((i) => Store.ownsItem(i.id)).length;
    const btn = el('button', {
      class: `shop-tab ${cat === activeCat ? 'active' : ''}`,
      style: 'white-space:nowrap;',
      onclick: () => setTab(cat),
    }, `${CATEGORY_LABELS[cat]} ${owned}/${items.length}`);
    tabButtons[cat] = btn;
    tabs.appendChild(btn);
  });

  const grid = el('div', { class: 'shop-grid', style: 'display:grid;grid-template-columns:repeat(3,1fr);gap:10px;' });

  function setTab(cat) {
    activeCat = cat;
    Object.entries(tabButtons).forEach(([k, b]) => b.classList.toggle('active', k === cat));
    renderGrid();
  }

  function renderGrid() {
    grid.innerHTML = '';
    itemsByCategory(activeCat).forEach((item) => {
      const owned = Store.ownsItem(item.id);
      const cell = el('div', {
        class: `badge-card ${owned ? '' : 'locked'}`,
        style: `border-color:${owned ? RARITY_COLOR[item.rarity] : 'var(--line)'};`,
      }, [
        el('div', {
          style: `width:44px;height:44px;border-radius:50%;margin:0 auto 8px;background:${tinyPreview(item)};display:flex;align-items:center;justify-content:center;font-size:16px;`,
        }, owned ? '' : '🔒'),
        el('div', { class: 'badge-name' }, item.name),
      ]);
      grid.appendChild(cell);
    });
  }

  renderGrid();
  const body = el('div', { class: 'lesson-body', style: 'padding:0;' }, [tabs, grid]);
  overlay.append(topbar, body);
  document.body.appendChild(overlay);
}
