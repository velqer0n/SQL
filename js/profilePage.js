import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { LESSONS } from '../data/lessons.js';
import { PRACTICE_TASKS } from '../data/practice.js';

export function renderProfilePage(container) {
  container.innerHTML = '';
  const s = Store.get();

  const initial = (s.profile.name || 'Г').slice(0, 1).toUpperCase();
  container.appendChild(el('div', { class: 'profile-head' }, [
    el('div', { class: 'avatar' }, initial),
    el('div', { class: 'profile-name' }, s.profile.name),
  ]));

  container.appendChild(el('div', { class: 'profile-stats-grid' }, [
    statCard(String(s.coins), 'Монеты'),
    statCard(String(s.streak), 'Стрик, дней'),
    statCard(String(Object.keys(s.completedLessons).length), 'Уроков'),
  ]));

  const lessonsDone = Object.keys(s.completedLessons).length;
  const lessonsTotal = LESSONS.filter((l) => !l.placeholder).length;
  const practiceDone = Object.keys(s.completedPractice).length;
  const practiceTotal = PRACTICE_TASKS.length;

  container.appendChild(progressBlock('Путь', lessonsDone, lessonsTotal));
  container.appendChild(progressBlock('Практика', practiceDone, practiceTotal));

  container.appendChild(comingSoonBlock('Миссии', 'Ежедневные и еженедельные задания появятся здесь.'));
  container.appendChild(comingSoonBlock('Магазин', 'Скоро сюда можно будет тратить монеты.'));

  container.appendChild(aiSettingsBlock());

  const nameBlock = el('div', { class: 'section-block' }, [
    el('h3', {}, 'Имя'),
    (() => {
      const input = el('input', { class: 'ai-input', style: 'width:100%;', value: s.profile.name });
      input.addEventListener('change', () => Store.setProfileName(input.value || 'Гость'));
      return input;
    })(),
  ]);
  container.appendChild(nameBlock);

  const resetBtn = el('button', { class: 'btn-secondary', style: 'margin:0 18px;width:calc(100% - 36px);color:var(--coral);border-color:var(--coral);' }, 'Сбросить прогресс');
  resetBtn.addEventListener('click', () => {
    if (confirm('Точно сбросить весь прогресс, монеты и стрик?')) {
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

function comingSoonBlock(title, desc) {
  return el('div', { class: 'section-block' }, [
    el('h3', {}, title),
    el('div', { class: 'task-card', style: 'opacity:.6;' }, [
      el('div', { class: 'task-icon' }, htmlIcon(ICONS.flag)),
      el('div', { class: 'task-body' }, [
        el('div', { class: 'task-title' }, 'Скоро'),
        el('div', { class: 'task-meta' }, desc),
      ]),
    ]),
  ]);
}

function aiSettingsBlock() {
  const s = Store.get();
  const block = el('div', { class: 'section-block' }, [
    el('h3', {}, 'ИИ-ассистент Bugsy'),
  ]);

  const modeRow = el('div', { class: 'chip-row', style: 'padding:0 0 12px;' });
  const modes = [['proxy', 'Общий прокси'], ['byok', 'Свой API-ключ']];
  modes.forEach(([id, label]) => {
    const chip = el('button', {
      class: `chip ${s.aiSettings.mode === id ? 'active' : ''}`,
      onclick: () => { Store.setAiSettings({ mode: id }); rerenderInputs(); },
    }, label);
    modeRow.appendChild(chip);
  });
  block.appendChild(modeRow);

  const inputsWrap = el('div');
  block.appendChild(inputsWrap);

  function rerenderInputs() {
    inputsWrap.innerHTML = '';
    const cur = Store.get().aiSettings;
    if (cur.mode === 'proxy') {
      const input = el('input', {
        class: 'ai-input', style: 'width:100%;margin-bottom:8px;',
        placeholder: 'https://your-worker.workers.dev',
        value: cur.proxyUrl,
      });
      input.addEventListener('change', () => Store.setAiSettings({ proxyUrl: input.value.trim() }));
      inputsWrap.appendChild(input);
      inputsWrap.appendChild(el('div', { class: 'ai-key-notice', style: 'border:none;padding:0;' },
        'Разверните бесплатный Cloudflare Worker из /ai-worker.js — он держит общий ключ Anthropic, чтобы вам и близким не нужно было вводить свой.'));
    } else {
      const input = el('input', {
        class: 'ai-input', style: 'width:100%;margin-bottom:8px;',
        type: 'password',
        placeholder: 'sk-ant-...',
        value: cur.apiKey,
      });
      input.addEventListener('change', () => Store.setAiSettings({ apiKey: input.value.trim() }));
      inputsWrap.appendChild(input);
      inputsWrap.appendChild(el('div', { class: 'ai-key-notice', style: 'border:none;padding:0;' },
        'Ключ хранится только в вашем браузере (localStorage) и отправляется напрямую в Anthropic API.'));
    }
  }
  rerenderInputs();

  return block;
}

function htmlIcon(svg) {
  const span = el('span');
  span.innerHTML = svg;
  return span;
}
