// screens/confirm.js
// Экран подтверждения записи — показывает услуги, мастера, дату/время
// Добавлена кнопка "Добавить параллельную услугу"

export default {
  render() {
    const services = JSON.parse(localStorage.getItem("selectedServices") || "[]");
    const master = JSON.parse(localStorage.getItem("selectedMaster") || "null");
    const dateISO = localStorage.getItem("selectedDate") || "";
    const time = localStorage.getItem("selectedTime") || "";

    // если нет данных — вернём короткую вёрстку (router перенаправит)
    if (!services.length || !master || !dateISO || !time) {
      return `<div class="container fade-in" style="padding-top:20px;">
                <p>Нет данных для подтверждения. Перенаправляем...</p>
              </div>`;
    }

    const dateStr = new Date(dateISO).toLocaleDateString("ru-RU", { day:'2-digit', month:'long', year:'numeric' });

    const servicesHtml = services.map(s => `<div class="confirm-row"><span>${s.name}</span><span class="confirm-price">${s.price} ₽</span></div>`).join("");

    const total = services.reduce((acc, s) => acc + s.price, 0);

    return `
      <div class="container fade-in confirm-container" style="padding-top:18px;">
        <h2 class="page-title">Подтвердите запись</h2>

        <div class="confirm-card">
          <div class="confirm-block">
            <div class="confirm-title">Услуги</div>
            ${servicesHtml}
          </div>

          <div class="confirm-divider"></div>

          <div class="confirm-block">
            <div class="confirm-title">Мастер</div>
            <div class="confirm-row"><span>${master.name}</span><span>⭐ ${master.rating}</span></div>
          </div>

          <div class="confirm-divider"></div>

          <div class="confirm-block">
            <div class="confirm-title">Дата и время</div>
            <div class="confirm-row"><span>${dateStr}</span><span>${time}</span></div>
          </div>
        </div>

        <button id="addParallelBtn" class="btn-secondary" style="margin-top:14px;">Добавить параллельную услугу</button>

        <div style="height:110px"></div>
        <div class="summary-panel">
          <div class="summary-info">
            <span class="summary-label">Итого:</span>
            <span class="summary-total">${total} ₽</span>
          </div>
          <button id="confirmBtn" class="btn-primary">Подтвердить запись</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    // если данных недостаточно — отправляем на услуги
    const services = JSON.parse(localStorage.getItem("selectedServices") || "[]");
    const master = JSON.parse(localStorage.getItem("selectedMaster") || "null");
    const dateISO = localStorage.getItem("selectedDate") || "";
    const time = localStorage.getItem("selectedTime") || "";

    if (!services.length || !master || !dateISO || !time) {
      window.location.hash = "#/services";
      return;
    }

    document.getElementById("addParallelBtn").addEventListener("click", () => {
      // просто возвращаем на выбор услуг, не стирая текущие
      window.location.hash = "#/services";
    });

    document.getElementById("confirmBtn").addEventListener("click", () => {
      // Записываем запись в localStorage (список appointments)
      const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
      const appointment = {
        id: Date.now(),
        services: services,
        master: master,
        date: localStorage.getItem("selectedDate"),
        time: localStorage.getItem("selectedTime"),
        createdAt: new Date().toISOString(),
        status: "confirmed"
      };
      appointments.push(appointment);
      localStorage.setItem("appointments", JSON.stringify(appointments));

      // Очистим временные выборы (но можно оставить, решай сам)
      localStorage.removeItem("selectedServices");
      localStorage.removeItem("selectedMaster");
      localStorage.removeItem("selectedDate");
      localStorage.removeItem("selectedTime");

      // Переходим на success
      window.location.hash = "#/success";
    });
  }
};
