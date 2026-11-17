import { useLayoutEffect, useRef } from "react";
import { CONFIG } from "../config.js";
import { CFG, REDUCED, Spring, rise } from "../lib/engine.js";

/* The loading veil. Its controller is published here so the hero can hand over once it's ready. */
let controller = null;
const waiting = [];
export function whenVeil(fn) { if (controller) fn(controller); else waiting.push(fn); }

export default function Veil() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (controller) return;
    const el = ref.current;
    const fill = el.querySelector("#veil-fill"), meter = el.querySelector(".veil-meter i"), inner = el.querySelector(".veil-inner"), name = el.querySelector(".veil-name");
    rise(name, { y: "0.6rem", cfg: CFG.LABEL, delay: 260 }).play();
    const progress = new Spring(0, CFG.WAIT, (p) => { fill.style.transform = `scaleY(${p})`; meter.style.transform = `scaleX(${p})`; });
    progress.to(0.7);
    let done = false;
    controller = {
      ready(onLift) {
        if (done) return; done = true;
        el.style.pointerEvents = "none"; el.setAttribute("aria-label", "Loaded");
        progress.cfg = CFG.READY; progress.to(1);
        new Spring(1, CFG.CLEAR, (p) => { inner.style.opacity = p; inner.style.translate = `0 calc(-0.75rem * ${1 - p})`; el.querySelector(".veil-meter").style.opacity = p; }).to(0);
        setTimeout(() => {
          new Spring(1, CFG.VEIL, (p) => (el.style.opacity = p)).to(0);
          onLift();
          const t0 = performance.now();
          const poll = () => {
            if (parseFloat(getComputedStyle(el).opacity) <= 0.004 || performance.now() - t0 > 3000) { el.style.display = "none"; return; }
            requestAnimationFrame(poll);
          };
          requestAnimationFrame(poll);
        }, REDUCED ? 0 : 430 + 240);
      },
    };
    waiting.splice(0).forEach((fn) => fn(controller));
  }, []);

  return (
    <div id="veil" ref={ref} role="status" aria-label="Loading portfolio">
      <div className="veil-inner">
        <div className="veil-mark" aria-hidden="true">
          <svg viewBox="0 0 72 85">
            <defs><clipPath id="vm"><text x="36" y="72" textAnchor="middle" fontFamily="Oswald, Impact, sans-serif" fontWeight="700" fontSize="80">{CONFIG.initials}</text></clipPath></defs>
            <g clipPath="url(#vm)">
              <rect width="72" height="85" fill="var(--foreground)" opacity=".12" />
              <rect id="veil-fill" width="72" height="85" fill="var(--foreground)" style={{ transformOrigin: "top", transformBox: "fill-box", transform: "scaleY(0)" }} />
            </g>
          </svg>
        </div>
        <div className="veil-name">{`${CONFIG.first} ${CONFIG.last}`}</div>
      </div>
      <div className="veil-meter" aria-hidden="true"><i /></div>
    </div>
  );
}
