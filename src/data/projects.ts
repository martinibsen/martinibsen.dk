export interface Project {
  number: string;
  name: string;
  desc: string;
  status: string;
  statusType: "live" | "building";
  role: string;
  type: string;
  stack: string;
  stackLabel?: string;
  url: string | null;
  image: string;
  imageContain?: boolean;
}

export const projects: Project[] = [
  {
    number: "01",
    name: "Knud",
    desc: "iOS-app der bruger AI til at kategorisere og organisere dine screenshots automatisk. Del et screenshot — Knud sorterer det i den rigtige mappe.",
    status: "Live",
    statusType: "live",
    role: "Idé → Ship",
    type: "iOS App",
    stack: "Swift, AI",
    url: "https://knud.app",
    image: "/images/knud-screenshot.jpg",
  },
  {
    number: "02",
    name: "Stilnote",
    desc: "SaaS for danske indretningsdesignere. Erstatter manuelle Excel-ark med smukke, professionelle materialeplaner klar til kunden.",
    status: "Building",
    statusType: "building",
    role: "Idé → Ship",
    type: "B2B SaaS",
    stack: "Next.js, Supabase",
    url: "https://stilnote.com",
    image: "/images/stilnote.png",
  },
  {
    number: "03",
    name: "Super Yes",
    desc: "B2B SaaS der hjælper produktteams med struktureret product discovery. Byg hypoteser, definér outcomes og validér med eksisterende data.",
    status: "Building",
    statusType: "building",
    role: "Idé → Ship",
    type: "B2B SaaS",
    stack: "Next.js, Supabase",
    url: null,
    image: "/images/superyes-hero.jpg",
    imageContain: true,
  },
  {
    number: "04",
    name: "Vibetjek",
    desc: "Få en erfaren udvikler til at gennemgå dit vibe-coded projekt — og fortælle dig præcis hvad der virker, hvad der brænder, og hvad du skal fikse først.",
    status: "Live",
    statusType: "live",
    role: "Idé → Ship",
    type: "B2B Service",
    stack: "Code Review, AI",
    url: "https://vibetjek.dk",
    image: "/images/vibetjek.png",
  },
  {
    number: "05",
    name: "Wardrobe",
    desc: "Themes for vibe-coded apps. Drop-in design systems for Claude Code, Cursor, v0, Lovable. Stop shipping the same purple landing page.",
    status: "Live",
    statusType: "live",
    role: "Idé → Ship",
    type: "Design System",
    stack: "Astro, React",
    url: "https://wardrobeui.com",
    image: "/images/wardrobe.jpg",
  },
  {
    number: "06",
    name: "AI for Produktledere",
    desc: "Ugentligt nyhedsbrev med praktiske tips, prompts og workflows til produktledere, der vil mestre AI i deres daglige arbejde.",
    status: "Live",
    statusType: "live",
    role: "Idé → Ship",
    type: "Nyhedsbrev",
    stack: "Newsletter, AI",
    url: "https://aiproduktleder.dk",
    image: "/images/aiproduktleder.png",
  },
  {
    number: "07",
    name: "PM Consulting",
    desc: "Konsulentydelse der løfter PM-kompetencer i AI-drevne organisationer. Erfaring fra Norlys, Energinet og Hessen.",
    status: "Aktiv",
    statusType: "live",
    role: "Rådgiver",
    type: "B2B Service",
    stack: "AI, Discovery",
    stackLabel: "Fokus",
    url: null,
    image: "/images/consulting.jpg",
  },
];
