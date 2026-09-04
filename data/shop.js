// Shop catalog. category: 'avatar' | 'frame' | 'theme'
// rarity: common | rare | epic | legendary | mythical
// Distribution per category: 5 common, 5 rare, 3 epic, 3 legendary, 2 mythical.
// currency: common/rare/epic -> 'coins'; legendary/mythical -> 'rubies'.
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
  // ================= AVATARS (5/5/3/3/2 = 18) =================
  { id: 'avatar-1', category: 'avatar', name: 'Волна', rarity: 'common', price: 0, currency: 'coins', colors: ['#4fd8c8', '#2c5f5a'] },
  { id: 'avatar-2', category: 'avatar', name: 'Пик', rarity: 'common', price: 0, currency: 'coins', colors: ['#8b8ff0', '#4a4d8f'] },
  { id: 'avatar-3', category: 'avatar', name: 'Искра', rarity: 'common', price: 0, currency: 'coins', colors: ['#f2b84b', '#8a5f1e'] },
  { id: 'avatar-4', category: 'avatar', name: 'Лист', rarity: 'common', price: 0, currency: 'coins', colors: ['#5cd68a', '#215c37'] },
  { id: 'avatar-5', category: 'avatar', name: 'Коралл', rarity: 'common', price: 0, currency: 'coins', colors: ['#ef6f6c', '#7a2c2a'] },

  { id: 'avatar-6', category: 'avatar', name: 'Туман', rarity: 'rare', price: 25, currency: 'coins', colors: ['#9aa1b8', '#454a5e'] },
  { id: 'avatar-7', category: 'avatar', name: 'Полночь', rarity: 'rare', price: 25, currency: 'coins', colors: ['#4f7fe0', '#1c2c52'] },
  { id: 'avatar-8', category: 'avatar', name: 'Лаванда', rarity: 'rare', price: 30, currency: 'coins', colors: ['#c084c0', '#4a2a4a'] },
  { id: 'avatar-9', category: 'avatar', name: 'Янтарь', rarity: 'rare', price: 30, currency: 'coins', colors: ['#e0a34f', '#5c3c14'] },
  { id: 'avatar-10', category: 'avatar', name: 'Мята', rarity: 'rare', price: 35, currency: 'coins', colors: ['#4fd6a0', '#1e5c42'] },

  { id: 'avatar-11', category: 'avatar', name: 'Затмение', rarity: 'epic', price: 90, currency: 'coins', colors: ['#2c1e52', '#8b8ff0'] },
  { id: 'avatar-12', category: 'avatar', name: 'Магма', rarity: 'epic', price: 100, currency: 'coins', colors: ['#7a1e1e', '#f2b84b'] },
  { id: 'avatar-13', category: 'avatar', name: 'Ледник', rarity: 'epic', price: 100, currency: 'coins', colors: ['#1e4a5c', '#4fd8c8'] },

  { id: 'avatar-14', category: 'avatar', name: 'Феникс', rarity: 'legendary', price: 35, currency: 'rubies', colors: ['#ef6f6c', '#f2b84b'] },
  { id: 'avatar-15', category: 'avatar', name: 'Левиафан', rarity: 'legendary', price: 35, currency: 'rubies', colors: ['#1c3c5c', '#4fd8c8'] },
  { id: 'avatar-16', category: 'avatar', name: 'Оракул', rarity: 'legendary', price: 40, currency: 'rubies', colors: ['#4a1c5c', '#c084c0'] },

  { id: 'avatar-17', category: 'avatar', name: 'Космос', rarity: 'mythical', price: 70, currency: 'rubies', colors: ['#1a0f3c', '#ef6f6c'] },
  { id: 'avatar-18', category: 'avatar', name: 'Сингулярность', rarity: 'mythical', price: 80, currency: 'rubies', colors: ['#0a0a1a', '#8b8ff0'] },

  // ================= HAIR (без лица — только силуэт причёски) =================
  { id: 'hair-none', category: 'hair', name: 'Без причёски', rarity: 'common', price: 0, currency: 'coins', style: 'none' },
  { id: 'hair-short-black', category: 'hair', name: 'Короткая, чёрная', rarity: 'common', price: 10, currency: 'coins', style: 'short', color: '#1a1d29' },
  { id: 'hair-short-brown', category: 'hair', name: 'Короткая, каштановая', rarity: 'common', price: 10, currency: 'coins', style: 'short', color: '#6b4226' },
  { id: 'hair-long-black', category: 'hair', name: 'Длинная, чёрная', rarity: 'rare', price: 35, currency: 'coins', style: 'long', color: '#1a1d29' },
  { id: 'hair-long-blonde', category: 'hair', name: 'Длинная, светлая', rarity: 'rare', price: 35, currency: 'coins', style: 'long', color: '#e0c068' },
  { id: 'hair-curly', category: 'hair', name: 'Кудри', rarity: 'epic', price: 90, currency: 'coins', style: 'curly', color: '#8a5f1e' },
  { id: 'hair-mohawk', category: 'hair', name: 'Ирокез', rarity: 'legendary', price: 30, currency: 'rubies', style: 'mohawk', color: '#ef6f6c' },
  { id: 'hair-rainbow', category: 'hair', name: 'Радужная', rarity: 'mythical', price: 60, currency: 'rubies', style: 'long' },

  // ---- Расширение причёсок (вдохновлено референс-подборками, не копия 1:1) ----
  { id: 'hair-short-red', category: 'hair', name: 'Короткая, рыжая', rarity: 'common', price: 12, currency: 'coins', style: 'short', color: '#c4592f' },
  { id: 'hair-short-gray', category: 'hair', name: 'Короткая, седая', rarity: 'common', price: 12, currency: 'coins', style: 'short', color: '#9aa1b8' },
  { id: 'hair-undercut', category: 'hair', name: 'Андеркат', rarity: 'common', price: 15, currency: 'coins', style: 'undercut', color: '#2a2318' },
  { id: 'hair-wavy-brown', category: 'hair', name: 'Волны, каштановые', rarity: 'rare', price: 40, currency: 'coins', style: 'wavy', color: '#7a4a24' },
  { id: 'hair-wavy-auburn', category: 'hair', name: 'Волны, медные', rarity: 'rare', price: 40, currency: 'coins', style: 'wavy', color: '#a85a2e' },
  { id: 'hair-ponytail-black', category: 'hair', name: 'Хвост, чёрный', rarity: 'rare', price: 40, currency: 'coins', style: 'ponytail', color: '#1a1d29' },
  { id: 'hair-bun-brown', category: 'hair', name: 'Пучок, каштановый', rarity: 'rare', price: 45, currency: 'coins', style: 'bun', color: '#6b4226' },
  { id: 'hair-twintails-pink', category: 'hair', name: 'Два хвостика, розовые', rarity: 'epic', price: 100, currency: 'coins', style: 'twintails', color: '#ef8fb8' },
  { id: 'hair-braid-blonde', category: 'hair', name: 'Коса, светлая', rarity: 'epic', price: 100, currency: 'coins', style: 'braid', color: '#e0c068' },
  { id: 'hair-wavy-silver', category: 'hair', name: 'Волны, серебряные', rarity: 'epic', price: 110, currency: 'coins', style: 'wavy', color: '#c7cbe0' },
  { id: 'hair-twintails-violet', category: 'hair', name: 'Два хвостика, фиолетовые', rarity: 'legendary', price: 35, currency: 'rubies', style: 'twintails', color: '#8b6ff0' },
  { id: 'hair-ponytail-fire', category: 'hair', name: 'Хвост, огненный', rarity: 'legendary', price: 35, currency: 'rubies', style: 'ponytail', color: '#f2542d' },
  { id: 'hair-bun-gold', category: 'hair', name: 'Пучок, золотой', rarity: 'legendary', price: 40, currency: 'rubies', style: 'bun', color: '#e0b84f' },
  { id: 'hair-twintails-rainbow', category: 'hair', name: 'Два хвостика, радужные', rarity: 'mythical', price: 70, currency: 'rubies', style: 'twintails' },
  { id: 'hair-braid-galaxy', category: 'hair', name: 'Коса «Галактика»', rarity: 'mythical', price: 80, currency: 'rubies', style: 'braid' },

  // ================= OUTFIT (одежда — плечи/воротник под аватаром) =================
  { id: 'outfit-none', category: 'outfit', name: 'Без одежды', rarity: 'common', price: 0, currency: 'coins', style: 'none' },
  { id: 'outfit-tee-teal', category: 'outfit', name: 'Футболка, бирюза', rarity: 'common', price: 10, currency: 'coins', style: 'crew', color: '#4fd8c8' },
  { id: 'outfit-tee-coral', category: 'outfit', name: 'Футболка, коралл', rarity: 'common', price: 10, currency: 'coins', style: 'crew', color: '#ef6f6c' },
  { id: 'outfit-hoodie-gray', category: 'outfit', name: 'Худи, серое', rarity: 'rare', price: 35, currency: 'coins', style: 'hoodie', color: '#9aa1b8' },
  { id: 'outfit-hoodie-violet', category: 'outfit', name: 'Худи, фиолетовое', rarity: 'rare', price: 35, currency: 'coins', style: 'hoodie', color: '#8b8ff0' },
  { id: 'outfit-collar', category: 'outfit', name: 'Рубашка с воротником', rarity: 'epic', price: 90, currency: 'coins', style: 'collar', color: '#f2b84b' },
  { id: 'outfit-cape', category: 'outfit', name: 'Плащ героя', rarity: 'legendary', price: 30, currency: 'rubies', style: 'cape', color: '#e0546b' },
  { id: 'outfit-gold', category: 'outfit', name: 'Золотая мантия', rarity: 'mythical', price: 60, currency: 'rubies', style: 'cape', color: '#f2b84b' },

  // ---- Платья и кимоно/юката ----
  { id: 'outfit-dress-red', category: 'outfit', name: 'Платье, красное', rarity: 'common', price: 15, currency: 'coins', style: 'dress', color: '#c0304a', accent: '#f4d6df', excludeGender: 'male' },
  { id: 'outfit-dress-black', category: 'outfit', name: 'Платье, чёрное классическое', rarity: 'common', price: 15, currency: 'coins', style: 'dress', color: '#1c1e26', accent: '#c9a24a', excludeGender: 'male' },
  { id: 'outfit-dress-emerald', category: 'outfit', name: 'Платье, изумрудное', rarity: 'rare', price: 40, currency: 'coins', style: 'dress', color: '#1f8a5c', accent: '#e8f5ec', excludeGender: 'male' },
  { id: 'outfit-yukata-blue', category: 'outfit', name: 'Юката, синяя летняя', rarity: 'rare', price: 40, currency: 'coins', style: 'kimono', color: '#3f6fa8', accent: '#f4f0e2' },
  { id: 'outfit-yukata-white', category: 'outfit', name: 'Юката, белая с красным оби', rarity: 'rare', price: 45, currency: 'coins', style: 'kimono', color: '#eef0f4', accent: '#c0304a' },
  { id: 'outfit-dress-gala', category: 'outfit', name: 'Платье, вечернее фиолетовое', rarity: 'epic', price: 100, currency: 'coins', style: 'dress', color: '#5a2e7a', accent: '#e0b84f', excludeGender: 'male' },
  { id: 'outfit-kimono-indigo', category: 'outfit', name: 'Кимоно, индиго', rarity: 'epic', price: 110, currency: 'coins', style: 'kimono', color: '#2a3a6b', accent: '#eef0f4' },
  { id: 'outfit-kimono-sakura', category: 'outfit', name: 'Кимоно «Сакура»', rarity: 'legendary', price: 35, currency: 'rubies', style: 'kimono', color: '#f0a8c0', accent: '#e0b84f' },
  { id: 'outfit-dress-starlight', category: 'outfit', name: 'Платье «Звёздная ночь»', rarity: 'legendary', price: 35, currency: 'rubies', style: 'dress', color: '#161b3a', accent: '#c7cbe0', excludeGender: 'male' },
  { id: 'outfit-kimono-imperial', category: 'outfit', name: 'Кимоно «Императорское»', rarity: 'mythical', price: 70, currency: 'rubies', style: 'kimono', color: '#8a1c2c', accent: '#e0b84f' },
  { id: 'outfit-dress-aurora', category: 'outfit', name: 'Платье «Аврора»', rarity: 'mythical', price: 70, currency: 'rubies', style: 'dress', accent: '#ffffff', excludeGender: 'male' },

  // ================= FRAMES (5/5/3/3/2 = 18) — visuals driven by rarity in shopPage.js =================
  { id: 'frame-none', category: 'frame', name: 'Без рамки', rarity: 'common', price: 0, currency: 'coins' },
  { id: 'frame-teal', category: 'frame', name: 'Бирюзовое кольцо', rarity: 'common', price: 15, currency: 'coins', color: '#4fd8c8' },
  { id: 'frame-green', category: 'frame', name: 'Изумрудное кольцо', rarity: 'common', price: 15, currency: 'coins', color: '#5cd68a' },
  { id: 'frame-blue', category: 'frame', name: 'Синее кольцо', rarity: 'common', price: 15, currency: 'coins', color: '#4f7fe0' },
  { id: 'frame-gray', category: 'frame', name: 'Стальное кольцо', rarity: 'common', price: 15, currency: 'coins', color: '#9aa1b8' },

  { id: 'frame-amber', category: 'frame', name: 'Янтарный ободок', rarity: 'rare', price: 45, currency: 'coins', color: '#f2b84b' },
  { id: 'frame-rose', category: 'frame', name: 'Розовый ободок', rarity: 'rare', price: 45, currency: 'coins', color: '#ef6f9c' },
  { id: 'frame-violet-r', category: 'frame', name: 'Лавандовый ободок', rarity: 'rare', price: 50, currency: 'coins', color: '#c084c0' },
  { id: 'frame-coral', category: 'frame', name: 'Коралловый ободок', rarity: 'rare', price: 50, currency: 'coins', color: '#ef6f6c' },
  { id: 'frame-azure', category: 'frame', name: 'Лазурный ободок', rarity: 'rare', price: 55, currency: 'coins', color: '#4fb4e0' },

  { id: 'frame-violet', category: 'frame', name: 'Аметистовый вихрь', rarity: 'epic', price: 130, currency: 'coins', color: '#8b8ff0' },
  { id: 'frame-crimson', category: 'frame', name: 'Багровый вихрь', rarity: 'epic', price: 140, currency: 'coins', color: '#e0546b' },
  { id: 'frame-emerald', category: 'frame', name: 'Изумрудный вихрь', rarity: 'epic', price: 140, currency: 'coins', color: '#2fa860' },

  { id: 'frame-gold-gem', category: 'frame', name: 'Золотая огранка', rarity: 'legendary', price: 30, currency: 'rubies', color: '#f2b84b' },
  { id: 'frame-sapphire', category: 'frame', name: 'Сапфировая огранка', rarity: 'legendary', price: 30, currency: 'rubies', color: '#4f7fe0' },
  { id: 'frame-ruby-gem', category: 'frame', name: 'Рубиновая огранка', rarity: 'legendary', price: 35, currency: 'rubies', color: '#e0546b' },

  { id: 'frame-rainbow', category: 'frame', name: 'Радужный ореол', rarity: 'mythical', price: 65, currency: 'rubies' },
  { id: 'frame-starlight', category: 'frame', name: 'Звёздный вихрь', rarity: 'mythical', price: 75, currency: 'rubies' },

  // ================= THEMES (5/5/3/3/2 = 18) =================
  { id: 'theme-dark', category: 'theme', name: 'Тёмная', rarity: 'common', price: 0, currency: 'coins', swatch: ['#10131c', '#4fd8c8'], cssClass: '' },
  { id: 'theme-light', category: 'theme', name: 'Светлая', rarity: 'common', price: 0, currency: 'coins', swatch: ['#f4f5f9', '#0f9d8f'], cssClass: 'theme-light' },
  { id: 'theme-mint', category: 'theme', name: 'Тёмная: Мята', rarity: 'common', price: 18, currency: 'coins', swatch: ['#10131c', '#4fd6a0'], cssClass: 'accent-mint' },
  { id: 'theme-plum', category: 'theme', name: 'Тёмная: Слива', rarity: 'common', price: 18, currency: 'coins', swatch: ['#10131c', '#c084c0'], cssClass: 'accent-plum' },
  { id: 'theme-sky', category: 'theme', name: 'Светлая: Небо', rarity: 'common', price: 18, currency: 'coins', swatch: ['#f4f5f9', '#4fb4e0'], cssClass: 'theme-light accent-sky' },

  { id: 'theme-violet-a', category: 'theme', name: 'Тёмная: Аметист', rarity: 'rare', price: 55, currency: 'coins', swatch: ['#10131c', '#8b8ff0'], cssClass: 'accent-violet' },
  { id: 'theme-rose-a', category: 'theme', name: 'Тёмная: Роза', rarity: 'rare', price: 55, currency: 'coins', swatch: ['#10131c', '#ef6f9c'], cssClass: 'accent-rose' },
  { id: 'theme-gold-a', category: 'theme', name: 'Светлая: Золото', rarity: 'rare', price: 55, currency: 'coins', swatch: ['#f4f5f9', '#d9a53a'], cssClass: 'theme-light accent-gold' },
  { id: 'theme-coral-a', category: 'theme', name: 'Светлая: Коралл', rarity: 'rare', price: 55, currency: 'coins', swatch: ['#f4f5f9', '#ef8f6f'], cssClass: 'theme-light accent-coral' },
  { id: 'theme-lime-a', category: 'theme', name: 'Тёмная: Лайм', rarity: 'rare', price: 60, currency: 'coins', swatch: ['#10131c', '#a3d64f'], cssClass: 'accent-lime' },

  { id: 'theme-sunset', category: 'theme', name: 'Закат', rarity: 'epic', price: 130, currency: 'coins', swatch: ['#241521', '#f2795b'], cssClass: 'theme-sunset' },
  { id: 'theme-forest', category: 'theme', name: 'Чаща', rarity: 'epic', price: 130, currency: 'coins', swatch: ['#0f1c14', '#5cd68a'], cssClass: 'theme-forest' },
  { id: 'theme-azure-a', category: 'theme', name: 'Тёмная: Лазурь', rarity: 'epic', price: 140, currency: 'coins', swatch: ['#10131c', '#4f7fe0'], cssClass: 'accent-azure' },

  { id: 'theme-aurora', category: 'theme', name: 'Аврора', rarity: 'legendary', price: 45, currency: 'rubies', swatch: ['#12122a', '#8b8ff0'], cssClass: 'theme-aurora' },
  { id: 'theme-nebula', category: 'theme', name: 'Туманность', rarity: 'legendary', price: 45, currency: 'rubies', swatch: ['#1a0f24', '#ef6f6c'], cssClass: 'theme-nebula' },
  { id: 'theme-amber-a', category: 'theme', name: 'Розовое золото', rarity: 'legendary', price: 50, currency: 'rubies', swatch: ['#10131c', '#e0b84f'], cssClass: 'accent-amber2' },

  { id: 'theme-aurora-myth', category: 'theme', name: 'Мифическая Аврора', rarity: 'mythical', price: 90, currency: 'rubies', swatch: ['#12122a', '#8b8ff0'], cssClass: 'theme-aurora theme-mythical-fx' },
  { id: 'theme-nebula-myth', category: 'theme', name: 'Мифическая Туманность', rarity: 'mythical', price: 100, currency: 'rubies', swatch: ['#1a0f24', '#ef6f6c'], cssClass: 'theme-nebula theme-mythical-fx' },
];

