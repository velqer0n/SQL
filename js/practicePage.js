import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { TOPICS, PRACTICE_TASKS } from '../data/practice.js';
import { openPracticeTask } from './practiceTaskOverlay.js';
import { renderTopbar } from './topbar.js';

const diffLabel = { easy: 'Легко', mid: 'Средне', hard: 'Сложно' };
const diffClass = { easy: 'diff-easy', mid: 'diff-mid', hard: 'diff-hard' };

export function renderPracticePage(container) {
  container.innerHTML = '';
  container.appendChild(renderTopbar());
  container.appendChild(el('div', { class: 'page-title' }, 'Практика'));
  container.appendChild(el('div', { class: 'page-sub' }, 'Отдельные задачи по темам — тренируйтесь в любом порядке.'));

  let activeTopic = 'all';
  const chipRow = el('div', { class: 'chip-row' });
  const list = el('div');

  function renderChips() {
    chipRow.innerHTML = '';
    const allChip = el('button', { class: `chip ${activeTopic === 'all' ? 'active' : ''}`, onclick: () => select('all') }, 'Все');
    chipRow.appendChild(allChip);
    TOPICS.forEach((t) => {
      chipRow.appendChild(el('button', {
        class: `chip ${activeTopic === t.id ? 'active' : ''}`,
        onclick: () => select(t.id),
      }, t.label));
    });
  }

  function select(topicId) {
    activeTopic = topicId;
    renderChips();
    renderList();
  }

  function renderList() {
    list.innerHTML = '';
    const state = Store.get();
    const tasks = PRACTICE_TASKS.filter((t) => activeTopic === 'all' || t.topic === activeTopic);
    if (!tasks.length) {
      list.appendChild(el('div', { class: 'empty-state' }, 'Пока нет задач в этой теме.'));
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

  renderChips();
  renderList();
  container.append(chipRow, list);
}

function htmlIcon(svg) {
  const span = el('span');
  span.innerHTML = svg;
  return span;
}
