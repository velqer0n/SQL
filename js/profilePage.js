import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { LESSONS } from '../data/lessons.js';
import { PRACTICE_TASKS } from '../data/practice.js';
import { getItem } from '../data/shop.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { openSettings } from './settingsPanel.js';
import { buildAvatarNode } from './avatarRender.js';
import { openAvatarEditor } from './avatarEditor.js';
import { openCollection } from './collectionPage.js';

export function renderProfilePage(container) {
  container.innerHTML = '';
  const s = Store.get();

  const equippedFrame = getItem(s.inventory.equipped.frame) || getItem('frame-none');
  const frameRarityClass = equippedFrame.price > 0 ? `frame-rarity-${equippedFrame.rarity}` : '';
  const frameColorVar = equippedFrame.color ? `--frame-color:${equippedFrame.color};` : '';

  const avatarShell = el('div', { class: `avatar-shell ${frameRarityClass}`, style: `${frameColorVar}cursor:pointer;` }, [
    buildAvatarNode(s.inventory.equipped),
  ]);
  avatarShell.addEventListener('click', () => openAvatarEditor({ onClose: () => renderProfilePage(container) }));

  container.appendChild(el('div', { class: 'profile-head' }, [
    avatarShell,
    el('div', { class: 'profile-name' }, s.profile.name),
    el('div', { style: 'font-size:12px;color:var(--teal);font-weight:700;margin-top:4px;' }, 'Нажмите на аватар, чтобы изменить'),
  ]));

  container.appendChild(el('div', { class: 'profile-stats-grid' }, [
    statCard(String(s.coins), 'Монеты'),
    statCard(String(s.rubies), 'Рубины'),
    statCard(String(s.streak), 'Стрик, дней'),
  ]));

  container.appendChild(xpBlock());

  const lessonsDone = Object.keys(s.completedLessons).length;
  const lessonsTotal = LESSONS.filter((l) => !l.placeholder).length;
  const practiceDone = Object.keys(s.completedPractice).length;
  const practiceTotal = PRACTICE_TASKS.length;

  container.appendChild(progressBlock('Путь', lessonsDone, lessonsTotal));
  container.appendChild(progressBlock('Практика', practiceDone, practiceTotal));

  container.appendChild(statsBlock());
  container.appendChild(weeklyReportBlock());

  container.appendChild(achievementsBlock());

  container.appendChild(collectionEntryBlock(container));

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

function statsBlock() {
  const s = Store.get();
  const lessons = Object.values(s.completedLessons);
  const avgAccuracy = lessons.length
    ? Math.round(lessons.reduce((sum, l) => sum + (l.accuracy || 0), 0) / lessons.length)
    : 0;
  const avgTimeSec = lessons.length
    ? Math.round(lessons.reduce((sum, l) => sum + (l.timeSec || 0), 0) / lessons.length)
    : 0;

  const practice = Object.values(s.completedPractice);
  const firstTryCount = practice.filter((p) => p.attempts === 1).length;
  const firstTryPct = practice.length ? Math.round((firstTryCount / practice.length) * 100) : 0;

  const fmtTime = (sec) => {
    if (!sec) return '—';
    const m = Math.floor(sec / 60);
    const s2 = sec % 60;
    return m ? `${m} мин ${s2}с` : `${s2}с`;
  };

  return el('div', { class: 'section-block' }, [
    el('h3', {}, 'Личная статистика'),
    el('div', { class: 'profile-stats-grid' }, [
      statCard(`${avgAccuracy}%`, 'Средняя точность'),
      statCard(fmtTime(avgTimeSec), 'Среднее время урока'),
      statCard(`${firstTryPct}%`, 'Практика с 1-й попытки'),
    ]),
  ]);
}

function xpBlock() {
  const s = Store.get();
  const { level, xpIntoLevel, xpForNextLevel } = Store.getLevelInfo();
  const pct = Math.round((xpIntoLevel / xpForNextLevel) * 100);
  return el('div', { class: 'section-block' }, [
    el('div', { class: 'xp-row' }, [
      el('span', { class: 'xp-level-badge' }, `Уровень ${level}`),
      el('span', { style: 'font-size:11.5px;color:var(--text-faint);' }, `${xpIntoLevel} / ${xpForNextLevel} XP`),
    ]),
    el('div', { class: 'progress-bar-track' }, el('div', { class: 'progress-bar-fill', style: `width:${pct}%;background:var(--violet);` })),
  ]);
}

function weeklyReportBlock() {
  const s = Store.get();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const lessonsThisWeek = Object.values(s.completedLessons).filter((l) => l.completedAt >= weekAgo).length;
  const practiceThisWeek = Object.values(s.completedPractice).filter((p) => p.solvedAt >= weekAgo).length;

  return el('div', { class: 'section-block' }, [
    el('h3', {}, 'За эту неделю'),
    el('div', { class: 'profile-stats-grid' }, [
      statCard(String(lessonsThisWeek), 'Уроков'),
      statCard(String(practiceThisWeek), 'Задач практики'),
      statCard(String(s.streak), 'Дней подряд'),
    ]),
  ]);
}

function achievementsBlock() {
  const s = Store.get();
  const block = el('div', { class: 'section-block' }, [el('h3', {}, 'Ачивки')]);
  const grid = el('div', { class: 'badge-grid' });
  ACHIEVEMENTS.forEach((a) => {
    const unlocked = a.check(s);
    grid.appendChild(el('div', { class: `badge-card ${unlocked ? '' : 'locked'}` }, [
      el('div', { class: 'badge-icon' }, a.icon),
      el('div', { class: 'badge-name' }, a.name),
    ]));
  });
  block.appendChild(grid);
  return block;
}

function collectionEntryBlock(container) {
  const block = el('div', { class: 'section-block' }, [el('h3', {}, 'Коллекция')]);
  const card = el('div', { class: 'task-card' }, [
    el('div', { class: 'task-icon' }, htmlIcon(ICONS.flag)),
    el('div', { class: 'task-body' }, [
      el('div', { class: 'task-title' }, 'Все ваши предметы'),
      el('div', { class: 'task-meta' }, 'Причёски, одежда, рамки, темы и аватары — что уже есть, а что ещё предстоит открыть'),
    ]),
  ]);
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => openCollection({ onClose: () => renderProfilePage(container) }));
  block.appendChild(card);
  return block;
}

function htmlIcon(svg) {
  const span = el('span');
  span.innerHTML = svg;
  return span;
}
