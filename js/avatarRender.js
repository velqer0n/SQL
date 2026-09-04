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
 * Builds a DOM node for the equipped avatar: base body circle + outfit shape +
 * hair shape, clipped to a circle. No facial features by design.
 * equipped: { avatar, hair, outfit, frame } item ids (frame handled by caller via avatar-shell class)
 */
export function buildAvatarNode(equipped) {
  const body = getItem(equipped.avatar) || getItem('avatar-1');
  const hair = getItem(equipped.hair) || getItem('hair-none');
  const outfit = getItem(equipped.outfit) || getItem('outfit-none');

  const bodyEl = el('div', {
    class: 'avatar',
    style: `background:linear-gradient(135deg, ${body.colors[0]}, ${body.colors[1]});margin:0;width:100%;height:100%;`,
  });

  const outfitEl = el('div', { class: `avatar-outfit avatar-outfit-${outfit.style || 'none'}` });
  if (outfit.style && outfit.style !== 'none') {
    outfitEl.style.background = outfit.color
      || (outfit.accent ? 'conic-gradient(from 0deg,#ef6f6c,#f2b84b,#5cd68a,#4fd8c8,#8b8ff0,#ef6f6c)' : 'var(--teal)');
  }

  const outfitParts = [outfitEl];
  const accentClass = OUTFIT_ACCENT_CLASS[outfit.style];
  if (accentClass) {
    const accentEl = el('div', { class: accentClass });
    accentEl.style.background = outfit.accent || 'rgba(255,255,255,.75)';
    outfitParts.push(accentEl);
  }

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

  return el('div', { class: 'avatar-clip' }, [bodyEl, ...outfitParts, hairEl]);
}
