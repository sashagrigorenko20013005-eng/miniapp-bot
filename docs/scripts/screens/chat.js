// chat.js
export default {
  async render() {
    return `<div class="container">
      <div class="page-title">Связаться с администратором</div>
      <div class="card">
        <p>Нажмите кнопку ниже, чтобы перейти в чат администратора в Telegram.</p>
        <button class="btn-primary" id="openChat">Открыть чат</button>
      </div>
    </div>`;
  },
  async afterRender() {
    document.getElementById('openChat').addEventListener('click', ()=>{
      // замените admin_username на реальный
      const admin = 'ADMIN_USERNAME';
      // в Telegram WebApp используем WebApp.openLink если доступен
      if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.openLink(`https://t.me/${admin}`);
      } else {
        window.open(`https://t.me/${admin}`, '_blank');
      }
    });
  }
};
