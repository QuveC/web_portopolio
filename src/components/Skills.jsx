import { useLayoutEffect, useRef } from "react";
import { CONFIG } from "../config.js";
import { $, checker } from "../lib/engine.js";
import { revealRows, revealTop } from "../lib/reveal.js";
import { Headline } from "./ui.jsx";
import { pad } from "./Lightbox.jsx";

/* 6 · Skills & stack — a ruled list, straight from the CV */
export default function Skills() {
  const ref = useRef(null);
  const S = CONFIG.skills;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!revealTop(el)) return;
    checker($(".checker", el), "dark");
    revealRows($(".rows", el));
  }, []);

  return (
    <section className="ed light" data-skills id="skills" ref={ref} aria-label="Skills">
      <canvas className="checker top30" aria-hidden="true" />
      <div className="ed-top">
        <Headline className="ed-head" lines={S.title} />
        <div className="ed-aside"><p className="ed-intro">{S.intro}</p></div>
      </div>
      <dl className="ed-body rows">
        {S.groups.map(([label, items]) => (
          <div className="row skill" key={label}>
            <dt className="row-label">{label}</dt>
            <dd className="skill-items slashes">{items.map((i) => <span key={i}>{i}</span>)}</dd>
            <dd className="row-n" aria-hidden="true">{pad(items.length)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
