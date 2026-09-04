import { el, ICONS } from './utils.js';
import { Store } from './state.js';
import { renderTopbar } from './topbar.js';
import { getPracticeTask } from '../data/practice.js';
import { openPracticeTask } from './practiceTaskOverlay.js';
import { openMistakesReview } from './mistakesReview.js';

function htmlIcon(svg) {
  const span = el('span');
  span.innerHTML = svg;
  return span;
}

function rubyLabel(n) {
  return el('span', { style: 'display:inline-flex;align-items:center;gap:3px;' }, [
    String(n),
    (() => { const s = el('span', { style: 'display:flex;width:12px;height:12px;color:#e0546b;' }); s.innerHTML = ICONS.ruby; return s; })(),
  ]);
}

function coinLabel(n) {
  return el('span', { style: 'display:inline-flex;align-items:center;gap:3px;' }, [
    String(n),
    (() => { const s = el('span', { style: 'display:flex;width:12px;height:12px;color:var(--amber);' }); s.innerHTML = ICONS.coin; return s; })(),
  ]);
}

function dailyTaskBlock(container) {
  const block = el('div', { class: 'section-block' }, [el('h3', {}, 'Задача дня')]);
  const dt = Store.getDailyTask();
  const task = getPracticeTask(dt.taskId);
  if (!task) return block;

  const solved = Store.isPracticeDone(task.id);
  const card = el('div', { class: `task-card ${solved ? 'solved' : ''}`, style: 'border-color:var(--amber);' }, [
    el('div', { class: 'task-icon', style: 'background:var(--amber);color:#2c1e04;' }, htmlIcon(solved ? ICONS.check : ICONS.dumbbell)),
    el('div', { class: 'task-body' }, [
      el('div', { class: 'task-title' }, task.title),
      el('div', { class: 'task-meta', style: 'display:flex;align-items:center;gap:4px;' }, [
        dt.claimed ? 'Бонус получен' : 'Награда за решение: ',
        dt.claimed ? null : rubyLabel(15),
      ]),
    ]),
  ]);
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    openPracticeTask(task, { onClose: () => renderMissionsPage(container) });
  });
  block.appendChild(card);
  return block;
}

function mistakesEntryBlock(container) {
  const block = el('div', { class: 'section-block' }, [el('h3', {}, 'Работа над ошибками')]);
  const count = Store.getMistakes().length;
  const card = el('div', { class: 'task-card' }, [
    el('div', { class: 'task-icon' }, htmlIcon(ICONS.flag)),
    el('div', { class: 'task-body' }, [
      el('div', { class: 'task-title' }, count ? `${count} вопрос(ов) на повторение` : 'Пока нет ошибок для повторения'),
      el('div', { class: 'task-meta' }, 'Вопросы, где вы ошиблись в тестах — пересдайте их здесь'),
    ]),
  ]);
  if (count) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openMistakesReview({ onClose: () => renderMissionsPage(container) }));
  } else {
    card.style.opacity = '.6';
  }
  block.appendChild(card);
  return block;
}

export function renderMissionsPage(container) {
  container.innerHTML = '';
  container.appendChild(renderTopbar());
  container.appendChild(el('div', { class: 'page-title' }, 'Миссии'));
  container.appendChild(el('div', { class: 'page-sub' }, 'Ежедневные задания и награда за вход — обновляются каждый день.'));

  container.appendChild(dailyRewardBlock());
  container.appendChild(dailyTaskBlock(container));
  container.appendChild(mistakesEntryBlock(container));
  container.appendChild(missionsListBlock());

  container.appendChild(el('div', { style: 'height:20px;' }));
}

