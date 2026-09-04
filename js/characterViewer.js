import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { itemsByCategory } from '../data/shop.js';
import { buildAvatarNode } from './avatarRender.js';

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex;width:22px;height:22px;' });
  span.innerHTML = svg;
  return span;
}

/**
 * Full-viewport character viewer. Single-finger drag rotates (Y axis), two-finger
 * pinch (or mouse wheel) zooms. No facial features are rendered by design — the
 * avatar is body + outfit + hair only.
 */
export function openCharacterViewer({ onClose, onEdit } = {}) {
  const overlay = el('div', { class: 'char-viewer' });

  let rotation = 20; // start at a slight angle, looks livelier than dead-on front
  let scale = 1;
  let dragging = false;
  let dragStartX = 0;
  let dragStartRotation = 0;
  let velocity = 0;
  let lastMoveX = 0;
  let lastMoveT = 0;
  let rafId = null;
  let inertiaId = null;
  const MIN_SCALE = 0.7;
  const MAX_SCALE = 2.6;
  const SIZE = 260;

  const stage = el('div', { class: 'char-viewer-stage' });
  const spinner = el('div', { class: 'char-viewer-spinner', style: `width:${SIZE}px;height:${SIZE}px;` });
  stage.appendChild(spinner);

  function currentEquipped() {
    return Store.get().inventory.equipped;
  }

  function buildFace(rotateDeg, dim) {
    const equipped = currentEquipped();
    const equippedFrame = itemsByCategory('frame').find((f) => f.id === equipped.frame);
    const frameRarityClass = equippedFrame && equippedFrame.price > 0 ? `frame-rarity-${equippedFrame.rarity}` : '';
    const frameColorVar = equippedFrame && equippedFrame.color ? `--frame-color:${equippedFrame.color};` : '';
    return el('div', {
      class: `avatar-shell ${frameRarityClass}`,
      style: `${frameColorVar}position:absolute;inset:0;width:${SIZE}px;height:${SIZE}px;
        transform:rotateY(${rotateDeg}deg) translateZ(1px);backface-visibility:hidden;
        filter:brightness(${dim});`,
    }, [buildAvatarNode(equipped)]);
  }

  function renderAvatar() {
    spinner.innerHTML = '';
    spinner.appendChild(buildFace(0, 1));
    spinner.appendChild(buildFace(180, 0.55));
    applyTransform();
  }

  function applyTransform() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      spinner.style.transform = `scale(${scale}) rotateY(${rotation}deg)`;
      rafId = null;
    });
  }

  function stopInertia() {
    if (inertiaId) { cancelAnimationFrame(inertiaId); inertiaId = null; }
  }

  // ---- single-finger drag = rotate ----
  stage.addEventListener('pointerdown', (e) => {
    if (activePointers.size >= 2) return; // a pinch is in progress, ignore as a drag
    stopInertia();
    dragging = true;
    dragStartX = e.clientX;
    dragStartRotation = rotation;
    lastMoveX = e.clientX;
    lastMoveT = performance.now();
    velocity = 0;
    stage.style.cursor = 'grabbing';
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging || activePointers.size >= 2) return;
    const now = performance.now();
    const delta = e.clientX - dragStartX;
    rotation = dragStartRotation + delta * 0.5;
    const dt = now - lastMoveT;
    if (dt > 0) velocity = ((e.clientX - lastMoveX) * 0.5) / dt;
    lastMoveX = e.clientX;
    lastMoveT = now;
    applyTransform();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    stage.style.cursor = 'grab';
    startInertia();
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointerleave', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  function startInertia() {
    stopInertia();
    let v = velocity * 16;
    if (Math.abs(v) < 0.05) return;
    const friction = 0.94;
    function step() {
      v *= friction;
      rotation += v;
      spinner.style.transform = `scale(${scale}) rotateY(${rotation}deg)`;
      if (Math.abs(v) > 0.02) inertiaId = requestAnimationFrame(step);
      else inertiaId = null;
    }
    inertiaId = requestAnimationFrame(step);
  }

  // ---- two-finger pinch = zoom ----
  const activePointers = new Map();
  let pinchStartDist = null;
  let pinchStartScale = 1;

  stage.addEventListener('pointerdown', (e) => {
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.size === 2) {
      dragging = false;
      const pts = [...activePointers.values()];
      pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartScale = scale;
    }
  });
  stage.addEventListener('pointermove', (e) => {
    if (!activePointers.has(e.pointerId)) return;
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.size === 2 && pinchStartDist) {
      const pts = [...activePointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStartScale * (dist / pinchStartDist)));
      applyTransform();
    }
  });
  function clearPointer(e) {
    activePointers.delete(e.pointerId);
    if (activePointers.size < 2) pinchStartDist = null;
  }
  stage.addEventListener('pointerup', clearPointer);
  stage.addEventListener('pointercancel', clearPointer);
  stage.addEventListener('pointerleave', clearPointer);

  // ---- mouse wheel = zoom (desktop) ----
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale - e.deltaY * 0.0015));
    applyTransform();
  }, { passive: false });

  // ---- UI chrome ----
  const topRow = el('div', { class: 'char-viewer-top' }, [
    el('button', { class: 'icon-btn', style: 'color:#fff;', onclick: () => { overlay.remove(); if (onClose) onClose(); } }, htmlIcon(ICONS.close)),
  ]);

  const zoomControls = el('div', { class: 'char-viewer-zoom' }, [
    (() => {
      const b = el('button', { class: 'char-zoom-btn' }, '−');
      b.addEventListener('click', () => { scale = Math.max(MIN_SCALE, scale - 0.2); applyTransform(); });
      return b;
    })(),
    (() => {
      const b = el('button', { class: 'char-zoom-btn' }, '+');
      b.addEventListener('click', () => { scale = Math.min(MAX_SCALE, scale + 0.2); applyTransform(); });
      return b;
    })(),
  ]);

  const editBtn = el('button', { class: 'btn-primary', style: 'width:auto;padding:14px 32px;' }, 'Изменить');
  editBtn.addEventListener('click', () => {
    overlay.remove();
    if (onEdit) onEdit();
  });

  const hint = el('div', { class: 'char-viewer-hint' }, '👆 Потяните — поворот · щипок или колесо — зум');

  overlay.append(stage,
    el('div', { class: 'char-viewer-ui' }, [
      topRow,
      zoomControls,
      el('div', { class: 'char-viewer-bottom-group' }, [hint, el('div', { class: 'char-viewer-bottom' }, editBtn)]),
    ]));
  document.body.appendChild(overlay);
  renderAvatar();
}
