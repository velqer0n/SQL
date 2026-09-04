import { el } from './utils.js';
import { getItem } from '../data/shop.js';

const COMPOUND_HAIR_PARTS = {
  ponytail: [
    { cls: 'hair-cap' },
    { cls: 'hair-tail hair-tail-right' },
  ],
  bun: [
    { cls: 'hair-cap' },
    { cls: 'hair-bun-circle' },
  ],
  twintails: [
    { cls: 'hair-cap' },
    { cls: 'hair-tail hair-tail-left-tt' },
    { cls: 'hair-tail hair-tail-right-tt' },
  ],
  braid: [
    { cls: 'hair-cap' },
    { cls: 'hair-tail hair-tail-center' },
  ],
};

// Outfit accent parts (waistline on dresses, obi sash on kimono/yukata) are built
// as siblings of the outfit shape, not children — a clip-path on the parent would
// otherwise clip them too (the same bug that hid the hair tails).
const OUTFIT_ACCENT_CLASS = {
  dress: 'outfit-part outfit-waistline',
  kimono: 'outfit-part outfit-obi',
};

/**
 * Builds a DOM node for the equipped avatar: a head (circle) + torso/shoulders
 * (widening shape below) — a bust silhouette, not a single flat colored circle.
 * Hair sits on the head, outfit sits on the torso. No facial features by design.
 * equipped: { avatar, hair, outfit, frame } item ids (frame handled by caller via avatar-shell class)
 */
export function buildAvatarNode(equipped) {
  const body = getItem(equipped.avatar) || getItem('avatar-1');
  const hair = getItem(equipped.hair) || getItem('hair-none');
  const outfit = getItem(equipped.outfit) || getItem('outfit-none');
  const bodyGradient = `linear-gradient(135deg, ${body.colors[0]}, ${body.colors[1]})`;

  // --- Torso (shoulders/chest) — bare skin tone underneath, clothing drawn on top ---
  const torsoBaseEl = el('div', { class: 'avatar-torso-base', style: `background:${bodyGradient};` });

  const outfitEl = el('div', { class: `avatar-outfit avatar-outfit-${outfit.style || 'none'}` });
  if (outfit.style && outfit.style !== 'none') {
    outfitEl.style.background = outfit.color
      || (outfit.accent ? 'conic-gradient(from 0deg,#ef6f6c,#f2b84b,#5cd68a,#4fd8c8,#8b8ff0,#ef6f6c)' : 'var(--teal)');
  }

  const torsoParts = [torsoBaseEl, outfitEl];
  const accentClass = OUTFIT_ACCENT_CLASS[outfit.style];
  if (accentClass) {
    const accentEl = el('div', { class: accentClass });
    accentEl.style.background = outfit.accent || 'rgba(255,255,255,.75)';
    torsoParts.push(accentEl);
  }
  const torsoWrap = el('div', { class: 'avatar-torso-wrap' }, torsoParts);

  // --- Head — hair is nested inside so its existing % -based CSS automatically
  // scales/repositions to the smaller head box, no changes needed to hair CSS. ---
  const headEl = el('div', { class: 'avatar-head', style: `background:${bodyGradient};` });

  const hairStyle = hair.style || 'none';
  const hairColorCss = hair.color
    ? hair.color
    : (hairStyle !== 'none' ? 'conic-gradient(from 0deg,#ef6f6c,#f2b84b,#5cd68a,#4fd8c8,#8b8ff0,#ef6f6c)' : null);

  let hairEl;
  const compoundParts = COMPOUND_HAIR_PARTS[hairStyle];
  if (compoundParts) {
    // Compound styles are built from real sibling divs (not ::before/::after) so a
    // clip-path on one part never clips the others.
    hairEl = el('div', { class: `avatar-hair avatar-hair-${hairStyle}` });
    compoundParts.forEach((part) => {
      const partEl = el('div', { class: `hair-part ${part.cls}` });
      if (hairColorCss) partEl.style.background = hairColorCss;
      hairEl.appendChild(partEl);
    });
  } else {
    hairEl = el('div', { class: `avatar-hair avatar-hair-${hairStyle}` });
    if (hairColorCss) hairEl.style.background = hairColorCss;
  }

  const headWrap = el('div', { class: 'avatar-head-wrap' }, [headEl, hairEl]);

  // Torso painted first (behind), head+hair painted after so the head slightly
  // overlaps the torso's top edge — reads as a neck connection, not two floating shapes.
  return el('div', { class: 'avatar-clip' }, [torsoWrap, headWrap]);
}

/**
 * Builds a small "worn" preview for a shop item — a mini avatar showing the item
 * actually applied (hair/outfit on a neutral body, or a frame ring around one) —
 * instead of a flat color swatch that looks the same as a theme icon.
 */
export function buildItemPreviewNode(item) {
  const equipped = {
    avatar: item.category === 'avatar' ? item.id : 'avatar-6',
    hair: item.category === 'hair' ? item.id : 'hair-none',
    outfit: item.category === 'outfit' ? item.id : 'outfit-none',
    frame: item.category === 'frame' ? item.id : 'frame-none',
  };
  const wrap = el('div', { class: 'shop-item-icon', style: 'padding:0;overflow:visible;background:var(--bg-elev-2);' });
  const shell = el('div', { class: 'avatar-shell', style: 'width:100%;height:100%;margin:0;' }, [buildAvatarNode(equipped)]);
  if (item.category === 'frame' && item.price > 0) {
    shell.classList.add(`frame-rarity-${item.rarity}`);
    if (item.color) shell.style.setProperty('--frame-color', item.color);
  }
  wrap.appendChild(shell);
  return wrap;
}
