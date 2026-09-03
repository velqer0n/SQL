import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { RARITY_LABEL, RARITY_COLOR, itemsByCategory } from '../data/shop.js';
import { applyTheme } from './theme.js';
import { renderTopbar } from './topbar.js';

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex;width:18px;height:18px;' });
  span.innerHTML = svg;
  return span;
}

function itemPreviewIcon(item) {
  if (item.category === 'avatar') {
    return el('div', {
      class: `shop-item-icon avatar-chip rarity-${item.rarity}`,
      style: `background:linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]});`,
    });
  }
  if (item.category === 'theme') {
    return el('div', {
      class: `shop-item-icon rarity-${item.rarity}`,
      style: `background:linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]});`,
    });
  }
  // frame — visual style driven by rarity tier, not per-item
  if (item.rarity === 'common' && item.price === 0) {
    return el('div', { class: 'shop-item-icon', style: 'background:var(--bg-elev-2);color:var(--text-faint);' }, '—');
  }
  if (item.rarity === 'mythical') {
    return el('div', { class: 'shop-item-icon rarity-mythical', style: 'background:conic-gradient(from 0deg,#ef6f6c,#f2b84b,#5cd68a,#4fd8c8,#8b8ff0,#ef6f6c);' });
  }
  const color = item.color || 'var(--teal)';
  return el('div', { class: `shop-item-icon rarity-${item.rarity}`, style: `background:radial-gradient(circle, transparent 52%, ${color} 56%, ${color} 68%, transparent 72%);` });
}

export function renderShopPage(container) {
  container.innerHTML = '';
  container.appendChild(renderTopbar());
  container.appendChild(el('div', { class: 'page-title' }, 'Магазин'));
  container.appendChild(el('div', { class: 'page-sub' }, 'Аватары, рамки и темы — за монеты и рубины.'));

  const tabs = el('div', { class: 'shop-tabs', style: 'position:static;' });
  const tabDefs = [['avatar', 'Аватары'], ['frame', 'Рамки'], ['theme', 'Темы']];
  let activeTab = 'avatar';
  const tabButtons = {};
  tabDefs.forEach(([id, label]) => {
    const btn = el('button', { class: `shop-tab ${id === activeTab ? 'active' : ''}`, onclick: () => setTab(id) }, label);
    tabButtons[id] = btn;
    tabs.appendChild(btn);
  });

  const grid = el('div', { class: 'shop-grid' });

  function setTab(id) {
    activeTab = id;
    Object.entries(tabButtons).forEach(([k, b]) => b.classList.toggle('active', k === id));
    renderGrid();
  }

  function renderGrid() {
    grid.innerHTML = '';
    const items = itemsByCategory(activeTab);
    items.forEach((item) => grid.appendChild(renderItemRow(item)));
  }

  function renderItemRow(item) {
    const s = Store.get();
    const owned = Store.ownsItem(item.id);
    const equipped = s.inventory.equipped[item.category] === item.id;

    const row = el('div', { class: 'shop-item' }, [
      itemPreviewIcon(item),
      el('div', { class: 'shop-item-body' }, [
        el('div', { class: 'shop-item-name' }, item.name),
        el('span', {
          class: 'rarity-badge',
          style: `background:${RARITY_COLOR[item.rarity]}22;color:${RARITY_COLOR[item.rarity]};`,
        }, RARITY_LABEL[item.rarity]),
      ]),
    ]);

    const actionWrap = el('div', { class: 'shop-item-action' });
    if (equipped) {
      actionWrap.appendChild(el('button', { class: 'shop-btn equipped', disabled: true }, 'Надето'));
    } else if (owned) {
      const btn = el('button', { class: 'shop-btn owned' }, 'Выбрать');
      btn.addEventListener('click', () => {
        Store.equipItem(item);
        if (item.category === 'theme') applyTheme();
        renderGrid();
      });
      actionWrap.appendChild(btn);
    } else {
      const btn = el('button', { class: 'shop-btn' });
      const iconSpan = el('span', { style: 'display:flex;width:14px;height:14px;' });
      iconSpan.innerHTML = item.currency === 'rubies' ? ICONS.ruby : ICONS.coin;
      btn.append(String(item.price), iconSpan);
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.gap = '5px';
      btn.addEventListener('click', () => {
        const result = Store.buyItem(item);
        if (result.ok) {
          container.querySelector('.topbar')?.replaceWith(renderTopbar());
          renderGrid();
        } else if (result.reason === 'funds') {
          btn.textContent = 'Не хватает';
          setTimeout(() => renderGrid(), 1200);
        }
      });
      actionWrap.appendChild(btn);
    }
    row.appendChild(actionWrap);
    return row;
  }

  renderGrid();
  container.append(tabs, grid);
}
