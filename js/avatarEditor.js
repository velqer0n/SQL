import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { itemsByCategory, RARITY_LABEL, RARITY_COLOR } from '../data/shop.js';
import { buildAvatarNode } from './avatarRender.js';

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex;width:18px;height:18px;' });
  span.innerHTML = svg;
  return span;
}

export function openAvatarEditor({ onClose } = {}) {
  const overlay = el('div', { class: 'lesson-overlay' });
  const topbar = el('div', { class: 'lesson-topbar' }, [
    el('button', { class: 'icon-btn', onclick: () => { overlay.remove(); if (onClose) onClose(); } }, htmlIcon(ICONS.close)),
    el('div', { style: 'font-weight:800;font-size:16px;' }, 'Редактор аватара'),
  ]);

  // preview = equipped items overridden per-category by whatever is being "tried on"
  let tryOn = {}; // { avatar?: item, hair?: item, outfit?: item }
  let rotation = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragStartRotation = 0;
  let velocity = 0; // deg per ms, for inertia after release
  let lastMoveX = 0;
  let lastMoveT = 0;
  let rafId = null;
  let inertiaId = null;
  const PREVIEW_SIZE = 190;

  const spinHint = el('div', { style: 'text-align:center;font-size:11px;color:var(--text-faint);margin-top:6px;' }, '👆 Потяните в сторону, чтобы повернуть');

  const stage = el('div', { style: 'perspective:900px;display:flex;justify-content:center;padding:24px 0 4px;' });
  const spinner = el('div', {
    style: `position:relative;width:${PREVIEW_SIZE}px;height:${PREVIEW_SIZE}px;transform-style:preserve-3d;cursor:grab;will-change:transform;touch-action:none;`,
  });
  stage.appendChild(spinner);

  function currentEquipped() {
    const s = Store.get();
    return {
      avatar: (tryOn.avatar ? tryOn.avatar.id : s.inventory.equipped.avatar),
      hair: (tryOn.hair ? tryOn.hair.id : s.inventory.equipped.hair),
      outfit: (tryOn.outfit ? tryOn.outfit.id : s.inventory.equipped.outfit),
      frame: s.inventory.equipped.frame,
    };
  }

  function buildFace(rotateDeg, dim) {
    const equipped = currentEquipped();
    const equippedFrame = itemsByCategory('frame').find((f) => f.id === equipped.frame);
    const frameRarityClass = equippedFrame && equippedFrame.price > 0 ? `frame-rarity-${equippedFrame.rarity}` : '';
    const frameColorVar = equippedFrame && equippedFrame.color ? `--frame-color:${equippedFrame.color};` : '';
    const shell = el('div', {
      class: `avatar-shell ${frameRarityClass}`,
      style: `${frameColorVar}position:absolute;inset:0;width:${PREVIEW_SIZE}px;height:${PREVIEW_SIZE}px;
        transform:rotateY(${rotateDeg}deg) translateZ(1px);backface-visibility:hidden;
        filter:brightness(${dim});`,
    }, [buildAvatarNode(equipped)]);
    return shell;
  }

  function renderPreview() {
    spinner.innerHTML = '';
    // front face (normal) + back face (slightly dimmed, mirrored) to sell the "turntable" illusion
    spinner.appendChild(buildFace(0, 1));
    spinner.appendChild(buildFace(180, 0.55));
    applyRotation();
  }
  renderPreview();

  // Rendering the transform through rAF (rather than directly in every pointermove
  // handler) keeps the spin buttery-smooth even if pointer events fire in bursts.
  function applyRotation() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      spinner.style.transform = `rotateY(${rotation}deg)`;
      rafId = null;
    });
  }

  function stopInertia() {
    if (inertiaId) { cancelAnimationFrame(inertiaId); inertiaId = null; }
  }

  spinner.addEventListener('pointerdown', (e) => {
    stopInertia();
    dragging = true;
    dragStartX = e.clientX;
    dragStartRotation = rotation;
    lastMoveX = e.clientX;
    lastMoveT = performance.now();
    velocity = 0;
    spinner.style.cursor = 'grabbing';
    spinner.setPointerCapture(e.pointerId);
  });
  spinner.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const now = performance.now();
    const delta = e.clientX - dragStartX;
    rotation = dragStartRotation + delta * 0.6;
    const dt = now - lastMoveT;
    if (dt > 0) velocity = ((e.clientX - lastMoveX) * 0.6) / dt; // deg per ms
    lastMoveX = e.clientX;
    lastMoveT = now;
    applyRotation();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    spinner.style.cursor = 'grab';
    startInertia();
  }

  // A short, decaying spin after release — makes the drag feel weighty instead of
  // stopping dead the instant the pointer lifts.
  function startInertia() {
    stopInertia();
    let v = velocity * 16; // convert deg/ms to a per-frame (~16ms) step
    if (Math.abs(v) < 0.05) return;
    const friction = 0.94;
    function step() {
      v *= friction;
      rotation += v;
      spinner.style.transform = `rotateY(${rotation}deg)`;
      if (Math.abs(v) > 0.02) {
        inertiaId = requestAnimationFrame(step);
      } else {
        inertiaId = null;
      }
    }
    inertiaId = requestAnimationFrame(step);
  }
  spinner.addEventListener('pointerup', endDrag);
  spinner.addEventListener('pointerleave', endDrag);

  const previewWrap = el('div', {}, [stage, spinHint]);

  const tryOnBanner = el('div');
  function renderTryOnBanner() {
    tryOnBanner.innerHTML = '';
    const activeTryOnKeys = Object.keys(tryOn);
    if (!activeTryOnKeys.length) return;
    const key = activeTryOnKeys[activeTryOnKeys.length - 1];
    const item = tryOn[key];
    const btn = el('button', { class: 'shop-btn' });
    const iconSpan = el('span', { style: 'display:flex;width:14px;height:14px;' });
    iconSpan.innerHTML = item.currency === 'rubies' ? ICONS.ruby : ICONS.coin;
    btn.append('Купить · ', String(item.price), iconSpan);
    btn.style.display = 'flex'; btn.style.alignItems = 'center'; btn.style.gap = '5px';
    btn.addEventListener('click', () => {
      const result = Store.buyItem(item);
      if (result.ok) {
        Store.equipItem(item);
        tryOn = {};
        renderPreview(); renderTryOnBanner(); renderGrid();
      }
    });
    const resetBtn = el('button', { class: 'btn-ghost-sm' }, 'Снять примерку');
    resetBtn.addEventListener('click', () => { tryOn = {}; renderPreview(); renderTryOnBanner(); renderGrid(); });

    tryOnBanner.appendChild(el('div', {
      style: 'margin:10px 18px 0;padding:10px 14px;background:rgba(139,143,240,.12);border:1px solid rgba(139,143,240,.35);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;',
    }, [
      el('div', { style: 'font-size:12.5px;color:var(--violet);font-weight:700;' }, `Примеряете: ${item.name}`),
      el('div', { style: 'display:flex;gap:8px;' }, [resetBtn, btn]),
    ]));
  }

  const tabs = el('div', { class: 'shop-tabs', style: 'position:static;' });
  const tabDefs = [['avatar', 'Тело'], ['hair', 'Причёска'], ['outfit', 'Одежда']];
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
    itemsByCategory(activeTab).forEach((item) => grid.appendChild(renderItemRow(item)));
  }

  function swatch(item) {
    if (item.category === 'avatar') {
      return el('div', { class: 'shop-item-icon', style: `background:linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]});` });
    }
    if (item.style === 'none') {
      return el('div', { class: 'shop-item-icon', style: 'background:var(--bg-elev-2);color:var(--text-faint);' }, '—');
    }
    const bg = item.color || 'conic-gradient(from 0deg,#ef6f6c,#f2b84b,#5cd68a,#4fd8c8,#8b8ff0,#ef6f6c)';
    return el('div', { class: 'shop-item-icon', style: `background:${bg};` });
  }

  function renderItemRow(item) {
    const s = Store.get();
    const owned = Store.ownsItem(item.id);
    const equipped = s.inventory.equipped[item.category] === item.id;
    const isTryingOn = tryOn[item.category] && tryOn[item.category].id === item.id;

    const row = el('div', { class: 'shop-item', style: isTryingOn ? 'border-color:var(--violet);' : '' }, [
      swatch(item),
      el('div', { class: 'shop-item-body' }, [
        el('div', { class: 'shop-item-name' }, item.name),
        el('span', { class: 'rarity-badge', style: `background:${RARITY_COLOR[item.rarity]}22;color:${RARITY_COLOR[item.rarity]};` }, RARITY_LABEL[item.rarity]),
      ]),
    ]);

    // Clicking the row itself always previews the look (owned or not) — cheap and instant.
    row.style.cursor = 'pointer';
    row.addEventListener('click', (e) => {
      if (e.target.closest('button')) return; // let action buttons handle their own clicks
      if (owned) return; // no need to "try on" what's already equippable directly
      tryOn = { ...tryOn, [item.category]: item };
      renderPreview();
      renderTryOnBanner();
      renderGrid();
    });

    const actionWrap = el('div', { class: 'shop-item-action' });
    if (equipped && !isTryingOn) {
      actionWrap.appendChild(el('button', { class: 'shop-btn equipped', disabled: true }, 'Надето'));
    } else if (owned) {
      const btn = el('button', { class: 'shop-btn owned' }, 'Надеть');
      btn.addEventListener('click', () => {
        Store.equipItem(item);
        const { [item.category]: _drop, ...rest } = tryOn;
        tryOn = rest;
        renderPreview(); renderTryOnBanner(); renderGrid();
      });
      actionWrap.appendChild(btn);
    } else {
      const btn = el('button', { class: `shop-btn ${isTryingOn ? '' : 'owned'}` }, isTryingOn ? 'Примеряется' : 'Примерить');
      btn.addEventListener('click', () => {
        tryOn = { ...tryOn, [item.category]: item };
        renderPreview(); renderTryOnBanner(); renderGrid();
      });
      actionWrap.appendChild(btn);
    }
    row.appendChild(actionWrap);
    return row;
  }

  renderGrid();
  renderTryOnBanner();
  overlay.append(topbar, previewWrap, tryOnBanner, tabs, grid);
  document.body.appendChild(overlay);
}
