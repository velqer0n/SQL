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

function miniNode({ phase, done, onClick }) {
  const classes = ['hex-btn', 'hex-btn-sm'];
  classes.push(done ? 'done' : 'open');
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
    let lastRowSide = null; // 'left' | 'right' | null
    let currentModuleLessonIds = [];

    function isLessonFullyDone(lesson) {
      return !!state.completedLessons[lesson.id];
    }

    chapters.forEach((lesson, idx) => {
      // module divider — bold, teal, flanked by rule lines for visual weight
      if (lesson.module && lesson.module !== lastModule) {
        if (lastModule !== null) {
          wrap.appendChild(el('div', { class: 'path-connector' }));
        }
        wrap.appendChild(el('div', { class: 'module-divider' }, [
          el('span', { class: 'module-divider-line' }),
          el('span', { class: 'module-divider-text' }, lesson.module),
          el('span', { class: 'module-divider-line' }),
        ]));
        lastModule = lesson.module;
        rowParity = 0;
        lastRowSide = null;
        currentModuleLessonIds = [];
      }

      if (lesson.kind === 'checkpoint') {
        const done = isLessonFullyDone(lesson);
        const moduleComplete = currentModuleLessonIds.length > 0 && currentModuleLessonIds.every((id) => state.completedLessons[id]);
        const locked = !moduleComplete && !done;

        if (lastRowSide) {
          wrap.appendChild(el('div', { class: `zigzag-conn-outer ${lastRowSide}` }, el('div', { class: `zigzag-conn ${done ? 'done' : ''}` })));
        } else if (idx > 0) {
          wrap.appendChild(el('div', { class: 'path-connector' }));
        }

        const classes = ['hex-btn', 'checkpoint'];
        if (done) classes.push('done');
        else if (locked) classes.push('locked');
        else classes.push('open');
        const btn = el('button', { class: classes.join(' ') }, htmlIcon(ICONS.trophy));
        btn.addEventListener('click', () => {
          if (locked) return;
          openLesson(lesson, { onClose: () => renderPathPage(container) });
        });
        wrap.appendChild(el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:6px;' }, [
          btn,
          el('div', { class: 'lesson-row-title checkpoint-title' }, lesson.title),
          locked ? el('div', { style: 'font-size:10.5px;color:var(--text-faint);' }, 'Пройдите все уроки главы') : null,
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
          el('div', { class: 'lesson-row-title' }, lesson.title),
        ]));
        lastRowSide = null;
        return;
      }

      currentModuleLessonIds.push(lesson.id);

      // regular 3-phase lesson — all phases always open, only 'done' differs
      const phases = state.lessonPhases[lesson.id] || { theory: false, quiz: false, task: false };
      const nodeDefs = [
        { phase: 'theory', done: phases.theory },
        { phase: 'quiz', done: phases.quiz },
        { phase: 'task', done: phases.task },
      ];

      const isRtl = rowParity % 2 === 1;
      const side = isRtl ? 'left' : 'right';
      const rowDone = phases.theory && phases.quiz && phases.task;

      if (lastRowSide) {
        wrap.appendChild(el('div', { class: `zigzag-conn-outer ${lastRowSide}` }, el('div', { class: `zigzag-conn ${rowDone ? 'done' : ''}` })));
      } else if (idx > 0) {
        wrap.appendChild(el('div', { class: 'path-connector' }));
      }

      wrap.appendChild(el('div', { class: 'lesson-row-title' }, lesson.title));

      const displayOrder = isRtl ? [...nodeDefs].reverse() : nodeDefs;

      const row = el('div', { class: 'zigzag-row' });
      displayOrder.forEach((nd) => {
        row.appendChild(miniNode({
          phase: nd.phase,
          done: nd.done,
          onClick: () => {
            openLessonPhase(lesson, nd.phase, { onClose: () => renderPathPage(container) });
          },
        }));
      });
      wrap.appendChild(el('div', { class: 'zigzag-row-outer' }, row));

      lastRowSide = side;
      rowParity++;

      // Optional "hard mode" tier: unlocks once the base lesson is fully done.
      if (lesson.hard && rowDone) {
        const hardId = `${lesson.id}-hard`;
        const hardPhases = state.lessonPhases[hardId] || { theory: false, quiz: false, task: false };
        const hardNodeDefs = [
          { phase: 'theory', done: hardPhases.theory },
          { phase: 'quiz', done: hardPhases.quiz },
          { phase: 'task', done: hardPhases.task },
        ];
        const hardIsRtl = rowParity % 2 === 1;
        const hardSide = hardIsRtl ? 'left' : 'right';

        wrap.appendChild(el('div', { class: `zigzag-conn-outer ${lastRowSide}` }, el('div', { class: `zigzag-conn ${rowDone ? 'done' : ''}` })));
        wrap.appendChild(el('div', { class: 'lesson-row-title', style: 'color:var(--coral);' }, `🔥 ${lesson.title} — сложнее`));

        const hardDisplayOrder = hardIsRtl ? [...hardNodeDefs].reverse() : hardNodeDefs;
        const hardRow = el('div', { class: 'zigzag-row' });
        hardDisplayOrder.forEach((nd) => {
          hardRow.appendChild(miniNode({
            phase: nd.phase,
            done: nd.done,
            onClick: () => {
              openLessonPhase(lesson, nd.phase, { onClose: () => renderPathPage(container), variant: 'hard' });
            },
          }));
        });
        wrap.appendChild(el('div', { class: 'zigzag-row-outer' }, hardRow));
        lastRowSide = hardSide;
        rowParity++;
      }
      return;
    });

    container.appendChild(wrap);
  });
}
