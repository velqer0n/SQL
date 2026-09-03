import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { LESSONS } from '../data/lessons.js';
import { PRACTICE_TASKS } from '../data/practice.js';
import { getItem } from '../data/shop.js';
import { openShop } from './shopPage.js';

export function renderProfilePage(container) {
  container.innerHTML = '';
  const s = Store.get();

  const equippedAvatar = getItem(s.inventory.equipped.avatar) || getItem('avatar-1');
  const equippedFrame = getItem(s.inventory.equipped.frame) || getItem('frame-none');
  const frameClass = equippedFrame.style && equippedFrame.style !== 'none' ? `frame-${equippedFrame.style}` : '';
  const frameColorVar = equippedFrame.color ? `--frame-color:${equippedFrame.color};` : '';

  container.appendChild(el('div', { class: 'profile-head' }, [
    el('div', { class: `avatar-shell ${frameClass}`, style: frameColorVar }, [
      el('div', {
        class: 'avatar',
        style: `background:linear-gradient(135deg, ${equippedAvatar.colors[0]}, ${equippedAvatar.colors[1]});`,
      }),
    ]),
    el('div', { class: 'profile-name' }, s.profile.name),
  ]));

  container.appendChild(el('div', { class: 'profile-stats-grid' }, [
    statCard(String(s.coins), 'Монеты'),
    statCard(String(s.rubies), 'Рубины'),
    statCard(String(s.streak), 'Стрик, дней'),
  ]));

  const lessonsDone = Object.keys(s.completedLessons).length;
  const lessonsTotal = LESSONS.filter((l) => !l.placeholder).length;
  const practiceDone = Object.keys(s.completedPractice).length;
  const practiceTotal = PRACTICE_TASKS.length;

  container.appendChild(progressBlock('Путь', lessonsDone, lessonsTotal));
  container.appendChild(progressBlock('Практика', practiceDone, practiceTotal));

  container.appendChild(missionsBlock());
  container.appendChild(shopEntryBlock(container));

  container.appendChild(aiSettingsBlock());
  container.appendChild(generalSettingsBlock());

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
    if (confirm('Точно сбросить весь прогресс, монеты, рубины и покупки?')) {
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

function missionsBlock(container) {
  const block = el('div', { class: 'section-block' }, [el('h3', {}, 'Ежедневные миссии')]);
  const defs = Store.getMissionDefs();

  function renderList() {
    const s = Store.get();
    const wrap = el('div');
    defs.forEach((def) => {
      const progress = s.missions.progress[def.track] || 0;
      const done = progress >= def.target;
      const claimed = !!s.missions.claimed[def.id];
      const pct = Math.min(100, Math.round((progress / def.target) * 100));

      const card = el('div', { class: 'task-card', style: 'align-items:center;' }, [
        el('div', { class: 'task-icon', style: claimed ? 'background:var(--teal-dim);color:#eafffb;' : '' },
          htmlIcon(claimed ? ICONS.check : ICONS.flag)),
        el('div', { class: 'task-body' }, [
          el('div', { class: 'task-title' }, def.title),
          el('div', { class: 'progress-bar-track', style: 'margin-top:6px;height:6px;' },
            el('div', { class: 'progress-bar-fill', style: `width:${pct}%` })),
          el('div', { class: 'task-meta', style: 'margin-top:4px;' }, `${Math.min(progress, def.target)}/${def.target} · награда ${def.reward} 💎`),
        ]),
      ]);

      if (claimed) {
        card.appendChild(el('div', { style: 'color:var(--text-faint);font-size:12px;font-weight:700;flex-shrink:0;' }, 'Получено'));
      } else if (done) {
        const btn = el('button', { class: 'shop-btn', style: 'flex-shrink:0;' }, 'Забрать');
        btn.addEventListener('click', () => {
          Store.claimMission(def.id);
          renderList();
        });
        card.appendChild(btn);
      }
      wrap.appendChild(card);
    });
    listHost.innerHTML = '';
    listHost.appendChild(wrap);
  }

  const listHost = el('div');
  block.appendChild(listHost);
  renderList();
  return block;
}

function shopEntryBlock(container) {
  const block = el('div', { class: 'section-block' }, [el('h3', {}, 'Магазин')]);
  const card = el('div', { class: 'task-card' }, [
    el('div', { class: 'task-icon' }, htmlIcon(ICONS.flag)),
    el('div', { class: 'task-body' }, [
      el('div', { class: 'task-title' }, 'Аватары, рамки и темы'),
      el('div', { class: 'task-meta' }, 'Тратьте монеты и рубины на украшения профиля'),
    ]),
  ]);
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    openShop({ onClose: () => renderProfilePage(container) });
  });
  block.appendChild(card);
  return block;
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
        'Разверните бесплатный Cloudflare Worker из ai-worker.js — он держит общий ключ Anthropic, чтобы вам и близким не нужно было вводить свой.'));
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

function generalSettingsBlock() {
  const s = Store.get();
  const block = el('div', { class: 'section-block' }, [
    el('h3', {}, 'Настройки'),
  ]);

  const toggle = el('div', { class: `toggle-switch ${s.settings.confirmAnswers ? 'on' : ''}` }, el('div', { class: 'knob' }));
  toggle.addEventListener('click', () => {
    const cur = Store.get().settings.confirmAnswers;
    Store.setSettings({ confirmAnswers: !cur });
    toggle.classList.toggle('on', !cur);
  });

  const row = el('div', { class: 'toggle-row' }, [
    el('div', {}, [
      el('div', { class: 'toggle-label' }, 'Подтверждение ответа в тесте'),
      el('div', { class: 'toggle-desc' }, 'Сначала выбрать вариант, потом нажать «Подтвердить» — так сложнее промахнуться.'),
    ]),
    toggle,
  ]);
  block.appendChild(row);

  const updateRow = el('div', { class: 'toggle-row', style: 'cursor:pointer;' }, [
    el('div', {}, [
      el('div', { class: 'toggle-label' }, 'Обновить сайт'),
      el('div', { class: 'toggle-desc' }, 'Если после обновления файлов на GitHub сайт выглядит по-старому — нажмите, чтобы принудительно загрузить свежую версию.'),
    ]),
    el('div', { style: 'color:var(--teal);font-weight:700;font-size:13px;flex-shrink:0;' }, 'Обновить'),
  ]);
  updateRow.addEventListener('click', async () => {
    try {
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) { /* ignore */ }
    location.href = location.pathname + '?v=' + Date.now();
  });
  block.appendChild(updateRow);

  return block;
}

function htmlIcon(svg) {
  const span = el('span');
  span.innerHTML = svg;
  return span;
}
