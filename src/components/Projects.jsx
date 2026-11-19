import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CONFIG, PROJECTS } from "../config.js";
import { $, $$, CFG, REDUCED, onceInView, rise } from "../lib/engine.js";
import { revealTop } from "../lib/reveal.js";
import Lightbox, { pad } from "./Lightbox.jsx";
import { Arrow, Headline, PlateOutline, chamfer } from "./ui.jsx";

/* the stepped frame with a project's cover screen, flat inside */
function Cover({ p, onOpen }) {
  const s = p.screens[(p.cover || 1) - 1];
  return (
    <button type="button" className="plate-hit" onClick={onOpen} aria-label={`View ${p.title} screens`}>
      <div className="plate">
        <div className="plate-fill"><img src={s.img} alt="" loading="lazy" style={p.coverTop ? undefined : { objectPosition: "center" }} /></div>
        <PlateOutline />
      </div>
    </button>
  );
}

const SourceLink = ({ p }) => p.source ? (
  <a className="text-link" href={p.source} target="_blank" rel="noopener">{p.sourceLabel || "source code"} ↗</a>
) : null;

function Meta({ p, n, onOpen, big = false }) {
  return (
    <div className="meta-block">
      <span className="meta-line"><span className="n">{pad(n)}</span>{p.kind} · {p.tag}</span>
      <b>{p.title}</b>
      <p>{p.desc}</p>
      <span className="meta-stack slashes">{p.stack.map((t) => <span key={t}>{t}</span>)}</span>
      <div className="text-links">
        {big ? (
          <button type="button" className="cta cta--slab proj-open" onClick={onOpen}>
            <svg className="cta-frame" viewBox="0 0 217 50" preserveAspectRatio="none" aria-hidden="true"><path className="cta-outline" d={chamfer(217, 50, 8)} /><path className="cta-flood" d={chamfer(217, 50, 8)} /></svg>
            <span className="cta-label">{p.screens.length} screens<Arrow /></span>
          </button>
        ) : (
          <button type="button" className="text-link" onClick={onOpen}>{p.screens.length} screens →</button>
        )}
        <SourceLink p={p} />
      </div>
    </div>
  );
}

function Card({ p, n, onOpen, onHot }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const r = rise(el, { y: "1.5rem", cfg: CFG.COPY, delay: ((n - 2) % 4) * 80 });
    return onceInView(el, () => r.play(), "0% 0% -10% 0%");
  }, [n]);
  return (
    <article ref={ref} className="item" onMouseEnter={() => onHot(true, ref.current)} onMouseLeave={() => onHot(false, ref.current)}>
      <Cover p={p} onOpen={onOpen} />
      <Meta p={p} n={n} onOpen={onOpen} />
    </article>
  );
}

/* 7 · Selected work */
export default function Projects() {
  const ref = useRef(null), grid = useRef(null);
  const [open, setOpen] = useState(null); // { p, i }
  const [feat, ...rest] = PROJECTS;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!revealTop(el)) return;
    const f = $(".proj-feat", el);
    const cover = rise($(".plate-hit", f), { y: "2rem", cfg: CFG.COPY });
    const meta = $$(".meta-block > *", f).map((m, i) => rise(m, { cfg: CFG.COPY2, delay: 200 + i * 80 }));
    onceInView(f, () => { cover.play(); meta.forEach((m) => m.play()); }, "0% 0% -20% 0%");
  }, []);

  const onHot = useCallback((on, card) => {
    if (!matchMedia("(hover: hover)").matches || REDUCED) return;
    grid.current.classList.toggle("dimming", on);
    card.classList.toggle("hot", on);
  }, []);

  const items = useMemo(() => open && open.p.screens.map((s) => ({
    img: s.img, alt: `${open.p.title} — ${s.cap}`, title: s.cap, kicker: `${open.p.title} · ${open.p.kind} · ${open.p.tag}`, line: open.p.desc,
  })), [open]);
  const setIndex = useCallback((fn) => setOpen((o) => ({ ...o, i: typeof fn === "function" ? fn(o.i) : fn })), []);
  const show = (p) => () => setOpen({ p, i: 0 });

  return (
    <section className="ed light" data-projects id="projects" ref={ref} aria-label="Projects">
      <div className="ed-top">
        <Headline className="ed-head" lines={CONFIG.projects.title} />
        <div className="ed-aside">
          <p className="ed-intro">{CONFIG.projects.intro}</p>
          <div className="ed-count"><b>{pad(PROJECTS.length)}</b><span>projects · web · mobile · ai · ui/ux</span></div>
        </div>
      </div>
      <div className="ed-body">
        <article className="proj-feat">
          <Cover p={feat} onOpen={show(feat)} />
          <Meta p={feat} n={1} onOpen={show(feat)} big />
        </article>
        <div className="grid proj-grid" ref={grid}>
          {rest.map((p, k) => <Card key={p.slug} p={p} n={k + 2} onOpen={show(p)} onHot={onHot} />)}
        </div>
      </div>
      {open && (
        <Lightbox items={items} index={open.i} setIndex={setIndex} onClose={() => setOpen(null)} label={`${open.p.title} screens`}
          extra={open.p.source ? <a className="text-link lb-src" href={open.p.source} target="_blank" rel="noopener">{open.p.sourceLabel || "source code"} ↗</a> : null} />
      )}
    </section>
  );
}
