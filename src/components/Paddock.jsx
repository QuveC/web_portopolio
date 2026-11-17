import { useLayoutEffect, useRef } from "react";
import { CONFIG } from "../config.js";
import { $, $$, CFG, REDUCED, addScrub, checker, contourField, getPalette, onceInView, px, rgba, rise, split, subscribe, tracker } from "../lib/engine.js";
import { Headline, PlateOutline, STAT_ICONS, Slab } from "./ui.jsx";

/* 5 · Skills & stack (the paddock) */
const F = CONFIG.featured, U = (n) => `calc(var(--U) * ${n})`;
const colW = 193, colRight = `calc(2.2222cqw + ${U(12)})`, frameRight = "calc(100% - 2.2222cqw)", frameLeft = `calc(100% - 2.2222cqw - ${U(colW + 25)})`;
const cal = CONFIG.roadmap, CX = [[347, 100], [511, 100], [675, 100], [839, 114], [1017, 76]], LINKS = [[416, 126], [580, 128], [743, 136], [914, 124]];
const spread = (x) => `calc(50% + ${px(x - 720)} * var(--cal-spread, 1))`;
const liveIdx = Math.max(0, cal.findIndex((c) => c.live));

function Brackets({ l, r, t, b }) {
  return [["tl", l, t, 270], ["tr", r, t, 0], ["br", r, b, 90], ["bl", l, b, 180]].map(([c, x, y, rot]) => (
    <svg key={c} className="bk" viewBox="0 0 10.5 10.5"
      style={{ left: `calc(${x} - ${c.includes("r") ? U(10) : "0px"})`, top: `calc(${y} - ${c[0] === "b" ? U(10) : "0px"})`, transform: `rotate(${rot}deg)` }}>
      <path d="M0 0.5H10V10.5" />
    </svg>
  ));
}

