/* =====================================================================
   CONTENT — edit everything personal here.
   Sources: cv_ahmad_aqiela.pdf (primary) and https://sites.google.com/view/ahmadaqiela
   (beranda, tentang saya, certifikat, portopolio)
   ===================================================================== */
export const asset = (p) => `${import.meta.env.BASE_URL}${p}`;

export const SITE = "https://sites.google.com/view/ahmadaqiela";
export const CV_PDF = asset("cv_ahmad_aqiela.pdf");
const cert = (file) => asset(`assets/certificates/${file}`);

/* Certificates — images taken from https://sites.google.com/view/ahmadaqiela/certifikat
   kind: "competency" | "course" | "event" | "internship" */
export const CERTIFICATES = [
  { img: cert("cert-12.jpg"), title: "Junior Web Developer", issuer: "BNSP · LSP Informatika", date: "24 Apr 2024", kind: "competency", note: "national certification · competent", portrait: true },
  { img: cert("cert-11.png"), title: "Frontend Internship", issuer: "PT Dimensi Kreasi Nusantara", date: "Jul – Dec 2023", kind: "internship", note: "certificate of participation" },
  { img: cert("cert-10.jpg"), title: "Laravel BookStore App", issuer: "Ginvo Studio", date: "19 Jul 2023", kind: "competency", note: "laravel & adminlte · highly competent" },
  { img: cert("cert-07.jpg"), title: "Java CRUD Application", issuer: "PT 7Sky Global Solution", date: "19 Dec 2022", kind: "competency", note: "java · apache netbeans · competent" },
  { img: cert("cert-09.jpg"), title: "Building a Landing Page", issuer: "PT WAN Teknologi Internasional", date: "", kind: "competency", note: "rekayasa perangkat lunak · competent" },
  { img: cert("cert-04.jpg"), title: "Web Dev Competition", issuer: "IDN IT Fest 2022", date: "17 Sep 2022", kind: "event", note: "semifinalist" },
  { img: cert("cert-02.jpg"), title: "JavaScript Fundamentals", issuer: "Dicoding Indonesia", date: "03 Sep 2022", kind: "course", note: "belajar dasar pemrograman javascript" },
  { img: cert("cert-06.jpg"), title: "ASEAN Data Science", issuer: "Sakubi Academy · Yayasan Fatihunnur", date: "30 Jun 2022", kind: "course", note: "passed with a score of 85" },
  { img: cert("cert-01.jpg"), title: "Data Science Explorers", issuer: "SAP · ASEAN Foundation", date: "2022", kind: "event", note: "enablement session" },
  { img: cert("cert-03.png"), title: "HTML Course", issuer: "Sololearn", date: "05 Feb 2022", kind: "course", note: "course certificate" },
  { img: cert("cert-05.jpg"), title: "CreatOnMe Training", issuer: "Ecofun Indonesia · Maybank Foundation", date: "Dec 2021", kind: "event", note: "8-day game-based training" },
  { img: cert("cert-08.jpg"), title: "C++ Data Processing", issuer: "Morfo", date: "10 Feb 2021", kind: "competency", note: "uji kompetensi · competent" },
];
export const CERT_KINDS = [
  ["all", "all"], ["competency", "competency"], ["course", "courses"], ["event", "events & competitions"], ["internship", "internship"],
];

