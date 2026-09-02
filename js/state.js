// Central app state, persisted to localStorage.
// Keeps: profile info, coins, streak, completed lessons/tasks, per-lesson best results.

const STORAGE_KEY = 'querypath_state_v1';

const defaultState = {
  profile: {
    name: 'Гость',
    joined: Date.now(),
  },
  coins: 0,
  streak: 0,
  lastActiveDay: null, // 'YYYY-MM-DD'
  hearts: null, // null = infinite for now (matches "бесконечность" seen in Coddy header)
  completedLessons: {}, // lessonId -> { accuracy, timeSec, coinsEarned, errors, completedAt }
  completedPractice: {}, // taskId -> { solvedAt, attempts }
  aiSettings: {
    mode: 'proxy', // 'proxy' | 'byok'
    proxyUrl: '',
    apiKey: '',
  },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(defaultState), ...parsed };
  } catch (e) {
    console.warn('State load failed, resetting', e);
    return structuredClone(defaultState);
  }
}

let state = loadState();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export const Store = {
  get() {
    return state;
  },

  touchStreak() {
    const today = todayStr();
    if (state.lastActiveDay === today) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    if (state.lastActiveDay === yesterday) {
      state.streak += 1;
    } else {
      state.streak = 1;
    }
    state.lastActiveDay = today;
    save();
  },

  addCoins(n) {
    state.coins += n;
    save();
  },

  spendCoins(n) {
    if (state.coins < n) return false;
    state.coins -= n;
    save();
    return true;
  },

  completeLesson(lessonId, { accuracy, timeSec, errors, coinsEarned }) {
    const prev = state.completedLessons[lessonId];
    state.completedLessons[lessonId] = {
      accuracy,
      timeSec,
      errors,
      coinsEarned,
      completedAt: Date.now(),
      bestAccuracy: prev ? Math.max(prev.bestAccuracy || 0, accuracy) : accuracy,
    };
    this.addCoins(coinsEarned);
    this.touchStreak();
    save();
  },

  isLessonDone(lessonId) {
    return !!state.completedLessons[lessonId];
  },

  completePracticeTask(taskId) {
    const prev = state.completedPractice[taskId] || { attempts: 0 };
    state.completedPractice[taskId] = {
      solvedAt: Date.now(),
      attempts: prev.attempts + 1,
    };
    save();
  },

  isPracticeDone(taskId) {
    return !!state.completedPractice[taskId];
  },

  setProfileName(name) {
    state.profile.name = name;
    save();
  },

  setAiSettings(patch) {
    state.aiSettings = { ...state.aiSettings, ...patch };
    save();
  },

  reset() {
    state = structuredClone(defaultState);
    save();
  },
};
