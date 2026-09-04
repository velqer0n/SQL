import { el } from './utils.js';
import { Store } from './state.js';

const SLIDES = [
  {
    emoji: '👋',
    title: 'Добро пожаловать в QueryPath!',
    text: 'Это тренажёр по SQL: проходите путь, решайте задачи в практике — и прокачивайте профиль. Коротко объясним, что тут к чему.',
  },
  {
    emoji: '🪙',
    title: 'Монеты и 💎 рубины',
    text: 'Монеты — за уроки на Пути и задачи практики. Рубины — редкая валюта за ежедневные миссии и задачу дня. Обе тратятся в Магазине.',
  },
  {
    emoji: '🔥',
    title: 'Стрик и ⭐ уровень',
    text: 'Стрик — сколько дней подряд вы занимаетесь. Уровень растёт от опыта (XP), который начисляется вместе с монетами за каждый пройденный урок.',
  },
  {
    emoji: '🛍️',
    title: 'Магазин и Миссии',
    text: 'В Магазине — аватары, рамки, темы оформления и сундуки. На вкладке «Миссии» — ежедневные задания, награда за вход и «Работа над ошибками».',
  },
];

export function openOnboarding({ onClose } = {}) {
  const overlay = el('div', { class: 'lesson-overlay', style: 'z-index:200;' });
  let i = 0;

  const body = el('div', { class: 'lesson-body', style: 'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px 28px;' });
  const footer = el('div', { class: 'lesson-footer' });
  overlay.append(body, footer);
  document.body.appendChild(overlay);

  function renderSlide() {
    const slide = SLIDES[i];
    body.innerHTML = '';
    body.append(
      el('div', { style: 'font-size:56px;margin-bottom:18px;' }, slide.emoji),
      el('div', { style: 'font-size:19px;font-weight:800;margin-bottom:10px;' }, slide.title),
      el('div', { style: 'font-size:14.5px;color:var(--text-dim);line-height:1.6;' }, slide.text),
      el('div', { style: 'display:flex;gap:6px;margin-top:24px;' },
        SLIDES.map((_, idx) => el('div', {
          style: `width:${idx === i ? '18px' : '6px'};height:6px;border-radius:3px;background:${idx === i ? 'var(--teal)' : 'var(--line)'};transition:width .2s;`,
        }))),
    );

    footer.innerHTML = '';
    const isLast = i === SLIDES.length - 1;
    if (!isLast) {
      footer.appendChild(el('button', { class: 'btn-secondary', onclick: finish }, 'Пропустить'));
    }
    footer.appendChild(el('button', {
      class: 'btn-primary',
      onclick: () => { if (isLast) finish(); else { i++; renderSlide(); } },
    }, isLast ? 'Начать!' : 'Далее'));
  }

  function finish() {
    Store.setSettings({ onboardingSeen: true });
    overlay.remove();
    if (onClose) onClose();
  }

  renderSlide();
}