export const CONFIG = {
  first: "Ahmad", last: "Aqiela", initials: "AA", handle: "jr_software_dev",
  brand: ["AA", "Aqiela", "dev"],
  meta: [["flag", "Bogor, Indonesia"], ["spark", "junior software developer"], ["dot", "open to remote roles"]],
  nav: [["about", "#top"], ["summary", "#year"], ["experience", "#journey"], ["skills", "#work"], ["certificates", "#certs"], ["contact", "#contact"]],
  navCta: ["download cv", CV_PDF],
  now: { eyebrow: "currently", title: "research assistant", line: "gen ai & software eng.", datetime: "2026-07-13", date: "since 13 jul 2026" },
  stats: [["Roles", "4"], ["Projects", "8"], ["Certs", String(CERTIFICATES.length)]],
  cv: { label: "download cv", meta: "pdf · 2026", href: CV_PDF },
  primaryCta: ["view experience", "#journey"],
  socials: [["linkedin", "https://www.linkedin.com/in/ahmad-aqiela-3489872a2/"], ["github", "https://github.com/QuveC"], ["inst", "https://www.instagram.com/_ahmd_aqla/"]],
  email: "ahmadaqiela123@gmail.com",
  year: {
    title: ["about", "me"],
    intro: "Informatics undergraduate at Telkom University with a focus on full stack development (React JS, FastAPI, PostgreSQL). Experienced in building REST APIs, CRUD systems, and web and mobile applications, as well as LLM-based chatbot development. Comfortable with Git, debugging, and working in a team. Looking for a remote junior software developer role.",
    badge: ["INF", "/ TEL-U"],
    rows: [["BE", "python · fastapi"], ["FE", "react · next · rn"], ["DB", "postgresql · mysql."]],
  },
  journey: {
    title: ["experience", "& education"],
    // frame: "centre" | "side"; side rows need align "left" | "right"; img (any URL) and href are optional
    entries: [
      { year: "2022", frame: "side", align: "right", title: "java crud", tag: "certificate · pt 7sky global solution · competent", img: cert("cert-07.jpg") },
      { year: "2023", frame: "centre", title: "frontend intern", tag: "pt dimensi kreasi nusantara", lead: "Frontend Developer Intern.", copy: "PT Dimensi Kreasi Nusantara · Jul – Dec 2023. Designed mobile application screens in React Native, implemented CRUD features and fixed application bugs.", cw: 284, img: cert("cert-11.png") },
      { year: "2023", frame: "side", align: "left", title: "laravel", tag: "certificate · ginvo studio · highly competent", img: cert("cert-10.jpg") },
      { year: "2024", frame: "centre", title: "frontend developer", tag: "contract · pt dimensi kreasi nusantara", lead: "Frontend Developer (Contract).", copy: "PT Dimensi Kreasi Nusantara · Jan – Mar 2024. Sliced designs into web pages, designed layouts, built REST API endpoints and fixed website issues.", cw: 284 },
      { year: "2024", frame: "side", align: "right", title: "bnsp", tag: "national certification · competent", img: cert("cert-12.jpg") },
      { year: "2024", frame: "centre", title: "telkom university", tag: "bachelor of informatics", lead: "Telkom University.", copy: "2024 – present. Bachelor of Informatics, Faculty of Informatics.", cw: 260 },
      { year: "2026", frame: "side", align: "left", title: "teaching assistant", tag: "information systems engineering · since oct 2026" },
      { year: "2026", frame: "centre", title: "research assistant", tag: "generative ai & software engineering", lead: "Research Assistant.", copy: "Generative AI & Software Engineering, Telkom University · since Jul 2026. Scraping and collecting new data for research.", cw: 284 },
    ],
  },
  featured: {
    title: ["skills", "& stack"],
    report: "Full stack focus — React JS, FastAPI and PostgreSQL. REST APIs, CRUD systems, web and mobile apps, and LLM-based chatbots.",
    cta: ["download cv", CV_PDF],
    skills: [
      ["backend", "Python · FastAPI · SQLAlchemy · REST API"],
      ["frontend", "React JS · Next JS · React Native Expo · HTML · CSS · JavaScript · Bootstrap · WordPress · PHP"],
      ["database", "PostgreSQL · MySQL"],
      ["automation & tools", "n8n · Git · GitHub"],
    ],
    meeting: ["junior software developer", "bogor, indonesia", "open to remote"],
    stats: [["flag", "backend", "python"], ["bars", "frontend", "react"], ["trophy", "database", "sql"], ["gauge", "automation", "n8n"]],
  },
  // selected projects strip; `live` gets the bracket and the pulse
  roadmap: [
    { round: "web", name: "bookstore", date: "laravel", mark: "web" },
    { round: "web", name: "dashboard", date: "laravel", mark: "web" },
    { round: "web", name: "wedding", date: "vite.js", mark: "web" },
    { round: "web", name: "company profile", date: "next.js", mark: "web" },
    { round: "mobile", name: "dots mobile", date: "react native", live: true },
  ],
  certs: {
    title: ["licenses", "& certificates"],
    intro: "Competency tests, national certification, courses and competitions — every certificate from the archive, in one place. Tap any plate to view it full size.",
  },
  footer: { title: ["get in touch", "with me"], cta: ["say hello", "mailto:ahmadaqiela123@gmail.com"] },
};
