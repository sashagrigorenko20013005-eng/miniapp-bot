// animations.js
// Управление анимациями (вынесено отдельно).
// API:
//  initAnimations({ defaultId, density })
//  setAnimationId(id)  // 0-none,1-snow,2-petals
//  start(), stop()
//  updateSettings({ enabled, density })

let state = {
  animationId: 0,
  enabled: true,
  density: 0.7, // 0..1
  container: null,
  intervalHandle: null
};

function ensureContainer() {
  if (!state.container) {
    state.container = document.createElement('div');
    state.container.className = 'anim-container';
    // Top layer above app, but allow pointer-events pass-through
    state.container.style.position = 'fixed';
    state.container.style.inset = '0';
    state.container.style.pointerEvents = 'none';
    state.container.style.zIndex = '9999';
    document.body.appendChild(state.container);
  }
}

/* -----------------------------
   SNOW: white+gold snowflakes
   ----------------------------- */
function createSnowflake() {
  const container = state.container;
  if (!container) return;
  const flake = document.createElement('div');
  flake.className = 'anim-snowflake';
  const size = Math.round(6 + Math.random() * 12);
  flake.style.width = size + 'px';
  flake.style.height = size + 'px';
  flake.style.left = Math.random() * 100 + 'vw';
  const dur = (4 + Math.random() * 8).toFixed(2);
  flake.style.animationDuration = dur + 's';
  container.appendChild(flake);
  setTimeout(() => flake.remove(), (parseFloat(dur) + 0.5) * 1000);
}

/* -----------------------------
   PETALS: golden petals (nested inner for transform isolation)
   ----------------------------- */
function createPetal() {
  const container = state.container;
  if (!container) return;
  const petal = document.createElement('div');
  petal.className = 'anim-petal';
  const inner = document.createElement('div');
  inner.className = 'anim-petal-inner';
  petal.appendChild(inner);

  const left = Math.random() * 100;
  petal.style.left = left + 'vw';
  const w = 10 + Math.random() * 18;
  petal.style.width = w + 'px';
  petal.style.height = (w * 1.2) + 'px';

  const dur = (5 + Math.random() * 7).toFixed(2);
  petal.style.animationDuration = dur + 's'; // only fall uses this
  inner.style.animationDuration = (2 + Math.random() * 3).toFixed(2) + 's'; // windShake

  container.appendChild(petal);
  setTimeout(() => petal.remove(), (parseFloat(dur) + 0.5) * 1000);
}

/* -----------------------------
   interval spawner (density controls probability)
   ----------------------------- */
function startSpawner() {
  stopSpawner();
  const baseMs = 220; // attempt every 220ms
  state.intervalHandle = setInterval(() => {
    if (!state.enabled) return;
    if (state.animationId === 1) {
      // snow
      if (Math.random() < state.density) createSnowflake();
    } else if (state.animationId === 2) {
      if (Math.random() < state.density) createPetal();
    }
  }, baseMs);
}
function stopSpawner() {
  if (state.intervalHandle) {
    clearInterval(state.intervalHandle);
    state.intervalHandle = null;
  }
}

/* -----------------------------
   Public API
   ----------------------------- */
export function initAnimations({ defaultId = 0, density = 0.7, enabled = true } = {}) {
  state.animationId = defaultId;
  state.density = density;
  state.enabled = !!enabled;
  ensureContainer();
  startSpawner();
}

export function setAnimationId(id) {
  state.animationId = Number(id) || 0;
}

export function updateSettings({ enabled, density }) {
  if (typeof enabled === 'boolean') state.enabled = enabled;
  if (typeof density === 'number') state.density = density;
}

export function start() {
  state.enabled = true;
  startSpawner();
}

export function stop() {
  state.enabled = false;
  stopSpawner();
}

export function getCurrentAnimationId() {
  return state.animationId;
}
