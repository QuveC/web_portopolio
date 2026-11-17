/* =====================================================================
   Motion engine — shared ticker, springs, reveals, triggers
   (ported 1:1 from the original vanilla build)
   ===================================================================== */
export const REDUCED = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const px = (v) => `${((v / 1440) * 100).toFixed(4)}cqw`;

/* smooth-scroll handle, shared by every component */
export const scroller = { lenis: null };

const subs = new Set();
let rafId = 0;
let preFrame = null;
function loop(t) {
  rafId = 0;
  if (preFrame) preFrame(t);
  for (const s of [...subs]) { if (subs.has(s) && t - s.last > s.fr()) { s.last = t; s.cb(t); } }
  if (subs.size || preFrame) rafId = requestAnimationFrame(loop);
}
export function subscribe(cb, fr = () => 0) {
  const s = { cb, fr, last: -1e9 }; subs.add(s);
  if (!rafId) rafId = requestAnimationFrame(loop);
  return () => subs.delete(s);
}
export function setPreFrame(fn) {
  preFrame = fn;
  if (!rafId) rafId = requestAnimationFrame(loop);
}

export const CFG = {
  REVEAL: { tension: 90, friction: 26 }, ROW: { tension: 170, friction: 24 }, SHEET: { tension: 190, friction: 26 },
  FIGURE: { tension: 200, friction: 24 }, TYPE: { tension: 210, friction: 24 }, YEAR: { tension: 190, friction: 24 },
  COPY: { tension: 110, friction: 26 }, COPY2: { tension: 150, friction: 24 }, NAME: { tension: 190, friction: 24 },
  VEIL: { tension: 70, friction: 24 }, CLEAR: { tension: 140, friction: 26 }, LABEL: { tension: 110, friction: 26 },
  WAIT: { tension: 10, friction: 30 }, READY: { tension: 170, friction: 26 }, SETTLE: { tension: 32, friction: 26 },
  TRIGGER: { tension: 140, friction: 30 }, DEFAULT: { tension: 170, friction: 26 },
};

/** react-spring's damped spring: 1ms substeps, 64ms frame cap, mass 1. */
export class Spring {
  constructor(value, cfg, onUpdate) { Object.assign(this, { value, velocity: 0, target: value, cfg, onUpdate, unsub: null, startAt: 0, last: 0, t0: 0, from: value }); }
  to(target, delay = 0) {
    this.target = target;
    if (delay > 0 || !this.unsub) this.startAt = performance.now() + delay;
    if (!this.unsub) { this.last = 0; this.unsub = subscribe((t) => this.tick(t)); }
    return this;
  }
  jump(v) { this.value = this.target = v; this.velocity = 0; this.onUpdate(v); }
  stop() { if (this.unsub) { this.unsub(); this.unsub = null; } }
  tick(t) {
    if (t < this.startAt) return;
    if (!this.last) { this.last = t; this.t0 = t; this.from = this.value; return; }
    const dt = Math.min(64, t - this.last); this.last = t;
    const c = this.cfg;
    if (REDUCED) { this.value = this.target; this.velocity = 0; }
    else if (c.duration != null) {
      const u = Math.min(1, (t - this.t0) / c.duration);
      this.value = this.from + (this.target - this.from) * (c.easing ? c.easing(u) : u);
      this.velocity = u >= 1 ? 0 : 1;
    } else {
      for (let i = 0; i < dt; i++) {
        const a = -c.tension * 1e-6 * (this.value - this.target) - c.friction * 1e-3 * this.velocity;
        this.velocity += a; this.value += this.velocity;
      }
    }
    const rest = Math.abs(this.velocity) < 1e-4 && Math.abs(this.target - this.value) < 5e-4;
    if (rest) { this.value = this.target; this.velocity = 0; }
    this.onUpdate(this.value);
    if (rest && this.unsub) { this.unsub(); this.unsub = null; }
  }
}

/** Fade + rise, on the independent `translate` property so it never fights a CSS transform. */
export function rise(el, { y = "0.75rem", cfg = CFG.REVEAL, delay = 0, axis = "y" } = {}) {
  const apply = (p) => {
    el.style.opacity = clamp01(p);
    if (axis === "x") el.style.scale = `${Math.max(0, p)} 1`;
    else if (y) el.style.translate = p >= 1 ? "" : `0 calc(${y} * ${1 - p})`;
  };
  apply(0);
  const s = new Spring(0, cfg, apply);
  return { play: (base = 0) => s.to(1, base + delay), spring: s };
}

