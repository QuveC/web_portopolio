import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { REDUCED, runScrubs, scroller, setPreFrame } from "./lib/engine.js";
import Veil from "./components/Veil.jsx";
import Hero from "./components/Hero.jsx";
import Season from "./components/Season.jsx";
import Experience from "./components/Experience.jsx";
import Education from "./components/Education.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import CvViewer, { openCv } from "./components/CvViewer.jsx";
import Certificates from "./components/Certificates.jsx";
import Footer from "./components/Footer.jsx";
import { PlateClip } from "./components/ui.jsx";

/* the sticky stack — each covered layer recedes */
function useStack(ref) {
  useEffect(() => {
    const layers = [...ref.current.querySelectorAll(":scope > .layer")];
    const pinned = layers.slice(0, -1).map((l, i) => ({ inner: l.querySelector(".layer-inner"), shade: l.querySelector(".shade"), next: layers[i + 1] }));
    const phone = matchMedia("(max-width: 639px)");
    let queued = false;
    const apply = () => {
      queued = false;
      const view = innerHeight || 1, shrink = phone.matches ? 0 : 0.1;
      for (const { inner, shade, next } of pinned) {
        const p = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / view));
        inner.style.transform = p > 0 && shrink > 0 ? `scale(${1 - shrink * p})` : "";
        inner.style.willChange = p > 0 && shrink > 0 ? "transform" : "";
        shade.style.opacity = `${0.55 * p}`;
        inner.style.visibility = p >= 1 ? "hidden" : "visible";
      }
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(apply); } };
    addEventListener("scroll", queue, { passive: true }); addEventListener("resize", queue); apply();
    return () => { removeEventListener("scroll", queue); removeEventListener("resize", queue); };
  }, [ref]);
}

export default function App() {
  const stack = useRef(null), errors = useRef(null);
  useStack(stack);

  useEffect(() => {
    /* root font above 1920 */
    const rootScale = () => { document.documentElement.style.fontSize = innerWidth > 1920 ? `${(16 * innerWidth) / 1920}px` : ""; };
    rootScale(); addEventListener("resize", rootScale);

    /* smooth scroll */
    if (!REDUCED && !scroller.lenis) {
      scroller.lenis = new Lenis({ smoothWheel: true });
      setPreFrame((t) => scroller.lenis.raf(t));
    }

    /* in-page anchors land on the layer, through lenis */
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute("href"); if (id.length < 2) return;
      if (id === "#cv") { e.preventDefault(); openCv(); return; }
      const target = document.querySelector(id); if (!target) return;
      e.preventDefault();
      const top = target.closest(".layer")?.offsetTop ?? target.getBoundingClientRect().top + scrollY;
      scroller.lenis ? scroller.lenis.scrollTo(top) : scrollTo({ top, behavior: REDUCED ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);

    /* surface broken images */
    const onError = (e) => {
      if (e.target.tagName !== "IMG") return;
      const d = document.createElement("div"); d.textContent = `Failed to load: ${e.target.src}`; errors.current.append(d);
      console.log()
    };
    document.addEventListener("error", onError, true);

    requestAnimationFrame(() => runScrubs(true));
    return () => {
      removeEventListener("resize", rootScale);
      document.removeEventListener("click", onClick);
      document.removeEventListener("error", onError, true);
    };
  }, []);

  return (
    <>
      <div id="asset-errors" ref={errors} aria-live="polite" />
      <PlateClip />
      <Veil />
      <CvViewer />
      <main>
        <div className="stack" ref={stack}>
          <div className="layer"><div className="layer-inner"><Hero /></div><div className="shade" /></div>
          <div className="layer"><div className="layer-inner"><Season /></div><div className="shade" /></div>
          <div className="layer last"><Experience /></div>
        </div>
        <Education />
        <Skills />
        <Projects />
        <Certificates />
        <Footer />
      </main>
    </>
  );
}
