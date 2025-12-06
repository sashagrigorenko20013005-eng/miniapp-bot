// home.js
import { router } from '../router.js';
import { getSettings, getBookings } from '../mock/api.js';
import * as Anim from '../animations.js';

export default {
  async render() {
    // simple home layout
    return `
      <div class="home-container">
        <h1 class="salon-title">Рея</h1>
        <div class="salon-address">Воронеж, улица Димитрова, 47</div>

        <div style="height:24px"></div>

        <button class="btn-primary" id="bookBtn">Записаться</button>
        <div style="height:12px"></div>

        <button class="btn-primary" id="viewBookingsBtn">Просмотреть записи</button>
        <div style="height:12px"></div>

        <button class="btn-primary" id="chatBtn">Связаться с администратором</button>
      </div>
    `;
  },
  async afterRender() {
    document.getElementById('bookBtn').addEventListener('click', ()=>router.navigate('/services'));
    document.getElementById('viewBookingsBtn').addEventListener('click', ()=>router.navigate('/bookings'));
    document.getElementById('chatBtn').addEventListener('click', ()=>router.navigate('/chat'));

    // initialize animations based on settings
    const s = await getSettings();
    Anim.initAnimations({ defaultId: s.animation_id || 0, density: s.animation_density || 0.7, enabled: !!s.animation_enabled });
  }
};
