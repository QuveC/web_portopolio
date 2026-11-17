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
    desc: "Study app with an LLM chatbot tutor, reminders, a pomodoro timer, Feynman and active-recall modes, and progress statistics.",
    stack: ["LLM chatbot", "Web app", "Auth"], cover: 2,
    screens: screens("pokusduls", ["login", "ai study assistant chatbot", "pomodoro focus timer"]) },
  { slug: "dots", title: "Dots Mobile", kind: "mobile app", tag: "react native",
    desc: "Banking app for a savings cooperative: login, dashboard, savings products, transaction history, branch-visit booking and settings. Built during the internship.",
    stack: ["React Native", "Expo", "REST API"], cover: 1,
    source: "https://github.com/ahmaddddddddddd/dots-customer-fe-v2",
    screens: screens("dots", ["login & dashboard", "products & savings", "settings"]) },
  { slug: "cms", title: "Company CMS", kind: "website + cms", tag: "next.js",
    desc: "Company-profile site on Next.js with Strapi as the headless CMS for offices, media, blog posts, financial reports and application forms.",
    stack: ["Next.js", "Strapi", "CMS"], cover: 4, coverTop: true,
    source: "https://github.com/rizwaradnan03/website-template-2",
    screens: screens("cms", ["strapi dashboard — offices", "strapi media library", "strapi content — about", "homepage, design 1", "homepage, design 2", "blog"]) },
  { slug: "bookstore", title: "BookStore", kind: "web app", tag: "laravel",
    desc: "Book catalogue with detail pages and an admin area for adding, editing and deleting titles.",
    stack: ["Laravel", "PHP", "MySQL"], cover: 1,
    source: "https://drive.google.com/file/d/1YqLMUJGeT8RgCFHD2lrI1I045FIIhAU8/view?usp=sharing", sourceLabel: "download source",
    screens: screens("bookstore", ["home", "book detail", "admin — book list", "admin — add book", "admin — edit book"]) },
  { slug: "dashboard", title: "BookShop Admin", kind: "dashboard", tag: "laravel",
    desc: "AdminLTE dashboard with login, registration and CRUD for customers, books and orders.",
    stack: ["Laravel", "AdminLTE", "MySQL"], cover: 3,
    source: "https://drive.google.com/file/d/1V9eQCxVTvHuxYMabyQIhi2wA_BzMKmTm/view?usp=sharing", sourceLabel: "download source",
    screens: screens("dashboard", ["login", "register", "customer list", "add customer", "edit customer"]) },
  { slug: "vincitore", title: "Vincitore", kind: "website", tag: "landing page",
    desc: "Language-course site: landing page, home page, class detail and a registration form.",
    stack: ["HTML", "CSS", "JavaScript"], cover: 2, coverTop: true,
    screens: screens("vincitore", ["registration page", "landing page", "home & class detail"]) },
  { slug: "wedding", title: "Wedding Invitation", kind: "website", tag: "vite.js",
    desc: "Digital wedding invitation: an opening cover screen, then a single-page invitation.",
    stack: ["Vite.js", "JavaScript", "CSS"], cover: 1,
    source: "https://drive.google.com/drive/folders/1ONegImkXlvbwhrZTe_vUZvcTtkAFinz4?usp=drive_link", sourceLabel: "download source",
    screens: screens("wedding", ["opening screen", "main invitation"]) },
  { slug: "starbuck", title: "Coffee Shop Page", kind: "website", tag: "html · css · js",
    desc: "A coffee-shop landing page in plain HTML, CSS and JavaScript — no framework.",
    stack: ["HTML", "CSS", "JavaScript"], cover: 1, coverTop: true,
    source: "https://drive.google.com/drive/folders/1ONegImkXlvbwhrZTe_vUZvcTtkAFinz4?usp=drive_link", sourceLabel: "download source",
    screens: screens("starbuck", ["landing page"]) },
];

/* Experience — newest first, exactly as on the CV. No images: type does the work here. */
export const EXPERIENCE = [
  { role: "Research Assistant", org: "Telkom University", unit: "Generative AI & Software Engineering",
    start: "13 Jul 2026", end: "present", year: "2026",
    points: ["Scrape and collect new datasets for the group's research."] },
  { role: "Teaching Assistant", org: "Telkom University", unit: "Information Systems Engineering",
    start: "6 Oct 2026", end: "present", year: "2026",
    points: ["Monitor and review students' final-project progress across classes."] },
  { role: "Frontend Developer", org: "PT Dimensi Kreasi Nusantara", unit: "Contract",
    start: "12 Jan 2024", end: "4 Mar 2024", year: "2024",
    points: ["Sliced designs into web pages and laid out the company website.", "Built REST API endpoints.", "Debugged and fixed production issues on the site."] },
  { role: "Frontend Developer Intern", org: "PT Dimensi Kreasi Nusantara", unit: "Internship",
    start: "25 Jul 2023", end: "4 Dec 2023", year: "2023",
    points: ["Built mobile app screens in React Native (Dots Mobile).", "Implemented CRUD features.", "Debugged and fixed application bugs."] },
];

