// Shop catalog. category: 'avatar' | 'frame' | 'theme'
// rarity: common | rare | epic | legendary | mythical
// currency: 'coins' (common/rare/epic) | 'rubies' (legendary/mythical)
// Free/default items have price 0 and are pre-owned (see state.js defaultState.inventory.owned).

export const RARITY_LABEL = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
  mythical: 'Мифический',
};

export const RARITY_COLOR = {
  common: '#9aa1b8',
  rare: '#4fd8c8',
  epic: '#8b8ff0',
  legendary: '#f2b84b',
  mythical: '#ef6f6c',
};

export const SHOP_ITEMS = [
  // --- Avatars (all free, abstract silhouettes, no photos) ---
  { id: 'avatar-1', category: 'avatar', name: 'Аватар «Волна»', rarity: 'common', price: 0, currency: 'coins', colors: ['#4fd8c8', '#2c5f5a'] },
  { id: 'avatar-2', category: 'avatar', name: 'Аватар «Пик»', rarity: 'common', price: 0, currency: 'coins', colors: ['#8b8ff0', '#4a4d8f'] },
  { id: 'avatar-3', category: 'avatar', name: 'Аватар «Искра»', rarity: 'common', price: 0, currency: 'coins', colors: ['#f2b84b', '#8a5f1e'] },
  { id: 'avatar-4', category: 'avatar', name: 'Аватар «Лист»', rarity: 'common', price: 0, currency: 'coins', colors: ['#5cd68a', '#215c37'] },
  { id: 'avatar-5', category: 'avatar', name: 'Аватар «Коралл»', rarity: 'common', price: 0, currency: 'coins', colors: ['#ef6f6c', '#7a2c2a'] },
  { id: 'avatar-6', category: 'avatar', name: 'Аватар «Туман»', rarity: 'common', price: 0, currency: 'coins', colors: ['#9aa1b8', '#454a5e'] },

  // --- Frames ---
  { id: 'frame-none', category: 'frame', name: 'Без рамки', rarity: 'common', price: 0, currency: 'coins', style: 'none' },
  { id: 'frame-teal', category: 'frame', name: 'Бирюзовое кольцо', rarity: 'common', price: 30, currency: 'coins', style: 'ring', color: '#4fd8c8' },
  { id: 'frame-amber', category: 'frame', name: 'Янтарный ободок', rarity: 'rare', price: 80, currency: 'coins', style: 'ring', color: '#f2b84b' },
  { id: 'frame-violet', category: 'frame', name: 'Аметистовый вихрь', rarity: 'epic', price: 150, currency: 'coins', style: 'double', color: '#8b8ff0' },
  { id: 'frame-gold-gem', category: 'frame', name: 'Золотая огранка', rarity: 'legendary', price: 40, currency: 'rubies', style: 'gem', color: '#f2b84b' },
  { id: 'frame-rainbow', category: 'frame', name: 'Радужный ореол', rarity: 'mythical', price: 90, currency: 'rubies', style: 'rainbow' },

  // --- Themes ---
  { id: 'theme-dark', category: 'theme', name: 'Тёмная', rarity: 'common', price: 0, currency: 'coins', swatch: ['#10131c', '#4fd8c8'] },
  { id: 'theme-light', category: 'theme', name: 'Светлая', rarity: 'common', price: 0, currency: 'coins', swatch: ['#f4f5f9', '#0f9d8f'] },
  { id: 'theme-sunset', category: 'theme', name: 'Закат', rarity: 'rare', price: 60, currency: 'coins', swatch: ['#241521', '#f2795b'] },
  { id: 'theme-forest', category: 'theme', name: 'Чаща', rarity: 'epic', price: 120, currency: 'coins', swatch: ['#0f1c14', '#5cd68a'] },
  { id: 'theme-aurora', category: 'theme', name: 'Аврора', rarity: 'legendary', price: 50, currency: 'rubies', swatch: ['#12122a', '#8b8ff0'] },
  { id: 'theme-nebula', category: 'theme', name: 'Туманность', rarity: 'mythical', price: 100, currency: 'rubies', swatch: ['#1a0f24', '#ef6f6c'] },
];

export function getItem(id) {
  return SHOP_ITEMS.find((i) => i.id === id);
}

export function itemsByCategory(category) {
  return SHOP_ITEMS.filter((i) => i.category === category);
}
