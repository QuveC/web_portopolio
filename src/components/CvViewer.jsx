import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CERTIFICATES, CONFIG, CV_PDF, EDUCATION, EXPERIENCE } from "../config.js";
import { CFG, Spring, scroller } from "../lib/engine.js";

/* Any link to "#cv" opens the viewer (App routes the click here). */
export const openCv = () => dispatchEvent(new CustomEvent("cv:open"));

function Page() {
  const C = CONFIG;
  return (
    <article className="cv-page">
      <h2 className="cv-name">{C.first} {C.last}</h2>
      <p className="cv-role">Junior Software Developer · Bogor, Indonesia</p>
      <p className="cv-contact">
        <a href={`mailto:${C.email}`}>{C.email}</a>
        <span>{C.phone}</span>
        {C.socials.slice(0, 2).map(([l, h]) => <a key={l} href={h} target="_blank" rel="noopener">{l} ↗</a>)}
      </p>

      <section className="cv-sec"><h3>summary</h3><p>{C.year.intro}</p></section>

      <section className="cv-sec">
        <h3>experience</h3>
        <div>
          {EXPERIENCE.map((x) => (
            <div className="cv-item" key={x.role + x.start}>
              <div className="cv-item-head"><b>{x.role}</b><span>{x.start} — {x.end}</span></div>
              <p className="cv-item-sub">{x.org} · {x.unit}</p>
              <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="cv-sec">
        <h3>education</h3>
        <div>
          {EDUCATION.map((e) => (
            <div className="cv-item" key={e.school}>
              <div className="cv-item-head"><b>{e.school}</b><span>{e.start} — {e.end}</span></div>
              <p className="cv-item-sub">{e.degree} · {e.unit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cv-sec">
        <h3>skills</h3>
        <dl className="cv-skills">
          {C.skills.groups.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v.join(", ")}</dd></div>)}
        </dl>
      </section>

      <section className="cv-sec">
        <h3>certifications</h3>
        <div>
          {CERTIFICATES.filter((c) => c.cv).map((c) => (
            <div className="cv-item" key={c.title}>
              <div className="cv-item-head"><b>{c.title}</b><span>{c.date}</span></div>
              <p className="cv-item-sub">{c.issuer} · {c.note}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export default function CvViewer() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("page");
  const ref = useRef(null), spring = useRef(null), closeBtn = useRef(null), returnTo = useRef(null);

  useEffect(() => {
    const onOpen = () => { returnTo.current = document.activeElement; setTab("page"); setOpen(true); };
    addEventListener("cv:open", onOpen);
    return () => removeEventListener("cv:open", onOpen);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const el = ref.current;
    spring.current = new Spring(0, CFG.SHEET, (p) => (el.style.opacity = p)).to(1);
    closeBtn.current.focus();
    scroller.lenis?.stop(); document.documentElement.classList.add("locked");
    return () => { document.documentElement.classList.remove("locked"); scroller.lenis?.start(); returnTo.current?.focus?.(); };
  }, [open]);

  const close = useCallback(() => {
    const el = ref.current, s = spring.current;
    if (!s) return;
    s.onUpdate = (p) => { el.style.opacity = p; if (p <= 0.001) setOpen(false); };
    s.to(0);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;
  return createPortal(
    <div ref={ref} className="cv" role="dialog" aria-modal="true" aria-label="Curriculum vitae" data-lenis-prevent>
      <div className="cv-bar">
        <div className="cv-tabs" role="group" aria-label="CV format">
          <button type="button" aria-pressed={tab === "page"} onClick={() => setTab("page")}>read here</button>
          <button type="button" aria-pressed={tab === "pdf"} onClick={() => setTab("pdf")}>original pdf</button>
        </div>
        <div className="cv-actions">
          <a className="text-link" href={CV_PDF} download="Ahmad-Aqiela-CV.pdf">download pdf ↓</a>
          <a className="text-link" href={CV_PDF} target="_blank" rel="noopener">open in new tab ↗</a>
          <button ref={closeBtn} type="button" className="lb-close" aria-label="Close CV" onClick={close}><i /><i /></button>
        </div>
      </div>
      {tab === "page" ? (
        <div className="cv-scroll"><Page /></div>
      ) : (
        <div className="cv-pdf">
          <object data={`${CV_PDF}#view=FitH`} type="application/pdf" aria-label="CV as PDF">
            <div className="cv-pdf-fallback">
              <p>This browser can't show PDFs inline.</p>
              <a className="text-link" href={CV_PDF} target="_blank" rel="noopener">open the pdf ↗</a>
            </div>
          </object>
        </div>
      )}
    </div>,
    document.body,
  );
}
