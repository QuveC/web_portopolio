import { useLayoutEffect, useRef } from "react";
import { CONFIG } from "../config.js";
import { $, $$, rise, split, subscribe, tracker, contourField, getPalette, rgba } from "../lib/engine.js";
import { HeroScene } from "../lib/heroScene.js";
import { whenVeil } from "./Veil.jsx";
import Menu from "./Menu.jsx";
import { Arrow, Corners, ICONS, Logo } from "./ui.jsx";

const ext = (href) => (href.startsWith("#") ? {} : { target: "_blank", rel: "noopener" });

export default function Hero() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const hero = ref.current;
    if (hero.dataset.armed) return;
    hero.dataset.armed = "1";

    /* hero entrance, armed for the veil's handover */
    const masthead = rise($(".masthead", hero), { y: "1.25rem" });
    const handle = rise($(".handle", hero), { y: null, delay: 180 });
    const name = split($(".name", hero), { stagger: 110 });
    const metas = $$(".meta li", hero).map((li, i) => rise(li, { delay: 180 + 260 + i * 130 }));
    const panels = rise($(".panels", hero), { y: "1.25rem", delay: 900 });
    const figs = $$(".stats dd", hero).map((dd, i) => ({ s: split(dd, { mode: "letters", stagger: 26, cfg: { tension: 200, friction: 24 } }), d: i * 90 }));
    const actions = rise($(".actions", hero), { y: "1.25rem", delay: 1500 });
    const heroIn = () => {
      masthead.play(0); handle.play(0); name.play(180); metas.forEach((m) => m.play(0));
      panels.play(0); figs.forEach(({ s, d }) => s.play(900 + d)); actions.play(0);
    };

    (async () => {
      const canvas = $(".hero-canvas", hero);
      let scene = null;
      const fontReady = Promise.race([document.fonts.load("700 100px Oswald"), new Promise((r) => setTimeout(r, 3000))]).catch(() => {});
      try { scene = new HeroScene(canvas, hero); } catch (err) { console.warn("Hero WebGL unavailable:", err); }
      await fontReady;
      if (!scene) {
        const fallback = document.createElement("canvas"); fallback.className = "hero-canvas"; fallback.setAttribute("aria-hidden", "true");
        canvas.replaceWith(fallback);
        const P = getPalette();
        contourField(fallback, rgba(P.soft), hero, { fill: rgba(P.bg), gate: () => scrollY <= innerHeight * 1.15 });
        whenVeil((v) => v.ready(heroIn));
        return;
      }
      scene.applyFit(); scene.resize();
      let pointerBound = false;
      const onMove = (e) => scene.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
      const bindPointer = () => { const want = scene.tier.pointerEnabled; if (want && !pointerBound) addEventListener("pointermove", onMove, { passive: true }); if (!want && pointerBound) removeEventListener("pointermove", onMove); pointerBound = want; };
      bindPointer();
      const live = tracker(hero);
      subscribe((t) => { if (!document.hidden && live.live() && scrollY <= innerHeight * 1.15) scene.update(t); }, () => scene.tier.frameInterval);
      let lastW = innerWidth, pending = 0;
      new ResizeObserver(() => { cancelAnimationFrame(pending); pending = requestAnimationFrame(() => {
        if (scene.tier.coarse && innerWidth === lastW) return; // iOS URL bar: height only
        if (innerWidth !== lastW) { lastW = innerWidth; scene.retune(); bindPointer(); }
        scene.applyFit(); scene.resize();
      }); }).observe(hero);
      matchMedia("(hover: none) and (pointer: coarse)").addEventListener("change", () => { scene.retune(); bindPointer(); });
      scene.update(performance.now());
      scene.ready = true;
      whenVeil((v) => v.ready(() => { scene.beginRise(); heroIn(); }));
    })();
  }, []);

  const C = CONFIG;
  return (
    <section data-hero id="top" aria-label="Introduction" ref={ref}>
      <canvas className="hero-canvas" aria-hidden="true" />
      <div className="hero-fit" aria-hidden="true" />
      <div className="hero-ramp" aria-hidden="true" />
      <div className="hero-content">
        <header className="masthead">
          <Logo />
          <nav className="nav-primary" aria-label="Primary">
            <ul>{C.nav.map(([l, h]) => <li key={h}><a className="hov" href={h}>{l}</a></li>)}</ul>
          </nav>
          <a className="garage hov" href={C.navCta[1]} {...ext(C.navCta[1])}>
            <span aria-hidden="true">[ </span>{C.navCta[0]}<span aria-hidden="true"> → ]</span>
          </a>
          <Menu />
        </header>
        <div className="hero-mid">
          <div className="identity">
            <div>
              <span className="handle">{C.handle}</span>
              <h1 className="name">{`${C.first} ${C.last}`}</h1>
            </div>
            <ul className="meta">{C.meta.map(([i, l]) => <li key={l}>{ICONS[i]}<span>{l}</span></li>)}</ul>
          </div>
          <div className="panels" data-hero-panels>
            <div className="bpanel"><Corners />
              <p className="eyebrow">{C.now.eyebrow}</p>
              <dl className="now-list">
                <dt>{C.now.title}</dt><dd>{C.now.line}</dd>
                {C.now.date && <dd><time dateTime={C.now.datetime}>{C.now.date}</time></dd>}
              </dl>
              <svg className="now-mark" viewBox="0 0 78 50" aria-hidden="true"><path d="M2 40 L18 12 L30 30 L44 6 L58 26 L76 18" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="76" cy="18" r="3" fill="var(--accent)" /></svg>
            </div>
            <div className="bpanel"><Corners />
              <p className="eyebrow">Stats</p>
              <dl className="stats" data-hero-stats>{C.stats.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </div>
          </div>
        </div>
        <div className="actions">
          <a className="trailer" href={C.cv.href} target="_blank" rel="noopener">
            <svg viewBox="0 0 32 32" style={{ width: "2rem", height: "2rem" }} aria-hidden="true"><circle cx="16" cy="16" r="15.5" fill="none" stroke="currentColor" /><path d="M16 9v12M11 16l5 5 5-5" fill="none" stroke="currentColor" /></svg>
            <span><b>{C.cv.label}</b><small>{C.cv.meta}</small></span>
          </a>
          <a className="cta cta--hero" href={C.primaryCta[1]}>
            <svg className="cta-frame" viewBox="0 0 220 50" preserveAspectRatio="none" aria-hidden="true">
              <path className="cta-body" d="M220 42L212.932 50H0V0H220V42Z" /><path className="cta-flood" d="M220 42L212.932 50H0V0H220V42Z" />
              <path className="cta-ring" d="M220 42L212.932 50H0V0H220V42Z" />
              <path className="cta-brackets" d="M205 49.5H213L219.5 42V36M212 0.5H219.5V7M8 0.5H0.5V7M7.5 49.5H0.5V42.5" />
            </svg>
            <span className="cta-label">{C.primaryCta[0]}<Arrow /></span>
          </a>
          <ul className="socials">{C.socials.map(([l, h]) => <li key={l}><a className="hov" href={h} target="_blank" rel="noopener">{l}</a></li>)}</ul>
        </div>
      </div>
    </section>
  );
}