export default function Paddock() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const paddock = ref.current;
    if (paddock.dataset.armed) return;
    paddock.dataset.armed = "1";
    const P = getPalette();
    $(".cal-live", paddock).style.setProperty("--U", "var(--u)");
    checker($(".checker", paddock), "dark");
    contourField($(".contours", paddock), rgba(P.ink, 0.08), paddock);
    addScrub(paddock, "top_bottom", "bottom_top", (p) => ($(".feat-layer", paddock).style.top = `calc(var(--u) * ${-48 * p})`));

    const heads = $$(".hl", paddock).map((el) => split(el, { stagger: 110 }));
    const stop = rise($(".pad-head .stop", paddock), { y: null, delay: 240 });
    const report = split($(".pad-report", paddock), { stagger: 30, cfg: CFG.COPY2, gap: 0.22 });
    const cta = rise($(".pad-cta", paddock), { delay: 2 * 130 + 260 });
    onceInView($(".pad-head", paddock), () => { heads.forEach((h, i) => h.play(i * 130)); stop.play(); report.play(2 * 130 + 90); cta.play(); });

    const mbk = $$(".pm-bk .bk", paddock).map((b) => rise(b, { y: null, delay: 320 })), meet = rise($(".pmeet", paddock), { delay: 410 });
    const sbk = $$(".ps-bk .bk", paddock).map((b) => rise(b, { y: null, delay: 460 }));
    const rules = $$(".prule", paddock).map((r, i) => rise(r, { axis: "x", delay: 460 + (i + 1) * 90 }));
    const rows = $$(".prow", paddock).map((r, i) => ({ row: rise(r, { delay: 460 + i * 90 + 40 }), fig: split($("strong", r), { mode: "letters", stagger: 24, cfg: CFG.FIGURE }), d: 460 + i * 90 + 120 }));
    onceInView($(".ppanel", paddock), () => { mbk.forEach((b) => b.play()); meet.play(); sbk.forEach((b) => b.play()); rules.forEach((r) => r.play()); rows.forEach((r) => { r.row.play(); r.fig.play(r.d); }); }, "0% 0% -20% 0%");

    const calEl = $(".cal", paddock);
    const links = $$(".cal-link", calEl).map((l, i) => rise(l, { axis: "x", delay: 560 + i * 90 }));
    const cards = $$(".cal-card", calEl).map((c, i) => ({ c: rise(c, { y: "0.5rem", delay: 560 + i * 90 }), n: rise($(".n", c), { y: "0.3em", cfg: CFG.NAME, delay: 560 + i * 90 + 110 }) }));
    const marks = $$(".cal-mark", calEl).map((m, i) => rise(m, { y: null, delay: 560 + i * 90 + 60 }));
    const liveB = rise($(".cal-live", calEl), { y: null, delay: 560 + 5 * 90 });
    onceInView(calEl, () => { links.forEach((l) => l.play()); cards.forEach(({ c, n }) => { c.play(); n.play(); }); marks.forEach((m) => m.play()); liveB.play(); }, "0% 0% -20% 0%");
    const liveCard = $(".cal-card.live", calEl);
    liveCard?.addEventListener("mouseenter", () => calEl.style.setProperty("--bracket-spread", px(5)));
    liveCard?.addEventListener("mouseleave", () => calEl.style.removeProperty("--bracket-spread"));

    const live = tracker(paddock), linkEls = $$(".cal-link", calEl), pulse = $(".pulse", calEl);
    let clock = 0, last = 0;
    subscribe((t) => {
      const dt = last ? Math.min(100, t - last) : 0; last = t;
      if (!live.live() || REDUCED) return; clock += dt;
      const c = (clock % 5200) / 5200;
      linkEls.forEach((l) => (l.style.backgroundPositionX = `calc(${px(11.45)} * ${(c * l.dataset.dir).toFixed(4)})`));
      if (pulse) { const v = (clock % 3200) / 3200, e = 1 - (1 - v) * (1 - v); pulse.setAttribute("r", (5.5 + e * 5.5 * 3.4).toFixed(2)); pulse.setAttribute("opacity", (0.5 * (1 - e) ** 2).toFixed(3)); }
    });
  }, []);

  return (
    <section data-paddock id="work" ref={ref}>
      <canvas className="checker top30" aria-hidden="true" />
      <canvas className="contours" aria-hidden="true" />
      <div className="band" aria-hidden="true" />
      <div className="feat-layer"><div className="feat">
        <div className="feat-fill">
          <dl className="feat-skills">
            <div className="feat-bar" aria-hidden="true"><i /><i /><i /></div>
            {F.skills.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <PlateOutline />
      </div></div>
      <div className="melt" aria-hidden="true" />
      <Headline className="pad-head display" lines={F.title} />
      <div className="pad-intro">
        <p className="pad-report">{F.report}</p>
        <div className="pad-cta"><Slab label={F.cta[0]} href={F.cta[1]} kind="slab" w={217} h={50} cut={8} /></div>
      </div>
      <div className="ppanel">
        <div className="pm-bk"><Brackets l={frameLeft} r={frameRight} t={U(32)} b={U(105)} /></div>
        <div className="pcol pmeet" style={{ left: `calc(100% - ${colRight} - ${U(colW)})`, top: U(43) }}>
          <b>{F.meeting[0]}</b><span>{F.meeting[1]}</span><span>{F.meeting[2]}</span>
        </div>
        <div className="ps-bk"><Brackets l={frameLeft} r={frameRight} t={U(137)} b={U(535)} /></div>
        <div className="pcol pstats" style={{ left: `calc(100% - ${colRight} - ${U(colW)})`, top: U(147) }}>
          {F.stats.map(([ic, l, v], i) => (
            <div key={l} style={{ display: "contents" }}>
              {i > 0 && <div className="prule" />}
              <div className="prow">{STAT_ICONS[ic]}<span><small>{l}</small><strong>{v}</strong></span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="cal">
        {LINKS.map(([x, w], i) => (
          <i key={i} className="cal-link" data-dir={i < liveIdx ? 1 : -1} style={{ left: spread(x), width: `calc(${px(w)} * var(--cal-spread, 1))` }} />
        ))}
        {cal.map((c, i) => { const [x, w] = CX[i]; return (
          <div key={c.name} className={`cal-card${c.live ? " live" : ""}`} style={{ left: `calc(${spread(x + w / 2)} - var(--cal-card-w, ${px(w)}) / 2)`, width: `var(--cal-card-w, ${px(w)})` }}>
            <span className="r">{c.round}</span><span className="n">{c.name}</span><span className="d">{c.date}</span>
          </div>
        ); })}
        {cal.map((c, i) => { const [x, w] = CX[i]; return (
          <div key={c.name} className="cal-mark" style={{ left: spread(x + w / 2) }}>
            {c.mark ? <b>{c.mark}</b> : (
              <svg viewBox="0 0 11 11">{c.live
                ? <><circle className="pulse" cx="5.5" cy="5.5" r="5.5" fill="none" stroke="var(--accent)" vectorEffect="non-scaling-stroke" /><circle cx="5.5" cy="5.5" r="5.5" fill="var(--accent)" /></>
                : <circle cx="5.5" cy="5.5" r="5" fill="none" stroke="#fff" />}</svg>
            )}
          </div>
        ); })}
        <div className="cal-live" aria-hidden="true">
          <Brackets
            l={`calc(${spread(CX[liveIdx][0] - 6)} - var(--bracket-spread, 0px))`}
            r={`calc(${spread(CX[liveIdx][0] + CX[liveIdx][1] + 6)} + var(--bracket-spread, 0px))`}
            t="calc(var(--u) * 32 - var(--bracket-spread, 0px))"
            b="calc(var(--u) * 113 + var(--bracket-spread, 0px) + var(--cal-mark-drop, 0px))" />
        </div>
      </div>
    </section>
  );
}
