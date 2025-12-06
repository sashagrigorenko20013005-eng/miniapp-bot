// bookings.js
import { router } from '../router.js';
import { getBookings } from '../mock/api.js';

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric' });
}

export default {
  async render() {
    return `
      <div class="container">
        <div class="page-title">Мои записи</div>
        <div id="datesStrip" class="calendar-strip"></div>
        <div id="upcomingList"></div>
      </div>
    `;
  },
  async afterRender() {
    const bookings = await getBookings();
    // unique dates
    const dates = [...new Set(bookings.map(b => b.date))].sort();
    const strip = document.getElementById('datesStrip');
    strip.innerHTML = dates.map(d => {
      return `<div class="calendar-item" data-date="${d}">${formatDate(d)}</div>`;
    }).join('');

    // attach
    strip.querySelectorAll('.calendar-item').forEach(el=>{
      el.addEventListener('click', ()=> {
        const date = el.dataset.date;
        router.navigate('/bookings/date', { date });
      });
    });

    // upcoming list
    const list = document.getElementById('upcomingList');
    if (bookings.length === 0) {
      list.innerHTML = `<div class="card">У вас нет записей</div>`;
    } else {
      list.innerHTML = bookings.map(b=>{
        return `<div class="card master-card">
          <div style="display:flex;justify-content:space-between;">
            <div>
              <div style="font-weight:600">${b.service.title}</div>
              <div style="font-size:13px;color:#6f6f6f">${formatDate(b.date)} • ${b.time}</div>
            </div>
            <div>
              <button class="button-primary" data-id="${b.id}">Подробнее</button>
            </div>
          </div>
        </div>`;
      }).join('');
      list.querySelectorAll('.button-primary').forEach(btn=>{
        btn.addEventListener('click', ()=> {
          const id = btn.dataset.id;
          router.navigate('/booking', { id });
        });
      });
    }
  }
};
