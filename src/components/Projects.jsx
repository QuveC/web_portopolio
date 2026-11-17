import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CONFIG, PROJECTS } from "../config.js";
import { $, $$, CFG, REDUCED, addScrub, checker, contourField, getPalette, onceInView, rgba, rise, split } from "../lib/engine.js";
import Lightbox, { pad } from "./Lightbox.jsx";
import { Arrow, Corners, Headline, PlateOutline, chamfer } from "./ui.jsx";

/* the dark stepped plate holding a project's cover screen */
function Cover({ p, n, big = false }) {
  const s = p.screens[(p.cover || 1) - 1];
  return (
    <div className={`proj-plate${big ? " big" : ""}`}>
      <div className="proj-fill">
        <div className="proj-bar" aria-hidden="true"><i /><i /><i /><span>{p.slug}.app</span></div>
        <img src={s.img} alt="" loading="lazy" style={p.coverTop ? { objectPosition: "top" } : undefined} />
      </div>
      <PlateOutline />
      <span className="proj-no" aria-hidden="true">{pad(n)}</span>
      <span className="proj-count">{pad(p.screens.length)} screens</span>
    </div>
  );
}

const SourceLink = ({ p, className = "proj-src hov" }) => p.source ? (
  <a className={className} href={p.source} target="_blank" rel="noopener">
    <span aria-hidden="true">[ </span>{p.sourceLabel || "source code"}<span aria-hidden="true"> ↗ ]</span>
  </a>
) : null;

function Stack({ list }) {
  return <ul className="proj-stack">{list.map((t) => <li key={t}>{t}</li>)}</ul>;
}

/* a chamfered dark button, the paddock's slab in miniature */
function ScreensButton({ onClick, count }) {
  const d = chamfer(217, 50, 8);
  return (
    <button type="button" className="cta cta--slab proj-open" onClick={onClick}>
      <svg className="cta-frame" viewBox="0 0 217 50" preserveAspectRatio="none" aria-hidden="true"><path className="cta-outline" d={d} /><path className="cta-flood" d={d} /></svg>
      <span className="cta-label">view {count} screens<Arrow /></span>
    </button>
  );
}

function Card({ p, n, onOpen, onHot }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const r = rise(el, { y: "1.5rem", cfg: CFG.COPY, delay: ((n - 2) % 3) * 90 });
    return onceInView(el, () => r.play(), "0% 0% -10% 0%");
  }, [n]);
  return (
    <article ref={ref} className="proj" onMouseEnter={() => onHot(true, ref.current)} onMouseLeave={() => onHot(false, ref.current)}>
      <button type="button" className="proj-hit" onClick={onOpen} aria-label={`View ${p.title} screens`}><Cover p={p} n={n} /></button>
      <div className="proj-meta">
        <small>{p.kind} · {p.tag}</small>
        <b>{p.title}</b>
        <p>{p.desc}</p>
        <Stack list={p.stack} />
        <div className="proj-links">
          <button type="button" className="proj-src hov" onClick={onOpen}><span aria-hidden="true">[ </span>screens<span aria-hidden="true"> → ]</span></button>
          <SourceLink p={p} />
        </div>
      </div>
    </article>
  );
}

/* 6 · Selected work */
export default function Projects() {
  const ref = useRef(null), grid = useRef(null);
  const [open, setOpen] = useState(null); // { p, i }
  const [feat, ...rest] = PROJECTS;

  useLayoutEffect(() => {
    const el = ref.current;
    if (el.dataset.armed) return;
    el.dataset.armed = "1";
    checker($(".checker", el), "dark");
    contourField($(".contours", el), rgba(getPalette().ink, 0.08), el);
    const heads = $$(".hl", el).map((h) => split(h, { stagger: 110 }));
    const stop = rise($(".projects-head .stop", el), { y: null, delay: 240 });
    const intro = split($(".projects-intro", el), { stagger: 30, cfg: CFG.COPY2, gap: 0.22 });
    const count = rise($(".projects-count", el), { delay: 420 });
    const fig = split($(".projects-count dd", el), { mode: "letters", stagger: 26, cfg: CFG.FIGURE });
    onceInView($(".projects-head", el), () => { heads.forEach((h, i) => h.play(i * 130)); stop.play(); intro.play(2 * 130 + 90); count.play(); fig.play(520); });

    const f = $(".proj-feat", el);
    const fCover = rise($(".proj-feat .proj-hit", el), { y: "2rem", cfg: CFG.COPY });
    const fMeta = $$(".proj-feat .proj-meta > *", el).map((m, i) => rise(m, { cfg: CFG.COPY2, delay: 200 + i * 80 }));
    onceInView(f, () => { fCover.play(); fMeta.forEach((m) => m.play()); }, "0% 0% -20% 0%");
    addScrub(f, "top_bottom", "bottom_top", (p) => ($(".proj-feat .proj-fill img", el).style.translate = `0 ${(-4 + 8 * p).toFixed(2)}%`));
  }, []);

  const onHot = useCallback((on, card) => {
    if (!matchMedia("(hover: hover)").matches || REDUCED) return;
    grid.current.classList.toggle("dimming", on);
    card.classList.toggle("hot", on);
  }, []);

  const items = useMemo(() => open && open.p.screens.map((s, i) => ({
    img: s.img, alt: `${open.p.title} — ${s.cap}`, title: s.cap,
    kicker: `${open.p.title} · ${open.p.kind} · ${open.p.tag}`, line: open.p.desc,
  })), [open]);
  const setIndex = useCallback((fn) => setOpen((o) => ({ ...o, i: typeof fn === "function" ? fn(o.i) : fn })), []);

  return (
    <section data-projects id="projects" ref={ref} aria-label="Projects">
      <canvas className="checker top30" aria-hidden="true" />
      <canvas className="contours" aria-hidden="true" />
      <div className="projects-top">
        <Headline className="projects-head display" lines={CONFIG.projects.title} />
        <div className="projects-aside">
          <p className="projects-intro">{CONFIG.projects.intro}</p>
          <div className="projects-count"><Corners /><dl><dd>{pad(PROJECTS.length)}</dd><dt><b>projects</b>web · mobile · ai</dt></dl></div>
        </div>
      </div>

      <article className="proj-feat">
        <button type="button" className="proj-hit" onClick={() => setOpen({ p: feat, i: 0 })} aria-label={`View ${feat.title} screens`}><Cover p={feat} n={1} big /></button>
        <div className="proj-meta">
          <small><i className="dot" aria-hidden="true" />featured · {feat.kind} · {feat.tag}</small>
          <b>{feat.title}</b>
          <p>{feat.desc}</p>
          <Stack list={feat.stack} />
          <div className="proj-links">
            <ScreensButton count={feat.screens.length} onClick={() => setOpen({ p: feat, i: 0 })} />
            <SourceLink p={feat} />
          </div>
        </div>
      </article>

      <div className="proj-grid" ref={grid}>
        {rest.map((p, k) => <Card key={p.slug} p={p} n={k + 2} onOpen={() => setOpen({ p, i: 0 })} onHot={onHot} />)}
      </div>

      {open && (
        <Lightbox items={items} index={open.i} setIndex={setIndex} onClose={() => setOpen(null)} label={`${open.p.title} screens`}
          extra={<SourceLink p={open.p} className="proj-src lb-src hov" />} />
      )}
    </section>
  );
}
