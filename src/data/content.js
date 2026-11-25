// All portfolio text, links and image paths live here.
// Edit this file to change content; components only handle layout and motion.

import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  SiDotnet,
  SiFigma,
  SiMongodb,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { TbApi, TbBrandCSharp, TbTestPipe } from "react-icons/tb";

import portraitFallback from "../Asset/SamG.webp";
import bloodBankImg from "../Asset/bb4.webp";
import ecomImg from "../Asset/ecom.webp";
import figmaImg from "../Asset/ui2.webp";
import itTicketingImg from "../Asset/it-ticketing.webp";
import academicMgmtImg from "../Asset/academic-mgmt.webp";

const pub = (file) => `${process.env.PUBLIC_URL}/images/${file}`;

// ---------------------------------------------------------------------------
// Images. Add each file to /public/images/ and flip `ready` to true.
// Until then a styled placeholder is shown (no broken-image requests).
// ---------------------------------------------------------------------------
export const images = {
  heroCity: { src: pub("hero-city.webp"), ready: false },
  // Until me-cutout is ready, the existing transparent portrait is used.
  portrait: { src: pub("me-cutout.webp"), ready: true, fallback: portraitFallback },
};

export const person = {
  firstName: "SAMUEL",
  lastName: "G.",
  fullName: "Samuel G",
  role: "IT Executive",
  email: "sam324240@gmail.com",
  phone: "+91 6382209943",
  phoneHref: "tel:+916382209943",
  location: "Tamil Nadu, India",
  resume: "https://drive.google.com/file/d/1AV2FsHBTIXiuQzS6zc2w_RYb_GloSlm_/view?usp=drive_link",
};

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/samuel-g-696b5726a/", Icon: FaLinkedin },
  { label: "GitHub", href: "https://github.com/2001701033036", Icon: FaGithub },
];

// Sections in page order. Drives the navbar, dot nav, HUD status and step label.
export const sections = [
  { id: "prologue", label: "Prologue", nav: true, status: "SYSTEM ONLINE // PROLOGUE", step: "00. PROLOGUE" },
  { id: "about", label: "About", nav: true, status: "LOADING PROFILE // ABOUT", step: "00. THE HUMAN" },
  {
    id: "story",
    label: "Process",
    nav: false,
    status: "TRANSITIONING TO DESIGN",
    step: "01. DESIGN ARCHITECTURE",
    back: { status: "TRANSITIONING TO CLIENT SUCCESS", step: "04. CLIENT SUCCESS" },
  },
  { id: "work", label: "Work", nav: true, status: "INDEXING PROJECTS // WORK", step: "05. SELECTED WORK" },
  { id: "contact", label: "Contact", nav: true, status: "OPEN CHANNEL // CONTACT", step: "06. CONTACT" },
];

export const capabilities = [
  { title: "UI / UX Design", detail: "Figma wireframes, templates & flow charts" },
  { title: "Front-end", detail: "ReactJS & Tailwind CSS" },
  { title: "Back-end", detail: "ASP.NET, C#, Node.js & MongoDB" },
  { title: "Quality", detail: "UAT & API validation" },
  { title: "Healthcare IT", detail: "App monitoring, support & staff training" },
];

export const hero = {
  eyebrow: "// IT EXECUTIVE & FULL-STACK DEVELOPER",
  sideLabel: "// DESIGN & DEVELOPMENT",
  intro:
    "IT Executive in healthcare tech. I design in Figma and build with ReactJS, Tailwind CSS and .NET.",
  cta: { label: "View my work", target: "work" },
  chips: ["Figma & UI Design", "ReactJS & Tailwind", "ASP.NET & C#", "Node.js & MongoDB", "UAT & API Testing"],
};

