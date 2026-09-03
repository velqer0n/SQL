import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { SECTIONS, LESSONS } from '../data/lessons.js';
import { openLesson, openLessonPhase } from './lessonView.js';
import { renderTopbar } from './topbar.js';

const PHASE_ICON = {
  theory: ICONS.book,
  quiz: ICONS.flag,
  task: ICONS.dumbbell,
};
const PHASE_LABEL = {
  theory: 'Теория',
  quiz: 'Тест',
  task: 'Задача',
};

function htmlIcon(svg) {
  const span = el('span');
  span.innerHTML = svg;
  return span;
}

function miniNode({ phase, locked, done, current, onClick }) {
  const classes = ['hex-btn', 'hex-btn-sm'];
  if (done) classes.push('done');
  else if (locked) classes.push('locked');
  else if (current) classes.push('current');
  const btn = el('button', { class: classes.join(' ') }, htmlIcon(PHASE_ICON[phase]));
  btn.addEventListener('click', onClick);
  return el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:4px;' }, [
    btn,
    el('div', { style: 'font-size:10.5px;color:var(--text-faint);font-weight:600;' }, PHASE_LABEL[phase]),
  ]);
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

    const wrap = el('div', { class: 'zigzag-wrap' });
    const state = Store.get();

    let rowParity = 0; // 0 = LTR, 1 = RTL
    let lastModule = null;
    let firstIncompleteFound = false;
    let lastRowSide = null; // 'left' | 'right' | null

    function isLessonFullyDone(lesson) {
      return !!state.completedLessons[lesson.id];
    }

    chapters.forEach((lesson, idx) => {
      const prevLesson = idx > 0 ? chapters[idx - 1] : null;
      const prevDone = !prevLesson || isLessonFullyDone(prevLesson);

      // module divider
      if (lesson.module && lesson.module !== lastModule) {
        if (lastModule !== null) {
          wrap.appendChild(el('div', { class: 'path-connector' }));
          wrap.appendChild(el('div', {
            style: 'color:var(--text-faint);font-weight:700;font-size:13px;text-align:center;margin:10px 0;letter-spacing:.02em;',
          }, lesson.module));
        }
        lastModule = lesson.module;
        rowParity = 0;
        lastRowSide = null;
      }

      if (lesson.kind === 'checkpoint') {
        const done = isLessonFullyDone(lesson);
        const locked = !prevDone && !done;
        const isCurrent = !done && !locked && !firstIncompleteFound;
        if (isCurrent) firstIncompleteFound = true;

        if (lastRowSide) {
          wrap.appendChild(el('div', { class: `zigzag-conn-outer ${lastRowSide}` }, el('div', { class: `zigzag-conn ${done ? 'done' : ''}` })));
        } else if (idx > 0) {
          wrap.appendChild(el('div', { class: 'path-connector' }));
        }

        const classes = ['hex-btn', 'checkpoint'];
        if (done) classes.push('done');
        else if (locked) classes.push('locked');
        else if (isCurrent) classes.push('current');
        const btn = el('button', { class: classes.join(' ') }, htmlIcon(ICONS.trophy));
        btn.addEventListener('click', () => {
          if (locked) return;
          openLesson(lesson, { onClose: () => renderPathPage(container) });
        });
        wrap.appendChild(el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:6px;' }, [
          btn,
          el('div', { style: 'font-size:11.5px;color:var(--text-faint);font-weight:600;text-align:center;' }, lesson.title),
        ]));
        rowParity = 0;
        lastRowSide = null;
        return;
      }

      if (lesson.placeholder) {
        if (lastRowSide) {
          wrap.appendChild(el('div', { class: `zigzag-conn-outer ${lastRowSide}` }, el('div', { class: 'zigzag-conn' })));
        }
        const btn = el('button', { class: 'hex-btn locked' }, htmlIcon(ICONS.book));
        btn.addEventListener('click', () => alert(`Глава «${lesson.title}» пока не наполнена контентом.`));
        wrap.appendChild(el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:6px;' }, [
          btn,
          el('div', { style: 'font-size:11.5px;color:var(--text-faint);font-weight:600;text-align:center;' }, lesson.title),
        ]));
        lastRowSide = null;
        return;
      }

      // regular 3-phase lesson
      const phases = state.lessonPhases[lesson.id] || { theory: false, quiz: false, task: false };
      const theoryLocked = !prevDone;
      const quizLocked = !phases.theory;
      const taskLocked = !phases.quiz;

      const nodeDefs = [
        { phase: 'theory', locked: theoryLocked, done: phases.theory },
        { phase: 'quiz', locked: quizLocked, done: phases.quiz },
        { phase: 'task', locked: taskLocked, done: phases.task },
      ];

      const isRtl = rowParity % 2 === 1;
      const side = isRtl ? 'left' : 'right';

      if (lastRowSide) {
        wrap.appendChild(el('div', { class: `zigzag-conn-outer ${lastRowSide}` }, el('div', { class: `zigzag-conn ${prevDone ? 'done' : ''}` })));
      } else if (idx > 0) {
        wrap.appendChild(el('div', { class: 'path-connector' }));
      }

      wrap.appendChild(el('div', { style: 'font-size:12px;color:var(--text-dim);font-weight:700;text-align:center;margin-bottom:2px;' }, lesson.title));

      const nodesWithCurrent = nodeDefs.map((nd) => {
        const isCurrent = !nd.done && !nd.locked && !firstIncompleteFound;
        if (isCurrent) firstIncompleteFound = true;
        return { ...nd, isCurrent };
      });

      const displayOrder = isRtl ? [...nodesWithCurrent].reverse() : nodesWithCurrent;

      const row = el('div', { class: 'zigzag-row' });
      displayOrder.forEach((nd) => {
        row.appendChild(miniNode({
          phase: nd.phase,
          locked: nd.locked,
          done: nd.done,
          current: nd.isCurrent,
          onClick: () => {
            if (nd.locked) return;
            openLessonPhase(lesson, nd.phase, { onClose: () => renderPathPage(container) });
          },
        }));
      });
      wrap.appendChild(el('div', { class: 'zigzag-row-outer' }, row));

      lastRowSide = side;
      rowParity++;
    });

    container.appendChild(wrap);
  });
}
