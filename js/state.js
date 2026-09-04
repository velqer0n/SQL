// Central app state, persisted to localStorage.
// Keeps: profile info, coins/rubies, streak, completed lessons/tasks,
// daily missions, shop inventory + equipped cosmetics, settings.

import { SHOP_ITEMS } from '../data/shop.js';
import { PRACTICE_TASKS } from '../data/practice.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
const STORAGE_KEY = 'querypath_state_v1';
export const STATE_VERSION = 2; // bump to force any future migration logic

const COMBO_MILESTONE = 5;
const COMBO_BONUS_COINS = 5;

function levelForXp(xp) {
  // level thresholds grow linearly: level n needs n*40 total xp
  let level = 1;
  let remaining = xp;
  while (remaining >= level * 40) {
    remaining -= level * 40;
    level++;
  }
  return { level, xpIntoLevel: remaining, xpForNextLevel: level * 40 };
}

const DAILY_MISSION_DEFS = [
  { id: 'm-lesson', title: 'Пройдите 1 урок на Пути', track: 'lessons', target: 1, reward: 8 },
  { id: 'm-lesson2', title: 'Пройдите 3 урока на Пути', track: 'lessons', target: 3, reward: 15 },
  { id: 'm-practice', title: 'Решите 2 задачи в Практике', track: 'practice', target: 2, reward: 8 },
  { id: 'm-practice2', title: 'Решите 4 задачи в Практике', track: 'practice', target: 4, reward: 15 },
  { id: 'm-coins', title: 'Заработайте 30 монет', track: 'coins', target: 30, reward: 12 },
];
const ALL_MISSIONS_BONUS = 10; // rubies, awarded once all 5 daily missions are claimed

const DAILY_REWARD_TABLE = [
  { day: 1, coins: 5, rubies: 0 },
  { day: 2, coins: 8, rubies: 0 },
  { day: 3, coins: 10, rubies: 2 },
  { day: 4, coins: 12, rubies: 2 },
  { day: 5, coins: 15, rubies: 3 },
  { day: 6, coins: 18, rubies: 3 },
  { day: 7, coins: 25, rubies: 8 },
];

const defaultState = {
  profile: {
    name: 'Гость',
    joined: Date.now(),
  },
  coins: 0,
  rubies: 0,
  xp: 0,
  comboStreak: 0,
  bestCombo: 0,
  mistakes: [], // { lessonId, lessonTitle, question, addedAt }
  seenAchievements: [],
  streak: 0,
  lastActiveDay: null, // 'YYYY-MM-DD'
  hearts: null, // null = infinite for now (matches "бесконечность" seen in Coddy header)
  completedLessons: {}, // lessonId -> { accuracy, timeSec, coinsEarned, errors, completedAt }
  completedPractice: {}, // taskId -> { solvedAt, attempts }
  lessonPhases: {}, // lessonId -> { theory:bool, quiz:bool, task:bool, errors:number }
  aiSettings: {
    mode: 'proxy', // 'proxy' | 'byok'
    proxyUrl: '',
    apiKey: '',
  },
  settings: {
    confirmAnswers: true, // require a "Подтвердить" tap before grading a quiz answer
    soundEnabled: true,
    onboardingSeen: false,
  },
  missions: {
    date: null,
    progress: { lessons: 0, practice: 0, coins: 0 },
    claimed: {}, // missionId -> true
    bonusClaimed: false,
  },
  dailyReward: {
    lastClaimedDate: null, // 'YYYY-MM-DD'
  },
  dailyTask: {
    date: null,
    taskId: null,
    claimed: false,
  },
  inventory: {
    owned: ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5', 'avatar-6', 'frame-none', 'theme-dark', 'theme-light', 'hair-none', 'outfit-none'],
    equipped: { avatar: 'avatar-1', frame: 'frame-none', theme: 'theme-dark', hair: 'hair-none', outfit: 'outfit-none' },
    gender: 'unisex', // 'unisex' | 'male' | 'female' — restricts a few gendered items (e.g. dresses)
  },
  consumables: {}, // id -> count, e.g. { 'streak-freeze': 2 }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    const merged = { ...structuredClone(defaultState), ...parsed };
    // deep-merge nested objects that might be missing new sub-keys after an update
    merged.aiSettings = { ...defaultState.aiSettings, ...(parsed.aiSettings || {}) };
    merged.settings = { ...defaultState.settings, ...(parsed.settings || {}) };
    merged.missions = { ...structuredClone(defaultState.missions), ...(parsed.missions || {}) };
    merged.dailyReward = { ...structuredClone(defaultState.dailyReward), ...(parsed.dailyReward || {}) };
    merged.dailyTask = { ...structuredClone(defaultState.dailyTask), ...(parsed.dailyTask || {}) };
    merged.mistakes = Array.isArray(parsed.mistakes) ? parsed.mistakes : [];
    merged.seenAchievements = Array.isArray(parsed.seenAchievements) ? parsed.seenAchievements : [];
    merged.consumables = { ...(parsed.consumables || {}) };
    merged.inventory = {
      owned: (parsed.inventory && parsed.inventory.owned) ? Array.from(new Set([...defaultState.inventory.owned, ...parsed.inventory.owned])) : [...defaultState.inventory.owned],
      equipped: { ...defaultState.inventory.equipped, ...((parsed.inventory && parsed.inventory.equipped) || {}) },
      gender: (parsed.inventory && parsed.inventory.gender) || 'unisex',
    };
    return merged;
  } catch (e) {
    console.warn('State load failed, resetting', e);
    return structuredClone(defaultState);
  }
}

