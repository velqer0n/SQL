// Achievement definitions. Each has a check(state) -> boolean using data already
// tracked elsewhere (no new tracking infra needed for most of these).

export const ACHIEVEMENTS = [
  {
    id: 'a-streak-3',
    icon: '🔥',
    name: '3 дня подряд',
    check: (s) => s.streak >= 3,
  },
  {
    id: 'a-streak-7',
    icon: '🔥',
    name: '7 дней подряд',
    check: (s) => s.streak >= 7,
  },
  {
    id: 'a-streak-30',
    icon: '🔥',
    name: '30 дней подряд',
    check: (s) => s.streak >= 30,
  },
  {
    id: 'a-lessons-5',
    icon: '📘',
    name: '5 уроков пройдено',
    check: (s) => Object.keys(s.completedLessons).length >= 5,
  },
  {
    id: 'a-lessons-15',
    icon: '📗',
    name: '15 уроков пройдено',
    check: (s) => Object.keys(s.completedLessons).length >= 15,
  },
  {
    id: 'a-practice-10',
    icon: '💪',
    name: '10 задач в практике',
    check: (s) => Object.keys(s.completedPractice).length >= 10,
  },
  {
    id: 'a-practice-30',
    icon: '🏋️',
    name: '30 задач в практике',
    check: (s) => Object.keys(s.completedPractice).length >= 30,
  },
  {
    id: 'a-perfect-chapter',
    icon: '🎯',
    name: 'Глава без единой ошибки',
    check: (s) => Object.entries(s.completedLessons).some(([, v]) => v.errors === 0),
  },
  {
    id: 'a-combo-10',
    icon: '⚡',
    name: 'Комбо x10',
    check: (s) => (s.bestCombo || 0) >= 10,
  },
  {
    id: 'a-rich-100',
    icon: '🪙',
    name: '100 монет накоплено',
    check: (s) => s.coins >= 100,
  },
  {
    id: 'a-rubies-20',
    icon: '💎',
    name: '20 рубинов накоплено',
    check: (s) => s.rubies >= 20,
  },
  {
    id: 'a-shop-first',
    icon: '🛍️',
    name: 'Первая покупка в магазине',
    check: (s) => s.inventory.owned.length > 9, // more than the pre-owned defaults
  },
];

export function getUnlockedAchievements(state) {
  return ACHIEVEMENTS.filter((a) => a.check(state));
}
