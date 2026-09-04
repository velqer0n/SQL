import { el, ICONS, formatTime, mdBold } from './utils.js';
import { Store } from './state.js';
import { renderTaskView } from './taskView.js';
import { feedbackFx, levelUpFx, achievementFx } from './soundFx.js';
import { openAiAssistant } from './aiAssistant.js';
import { fireConfetti } from './confetti.js';

function coinsForErrors(errors) {
  if (errors === 0) return 10;
  if (errors === 1) return 7;
  return 5;
}

// Groups theory slides into 1-3 screens based on total content length, so a
// short theory block shows in full on one screen (single closing tap), while
// a long one is split into roughly even parts instead of forcing a tap after
// every single slide.
function slideWeight(slide) {
  if (slide.type === 'table') return 90 + slide.rows.length * 20;
  return (slide.html ? slide.html.length : 0) + (slide.code ? slide.code.length * 1.2 : 0);
}

function chunkTheorySlides(slides) {
  if (!slides.length) return [[]];
  const totalWeight = slides.reduce((sum, s) => sum + slideWeight(s), 0);
  let pageCount = 1;
  if (totalWeight > 1100 || slides.length > 6) pageCount = 3;
  else if (totalWeight > 550 || slides.length > 3) pageCount = 2;
  pageCount = Math.min(pageCount, slides.length);

  const targetPerPage = totalWeight / pageCount;
  const pages = [];
  let current = [];
  let currentWeight = 0;
  slides.forEach((slide, idx) => {
    current.push(slide);
    currentWeight += slideWeight(slide);
    const remainingSlides = slides.length - idx - 1;
    const remainingPages = pageCount - pages.length - 1;
    if (currentWeight >= targetPerPage && remainingPages > 0 && remainingSlides >= remainingPages) {
      pages.push(current);
      current = [];
      currentWeight = 0;
    }
  });
  if (current.length) pages.push(current);
  return pages;
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
    const confirmRequired = Store.get().settings.confirmAnswers;
    renderQuizQuestionInto(body, footer, q, confirmRequired, (isCorrect, explanation, comboResult) => {
      if (!isCorrect) errors++;
      else quizCorrectFirstTry++;
      footer.innerHTML = '';
      showFeedback(isCorrect, explanation, comboResult, q);
    }, { lessonId: lesson.id, lessonTitle: lesson.title });
  }

  function showFeedback(isCorrect, explanation, comboResult, q) {
    const sheet = el('div', { class: `feedback-sheet ${isCorrect ? 'correct' : 'wrong'}` });
    const children = [
      el('div', { class: 'feedback-head-row' }, [
        el('div', { class: `feedback-icon-badge ${isCorrect ? 'correct' : 'wrong'}` }, isCorrect ? '✓' : '✕'),
        el('div', { class: `feedback-head ${isCorrect ? 'correct' : 'wrong'}`, style: 'margin:0;' }, isCorrect ? 'Правильно!' : 'Неправильно'),
      ]),
      el('div', { class: 'feedback-text' }, explanation || ''),
    ];
    if (isCorrect && comboResult && comboResult.bonusAwarded) {
      children.push(el('div', { class: 'combo-banner' }, `🔥 ${comboResult.combo} верных подряд! +${comboResult.bonusAwarded} монет`));
    }
    if (!isCorrect && q) {
      const explainBtn = el('button', { class: 'btn-secondary', style: 'margin-top:2px;' }, 'Объяснить с Индекс 🔎');
      explainBtn.addEventListener('click', () => {
        openAiAssistant({
          taskTitle: lesson.title,
          taskDescription: q.question,
          getCode: () => '',
        });
      });
      children.push(explainBtn);
    }
    children.push(el('button', { class: 'btn-primary', onclick: () => { sheet.remove(); next(); } }, 'Продолжить'));
    sheet.append(...children);
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
    const isCheckpoint = lesson.kind === 'checkpoint';
    let bonus = null;
    if (isCheckpoint) {
      const rubyRoll = Math.random() < 0.35;
      if (rubyRoll) {
        bonus = { type: 'rubies', amount: 5 + Math.floor(Math.random() * 11) }; // 5-15
        Store.addRubies(bonus.amount);
      } else {
        bonus = { type: 'coins', amount: 15 + Math.floor(Math.random() * 26) }; // 15-40
        Store.addCoins(bonus.amount);
      }
    }

    body.appendChild(el('div', { class: 'complete-wrap' }, [
      el('div', { class: 'complete-emoji' }, isCheckpoint ? '🏆' : '🎉'),
      el('div', { class: 'complete-title' }, isCheckpoint ? 'Глава пройдена!' : 'Урок завершён!'),
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
      bonus ? el('div', {
        class: 'coin-banner',
        style: `margin-top:8px;${bonus.type === 'rubies' ? 'background:rgba(224,84,107,.12);border-color:rgba(224,84,107,.35);color:#e0546b;' : ''}`,
      }, [htmlIcon(bonus.type === 'rubies' ? ICONS.ruby : ICONS.coin), `Бонус главы: +${bonus.amount} ${bonus.type === 'rubies' ? 'рубинов' : 'монет'}`]) : null,
    ]));

    const completionResult = Store.completeLesson(lesson.id, { accuracy, timeSec, errors, coinsEarned: coins });

    if (isCheckpoint) fireConfetti(50);
    if (completionResult.leveledUp) {
      fireConfetti(30);
      levelUpFx();
      body.appendChild(el('div', { class: 'coin-banner', style: 'margin-top:8px;background:rgba(139,143,240,.14);border-color:rgba(139,143,240,.4);color:var(--violet);' },
        `⭐ Новый уровень: ${completionResult.newLevel}!`));
    } else if (isCheckpoint) {
      achievementFx();
    }
    if (completionResult.newAchievements && completionResult.newAchievements.length) {
      completionResult.newAchievements.forEach((a) => {
        body.appendChild(el('div', { class: 'coin-banner', style: 'margin-top:8px;background:rgba(242,184,75,.12);border-color:rgba(242,184,75,.35);color:var(--amber);' },
          `${a.icon} Новая ачивка: ${a.name}`));
      });
      achievementFx();
    }

    footer.appendChild(el('button', { class: 'btn-primary', onclick: () => finish(true) }, 'Продолжить'));
  }

  renderStep();
}

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex' });
  span.innerHTML = svg;
  return span;
}

