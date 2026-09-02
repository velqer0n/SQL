import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { SECTIONS, LESSONS } from '../data/lessons.js';
import { openLesson } from './lessonView.js';
import { renderTopbar } from './topbar.js';

function nodeIcon(lesson) {
  if (lesson.kind === 'checkpoint') return ICONS.trophy;
  return ICONS.book;
}

export function renderPathPage(container) {
  container.innerHTML = '';
  container.appendChild(renderTopbar());

  SECTIONS.forEach((section) => {
    const chapters = LESSONS.filter((l) => l.section === section.id);

    container.appendChild(el('div', { class: 'section-header' }, [
      el('div', {}, [
        el('div', { class: 'label' }, `РАЗДЕЛ ${section.id}`),
        el('h2', {}, section.title),
      ]),
    ]));

    const pathWrap = el('div', { class: 'path-wrap' });
    const state = Store.get();

    let firstIncompleteFound = false;

    chapters.forEach((lesson, idx) => {
      const done = state.completedLessons[lesson.id];
      const prevDone = idx === 0 || state.completedLessons[chapters[idx - 1].id];
      const locked = !prevDone && !done;
      const isCurrent = !done && !locked && !firstIncompleteFound;
      if (isCurrent) firstIncompleteFound = true;

      if (idx > 0) {
        const connector = el('div', { class: `path-connector ${done ? 'done' : ''}` });
        pathWrap.appendChild(el('div', { class: 'path-node-row' }, connector));
      }

      const classes = ['hex-btn'];
      if (lesson.kind === 'checkpoint') classes.push('checkpoint');
      if (done) classes.push('done');
      else if (locked) classes.push('locked');
      else if (isCurrent) classes.push('current');

      const btn = el('button', { class: classes.join(' ') }, htmlIcon(nodeIcon(lesson)));
      btn.addEventListener('click', () => {
        if (locked) return;
        if (lesson.placeholder) {
          alert(`Глава «${lesson.title}» пока не наполнена контентом — добавим её следующей.`);
          return;
        }
        openLesson(lesson, {
          onClose: () => renderPathPage(container),
        });
      });

      const row = el('div', { class: 'path-node-row', style: 'flex-direction:column;align-items:center;gap:6px;' }, [
        btn,
        el('div', { style: 'font-size:11.5px;color:var(--text-faint);font-weight:600;max-width:100px;text-align:center;' }, lesson.title),
      ]);
      pathWrap.appendChild(row);
    });

    container.appendChild(pathWrap);
  });
}

function htmlIcon(svg) {
  const span = el('span');
  span.innerHTML = svg;
  return span;
}
