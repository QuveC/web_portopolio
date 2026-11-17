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
  // cv: true — the three certifications listed on the CV, flagged on the plate
  { img: cert("cert-12.jpg"), title: "Junior Web Developer", issuer: "BNSP · LSP Informatika", date: "24 Apr 2024", kind: "competency", note: "national certification · competent", cv: true },
  { img: cert("cert-11.png"), title: "Frontend Internship", issuer: "PT Dimensi Kreasi Nusantara", date: "25 Jul – 4 Dec 2023", kind: "internship", note: "certificate of participation" },
  { img: cert("cert-10.jpg"), title: "Laravel BookStore App", issuer: "Ginvo Studio", date: "19 Jul 2023", kind: "competency", note: "laravel & adminlte · highly competent", cv: true },
  { img: cert("cert-07.jpg"), title: "Java CRUD Application", issuer: "PT 7Sky Global Solution", date: "19 Dec 2022", kind: "competency", note: "java · apache netbeans · competent", cv: true },
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

/* Projects — screens and links from https://sites.google.com/view/ahmadaqiela/portopolio
   The first entry is shown large as the featured project. */
const shot = (slug, n) => asset(`assets/projects/${slug}/${String(n).padStart(2, "0")}.jpg`);
const screens = (slug, caps) => caps.map((cap, i) => ({ img: shot(slug, i + 1), cap }));
export const PROJECTS = [
  { slug: "pokusduls", title: "PokusDuls", kind: "web app · ai", tag: "llm chatbot",
    desc: "A study companion built around an AI study assistant chatbot, with reminders, a pomodoro timer, Feynman and active-recall study modes, and progress statistics.",
    stack: ["LLM chatbot", "Web app", "Auth"], cover: 2,
    screens: screens("pokusduls", ["login", "ai study assistant chatbot", "pomodoro focus timer"]) },
  { slug: "dots", title: "Dots Mobile", kind: "mobile app", tag: "react native",
    desc: "A cooperative banking app: login and dashboard, savings products, transaction history, visit reservations and account settings — built during the internship.",
    stack: ["React Native", "Expo", "REST API"], cover: 1,
    source: "https://github.com/ahmaddddddddddd/dots-customer-fe-v2",
    screens: screens("dots", ["login & dashboard", "products & savings", "settings"]) },
  { slug: "cms", title: "Company CMS", kind: "website + cms", tag: "next.js",
    desc: "A company-profile website with a headless CMS: Next.js on the front, Strapi as the dashboard for offices, media, blog, financial reports and application forms.",
    stack: ["Next.js", "Strapi", "CMS"], cover: 4, coverTop: true,
    source: "https://github.com/rizwaradnan03/website-template-2",
    screens: screens("cms", ["strapi dashboard — offices", "strapi media library", "strapi content — about", "homepage, design 1", "homepage, design 2", "blog"]) },
  { slug: "bookstore", title: "BookStore", kind: "web app", tag: "laravel",
    desc: "An online bookstore with a catalogue, book detail pages and an admin area to add, edit and delete titles.",
    stack: ["Laravel", "PHP", "MySQL"], cover: 1,
    source: "https://drive.google.com/file/d/1YqLMUJGeT8RgCFHD2lrI1I045FIIhAU8/view?usp=sharing", sourceLabel: "download source",
    screens: screens("bookstore", ["home", "book detail", "admin — book list", "admin — add book", "admin — edit book"]) },
  { slug: "dashboard", title: "BookShop Admin", kind: "dashboard", tag: "laravel",
    desc: "An AdminLTE dashboard with authentication and full CRUD for customers, books and orders.",
    stack: ["Laravel", "AdminLTE", "MySQL"], cover: 3,
    source: "https://drive.google.com/file/d/1V9eQCxVTvHuxYMabyQIhi2wA_BzMKmTm/view?usp=sharing", sourceLabel: "download source",
    screens: screens("dashboard", ["login", "register", "customer list", "add customer", "edit customer"]) },
  { slug: "vincitore", title: "Vincitore", kind: "website", tag: "landing page",
    desc: "A language-course website: landing page, home page, class detail and a registration form.",
    stack: ["HTML", "CSS", "JavaScript"], cover: 2, coverTop: true,
    screens: screens("vincitore", ["registration page", "landing page", "home & class detail"]) },
  { slug: "wedding", title: "Wedding Invitation", kind: "website", tag: "vite.js",
    desc: "A digital wedding invitation with an opening cover screen and a single-page main invitation.",
    stack: ["Vite.js", "JavaScript", "CSS"], cover: 1,
    source: "https://drive.google.com/drive/folders/1ONegImkXlvbwhrZTe_vUZvcTtkAFinz4?usp=drive_link", sourceLabel: "download source",
    screens: screens("wedding", ["opening screen", "main invitation"]) },
  { slug: "starbuck", title: "Coffee Shop Page", kind: "website", tag: "html · css · js",
    desc: "A coffee-shop landing page built from scratch with plain HTML, CSS and JavaScript.",
    stack: ["HTML", "CSS", "JavaScript"], cover: 1, coverTop: true,
    source: "https://drive.google.com/drive/folders/1ONegImkXlvbwhrZTe_vUZvcTtkAFinz4?usp=drive_link", sourceLabel: "download source",
    screens: screens("starbuck", ["landing page"]) },
];