/** The text engine: words or letters, each its own spring. Idempotent — safe to call twice on one element. */
export function split(el, { mode = "words", stagger = 110, cfg = CFG.REVEAL, gap = 0.3 } = {}) {
  if (el.dataset.splitText == null) el.dataset.splitText = el.textContent.trim().replace(/\s+/g, " ");
  const text = el.dataset.splitText;
  el.textContent = "";
  const sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = text;
  const box = document.createElement("span"); box.className = "split"; box.setAttribute("aria-hidden", "true"); box.style.columnGap = `${gap}em`;
  const units = [];
  const y = mode === "words" ? "0.35em" : "0.3em";
  for (const word of text.split(" ")) {
    if (mode === "words") { const s = document.createElement("span"); s.textContent = word; box.append(s); units.push(s); }
    else {
      const w = document.createElement("span"); w.className = "w";
      for (const ch of word) { const s = document.createElement("span"); s.textContent = ch; w.append(s); units.push(s); }
      box.append(w);
    }
  }
  el.append(sr, box);
  const springs = units.map((u) => rise(u, { y, cfg }));
  return { play: (base = 0) => springs.forEach((s, i) => s.play(base + i * stagger)), units };
}

export function onceInView(el, cb, rootMargin = "0% 0% -15% 0%") {
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); cb(); } }, { rootMargin });
  io.observe(el);
  return () => io.disconnect();
}
/** In view, plus ten more frames after it leaves. */
export function tracker(el, margin = "0px") {
  const st = { inView: false, tail: 0 };
  new IntersectionObserver((es) => { for (const e of es) { st.inView = e.isIntersecting; if (!st.inView) st.tail = 10; } }, { rootMargin: margin }).observe(el);
  st.live = () => { if (st.inView) return true; if (st.tail > 0) { st.tail--; return true; } return false; };
  return st;
}
function progressOf(bb, vh, start, end) {
  const poses = {
    top_top: bb.top, center_top: bb.top + bb.height / 2, bottom_top: bb.bottom,
    top_bottom: bb.top - vh, center_bottom: bb.top + bb.height / 2 - vh, bottom_bottom: bb.bottom - vh,
    top_center: bb.top - vh / 2, center_center: bb.top + bb.height / 2 - vh / 2, bottom_center: bb.bottom - vh / 2,
  };
  const s = poses[start], e = poses[end];
  const len = Math.abs(s - e) || 1;
  return Math.min(Math.max(0, 1 - (s + len) / len), 1);
}
const scrubs = [];
export function addScrub(el, start, end, apply, smooth = null) {
  const s = { el, start, end, apply, tr: tracker(el, "25% 0px"), lastP: -1, spring: smooth ? new Spring(0, smooth, apply) : null };
  scrubs.push(s); return s;
}
export function runScrubs(force = false) {
  const vh = innerHeight;
  for (const s of scrubs) {
    if (!s.el.isConnected) continue;
    if (!force && !s.tr.live()) continue;
    const p = progressOf(s.el.getBoundingClientRect(), vh, s.start, s.end);
    if (p === s.lastP) continue;
    s.lastP = p;
    if (s.spring && !force) s.spring.to(p); else { if (s.spring) s.spring.jump(p); s.apply(p); }
  }
}
subscribe(() => runScrubs(), () => 10);

