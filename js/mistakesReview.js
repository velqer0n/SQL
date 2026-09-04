import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { LESSONS } from '../data/lessons.js';

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex' });
  span.innerHTML = svg;
  return span;
}

function findQuestionObject(mistake) {
  const lesson = LESSONS.find((l) => l.id === mistake.lessonId);
  if (!lesson || !lesson.quiz) return null;
  return lesson.quiz.find((q) => q.question === mistake.question) || null;
}

export function openMistakesReview({ onClose } = {}) {
  const overlay = el('div', { class: 'lesson-overlay' });
  const topbar = el('div', { class: 'lesson-topbar' }, [
    el('button', { class: 'icon-btn', onclick: () => { overlay.remove(); if (onClose) onClose(); } }, htmlIcon(ICONS.close)),
    el('div', { style: 'font-weight:800;font-size:16px;' }, 'Работа над ошибками'),
  ]);
  const body = el('div', { class: 'lesson-body' });
  overlay.append(topbar, body);
  document.body.appendChild(overlay);

  renderList();

  function renderList() {
    body.innerHTML = '';
    const mistakes = Store.getMistakes();
    if (!mistakes.length) {
      body.appendChild(el('div', { class: 'empty-state' }, 'Пока нет вопросов для повторения — отлично!'));
      return;
    }
    body.appendChild(el('div', { style: 'color:var(--text-faint);font-size:13px;margin-bottom:14px;' },
      `${mistakes.length} вопрос(ов), где были ошибки. Повторите — и они исчезнут из списка.`));

    mistakes.slice().reverse().forEach((m) => {
      const card = el('div', { class: 'task-card' }, [
        el('div', { class: 'task-icon' }, htmlIcon(ICONS.flag)),
        el('div', { class: 'task-body' }, [
          el('div', { class: 'task-title', style: 'font-size:13.5px;' }, m.question),
          el('div', { class: 'task-meta' }, m.lessonTitle || 'Из теста'),
        ]),
      ]);
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => openRetry(m));
      body.appendChild(card);
    });
  }

  function openRetry(mistake) {
    const q = findQuestionObject(mistake);
    if (!q) {
      Store.removeMistake(mistake.addedAt);
      renderList();
      return;
    }
    body.innerHTML = '';
    const qBody = el('div');
    const qFooter = el('div', { style: 'margin-top:16px;' });
    body.append(qBody, qFooter);

    renderRetryQuestion(qBody, qFooter, q, mistake);
  }

  function renderRetryQuestion(qBody, qFooter, q, mistake) {
    qBody.appendChild(el('div', { class: 'quiz-q' }, q.question));
    if (q.type === 'single' || q.type === 'truefalse') {
      const options = q.type === 'single' ? q.options.map((o, i) => [o, i]) : [['Истина', true], ['Ложь', false]];
      const correctVal = q.type === 'single' ? q.correctIndex : q.correct;
      let answered = false;
      options.forEach(([label, val]) => {
        const btn = el('button', { class: 'quiz-option' }, label);
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const isCorrect = val === correctVal;
          btn.classList.add(isCorrect ? 'correct' : 'wrong');
          if (isCorrect) {
            Store.removeMistake(mistake.addedAt);
            qFooter.appendChild(el('div', { style: 'color:var(--green);font-weight:700;margin-bottom:10px;' }, '✓ Верно! Вопрос убран из списка.'));
          } else {
            qFooter.appendChild(el('div', { style: 'color:var(--coral);font-weight:700;margin-bottom:10px;' }, '✕ Пока не совсем — попробуйте ещё раз позже.'));
          }
          const backBtn = el('button', { class: 'btn-primary' }, 'Назад к списку');
          backBtn.addEventListener('click', renderList);
          qFooter.appendChild(backBtn);
        });
        qBody.appendChild(btn);
      });
    } else {
      // findline / fillblank fallback: just show explanation + solution reminder, mark reviewed
      qBody.appendChild(el('div', { style: 'color:var(--text-dim);font-size:13.5px;margin-top:10px;' }, q.explanation || ''));
      const gotItBtn = el('button', { class: 'btn-primary', style: 'margin-top:14px;' }, 'Разобрался, убрать из списка');
      gotItBtn.addEventListener('click', () => { Store.removeMistake(mistake.addedAt); renderList(); });
      qFooter.appendChild(gotItBtn);
    }
  }
}