// ---------------------------------------------------------------------------
// Phase-based flow: theory / quiz / task open as separate path nodes.
// Used by the zigzag path (see pathPage.js). Checkpoints still use the
// combined openLesson() above.
// ---------------------------------------------------------------------------

function renderQuizQuestionInto(body, footer, q, confirmRequired, onAnsweredRaw, context = {}) {
  const onAnswered = (isCorrect, explanation) => {
    feedbackFx(isCorrect);
    const comboResult = Store.recordAnswer(isCorrect);
    if (!isCorrect) {
      Store.addMistake({
        lessonId: context.lessonId || null,
        lessonTitle: context.lessonTitle || '',
        question: q.question,
      });
    }
    onAnsweredRaw(isCorrect, explanation, comboResult);
  };
  body.innerHTML = '';
  footer.innerHTML = '';
  body.appendChild(el('div', { class: 'quiz-q' }, q.question));

  function showConfirmButton() {
    const btn = el('button', { class: 'btn-primary' }, 'Подтвердить');
    btn.disabled = true;
    footer.appendChild(btn);
    return {
      enable: () => { btn.disabled = false; },
      onClick: (fn) => btn.addEventListener('click', fn),
    };
  }

  if (q.type === 'single') {
    let selected = null;
    let answered = false;
    let confirmCtl = null;
    const optionEls = q.options.map((opt, i) => {
      const btn = el('button', { class: 'quiz-option' }, opt);
      btn.addEventListener('click', () => {
        if (answered) return;
        if (!confirmRequired) {
          answered = true;
          selected = i;
          optionEls[i].classList.add('selected');
          const isCorrect = i === q.correctIndex;
          optionEls[q.correctIndex].classList.add('correct');
          if (!isCorrect) optionEls[i].classList.add('wrong');
          onAnswered(isCorrect, q.explanation);
        } else {
          selected = i;
          optionEls.forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');
          confirmCtl.enable();
        }
      });
      return btn;
    });
    optionEls.forEach((b) => body.appendChild(b));

    if (confirmRequired) {
      confirmCtl = showConfirmButton();
      confirmCtl.onClick(() => {
        if (selected == null || answered) return;
        answered = true;
        const isCorrect = selected === q.correctIndex;
        optionEls[q.correctIndex].classList.add('correct');
        if (!isCorrect) optionEls[selected].classList.add('wrong');
        onAnswered(isCorrect, q.explanation);
      });
    }
  }

  if (q.type === 'findline') {
    body.appendChild(el('div', { style: 'color:var(--text-faint);font-size:13px;margin:-8px 0 14px;' }, 'Нажмите на строку, чтобы выбрать её'));
    const codeBox = el('div', { class: 'code-block', style: 'padding:0;overflow:hidden;' });
    let answered = false;
    let selected = null;
    let confirmCtl = null;
    const lineEls = [];
    q.lines.forEach((lineText, i) => {
      const lineEl = el('div', {
        style: 'padding:10px 16px;cursor:pointer;border-bottom:1px solid var(--line);display:flex;gap:12px;',
      }, [
        el('span', { style: 'color:var(--text-faint);user-select:none;min-width:14px;' }, String(i + 1)),
        el('span', {}, lineText),
      ]);
      lineEl.addEventListener('click', () => {
        if (answered) return;
        if (!confirmRequired) {
          answered = true;
          const isCorrect = i === q.errorLine;
          lineEl.style.background = isCorrect ? 'rgba(92,214,138,.18)' : 'rgba(239,111,108,.18)';
          if (!isCorrect) lineEls[q.errorLine].style.background = 'rgba(92,214,138,.18)';
          onAnswered(isCorrect, q.explanation);
        } else {
          selected = i;
          lineEls.forEach((el2) => { el2.style.outline = ''; });
          lineEl.style.outline = '2px solid var(--teal)';
          confirmCtl.enable();
        }
      });
      lineEls.push(lineEl);
      codeBox.appendChild(lineEl);
    });
    body.appendChild(codeBox);

    if (confirmRequired) {
      confirmCtl = showConfirmButton();
      confirmCtl.onClick(() => {
        if (selected == null || answered) return;
        answered = true;
        lineEls.forEach((el2) => { el2.style.outline = ''; });
        const isCorrect = selected === q.errorLine;
        lineEls[selected].style.background = isCorrect ? 'rgba(92,214,138,.18)' : 'rgba(239,111,108,.18)';
        if (!isCorrect) lineEls[q.errorLine].style.background = 'rgba(92,214,138,.18)';
        onAnswered(isCorrect, q.explanation);
      });
    }
  }

  if (q.type === 'truefalse') {
    const options = [['Истина', true], ['Ложь', false]];
    let selected = null;
    let answered = false;
    let confirmCtl = null;
    const row = el('div', { style: 'display:flex;gap:10px;' });
    const optionEls = options.map(([label, val]) => {
      const btn = el('button', { class: 'quiz-option', style: 'flex:1;text-align:center;' }, label);
      btn.addEventListener('click', () => {
        if (answered) return;
        if (!confirmRequired) {
          answered = true;
          btn.classList.add('selected');
          const isCorrect = val === q.correct;
          const correctBtn = optionEls[options.findIndex(([, v]) => v === q.correct)];
          correctBtn.classList.add('correct');
          if (!isCorrect) btn.classList.add('wrong');
          onAnswered(isCorrect, q.explanation);
        } else {
          selected = val;
          optionEls.forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');
          confirmCtl.enable();
        }
      });
      return btn;
    });
    optionEls.forEach((b) => row.appendChild(b));
    body.appendChild(row);

    if (confirmRequired) {
      confirmCtl = showConfirmButton();
      confirmCtl.onClick(() => {
        if (selected == null || answered) return;
        answered = true;
        const isCorrect = selected === q.correct;
        const correctBtn = optionEls[options.findIndex(([, v]) => v === q.correct)];
        correctBtn.classList.add('correct');
        if (!isCorrect) optionEls[options.findIndex(([, v]) => v === selected)].classList.add('wrong');
        onAnswered(isCorrect, q.explanation);
      });
    }
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
    let confirmCtl = null;
    if (confirmRequired) confirmCtl = showConfirmButton();

    function trySubmit() {
      if (chosen.every((c) => c != null)) {
        if (confirmRequired) confirmCtl.enable();
        else submit();
      }
    }

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
          trySubmit();
        });
        optsRow.appendChild(chip);
      });
      group.appendChild(optsRow);
      groups.appendChild(group);
    });
    body.appendChild(groups);

    if (confirmRequired) {
      confirmCtl.onClick(() => { if (!answered) submit(); });
    }

    function submit() {
      answered = true;
      const allCorrect = q.blanks.every((b, i) => chosen[i] === b.correct);
      onAnswered(allCorrect, q.explanation);
    }
  }
}

