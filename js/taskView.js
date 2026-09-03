import { el, ICONS, mdBold } from './utils.js';
import { runQuery, resultsMatch } from './sqlEngine.js';
import { openAiAssistant } from './aiAssistant.js';

const REFERENCE = [
  { term: 'SELECT', desc: 'Выбирает столбцы, которые нужно получить из таблицы.' },
  { term: 'FROM', desc: 'Указывает таблицу, из которой берутся данные.' },
  { term: 'DISTINCT', desc: 'Убирает повторяющиеся значения из результата: SELECT DISTINCT column FROM table.' },
  { term: 'WHERE', desc: 'Фильтрует строки по условию.' },
  { term: 'ORDER BY', desc: 'Сортирует результат. По умолчанию — по возрастанию, DESC — по убыванию.' },
  { term: 'LIMIT', desc: 'Ограничивает количество возвращаемых строк.' },
  { term: 'COUNT / SUM / AVG / MIN / MAX', desc: 'Агрегатные функции: считают, суммируют, усредняют, находят минимум/максимум.' },
  { term: 'GROUP BY', desc: 'Группирует строки для агрегатных вычислений по каждой группе.' },
  { term: 'JOIN', desc: 'Объединяет строки из двух таблиц по связанному столбцу.' },
];

function renderMiniTable(columns, rows, max = 5) {
  if (!columns.length) return el('div', { class: 'io-empty' }, 'Пока нет вывода');
  const shown = rows.slice(0, max);
  const table = el('table', { class: 'mini-table' });
  const thead = el('tr', {}, columns.map((c) => el('th', {}, c)));
  table.appendChild(el('thead', {}, thead));
  const tbody = el('tbody');
  shown.forEach((r) => tbody.appendChild(el('tr', {}, r.map((v) => el('td', {}, String(v))))));
  table.appendChild(tbody);
  const wrap = el('div', {}, [table]);
  if (rows.length > max) {
    wrap.appendChild(el('div', { class: 'row-note' }, `Всего ${rows.length} строк(и)`));
  }
  return wrap;
}

/**
 * Renders a full task exercise into `container`.
 * task: see data/lessons.js or data/practice.js shape
 * onSolved(errorCount): called once, first time the task is solved correctly
 */
