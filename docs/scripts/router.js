// router.js (hash-based)
import HomeScreen from './screens/home.js';
import ServicesScreen from './screens/services.js';
import MastersScreen from './screens/masters.js';
import CalendarScreen from './screens/calendar.js';
import ConfirmScreen from './screens/confirm.js';
import BookingsScreen from './screens/bookings.js';
import BookingsDateScreen from './screens/bookingsDate.js';
import BookingDetailScreen from './screens/bookingDetail.js';
import ProfileScreen from './screens/profile.js';
import ChatScreen from './screens/chat.js';

const routes = {
  '': HomeScreen,
  '/': HomeScreen,
  '/services': ServicesScreen,
  '/masters': MastersScreen,
  '/calendar': CalendarScreen,
  '/confirm': ConfirmScreen,
  '/bookings': BookingsScreen,
  '/bookings/date': BookingsDateScreen,
  '/booking': BookingDetailScreen, // usage: #/booking?id=123
  '/profile': ProfileScreen,
  '/chat': ChatScreen
};

function parseLocation() {
  const hash = window.location.hash || '#/';
  const clean = hash.slice(1);
  const [path, queryString] = clean.split('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(part=>{
      const [k,v]=part.split('=');
      params[k]=decodeURIComponent(v||'');
    });
  }
  return { path, params };
}

export const router = {
  navigate(path, params = {}) {
    const query = new URLSearchParams(params).toString();
    window.location.hash = query ? `${path}?${query}` : path;
  }
};

async function render() {
  const { path, params } = parseLocation();
  const screen = routes[path] || HomeScreen;
  const app = document.getElementById('app');
  if (!app) return console.error('No #app');
  app.classList.add('fade-out');
  await new Promise(r => setTimeout(r, 120));
  app.innerHTML = await screen.render(params);
  if (screen.afterRender) screen.afterRender(params);
  app.classList.remove('fade-out');
  app.classList.add('fade-in');
  setTimeout(()=>app.classList.remove('fade-in'), 300);
}

window.addEventListener('hashchange', render);
document.addEventListener('DOMContentLoaded', render);
