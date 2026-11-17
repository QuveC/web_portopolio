/* =====================================================================
   3 · The year so far — circuit lap, halftone, reticle
   ===================================================================== */
import { $, $$, CFG, REDUCED, Spring, getPalette, mixc, onceInView, rgba, rise, split, subscribe, tracker } from "./engine.js";

export const LAP_CENTRELINE = "M813.87 936.41L803.19 936.95L794.47 942.82L576.98 1105.84L561.86 1106.02L553.67 1093.21L563.46 1063.13L641.23 905.8L680.74 855.61L755.85 779.8L801.76 714.66L827.57 687.79L841.09 679.42L896.62 660.91L919.94 648.1L958.56 619.62L1031.17 556.8L1075.48 527.26L1197.39 474.22L1296.52 411.93L1710.49 202.81L1720.63 199.97L1736.12 202.64L1745.73 215.27L1747.51 230.93L1738.07 249.8L1703.9 275.25L1689.66 291.09L1683.97 311.38L1687.71 326.86L1702.12 342.34L1741.63 358.18L1754.62 367.08L1774.73 415.67L1837.38 464.43L1874.58 535.09L1875.29 545.59L1868.53 560L1856.96 570.86L1847.17 574.95L1825.99 574.24L1812.29 566.05L1801.61 554.31L1775.45 520.85L1754.98 503.59L1730.6 493.44L1699.27 491.66L1613.85 520.32L1445.49 568.55L1428.94 581.89L1417.55 599.87L1404.73 656.46L1406.51 677.64L1413.81 697.58L1423.6 710.03L1440.86 722.67L1484.64 741.89L1621.32 786.38L1664.75 806.67L1684.86 823.94L1694.47 848.32L1694.11 864.34L1682.37 910.43L1683.08 926.27L1690.02 940.68L1709.42 958.48L1776.87 990.87L1804.1 1007.6L1819.94 1021.66L1829.02 1040.88L1829.19 1051.38L1822.25 1065.62L1782.92 1122.75L1762.81 1147.49L1748.75 1155.14L1711.91 1157.63L1680.94 1150.51L1620.97 1129.33L1579.14 1106.02L1549.78 1082.88L1523.44 1056.54L1403.66 906.69L1375.19 882.49L1343.51 862.91L1288.34 843.69L1246.51 837.82L1194.37 846.36L1067.47 901.53L991.48 925.38L914.24 943.89L903.74 943.53L890.39 934.99L883.81 904.2L876.69 896.37L866.37 894.59L838.07 910.61L813.87 936.41";
export const LAP_LENGTH = 4805.57;
export const FLAG_DIAMONDS = "M807.78 899.17L813.85 905.24L807.78 911.31L801.71 905.24ZM822.21 902.21L828.28 908.28L822.21 914.35L816.14 908.28ZM807.02 915.88L813.09 921.95L807.02 928.02L800.95 921.95ZM821.45 915.88L827.52 921.95L821.45 928.02L815.38 921.95ZM835.87 915.88L841.94 921.95L835.87 928.02L829.8 921.95ZM826.0 931.82L832.07 937.89L826.0 943.96L819.93 937.89ZM838.91 931.82L844.98 937.89L838.91 943.96L832.84 937.89Z";
const MAP = { width: 2560, height: 1440, band: 11.67 };
const ART_SX = 2560 / 1438.43, ART_SY = (1440 - 11.67 * 2) / 796;
const mapToArtboard = (x, y) => [x / ART_SX, (y - 11.67) / ART_SY + 2];
const artboardToMap = (x, y) => [x * ART_SX, 11.67 + (y - 2) * ART_SY];
export const HUB = { x: 1278.48, y: 699.5 };
export const TURNS = [[1349.96, 351.98, 73.5], [1862.23, 611.24, 30.5], [1732.95, 903.82, 89.5], [585.43, 916.65, 17.5]];
export const CORNER_MARKS = [[65.29, 76.96], [2471.93, 76.96], [65.29, 931.81], [2471.93, 931.81], [65.29, 1343.3], [1155.49, 1343.3], [1384.77, 1343.3]];
const MARKER_XY = [[328.9, 510.6], [758.4, 193.2], [1046.6, 338.9], [973.7, 503.3]];

