import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { isSupabaseConfigured, getSupabaseConfig, configureSupabase, disconnectSupabase } from './supabaseClient.js';
import { getSession, signUp, signIn, signOut, pushProgress, pullProgress, applyCloudState, setSyncEnabled } from './cloudSync.js';

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
  body.appendChild(accountBlock());
  body.appendChild(dataBlock());
  body.appendChild(updateSiteBlock());
}

function normalizeSupabaseUrl(raw) {
  const trimmed = raw.trim().replace(/\/+$/, '');
  // Common mistake: pasting the dashboard page URL instead of the API URL.
  const dashboardMatch = trimmed.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i);
  if (dashboardMatch) {
    return { ok: true, url: `https://${dashboardMatch[1]}.supabase.co`, autoFixed: true };
  }
  if (/^https:\/\/[a-z0-9]+\.supabase\.co$/i.test(trimmed)) {
    return { ok: true, url: trimmed, autoFixed: false };
  }
  return { ok: false };
}

function accountBlock() {
  const block = el('div', { class: 'section-block', style: 'margin:0 0 20px;' }, [
    el('h3', {}, 'Облачный аккаунт (Supabase)'),
  ]);
  const host = el('div');
  block.appendChild(host);

  function renderNotConfigured() {
    host.innerHTML = '';
    host.appendChild(el('div', { style: 'font-size:12.5px;color:var(--text-faint);margin-bottom:12px;line-height:1.5;' },
      'Подключите свой Supabase-проект, чтобы прогресс сохранялся в облаке и не терялся при очистке кэша или смене телефона.'));
    const urlInput = el('input', { class: 'ai-input', style: 'width:100%;margin-bottom:8px;', placeholder: 'https://xxxxx.supabase.co' });
    const keyInput = el('input', { class: 'ai-input', style: 'width:100%;margin-bottom:6px;', placeholder: 'publishable / anon public ключ' });
    const errMsg = el('div', { style: 'font-size:12px;color:var(--coral);margin-bottom:8px;min-height:16px;line-height:1.4;' });
    const btn = el('button', { class: 'btn-primary' }, 'Подключить');
    btn.addEventListener('click', () => {
      errMsg.textContent = '';
      const key = keyInput.value.trim();
      if (!urlInput.value.trim() || !key) {
        errMsg.textContent = 'Заполните оба поля.';
        return;
      }
      const result = normalizeSupabaseUrl(urlInput.value);
      if (!result.ok) {
        errMsg.textContent = 'Похоже, это не тот адрес. Нужен именно Project URL вида https://xxxxx.supabase.co из Settings → Data API — не адрес страницы дашборда.';
        return;
      }
      if (result.autoFixed) {
        errMsg.style.color = 'var(--teal)';
        errMsg.textContent = `Похоже, вы вставили ссылку на дашборд — я исправил на ${result.url}`;
      }
      configureSupabase(result.url, key);
      setTimeout(renderState, result.autoFixed ? 1400 : 0);
    });
    host.append(urlInput, keyInput, errMsg, btn);
  }

  function renderLoggedOut() {
    host.innerHTML = '';
    const emailInput = el('input', { class: 'ai-input', style: 'width:100%;margin-bottom:8px;', type: 'email', placeholder: 'Email' });
    const passInput = el('input', { class: 'ai-input', style: 'width:100%;margin-bottom:10px;', type: 'password', placeholder: 'Пароль (минимум 6 символов)' });
    const msg = el('div', { style: 'font-size:12.5px;margin-bottom:8px;min-height:16px;' });

    const signInBtn = el('button', { class: 'btn-primary', style: 'margin-bottom:8px;' }, 'Войти');
    const signUpBtn = el('button', { class: 'btn-secondary' }, 'Зарегистрироваться');

    async function afterLogin() {
      setSyncEnabled(true);
      msg.style.color = 'var(--text-faint)';
      msg.textContent = 'Проверяем облачный прогресс…';
      const cloud = await pullProgress();
      if (cloud.ok && cloud.state) {
        if (confirm('В облаке уже есть сохранённый прогресс. Загрузить его и заменить текущий на этом устройстве?')) {
          applyCloudState(cloud.state);
        } else {
          await pushProgress();
        }
      } else {
        await pushProgress();
      }
      renderState();
    }

    signInBtn.addEventListener('click', async () => {
      if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
        msg.style.color = 'var(--coral)'; msg.textContent = 'Введите настоящий email (например, name@mail.com), не логин.';
        return;
      }
      msg.style.color = 'var(--text-faint)'; msg.textContent = 'Входим…';
      const res = await signIn(emailInput.value.trim(), passInput.value);
      if (res.ok) { await afterLogin(); } else { msg.style.color = 'var(--coral)'; msg.textContent = res.error; }
    });
    signUpBtn.addEventListener('click', async () => {
      if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
        msg.style.color = 'var(--coral)'; msg.textContent = 'Введите настоящий email (например, name@mail.com), не логин.';
        return;
      }
      if (passInput.value.length < 6) {
        msg.style.color = 'var(--coral)'; msg.textContent = 'Пароль должен быть не короче 6 символов.';
        return;
      }
      msg.style.color = 'var(--text-faint)'; msg.textContent = 'Регистрируем…';
      const res = await signUp(emailInput.value.trim(), passInput.value);
      if (res.ok) {
        msg.style.color = 'var(--green)';
        msg.textContent = 'Готово! Если Supabase просит подтвердить email — проверьте почту, потом войдите.';
      } else { msg.style.color = 'var(--coral)'; msg.textContent = res.error; }
    });

    host.append(emailInput, passInput, msg, signInBtn, signUpBtn);

    const disconnectRow = el('div', { style: 'margin-top:14px;color:var(--text-faint);font-size:12px;cursor:pointer;text-decoration:underline;' }, 'Отключить Supabase от этого сайта');
    disconnectRow.addEventListener('click', () => { disconnectSupabase(); setSyncEnabled(false); renderState(); });
    host.appendChild(disconnectRow);
  }

  async function renderLoggedIn(session) {
    host.innerHTML = '';
    host.append(
      el('div', { class: 'task-card', style: 'margin:0 0 12px;' }, [
        el('div', { class: 'task-icon', style: 'background:var(--teal-dim);color:#eafffb;' }, htmlIcon(ICONS.check)),
        el('div', { class: 'task-body' }, [
          el('div', { class: 'task-title' }, session.user.email),
          el('div', { class: 'task-meta' }, 'Прогресс синхронизируется автоматически'),
        ]),
      ]),
    );
    const syncBtn = el('button', { class: 'btn-secondary' }, 'Синхронизировать сейчас');
    const signOutBtn = el('button', { class: 'btn-secondary', style: 'color:var(--coral);border-color:var(--coral);' }, 'Выйти');
    syncBtn.addEventListener('click', async () => {
      syncBtn.textContent = 'Синхронизация…';
      await pushProgress();
      syncBtn.textContent = 'Готово ✓';
      setTimeout(() => { syncBtn.textContent = 'Синхронизировать сейчас'; }, 1500);
    });
    signOutBtn.addEventListener('click', async () => {
      await signOut();
      setSyncEnabled(false);
      renderState();
    });
    host.append(syncBtn, signOutBtn);
  }

  async function renderState() {
    if (!isSupabaseConfigured()) { renderNotConfigured(); return; }
    const session = await getSession();
    if (session) { renderLoggedIn(session); } else { renderLoggedOut(); }
  }

  renderState();
  return block;
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

  const soundToggle = el('div', { class: `toggle-switch ${s.settings.soundEnabled ? 'on' : ''}` }, el('div', { class: 'knob' }));
  soundToggle.addEventListener('click', () => {
    const cur = Store.get().settings.soundEnabled;
    Store.setSettings({ soundEnabled: !cur });
    soundToggle.classList.toggle('on', !cur);
  });
  block.appendChild(el('div', { class: 'toggle-row' }, [
    el('div', {}, [
      el('div', { class: 'toggle-label' }, 'Звук и вибрация'),
      el('div', { class: 'toggle-desc' }, 'Короткий сигнал и вибрация при ответе в тесте.'),
    ]),
    soundToggle,
  ]));

  return block;
}

