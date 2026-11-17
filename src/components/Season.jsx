import { useLayoutEffect, useRef } from "react";
import { CONFIG } from "../config.js";
import { checker } from "../lib/engine.js";
import { MAP_SVG, initSeason } from "../lib/season.js";
import { Headline } from "./ui.jsx";

/* 3 · About me — the circuit lap, halftone and reticle */
export default function Season() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el.dataset.armed) return;
    el.dataset.armed = "1";
    checker(el.querySelector(".checker"), "light");
    initSeason(el);
  }, []);

  const Y = CONFIG.year;
  return (
    <section data-season id="year" ref={ref}>
      <canvas className="checker" aria-hidden="true" />
      <div className="stage-frame" aria-hidden="true"><div className="stage">
        <div className="map-box">
          <canvas className="dots" />
          <svg viewBox="0 0 2560 1440" dangerouslySetInnerHTML={{ __html: MAP_SVG }} />
        </div>
        <canvas className="trace" />
      </div></div>
      <div className="season-copy">
        <div>
          <Headline className="season-head" lines={Y.title} />
          <div className="rule" aria-hidden="true" />
          <p className="season-intro">{Y.intro}</p>
        </div>
        <div className="splate">
          <svg viewBox="0 0 277 78" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0.5 0.5H276.5V69L268 77.5H0.5Z" fill="var(--surface-black)" stroke="var(--accent)" vectorEffect="non-scaling-stroke" />
            <line x1="83" y1="0.5" x2="83" y2="77.5" stroke="var(--accent)" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="splate-badge">
            <svg viewBox="0 0 37 23" aria-hidden="true"><ellipse cx="18.5" cy="11.5" rx="18" ry="11" /><line x1="0.5" y1="11.5" x2="36.5" y2="11.5" /><ellipse className="meridian" cx="18.5" cy="11.5" rx="18" ry="11" /></svg>
            <div className="badge-type"><span className="b1">{Y.badge[0]}</span><span className="a b2">{Y.badge[1]}</span></div>
          </div>
          <dl className="splate-stats">{Y.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
      </div>
    </section>
  );
}
