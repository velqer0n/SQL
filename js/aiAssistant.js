import { el, ICONS } from './utils.js';
import { Store } from './state.js';

// See /ai-worker.js for the Cloudflare Worker that this proxy mode expects.
// It receives {messages, system} and returns {reply}.

const SYSTEM_PROMPT_BASE = `Ты — Индекс, дружелюбный ИИ-репетитор по SQL внутри учебного приложения QueryPath.
Ты видишь условие текущей задачи и SQL-код, который сейчас написал ученик.
Правила:
- Не давай готовое решение целиком, если тебя явно не попросили "дай решение" или "покажи ответ".
- Сначала намекни, задай наводящий вопрос, укажи на конкретную ошибку в коде.
- Объясняй кратко и по-русски, используй SQL-термины (SELECT, WHERE, JOIN и т.д.).
- Если ученик уже несколько раз просил помощи и застрял — дай более прямую подсказку или полное решение.`;

async function callAI({ system, messages }) {
  const settings = Store.get().aiSettings;

  if (settings.mode === 'byok') {
    if (!settings.apiKey) throw new Error('NO_KEY');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system,
        messages,
      }),
    });
    if (!res.ok) throw new Error(`API_ERROR_${res.status}`);
    const data = await res.json();
    const text = (data.content || []).map((b) => b.text || '').join('\n');
    return text || 'Не удалось получить ответ.';
  }

  // proxy mode
  if (!settings.proxyUrl) throw new Error('NO_PROXY');
  const res = await fetch(settings.proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages }),
  });
  if (!res.ok) throw new Error(`PROXY_ERROR_${res.status}`);
  const data = await res.json();
  return data.reply || 'Не удалось получить ответ.';
}

export function openAiAssistant({ taskTitle, taskDescription, getCode }) {
  const settings = Store.get().aiSettings;
  const history = [];

  const overlay = el('div', { class: 'lesson-overlay', style: 'z-index:129;background:rgba(0,0,0,.5);' });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const sheet = el('div', { class: 'ai-sheet' });
  const head = el('div', { class: 'ai-head' }, [
    el('div', { class: 'ai-avatar' }, '🔎'),
    el('div', {}, [
      el('div', { class: 'name' }, 'Индекс'),
      el('div', { class: 'sub' }, 'Ваш ИИ-репетитор'),
    ]),
    el('button', { class: 'icon-btn', style: 'margin-left:auto', onclick: () => close() }, htmlIcon(ICONS.close)),
  ]);

  const messagesEl = el('div', { class: 'ai-messages' });
  const inputRow = el('div', { class: 'ai-input-row' });
  const input = el('input', { class: 'ai-input', placeholder: 'Спросите Индекса…' });
  const sendBtn = el('button', { class: 'ai-send' }, htmlIcon(ICONS.send));
  inputRow.append(input, sendBtn);

  sheet.append(head, messagesEl);

  const needsConfig = settings.mode === 'byok' ? !settings.apiKey : !settings.proxyUrl;
  if (needsConfig) {
    sheet.append(
      el('div', { class: 'ai-key-notice' },
        settings.mode === 'byok'
          ? 'Чтобы включить Индекса, добавьте свой Anthropic API-ключ в настройках профиля.'
          : 'Чтобы включить Индекса, укажите адрес вашего прокси-сервера (Cloudflare Worker) в настройках профиля — см. /ai-worker.js в проекте.')
    );
  } else {
    sheet.append(inputRow);
  }

  function addMsg(role, text) {
    messagesEl.appendChild(el('div', { class: `ai-msg ${role === 'user' ? 'user' : 'bot'}` }, text));
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  addMsg('bot', 'Привет, я Индекс! Я вижу вашу задачу и код. Спросите — объясню понятие, найду ошибку или подскажу шаг.');

  async function send(text) {
    if (!text.trim()) return;
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    sendBtn.disabled = true;
    const typingMsg = el('div', { class: 'ai-msg bot' }, '…');
    messagesEl.appendChild(typingMsg);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    const system = `${SYSTEM_PROMPT_BASE}\n\nЗадача: ${taskTitle}\nУсловие: ${taskDescription}\nТекущий код ученика:\n${getCode()}`;

    try {
      const reply = await callAI({ system, messages: history });
      typingMsg.textContent = reply;
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      typingMsg.textContent = 'Не получилось связаться с ИИ. Проверьте настройки в профиле.';
    } finally {
      sendBtn.disabled = false;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  sendBtn.addEventListener('click', () => send(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send(input.value);
  });

  function close() {
    overlay.remove();
  }

  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
}

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex' });
  span.innerHTML = svg;
  return span;
}
