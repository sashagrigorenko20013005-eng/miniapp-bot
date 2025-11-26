GlowSalon SPA MiniApp (Variant B) — Ultra-light clean

What you got:
- index.html — entry point (mobile-first)
- styles.css — design system + components (light theme)
- router.js — tiny hash-based router (supports param routes)
- components.js — small UI helpers (modal etc.)
- app.js — SPA application wiring & mock DB (localStorage). Implements screens:
    - Home (services list)
    - Service details (choose master)
    - Calendar (pick date/time + confirm booking)
    - Bookings (list and cancel)
    - Chat (placeholder)
- Ready to connect to backend: replace DB.get/put with fetch() calls to your API.

How to run:
1. Unzip and open index.html in browser (or host via GitHub Pages/Vercel).
2. This is a static SPA — no server required for demo (uses localStorage).

Next steps (recommended):
- Replace mock DB with real API calls (FastAPI endpoints)
- Implement Telegram WebApp initialization if you deploy inside Telegram
- Add authentication (Telegram WebApp or OAuth)
- Implement transaction-safe booking on backend

If you want — I will now:
1) Convert DB calls to fetch() and create a FastAPI backend skeleton with endpoints (recommended).
2) Add light animations and micro-interactions to the SPA.
3) Prepare GitHub repo with these files and a GitHub Pages deployment script.
