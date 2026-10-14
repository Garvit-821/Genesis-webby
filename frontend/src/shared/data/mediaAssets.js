/**
 * Real event photography served from public/gallery.
 *
 * Only photos taken at Genesis events belong here: no stock images
 * (audit T01, P09). Every photo carries alt text describing what is in
 * the frame (audit A09).
 * NEEDS_CONFIRMATION: photo consent from the people pictured (audit G07).
 */

// Hackers Occupied Pune (VIT Pune, 22–23 Aug 2026)
const HOP_DIR = "/gallery/hackers-occupied-pune";
const hop = (file, caption, day, alt) => ({
  file,
  src: `${HOP_DIR}/${file}.webp`,
  width: 1280,
  height: 853,
  caption,
  alt,
  meta: `Pune · ${day} Aug 2026`,
  event: "Hackers Occupied Pune",
});

// Order matters: the WebGL grid tiles index (x + 4y) % length. The four
// crowd shots sit on 0/2/8/10 and each look-alike pair sits two apart, so
// near-identical photos never touch, not even corner to corner.
export const GALLERY_PHOTOS = [
  hop("dsc09998", "Full house", 23, "Participants, mentors and organisers of Hackers Occupied Pune seated together on the steps of the VIT auditorium"),
  hop("dsc09188", "Energy check", 22, "Two Red Bull team members with drink backpacks in the lab while participants raise cans behind them"),
  hop("dsc00001", "Closing frame", 23, "Group photo of everyone at the close of Hackers Occupied Pune in the VIT auditorium"),
  hop("dsc09197", "Refuel", 22, "The Red Bull team walking the lab rows handing out drinks to teams at their desks"),
  hop("dsc09252", "Talking it through", 22, "A seated mentor talking a standing team through their project"),
  hop("dsc09229", "Desk rounds", 22, "Mentors and organisers gathered around a team's workstation reviewing their build"),
  hop("dsc09397", "Late-night laughs", 22, "Participants laughing together with cans in hand during a break from building"),
  hop("dsc09230", "Under the hood", 22, "Organisers and participants leaning in to look at a team's screen"),
  hop("dsc09999", "Everyone in", 23, "A second group photo of all Hackers Occupied Pune participants in the auditorium"),
  hop("dsc09246", "The lab floor", 22, "Teams coding at desktop computers on the lab floor at Hackers Occupied Pune"),
  hop("dsc00002", "Last one", 23, "A wide group photo of participants and organisers in the auditorium at the end of the event"),
  hop("dsc09631", "Overnight build", 23, "An organiser in a Genesis T-shirt checking in on a team at their desks overnight"),
  hop("dsc09243", "Code review", 22, "A participant showing code on a laptop to a seated mentor"),
  hop("dsc09238", "Walkthrough", 22, "A team in lanyards explaining their project to a mentor"),
  hop("dsc09340", "Heads down", 22, "Participants working on laptops by the window late in the evening"),
  hop("dsc09267", "Huddle", 22, "A group of participants crowded around a laptop with a mentor"),
];

/** Photos used for the Pune recap strip, in story order. */
export const PUNE_STORY = ["dsc09188", "dsc09246", "dsc09238", "dsc09252", "dsc09267", "dsc09397", "dsc09340", "dsc09631", "dsc09998"]
  .map((file) => GALLERY_PHOTOS.find((p) => p.file === file))
  .filter(Boolean);

export const PUNE_GROUP_PHOTO = GALLERY_PHOTOS.find((p) => p.file === "dsc09998");
