import { renderPathPage } from './pathPage.js';
import { renderPracticePage } from './practicePage.js';
import { renderProfilePage } from './profilePage.js';
import { renderShopPage } from './shopPage.js';
import { renderMissionsPage } from './missionsPage.js';
import { applyTheme } from './theme.js';
import { Store } from './state.js';
import { openOnboarding } from './onboarding.js';
import { isSupabaseConfigured } from './supabaseClient.js';
import { getSession, setSyncEnabled, scheduleCloudPush } from './cloudSync.js';

applyTheme();
Store._setCloudPushHook(scheduleCloudPush);

if (isSupabaseConfigured()) {
  getSession().then((session) => {
    setSyncEnabled(!!session);
  });
}

const app = document.getElementById('app');
const navButtons = document.querySelectorAll('.nav-btn');

const routes = {
  path: renderPathPage,
  practice: renderPracticePage,
  shop: renderShopPage,
  missions: renderMissionsPage,
  profile: renderProfilePage,
};

function currentRoute() {
  const hash = location.hash.replace('#/', '');
  return routes[hash] ? hash : 'path';
}

function showRenderError(err) {
  console.error('Render error:', err);
  app.innerHTML = `
    <div style="padding:60px 24px;text-align:center;">
      <div style="font-size:36px;margin-bottom:14px;">😕</div>
      <div style="font-size:15px;font-weight:700;margin-bottom:8px;color:var(--text);">Что-то пошло не так</div>
      <div style="font-size:13px;color:var(--text-faint);margin-bottom:18px;">Попробуйте обновить страницу. Ваш прогресс сохранён и никуда не денется.</div>
      <button class="btn-primary" style="max-width:220px;margin:0 auto;" onclick="location.reload()">Обновить</button>
    </div>`;
}

function render() {
  const route = currentRoute();
  navButtons.forEach((b) => b.classList.toggle('active', b.dataset.route === route));
  try {
    routes[route](app);
  } catch (err) {
    showRenderError(err);
  }
  window.scrollTo(0, 0);
}

navButtons.forEach((b) => {
  b.addEventListener('click', () => {
    location.hash = `#/${b.dataset.route}`;
  });
});

window.addEventListener('hashchange', render);
render();

if (!Store.get().settings.onboardingSeen) {
  setTimeout(() => openOnboarding({}), 300);
}