/* Education — Telkom University from the CV; SMK coursework from the old Google Site ("Here's what I've learned"). */
export const EDUCATION = [
  { school: "Telkom University", degree: "Bachelor of Informatics", unit: "Faculty of Informatics", start: "2024", end: "present",
    groups: [["focus", ["Full-stack web development", "REST APIs with FastAPI", "PostgreSQL", "LLM-based chatbots"]]] },
  { school: "SMK Pesat", degree: "Software Engineering (RPL)", unit: "Vocational high school", start: "2021", end: "2024",
    groups: [
      ["grade x", ["Hardware & Windows", "Office applications", "Basic programming in C++", "WordPress CMS", "UML system design", "SQL databases", "UI design & prototyping in Figma", "HTML, CSS, JS, Bootstrap"]],
      ["grade xi", ["PHP, Laravel & MySQL", "Desktop programming in Java (NetBeans)"]],
    ] },
];

export const CONFIG = {
  first: "Ahmad", last: "Aqiela", initials: "AA", handle: "jr_software_dev",
  brand: ["AA", "Aqiela", "dev"],
  meta: [["flag", "Bogor, Indonesia"], ["spark", "junior software developer"], ["dot", "open to remote roles"]],
  nav: [["about", "#year"], ["experience", "#experience"], ["education", "#education"], ["skills", "#skills"], ["projects", "#projects"], ["certificates", "#certs"]],
  navCta: ["view cv", "#cv"],
  now: { eyebrow: "currently", title: "research assistant", line: "gen ai & software eng.", datetime: "2026-07-13", date: "since 13 jul 2026" },
  stats: [["Roles", String(EXPERIENCE.length)], ["Projects", String(PROJECTS.length)], ["Certs", String(CERTIFICATES.length)]],
  cv: { label: "view cv", meta: "1 page · pdf", href: "#cv" },
  primaryCta: ["view projects", "#projects"],
  socials: [["linkedin", "https://www.linkedin.com/in/ahmad-aqiela-3489872a2/"], ["github", "https://github.com/QuveC"], ["inst", "https://www.instagram.com/_ahmd_aqla/"]],
  email: "ahmadaqiela123@gmail.com",
  phone: "+62 838 1837 5286",
  year: {
    title: ["about", "me"],
    intro: "Informatics student at Telkom University. I build full-stack apps with React, FastAPI and PostgreSQL — REST APIs, CRUD systems, a React Native banking app and an LLM study assistant. Looking for a remote junior developer role.",
    badge: ["INF", "/ TEL-U"],
    rows: [["BE", "python · fastapi"], ["FE", "react · next · rn"], ["DB", "postgresql · mysql."]],
  },
  experience: { title: ["work", "experience"], intro: "Four roles since 2023: two frontend positions in industry, two assistant roles at Telkom University." },
  education: { title: ["education", ""], intro: "Formal training in software engineering since 2021." },
  skills: {
    title: ["skills", "& stack"],
    intro: "React and Next.js on the front, FastAPI and SQLAlchemy on the back, PostgreSQL for data. Laravel and React Native for client work.",
    groups: [
      ["backend", ["Python", "FastAPI", "SQLAlchemy", "REST API"]],
      ["frontend", ["React JS", "Next JS", "React Native Expo", "HTML", "CSS", "JavaScript", "Bootstrap", "WordPress", "PHP"]],
      ["database", ["PostgreSQL", "MySQL"]],
      ["automation & tools", ["n8n", "Git", "GitHub"]],
    ],
  },
  projects: {
    title: ["selected", "work"],
    intro: "Eight builds: Laravel and Next.js web apps, a React Native banking app and an LLM study assistant. Open a project to see its screens.",
  },
  certs: {
    title: ["certificates", ""],
    intro: "BNSP Junior Web Developer certification, four vocational competency tests, three online courses, three events and one internship.",
  },
  footer: { title: ["open to", "remote work"], cta: ["email me", "mailto:ahmadaqiela123@gmail.com"] },
};