export const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary', 'mythical'];

export function sortByRarity(items, direction = 'asc') {
  const sorted = [...items].sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));
  return direction === 'desc' ? sorted.reverse() : sorted;
}

export function isItemAllowedForGender(item, gender) {
  if (!item.excludeGender || gender === 'unisex') return true;
  return item.excludeGender !== gender;
}

export function getItem(id) {
  return SHOP_ITEMS.find((i) => i.id === id);
}

export function itemsByCategory(category) {
  return SHOP_ITEMS.filter((i) => i.category === category);
}

// ================= CHESTS =================
// odds are percentages that should sum to 100 within a chest.
export const CHESTS = [
  {
    id: 'chest-basic',
    name: 'Простой сундук',
    desc: 'Шанс на любую категорию: аватар, рамку или тему.',
    currency: 'coins',
    price: 40,
    odds: { common: 60, rare: 30, epic: 8, legendary: 1.8, mythical: 0.2 },
  },
  {
    id: 'chest-grand',
    name: 'Большой сундук',
    desc: 'Заметно выше шансы на редкие и эпические предметы.',
    currency: 'coins',
    price: 120,
    odds: { common: 35, rare: 40, epic: 20, legendary: 4.5, mythical: 0.5 },
  },
  {
    id: 'chest-ruby',
    name: 'Рубиновый сундук',
    desc: 'Гарантированно минимум эпический предмет.',
    currency: 'rubies',
    price: 25,
    odds: { epic: 60, legendary: 35, mythical: 5 },
  },
];

export function getChest(id) {
  return CHESTS.find((c) => c.id === id);
}

// ================= CONSUMABLES (stackable, not "owned" once and done) =================
export const CONSUMABLES = [
  {
    id: 'streak-freeze',
    name: 'Заморозка стрика',
    desc: 'Если пропустите день — одна заморозка защитит серию от сброса.',
    price: 20,
    currency: 'coins',
    icon: '❄️',
  },
];

export function getConsumable(id) {
  return CONSUMABLES.find((c) => c.id === id);
}
