import { Store } from './state.js';
import { getItem } from '../data/shop.js';

export function applyTheme() {
  const equippedId = Store.get().inventory.equipped.theme || 'theme-dark';
  const item = getItem(equippedId);
  document.body.className = (item && item.cssClass) || '';
}
