/* =====================================================================
   The hero scene — contour field, liquid cursor reveal, burning monogram (WebGL2)
   ===================================================================== */
import { CONFIG } from "../config.js";
import { REDUCED, clamp01, getPalette } from "./engine.js";

const $ = (s, r = document) => r.querySelector(s);

export const getTier = () => {
  const coarse = matchMedia("(hover: none) and (pointer: coarse)").matches;
  const w = innerWidth;
  const name = w < 768 || (coarse && w < 1024) ? "mobile" : coarse || w < 1280 ? "tablet" : "desktop";
  const mobile = name === "mobile";
  const nav = navigator;
  const saver = Boolean(nav.connection?.saveData) || (nav.deviceMemory ?? 8) <= 2;
  return { name, mobile, coarse, maxDpr: mobile ? 1 : name === "tablet" ? 1.25 : 1.5, frameInterval: name === "desktop" ? 0 : 1000 / 60 - 2,
    pointerEnabled: !coarse && !REDUCED, trailSamples: mobile ? 28 : name === "tablet" ? 44 : 72, reveal: !mobile, freeze: REDUCED || (mobile && saver) };
};
const SWEEP = [{ x: -0.85, y: -0.62 }, { x: 0.78, y: -0.2 }, { x: -0.7, y: 0.2 }, { x: 0.82, y: 0.6 }];

const VERT = `#version 300 es
in vec2 aPos; out vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;
const FRAG = (N) => `#version 300 es
precision highp float;
#define N ${N}
in vec2 vUv; out vec4 outColor;
uniform float uTime, uAspect, uPace, uIntro, uBurn, uRevealOpacity, uRise, uLines;
uniform vec2 uTrail[N]; uniform vec2 uTrailMin, uTrailMax, uShift, uGlyphY;
uniform vec3 uBg, uLine, uInk, uAccent;
uniform sampler2D uGlyph;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+1.0), f.x), f.y); }
float field(vec2 p, float t){
  float f = sin(p.x*1.00 + t*0.60)*0.50;
  f += sin(p.y*0.85 - t*0.45)*0.45;
  f += sin((p.x+p.y)*0.65 + t*0.35)*0.35;
  f += sin((p.x-p.y)*0.95 - t*0.55)*0.25;
  return f*0.5 + 0.5; }
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p-a, ba = b-a; float h = clamp(dot(pa,ba)/max(dot(ba,ba),1e-6), 0.0, 1.0); return length(pa - ba*h); }
float revealTrail(vec2 ndc){
  float gate = smoothstep(0.06, 0.21, uPace);
  if (gate <= 0.0) return 0.0;
  vec2 b = vec2(ndc.x*uAspect, ndc.y);
  if (any(lessThan(b, uTrailMin)) || any(greaterThan(b, uTrailMax))) return 0.0;
  vec2 nuv = ndc*0.5 + 0.5;
  float nx = vnoise(nuv*8.7 + vec2(uTime*0.21, uTime*0.15));
  float ny = vnoise(nuv*12.2 - vec2(uTime*0.18, uTime*0.27));
  vec2 point = b + (vec2(nx, ny) - 0.5)*1.29*0.22;
  float radius = 0.46*mix(0.28, 1.0, uPace);
  float taper = 1.9*mix(1.6, 1.25, uPace);
  float span = max(0.64*float(N-1), 1.0);
  float tr = 0.0;
  for (int i = 0; i < N-1; i++) {
    if (float(i) >= span) break;
    float w = pow(1.0 - float(i)/span, taper);
    if (w <= tr) break;
    vec2 a = vec2(uTrail[i].x*uAspect, uTrail[i].y);
    vec2 c = vec2(uTrail[i+1].x*uAspect, uTrail[i+1].y);
    float r = radius*w;
    tr = max(tr, w*smoothstep(r, r*0.35, seg(point, a, c)));
    if (tr >= 0.085) break;
  }
  return smoothstep(0.075, 0.085, tr)*gate; }

