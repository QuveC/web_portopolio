import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CFG, Spring, rise, scroller } from "../lib/engine.js";
import { Arrow, Corners, chamfer } from "./ui.jsx";

export const pad = (n) => String(n).padStart(2, "0");

function LbButton({ dir, onClick }) {
  const d = chamfer(114, 44, 8);
  return (
    <button type="button" className={`lb-btn cta ${dir}`} onClick={onClick} aria-label={dir === "prev" ? "Previous" : "Next"}>
      <svg className="cta-frame" viewBox="0 0 114 44" preserveAspectRatio="none" aria-hidden="true"><path className="cta-outline" d={d} /><path className="cta-flood" d={d} /></svg>
      <span className="cta-label">{dir === "prev" ? <><Arrow />prev</> : <>next<Arrow /></>}</span>
    </button>
  );
}

/**
 * Full-size viewer, shared by certificates and project screens.
 * items: [{ img, alt, kicker, title, line }]; tall images (full-page screenshots) scroll inside the stage.
 */
export default function Lightbox({ items, index, setIndex, onClose, label = "Image viewer", extra = null }) {
  const ref = useRef(null), closeBtn = useRef(null), spring = useRef(null), frame = useRef(null), stage = useRef(null);
  const [tall, setTall] = useState(false);
  const it = items[index];
  const go = useCallback((step) => setIndex((i) => (i + step + items.length) % items.length), [items.length, setIndex]);

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

  /* each new image settles in, from the top of the stage */
  useLayoutEffect(() => {
    setTall(false);
    if (stage.current) stage.current.scrollTop = 0;
    rise(frame.current, { y: "0.75rem", cfg: CFG.ROW }).play();
  }, [index]);

  return createPortal(
    <div ref={ref} className="lightbox" role="dialog" aria-modal="true" aria-label={label} data-lenis-prevent
      onClick={(e) => { if (e.target === e.currentTarget || e.target === stage.current) close(); }}>
      <div className="lb-top">
        <span className="lb-count">{pad(index + 1)} <span>/ {pad(items.length)}</span></span>
        <button ref={closeBtn} type="button" className="lb-close" aria-label="Close" onClick={close}><i /><i /></button>
      </div>
      <div ref={stage} className={`lb-stage${tall ? " tall" : ""}`}>
        <div className="lb-frame" ref={frame}>
          <Corners />
          <img key={it.img} src={it.img} alt={it.alt || it.title}
            onLoad={(e) => setTall(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth > 1.25)} />
        </div>
      </div>
      <div className="lb-bar">
        <div className="lb-cap">
          {it.kicker && <small>{it.kicker}</small>}
          <b>{it.title}</b>
          {it.line && <span>{it.line}</span>}
        </div>
        <div className="lb-nav">
          {extra}
          {items.length > 1 && <><LbButton dir="prev" onClick={() => go(-1)} /><LbButton dir="next" onClick={() => go(1)} /></>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