export function renderTaskView(container, task, { onSolved } = {}) {
  container.innerHTML = '';
  let errorCount = 0;
  let solved = false;
  let activeTab = 'task';

  const tabs = el('div', { class: 'task-tabs' });
  const tabDefs = [
    ['help', 'Справка'],
    ['task', 'Задача'],
    ['code', 'Код'],
    ['solution', 'Решение'],
  ];
  const tabButtons = {};
  tabDefs.forEach(([key, label]) => {
    const btn = el('button', {
      class: `task-tab ${key === activeTab ? 'active' : ''}`,
      onclick: () => setTab(key),
    }, label);
    tabButtons[key] = btn;
    tabs.appendChild(btn);
  });

  const panel = el('div', { class: 'task-panel', style: 'padding:0;' });
  container.append(tabs, panel);

  function setTab(key) {
    activeTab = key;
    Object.entries(tabButtons).forEach(([k, b]) => b.classList.toggle('active', k === key));
    panel.innerHTML = '';
    if (key === 'help') panel.appendChild(renderHelp());
    if (key === 'task') panel.appendChild(renderTaskTab());
    if (key === 'code') panel.appendChild(renderCodeTab());
    if (key === 'solution') panel.appendChild(renderSolutionTab());
  }

  function renderHelp() {
    const wrap = el('div', { style: 'padding:18px 20px;' });
    wrap.appendChild(el('input', { class: 'ai-input', style: 'width:100%;margin-bottom:16px;', placeholder: 'Поиск справочных материалов…' }));
    REFERENCE.forEach((r) => {
      wrap.appendChild(el('div', { style: 'margin-bottom:16px;' }, [
        el('div', { class: 'inline-code', style: 'margin-bottom:6px;display:inline-block;' }, r.term),
        el('div', { style: 'color:var(--text-dim);font-size:14px;line-height:1.5;' }, r.desc),
      ]));
    });
    return wrap;
  }

  function renderTaskTab() {
    const wrap = el('div', { style: 'padding:18px 20px;' });
    wrap.appendChild(el('h2', { style: 'margin:0 0 14px;font-size:19px;' }, task.title));
    wrap.appendChild(el('div', { style: 'font-size:14.5px;color:var(--text-dim);margin-bottom:6px;' }, 'Доступные таблицы и столбцы:'));
    task.availableTables.forEach((t) => {
      const row = el('div', { style: 'margin-bottom:10px;' });
      row.appendChild(el('span', { class: 'table-pill' }, t.name));
      row.appendChild(document.createTextNode(': '));
      t.columns.forEach((c) => row.appendChild(el('span', { class: 'table-pill' }, c)));
      wrap.appendChild(row);
    });
    wrap.appendChild(el('div', { style: 'font-size:15.5px;line-height:1.6;margin:16px 0;', html: mdBold(task.description) }));
    if (task.hint) {
      const hintBtn = el('button', { class: 'hint-btn', onclick: () => hintBtn.nextSibling ? null : hintBtn.after(el('div', { style: 'margin-top:10px;color:var(--text-dim);font-size:13.5px;' }, task.hint)) },
        [htmlIcon(ICONS.bot), 'Подсказка']);
      wrap.appendChild(hintBtn);
    }
    return wrap;
  }

  let currentCode = task.starter || '';

  function renderCodeTab() {
    const wrap = el('div');
    const ioGrid = el('div', { class: 'io-grid' });

    const firstTable = task.availableTables[0]?.name;
    const inputRows = firstTable ? task.datasets[firstTable] : [];
    const inputCols = inputRows && inputRows.length ? Object.keys(inputRows[0]) : [];
    const inputColWrap = el('div', { class: 'io-col' }, [
      el('h4', {}, `Ввод — ${firstTable || ''}`),
      renderMiniTable(inputCols, (inputRows || []).map((r) => inputCols.map((c) => r[c])), 3),
    ]);

    const outputColWrap = el('div', { class: 'io-col' }, [
      el('h4', {}, 'Вывод'),
      el('div', { class: 'io-empty' }, 'Пока нет вывода'),
    ]);

    const expectedColWrap = el('div', { class: 'io-col' }, [
      el('h4', {}, 'Ожидаемый вывод'),
      el('div', { class: 'io-empty' }, '—'),
    ]);

    ioGrid.append(inputColWrap, outputColWrap, expectedColWrap);

    const editorTabs = el('div', { class: 'editor-tabs' }, [
      el('button', { class: 'editor-tab active' }, 'Тестовые случаи'),
      el('button', { class: 'editor-tab' }, 'Консоль'),
    ]);

    const textarea = el('textarea', {
      class: 'sql-editor',
      spellcheck: 'false',
      placeholder: '-- напишите SQL здесь',
    });
    textarea.value = currentCode;
    textarea.addEventListener('input', () => { currentCode = textarea.value; });

    const KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'DISTINCT', 'ORDER BY', 'LIMIT', '*'];
    const keywordBar = el('div', {
      style: 'display:flex;gap:6px;padding:8px 12px;overflow-x:auto;background:var(--bg);border-top:1px solid var(--line);',
    });
    KEYWORDS.forEach((kw) => {
      const chip = el('button', {
        class: 'btn-ghost-sm',
        style: 'flex-shrink:0;font-family:var(--font-mono);',
        onclick: () => {
          const start = textarea.selectionStart ?? textarea.value.length;
          const end = textarea.selectionEnd ?? textarea.value.length;
          const insert = kw + ' ';
          textarea.value = textarea.value.slice(0, start) + insert + textarea.value.slice(end);
          currentCode = textarea.value;
          const pos = start + insert.length;
          textarea.focus();
          textarea.setSelectionRange(pos, pos);
        },
      }, kw);
      keywordBar.appendChild(chip);
    });

    const runResult = el('div');

    const runBtn = el('button', { class: 'btn-run' }, 'Запустить код');
    const aiBtn = el('button', { class: 'btn-ai' }, [htmlIcon(ICONS.bot), 'Спросить ИИ']);
    const resetBtn = el('button', { class: 'btn-ghost-sm' }, 'Сбросить');

    resetBtn.addEventListener('click', () => {
      textarea.value = task.starter || '';
      currentCode = textarea.value;
    });

    aiBtn.addEventListener('click', () => {
      openAiAssistant({
        taskTitle: task.title,
        taskDescription: task.description,
        getCode: () => currentCode,
      });
    });

    runBtn.addEventListener('click', async () => {
      runBtn.disabled = true;
      runBtn.textContent = 'Выполняется…';
      const [userRes, expectedRes] = await Promise.all([
        runQuery(currentCode, task.datasets),
        runQuery(task.solutionQuery, task.datasets),
      ]);
      runBtn.disabled = false;
      runBtn.textContent = 'Запустить код';

      runResult.innerHTML = '';
      if (!userRes.ok) {
        errorCount++;
        runResult.appendChild(el('div', { class: 'run-result' }, [
          el('div', { class: 'result-err' }, ['✕ Ошибка в запросе']),
          el('div', { style: 'font-family:var(--font-mono);font-size:13px;color:var(--text-dim);' }, userRes.error),
        ]));
        return;
      }

      outputColWrap.innerHTML = '';
      outputColWrap.appendChild(el('h4', {}, 'Вывод'));
      outputColWrap.appendChild(renderMiniTable(userRes.columns, userRes.rows));

      expectedColWrap.innerHTML = '';
      expectedColWrap.appendChild(el('h4', {}, 'Ожидаемый вывод'));
      expectedColWrap.appendChild(renderMiniTable(expectedRes.columns, expectedRes.rows));

      const match = resultsMatch(userRes, expectedRes);
      if (match) {
        runResult.appendChild(el('div', { class: 'run-result' }, [
          el('div', { class: 'result-ok' }, ['✓ Правильно! Все тестовые случаи пройдены.']),
        ]));
        if (!solved) {
          solved = true;
          runResult.appendChild(el('button', {
            class: 'btn-primary',
            style: 'margin-top:4px;',
            onclick: () => onSolved && onSolved(errorCount),
          }, 'Продолжить'));
        }
      } else {
        errorCount++;
        runResult.appendChild(el('div', { class: 'run-result' }, [
          el('div', { class: 'result-err' }, ['✕ Результат не совпадает с ожидаемым']),
        ]));
      }
    });

    const actions = el('div', { class: 'editor-actions' }, [runBtn, aiBtn, resetBtn]);

    wrap.append(ioGrid, editorTabs, textarea, keywordBar, actions, runResult);
    return wrap;
  }

  function renderSolutionTab() {
    const wrap = el('div', { style: 'padding:18px 20px;' });
    if (!solved) {
      wrap.appendChild(el('div', { style: 'color:var(--text-dim);font-size:14.5px;line-height:1.6;' },
        'Решение откроется после того, как вы успешно выполните задачу во вкладке «Код» — или посмотрите его сейчас, если совсем застряли.'));
      wrap.appendChild(el('button', {
        class: 'btn-secondary', style: 'margin-top:14px;',
        onclick: () => { wrap.appendChild(el('div', { class: 'code-block', style: 'margin-top:12px;' }, task.solutionQuery)); },
      }, 'Всё равно показать'));
      return wrap;
    }
    wrap.appendChild(el('div', { class: 'code-block' }, task.solutionQuery));
    return wrap;
  }

  setTab('task');
}

function htmlIcon(svg) {
  const span = el('span', { style: 'display:flex' });
  span.innerHTML = svg;
  return span;
}
