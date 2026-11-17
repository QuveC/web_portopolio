import { useLayoutEffect, useRef } from "react";
import { CONFIG, EXPERIENCE } from "../config.js";
import { $, $$, CFG, checker, onceInView, split } from "../lib/engine.js";
import { revealRows, revealTop } from "../lib/reveal.js";
import { Headline } from "./ui.jsx";
import { pad } from "./Lightbox.jsx";

/* 4 · Work experience — newest first, one ruled row per role */
export default function Experience() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!revealTop(el)) return;
    checker($(".checker", el), "light");
    revealRows($(".rows", el));
    $$(".row-year", el).forEach((y) => { const s = split(y, { mode: "letters", stagger: 26, cfg: CFG.YEAR }); onceInView(y, () => s.play(120)); });
  }, []);

  return (
    <section className="ed dark" data-xp id="experience" ref={ref} aria-label="Work experience">
      <canvas className="checker top30" aria-hidden="true" />
      <div className="ed-top">
        <Headline className="ed-head" lines={CONFIG.experience.title} />
        <div className="ed-aside">
          <p className="ed-intro">{CONFIG.experience.intro}</p>
          <div className="ed-count"><b>{pad(EXPERIENCE.length)}</b><span>roles · 2023 – present</span></div>
        </div>
      </div>
      <ol className="ed-body rows">
        {EXPERIENCE.map((x) => (
          <li className="row" key={x.role + x.start}>
            <div className="row-when">
              <span className="row-year">{x.year}</span>
              <span className="row-dates">{x.start} — {x.end}</span>
            </div>
            <div>
              <h3 className="row-title">{x.role}</h3>
              <p className="row-sub">{x.org} · {x.unit}</p>
            </div>
            <ul className="row-points">{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
