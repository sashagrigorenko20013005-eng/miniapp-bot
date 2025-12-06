// bookingDetail.js
import { router } from '../router.js';
import { getBookings, getBooking, deleteBooking, getAvailability } from '../mock/api.js';

function formatDateHuman(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric' });
}

export default {
  async render(params) {
    // params: id OR date+time -> find booking
    let booking = null;
    if (params.id) {
      booking = await getBooking(params.id);
    } else if (params.date && params.time) {
      const avail = await getAvailability(params.date);
      const slot = avail.slots.find(s=>s.time===params.time);
      if (slot && slot.bookings && slot.bookings.length>0) {
        booking = slot.bookings[0]; // pick first for demo
      }
    }
    if (!booking) {
      return `<div class="container"><div class="card">Запись не найдена</div><button class="button-secondary" onclick="history.back()">Назад</button></div>`;
    }
    return `
      <div class="container">
        <button class="button-secondary" id="backBtn">&larr; Назад</button>
        <div class="confirm-card">
          <div class="confirm-title">${booking.service.title}</div>
          <div class="confirm-row"><div>Дата</div><div>${formatDateHuman(booking.date)}</div></div>
          <div class="confirm-row"><div>Время</div><div>${booking.time} (${booking.duration_minutes} мин)</div></div>
          <div class="confirm-row"><div>Мастер</div><div>${booking.master.name}</div></div>
          <div style="margin-top:16px">
            <button class="btn-primary" id="cancelBtn">Отменить запись</button>
          </div>
        </div>
      </div>
    `;
  },
  async afterRender(params) {
    document.getElementById('backBtn').addEventListener('click', ()=>history.back());
    const cancel = document.getElementById('cancelBtn');
    if (cancel) {
      cancel.addEventListener('click', async ()=>{
        if (!confirm('Подтвердите отмену записи')) return;
        // get booking id
        let id = params.id;
        if (!id && params.date && params.time) {
          // find id
          const avail = await getAvailability(params.date);
          const slot = avail.slots.find(s=>s.time===params.time);
          if (slot && slot.bookings && slot.bookings.length>0) id = slot.bookings[0].id;
        }
        if (!id) { alert('Не удалось найти запись'); return; }
        const res = await deleteBooking(id);
        if (res.success) {
          alert('Запись отменена');
          history.back();
        } else {
          alert('Ошибка при отмене');
        }
      });
    }
  }
};
