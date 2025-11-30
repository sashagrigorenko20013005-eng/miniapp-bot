// screens/services.js
// Экран выбора услуг (категории + услуги внутри)
// Использует localStorage:selectedServices

export default {
    
  render() {
    // Если нет mock-данных — подставим базовые примеры
   localStorage.clear()

    const stored = JSON.parse(localStorage.getItem("services") || "null");
    const servicesData = stored || [
      {
        id: 1, title: "Маникюр и педикюр", services: [
          { id: 101, name: "Маникюр классический", price: 1200, duration: 60, img: "" },
          { id: 102, name: "Покрытие гель-лак", price: 1500, duration: 90, img: "" }
        ]
      },
      {
        id: 2, title: "Косметология лица", services: [
          { id: 201, name: "Чистка лица", price: 2500, duration: 90, img: "" },
          { id: 202, name: "Уход увлажняющий", price: 1800, duration: 60, img: "" }
        ]
      },
      {
        id: 3, title: "Парикмахерские услуги", services: [
          { id: 301, name: "Стрижка женская", price: 900, duration: 45, img: "" },
          { id: 302, name: "Окрашивание", price: 2800, duration: 120, img: "" }
        ]
      }
    ];
    localStorage.clear()
    // сохраняем mock в localStorage для удобства разработки
    if (!stored) {
      localStorage.setItem("services", JSON.stringify(servicesData));
    }

    // собираем HTML
    const catsHtml = servicesData.map(cat => {
      const items = cat.services.map(s => `
        <div class="service-card" data-service-id="${s.id}">
          <input type="checkbox" class="service-checkbox" data-id="${s.id}">
          <div class="service-info">
            <div class="service-name">${s.name}</div>
            <div class="service-meta text-secondary">${s.duration} мин • ${s.price} ₽</div>
          </div>
          <div class="service-thumb"></div>
        </div>
      `).join("");

      return `
        <div class="category-card">
          <div class="category-header" data-cat="${cat.id}">
            <div class="category-title">${cat.title}</div>
            <div class="category-arrow">▾</div>
          </div>
          <div class="category-body" style="display:none;">
            ${items}
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="container fade-in services-container" style="padding-top:20px;">
        <h2 class="page-title" style="margin-bottom:12px;">Выберите услуги</h2>

        <div id="categoriesList">
          ${catsHtml}
        </div>

        <div style="height:110px"></div>
        <div class="summary-panel">
          <div class="summary-info">
            <span class="summary-label">Итого:</span>
            <span id="summaryTotal" class="summary-total">0 ₽</span>
          </div>
          <button id="toMasters" class="btn-primary" disabled>К выбору специалиста</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    const selected = JSON.parse(localStorage.getItem("selectedServices") || "[]");

    // открытие/закрытие категорий
    document.querySelectorAll(".category-header").forEach(h => {
      h.addEventListener("click", () => {
        const body = h.nextElementSibling;
        body.style.display = body.style.display === "none" ? "block" : "none";
      });
    });

    // чекбоксы услуг (делегирование)
    function syncSummary() {
      const boxes = Array.from(document.querySelectorAll(".service-checkbox"));
      const chosen = boxes.filter(b => b.checked).map(b => {
        // находим данные услуги по id из localStorage.services
        const id = Number(b.dataset.id);
        const all = JSON.parse(localStorage.getItem("services") || "[]");
        for (const cat of all) {
          const s = cat.services.find(x => x.id === id);
          if (s) return s;
        }
        return null;
      }).filter(Boolean);

      localStorage.setItem("selectedServices", JSON.stringify(chosen));
      const total = chosen.reduce((acc, x) => acc + x.price, 0);
      document.getElementById("summaryTotal").innerText = total + " ₽";
      document.getElementById("toMasters").disabled = chosen.length === 0;
    }

    document.querySelectorAll(".service-checkbox").forEach(box => {
      box.addEventListener("change", syncSummary);
    });

    // если есть ранее выбранные — отметить
    const pre = JSON.parse(localStorage.getItem("selectedServices") || "[]");
    if (pre.length) {
      document.querySelectorAll(".service-checkbox").forEach(box => {
        const id = Number(box.dataset.id);
        if (pre.find(s => s.id === id)) box.checked = true;
      });
      syncSummary();
    }

    // переход к мастерам
    document.getElementById("toMasters").addEventListener("click", () => {
      window.location.hash = "#/masters";
    });
  }
};