/* the lap, resampled at 3 units in the artboard */
const CIRCUIT = (() => {
  const raw = LAP_CENTRELINE.match(/-?[\d.]+/g).map(Number);
  const pts = []; for (let i = 0; i < raw.length; i += 2) pts.push(mapToArtboard(raw[i], raw[i + 1]));
  const out = [pts[0]]; let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i]; const len = Math.hypot(bx - ax, by - ay);
    let d = 3 - carry;
    while (d <= len) { out.push([ax + ((bx - ax) * d) / len, ay + ((by - ay) * d) / len]); d += 3; }
    carry = len - (d - 3);
  }
  out.push(pts[pts.length - 1]);
  return out;
})();
const CUM = CIRCUIT.reduce((acc, p, i) => { if (i === 0) return [0]; const q = CIRCUIT[i - 1]; acc.push(acc[i - 1] + Math.hypot(p[0] - q[0], p[1] - q[1])); return acc; }, []);
const TOTAL = CUM[CUM.length - 1];
const TIME_AT = (() => {
  const n = CIRCUIT.length, turn = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    const [ax, ay] = CIRCUIT[i - 1], [bx, by] = CIRCUIT[i], [cx, cy] = CIRCUIT[i + 1];
    const ux = bx - ax, uy = by - ay, vx = cx - bx, vy = cy - by, l = (Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1);
    turn[i] = Math.acos(Math.min(1, Math.max(-1, (ux * vx + uy * vy) / l)));
  }
  const sm = turn.map((_, i) => { let s = 0, k = 0; for (let j = Math.max(0, i - 6); j <= Math.min(n - 1, i + 6); j++) { s += turn[j]; k++; } return s / k; });
  const acc = [0];
  for (let i = 1; i < n; i++) acc.push(acc[i - 1] + (CUM[i] - CUM[i - 1]) * (1 + 9 * sm[i]));
  return acc.map((v) => v / (acc[n - 1] || 1));
})();
const MARKERS = MARKER_XY.map(([x, y]) => { let best = 0, bd = Infinity; CIRCUIT.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = i; } }); return { x, y, d: CUM[best] }; });
const distanceAtTime = (time) => {
  if (time <= 0) return 0; if (time >= 1) return TOTAL;
  let lo = 0, hi = TIME_AT.length - 1;
  while (lo < hi - 1) { const mid = (lo + hi) >> 1; if (TIME_AT[mid] <= time) lo = mid; else hi = mid; }
  const r = (time - TIME_AT[lo]) / (TIME_AT[hi] - TIME_AT[lo] || 1);
  return CUM[lo] + (CUM[hi] - CUM[lo]) * r;
};
const TRACK_BOX = (() => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const [x, y] of CIRCUIT) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } return { x: a - 46, y: b - 46, width: c - a + 92, height: d - b + 92 }; })();

/* the map artwork, as SVG markup */
export const MAP_SVG = `
  <defs><mask id="flagcut" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="10560" height="9440">
    <rect x="-4000" y="-4000" width="10560" height="9440" fill="#fff"/>
    <rect x="-18" y="-20" width="36" height="40" fill="#000" transform="translate(822.96 921.57) rotate(144)"/></mask></defs>
  <g id="grid" fill="none">
    ${[645.31, 1276.96, 1908.61].map((x) => `<line class="axis" x1="${x}" y1="-4000" x2="${x}" y2="5440"/>`).join("")}
    <line class="axis" x1="-4000" y1="697.98" x2="6560" y2="697.98"/>
    <circle cx="${HUB.x}" cy="${HUB.y}" r="69.85" stroke="var(--map-grid)" stroke-width="3.04"/>
    <circle cx="${HUB.x}" cy="${HUB.y}" r="356.06" stroke="var(--map-grid-ghost)" stroke-width="2.13"/>
    <circle cx="${HUB.x}" cy="${HUB.y}" r="442.61" stroke="var(--map-grid-ghost)" stroke-width="2.13"/>
    <circle class="ping" cx="${HUB.x}" cy="${HUB.y}" r="10.63" stroke="var(--accent)" stroke-width="2.13"/>
    ${CORNER_MARKS.map(([x, y]) => `<rect x="${x - 8.35}" y="${y - 8.35}" width="16.7" height="16.7" fill="var(--map-mark)"/>`).join("")}
    <circle cx="${HUB.x}" cy="${HUB.y}" r="10.63" fill="var(--map-mark)"/>
  </g>
  <g mask="url(#flagcut)" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${LAP_CENTRELINE}" stroke="var(--foreground-on-dark)" stroke-width="10.5"/>
    <path class="lapfill" d="${LAP_CENTRELINE}" stroke="var(--accent)" stroke-width="10.5" stroke-dasharray="${LAP_LENGTH} ${LAP_LENGTH + 60}" stroke-dashoffset="${LAP_LENGTH}"/>
  </g>
  <g id="markers">${TURNS.map(([x, y, a]) => `<polygon points="13.69,0 -6.85,11.86 -6.85,-11.86" fill="var(--accent)" transform="translate(${x} ${y}) rotate(${a})"/>`).join("")}
    <path d="${FLAG_DIAMONDS}" fill="var(--map-mark)"/></g>`;

