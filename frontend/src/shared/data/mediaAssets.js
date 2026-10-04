// Real event assets (referenced via high-performance Unsplash CDN for zero-repo footprint)
export const POSTER_2 =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop";

export const SAMVEDNA_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    caption: "Samvedna · On stage",
    meta: "Noida · Sep 2025",
    aspect: "aspect-[3/2]",
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    caption: "Samvedna · The room",
    meta: "Noida · Sep 2025",
    aspect: "aspect-[3/2]",
  },
  {
    src: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=800&auto=format&fit=crop",
    caption: "Samvedna · Workshop floor",
    meta: "Noida · Sep 2025",
    aspect: "aspect-[3/2]",
  },
  {
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
    caption: "Samvedna · In conversation",
    meta: "Noida · Sep 2025",
    aspect: "aspect-[3/2]",
  },
  {
    src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",
    caption: "Samvedna · Closing",
    meta: "Noida · Sep 2025",
    aspect: "aspect-[3/2]",
  },
];

export const NO_AGENDA_1_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
    caption: "No Agenda 1.0 · The talk",
    meta: "Gurugram · Aug 2025",
    aspect: "aspect-[16/9]",
  },
  {
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    caption: "No Agenda 1.0 · The crowd",
    meta: "Gurugram · Aug 2025",
    aspect: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    caption: "No Agenda 1.0 · Q&A",
    meta: "Gurugram · Aug 2025",
    aspect: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    caption: "No Agenda 1.0 · Break",
    meta: "Gurugram · Aug 2025",
    aspect: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    caption: "No Agenda 1.0 · Hands up",
    meta: "Gurugram · Aug 2025",
    aspect: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
    caption: "No Agenda 1.0 · Together",
    meta: "Gurugram · Aug 2025",
    aspect: "aspect-[4/3]",
  },
];

// Used for the event card hero images
export const SAMVEDNA_HERO = SAMVEDNA_PHOTOS[0].src;
export const NO_AGENDA_1_HERO = NO_AGENDA_1_PHOTOS[0].src;

// Hackers Occupied Pune (VIT Pune, 22–23 Aug 2026), served from public/gallery
const HOP_DIR = "/gallery/hackers-occupied-pune";
const hop = (file, caption, day) => ({
  src: `${HOP_DIR}/${file}.webp`,
  caption: `Hackers Occupied · ${caption}`,
  meta: `Pune · ${day} Aug 2026`,
  aspect: "aspect-[3/2]",
});

// Order matters: the WebGL grid tiles index (x + 3y) % length, so the
// near-identical group shots sit four apart and never touch edge-to-edge.
export const GALLERY_PHOTOS = [
  hop("dsc09998", "Full house", 23),
  hop("dsc09188", "Energy check", 22),
  hop("dsc09229", "Desk rounds", 22),
  hop("dsc09243", "Code review", 22),
  hop("dsc00001", "Closing frame", 23),
  hop("dsc09246", "The lab floor", 22),
  hop("dsc09631", "4 AM build", 23),
  hop("dsc09252", "Talking it through", 22),
  hop("dsc09999", "Everyone in", 23),
  hop("dsc09197", "Refuel", 22),
  hop("dsc09238", "Walkthrough", 22),
  hop("dsc09340", "Heads down", 22),
  hop("dsc00002", "Last one", 23),
  hop("dsc09230", "Under the hood", 22),
  hop("dsc09267", "Huddle", 22),
  hop("dsc09397", "Late-night laughs", 22),
];
