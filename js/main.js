import { renderPathPage } from './pathPage.js';
import { renderPracticePage } from './practicePage.js';
import { renderProfilePage } from './profilePage.js';

const app = document.getElementById('app');
const navButtons = document.querySelectorAll('.nav-btn');

const routes = {
  path: renderPathPage,
  practice: renderPracticePage,
  profile: renderProfilePage,
};

function currentRoute() {
  const hash = location.hash.replace('#/', '');
  return routes[hash] ? hash : 'path';
}

function render() {
  const route = currentRoute();
  navButtons.forEach((b) => b.classList.toggle('active', b.dataset.route === route));
  routes[route](app);
  window.scrollTo(0, 0);
}

navButtons.forEach((b) => {
  b.addEventListener('click', () => {
    location.hash = `#/${b.dataset.route}`;
  });
});

window.addEventListener('hashchange', render);
render();