export function initSeason(season) {
  const PALETTE = getPalette();
  const stage = $(".stage", season), frame = $(".stage-frame", season);
  const fit = () => {
    const w = frame.clientWidth, h = frame.clientHeight;
    if (w >= 1024) { const s = Math.max(w / 1440, h / 800); stage.style.transform = `translate(${(w - 1440 * s) / 2}px, ${(h - 800 * s) / 2}px) scale(${s})`; }
    else { const s = w / TRACK_BOX.width, cx = TRACK_BOX.x + TRACK_BOX.width / 2, cy = TRACK_BOX.y + TRACK_BOX.height / 2;
      stage.style.transform = `translate(${w / 2 - cx * s}px, ${h * 0.5 - cy * s}px) scale(${s})`; }
  };
  new ResizeObserver(fit).observe(frame); fit();

  // copy reveals
  const heads = $$(".hl", season).map((el) => split(el, { stagger: 110 }));
  const stop = rise($(".season-head .stop", season), { y: null, delay: 130 + 110 });
  const rule = rise($(".rule", season), { axis: "x", delay: 260 });
  const intro = split($(".season-intro", season), { stagger: 34, cfg: CFG.COPY2, gap: 0.22 });
  onceInView($(".season-head", season), () => { heads.forEach((h, i) => h.play(i * 130)); stop.play(); rule.play(); intro.play(2 * 130 + 90); });
  const plate = rise($(".splate", season), { delay: 260 });
  const b1 = split($(".b1", season), { mode: "letters", stagger: 22, cfg: CFG.TYPE });
  const b2 = split($(".b2", season), { mode: "letters", stagger: 22, cfg: CFG.TYPE });
  const rows = $$(".splate-stats > div", season).map((r) => [split($("dt", r), { mode: "letters", stagger: 22, cfg: CFG.TYPE }), split($("dd", r), { mode: "letters", stagger: 22, cfg: CFG.TYPE })]);
  onceInView($(".splate", season), () => { plate.play(); b1.play(430); b2.play(490); rows.forEach(([a, b], i) => { a.play(430 + i * 110); b.play(500 + i * 110); }); }, "0px");

  // loops: grid crawl, ping, globe — paused off screen
  const live = tracker(season); const axes = $$(".axis", season), ping = $(".ping", season), meridian = $(".meridian", season);
  axes.forEach((a) => { a.setAttribute("stroke", "var(--map-grid)"); a.setAttribute("stroke-width", "2.13"); a.setAttribute("stroke-dasharray", "12.15 8.35"); });
  let clock = 0, lastT = 0;
  subscribe((t) => {
    const dt = lastT ? Math.min(100, t - lastT) : 0; lastT = t;
    if (!live.live() || REDUCED) return;
    clock += dt;
    const drift = ((clock % 7000) / 7000) * 20.5;
    axes.forEach((a) => a.setAttribute("stroke-dashoffset", (-drift).toFixed(2)));
    const v = (clock % 4200) / 4200, e = 1 - (1 - v) * (1 - v);
    ping.setAttribute("r", (10.63 + e * 86).toFixed(2)); ping.setAttribute("opacity", (0.4 * (1 - e) ** 2).toFixed(3));
    meridian.setAttribute("rx", Math.max(0.5, Math.abs(Math.cos(((clock % 10000) / 10000) * Math.PI * 2)) * 18).toFixed(2));
  });

  // the trace canvas
  const trace = $(".trace", season), tctx = trace.getContext("2d");
  const RATIO = matchMedia("(hover: none) and (pointer: coarse)").matches ? 1 : Math.min(devicePixelRatio || 1, 2);
  trace.width = 1440 * RATIO; trace.height = 800 * RATIO;
  const lapFill = $(".lapfill", season);
  const CUT = mapToArtboard(822.96, 921.57), CUT_SCALE = 1438.43 / 2560;
  let heat = 1, lapP = 0;
  const trailUpTo = (dist) => { const out = []; for (let i = 0; i < CIRCUIT.length; i++) { if (CUM[i] <= dist) { out.push(CIRCUIT[i]); continue; } const a = CIRCUIT[i - 1], b = CIRCUIT[i], r = (dist - CUM[i - 1]) / (CUM[i] - CUM[i - 1]); out.push([a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]); break; } return out; };
  const stroke = (pts, from = 0) => { tctx.beginPath(); tctx.moveTo(pts[from][0], pts[from][1]); for (let i = from + 1; i < pts.length; i++) tctx.lineTo(pts[i][0], pts[i][1]); tctx.stroke(); };
  const render = () => {
    const distance = distanceAtTime(lapP), pts = trailUpTo(distance);
    lapFill.setAttribute("stroke-dashoffset", (LAP_LENGTH * (1 - distance / TOTAL)).toFixed(2));
    tctx.setTransform(RATIO, 0, 0, RATIO, 0, 0); tctx.clearRect(0, 0, 1440, 800);
    if (pts.length > 1) {
      tctx.lineCap = "round"; tctx.lineJoin = "round";
      tctx.save(); tctx.globalCompositeOperation = "lighter";
      tctx.strokeStyle = rgba(PALETTE.accent, 0.05); tctx.lineWidth = 15; stroke(pts);
      tctx.strokeStyle = rgba(PALETTE.accent, 0.1); tctx.lineWidth = 15 * 0.45; stroke(pts);
      tctx.restore();
      const head = Math.max(2, Math.round(210 / 3)), from = Math.max(0, pts.length - head), tip = pts[pts.length - 1];
      const hot = tctx.createLinearGradient(pts[from][0], pts[from][1], tip[0], tip[1]);
      hot.addColorStop(0, rgba(PALETTE.accent, 0)); hot.addColorStop(0.45, rgba(PALETTE.accent, 0.9)); hot.addColorStop(1, rgba(mixc(PALETTE.accent, PALETTE.bright, heat), 1));
      tctx.strokeStyle = hot; tctx.lineWidth = 5.9; stroke(pts, from);
      const coreFrom = Math.max(0, pts.length - Math.round(head * 0.42));
      if (pts.length - coreFrom > 1) {
        const core = tctx.createLinearGradient(pts[coreFrom][0], pts[coreFrom][1], tip[0], tip[1]);
        core.addColorStop(0, rgba(PALETTE.bright, 0)); core.addColorStop(1, rgba(PALETTE.white, 0.95 * heat));
        tctx.strokeStyle = core; tctx.lineWidth = 5.9 * 0.38; stroke(pts, coreFrom);
      }
      const [tx, ty] = tip; tctx.save(); tctx.globalCompositeOperation = "lighter";
      const spark = tctx.createRadialGradient(tx, ty, 0, tx, ty, 5.9 * 2.6);
      spark.addColorStop(0, rgba(PALETTE.white, 0.85 * heat)); spark.addColorStop(0.35, rgba(PALETTE.bright, 0.4 * heat)); spark.addColorStop(1, rgba(PALETTE.accent, 0));
      tctx.fillStyle = spark; tctx.beginPath(); tctx.arc(tx, ty, 5.9 * 2.6, 0, Math.PI * 2); tctx.fill(); tctx.restore();
    }
    tctx.save(); tctx.translate(CUT[0], CUT[1]); tctx.rotate((144 * Math.PI) / 180);
    tctx.clearRect((-36 * CUT_SCALE) / 2, (-40 * CUT_SCALE) / 2, 36 * CUT_SCALE, 40 * CUT_SCALE); tctx.restore();
    for (const m of MARKERS) {
      if (distance < m.d) continue;
      const age = Math.min(1, (distance - m.d) / 90), radius = 12 + (1 - age) * 14;
      const g = tctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, radius);
      g.addColorStop(0, rgba(PALETTE.bright, 0.5 + 0.45 * (1 - age))); g.addColorStop(0.45, rgba(PALETTE.accent, 0.32)); g.addColorStop(1, rgba(PALETTE.accent, 0));
      tctx.save(); tctx.globalCompositeOperation = "lighter"; tctx.fillStyle = g; tctx.beginPath(); tctx.arc(m.x, m.y, radius, 0, Math.PI * 2); tctx.fill(); tctx.restore();
      if (age < 1) { tctx.strokeStyle = rgba(PALETTE.bright, (1 - age) * 0.6); tctx.lineWidth = 1; tctx.beginPath(); tctx.arc(m.x, m.y, 9 + age * 20, 0, Math.PI * 2); tctx.stroke(); }
    }
  };
  render();
  const sineInOut = (u) => -(Math.cos(Math.PI * u) - 1) / 2, cubicOut = (u) => 1 - (1 - u) ** 3;
  const io = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    new Spring(0, { duration: REDUCED ? 1 : 6000, easing: sineInOut }, (p) => {
      lapP = p; render();
      if (p >= 1) new Spring(1, { duration: REDUCED ? 1 : 800, easing: cubicOut }, (h) => { heat = h; render(); if (h <= 0) halftone.arm(); }).to(0);
    }).to(1);
  }, { threshold: 0.35 });
  io.observe(frame);

  // the halftone: a procedural landmass on the map's lattice, lit by a reticle
  const halftone = (() => {
    const L = { pitchX: 7.8, pitchY: 7.7, originX: 5, originY: 16.64 }, R = 1.75;
    const hash = (x, y) => { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
    const vn = (x, y) => { const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
      return (hash(i, j) * (1 - u) + hash(i + 1, j) * u) * (1 - v) + (hash(i, j + 1) * (1 - u) + hash(i + 1, j + 1) * u) * v; };
    const W = 328, H = 186;
    const cell = new Int32Array(W * H).fill(-1), xs = [], cols = [], rws = [];
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const x = L.originX + i * L.pitchX, y = L.originY + j * L.pitchY;
      const n = vn(x / 360, y / 360) * 0.65 + vn(x / 140 + 9, y / 140 + 3) * 0.35;
      const edge = Math.min(x / 2560, 1 - x / 2560, y / 1440, 1 - y / 1440);
      if (n - (edge < 0.08 ? (0.08 - edge) * 3 : 0) > 0.56) { cell[j * W + i] = cols.length; xs.push(x, y); cols.push(i); rws.push(j); }
    }
    const count = cols.length, level = new Float32Array(count), active = new Int32Array(count), inList = new Uint8Array(count);
    let activeCount = 0, armed = false, dirty = true;
    const canvas = $(".dots", season), ctx = canvas.getContext("2d"), baked = document.createElement("canvas");
    const MAXR = matchMedia("(hover: none) and (pointer: coarse)").matches ? 1 : 2;
    const bake = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      const r = Math.min(devicePixelRatio || 1, MAXR);
      canvas.width = baked.width = Math.round(w * r); canvas.height = baked.height = Math.round(h * r);
      const b = baked.getContext("2d"), s = baked.width / 2560;
      b.setTransform(s, 0, 0, s, 0, 0); b.fillStyle = rgba(PALETTE.dot); b.beginPath();
      for (let i = 0; i < count; i++) { b.moveTo(xs[i * 2] + R, xs[i * 2 + 1]); b.arc(xs[i * 2], xs[i * 2 + 1], R, 0, Math.PI * 2); }
      b.fill(); dirty = true; draw();
    };
    const add = (i, v) => { if (v <= 0.02) return; if (v > level[i]) level[i] = v; if (!inList[i]) { inList[i] = 1; active[activeCount++] = i; } };
    const pointer = { x: 0, y: 0, heat: 0 }, target = { x: 0, y: 0, on: false }; let spread = 0;
    const falloff = (t) => (t >= 1 ? 0 : (1 - t) ** 2);
    const lightUp = () => {
      if (pointer.heat <= 0.01) return;
      const ci = Math.round((pointer.x - L.originX) / L.pitchX), cj = Math.round((pointer.y - L.originY) / L.pitchY);
      const arm = 0.82 * pointer.heat, reach = 420 * spread;
      if (reach > 1 && cj >= 0 && cj < H) { const span = Math.ceil(reach / L.pitchX); for (let i = Math.max(0, ci - span); i <= Math.min(W - 1, ci + span); i++) { const k = cell[cj * W + i]; if (k >= 0) add(k, (1 - Math.abs(xs[k * 2] - pointer.x) / reach) * arm); } }
      if (reach > 1 && ci >= 0 && ci < W) { const span = Math.ceil(reach / L.pitchY); for (let j = Math.max(0, cj - span); j <= Math.min(H - 1, cj + span); j++) { const k = cell[j * W + ci]; if (k >= 0) add(k, (1 - Math.abs(xs[k * 2 + 1] - pointer.y) / reach) * arm); } }
      const rc = 54, i0 = Math.floor((pointer.x - rc - L.originX) / L.pitchX), i1 = Math.ceil((pointer.x + rc - L.originX) / L.pitchX);
      const j0 = Math.floor((pointer.y - rc - L.originY) / L.pitchY), j1 = Math.ceil((pointer.y + rc - L.originY) / L.pitchY);
      for (let j = Math.max(0, j0); j <= Math.min(H - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(W - 1, i1); i++) {
        const k = cell[j * W + i]; if (k < 0) continue; add(k, falloff(Math.hypot(xs[k * 2] - pointer.x, xs[k * 2 + 1] - pointer.y) / rc) * pointer.heat);
      }
    };
    const draw = () => {
      if (!canvas.width) return;
      const s = canvas.width / 2560; ctx.setTransform(s, 0, 0, s, 0, 0); ctx.clearRect(0, 0, 2560, 1440); ctx.drawImage(baked, 0, 0, 2560, 1440);
      const th = 0.34, span = 1 - th, box = R * 2 + 1; let drew = 0;
      for (let k = 0; k < activeCount; k++) { const i = active[k]; if (level[i] < th) continue; ctx.clearRect(xs[i * 2] - R - 0.5, xs[i * 2 + 1] - R - 0.5, box, box); drew++; }
      if (!drew) return;
      for (let k = 0; k < activeCount; k++) {
        const i = active[k], v = level[i]; if (v < th || (cols[i] + rws[i]) & 1) continue;
        const t = Math.min(1, (v - th) / span), side = L.pitchX * (0.7 + 0.3 * t);
        ctx.fillStyle = rgba(v > 0.8 ? PALETTE.white : v > 0.5 ? PALETTE.bright : mixc(PALETTE.accent, PALETTE.bright, v));
        ctx.fillRect(xs[i * 2] - side / 2, xs[i * 2 + 1] - side / 2, side, side);
      }
    };
    const approach = (a, b, dt, tau) => b + (a - b) * Math.exp(-dt / tau);
    let last = 0;
    const frame = () => {
      const now = performance.now(), dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
      const wanted = target.on && armed ? 0.95 : 0;
      if (pointer.heat <= 0.001 && wanted > 0) { pointer.x = target.x; pointer.y = target.y; }
      else if (dt > 0) {
        const px0 = pointer.x, py0 = pointer.y;
        pointer.x = approach(px0, target.x, dt, 0.07); pointer.y = approach(py0, target.y, dt, 0.07);
        const speed = Math.hypot(pointer.x - px0, pointer.y - py0) / dt, want = Math.max(0, 1 - speed / 900);
        spread = approach(spread, want, dt, want > spread ? 0.38 : 0.09);
      }
      pointer.heat = approach(pointer.heat, wanted, dt || 0.016, wanted > pointer.heat ? 0.14 : 0.3);
      if (pointer.heat < 0.005) { pointer.heat = 0; spread = 0; }
      const decay = Math.exp(-dt / 0.3); let write = 0;
      for (let k = 0; k < activeCount; k++) { const i = active[k], v = level[i] * decay; if (v > 0.02) { level[i] = v; active[write++] = i; } else { level[i] = 0; inList[i] = 0; } }
      const before = activeCount; activeCount = write;
      lightUp();
      if (activeCount === 0 && before === 0 && !dirty) return;
      dirty = false; draw();
    };
    new ResizeObserver(bake).observe(canvas);
    const canPoint = !matchMedia("(hover: none)").matches && !REDUCED;
    if (canPoint) {
      addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const sr = season.getBoundingClientRect(), on = e.clientX >= sr.left && e.clientX <= sr.right && e.clientY >= sr.top && e.clientY <= sr.bottom;
        target.on = on; if (!on) return;
        const r = canvas.getBoundingClientRect(); target.x = ((e.clientX - r.left) / r.width) * 2560; target.y = ((e.clientY - r.top) / r.height) * 1440;
      }, { passive: true });
      document.addEventListener("pointerleave", () => (target.on = false)); addEventListener("blur", () => (target.on = false));
    }
    subscribe(() => { if (live.live()) frame(); });
    return { arm: () => (armed = true) };
  })();
}
