import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { LESSONS } from '../data/lessons.js';
import { PRACTICE_TASKS } from '../data/practice.js';
import { getItem } from '../data/shop.js';
import { openSettings } from './settingsPanel.js';

export function renderProfilePage(container) {
  container.innerHTML = '';
  const s = Store.get();

  const equippedAvatar = getItem(s.inventory.equipped.avatar) || getItem('avatar-1');
  const equippedFrame = getItem(s.inventory.equipped.frame) || getItem('frame-none');
  const frameRarityClass = equippedFrame.price > 0 ? `frame-rarity-${equippedFrame.rarity}` : '';
  const frameColorVar = equippedFrame.color ? `--frame-color:${equippedFrame.color};` : '';

  container.appendChild(el('div', { class: 'profile-head' }, [
    el('div', { class: `avatar-shell ${frameRarityClass}`, style: frameColorVar }, [
      el('div', {
        class: 'avatar',
        style: `background:linear-gradient(135deg, ${equippedAvatar.colors[0]}, ${equippedAvatar.colors[1]});`,
      }),
    ]),
    el('div', { class: 'profile-name' }, s.profile.name),
  ]));

  container.appendChild(el('div', { class: 'profile-stats-grid' }, [
    statCard(String(s.coins), 'Монеты'),
    statCard(String(s.rubies), 'Рубины'),
    statCard(String(s.streak), 'Стрик, дней'),
  ]));

  const lessonsDone = Object.keys(s.completedLessons).length;
  const lessonsTotal = LESSONS.filter((l) => !l.placeholder).length;
  const practiceDone = Object.keys(s.completedPractice).length;
  const practiceTotal = PRACTICE_TASKS.length;

  container.appendChild(progressBlock('Путь', lessonsDone, lessonsTotal));
  container.appendChild(progressBlock('Практика', practiceDone, practiceTotal));

  const settingsBlock = el('div', { class: 'section-block' }, [
    (() => {
      const card = el('div', { class: 'task-card' }, [
        el('div', { class: 'task-icon' }, htmlIcon(ICONS.flag)),
        el('div', { class: 'task-body' }, [
          el('div', { class: 'task-title' }, 'Настройки'),
          el('div', { class: 'task-meta' }, 'Имя, ИИ-ассистент, тест, обновление сайта'),
        ]),
      ]);
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => openSettings({ onClose: () => renderProfilePage(container) }));
      return card;
    })(),
  ]);
  container.appendChild(settingsBlock);

  const resetBtn = el('button', { class: 'btn-secondary', style: 'margin:0 18px;width:calc(100% - 36px);color:var(--coral);border-color:var(--coral);' }, 'Сбросить прогресс');
  resetBtn.addEventListener('click', () => {
    if (confirm('Точно сбросить весь прогресс, монеты, рубины и покупки?')) {
      Store.reset();
      renderProfilePage(container);
    }
  });
  container.appendChild(resetBtn);
  container.appendChild(el('div', { style: 'height:20px;' }));
}

function statCard(num, lbl) {
  return el('div', { class: 'stat-card' }, [
    el('div', { class: 'num' }, num),
    el('div', { class: 'lbl' }, lbl),
  ]);
}

function progressBlock(title, done, total) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return el('div', { class: 'section-block' }, [
    el('h3', {}, `${title} — ${done}/${total}`),
    el('div', { class: 'progress-bar-track' }, el('div', { class: 'progress-bar-fill', style: `width:${pct}%` })),
  ]);
}

function htmlIcon(svg) {
  const span = el('span');
  span.innerHTML = svg;
  return span;
}