export const about = {
  eyebrow: "[02 // ABOUT THE DEVELOPER]",
  heading: ["THE HUMAN", "BEHIND THE AI"],
  card: {
    kicker: "// SPECIALITY",
    meta: "PRASHANTH HOSPITAL · 2024 – NOW",
    title: "Healthcare IT, UI design & full-stack development",
    bio: "IT Executive with over a year of experience in app development, user experience optimization, and technical support within the healthcare sector. Proficient in ReactJS, Tailwind CSS, and Figma, I focus on enhancing digital experiences and troubleshooting technical issues. A motivated and adaptable team player, I’m eager to learn new technologies and contribute to impactful innovations in the intersection of healthcare and IT. Always ready to embrace new challenges, I thrive in dynamic and evolving environments.",
    details: [
      { label: "Profile", value: "Application Support and Development Executive" },
      { label: "Domain", value: "IT" },
      { label: "Education", value: "Bachelor of Computer Application" },
      { label: "Language", value: "Tamil, English" },
      { label: "Other skills", value: "ReactJS, Figma, .NET" },
      { label: "Interest", value: "Playing, Traveling, Movies & Food" },
    ],
  },
  quote: {
    text: "Focused on enhancing operational efficiency and user experience in healthcare technology.",
    by: "SAMUEL G",
    note: "[UAT · API validation · UI design]",
  },
  stats: [
    {
      label: "Hands-on IT experience",
      value: 3,
      suffix: "+ YR",
      note: "IT Executive since Jan 2024",
      chart: true,
      milestones: ["2020 BCA", "2023 GRAD", "2024 IT EXEC", "NOW"],
    },
    { label: "Featured projects", value: 5, suffix: "", note: "React · Node.js · ASP.NET · Figma" },
  ],
  stack: [
    { name: "ReactJS", Icon: SiReact, color: "#61dafb" },
    { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38bdf8" },
    { name: "Figma", Icon: SiFigma, color: "#f24e1e" },
    { name: ".NET", Icon: SiDotnet, color: "#a78bfa" },
    { name: "ASP.NET", Icon: SiDotnet, color: "#8b5cf6" },
    { name: "C#", Icon: TbBrandCSharp, color: "#c084fc" },
    { name: "Node.js", Icon: SiNodedotjs, color: "#84cc16" },
    { name: "MongoDB", Icon: SiMongodb, color: "#22c55e" },
    { name: "UAT", Icon: TbTestPipe, color: "#d4ff3a" },
    { name: "API Validation", Icon: TbApi, color: "#22d3ee" },
  ],
};

// The pinned cinematic story. One scene ≈ 100vh of scroll.
// media: optional AI scene artwork featuring Samuel (image .webp/.jpg or video .mp4) in /public/images/.
//   Add the file, then set ready: true. Until then the animated portrait scene is shown.
//   focus = which part of the picture to keep on narrow (phone) screens. poster = first frame (videos).
export const scenes = [
  {
    id: "design",
    media: { src: pub("scene-design.mp4"), poster: pub("scene-design-poster.webp"), ready: true, focus: "80% 35%" },
    short: "DESIGN",
    step: "01. DESIGN ARCHITECTURE",
    title: "Design",
    text: "I map the user journey first: wireframes, templates and flow charts in Figma that line up with user goals and hospital objectives.",
    hues: ["#7c3aed", "#22d3ee"],
  },
  {
    id: "develop",
    media: { src: pub("scene-develop.mp4"), poster: pub("scene-develop-poster.webp"), ready: true, focus: "42% 40%" },
    short: "DEVELOP",
    step: "02. CODE DEVELOPMENT",
    title: "Develop",
    text: "I build responsive interfaces with ReactJS and Tailwind CSS, like the hospital’s app promotion website, plus ASP.NET, C# and Node.js projects.",
    hues: ["#0ea5e9", "#6366f1"],
  },
  {
    id: "deploy",
    media: { src: pub("scene-deploy.mp4"), poster: pub("scene-deploy-poster.webp"), ready: true, focus: "68% 35%" },
    short: "DEPLOY",
    step: "03. TEST & DEPLOY",
    title: "Deploy",
    text: "Before anything ships I run User Acceptance Testing and API validation, then monitor the hospital’s apps and dashboards once they are live.",
    hues: ["#14b8a6", "#1e3a8a"],
  },
  {
    id: "client",
    media: { src: pub("scene-client.mp4"), poster: pub("scene-client-poster.webp"), ready: true, focus: "80% 30%" },
    short: "CLIENT SUCCESS",
    step: "04. CLIENT SUCCESS",
    title: "Client Success",
    text: "I work closely with developers and train staff so every system is used well, improving efficiency and the experience for everyone.",
    hues: ["#8b5cf6", "#d946ef"],
  },
];

export const work = {
  eyebrow: "[05 // SELECTED WORK]",
  heading: ["SELECTED", "WORK"],
  intro: "Live company work and sample projects on ReactJS, Node.js, PostgreSQL, ASP.NET, C#, and MongoDB.",
  projects: [
    {
      title: "PFRC IT Ticketing",
      description:
        "A centralized IT ticketing and issue management system for Prashanth Hospitals. It streamlines IT support requests, tracks issue status and departmental tickets, and monitors resolution progress, with role-based access control, ticket assignment, workflow management and an analytics dashboard for support performance. I built it full-stack: the ticket management system, RBAC, issue-tracking workflows and the interactive reporting dashboard.",
      tags: ["Live", "Company project", "React.js", "Node.js", "PostgreSQL", "REST API"],
      image: itTicketingImg,
      alt: "Admin dashboard of the PFRC IT Ticketing system showing ticket totals, completion rate, average resolution time and department charts",
      link: "https://it-ticketing.prashanthhospitals.org/",
      linkLabel: "Visit live site",
    },
    {
      title: "Academic Management System",
      description:
        "An internal platform for Prashanth Hospitals' postgraduate medical education. It manages doctor and trainee records (courses, departments, batches and training periods), finance and stipends (course fees, expenditure, refunds and monthly stipend payouts), and academic progress (work assignments, documents and alerts), with a management dashboard that brings it all into one view.",
      tags: ["Internal", "Company project", "React.js", "Node.js", "PostgreSQL", "REST API"],
      image: academicMgmtImg,
      alt: "Management dashboard of the Academic Management System showing doctor counts, a financial overview table and a monthly stipend payout chart",
      // No public link: deployed on the hospital's internal network.
      internalNote: "Internal deployment · hospital network only",
    },
    {
      title: "Blood Bank Portal",
      description:
        "A web-based application designed to streamline blood donation, enabling users to search for and manage blood stock efficiently.",
      tags: ["ASP.NET", "C#"],
      image: bloodBankImg,
      alt: "Screenshot of the Blood Bank Portal web application",
      link: "https://github.com/2001701033036/Blood-Connect.git",
      linkLabel: "View on GitHub",
    },
    {
      title: "E-Commerce Store",
      description:
        "E-commerce website where users can browse products, add items to their cart, and simulate the buying process with a seamless user experience.",
      tags: ["ReactJS", "Node.js"],
      image: ecomImg,
      alt: "Screenshot of the e-commerce website built with ReactJS and Node.js",
      link: "https://github.com/2001701033036/ecom.git",
      linkLabel: "View on GitHub",
    },
    {
      title: "IVF & Ocean Taste Designs",
      description:
        "Intuitive IVF app & dashboard for fertility tracking with clear visuals, and a clean, user-friendly Ocean Taste food delivery app for seamless meal ordering.",
      tags: ["Figma", "UI / UX"],
      image: figmaImg,
      alt: "Figma designs of an IVF tracking app and the Ocean Taste food delivery app",
      link: "https://www.figma.com/proto/hnwlcqlPfNOzO9ZJh7EeSI/Ocean-Taste?node-id=958-171&t=sOeWRPb6ZulPnJAy-1",
      linkLabel: "Open Figma prototype",
    },
  ],
};

export const contact = {
  eyebrow: "[06 // CONTACT]",
  heading: ["LET’S BUILD", "SOMETHING"],
  intro: "Below are the details to reach out to me!",
  cta: "Email me",
};