/* ---------- palette, read from the CSS tokens ---------- */
function readToken(token) {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${token})`;
  document.body.appendChild(probe);
  const c = getComputedStyle(probe).color; probe.remove();
  const m = c.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2]];
}
let palette = null;
export function getPalette() {
  if (!palette) palette = { accent: readToken("--accent"), white: [255, 255, 255], bright: [141, 243, 250], ink: readToken("--foreground"),
    bg: readToken("--background"), soft: readToken("--surface-soft"), black: readToken("--surface-black"), dot: readToken("--map-dot") };
  return palette;
}
export const rgba = ([r, g, b], a = 1) => `rgb(${r} ${g} ${b} / ${a})`;
export const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

/* =====================================================================
   2D contour field (marching squares) — paddock, footer, certificates, hero fallback
   ===================================================================== */
export function contourField(canvas, colour, host, opts = {}) {
  const ctx = canvas.getContext("2d");
  const live = tracker(host); const start = performance.now();
  const field = (x, y, t) => { let f = Math.sin(x + t * 0.6) * 0.5; f += Math.sin(y * 0.85 - t * 0.45) * 0.45; f += Math.sin((x + y) * 0.65 + t * 0.35) * 0.35; f += Math.sin((x - y) * 0.95 - t * 0.55) * 0.25; return f * 0.5 + 0.5; };
  let width = 0, height = 0;
  const size = () => { const r = Math.min(devicePixelRatio || 1, 2); width = canvas.clientWidth; height = canvas.clientHeight; canvas.width = Math.round(width * r); canvas.height = Math.round(height * r); ctx.setTransform(r, 0, 0, r, 0, 0); };
  const ro = new ResizeObserver(size); ro.observe(canvas); size();
  const draw = (now) => {
    if (!width || !height) return;
    const t = ((now - start) / 1000) * 1.66 * (REDUCED ? 0 : 1);
    const CELLS = 96, cols = width >= height ? CELLS : Math.max(8, Math.round((CELLS * width) / height)), rows = Math.max(8, Math.round((cols * height) / width));
    const sx = width / cols, sy = height / rows, aspect = width / height, values = new Float32Array((cols + 1) * (rows + 1));
    for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
      const nx = ((i / cols) * 2 - 1) * aspect * 3.8, ny = ((j / rows) * 2 - 1) * 3.8;
      const qx = nx + Math.sin(ny * 0.8 + t * 0.7) * 0.37, qy = ny + Math.cos(nx * 0.7 - t * 0.6) * 0.37;
      values[j * (cols + 1) + i] = field(qx, qy, t) * 2.5;
    }
    ctx.clearRect(0, 0, width, height);
    if (opts.fill) { ctx.fillStyle = opts.fill; ctx.fillRect(0, 0, width, height); }
    ctx.strokeStyle = colour; ctx.lineWidth = 1; ctx.globalAlpha = 0.85; ctx.beginPath();
    for (let level = 0.5; level < 2.5; level += 1)
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const a = values[j * (cols + 1) + i], b = values[j * (cols + 1) + i + 1], c = values[(j + 1) * (cols + 1) + i + 1], d = values[(j + 1) * (cols + 1) + i];
        const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const x0 = i * sx, y0 = j * sy;
        const T = [x0 + sx * ((level - a) / (b - a)), y0], R = [x0 + sx, y0 + sy * ((level - b) / (c - b))];
        const B = [x0 + sx * ((level - d) / (c - d)), y0 + sy], L = [x0, y0 + sy * ((level - a) / (d - a))];
        const sg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
        switch (idx) {
          case 1: case 14: sg(L, B); break; case 2: case 13: sg(B, R); break; case 3: case 12: sg(L, R); break;
          case 4: case 11: sg(T, R); break; case 6: case 9: sg(T, B); break; case 7: case 8: sg(L, T); break;
          case 5: sg(L, T); sg(B, R); break; case 10: sg(L, B); sg(T, R); break;
        }
      }
    ctx.stroke(); ctx.globalAlpha = 1;
  };
  const unsub = subscribe((now) => { if (live.live() && (opts.gate ? opts.gate() : true)) draw(now); }, () => 24);
  requestAnimationFrame(draw);
  return () => { unsub(); ro.disconnect(); };
}

/* =====================================================================
   The chequered dissolve — draws into a <canvas class="checker"> the component renders
   ===================================================================== */
export function checker(c, carry) {
  const ctx = c.getContext("2d");
  const P = getPalette();
  const noise = (x, y) => { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  let progress = 0;
  const render = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2), width = c.clientWidth, height = c.clientHeight;
    if (!width || !height) return;
    if (c.width !== Math.round(width * ratio)) { c.width = Math.round(width * ratio); c.height = Math.round(height * ratio); }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, width, height);
    const cell = 24, surface = rgba(carry === "light" ? P.bg : P.black), accent = rgba(P.accent);
    const columns = Math.ceil(width / cell), rows = Math.ceil(height / cell), lift = progress * 2;
    for (let y = 0; y < rows; y++) {
      const depth = y / Math.max(1, rows - 1) + lift;
      if (depth > 1) break;
      const solid = depth <= 0.16, fade = clamp01(1 - (depth - 0.16) / 0.84);
      if (!solid && fade <= 0) break;
      for (let x = 0; x < columns; x++) {
        if (!solid) { if ((x + y) % 2 !== 0) continue; if (noise(x, y) > fade) continue; }
        ctx.fillStyle = !solid && noise(x + 101, y + 57) < 0.06 ? accent : surface;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  };
  addScrub(c, "top_bottom", "top_top", (p) => { progress = p; render(); }, CFG.TRIGGER);
  new ResizeObserver(render).observe(c);
}
