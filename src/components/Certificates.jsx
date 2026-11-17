import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CERTIFICATES, CERT_KINDS, CONFIG } from "../config.js";
import { $, $$, CFG, REDUCED, checker, contourField, onceInView, rise, split } from "../lib/engine.js";
import Lightbox, { pad } from "./Lightbox.jsx";
import { Corners, Headline, PlateOutline } from "./ui.jsx";

const kindLabel = Object.fromEntries(CERT_KINDS);

/* one certificate plate — rises in when it scrolls into view, or right away after a filter change */
function CertCard({ c, n, order, onOpen, onHot }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const r = rise(el, { y: "1.5rem", cfg: CFG.COPY, delay: (order % 3) * 90 });
    return onceInView(el, () => r.play(), "0% 0% -10% 0%");
  }, [order]);
  return (
    <button ref={ref} type="button" className="cert" onClick={onOpen}
      onMouseEnter={() => onHot(true, ref.current)} onMouseLeave={() => onHot(false, ref.current)}
      aria-label={`View certificate: ${c.title}, ${c.issuer}`}>
      <div className="cert-plate">
        <div className="cert-fill"><img src={c.img} alt="" loading="lazy" /></div>
        <PlateOutline />
        {c.cv && <span className="cert-flag">key certificate</span>}
        <span className="cert-tag">{kindLabel[c.kind]}</span>
        <span className="cert-no" aria-hidden="true">{pad(n)}</span>
      </div>
      <div className="cert-meta">
        <b>{c.title}</b>
        <span>{c.issuer}</span>
        <small>{[c.date, c.note].filter(Boolean).join(" · ")}</small>
      </div>
    </button>
  );
}

/* 7 · Licenses & certificates */
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
    if (el.dataset.armed) return;
    el.dataset.armed = "1";
    checker($(".checker", el), "light");
    contourField($(".contours", el), "rgb(255 255 255 / .06)", el);
    const heads = $$(".hl", el).map((h) => split(h, { stagger: 110 }));
    const stop = rise($(".certs-head .stop", el), { y: null, delay: 240 });
    const intro = split($(".certs-intro", el), { stagger: 30, cfg: CFG.COPY2, gap: 0.22 });
    const count = rise($(".certs-count", el), { delay: 420 });
    const fig = split($(".certs-count dd", el), { mode: "letters", stagger: 26, cfg: CFG.FIGURE });
    const chips = $$(".chip", el).map((c, i) => rise(c, { y: "0.5rem", cfg: CFG.ROW, delay: 520 + i * 60 }));
    onceInView($(".certs-head", el), () => {
      heads.forEach((h, i) => h.play(i * 130)); stop.play(); intro.play(2 * 130 + 90);
      count.play(); fig.play(520); chips.forEach((c) => c.play());
    });
  }, []);

  const onHot = useCallback((on, card) => {
    if (!matchMedia("(hover: hover)").matches || REDUCED) return;
    grid.current.classList.toggle("dimming", on);
    card.classList.toggle("hot", on);
  }, []);

  return (
    <section data-certs id="certs" ref={ref} aria-label="Certificates">
      <canvas className="checker top30" aria-hidden="true" />
      <canvas className="contours" aria-hidden="true" />
      <div className="certs-top">
        <Headline className="certs-head" lines={CONFIG.certs.title} />
        <div className="certs-aside">
          <p className="certs-intro">{CONFIG.certs.intro}</p>
          <div className="certs-count"><Corners /><dl><dd>{pad(CERTIFICATES.length)}</dd><dt><b>certificates</b>courses · competency · events</dt></dl></div>
        </div>
      </div>
      <div className="certs-filter" role="group" aria-label="Filter certificates">
        {CERT_KINDS.map(([k, label]) => (
          <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => { grid.current.classList.remove("dimming"); setKind(k); }}>
            <span className="br" aria-hidden="true">[</span>{label}<sup>{pad(counts[k])}</sup><span className="br" aria-hidden="true">]</span>
          </button>
        ))}
      </div>
      <div className="certs-grid" ref={grid}>
        {list.map((c, i) => (
          <CertCard key={`${kind}-${c.img}`} c={c} n={CERTIFICATES.indexOf(c) + 1} order={i} onOpen={() => setOpen(i)} onHot={onHot} />
        ))}
      </div>
      {open != null && <Lightbox items={items} index={open} setIndex={setOpen} onClose={() => setOpen(null)} label="Certificate viewer" />}
    </section>
  );
}