void main(){
  vec2 ndc = vUv*2.0 - 1.0;
  vec2 p = vec2(ndc.x*uAspect, ndc.y)*3.8;
  float t = uTime*1.66;
  vec2 q = p; q.x += sin(p.y*0.8 + t*0.7)*0.37; q.y += cos(p.x*0.7 - t*0.6)*0.37;
  float scaled = field(q, t)*2.5;
  float w = max(fwidth(scaled)*1.4, 1e-5);
  float line = 1.0 - smoothstep(0.0, w, abs(fract(scaled) - 0.5));
  vec3 col = mix(uBg, uLine, line*0.85*uLines);
  float parity = mod(floor(scaled + 0.5), 2.0);
  vec3 shade = mix(vec3(0.81), vec3(0.69), parity);
  float m = revealTrail(ndc);
  if (uRevealOpacity > 0.001) col = mix(col, shade, m*uRevealOpacity);

  // the monogram
  vec2 guv = vUv + vec2(0.0, uRise) - uShift;
  vec2 g = texture(uGlyph, guv).rg;
  float burnFront = smoothstep(0.14, 1.0, uIntro);
  float burnAt = mix(1.0 - vUv.y, vnoise(vUv*vec2(uAspect,1.0)*14.0), 0.45);
  float intact = smoothstep(burnFront - 0.02, burnFront + 0.02, burnAt);
  float mask = max(m, intact)*g.r;
  float weave = mod(floor(gl_FragCoord.x/4.0) + floor(gl_FragCoord.y/4.0), 2.0);
  vec3 shell = mix(uInk, vec3(0.105, 0.115, 0.14), weave*0.6 + parity*0.4);
  float sheen = pow(max(0.0, 1.0 - abs((vUv.x + vUv.y*0.6) - (0.9 + uShift.x*20.0))*2.5), 3.0);
  shell += vec3(0.16)*sheen + uAccent*0.12*parity*m;
  col = mix(col, shell, mask);
  float edge = 4.0*intact*(1.0 - intact)*g.r;
  col = clamp(col + uAccent*edge*0.9, 0.0, 1.0);

  // the wireframe wave, crown to chin
  float vH = (guv.y - uGlyphY.x)/max(uGlyphY.y - uGlyphY.x, 1e-4);
  float wave = 0.0;
  for (int i = 0; i < 8; i++) {
    float age = mod(uTime, 1.2) + float(i)*1.2;
    if (age > 3.1) break;
    float centre = (1.0 + 0.45) - (age/3.1)*(1.0 + 0.9);
    float d = (vH - centre)/0.15;
    wave = max(wave, exp(-d*d));
  }
  float outline = g.g*(0.06 + wave*0.5)*uBurn*(1.0 - mask);
  col = mix(col, uInk, outline);
  outColor = vec4(col, 1.0);
}`;

export class HeroScene {
  constructor(canvas, section) {
    this.canvas = canvas; this.section = section;
    this.tier = getTier(); this.N = this.tier.trailSamples;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: this.tier.mobile ? "default" : "high-performance" });
    if (!gl) throw new Error("webgl2");
    this.gl = gl;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG(this.N)));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog); this.prog = prog;
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    for (const n of ["uTime", "uAspect", "uPace", "uIntro", "uBurn", "uRevealOpacity", "uRise", "uLines", "uTrail", "uTrailMin", "uTrailMax", "uShift", "uGlyphY", "uBg", "uLine", "uInk", "uAccent", "uGlyph"])
      this.u[n] = gl.getUniformLocation(prog, n);
    const c3 = (c) => c.map((v) => v / 255);
    const PALETTE = getPalette();
    gl.uniform3fv(this.u.uBg, c3(PALETTE.bg)); gl.uniform3fv(this.u.uLine, c3(PALETTE.soft));
    gl.uniform3fv(this.u.uInk, c3(PALETTE.ink)); gl.uniform3fv(this.u.uAccent, c3(PALETTE.accent));
    this.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(this.u.uGlyph, 0);
    this.trail = new Float32Array(this.N * 2);
    this.pointer = { x: 0.3, y: 0.1 }; this.smoothed = { ...this.pointer }; this.lastSmoothed = { ...this.pointer };
    this.trail.fill(0); for (let i = 0; i < this.N; i++) { this.trail[i * 2] = 0.3; this.trail[i * 2 + 1] = -0.1; }
    this.pace = 0; this.pointerSeen = false; this.intro = 0; this.readyAt = null; this.riseAt = null; this.riseStarted = false;
    this.start = null; this.settled = false; this.ready = false; this.glyphY = [0, 1]; this.revealOpacity = 1; this.sweepOn = false;
  }
  setPointer(x, y) {
    this.pointer.x = x; this.pointer.y = y;
    if (!this.pointerSeen) { this.pointerSeen = true; Object.assign(this.smoothed, { x, y }); Object.assign(this.lastSmoothed, { x, y }); }
  }
  beginRise() { this.riseStarted = true; }
  retune() { const fresh = getTier(); this.tier = { ...fresh, trailSamples: this.tier.trailSamples }; this.settled = false; this.applyFit(); return this.tier; }
  applyFit() {
    this.revealOpacity = matchMedia("(max-width:1023px)").matches ? 0 : 1;
    this.sweepOn = matchMedia("(hover: none)").matches && this.tier.reveal;
  }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, this.tier.maxDpr);
    const w = this.section.clientWidth, h = this.section.clientHeight;
    this.canvas.width = Math.max(1, Math.round(w * dpr)); this.canvas.height = Math.max(1, Math.round(h * dpr));
    this.cssW = w; this.cssH = h; this.aspect = w / h; this.dpr = dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.drawGlyph(); this.settled = false;
  }
  drawGlyph() {
    const W = this.canvas.width, H = this.canvas.height, dpr = this.dpr;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    // the box the layout gives the subject
    let box;
    const fit = $(".hero-fit", this.section);
    if (fit && fit.offsetParent !== null) {
      const s = this.section.getBoundingClientRect(), b = fit.getBoundingClientRect();
      box = { x: 0, y: (b.top - s.top) * dpr, w: W, h: b.height * dpr, wShare: 0.86 };
    } else box = { x: 0, y: H * 0.14, w: W, h: H * 0.72, wShare: 0.42 };
    const text = CONFIG.initials;
    ctx.font = `700 100px Oswald, Impact, sans-serif`;
    const m = ctx.measureText(text);
    const cap = m.actualBoundingBoxAscent || 80;
    const size = Math.min((box.h * 0.92) / cap, (box.w * box.wShare) / m.width) * 100;
    ctx.font = `700 ${size}px Oswald, Impact, sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    const capPx = (cap / 100) * size;
    const cx = box.x + box.w / 2, base = box.y + box.h / 2 + capPx / 2;
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgb(255,0,0)"; ctx.fillText(text, cx, base);
    // hatch, clipped to the letters — the "wireframe" the wave scans
    const hatch = document.createElement("canvas"); hatch.width = W; hatch.height = H;
    const hx = hatch.getContext("2d");
    hx.strokeStyle = "rgb(0,140,0)"; hx.lineWidth = Math.max(1, dpr * 0.8);
    const step = 7 * dpr; hx.beginPath();
    for (let x = -H; x < W; x += step) { hx.moveTo(x, 0); hx.lineTo(x + H, H); }
    hx.stroke();
    hx.globalCompositeOperation = "destination-in"; hx.font = ctx.font; hx.textAlign = "center"; hx.fillText(text, cx, base);
    ctx.drawImage(hatch, 0, 0);
    ctx.strokeStyle = "rgb(0,255,0)"; ctx.lineWidth = Math.max(1, 1.25 * dpr); ctx.strokeText(text, cx, base);
    this.glyphY = [1 - base / H, 1 - (base - capPx) / H];
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  }
  update(time) {
    if (this.settled) return;
    if (this.start === null) this.start = time;
    const t = (time - this.start) / 1000;
    if (this.tier.freeze && this.intro >= 1 && this.ready) this.settled = true;
    if (this.ready) { if (this.readyAt === null) this.readyAt = t; this.intro = this.tier.freeze ? 1 : Math.min(1, (t - this.readyAt) / 4); }
    // idle sweep stands in for a cursor on touch screens
    let sweeping = false;
    if (this.sweepOn && this.intro >= 1 && !this.tier.freeze) {
      const cycle = t % 5, slot = 0.45, leg = Math.floor(cycle / slot);
      if (leg < 3) {
        sweeping = true;
        const local = Math.min(1, (cycle - leg * slot) / slot), e = 1 - (1 - local) * (1 - local);
        const a = SWEEP[leg], b = SWEEP[leg + 1];
        this.pointer.x = (a.x + (b.x - a.x) * e) * 0.76; this.pointer.y = (a.y + (b.y - a.y) * e) * 0.76;
      }
    }
    const s = this.smoothed;
    s.x += (this.pointer.x - s.x) * 0.17; s.y += (this.pointer.y - s.y) * 0.17;
    const step = Math.hypot(s.x - this.lastSmoothed.x, s.y - this.lastSmoothed.y);
    if (this.tier.pointerEnabled || sweeping || this.sweepOn) {
      const target = Math.min(1, step / 0.029);
      this.pace += (target - this.pace) * (target > this.pace ? 0.09 : 0.205);
    }
    if (!this.tier.reveal && this.intro >= 1) this.pace = 0;
    this.lastSmoothed.x = s.x; this.lastSmoothed.y = s.y;
    this.trail.copyWithin(2, 0, (this.N - 1) * 2); this.trail[0] = s.x; this.trail[1] = -s.y;
    // bounds of the samples the shader visits
    const active = Math.min(this.N, Math.ceil(0.64 * (this.N - 1)) + 1), margin = 0.46 + 1.29 * 0.22 + 0.05;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < active; i++) {
      const x = this.trail[i * 2] * this.aspect, y = this.trail[i * 2 + 1];
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    // rise into place: 200 CSS px over 2s, ease-out quad
    let remaining = this.tier.freeze ? 0 : 1;
    if (this.riseStarted && !this.tier.freeze) { if (this.riseAt === null) this.riseAt = t; const u = Math.min(1, (t - this.riseAt) / 2); remaining = (1 - u) * (1 - u); }
    const burnSpan = clamp01((this.intro - 0.14) / 0.86), burn = burnSpan * burnSpan * (3 - 2 * burnSpan);
    const gl = this.gl, u = this.u;
    gl.uniform1f(u.uTime, t * 1.25); gl.uniform1f(u.uAspect, this.aspect); gl.uniform1f(u.uPace, this.pace);
    gl.uniform1f(u.uIntro, this.intro); gl.uniform1f(u.uBurn, burn); gl.uniform1f(u.uRevealOpacity, this.revealOpacity);
    gl.uniform1f(u.uRise, -(remaining * 200) / this.cssH); gl.uniform1f(u.uLines, 1);
    gl.uniform2fv(u.uTrail, this.trail); gl.uniform2f(u.uTrailMin, minX - margin, minY - margin); gl.uniform2f(u.uTrailMax, maxX + margin, maxY + margin);
    gl.uniform2f(u.uShift, s.x * 0.01, -s.y * 0.01); gl.uniform2f(u.uGlyphY, this.glyphY[0], this.glyphY[1]);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
