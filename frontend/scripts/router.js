/*  
============================================================
 ROUTER.JS — КЛЮЧЕВОЙ МЕХАНИЗМ SPA MINIAPP
 Управляет переходами между экранами, подгружает модули,
 а также делает плавную анимацию при смене маршрута.
============================================================
*/

/*
------------------------------------------------------------
 1) Импорт всех экранов
 Мы будем постепенно наполнять эти файлы.
 Каждый экран — это объект вида:
 export default { render(params), afterRender() }
------------------------------------------------------------
*/
import HomeScreen from './screens/home.js';
import ServicesScreen from './screens/services.js';
import MastersScreen from './screens/masters.js';
import CalendarScreen from './screens/calendar.js';
import ConfirmScreen from './screens/confirm.js';
/*
------------------------------------------------------------
 2) Определяем маршруты приложения.
 Ключ — URL-хеш, значение — экран.
 Если пользователь вводит неизвестный маршрут,
 будет открыт home.
------------------------------------------------------------
*/
const routes = {
    '': HomeScreen,
    '/': HomeScreen,
    '/services': ServicesScreen,
    '/masters': MastersScreen,
    '/calendar': CalendarScreen,
    '/confirm': ConfirmScreen,
};


/*
------------------------------------------------------------
 3) Получение текущего маршрута.
 Формат хеша в Telegram:
 #/services
 #/calendar?serviceId=4
------------------------------------------------------------
*/
function parseLocation() {
    const hash = window.location.hash || '#/';

    // Удаляем # в начале
    let clean = hash.slice(1);

    // Разделяем путь и параметры
    const [path, queryString] = clean.split('?');

    const params = {};

    if (queryString) {
        const queryParts = queryString.split('&');
        queryParts.forEach(part => {
            const [key, value] = part.split('=');
            params[key] = decodeURIComponent(value || '');
        });
    }

    return { path, params };
}


/*
------------------------------------------------------------
 4) ФУНКЦИЯ: navigate(path, params)
 Позволяет программно менять страницу:
 router.navigate('/masters', { serviceId: 1 })
------------------------------------------------------------
*/
export const router = {
    navigate(path, params = {}) {
        const query = new URLSearchParams(params).toString();
        window.location.hash = query ? `${path}?${query}` : path;
    }
};


/*
------------------------------------------------------------
 5) ФУНКЦИЯ РЕНДЕРИНГА
 1) Находим экран
 2) Вызываем его render()
 3) Затем afterRender() — привязка событий
 4) Плавная анимация появления
------------------------------------------------------------
*/
async function render() {
    const { path, params } = parseLocation();

    const screen = routes[path] || HomeScreen;

    const app = document.getElementById('app');
    if (!app) {
        console.error("❌ ERROR: <div id='app'> не найден в index.html");
        return;
    }

    // CSS-класс для fade анимации
    app.classList.add('fade-out');

    // Маленькая пауза перед сменой контента (анимация)
    await new Promise(resolve => setTimeout(resolve, 150));

    // Очищаем содержимое
    app.innerHTML = '';

    // Рендер экрана
    app.innerHTML = await screen.render(params);

    // Привязываем события (кнопки, клики)
    if (screen.afterRender) {
        screen.afterRender(params);
    }

    // Убираем анимацию исчезновения и включаем появление
    app.classList.remove('fade-out');
    app.classList.add('fade-in');

    // Через 300ms убираем fade-in (чтобы повторно сработало)
    setTimeout(() => app.classList.remove('fade-in'), 300);
}


/*
------------------------------------------------------------
 6) Следим за изменением хеша:
 Пользователь нажал кнопку → изменился hash → вызываем render()
------------------------------------------------------------
*/
window.addEventListener('hashchange', render);


/*
------------------------------------------------------------
 7) Инициализация роутера при загрузке MiniApp
------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', () => {
    render(); // Первый рендер
});
