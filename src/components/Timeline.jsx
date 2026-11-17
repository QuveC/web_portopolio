import { useLayoutEffect, useRef } from "react";
import { CONFIG } from "../config.js";
import { $, $$, CFG, REDUCED, Spring, addScrub, checker, onceInView, rise, split } from "../lib/engine.js";
import { Headline, PlateOutline } from "./ui.jsx";

/* 4 · Journey (the timeline) */
const E = CONFIG.journey.entries;
const H = { centre: 462, side: 217 }, PAR = { plate: { side: 60, centre: 20 }, copy: 110 };
const railH = 169 + E.reduce((t, e) => t + H[e.frame], 0);
const lastTop = 169 + E.slice(0, -1).reduce((t, e) => t + H[e.frame], 0);
const rest = lastTop + H[E[E.length - 1].frame] / 2 - 50;

export default function Timeline() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const timeline = ref.current;
    if (timeline.dataset.armed) return;
    timeline.dataset.armed = "1";
    checker($(".checker", timeline), "light");
    const heads = $$(".hl", timeline).map((el) => split(el, { stagger: 110 }));
    const stop = rise($(".tl-head .stop", timeline), { y: null, delay: 240 });
    onceInView($(".tl-head", timeline), () => { heads.forEach((h, i) => h.play(i * 130)); stop.play(); });

    const narrow = () => innerWidth < 640;
    $$(".tl-row", timeline).forEach((row, i) => {
      const e = E[i];
      const lp = $(".lp", row), lc = $(".lc", row), slot = $(".plate-slot", row), year = $(".tl-year", row), plate = $(".tl-plate", row);
      const tp = PAR.plate[e.frame];
      addScrub(row, "top_bottom", "bottom_top", (p) => {
        lp.style.top = narrow() ? "" : `calc(var(--u) * ${tp * (1 - 2 * p)})`;
        if (lc) lc.style.top = narrow() ? "" : `calc(var(--u) * ${PAR.copy * (1 - 2 * p)})`;
      });
      addScrub(row, "top_bottom", "top_center", (p) => (slot.style.top = `${-10 + 10 * p}%`));
      const letters = split(year, { mode: "letters", stagger: 26, cfg: CFG.YEAR });
      const copy = lc ? rise($(".tl-copy", lc), { cfg: CFG.COPY, delay: 220 }) : null;
      onceInView(row, () => {
        letters.play(0); copy?.play();
        if (e.frame === "centre") setTimeout(() => new Spring(1, CFG.SETTLE, (v) => (year.style.opacity = v)).to(0.4), 2200 + 26 * e.year.length);
      }, "0% 0% -25% 0%");
      if (matchMedia("(hover: hover)").matches && !REDUCED) {
        plate.addEventListener("mouseenter", () => { timeline.classList.add("dimming"); row.classList.add("hot"); });
        plate.addEventListener("mouseleave", () => { timeline.classList.remove("dimming"); row.classList.remove("hot"); });
      }
    });
    const rail = $(".rail", timeline), run = $(".run", rail), mark = $(".mark", rail);
    const size = () => { const s = innerWidth < 1024 ? 20 : 9; mark.setAttribute("x", -s / 2); mark.setAttribute("y", -s / 2); mark.setAttribute("width", s); mark.setAttribute("height", s); };
    size(); addEventListener("resize", size);
    addScrub(rail, "top_center", "bottom_bottom", (p) => {
      const r = p * rest; run.setAttribute("height", r.toFixed(2));
      mark.setAttribute("transform", `translate(8 ${r.toFixed(2)}) rotate(${((r / rest) * 1800).toFixed(1)})`);
    }, CFG.DEFAULT);
  }, []);

  return (
    <section data-timeline id="journey" ref={ref}>
      <canvas className="checker top30" aria-hidden="true" />
      <div className="tl-wrap">
        <div className="rail" aria-hidden="true">
          <svg viewBox={`0 0 16 ${railH}`}>
            <line x1="8" y1="0" x2="8" y2="98" stroke="var(--timeline-rail)" />
            <line x1="8" y1="102" x2="8" y2={rest} stroke="var(--timeline-rail)" strokeDasharray="6 6" />
            <rect className="run" x="7.5" y="0" width="1" height="0" fill="var(--foreground-on-dark)" />
            <rect className="mark" x="-4.5" y="-4.5" width="9" height="9" fill="var(--foreground-on-dark)" />
          </svg>
        </div>
        <Headline className="tl-head" lines={CONFIG.journey.title} />
        {E.map((e, i) => {
          const Plate = e.href ? "a" : "div";
          const link = e.href ? { href: e.href, target: "_blank", rel: "noopener", "aria-label": e.title } : {};
          return (
            <div key={i} className={`tl-row ${e.frame} ${e.align || ""} ${i % 2 ? "even" : "odd"}`}>
              <div className="tl-layer lp">
                <Plate className="tl-plate" style={{ display: "block" }} {...link}>
                  <div className="plate-fill" style={{ clipPath: "url(#plate-clip)" }}><div className="plate-slot">
                    {e.img
                      ? <img src={e.img} alt={`${e.title} — ${e.tag}`} loading="lazy" />
                      : <div className="plate-art">{e.kind && <i className="plate-kind">{e.kind}</i>}<b>{e.title}</b><small>{e.tag}</small></div>}
                  </div>
                  {e.img && <div className="plate-cap"><i className="plate-kind">{e.kind}</i><b>{e.title}</b><small>{e.tag}</small></div>}
                  </div>
                  <PlateOutline />
                </Plate>
                <div className="tl-year">{e.year}</div>
              </div>
              {e.frame === "centre" && e.copy && (
                <div className="tl-layer lc"><p className="tl-copy" style={{ "--cw": e.cw || 260 }}><b>{e.lead}</b> {e.copy}</p></div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
