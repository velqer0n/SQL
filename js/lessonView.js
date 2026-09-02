import { el, ICONS, formatTime, mdBold } from './utils.js';
import { Store } from './state.js';
import { renderTaskView } from './taskView.js';

function coinsForErrors(errors) {
  if (errors === 0) return 10;
  if (errors === 1) return 7;
  return 5;
}

export function openLesson(lesson, { onClose } = {}) {
  const startTime = Date.now();
  let errors = 0;
  let totalQuizQuestions = lesson.quiz ? lesson.quiz.length : 0;
  let quizCorrectFirstTry = 0;

  const steps = [
    ...(lesson.theory || []).map((slide) => ({ kind: 'theory', slide })),
    ...(lesson.quiz || []).map((q) => ({ kind: 'quiz', q })),
    { kind: 'task' },
  ];
  let stepIndex = 0;

  const overlay = el('div', { class: 'lesson-overlay' });
  const progressFill = el('div', { class: 'lesson-progress-fill' });
  const topbar = el('div', { class: 'lesson-topbar' }, [
    el('button', { class: 'icon-btn', onclick: () => finish(false) }, htmlIcon(ICONS.close)),
    el('div', { class: 'lesson-progress-track' }, progressFill),
  ]);
  const body = el('div', { class: 'lesson-body' });
  const footer = el('div', { class: 'lesson-footer' });

  overlay.append(topbar, body, footer);
  document.body.appendChild(overlay);

  function updateProgress() {
    const pct = Math.round((stepIndex / steps.length) * 100);
    progressFill.style.width = `${pct}%`;
  }

  function finish(completed) {
    overlay.remove();
    if (onClose) onClose(completed);
  }

  function next() {
    stepIndex++;
    if (stepIndex >= steps.length) return;
    renderStep();
  }

  function renderStep() {
    updateProgress();
    body.innerHTML = '';
    footer.innerHTML = '';
    const step = steps[stepIndex];
    if (step.kind === 'theory') renderTheory(step.slide);
    else if (step.kind === 'quiz') renderQuiz(step.q);
    else if (step.kind === 'task') renderTask();
  }

  function renderTheory(slide) {
    if (slide.type === 'table') {
      body.appendChild(el('div', { class: 'table-caption', html: slide.caption }));
      const table = el('table', { class: 'data-table' });
      table.appendChild(el('thead', {}, el('tr', {}, slide.columns.map((c) => el('th', {}, c)))));
      const tbody = el('tbody');
      slide.rows.forEach((r) => tbody.appendChild(el('tr', {}, r.map((v) => el('td', {}, String(v))))));
      table.appendChild(tbody);
      body.appendChild(table);
    } else {
      body.appendChild(el('div', { class: 'theory-text', html: slide.html }));
      if (slide.code) body.appendChild(el('div', { class: 'code-block' }, slide.code));
    }
    footer.appendChild(el('button', { class: 'btn-primary', onclick: next }, stepIndex === 0 ? 'Начать' : 'Завершить'));
  }

  function renderQuiz(q) {
    body.appendChild(el('div', { class: 'quiz-q' }, q.question));

    if (q.type === 'single') {
      let selected = null;
      const optionEls = q.options.map((opt, i) => {
        const btn = el('button', { class: 'quiz-option' }, opt);
        btn.addEventListener('click', () => {
          if (selected != null) return;
          selected = i;
          optionEls[i].classList.add('selected');
          const isCorrect = i === q.correctIndex;
          if (!isCorrect) errors++;
          else quizCorrectFirstTry++;
          optionEls[q.correctIndex].classList.add('correct');
          if (!isCorrect) optionEls[i].classList.add('wrong');
          showFeedback(isCorrect, q.explanation);
        });
        return btn;
      });
      optionEls.forEach((b) => body.appendChild(b));
    }

    if (q.type === 'truefalse') {
      const options = [['Истина', true], ['Ложь', false]];
      const row = el('div', { style: 'display:flex;gap:10px;' });
      const optionEls = options.map(([label, val]) => {
        const btn = el('button', { class: 'quiz-option', style: 'flex:1;text-align:center;' }, label);
        btn.addEventListener('click', () => {
          if (optionEls.some((b) => b.classList.contains('selected'))) return;
          btn.classList.add('selected');
          const isCorrect = val === q.correct;
          if (!isCorrect) errors++;
          else quizCorrectFirstTry++;
          const correctBtn = optionEls[options.findIndex(([, v]) => v === q.correct)];
          correctBtn.classList.add('correct');
          if (!isCorrect) btn.classList.add('wrong');
          showFeedback(isCorrect, q.explanation);
        });
        return btn;
      });
      optionEls.forEach((b) => row.appendChild(b));
      body.appendChild(row);
    }

    if (q.type === 'fillblank') {
      const chosen = new Array(q.blanks.length).fill(null);
      const preview = el('div', { class: 'blank-preview' });
      const groups = el('div');

      function renderPreview() {
        preview.innerHTML = '';
        preview.appendChild(document.createTextNode(q.template[0] || ''));
        q.blanks.forEach((b, i) => {
          const slot = el('span', { class: 'blank-slot' }, chosen[i] || '____');
          preview.appendChild(slot);
          preview.appendChild(document.createTextNode(q.template[i + 1] || ''));
        });
      }
      renderPreview();
      body.appendChild(preview);

      let answered = false;
      q.blanks.forEach((blank, bi) => {
        const group = el('div', { class: 'blank-group' }, [
          el('div', { class: 'blank-label' }, `Пропуск ${bi + 1}:`),
        ]);
        const optsRow = el('div', { class: 'blank-options' });
        blank.options.forEach((opt) => {
          const chip = el('button', { class: 'blank-chip' }, opt);
          chip.addEventListener('click', () => {
            if (answered) return;
            chosen[bi] = opt;
            [...optsRow.children].forEach((c) => c.classList.remove('selected'));
            chip.classList.add('selected');
            renderPreview();
            if (chosen.every((c) => c != null)) submitFillBlank();
          });
          optsRow.appendChild(chip);
        });
        group.appendChild(optsRow);
        groups.appendChild(group);
      });
      body.appendChild(groups);

      function submitFillBlank() {
        answered = true;
        const allCorrect = q.blanks.every((b, i) => chosen[i] === b.correct);
        if (!allCorrect) errors++;
        else quizCorrectFirstTry++;
        showFeedback(allCorrect, q.explanation);
      }
    }
  }

  function showFeedback(isCorrect, explanation) {
    const sheet = el('div', { class: `feedback-sheet ${isCorrect ? 'correct' : 'wrong'}` });
    sheet.append(
      el('div', { class: `feedback-head ${isCorrect ? 'correct' : 'wrong'}` }, isCorrect ? '✓ Правильно!' : '✕ Неправильно'),
      el('div', { class: 'feedback-text' }, explanation || ''),
      el('button', { class: 'btn-primary', onclick: () => { sheet.remove(); next(); } }, 'Продолжить')
    );
    overlay.appendChild(sheet);
  }

  function renderTask() {
    const t = lesson.task;
    if (!t) { showCompletion(); return; }
    body.style.padding = '0';
    const wrap = el('div');
    body.appendChild(wrap);
    renderTaskView(wrap, t, {
      onSolved: (taskErrors) => {
        errors += taskErrors;
        showCompletion();
      },
    });
  }

  function showCompletion() {
    body.style.padding = '';
    body.innerHTML = '';
    footer.innerHTML = '';
    progressFill.style.width = '100%';

    const timeSec = Math.round((Date.now() - startTime) / 1000);
    const totalGraded = totalQuizQuestions + 1; // quiz questions + the task
    const correctCount = quizCorrectFirstTry + (errors <= totalQuizQuestions ? 1 : 0); // rough accuracy signal
    const accuracy = Math.max(0, Math.round(((totalGraded - Math.min(errors, totalGraded)) / totalGraded) * 100));
    const coins = coinsForErrors(errors);

    body.appendChild(el('div', { class: 'complete-wrap' }, [
      el('div', { class: 'complete-emoji' }, '🎉'),
      el('div', { class: 'complete-title' }, 'Урок завершён!'),
      el('div', { class: 'complete-stats' }, [
        el('div', { class: 'complete-stat' }, [
          el('div', { class: 'lbl' }, 'Точность'),
          el('div', { class: 'val' }, `${accuracy}%`),
        ]),
        el('div', { class: 'complete-stat' }, [
          el('div', { class: 'lbl' }, 'Время'),
          el('div', { class: 'val' }, formatTime(timeSec)),
        ]),
      ]),
      el('div', { class: 'coin-banner' }, [htmlIcon(ICONS.coin), `+${coins} монет`]),
    ]));

    Store.completeLesson(lesson.id, { accuracy, timeSec, errors, coinsEarned: coins });

    footer.appendChild(el('button', { class: 'btn-primary', onclick: () => finish(true) }, 'Продолжить'));
  }

  renderStep();
}

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex' });
  span.innerHTML = svg;
  return span;
}
