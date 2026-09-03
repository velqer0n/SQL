import { Store } from './state.js';

export function applyTheme() {
  const equipped = Store.get().inventory.equipped.theme || 'theme-dark';
  document.body.className = equipped === 'theme-dark' ? '' : equipped;
}
