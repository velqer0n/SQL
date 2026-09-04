import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { RARITY_LABEL, RARITY_COLOR, itemsByCategory, CHESTS, CONSUMABLES, getItem, sortByRarity, isItemAllowedForGender } from '../data/shop.js';
import { applyTheme } from './theme.js';
import { renderTopbar } from './topbar.js';
import { buildItemPreviewNode } from './avatarRender.js';

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex;width:18px;height:18px;' });
  span.innerHTML = svg;
  return span;
}

function itemPreviewIcon(item) {
  if (item.category === 'hair' || item.category === 'outfit' || item.category === 'frame' || item.category === 'avatar') {
    return buildItemPreviewNode(item);
  }
  // theme: flat gradient swatch is the item itself (a color scheme), no "worn" render makes sense
  return el('div', {
    class: `shop-item-icon rarity-${item.rarity}`,
    style: `background:linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]});`,
  });
}

export function renderShopPage(container) {
  container.innerHTML = '';
  container.appendChild(renderTopbar());
  container.appendChild(el('div', { class: 'page-title' }, 'Магазин'));
  container.appendChild(el('div', { class: 'page-sub' }, 'Аватары, рамки и темы — за монеты и рубины.'));

  const tabs = el('div', { class: 'shop-tabs', style: 'position:static;' });
  const tabDefs = [['boost', 'Бустеры'], ['chest', 'Сундуки'], ['avatar', 'Тело'], ['hair', 'Причёски'], ['outfit', 'Одежда'], ['frame', 'Рамки'], ['theme', 'Темы']];
  let activeTab = 'boost';
  const tabButtons = {};
  tabDefs.forEach(([id, label]) => {
    const btn = el('button', { class: `shop-tab ${id === activeTab ? 'active' : ''}`, onclick: () => setTab(id) }, label);
    tabButtons[id] = btn;
    tabs.appendChild(btn);
  });

  const grid = el('div', { class: 'shop-grid' });

  let sortDir = 'asc';
  const sortBtn = el('button', { class: 'facet-btn', style: 'margin:0 18px 10px;display:none;' }, 'Редкость ↑');
  sortBtn.addEventListener('click', () => {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    sortBtn.textContent = sortDir === 'asc' ? 'Редкость ↑' : 'Редкость ↓';
    renderGrid();
  });

  function setTab(id) {
    activeTab = id;
    Object.entries(tabButtons).forEach(([k, b]) => b.classList.toggle('active', k === id));
    sortBtn.style.display = ['boost', 'chest'].includes(id) ? 'none' : '';
    renderGrid();
  }

  function renderGrid() {
    grid.innerHTML = '';
    if (activeTab === 'boost') {
      CONSUMABLES.forEach((item) => grid.appendChild(renderConsumableRow(item)));
      return;
    }
    if (activeTab === 'chest') {
      CHESTS.forEach((chest) => grid.appendChild(renderChestRow(chest)));
      return;
    }
    const items = sortByRarity(itemsByCategory(activeTab), sortDir);
    items.forEach((item) => grid.appendChild(renderItemRow(item)));
  }

  function renderConsumableRow(item) {
    const owned = Store.getConsumableCount(item.id);
    const row = el('div', { class: 'shop-item' }, [
      el('div', { class: 'shop-item-icon', style: 'background:var(--bg-elev-2);font-size:22px;' }, item.icon),
      el('div', { class: 'shop-item-body' }, [
        el('div', { class: 'shop-item-name' }, item.name),
        el('div', { style: 'font-size:11.5px;color:var(--text-faint);margin-top:2px;line-height:1.4;' }, item.desc),
        owned ? el('div', { style: 'font-size:11.5px;color:var(--teal);margin-top:5px;font-weight:700;' }, `У вас: ${owned}`) : null,
      ]),
    ]);
    const btn = el('button', { class: 'shop-btn' });
    const iconSpan = el('span', { style: 'display:flex;width:14px;height:14px;' });
    iconSpan.innerHTML = item.currency === 'rubies' ? ICONS.ruby : ICONS.coin;
      iconSpan.style.color = item.currency === 'rubies' ? '#e0546b' : '#c98a1f';
    btn.append('Купить · ', String(item.price), iconSpan);
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '5px';
    btn.addEventListener('click', () => {
      const result = Store.buyConsumable(item);
      if (result.ok) {
        container.querySelector('.topbar')?.replaceWith(renderTopbar());
        renderGrid();
      } else if (result.reason === 'funds') {
        btn.textContent = 'Не хватает';
        setTimeout(() => renderGrid(), 1200);
      }
    });
    row.appendChild(el('div', { class: 'shop-item-action' }, btn));
    return row;
  }

  function renderChestRow(chest) {
    const oddsText = Object.entries(chest.odds)
      .map(([r, p]) => `${RARITY_LABEL[r]} ${p}%`)
      .join(' · ');
    const row = el('div', { class: 'shop-item', style: 'align-items:flex-start;' }, [
      el('div', { class: 'shop-item-icon', style: 'background:linear-gradient(135deg, var(--amber), #8a5f1e);font-size:22px;' }, '🎁'),
      el('div', { class: 'shop-item-body' }, [
        el('div', { class: 'shop-item-name' }, chest.name),
        el('div', { style: 'font-size:11.5px;color:var(--text-faint);margin-top:4px;line-height:1.5;' }, oddsText),
      ]),
    ]);
    const btn = el('button', { class: 'shop-btn' });
    const iconSpan = el('span', { style: 'display:flex;width:14px;height:14px;' });
    iconSpan.innerHTML = chest.currency === 'rubies' ? ICONS.ruby : ICONS.coin;
    iconSpan.style.color = chest.currency === 'rubies' ? '#e0546b' : '#c98a1f';
    btn.append('Открыть · ', String(chest.price), iconSpan);
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '5px';
    btn.addEventListener('click', () => {
      const result = Store.openChest(chest);
      if (!result.ok) {
        if (result.reason === 'funds') {
          btn.textContent = 'Не хватает';
          setTimeout(() => renderGrid(), 1200);
        }
        return;
      }
      container.querySelector('.topbar')?.replaceWith(renderTopbar());
      showChestReveal(result);
    });
    row.appendChild(el('div', { class: 'shop-item-action' }, btn));
    return row;
  }

  function showChestReveal(result) {
    const overlay = el('div', { class: 'lesson-overlay', style: 'z-index:140;background:rgba(0,0,0,.7);align-items:center;justify-content:center;display:flex;' });
    let inner;
    if (result.item) {
      const item = result.item;
      inner = el('div', { class: 'complete-wrap', style: 'padding:40px 24px;' }, [
        el('div', { class: 'complete-emoji' }, '🎉'),
        el('div', { class: 'complete-title' }, 'Новый предмет!'),
        (() => {
          const node = itemPreviewIcon(item);
          node.style.width = '72px';
          node.style.height = '72px';
          node.style.margin = '10px auto';
          return node;
        })(),
        el('div', { style: 'font-weight:800;font-size:16px;margin-bottom:4px;' }, item.name),
        el('span', { class: 'rarity-badge', style: `background:${RARITY_COLOR[item.rarity]}22;color:${RARITY_COLOR[item.rarity]};` }, RARITY_LABEL[item.rarity]),
      ]);
    } else {
      const comp = result.compensation;
      inner = el('div', { class: 'complete-wrap', style: 'padding:40px 24px;' }, [
        el('div', { class: 'complete-emoji' }, '💰'),
        el('div', { class: 'complete-title' }, 'Уже есть всё такой редкости'),
        el('div', { class: 'coin-banner' }, [htmlIcon(comp.currency === 'rubies' ? ICONS.ruby : ICONS.coin), `Компенсация: +${comp.amount}`]),
      ]);
    }
    const closeBtn = el('button', { class: 'btn-primary', style: 'margin-top:16px;width:200px;' }, 'Ура!');
    closeBtn.addEventListener('click', () => { overlay.remove(); renderGrid(); });
    inner.appendChild(closeBtn);
    overlay.appendChild(el('div', { style: 'background:var(--bg-elev);border-radius:20px;padding:8px;max-width:320px;width:90%;' }, inner));
    document.body.appendChild(overlay);
  }

  function renderItemRow(item) {
    const s = Store.get();
    const owned = Store.ownsItem(item.id);
    const equipped = s.inventory.equipped[item.category] === item.id;
    const allowed = isItemAllowedForGender(item, Store.getGender());

    const row = el('div', { class: 'shop-item', style: allowed ? '' : 'opacity:.45;' }, [
      itemPreviewIcon(item),
      el('div', { class: 'shop-item-body' }, [
        el('div', { class: 'shop-item-name' }, item.name),
        el('span', {
          class: 'rarity-badge',
          style: `background:${RARITY_COLOR[item.rarity]}22;color:${RARITY_COLOR[item.rarity]};`,
        }, RARITY_LABEL[item.rarity]),
      ]),
    ]);

    if (!allowed) {
      row.appendChild(el('div', { class: 'shop-item-action', style: 'font-size:11px;color:var(--text-faint);max-width:80px;text-align:right;' }, 'Недоступно для этого пола'));
      return row;
    }

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
      iconSpan.style.color = item.currency === 'rubies' ? '#e0546b' : '#c98a1f';
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
  container.append(tabs, sortBtn, grid);
}
