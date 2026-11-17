import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CONFIG } from "../config.js";
import { $$, CFG, Spring, rise, scroller } from "../lib/engine.js";
import { Logo } from "./ui.jsx";

/* burger + full-screen menu sheet (below 1280px) */
export default function Menu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const burger = useRef(null), sheet = useRef(null), spring = useRef(null);

  const show = () => { setMounted(true); setOpen(true); };
  const close = () => {
    if (!open) return;
    document.documentElement.classList.remove("locked"); scroller.lenis?.start();
    setOpen(false);
  };

  useLayoutEffect(() => {
    if (!mounted) return;
    const el = sheet.current;
    if (open) {
      spring.current = new Spring(0, CFG.SHEET, (p) => (el.style.opacity = p)).to(1);
      $$("li", el).forEach((li, i) => rise(li, { cfg: CFG.ROW, delay: 120 + i * 55 }).play());
      el.querySelector(".sheet-close").focus();
      scroller.lenis?.stop(); document.documentElement.classList.add("locked");
    } else {
      const s = spring.current;
      s.onUpdate = (p) => { el.style.opacity = p; if (p <= 0.001) setMounted(false); };
      s.to(0);
      burger.current.focus();
    }
  }, [open, mounted]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const mq = matchMedia("(min-width:1280px)");
    const onMq = (e) => e.matches && close();
    addEventListener("keydown", onKey); mq.addEventListener("change", onMq);
    return () => { removeEventListener("keydown", onKey); mq.removeEventListener("change", onMq); };
  });

  return (
    <>
      <button ref={burger} className="burger" type="button" aria-label="Open menu" aria-expanded={open} onClick={show}><i /><i /></button>
      {mounted && createPortal(
        <div ref={sheet} className="sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="sheet-top"><Logo /><button className="sheet-close" type="button" aria-label="Close menu" onClick={close}><i /><i /></button></div>
          <nav aria-label="Menu"><ul>
            {[...CONFIG.nav, CONFIG.navCta].map(([l, h]) => (
              <li key={l}><a className="hov" href={h} onClick={close} {...(h.startsWith("#") ? {} : { target: "_blank", rel: "noopener" })}>{l}</a></li>
            ))}
          </ul></nav>
        </div>,
        document.body,
      )}
    </>
  );
}
