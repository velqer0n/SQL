import { el, ICONS } from './utils.js';
import { Store } from './state.js';

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex' });
  span.innerHTML = svg;
  return span;
}

export function openSettings({ onClose } = {}) {
  const overlay = el('div', { class: 'lesson-overlay' });
  const topbar = el('div', { class: 'lesson-topbar' }, [
    el('button', { class: 'icon-btn', onclick: () => { overlay.remove(); if (onClose) onClose(); } }, htmlIcon(ICONS.close)),
    el('div', { style: 'font-weight:800;font-size:16px;' }, 'Настройки'),
  ]);
  const body = el('div', { class: 'lesson-body' });
  overlay.append(topbar, body);
  document.body.appendChild(overlay);

  body.appendChild(nameBlock());
  body.appendChild(quizConfirmBlock());
  body.appendChild(aiSettingsBlock());
  body.appendChild(updateSiteBlock());
}

function nameBlock() {
  const s = Store.get();
  const block = el('div', { class: 'section-block', style: 'margin:0 0 20px;' }, [
    el('h3', {}, 'Имя'),
  ]);
  const input = el('input', { class: 'ai-input', style: 'width:100%;', value: s.profile.name });
  input.addEventListener('change', () => Store.setProfileName(input.value || 'Гость'));
  block.appendChild(input);
  return block;
}

function quizConfirmBlock() {
  const s = Store.get();
  const block = el('div', { class: 'section-block', style: 'margin:0 0 20px;' }, [
    el('h3', {}, 'Тест'),
  ]);

  const toggle = el('div', { class: `toggle-switch ${s.settings.confirmAnswers ? 'on' : ''}` }, el('div', { class: 'knob' }));
  toggle.addEventListener('click', () => {
    const cur = Store.get().settings.confirmAnswers;
    Store.setSettings({ confirmAnswers: !cur });
    toggle.classList.toggle('on', !cur);
  });

  block.appendChild(el('div', { class: 'toggle-row' }, [
    el('div', {}, [
      el('div', { class: 'toggle-label' }, 'Подтверждение ответа в тесте'),
      el('div', { class: 'toggle-desc' }, 'Сначала выбрать вариант, потом нажать «Подтвердить» — так сложнее промахнуться.'),
    ]),
    toggle,
  ]));
  return block;
}

function aiSettingsBlock() {
  const s = Store.get();
  const block = el('div', { class: 'section-block', style: 'margin:0 0 20px;' }, [
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

function updateSiteBlock() {
  const block = el('div', { class: 'section-block', style: 'margin:0 0 20px;' }, [
    el('h3', {}, 'Сайт'),
  ]);

  const row = el('div', { class: 'toggle-row', style: 'cursor:pointer;' }, [
    el('div', {}, [
      el('div', { class: 'toggle-label' }, 'Обновить сайт'),
      el('div', { class: 'toggle-desc' }, 'Если после обновления файлов на GitHub сайт выглядит по-старому — нажмите, чтобы принудительно загрузить свежую версию.'),
    ]),
    el('div', { style: 'color:var(--teal);font-weight:700;font-size:13px;flex-shrink:0;' }, 'Обновить'),
  ]);
  row.addEventListener('click', async () => {
    try {
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) { /* ignore */ }
    location.href = location.pathname + '?v=' + Date.now();
  });
  block.appendChild(row);
  return block;
}
