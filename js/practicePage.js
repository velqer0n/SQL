import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { TOPICS, PRACTICE_TASKS } from '../data/practice.js';
import { openPracticeTask } from './practiceTaskOverlay.js';
import { renderTopbar } from './topbar.js';

const diffLabel = { easy: 'Легко', mid: 'Средне', hard: 'Сложно' };
const diffClass = { easy: 'diff-easy', mid: 'diff-mid', hard: 'diff-hard' };
const DIFFICULTIES = [['easy', 'Легко'], ['mid', 'Средне'], ['hard', 'Сложно']];

// Maps a practice task's `topic` to the Path chapter it belongs to, for the "Глава" filter.
const TOPIC_TO_CHAPTER = {
  select: 'Введение', distinct: 'Введение',
  where: 'Условия', and: 'Условия', or: 'Условия', not: 'Условия',
  null: 'NULL и сортировка', order: 'NULL и сортировка', limit: 'NULL и сортировка',
  in: 'Больше ключевых слов', between: 'Больше ключевых слов', like: 'Больше ключевых слов',
  agg: 'Прочее',
};
const CHAPTERS = [...new Set(Object.values(TOPIC_TO_CHAPTER))];

export function renderPracticePage(container) {
  container.innerHTML = '';
  container.appendChild(renderTopbar());
  container.appendChild(el('div', { class: 'page-title' }, 'Практика'));
  container.appendChild(el('div', { class: 'page-sub' }, 'Отдельные задачи — фильтруйте по сложности, главе или функции.'));

  const filters = { difficulty: new Set(), chapter: new Set(), topic: new Set() };
  let openGroup = null;
  let searchQuery = '';

  const searchInput = el('input', { class: 'ai-input', style: 'width:calc(100% - 36px);margin:0 18px 12px;', placeholder: 'Поиск по названию задачи…' });
  searchInput.addEventListener('input', () => { searchQuery = searchInput.value.trim().toLowerCase(); renderList(); });

  const filterBar = el('div', { class: 'facet-bar' });
  const panelHost = el('div');
  const list = el('div');

  function groupCount(key) { return filters[key].size; }

  function renderFilterBar() {
    filterBar.innerHTML = '';
    const groups = [
      ['difficulty', 'Сложность'],
      ['chapter', 'Глава'],
      ['topic', 'Функция'],
    ];
    groups.forEach(([key, label]) => {
      const count = groupCount(key);
      const btn = el('button', {
        class: `facet-btn ${openGroup === key ? 'active' : ''} ${count ? 'has-value' : ''}`,
        onclick: () => { openGroup = openGroup === key ? null : key; renderFilterBar(); renderPanel(); },
      }, [label, count ? ` (${count})` : '', ' ', el('span', { style: 'display:inline-block;transform:scale(.8);' }, openGroup === key ? '▲' : '▼')]);
      filterBar.appendChild(btn);
    });
    if (Object.values(filters).some((s) => s.size)) {
      const clearBtn = el('button', { class: 'facet-btn clear', onclick: () => { filters.difficulty.clear(); filters.chapter.clear(); filters.topic.clear(); renderFilterBar(); renderPanel(); renderList(); } }, 'Сбросить');
      filterBar.appendChild(clearBtn);
    }
  }

  function renderPanel() {
    panelHost.innerHTML = '';
    if (!openGroup) return;
    const panel = el('div', { class: 'facet-panel' });
    let options;
    if (openGroup === 'difficulty') options = DIFFICULTIES.map(([id, label]) => ({ id, label }));
    else if (openGroup === 'chapter') options = CHAPTERS.map((c) => ({ id: c, label: c }));
    else options = TOPICS.map((t) => ({ id: t.id, label: t.label }));

    options.forEach((opt) => {
      const active = filters[openGroup].has(opt.id);
      const chip = el('button', {
        class: `chip ${active ? 'active' : ''}`,
        onclick: () => {
          if (active) filters[openGroup].delete(opt.id); else filters[openGroup].add(opt.id);
          renderFilterBar();
          renderPanel();
          renderList();
        },
      }, opt.label);
      panel.appendChild(chip);
    });
    panelHost.appendChild(panel);
  }

  function taskMatches(task) {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery)) return false;
    if (filters.difficulty.size && !filters.difficulty.has(task.difficulty)) return false;
    if (filters.topic.size && !filters.topic.has(task.topic)) return false;
    if (filters.chapter.size) {
      const chapter = TOPIC_TO_CHAPTER[task.topic] || 'Прочее';
      if (!filters.chapter.has(chapter)) return false;
    }
    return true;
  }

  function renderList() {
    list.innerHTML = '';
    const tasks = PRACTICE_TASKS.filter(taskMatches);
    if (!tasks.length) {
      list.appendChild(el('div', { class: 'empty-state' }, 'Нет задач по выбранным фильтрам.'));
      return;
    }
    tasks.forEach((task) => {
      const solved = Store.isPracticeDone(task.id);
      const card = el('div', { class: `task-card ${solved ? 'solved' : ''}` }, [
        el('div', { class: 'task-icon' }, htmlIcon(solved ? ICONS.check : ICONS.dumbbell)),
        el('div', { class: 'task-body' }, [
          el('div', { class: 'task-title' }, task.title),
          el('div', { class: 'task-meta' }, [
            el('span', { class: `diff-dot ${diffClass[task.difficulty]}` }),
            diffLabel[task.difficulty],
          ]),
        ]),
      ]);
      card.addEventListener('click', () => {
        openPracticeTask(task, { onClose: () => renderList() });
      });
      list.appendChild(card);
    });
  }

  renderFilterBar();
  renderPanel();
  renderList();
  container.append(searchInput, filterBar, panelHost, list);
}

function htmlIcon(svg) {
  const span = el('span');
  span.innerHTML = svg;
  return span;
}
