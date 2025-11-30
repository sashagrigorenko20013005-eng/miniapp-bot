// screens/home.js
// Главный экран — названия салона + адрес + кнопка "Записаться"
// Формат: export default { render(), afterRender() }

export default {
  render() {
    return `
      <div class="container fade-in" style="padding-top:48px; text-align:center;">
        <h1 class="salon-title" style="font-size:34px; margin-bottom:6px;">Салон кросоты "Рея"</h1>
        <div class="salon-address" style="color:#6F6F6F; margin-bottom:36px;">Воронеж, улица Димитрова, 47</div>

        <button id="btnBook" class="btn-primary" style="max-width:360px; margin:0 auto; display:block;">
          Записаться
        </button>
      </div>
    `;
  },

  afterRender() {
    // Сбор базовой информации о пользователе из Telegram WebApp (если доступен),
    // и сохранение в localStorage для последующей интеграции с бэкендом.
    try {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user || null;
      if (tgUser) {
        localStorage.setItem("tg_user", JSON.stringify(tgUser));
      }
    } catch (e) {
      // ничего — работа в обычном браузере
    }

    const btn = document.getElementById("btnBook");
    if (btn) {
      btn.addEventListener("click", () => {
        // переход на список услуг
        window.location.hash = "#/services";
      });
    }
  }
};