export const CONFIG = {
  first: "Ahmad", last: "Aqiela", initials: "AA", handle: "jr_software_dev",
  brand: ["AA", "Aqiela", "dev"],
  meta: [["flag", "Bogor, Indonesia"], ["spark", "junior software developer"], ["dot", "open to remote roles"]],
  nav: [["about", "#year"], ["experience", "#journey"], ["skills", "#work"], ["projects", "#projects"], ["certificates", "#certs"], ["contact", "#contact"]],
  navCta: ["download cv", CV_PDF],
  now: { eyebrow: "currently", title: "research assistant", line: "gen ai & software eng.", datetime: "2026-07-13", date: "since 13 jul 2026" },
  stats: [["Roles", "4"], ["Projects", String(PROJECTS.length)], ["Certs", String(CERTIFICATES.length)]],
  cv: { label: "download cv", meta: "pdf · 2026", href: CV_PDF },
  primaryCta: ["view projects", "#projects"],
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
    // Chronological, top → bottom, straight from the CV. kind is the eyebrow on the plate.
    entries: [
      { year: "2022", frame: "side", align: "left", kind: "certificate", title: "java crud", tag: "pt 7sky global solution · competent", img: cert("cert-07.jpg") },
      { year: "2023", frame: "centre", kind: "experience", title: "frontend intern", tag: "pt dimensi kreasi nusantara · 25 jul – 4 dec 2023",
        lead: "Frontend Developer Intern.", copy: "PT Dimensi Kreasi Nusantara. Designed mobile application screens in React Native, implemented CRUD features and debugged application bugs.", cw: 284 },
      { year: "2023", frame: "side", align: "right", kind: "certificate", title: "laravel", tag: "ginvo studio · highly competent", img: cert("cert-10.jpg") },
      { year: "2024", frame: "centre", kind: "experience", title: "frontend developer", tag: "contract · 12 jan – 4 mar 2024",
        lead: "Frontend Developer (Contract).", copy: "PT Dimensi Kreasi Nusantara. Converted designs into web pages, designed website layouts, built REST API endpoints and fixed website issues.", cw: 284 },
      { year: "2024", frame: "side", align: "left", kind: "certificate", title: "bnsp", tag: "national certification · competent", img: cert("cert-12.jpg") },
      { year: "2024", frame: "centre", kind: "education", title: "telkom university", tag: "bachelor of informatics · 2024 – present",
        lead: "Telkom University.", copy: "Bachelor of Informatics, Faculty of Informatics. Focus on full stack development — React JS, FastAPI and PostgreSQL.", cw: 260 },
      { year: "2026", frame: "centre", kind: "experience", title: "research assistant", tag: "generative ai & software eng. · since 13 jul 2026",
        lead: "Research Assistant.", copy: "Generative AI & Software Engineering, Telkom University. Scrape and collect new data for research use.", cw: 284 },
      { year: "2026", frame: "centre", kind: "experience", title: "teaching assistant", tag: "information systems eng. · since 6 oct 2026",
        lead: "Teaching Assistant.", copy: "Information Systems Engineering, Telkom University. Monitor and review students' final project progress across classes.", cw: 284 },
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
  // the stack, in practice — a strip of projects that leads into Selected Work; `live` gets the bracket and the pulse
  roadmap: [
    { round: "laravel", name: "bookstore", date: "web app", mark: "web" },
    { round: "vite.js", name: "wedding", date: "website", mark: "web" },
    { round: "next.js", name: "company cms", date: "strapi", mark: "web" },
    { round: "react native", name: "dots mobile", date: "banking app", mark: "app" },
    { round: "llm", name: "pokusduls", date: "ai app", live: true },
  ],
  projects: {
    title: ["selected", "work"],
    intro: "Web, mobile and AI projects — from a Laravel bookstore to a React Native banking app and an LLM-powered study assistant. Open any project to browse its screens.",
  },
  certs: {
    title: ["licenses", "& certificates"],
    intro: "Competency tests, national certification, courses and competitions — every certificate from the archive, in one place. Tap any plate to view it full size.",
  },
  footer: { title: ["get in touch", "with me"], cta: ["say hello", "mailto:ahmadaqiela123@gmail.com"] },
};
