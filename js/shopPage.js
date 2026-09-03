import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { SHOP_ITEMS, RARITY_LABEL, RARITY_COLOR, itemsByCategory } from '../data/shop.js';
import { applyTheme } from './theme.js';

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex;width:18px;height:18px;' });
  span.innerHTML = svg;
  return span;
}

function itemPreviewIcon(item) {
  if (item.category === 'avatar') {
    return el('div', {
      class: 'shop-item-icon avatar-chip',
      style: `background:linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]});`,
    });
  }
  if (item.category === 'theme') {
    return el('div', {
      class: 'shop-item-icon',
      style: `background:linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]});`,
    });
  }
  // frame
  if (item.style === 'none') {
    return el('div', { class: 'shop-item-icon', style: 'background:var(--bg-elev-2);color:var(--text-faint);' }, '—');
  }
  const color = item.color || 'var(--teal)';
  const bg = item.style === 'rainbow'
    ? 'conic-gradient(from 0deg,#ef6f6c,#f2b84b,#5cd68a,#4fd8c8,#8b8ff0,#ef6f6c)'
    : `radial-gradient(circle, transparent 55%, ${color} 58%, ${color} 68%, transparent 71%)`;
  return el('div', { class: 'shop-item-icon', style: `background:${bg};` });
}

export function openShop({ onClose } = {}) {
  const overlay = el('div', { class: 'lesson-overlay' });
  const topbar = el('div', { class: 'lesson-topbar' }, [
    el('button', { class: 'icon-btn', onclick: () => { overlay.remove(); if (onClose) onClose(); } }, htmlIcon(ICONS.close)),
    el('div', { style: 'font-weight:800;font-size:16px;' }, 'Магазин'),
  ]);

  const currencyBar = el('div', { class: 'shop-currency-bar' });
  function renderCurrency() {
    const s = Store.get();
    currencyBar.innerHTML = '';
    currencyBar.append(
      el('div', { class: 'shop-currency', style: 'color:var(--amber);' }, [htmlIcon(ICONS.coin), String(s.coins)]),
      el('div', { class: 'shop-currency', style: 'color:#e0546b;' }, [htmlIcon(ICONS.ruby), String(s.rubies)]),
    );
  }
  renderCurrency();

  const tabs = el('div', { class: 'shop-tabs' });
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
      const priceLabel = item.currency === 'rubies' ? `${item.price} 💎` : `${item.price} 🪙`;
      const btn = el('button', { class: 'shop-btn' }, priceLabel);
      btn.addEventListener('click', () => {
        const result = Store.buyItem(item);
        if (result.ok) {
          renderCurrency();
          renderGrid();
        } else if (result.reason === 'funds') {
          btn.textContent = 'Не хватает';
          setTimeout(() => { btn.textContent = priceLabel; }, 1200);
        }
      });
      actionWrap.appendChild(btn);
    }
    row.appendChild(actionWrap);
    return row;
  }

  renderGrid();

  overlay.append(topbar, currencyBar, tabs, grid);
  document.body.appendChild(overlay);
}
