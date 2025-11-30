/*  
============================================================
 APP.JS — ГЛАВНАЯ ТОЧКА ВХОДА MINIAPP
============================================================
*/

import { router } from "../../docs/scripts/router.js";

export const store = {
    user: null,
    theme: "light",
    booking: {}
};


/*
============================================================
 1) БЕЗОПАСНАЯ ИНИЦИАЛИЗАЦИЯ TELEGRAM API
============================================================
*/
function initTelegram() {
    let tg = null;

    if (window.Telegram && Telegram.WebApp) {
        tg = Telegram.WebApp;

        try {
            tg.ready();
        } catch (e) {
            console.warn("⚠ Ошибка ready():", e);
        }

        // Тема
        store.theme = tg.colorScheme || "light";
        document.body.dataset.theme = store.theme;

        // Пользователь
        store.user = tg.initDataUnsafe?.user || null;
        console.log("👤 Пользователь:", store.user);
    } else {
        console.warn("⚠ Telegram API недоступен — работаем в браузере");
        store.theme = "light";
        store.user = {
            id: 0,
            first_name: "Browser",
            username: "localmode"
        };
    }
}


/*
============================================================
 2) КНОПКА НАЗАД TELEGRAM
============================================================
*/
function setupBackButtonWatcher() {
    if (!window.Telegram || !Telegram.WebApp) return;

    const backButton = Telegram.WebApp.BackButton;

    window.addEventListener("hashchange", () => {
        const hash = window.location.hash;

        if (hash === "#/" || hash === "" || hash === "#") {
            backButton.hide();
        } else {
            backButton.show();
        }
    });

    backButton.onClick(() => {
        window.history.back();
    });
}


/*
============================================================
 3) НАВИГАЦИЯ
============================================================
*/
export function goTo(path, params = {}) {
    router.navigate(path, params);
}

export function updateBooking(data) {
    store.booking = { ...store.booking, ...data };
}

export function getUser() {
    return store.user;
}


/*
============================================================
 4) ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
============================================================
*/
export function initApp() {
    console.log("🚀 Инициализация MiniApp...");

    initTelegram();
    setupBackButtonWatcher();

    // Запуск роутера
    router.navigate("/", {});
}


/*
============================================================
 5) АВТОЗАПУСК
============================================================
*/
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
