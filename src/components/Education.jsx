import { useLayoutEffect, useRef } from "react";
import { CONFIG, EDUCATION } from "../config.js";
import { $, $$, CFG, onceInView, split } from "../lib/engine.js";
import { revealRows, revealTop } from "../lib/reveal.js";
import { Headline } from "./ui.jsx";

/* 5 · Education — university and vocational school, with what was studied */
export default function Education() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!revealTop(el)) return;
    revealRows($(".rows", el));
    $$(".row-year", el).forEach((y) => { const s = split(y, { mode: "letters", stagger: 26, cfg: CFG.YEAR }); onceInView(y, () => s.play(120)); });
  }, []);

  return (
    <section className="ed dark" data-edu id="education" ref={ref} aria-label="Education">
      <div className="ed-top">
        <Headline className="ed-head" lines={CONFIG.education.title} />
        <div className="ed-aside"><p className="ed-intro">{CONFIG.education.intro}</p></div>
      </div>
      <ol className="ed-body rows">
        {EDUCATION.map((e) => (
          <li className="row" key={e.school}>
            <div className="row-when">
              <span className="row-year">{e.start}</span>
              <span className="row-dates">to {e.end}</span>
            </div>
            <div>
              <h3 className="row-title">{e.school}</h3>
              <p className="row-sub">{e.degree} · {e.unit}</p>
            </div>
            <dl className="row-groups">
              {e.groups.map(([label, items]) => (
                <div key={label}>
                  <dt className="row-label">{label}</dt>
                  <dd className="slashes">{items.map((i) => <span key={i}>{i}</span>)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
