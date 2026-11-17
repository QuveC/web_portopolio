/* Markup helpers — the shared SVG pieces of the design language */
import { CONFIG } from "../config.js";

export const Arrow = () => (
  <svg className="cta-arrow" viewBox="0 0 13.7071 10.7071" aria-hidden="true"><path d="M0 5.35355H13M8 10.3536L13 5.35355L8 0.353553" /></svg>
);

export const Corners = () =>
  ["tl", "tr", "bl", "br"].map((c) => (
    <svg key={c} className={`corner ${c}`} viewBox="0 0 10.5 10.5" aria-hidden="true"><path d="M0 0.5H10V10.5" /></svg>
  ));

const PLATE_OUTLINE = "M13.6168 0.497469H697.378C700.858 0.497469 704.195 1.38786 706.655 2.97277C709.115 4.55769 710.498 6.70729 710.498 8.94869V411.208C710.498 413.449 709.115 415.599 706.655 417.183C704.195 418.768 700.858 419.659 697.378 419.659H460.249C454.073 419.659 447.976 420.555 442.411 422.281C436.847 424.008 431.958 426.519 428.107 429.63L399.246 452.95C395.559 455.928 390.878 458.333 385.55 459.986C380.223 461.639 374.385 462.497 368.472 462.497H13.6168C10.1373 462.497 6.80038 461.607 4.34003 460.022C1.87968 458.437 0.497469 456.288 0.497469 454.046V8.94869C0.497469 6.70729 1.87968 4.55769 4.34003 2.97277C6.80038 1.38786 10.1373 0.497469 13.6168 0.497469Z";
export const PlateOutline = () => (
  <svg className="plate-outline" viewBox="0 0 710.995 462.995" preserveAspectRatio="none" aria-hidden="true"><path d={PLATE_OUTLINE} /></svg>
);

/** shared clip for the stepped-corner plates */
export const PlateClip = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <clipPath id="plate-clip" clipPathUnits="objectBoundingBox">
      <path d="M 0.01915,0.00107H 0.98085C 0.98574,0.00107 0.99044,0.00300 0.99390,0.00642C 0.99736,0.00984 0.99930,0.01449 0.99930,0.01933V 0.88815C 0.99930,0.89299 0.99736,0.89763 0.99390,0.90105C 0.99044,0.90448 0.98574,0.90640 0.98085,0.90640H 0.64733C 0.63864,0.90640 0.63007,0.90834 0.62224,0.91206C 0.61442,0.91579 0.60754,0.92122 0.60212,0.92794L 0.56153,0.97830C 0.55635,0.98474 0.54976,0.98993 0.54227,0.99350C 0.53478,0.99707 0.52656,0.99892 0.51825,0.99892H 0.01915C 0.01426,0.99892 0.00956,0.99700 0.00610,0.99358C 0.00264,0.99016 0.00070,0.98551 0.00070,0.98067V 0.01933C 0.00070,0.01449 0.00264,0.00984 0.00610,0.00642C 0.00956,0.00300 0.01426,0.00107 0.01915,0.00107Z" />
    </clipPath>
  </svg>
);

export const chamfer = (w, h, cut) => `M0.5 0.5H${w - 0.5}V${h - cut}L${w - cut} ${h - 0.5}H0.5Z`;
const external = (href) => !href.startsWith("#") && !href.startsWith("mailto:");

/** chamfered button: kind "slab" | "hollow" */
export function Slab({ label, href, kind, w, h, cut }) {
  const d = chamfer(w, h, cut);
  return (
    <a className={`cta cta--${kind}`} href={href} {...(external(href) ? { target: "_blank", rel: "noopener" } : {})}>
      <svg className="cta-frame" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true"><path className="cta-outline" d={d} /><path className="cta-flood" d={d} /></svg>
      <span className="cta-label">{label}<Arrow /></span>
    </a>
  );
}

export const Logo = () => (
  <a className="logo" href="#top" aria-label={`${CONFIG.first} ${CONFIG.last} — home`}>
    <b>{CONFIG.brand[0]}</b><span>{CONFIG.brand[1]}<em>.</em>{CONFIG.brand[2]}</span>
  </a>
);

export const ICONS = {
  flag: <svg width="18" height="12" viewBox="0 0 18 12" style={{ width: "1.125rem", height: ".75rem" }} aria-hidden="true"><rect width="18" height="6" fill="#e70011" /><rect y="6" width="18" height="6" fill="#fff" /><rect x=".25" y=".25" width="17.5" height="11.5" fill="none" stroke="#dfe5e9" strokeWidth=".5" /></svg>,
  spark: <svg viewBox="0 0 16 16" style={{ width: "1rem", height: "1rem" }} aria-hidden="true"><path d="M8 0L9.6 6.4L16 8L9.6 9.6L8 16L6.4 9.6L0 8L6.4 6.4Z" fill="currentColor" /></svg>,
  dot: <svg viewBox="0 0 14 14" style={{ width: ".875rem", height: ".875rem" }} aria-hidden="true"><circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" /><circle cx="7" cy="7" r="3" fill="var(--accent)" /></svg>,
};

/** a two-line display headline with the accent full stop */
export const Headline = ({ as: Tag = "h2", className, lines }) => {
  const stop = <span className="stop" aria-hidden="true">.</span>;
  return (
    <Tag className={className}>
      <span className="head-line"><span className="hl">{lines[0]}</span>{!lines[1] && stop}</span>
      {lines[1] && <span className="head-line"><span className="hl">{lines[1]}</span>{stop}</span>}
    </Tag>
  );
};