function dailyRewardBlock() {
  const block = el('div', { class: 'section-block' }, [el('h3', {}, 'Ежедневная награда за вход')]);
  const table = Store.getDailyRewardTable();
  const dayIndex = Store.getDailyRewardDayIndex();

  const row = el('div', { style: 'display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:12px;' });
  table.forEach((entry) => {
    const isToday = entry.day === dayIndex;
    const isPast = entry.day < dayIndex;
    row.appendChild(el('div', {
      style: `flex-shrink:0;width:56px;padding:8px 4px;border-radius:10px;text-align:center;
        background:${isToday ? 'var(--teal-dim)' : 'var(--bg-elev)'};
        border:1px solid ${isToday ? 'var(--teal)' : 'var(--line)'};
        opacity:${isPast ? '.5' : '1'};`,
    }, [
      el('div', { style: 'font-size:10px;color:var(--text-faint);margin-bottom:4px;' }, `Д${entry.day}`),
      el('div', { style: 'font-size:12px;font-weight:700;' }, `${entry.coins}🪙`),
      entry.rubies ? el('div', { style: 'font-size:11px;font-weight:700;color:#e0546b;' }, `${entry.rubies}💎`) : null,
    ]));
  });
  block.appendChild(row);

  const canClaim = Store.canClaimDailyReward();
  const entry = table.find((d) => d.day === dayIndex);
  if (canClaim) {
    const btn = el('button', { class: 'btn-primary' }, [
      'Забрать награду за день ', String(dayIndex), ': ',
      coinLabel(entry.coins),
      entry.rubies ? el('span', {}, [' + ', rubyLabel(entry.rubies)]) : null,
    ]);
    btn.addEventListener('click', () => {
      Store.claimDailyReward();
      const container = document.getElementById('app');
      renderMissionsPage(container);
    });
    block.appendChild(btn);
  } else {
    block.appendChild(el('div', { class: 'task-card', style: 'opacity:.7;' }, [
      el('div', { class: 'task-icon' }, htmlIcon(ICONS.check)),
      el('div', { class: 'task-body' }, [
        el('div', { class: 'task-title' }, 'Награда за сегодня получена'),
        el('div', { class: 'task-meta' }, 'Возвращайтесь завтра за следующей'),
      ]),
    ]));
  }

  return block;
}

function missionsListBlock() {
  const block = el('div', { class: 'section-block' }, [el('h3', {}, 'Ежедневные миссии')]);
  const defs = Store.getMissionDefs();
  const listHost = el('div');
  block.appendChild(listHost);

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
          el('div', { class: 'task-meta', style: 'margin-top:4px;display:flex;align-items:center;gap:4px;' }, [
            `${Math.min(progress, def.target)}/${def.target} · награда `, rubyLabel(def.reward),
          ]),
        ]),
      ]);

      if (claimed) {
        card.appendChild(el('div', { style: 'color:var(--text-faint);font-size:12px;font-weight:700;flex-shrink:0;' }, 'Получено'));
      } else if (done) {
        const btn = el('button', { class: 'shop-btn', style: 'flex-shrink:0;' }, 'Забрать');
        btn.addEventListener('click', () => {
          Store.claimMission(def.id);
          renderList();
          renderBonus();
        });
        card.appendChild(btn);
      }
      wrap.appendChild(card);
    });
    listHost.innerHTML = '';
    listHost.appendChild(wrap);
  }

  const bonusHost = el('div');
  block.appendChild(bonusHost);

  function renderBonus() {
    bonusHost.innerHTML = '';
    const s = Store.get();
    const allDone = Store.allMissionsClaimed();
    const bonusAmount = Store.getMissionsBonus();
    if (s.missions.bonusClaimed) {
      bonusHost.appendChild(el('div', { class: 'task-card', style: 'margin-top:4px;opacity:.7;border-color:var(--amber);' }, [
        el('div', { class: 'task-icon', style: 'background:var(--amber);color:#2c1e04;' }, htmlIcon(ICONS.trophy)),
        el('div', { class: 'task-body' }, [
          el('div', { class: 'task-title' }, 'Бонус за все миссии получен'),
        ]),
      ]));
    } else if (allDone) {
      const card = el('div', { class: 'task-card', style: 'margin-top:4px;border-color:var(--amber);' }, [
        el('div', { class: 'task-icon', style: 'background:var(--amber);color:#2c1e04;' }, htmlIcon(ICONS.trophy)),
        el('div', { class: 'task-body' }, [
          el('div', { class: 'task-title' }, 'Все миссии выполнены!'),
          el('div', { class: 'task-meta', style: 'display:flex;align-items:center;gap:4px;' }, ['Бонус: ', rubyLabel(bonusAmount)]),
        ]),
      ]);
      const btn = el('button', { class: 'shop-btn' }, 'Забрать бонус');
      btn.addEventListener('click', () => {
        Store.claimMissionsBonus();
        renderBonus();
      });
      card.appendChild(btn);
      bonusHost.appendChild(card);
    } else {
      bonusHost.appendChild(el('div', { style: 'color:var(--text-faint);font-size:12.5px;margin-top:8px;text-align:center;' },
        `Выполните все 5 миссий, чтобы получить бонус ${bonusAmount} 💎`));
    }
  }

  renderList();
  renderBonus();
  return block;
}
