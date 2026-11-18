import { useLayoutEffect, useRef, useState } from "react";
import { CONFIG, EXPERIENCE } from "../config.js";
import { $, $$, CFG, checker, contourField, onceInView, rise, split } from "../lib/engine.js";
import { revealTop } from "../lib/reveal.js";
import { Headline } from "./ui.jsx";
import { pad } from "./Lightbox.jsx";

/* 4 · Work experience — vertical panels side by side; the open one widens, the rest dim.
   No photos: one contour field runs behind every panel and the type does the work. */
export default function Experience() {
  const ref = useRef(null);
  const [open, setOpen] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!revealTop(el)) return;
    checker($(".checker", el), "light");
    const stage = $(".xp-stage", el);
    contourField($(".contours", stage), "rgb(255 255 255 / .09)", stage);
    $$(".xp-panel", el).forEach((p, i) => {
      const r = rise(p, { y: "2rem", cfg: CFG.COPY, delay: i * 90 });
      onceInView(stage, () => r.play(), "0% 0% -10% 0%");
    });
    $$(".xp-year", el).forEach((y) => { const s = split(y, { mode: "letters", stagger: 26, cfg: CFG.YEAR }); onceInView(y, () => s.play(160)); });
  }, []);

  return (
    <section className="ed dark xp" data-xp id="experience" ref={ref} aria-label="Work experience">
      <canvas className="checker top30" aria-hidden="true" />
      <div className="xp-stage">
        <canvas className="contours" aria-hidden="true" />
        <div className="xp-head">
          <Headline className="ed-head" lines={CONFIG.experience.title} />
          <p className="ed-intro">{CONFIG.experience.intro}</p>
        </div>
        <ol className="xp-panels">
          {EXPERIENCE.map((x, i) => (
            <li
              key={x.role + x.start}
              className={`xp-panel${i === open ? " is-open" : ""}`}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
              tabIndex={0}
              aria-expanded={i === open}
            >
              <span className="xp-shade" aria-hidden="true" />
              <div className="xp-rail" aria-hidden="true">
                <span className="xp-n">{pad(i + 1)}</span>
                <span className="xp-tag">{x.role}</span>
              </div>
              <div className="xp-body">
                <span className="xp-year">{x.year}</span>
                <div className="xp-copy">
                  <p className="row-dates"><span className="xp-n">{pad(i + 1)}</span>{x.start} — {x.end}</p>
                  <h3 className="xp-title">{x.role}</h3>
                  <p className="row-sub">{x.org} · {x.unit}</p>
                  <ul className="row-points">{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
