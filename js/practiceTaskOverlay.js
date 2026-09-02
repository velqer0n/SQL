import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { renderTaskView } from './taskView.js';

export function openPracticeTask(task, { onClose } = {}) {
  const overlay = el('div', { class: 'lesson-overlay' });
  const topbar = el('div', { class: 'lesson-topbar' }, [
    el('button', { class: 'icon-btn', onclick: () => close() }, htmlIcon(ICONS.close)),
    el('div', { style: 'font-weight:800;font-size:15px;' }, task.title),
  ]);
  const body = el('div', { class: 'lesson-body', style: 'padding:0;' });
  overlay.append(topbar, body);
  document.body.appendChild(overlay);

  renderTaskView(body, task, {
    onSolved: () => {
      Store.completePracticeTask(task.id);
    },
  });

  function close() {
    overlay.remove();
    if (onClose) onClose();
  }
}

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex' });
  span.innerHTML = svg;
  return span;
}
