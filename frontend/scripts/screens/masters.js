// screens/masters.js
// Экран выбора мастера — показывает список мастеров, сохраняет selectedMaster

export default {
  render() {
    // пример мастеров
    const masters = JSON.parse(localStorage.getItem("masters") || "null") || [
      { id: 1, name: "Анастасия", rating: 4.9, exp: "5 лет", img: "" },
      { id: 2, name: "Мария", rating: 4.8, exp: "3 года", img: "" },
      { id: 3, name: "Ольга", rating: 4.7, exp: "7 лет", img: "" }
    ];

    if (!localStorage.getItem("masters")) localStorage.setItem("masters", JSON.stringify(masters));

    const html = masters.map(m => `
      <div class="master-card" data-id="${m.id}">
        <div class="master-avatar"></div>
        <div class="master-info">
          <div class="master-name">${m.name}</div>
          <div class="master-meta text-secondary">⭐ ${m.rating} • ${m.exp}</div>
        </div>
      </div>
    `).join("");

    return `
      <div class="container fade-in masters-container" style="padding-top:18px;">
        <h2 class="page-title">Выберите мастера</h2>
        <div id="mastersList">${html}</div>

        <div style="height:110px"></div>
        <div class="summary-panel">
          <button id="toCalendar" class="btn-primary" disabled>Выбрать дату и время</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    const masters = JSON.parse(localStorage.getItem("masters") || "[]");
    let selected = Number(localStorage.getItem("selectedMaster") || 0);

    function refresh() {
      document.querySelectorAll(".master-card").forEach(card => {
        card.classList.toggle("master-selected", Number(card.dataset.id) === selected);
      });
      document.getElementById("toCalendar").disabled = !selected;
    }

    // навешиваем клики
    document.querySelectorAll(".master-card").forEach(card => {
      card.addEventListener("click", () => {
        selected = Number(card.dataset.id);
        localStorage.setItem("selectedMaster", JSON.stringify(masters.find(m => m.id === selected)));
        refresh();
      });
    });

    // восстановить
    const prev = JSON.parse(localStorage.getItem("selectedMaster") || "null");
    if (prev) {
      selected = prev.id;
      localStorage.setItem("selectedMaster", JSON.stringify(prev));
    }

    refresh();

    document.getElementById("toCalendar").addEventListener("click", () => {
      window.location.hash = "#/calendar";
    });
  }
};
