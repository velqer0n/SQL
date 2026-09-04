import { Store } from './state.js';

let audioCtx = null;
function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  return audioCtx;
}

function beep(freq, durationMs, type = 'sine') {
  const c = ctx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.08, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + durationMs / 1000);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + durationMs / 1000);
}

export function feedbackFx(isCorrect) {
  const enabled = Store.get().settings.soundEnabled;
  if (!enabled) return;
  try {
    if (isCorrect) {
      beep(660, 90);
      setTimeout(() => beep(880, 120), 90);
    } else {
      beep(180, 180, 'sawtooth');
    }
  } catch (e) { /* audio not available, ignore */ }
  try {
    if (navigator.vibrate) navigator.vibrate(isCorrect ? 30 : [40, 40, 40]);
  } catch (e) { /* ignore */ }
}

export function levelUpFx() {
  const enabled = Store.get().settings.soundEnabled;
  if (!enabled) return;
  try {
    [523, 659, 784, 1047].forEach((freq, i) => setTimeout(() => beep(freq, 160), i * 110));
  } catch (e) { /* ignore */ }
  try {
    if (navigator.vibrate) navigator.vibrate([30, 40, 30, 40, 60]);
  } catch (e) { /* ignore */ }
}

export function achievementFx() {
  const enabled = Store.get().settings.soundEnabled;
  if (!enabled) return;
  try {
    beep(784, 100);
    setTimeout(() => beep(1047, 220), 100);
  } catch (e) { /* ignore */ }
  try {
    if (navigator.vibrate) navigator.vibrate([20, 30, 50]);
  } catch (e) { /* ignore */ }
}