let state = loadState();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Cloud sync hooks itself in lazily to avoid a hard circular-import requirement;
  // see main.js, which calls Store._setCloudPushHook() once cloudSync.js is loaded.
  if (cloudPushHook) cloudPushHook();
}

let cloudPushHook = null;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function ensureDailyMissionsFresh() {
  const today = todayStr();
  if (state.missions.date !== today) {
    state.missions = { date: today, progress: { lessons: 0, practice: 0, coins: 0 }, claimed: {}, bonusClaimed: false };
    save();
  }
}

export const Store = {
  _setCloudPushHook(fn) {
    cloudPushHook = fn;
  },

  get() {
    ensureDailyMissionsFresh();
    return state;
  },

  getMissionDefs() {
    return DAILY_MISSION_DEFS;
  },

  touchStreak() {
    const today = todayStr();
    if (state.lastActiveDay === today) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    if (state.lastActiveDay === yesterday) {
      state.streak += 1;
    } else if (state.lastActiveDay && (state.consumables['streak-freeze'] || 0) > 0) {
      // missed a day, but a streak freeze absorbs it — streak is preserved, not incremented
      state.consumables['streak-freeze'] -= 1;
    } else {
      state.streak = 1;
    }
    state.lastActiveDay = today;
    save();
  },

  buyConsumable(item) {
    const spend = item.currency === 'rubies' ? this.spendRubies(item.price) : this.spendCoins(item.price);
    if (!spend) return { ok: false, reason: 'funds' };
    state.consumables[item.id] = (state.consumables[item.id] || 0) + 1;
    save();
    return { ok: true };
  },

  getConsumableCount(id) {
    return state.consumables[id] || 0;
  },

  exportData() {
    return JSON.stringify(state, null, 2);
  },

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || parsed === null || !('completedLessons' in parsed)) {
        return { ok: false, reason: 'invalid' };
      }
      state = { ...structuredClone(defaultState), ...parsed };
      save();
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: 'parse' };
    }
  },

  addCoins(n) {
    ensureDailyMissionsFresh();
    state.coins += n;
    state.missions.progress.coins += n;
    save();
  },

  addXp(n) {
    const before = levelForXp(state.xp).level;
    state.xp += n;
    const after = levelForXp(state.xp).level;
    save();
    return { leveledUp: after > before, newLevel: after };
  },

  checkNewAchievements() {
    const newly = ACHIEVEMENTS.filter((a) => a.check(state) && !state.seenAchievements.includes(a.id));
    if (newly.length) {
      state.seenAchievements.push(...newly.map((a) => a.id));
      save();
    }
    return newly;
  },

  getLevelInfo() {
    return levelForXp(state.xp);
  },

  recordAnswer(isCorrect) {
    if (isCorrect) {
      state.comboStreak += 1;
      if (state.comboStreak > state.bestCombo) state.bestCombo = state.comboStreak;
      let bonusAwarded = 0;
      if (state.comboStreak > 0 && state.comboStreak % COMBO_MILESTONE === 0) {
        bonusAwarded = COMBO_BONUS_COINS;
        this.addCoins(bonusAwarded);
      }
      save();
      return { combo: state.comboStreak, bonusAwarded };
    }
    state.comboStreak = 0;
    save();
    return { combo: 0, bonusAwarded: 0 };
  },

  addMistake(entry) {
    // avoid unbounded growth / duplicates of the exact same question text
    state.mistakes = state.mistakes.filter((m) => m.question !== entry.question).slice(-29);
    state.mistakes.push({ ...entry, addedAt: Date.now() });
    save();
  },

  removeMistake(addedAt) {
    state.mistakes = state.mistakes.filter((m) => m.addedAt !== addedAt);
    save();
  },

  getMistakes() {
    return state.mistakes;
  },

  getDailyTask() {
    const today = todayStr();
    if (state.dailyTask.date !== today || !state.dailyTask.taskId) {
      if (PRACTICE_TASKS.length) {
        // deterministic pick based on today's date so it's stable across reloads
        let hash = 0;
        for (let i = 0; i < today.length; i++) hash = (hash * 31 + today.charCodeAt(i)) >>> 0;
        const idx = hash % PRACTICE_TASKS.length;
        state.dailyTask = { date: today, taskId: PRACTICE_TASKS[idx].id, claimed: false };
        save();
      }
    }
    return state.dailyTask;
  },

  isDailyTask(taskId) {
    return this.getDailyTask().taskId === taskId;
  },

  claimDailyTaskBonus() {
    const dt = this.getDailyTask();
    if (dt.claimed) return false;
    state.dailyTask.claimed = true;
    save();
    return true;
  },

  spendCoins(n) {
    if (state.coins < n) return false;
    state.coins -= n;
    save();
    return true;
  },

  addRubies(n) {
    state.rubies += n;
    save();
  },

  spendRubies(n) {
    if (state.rubies < n) return false;
    state.rubies -= n;
    save();
    return true;
  },

  completeLesson(lessonId, { accuracy, timeSec, errors, coinsEarned }) {
    ensureDailyMissionsFresh();
    const prev = state.completedLessons[lessonId];
    const isNew = !prev;
    state.completedLessons[lessonId] = {
      accuracy,
      timeSec,
      errors,
      coinsEarned,
      completedAt: Date.now(),
      bestAccuracy: prev ? Math.max(prev.bestAccuracy || 0, accuracy) : accuracy,
    };
    this.addCoins(coinsEarned);
    const xpResult = this.addXp(coinsEarned);
    this.touchStreak();
    if (isNew) state.missions.progress.lessons += 1;
    save();
    const newAchievements = this.checkNewAchievements();
    return { leveledUp: xpResult.leveledUp, newLevel: xpResult.newLevel, newAchievements };
  },

  isLessonDone(lessonId) {
    return !!state.completedLessons[lessonId];
  },

  getPhases(lessonId) {
    return state.lessonPhases[lessonId] || { theory: false, quiz: false, task: false, errors: 0 };
  },

  markPhaseDone(lessonId, phase) {
    const cur = state.lessonPhases[lessonId] || { theory: false, quiz: false, task: false, errors: 0 };
    cur[phase] = true;
    state.lessonPhases[lessonId] = cur;
    save();
  },

  addPhaseErrors(lessonId, n) {
    const cur = state.lessonPhases[lessonId] || { theory: false, quiz: false, task: false, errors: 0 };
    cur.errors = (cur.errors || 0) + n;
    state.lessonPhases[lessonId] = cur;
    save();
  },

  resetPhaseErrors(lessonId) {
    const cur = state.lessonPhases[lessonId] || { theory: false, quiz: false, task: false, errors: 0 };
    cur.errors = 0;
    state.lessonPhases[lessonId] = cur;
    save();
  },

  completePracticeTask(taskId) {
    ensureDailyMissionsFresh();
    const prev = state.completedPractice[taskId] || { attempts: 0 };
    const isNew = !state.completedPractice[taskId];
    state.completedPractice[taskId] = {
      solvedAt: Date.now(),
      attempts: prev.attempts + 1,
    };
    if (isNew) {
      state.missions.progress.practice += 1;
      this.addXp(5);
    }
    let dailyBonus = 0;
    if (isNew && this.isDailyTask(taskId) && !state.dailyTask.claimed) {
      dailyBonus = 15;
      state.dailyTask.claimed = true;
      this.addRubies(dailyBonus);
    }
    save();
    return { isNew, dailyBonus };
  },

  isPracticeDone(taskId) {
    return !!state.completedPractice[taskId];
  },

  claimMission(missionId) {
    ensureDailyMissionsFresh();
    const def = DAILY_MISSION_DEFS.find((m) => m.id === missionId);
    if (!def) return false;
    if (state.missions.claimed[missionId]) return false;
    if ((state.missions.progress[def.track] || 0) < def.target) return false;
    state.missions.claimed[missionId] = true;
    this.addRubies(def.reward);
    save();
    return true;
  },

  allMissionsClaimed() {
    ensureDailyMissionsFresh();
    return DAILY_MISSION_DEFS.every((m) => state.missions.claimed[m.id]);
  },

  getMissionsBonus() {
    return ALL_MISSIONS_BONUS;
  },

  claimMissionsBonus() {
    ensureDailyMissionsFresh();
    if (state.missions.bonusClaimed) return false;
    if (!this.allMissionsClaimed()) return false;
    state.missions.bonusClaimed = true;
    this.addRubies(ALL_MISSIONS_BONUS);
    save();
    return true;
  },

  getDailyRewardTable() {
    return DAILY_REWARD_TABLE;
  },

  getDailyRewardDayIndex() {
    // cycles 1..7 based on current streak length
    const streak = Math.max(1, state.streak || 1);
    return ((streak - 1) % 7) + 1;
  },

  canClaimDailyReward() {
    return state.dailyReward.lastClaimedDate !== todayStr();
  },

  claimDailyReward() {
    if (!this.canClaimDailyReward()) return false;
    const dayIndex = this.getDailyRewardDayIndex();
    const entry = DAILY_REWARD_TABLE.find((d) => d.day === dayIndex) || DAILY_REWARD_TABLE[0];
    if (entry.coins) this.addCoins(entry.coins);
    if (entry.rubies) this.addRubies(entry.rubies);
    state.dailyReward.lastClaimedDate = todayStr();
    save();
    return entry;
  },

  setProfileName(name) {
    state.profile.name = name;
    save();
  },

  setAiSettings(patch) {
    state.aiSettings = { ...state.aiSettings, ...patch };
    save();
  },

  setSettings(patch) {
    state.settings = { ...state.settings, ...patch };
    save();
  },

  // --- Shop / inventory ---
  ownsItem(itemId) {
    return state.inventory.owned.includes(itemId);
  },

  buyItem(item) {
    if (this.ownsItem(item.id)) return { ok: false, reason: 'owned' };
    const spend = item.currency === 'rubies' ? this.spendRubies(item.price) : this.spendCoins(item.price);
    if (!spend) return { ok: false, reason: 'funds' };
    state.inventory.owned.push(item.id);
    save();
    return { ok: true };
  },

  equipItem(item) {
    if (!this.ownsItem(item.id)) return false;
    state.inventory.equipped[item.category] = item.id;
    save();
    return true;
  },

  getEquipped() {
    return state.inventory.equipped;
  },

  getGender() {
    return state.inventory.gender || 'unisex';
  },

  setGender(gender) {
    state.inventory.gender = gender;
    save();
  },

  // --- Chests ---
  openChest(chest) {
    const spend = chest.currency === 'rubies' ? this.spendRubies(chest.price) : this.spendCoins(chest.price);
    if (!spend) return { ok: false, reason: 'funds' };

    // weighted rarity pick
    const roll = Math.random() * 100;
    let acc = 0;
    let picked = Object.keys(chest.odds)[0];
    for (const [rarity, pct] of Object.entries(chest.odds)) {
      acc += pct;
      if (roll < acc) { picked = rarity; break; }
    }

    const categories = ['avatar', 'frame', 'theme'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const candidates = SHOP_ITEMS.filter((i) => i.category === category && i.rarity === picked && !this.ownsItem(i.id));

    if (candidates.length === 0) {
      // already own everything of that rarity/category — compensate with currency instead
      const compTable = { common: 10, rare: 25, epic: 60, legendary: 20, mythical: 45 };
      const compCurrency = (picked === 'legendary' || picked === 'mythical') ? 'rubies' : 'coins';
      const amount = compTable[picked] || 10;
      if (compCurrency === 'rubies') this.addRubies(amount); else this.addCoins(amount);
      save();
      return { ok: true, compensation: { currency: compCurrency, amount }, rarity: picked };
    }

    const item = candidates[Math.floor(Math.random() * candidates.length)];
    state.inventory.owned.push(item.id);
    save();
    return { ok: true, item };
  },

  reset() {
    state = structuredClone(defaultState);
    save();
  },
};
