import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CERTIFICATES, CERT_KINDS, CONFIG } from "../config.js";
import { $, CFG, REDUCED, checker, onceInView, rise } from "../lib/engine.js";
import { revealTop } from "../lib/reveal.js";
import Lightbox, { pad } from "./Lightbox.jsx";
import { Headline, PlateOutline } from "./ui.jsx";

const kindLabel = Object.fromEntries(CERT_KINDS);

/* one certificate — rises when it scrolls into view, or right away after a filter change */
function CertCard({ c, n, order, onOpen, onHot }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const r = rise(el, { y: "1.5rem", cfg: CFG.COPY, delay: (order % 3) * 90 });
    return onceInView(el, () => r.play(), "0% 0% -10% 0%");
  }, [order]);
  return (
    <article ref={ref} className="item" onMouseEnter={() => onHot(true, ref.current)} onMouseLeave={() => onHot(false, ref.current)}>
      <button type="button" className="plate-hit" onClick={onOpen} aria-label={`View certificate: ${c.title}, ${c.issuer}`}>
        <div className="plate contain">
          <div className="plate-fill"><img src={c.img} alt="" loading="lazy" /></div>
          <PlateOutline />
        </div>
      </button>
      <div className="meta-block">
        <span className="meta-line"><span className="n">{pad(n)}</span>{kindLabel[c.kind]}{c.cv && <span className="flag">· listed on cv</span>}</span>
        <b>{c.title}</b>
        <p>{c.issuer}{c.date ? ` — ${c.date}` : ""}. {c.note.charAt(0).toUpperCase() + c.note.slice(1)}.</p>
      </div>
    </article>
  );
}

/* 8 · Certificates */
export default function Certificates() {
  const ref = useRef(null), grid = useRef(null);
  const [kind, setKind] = useState("all");
  const [open, setOpen] = useState(null);
  const list = useMemo(() => (kind === "all" ? CERTIFICATES : CERTIFICATES.filter((c) => c.kind === kind)), [kind]);
  const counts = useMemo(() => Object.fromEntries(CERT_KINDS.map(([k]) => [k, k === "all" ? CERTIFICATES.length : CERTIFICATES.filter((c) => c.kind === k).length])), []);
  const items = useMemo(() => list.map((c) => ({
    img: c.img, alt: `${c.title} — ${c.issuer}`, title: c.title,
    kicker: `${kindLabel[c.kind]}${c.date ? ` · ${c.date}` : ""}`, line: `${c.issuer} — ${c.note}`,
  })), [list]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!revealTop(el)) return;
    checker($(".checker", el), "light");
  }, []);

  const onHot = useCallback((on, card) => {
    if (!matchMedia("(hover: hover)").matches || REDUCED) return;
    grid.current.classList.toggle("dimming", on);
    card.classList.toggle("hot", on);
  }, []);

  return (
    <section className="ed dark" data-certs id="certs" ref={ref} aria-label="Certificates">
      <canvas className="checker top30" aria-hidden="true" />
      <div className="ed-top">
        <Headline className="ed-head" lines={CONFIG.certs.title} />
        <div className="ed-aside">
          <p className="ed-intro">{CONFIG.certs.intro}</p>
          <div className="ed-count"><b>{pad(CERTIFICATES.length)}</b><span>certificates · 2021 – 2024</span></div>
        </div>
      </div>
      <div className="ed-body">
        <div className="filters" role="group" aria-label="Filter certificates">
          {CERT_KINDS.map(([k, label]) => (
            <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => { grid.current.classList.remove("dimming"); setKind(k); }}>
              {label}<sup>{pad(counts[k])}</sup>
            </button>
          ))}
        </div>
        <div className="grid cert-grid" ref={grid}>
          {list.map((c, i) => (
            <CertCard key={`${kind}-${c.img}`} c={c} n={CERTIFICATES.indexOf(c) + 1} order={i} onOpen={() => setOpen(i)} onHot={onHot} />
          ))}
        </div>
      </div>
      {open != null && <Lightbox items={items} index={open} setIndex={setOpen} onClose={() => setOpen(null)} label="Certificate viewer" />}
    </section>
  );
}
