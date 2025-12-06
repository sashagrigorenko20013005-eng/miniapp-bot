// bookingsDate.js
import { router } from '../router.js';
import { getAvailability } from '../mock/api.js';

function timeSlotsHTML(slots) {
  return `<div class="time-grid">
    ${slots.map(s => {
      const occupied = s.bookings && s.bookings.length>0;
      const parallel = occupied && s.bookings.some(b=>b.parallel);
      const cls = occupied ? (parallel? 'time-slot time-parallel' : 'time-slot time-occupied') : 'time-slot';
      const badge = parallel ? `<span style="font-size:11px;margin-left:6px">+п</span>` : '';
      return `<div class="${cls}" data-time="${s.time}">${s.time} ${badge}</div>`;
    }).join('')}
  </div>`;
}

export default {
  async render(params) {
    const date = params.date || (new Date()).toISOString().slice(0,10);
    const avail = await getAvailability(date);
    return `
      <div class="container">
        <button class="button-secondary" id="backBtn">&larr; Назад</button>
        <div class="page-title">Записи на ${date}</div>
        <div id="slotsWrap">
          ${timeSlotsHTML(avail.slots)}
        </div>
      </div>
    `;
  },
  async afterRender(params) {
    document.getElementById('backBtn').addEventListener('click', ()=>window.history.back());
    document.querySelectorAll('.time-slot').forEach(slot=>{
      slot.addEventListener('click', ()=>{
        const time = slot.dataset.time;
        // if occupied -> open booking detail (first booking)
        // We pass date+time to route; router will pick the booking
        router.navigate('/booking', { date: params.date, time });
      });
    });
  }
};