function aiSettingsBlock() {
  const s = Store.get();
  const block = el('div', { class: 'section-block', style: 'margin:0 0 20px;' }, [
    el('h3', {}, 'ИИ-ассистент Индекс'),
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

function dataBlock() {
  const block = el('div', { class: 'section-block', style: 'margin:0 0 20px;' }, [
    el('h3', {}, 'Данные'),
    el('div', { style: 'font-size:12.5px;color:var(--text-faint);margin-bottom:12px;line-height:1.5;' },
      'Весь прогресс хранится только в этом браузере. Если очистить кэш или сменить телефон — данные пропадут без сохранённого файла.'),
  ]);

  const exportBtn = el('button', { class: 'btn-secondary' }, 'Скачать файл прогресса');
  exportBtn.addEventListener('click', () => {
    const json = Store.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: `querypath-progress-${new Date().toISOString().slice(0, 10)}.json` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
  block.appendChild(exportBtn);

  const importLabel = el('label', { class: 'btn-secondary', style: 'display:block;text-align:center;cursor:pointer;' }, 'Загрузить файл прогресса');
  const fileInput = el('input', { type: 'file', accept: 'application/json', style: 'display:none;' });
  const statusMsg = el('div', { style: 'font-size:12.5px;margin-top:8px;text-align:center;' });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = Store.importData(reader.result);
      if (result.ok) {
        statusMsg.style.color = 'var(--green)';
        statusMsg.textContent = 'Прогресс загружен! Перезагружаем…';
        setTimeout(() => location.reload(), 800);
      } else {
        statusMsg.style.color = 'var(--coral)';
        statusMsg.textContent = 'Не удалось прочитать файл — убедитесь, что это файл прогресса QueryPath.';
      }
    };
    reader.readAsText(file);
  });
  importLabel.appendChild(fileInput);
  block.appendChild(importLabel);
  block.appendChild(statusMsg);

  return block;
}

function updateSiteBlock() {
  const block = el('div', { class: 'section-block', style: 'margin:0 0 20px;' }, [
    el('h3', {}, 'Сайт'),
  ]);

  const helpRow = el('div', { class: 'toggle-row', style: 'cursor:pointer;' }, [
    el('div', {}, [
      el('div', { class: 'toggle-label' }, 'Как это работает?'),
      el('div', { class: 'toggle-desc' }, 'Ещё раз показать краткое приветствие про монеты, рубины, стрик и уровень.'),
    ]),
    el('div', { style: 'color:var(--teal);font-weight:700;font-size:13px;flex-shrink:0;' }, 'Показать'),
  ]);
  helpRow.addEventListener('click', async () => {
    const { openOnboarding } = await import('./onboarding.js');
    openOnboarding({});
  });
  block.appendChild(helpRow);

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