export function openLessonPhase(lesson, phase, { onClose, variant = 'normal' } = {}) {
  const content = variant === 'hard' ? lesson.hard : lesson;
  const effectiveId = variant === 'hard' ? `${lesson.id}-hard` : lesson.id;
  const overlay = el('div', { class: 'lesson-overlay' });
  const progressFill = el('div', { class: 'lesson-progress-fill' });
  const topbar = el('div', { class: 'lesson-topbar' }, [
    el('button', { class: 'icon-btn', onclick: () => finish() }, htmlIcon(ICONS.close)),
    el('div', { class: 'lesson-progress-track' }, progressFill),
  ]);
  const body = el('div', { class: 'lesson-body' });
  const footer = el('div', { class: 'lesson-footer' });
  overlay.append(topbar, body, footer);
  document.body.appendChild(overlay);

  function finish() {
    overlay.remove();
    if (onClose) onClose();
  }

  if (phase === 'theory') {
    const pages = chunkTheorySlides(content.theory || []);
    let i = 0;
    function renderPage() {
      progressFill.style.width = `${Math.round(((i + 1) / pages.length) * 100)}%`;
      body.innerHTML = '';
      footer.innerHTML = '';
      pages[i].forEach((slide) => {
        if (slide.type === 'table') {
          if (slide.caption) body.appendChild(el('div', { class: 'table-caption', html: slide.caption }));
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
      });
      const isLast = i === pages.length - 1;
      footer.appendChild(el('button', {
        class: 'btn-primary',
        onclick: () => {
          if (isLast) {
            Store.markPhaseDone(effectiveId, 'theory');
            finish();
          } else {
            i++;
            renderPage();
          }
        },
      }, isLast ? 'Завершить' : (i === 0 ? 'Начать' : 'Далее')));
    }
    renderPage();
    return;
  }

  if (phase === 'quiz') {
    const questions = content.quiz || [];
    const confirmRequired = Store.get().settings.confirmAnswers;
    let i = 0;
    let localErrors = 0;
    function renderQ() {
      progressFill.style.width = `${Math.round((i / questions.length) * 100)}%`;
      const q = questions[i];
      renderQuizQuestionInto(body, footer, q, confirmRequired, (isCorrect, explanation, comboResult) => {
        if (!isCorrect) localErrors++;
        footer.innerHTML = '';
        const sheet = el('div', { class: `feedback-sheet ${isCorrect ? 'correct' : 'wrong'}` });
        const children = [
          el('div', { class: 'feedback-head-row' }, [
        el('div', { class: `feedback-icon-badge ${isCorrect ? 'correct' : 'wrong'}` }, isCorrect ? '✓' : '✕'),
        el('div', { class: `feedback-head ${isCorrect ? 'correct' : 'wrong'}`, style: 'margin:0;' }, isCorrect ? 'Правильно!' : 'Неправильно'),
      ]),
          el('div', { class: 'feedback-text' }, explanation || ''),
        ];
        if (isCorrect && comboResult && comboResult.bonusAwarded) {
          children.push(el('div', { class: 'combo-banner' }, `🔥 ${comboResult.combo} верных подряд! +${comboResult.bonusAwarded} монет`));
        }
        if (!isCorrect) {
          const explainBtn = el('button', { class: 'btn-secondary', style: 'margin-top:2px;' }, 'Объяснить с Индекс 🔎');
          explainBtn.addEventListener('click', () => {
            openAiAssistant({ taskTitle: lesson.title, taskDescription: q.question, getCode: () => '' });
          });
          children.push(explainBtn);
        }
        children.push(el('button', {
          class: 'btn-primary',
          onclick: () => {
            sheet.remove();
            i++;
            if (i >= questions.length) {
              Store.addPhaseErrors(effectiveId, localErrors);
              Store.markPhaseDone(effectiveId, 'quiz');
              finish();
            } else {
              renderQ();
            }
          },
        }, 'Продолжить'));
        sheet.append(...children);
        overlay.appendChild(sheet);
      }, { lessonId: effectiveId, lessonTitle: lesson.title });
    }
    renderQ();
    return;
  }

  if (phase === 'task') {
    body.style.padding = '0';
    const wrap = el('div');
    body.appendChild(wrap);
    progressFill.style.width = '100%';
    renderTaskView(wrap, content.task, {
      onSolved: (taskErrors) => {
        const prevErrors = Store.getPhases(effectiveId).errors || 0;
        const totalErrors = prevErrors + taskErrors;
        Store.markPhaseDone(effectiveId, 'task');
        let coins = coinsForErrors(totalErrors);
        let hardBonus = 0;
        if (variant === 'hard') {
          hardBonus = 10;
          coins += hardBonus;
        }
        const totalGraded = (content.quiz ? content.quiz.length : 0) + 1;
        const accuracy = Math.max(0, Math.round(((totalGraded - Math.min(totalErrors, totalGraded)) / totalGraded) * 100));
        const completionResult = Store.completeLesson(effectiveId, { accuracy, timeSec: 0, errors: totalErrors, coinsEarned: coins });
        Store.resetPhaseErrors(effectiveId);

        body.innerHTML = '';
        body.style.padding = '';
        footer.innerHTML = '';
        body.appendChild(el('div', { class: 'complete-wrap' }, [
          el('div', { class: 'complete-emoji' }, variant === 'hard' ? '🔥' : '🎉'),
          el('div', { class: 'complete-title' }, variant === 'hard' ? 'Сложный режим пройден!' : 'Урок завершён!'),
          el('div', { class: 'complete-stats' }, [
            el('div', { class: 'complete-stat' }, [
              el('div', { class: 'lbl' }, 'Точность'),
              el('div', { class: 'val' }, `${accuracy}%`),
            ]),
          ]),
          el('div', { class: 'coin-banner' }, [htmlIcon(ICONS.coin), `+${coins} монет`]),
          hardBonus ? el('div', { style: 'font-size:11.5px;color:var(--text-faint);margin-top:-6px;' }, `Включая +${hardBonus} за сложный режим`) : null,
          completionResult.leveledUp ? el('div', { class: 'coin-banner', style: 'margin-top:8px;background:rgba(139,143,240,.14);border-color:rgba(139,143,240,.4);color:var(--violet);' },
            `⭐ Новый уровень: ${completionResult.newLevel}!`) : null,
          ...(completionResult.newAchievements || []).map((a) => el('div', { class: 'coin-banner', style: 'margin-top:8px;background:rgba(242,184,75,.12);border-color:rgba(242,184,75,.35);color:var(--amber);' },
            `${a.icon} Новая ачивка: ${a.name}`)),
        ]));
        if (completionResult.leveledUp) { fireConfetti(30); levelUpFx(); }
        else if (completionResult.newAchievements && completionResult.newAchievements.length) { achievementFx(); }
        else if (variant === 'hard') { fireConfetti(24); }
        footer.appendChild(el('button', { class: 'btn-primary', onclick: finish }, 'Продолжить'));
      },
    });
  }
}
