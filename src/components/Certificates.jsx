import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CERTIFICATES, CERT_KINDS, CONFIG } from "../config.js";
import { $, $$, CFG, REDUCED, Spring, contourField, onceInView, rise, scroller, split } from "../lib/engine.js";
import { Arrow, Corners, Headline, PlateOutline, chamfer } from "./ui.jsx";

const pad = (n) => String(n).padStart(2, "0");
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

function LbButton({ dir, onClick }) {
  const d = chamfer(114, 44, 8);
  return (
    <button type="button" className={`lb-btn cta ${dir}`} onClick={onClick} aria-label={dir === "prev" ? "Previous certificate" : "Next certificate"}>
      <svg className="cta-frame" viewBox="0 0 114 44" preserveAspectRatio="none" aria-hidden="true"><path className="cta-outline" d={d} /><path className="cta-flood" d={d} /></svg>
      <span className="cta-label">{dir === "prev" ? <><Arrow />prev</> : <>next<Arrow /></>}</span>
    </button>
  );
}

/* full-size viewer */
function Lightbox({ list, index, setIndex, onClose }) {
  const ref = useRef(null), closeBtn = useRef(null), spring = useRef(null);
  const c = list[index];
  const go = useCallback((step) => setIndex((i) => (i + step + list.length) % list.length), [list.length, setIndex]);

  useLayoutEffect(() => {
    const el = ref.current;
    spring.current = new Spring(0, CFG.SHEET, (p) => (el.style.opacity = p)).to(1);
    closeBtn.current.focus();
    scroller.lenis?.stop(); document.documentElement.classList.add("locked");
    return () => { document.documentElement.classList.remove("locked"); scroller.lenis?.start(); };
  }, []);

  const close = useCallback(() => {
    const el = ref.current, s = spring.current;
    s.onUpdate = (p) => { el.style.opacity = p; if (p <= 0.001) onClose(); };
    s.to(0);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [close, go]);

  /* each new image settles in */
  const frame = useRef(null);
  useLayoutEffect(() => { const r = rise(frame.current, { y: "0.75rem", cfg: CFG.ROW }); r.play(); }, [index]);

  return createPortal(
    <div ref={ref} className="lightbox" role="dialog" aria-modal="true" aria-label={`${c.title} certificate`}
      onClick={(e) => { if (e.target === e.currentTarget || e.target.classList.contains("lb-stage")) close(); }}>
      <div className="lb-top">
        <span className="lb-count">{pad(index + 1)} <span style={{ color: "var(--foreground-on-dark-faint)" }}>/ {pad(list.length)}</span></span>
        <button ref={closeBtn} type="button" className="lb-close" aria-label="Close certificate" onClick={close}><i /><i /></button>
      </div>
      <div className="lb-stage">
        <div className="lb-frame" ref={frame}><Corners /><img src={c.img} alt={`${c.title} — ${c.issuer}`} /></div>
      </div>
      <div className="lb-bar">
        <div className="lb-cap">
          <small>{kindLabel[c.kind]}{c.date ? ` · ${c.date}` : ""}</small>
          <b>{c.title}</b>
          <span>{c.issuer} — {c.note}</span>
        </div>
        {list.length > 1 && <div className="lb-nav"><LbButton dir="prev" onClick={() => go(-1)} /><LbButton dir="next" onClick={() => go(1)} /></div>}
      </div>
    </div>,
    document.body,
  );
}

/* 6 · Licenses & certificates */
export default function Certificates() {
  const ref = useRef(null), grid = useRef(null);
  const [kind, setKind] = useState("all");
  const [open, setOpen] = useState(null);
  const list = useMemo(() => (kind === "all" ? CERTIFICATES : CERTIFICATES.filter((c) => c.kind === kind)), [kind]);
  const counts = useMemo(() => Object.fromEntries(CERT_KINDS.map(([k]) => [k, k === "all" ? CERTIFICATES.length : CERTIFICATES.filter((c) => c.kind === k).length])), []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el.dataset.armed) return;
    el.dataset.armed = "1";
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
      <canvas className="contours" aria-hidden="true" />
      <div className="certs-top">
        <Headline className="certs-head" lines={CONFIG.certs.title} />
        <div className="certs-aside">
          <p className="certs-intro">{CONFIG.certs.intro}</p>
          <dl className="certs-count"><Corners /><dd>{pad(CERTIFICATES.length)}</dd><dt><b>certificates</b>courses · competency · events</dt></dl>
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
      {open != null && <Lightbox list={list} index={open} setIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
