// screens/success.js
// Экран успешной записи

export default {
  render() {
    return `
      <div class="container fade-in success-container" style="padding-top:40px; text-align:center;">
        <div class="success-icon" style="margin:0 auto 18px; width:100px; height:100px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:48px; background:linear-gradient(135deg,#E8BFB5,#D9A79A);">✓</div>
        <h2 class="success-title">Вы успешно записаны!</h2>
        <p class="success-text text-secondary">Спасибо, что выбрали салон «Рея». Мы ждём вас в указанное время.</p>

        <button id="toHome" class="btn-primary" style="margin-top:18px; max-width:300px;">На главную</button>
      </div>
    `;
  },

  afterRender() {
    document.getElementById("toHome").addEventListener("click", () => {
      window.location.hash = "#/";
    });
  }
};
