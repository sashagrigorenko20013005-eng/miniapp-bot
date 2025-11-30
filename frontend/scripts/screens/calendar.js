// screens/calendar.js
// Экран выбора даты и времени — Premium Rose Gold Style

export default {
  render() {
    return `
      <div class="container fade-in calendar-container" style="padding-top:18px;">
        <h2 class="page-title">Выберите дату и время</h2>
        <div class="calendar-strip" id="calendarStrip"></div>
        <div class="time-grid" id="timeGrid"></div>

        <div style="height:110px"></div>
        <div class="summary-panel">
          <button id="confirmTime" class="btn-primary" disabled>Подтвердить запись</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      dates.push(d);
    }

    let selectedDate = null;
    let selectedTime = null;

    const strip = document.getElementById("calendarStrip");
    const grid = document.getElementById("timeGrid");
    const btn = document.getElementById("confirmTime");

    function renderDates() {
      strip.innerHTML = "";
      dates.forEach((d, idx) => {
        const weekday = d.toLocaleDateString("ru-RU", { weekday: "short" }).replace(".", "");
        const daynum = d.getDate();
        strip.innerHTML += `
          <div class="calendar-item" data-idx="${idx}">
            <div class="calendar-weekday">${weekday}</div>
            <div class="calendar-day">${daynum}</div>
          </div>
        `;
      });
      attachDateEvents();
    }

    function renderTimes() {
      grid.innerHTML = "";
      for (let t = 8 * 60; t < 18 * 60; t += 30) {
        const h = String(Math.floor(t / 60)).padStart(2, "0");
        const m = t % 60 === 0 ? "00" : "30";
        grid.innerHTML += `<div class="time-slot" data-time="${h}:${m}">${h}:${m}</div>`;
      }
      attachTimeEvents();
    }

    function attachDateEvents() {
      document.querySelectorAll(".calendar-item").forEach(el => {
        el.addEventListener("click", () => {
          selectedDate = dates[Number(el.dataset.idx)];
          // визуальное выделение
          document.querySelectorAll(".calendar-item").forEach(x => x.classList.remove("calendar-selected"));
          el.classList.add("calendar-selected");
          checkReady();
        });
      });
    }

    function attachTimeEvents() {
      document.querySelectorAll(".time-slot").forEach(el => {
        el.addEventListener("click", () => {
          selectedTime = el.dataset.time;
          document.querySelectorAll(".time-slot").forEach(x => x.classList.remove("time-selected"));
          el.classList.add("time-selected");
          checkReady();
        });
      });
    }

    function checkReady() {
      btn.disabled = !(selectedDate && selectedTime);
    }

    btn.addEventListener("click", () => {
      // сохраняем ISO даты + время в localStorage
      localStorage.setItem("selectedDate", selectedDate.toISOString());
      localStorage.setItem("selectedTime", selectedTime);
      window.location.hash = "#/confirm";
    });

    // первый рендер
    renderDates();
    renderTimes();

    // если были ранее выбранные — восстановим (опционально)
    const prevDate = localStorage.getItem("selectedDate");
    const prevTime = localStorage.getItem("selectedTime");
    if (prevDate) {
      // попросту выделяем ближайший совпадающий элемент после рендера
      const dObj = new Date(prevDate);
      dates.forEach((d, idx) => {
        if (d.toDateString() === dObj.toDateString()) {
          document.querySelector(`.calendar-item[data-idx="${idx}"]`)?.classList.add("calendar-selected");
          selectedDate = d;
        }
      });
    }
    if (prevTime) {
      const el = document.querySelector(`.time-slot[data-time="${prevTime}"]`);
      if (el) { el.classList.add("time-selected"); selectedTime = prevTime; }
    }
    checkReady();
  }
};
