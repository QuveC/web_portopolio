import { $, $$, CFG, REDUCED, onceInView, rise, split } from "./engine.js";

/** Arms a section once: headline words, the full stop, intro copy and the count rise in together. */
export function revealTop(section) {
  if (section.dataset.armed) return false;
  section.dataset.armed = "1";
  const heads = $$(".ed-head .hl", section).map((h) => split(h, { stagger: 110 }));
  const stopEl = $(".ed-head .stop", section);
  const stop = stopEl ? rise(stopEl, { y: null, delay: 240 }) : null;
  const introEl = $(".ed-intro", section);
  const intro = introEl ? split(introEl, { stagger: 22, cfg: CFG.COPY2, gap: 0.26 }) : null;
  const countEl = $(".ed-count", section);
  const count = countEl ? rise(countEl, { delay: 420 }) : null;
  onceInView($(".ed-head", section), () => {
    heads.forEach((h, i) => h.play(i * 130)); stop?.play(); intro?.play(260); count?.play();
  });
  return true;
}

/** Each row rises as it enters; hovering one dims the rest. */
export function revealRows(list, selector = ".row") {
  $$(selector, list).forEach((row) => {
    const r = rise(row, { y: "1.5rem", cfg: CFG.COPY });
    onceInView(row, () => r.play(), "0% 0% -10% 0%");
    if (matchMedia("(hover: hover)").matches && !REDUCED) {
      row.addEventListener("mouseenter", () => { list.classList.add("dimming"); row.classList.add("hot"); });
      row.addEventListener("mouseleave", () => { list.classList.remove("dimming"); row.classList.remove("hot"); });
    }
  });
}
