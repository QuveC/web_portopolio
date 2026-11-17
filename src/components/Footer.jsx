import { useLayoutEffect, useRef } from "react";
import { CONFIG } from "../config.js";
import { $, $$, CFG, addScrub, contourField, onceInView, rise, split } from "../lib/engine.js";
import { Headline, Logo, Slab } from "./ui.jsx";

/* 7 · Get in touch (footer) */
export default function Footer() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const footer = ref.current;
    if (footer.dataset.armed) return;
    footer.dataset.armed = "1";
    contourField($(".contours", footer), "rgb(255 255 255 / .1)", footer);
    addScrub(footer, "top_bottom", "bottom_bottom", (p) => ($(".foot-fig-layer", footer).style.top = `calc(var(--u) * ${60 * (1 - p)})`));
    const lg = rise($(".foot-logo", footer), { y: null, delay: 120 });
    const heads = $$(".foot-head .hl", footer).map((el) => split(el, { stagger: 110 }));
    const stop = rise($(".foot-head .stop", footer), { y: null, delay: 240 });
    const navs = $$(".nl", footer).map((el) => split(el, { mode: "letters", stagger: 22, cfg: CFG.ROW, gap: 0.2 }));
    const foot = [".foot-copy", ".foot-cta", ".foot-social"].map((s, i) => rise($(s, footer), { delay: 640 + i * 80 }));
    onceInView(footer, () => { lg.play(); heads.forEach((h, i) => h.play(i * 130)); stop.play(); navs.forEach((n, i) => n.play(260 + i * 80)); foot.forEach((f) => f.play()); }, "0% 0% -25% 0%");
  }, []);

  const C = CONFIG;
  return (
    <section data-footer id="contact" ref={ref}>
      <div className="foot-panel"><canvas className="contours" aria-hidden="true" /></div>
      <div className="foot-fig" aria-hidden="true"><div className="foot-fig-layer"><div className="foot-mark">{C.initials}</div></div></div>
      <div className="foot-logo"><Logo /></div>
      <Headline className="foot-head display" lines={C.footer.title} />
      <nav className="foot-nav" aria-label="Footer">
        {C.nav.map(([l, h]) => <a key={h} className="hov" href={h}><span className="nl">{l}</span></a>)}
      </nav>
      <div className="foot-row">
        <p className="foot-copy"><a className="foot-mail hov" href={`mailto:${C.email}`}>{C.email}</a>© 2026 {C.first} {C.last}. All rights reserved.</p>
        <div className="foot-cta"><Slab label={C.footer.cta[0]} href={C.footer.cta[1]} kind="hollow" w={275} h={50} cut={8.835} /></div>
        <ul className="foot-social">{C.socials.map(([l, h]) => <li key={l}><a className="hov" href={h} target="_blank" rel="noopener">{l}</a></li>)}</ul>
      </div>
    </section>
  );
}
