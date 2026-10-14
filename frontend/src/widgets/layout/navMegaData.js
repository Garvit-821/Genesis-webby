import { LANDING } from "@shared/constants/testIds";
import { DELHI, PUNE } from "@shared/config/site";

/**
 * Header menus. Every item is a real link (`to` for routes, `href` for
 * external), so crawlers can follow them and people can open them in a
 * new tab (audit L07).
 */
export const NAV_MENUS = [
  {
    id: "events",
    label: "Events",
    testid: LANDING.navEvents,
    feature: {
      badge: "Upcoming",
      title: `${DELHI.name} ${DELHI.edition}`,
      desc: `${DELHI.where} · ${DELHI.when}. 100 teams, six tracks.`,
      to: DELHI.path,
      cta: "See the event",
    },
    columns: [
      {
        category: "Hackers Occupied/",
        items: [
          {
            title: `${DELHI.name} ${DELHI.edition}`,
            desc: "Upcoming. Sponsor it or register interest",
            to: DELHI.path,
          },
          {
            title: `${PUNE.name} 2026`,
            desc: "Recap, schedule and photos",
            to: PUNE.path,
          },
          {
            title: "Pune certificates",
            desc: "For registered Pune participants",
            to: PUNE.certificatePath,
          },
        ],
      },
      {
        category: "Archive/",
        items: [
          {
            title: "Events archive",
            desc: "Every event Genesis has run or partnered on",
            to: "/events",
          },
          {
            title: "Gallery",
            desc: "Photos from Hackers Occupied Pune",
            to: "/gallery",
            testid: LANDING.navGallery,
          },
        ],
      },
    ],
  },
  {
    id: "partner",
    label: "Partner",
    testid: "nav-partner",
    feature: {
      badge: "For sponsors",
      title: "Sponsor a hackathon",
      desc: "Tell us your goal, budget and timeline. We shortlist events that fit.",
      to: "/partner",
      cta: "Start here",
    },
    columns: [
      {
        category: "Work with us/",
        items: [
          {
            title: "Sponsor an event",
            desc: "Hackers Occupied Delhi or independent hackathons",
            to: "/partner",
          },
          {
            title: "Co-host, judge or mentor",
            desc: "Run a track, list your event, judge or mentor",
            to: "/collaborate",
          },
          {
            title: "Contact",
            desc: "Email, phone or the form",
            to: "/contact",
            testid: LANDING.navContact,
          },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    testid: LANDING.navAbout,
    feature: null,
    columns: [
      {
        category: "Genesis/",
        items: [
          { title: "About Genesis", desc: "What we do and for whom", to: "/about" },
          { title: "How we run events", desc: "The rules we hold ourselves to", to: "/values", testid: LANDING.navLoop },
          { title: "Team", desc: "The people who run Genesis", to: "/team", testid: LANDING.navTeam },
        ],
      },
      {
        category: "Resources/",
        items: [
          { title: "Organiser guide", desc: "How to run a student hackathon", to: "/guide" },
          { title: "Join the crew", desc: "Help run events across India", to: "/careers" },
        ],
      },
    ],
  },
];
