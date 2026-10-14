/**
 * "How to run a hackathon: a practical guide".
 *
 * Section structure adapted from the MLH Hackathon Organiser Guide
 * (guide.mlh.io); the guide credits it on every page. Read times are
 * computed from the text below, never typed in (audit C18).
 * NEEDS_CONFIRMATION: licence terms of the MLH guide for adapted structure.
 */

export const GUIDE_CATEGORIES = [
  {
    id: "introduction",
    title: "Introduction",
    icon: "BookOpen",
    articles: [
      {
        slug: "overview",
        title: "How to run a hackathon: a practical guide",
        navTitle: "Overview",
        desc: "What this guide covers and how to use it",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Planning, funding and running a student hackathon in India",
          heroText: "Whether you are running a 100-person campus event or a 1,000-person weekend, this guide walks through the timeline, the budget, sponsors, the venue and the day itself, with checklists you can copy.",
          sections: [
            {
              id: "what-is-this-guide",
              title: "What is this guide?",
              text: "Organising a hackathon has a lot of moving parts: venue access, sponsors, food, hardware, judging and participant safety. This guide puts them in order, step by step, so a first-time team knows what to do and when.",
              callout: {
                type: "tip",
                title: "Pro Tip",
                text: "Share this guide with your co-organisers at your first planning meeting."
              }
            },
            {
              id: "how-to-use-it",
              title: "How to use this guide",
              text: "Read it end to end if this is your first event, or jump to a topic from the menu or with Ctrl+K search.",
              checklist: [
                { id: "step-1", text: "Read the Hackathon Timeline and pick your event date", checked: false },
                { id: "step-2", text: "Assign functional team leads (Logistics, Tech, Sponsorship, Marketing)", checked: false },
                { id: "step-3", text: "Draft a first budget using the Hackathon Budgeting page", checked: false }
              ]
            }
          ]
        }
      },
      {
        slug: "what-is-a-hackathon",
        title: "What is a Hackathon?",
        desc: "What happens at a hackathon and who it is for",
        lastUpdated: "October 2026",
        content: {
          subtitle: "An invention marathon where passion meets rapid prototyping",
          heroText: "A hackathon is an event where people team up to build something in a fixed time, usually 24 to 48 hours, then show it to judges and each other.",
          sections: [
            {
              id: "the-core-philosophy",
              title: "The Core Philosophy",
              text: "The point is to learn by building: try a new stack, ship a working demo in a weekend, and meet people you would want to build with again. Prizes are a bonus."
            },
            {
              id: "who-attends",
              title: "Who attends hackathons?",
              text: "You don't need to be a Computer Science major or a veteran developer! Great teams combine programmers, UI/UX designers, hardware tinkerers, project strategists, and domain specialists.",
              callout: {
                type: "note",
                title: "Plan for first-timers",
                text: "Many participants at student hackathons are attending their first one. Beginner workshops and a beginner track help them finish something."
              }
            }
          ]
        }
      },
      {
        slug: "what-is-genesis",
        title: "What is Genesis?",
        desc: "Who wrote this guide",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Hackathon partnerships in India",
          heroText: "Genesis connects companies with India's student hackathon and builder community. We curate brand partnerships with independent hackathons and run our own series, Hackers Occupied.",
          sections: [
            {
              id: "how-we-help",
              title: "How we help organisers",
              text: "If you run a student hackathon, we can help bring in sponsors. Tell us about your event on the Collaborate page."
            }
          ]
        }
      },
      {
        slug: "community-values",
        title: "Community Values",
        desc: "Safety, inclusion, and the hacker code of conduct",
        lastUpdated: "October 2026",
        content: {
          subtitle: "A safe, welcoming event for everyone",
          heroText: "Publish a code of conduct and enforce it. Everyone should be free from harassment regardless of gender, sexual orientation, disability, ethnicity or background.",
          sections: [
            {
              id: "code-of-conduct",
              title: "Enforcing the Code of Conduct",
              text: "Link the code of conduct from your website, put posters up at check-in, and name one organiser as the incident lead who can be reached at any hour of the event.",
              callout: {
                type: "warning",
                title: "Safety requirement",
                text: "Provide an anonymous way to report problems and a direct emergency phone number during the event."
              }
            }
          ]
        }
      }
    ]
  },
  {
    id: "event-types",
    title: "Event Types",
    icon: "Layers",
    articles: [
      {
        slug: "digital-events",
        title: "Digital Events",
        desc: "Hosting virtual and online hackathons",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Running a hackathon online",
          heroText: "Online hackathons let people join from anywhere. Teams collaborate over chat and video, and submit online.",
          sections: [
            {
              id: "digital-stack",
              title: "Recommended Digital Tech Stack",
              text: "Use Discord for real-time team matching and voice channels, YouTube/Twitch for keynotes and ceremonies, and Devpost/HackCulture for project submissions."
            },
            {
              id: "engagement",
              title: "Keeping Digital Engagement High",
              text: "Online events lose people fast. Run short 15-minute mini-events (trivia, games, quizzes) and keep mentor voice channels staffed."
            }
          ]
        }
      },
      {
        slug: "in-person-events",
        title: "In-Person Events",
        desc: "Running a 24 to 48 hour event at a venue",
        lastUpdated: "October 2026",
        content: {
          subtitle: "What a venue needs",
          heroText: "In-person events need more planning than online ones, and they are where teams form and people come back next year.",
          sections: [
            {
              id: "venue-essentials",
              title: "Venue Essentials",
              text: "Confirm overnight building access, reliable Wi-Fi, at least one power socket per participant, accessible restrooms and a quiet rest area."
            }
          ]
        }
      },
      {
        slug: "hybrid-events",
        title: "Hybrid Events",
        desc: "Combining physical venues with online participation",
        lastUpdated: "October 2026",
        content: {
          subtitle: "The best of both worlds with dual submission tracks",
          heroText: "Hybrid hackathons allow local participants to hack in person while remote participants submit and present virtually.",
          sections: [
            {
              id: "fairness",
              title: "Ensuring Judging Fairness",
              text: "Run separate judging queues or virtual video rooms to ensure remote teams receive equal evaluation time compared to floor expo tables."
            }
          ]
        }
      }
    ]
  },
  {
    id: "general-information",
    title: "General Information",
    icon: "Calendar",
    articles: [
      {
        slug: "hackathon-timeline",
        title: "Hackathon Timeline",
        desc: "The 6-month operational master roadmap",
        lastUpdated: "October 2026",
        content: {
          subtitle: "From initial concept to post-event wrapup",
          heroText: "Work back from your event date. This is a typical six-month plan for a first event.",
          sections: [
            {
              id: "timeline-breakdown",
              title: "Phase-by-Phase Roadmap",
              text: "Tick these off as you go.",
              checklist: [
                { id: "m6", text: "Month 6: Form the organising team and pick a date", checked: false },
                { id: "m5", text: "Month 5: Finalize budget & launch sponsorship prospectus", checked: false },
                { id: "m4", text: "Month 4: Secure venue contract & launch teaser website", checked: false },
                { id: "m3", text: "Month 3: Open hacker applications & launch marketing campaign", checked: false },
                { id: "m2", text: "Month 2: Confirm sponsors, judges, keynotes, and swag orders", checked: false },
                { id: "m1", text: "Month 1: Send RSVPs, finalize catering, print badges & signage", checked: false },
                { id: "w1", text: "Week 1: Packing run, AV dry run, mentor briefing", checked: false }
              ]
            }
          ]
        }
      },
      {
        slug: "finding-date-and-purpose",
        title: "Finding the Date & Purpose",
        desc: "Avoiding scheduling conflicts and defining your theme",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Strategic scheduling for maximum attendance",
          heroText: "Choosing the wrong date can destroy attendance. Cross-check university exam schedules, major holidays, and competing regional tech events before locking in your date.",
          sections: [
            {
              id: "date-checklist",
              title: "Date Selection Checklist",
              text: "Check academic calendars for midterms and finals, national holidays, local weather patterns, and major tech conference dates."
            }
          ]
        }
      },
      {
        slug: "build-leadership-team",
        title: "Build Your Leadership Team",
        desc: "Structuring functional organising committees",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Give each lead clear ownership",
          heroText: "Split the work into clear areas, each with one person responsible.",
          sections: [
            {
              id: "core-roles",
              title: "Core organising areas",
              text: "1. Lead Director (Overall vision & sync)\n2. Logistics Director (Venue, catering, AV, security)\n3. Sponsorship Lead (Funding, partner relations)\n4. Tech & Web Lead (Platform, registration system, Wi-Fi)\n5. Marketing & Design Lead (Socials, branding, swag)\n6. Hacker Experience Lead (Mentors, mini-events, judging)"
            }
          ]
        }
      },
      {
        slug: "locking-down-a-venue",
        title: "Locking Down a Venue",
        desc: "Facility requirements, contracts, and power setup",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Finding and booking a venue",
          heroText: "Check overnight access approvals, ventilation and power before you sign anything.",
          sections: [
            {
              id: "power-network",
              title: "Power & Gigabit Networking",
              text: "A normal classroom cannot power 50 laptops from one wall. Work with the venue's facilities team on distribution boards and cables across several circuits.",
              callout: {
                type: "important",
                title: "Power Rule of Thumb",
                text: "Plan for about 150 W per participant. A 300-person hackathon needs roughly 45 kW of continuous power."
              }
            }
          ]
        }
      },
      {
        slug: "hackathon-budgeting",
        title: "Hackathon Budgeting",
        desc: "Financial planning, line items, and reserve funds",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Planning income and costs",
          heroText: "A budget agreed early stops you running out of food or money on the day. These are typical shares; adjust them for your event.",
          sections: [
            {
              id: "budget-breakdown",
              title: "Standard Expense Allocations",
              text: "- Food & Beverage: 40-45%\n- Swag & Shirts: 15-20%\n- Travel & Logistics: 15%\n- Prizes & Hardware: 10%\n- Audio/Visual & Security: 10%\n- Emergency Reserve: 5-10%"
            }
          ]
        }
      }
    ]
  },
  {
    id: "getting-sponsorship",
    title: "Getting Sponsorship",
    icon: "DollarSign",
    articles: [
      {
        slug: "sponsorship-overview",
        title: "Sponsorship Overview",
        desc: "Fundraising strategy and tier structures",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Why companies sponsor hackathons",
          heroText: "Sponsors fund your event to recruit top talent, drive developer adoption of their APIs/SDKs, and build brand affinity among student creators.",
          sections: [
            {
              id: "value-props",
              title: "What Sponsors Care About",
              text: "Tailor your pitch to what company representatives care about: HR teams want resumes and interview access; Developer Relations teams want API usage and project submissions."
            }
          ]
        }
      },
      {
        slug: "prospectus-creation",
        title: "Prospectus Creation",
        desc: "What to put in a sponsorship deck",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Crafting a clean, compelling 3-page proposal",
          heroText: "Keep the deck short and specific: who comes, what a sponsor gets, and what it costs.",
          sections: [
            {
              id: "deck-structure",
              title: "Essential Deck Sections",
              text: "1. Cover & Vision\n2. Key Demographics & Past Statistics (Hackers count, schools, diversity, projects built)\n3. Tier Comparison Table (Title, Gold, Silver, Bronze)\n4. Custom Add-ons (Meal sponsorship, Hardware lab, Lounge naming)\n5. Contact & Payment Info"
            }
          ]
        }
      },
      {
        slug: "pitching-sponsors",
        title: "Pitching Sponsors",
        desc: "Outreach campaigns, follow-ups, and closing contracts",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Outreach, follow-ups and closing",
          heroText: "Start your outreach 4 to 6 months in advance. Target University Recruiter and Developer Advocate titles on LinkedIn.",
          sections: [
            {
              id: "outreach-tips",
              title: "Outreach Best Practices",
              text: "Keep initial cold emails under 150 words. Highlight your expected hacker headcount, university reach, and unique track opportunities."
            }
          ]
        }
      }
    ]
  },
  {
    id: "hackathon-website",
    title: "Hackathon Website",
    icon: "Globe",
    articles: [
      {
        slug: "accessible-design",
        title: "Making an Accessible Design",
        desc: "WCAG compliance, mobile UX, and high contrast",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Designing for every hacker on all screen sizes",
          heroText: "Your website is often the first thing participants and sponsors see. Check colour contrast, labels, screen reader support and keyboard navigation.",
          sections: [
            {
              id: "accessibility-rules",
              title: "Accessibility Checklist",
              text: "Maintain minimum 4.5:1 text contrast ratio, provide alt text on all images, ensure all buttons have accessible labels, and support keyboard tab navigation."
            }
          ]
        }
      },
      {
        slug: "placeholder-website",
        title: "Placeholder Website",
        desc: "Put up a simple page early",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Capturing early emails before registrations open",
          heroText: "Do not wait for the full site. Put up a one-page teaser with an email sign-up about five months before the event.",
          sections: [
            {
              id: "teaser-elements",
              title: "Teaser Elements",
              text: "Hero headline, tentative date and city, email newsletter subscribe form, sponsor outreach contact link."
            }
          ]
        }
      },
      {
        slug: "main-website",
        title: "Main Website",
        desc: "Full schedule, FAQs, sponsor grid, and application flow",
        lastUpdated: "October 2026",
        content: {
          subtitle: "The central hub for hackers, mentors, and sponsors",
          heroText: "Your main website should answer every question a participant might ask within 2 clicks.",
          sections: [
            {
              id: "essential-sections",
              title: "Essential Sections",
              text: "- Hero Section & Register CTA\n- About & Mission Statement\n- Schedule & Tracks\n- Prizes & Sponsor Logos\n- FAQ Accordion\n- Code of Conduct & Footers"
            }
          ]
        }
      },
      {
        slug: "marketing-your-event",
        title: "Marketing Your Event",
        desc: "Social campaigns, campus ambassadors, and posters",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Spreading the word across tech communities",
          heroText: "Combine social posts with campus ambassadors at nearby colleges.",
          sections: [
            {
              id: "ambassador-program",
              title: "Campus Ambassador Playbook",
              text: "Recruit student leads at neighbouring colleges to share flyers, post on class Discord servers, and host info sessions."
            }
          ]
        }
      }
    ]
  },
  {
    id: "event-logistics",
    title: "Event Logistics",
    icon: "Truck",
    articles: [
      {
        slug: "managing-registrations",
        title: "Managing Registrations",
        desc: "Applications, ticketing, RSVPs, and check-in flows",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Streamlining application reviews and attendance confirmation",
          heroText: "Free events usually see a share of registered people not turn up, so accept more registrations than you have seats. Track your own drop-off rate to set the margin.",
          sections: [
            {
              id: "rsvp-strategy",
              title: "RSVP Strategy",
              text: "Send acceptance notifications in waves. Require hackers to confirm RSVPs 7 days before the event so waitlisted applicants can be promoted."
            }
          ]
        }
      },
      {
        slug: "judging-and-submissions",
        title: "Judging & Submissions",
        desc: "Expo style judging, scoring rubrics, and platforms",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Fair, transparent, and efficient project evaluations",
          heroText: "For large hackathons, expo-style judging (teams demo at their tables) lets every team show their project to several judges, which stage presentations cannot.",
          sections: [
            {
              id: "rubric-standards",
              title: "Standard Judging Rubric",
              text: "1. Technical Complexity (25%)\n2. Design & User Experience (25%)\n3. Originality & Innovation (25%)\n4. Utility & Impact (25%)"
            }
          ]
        }
      },
      {
        slug: "hackathon-scheduling",
        title: "Hackathon Scheduling",
        desc: "Planning a 24 to 36 hour agenda",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Balancing hacking time, workshops, and rest",
          heroText: "Ensure long uninterrupted hacking blocks while weaving in fun mini-events and technical workshops.",
          sections: [
            {
              id: "sample-schedule",
              title: "Sample 24-Hour Agenda",
              text: "Day 1 09:00 AM - Check-in & Breakfast\nDay 1 11:00 AM - Opening Ceremony\nDay 1 12:00 PM - Hacking Begins & Team Building\nDay 1 01:30 PM - Lunch & Sponsor Workshops\nDay 1 07:00 PM - Dinner\nDay 1 10:00 PM - Cup Stacking Mini-Event\nDay 2 00:00 AM - Midnight Pizza & Gaming\nDay 2 08:00 AM - Breakfast\nDay 2 12:00 PM - Hacking Ends & Submissions Due\nDay 2 01:00 PM - Science Fair Judging Expo\nDay 2 04:00 PM - Closing Ceremony & Awards"
            }
          ]
        }
      },
      {
        slug: "mentorship",
        title: "Mentorship",
        desc: "Onboarding and organising technical mentors",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Getting teams unstuck",
          heroText: "Recruit experienced engineers, alumni and sponsor developer advocates to help teams when they are stuck.",
          sections: [
            {
              id: "mentor-queue",
              title: "Help Desk Ticketing",
              text: "Use a ticket queue (a Discord bot or a simple web form) where teams give their table number, stack and problem, so mentors can pick up requests in order."
            }
          ]
        }
      },
      {
        slug: "day-of-logistics",
        title: "Day-of Logistics & Hacker Experience",
        desc: "On-site operations, meals, swag, and emergency response",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Running the day itself",
          heroText: "Write the run of show minute by minute, and give core staff walkie-talkies or a dedicated emergency chat channel.",
          sections: [
            {
              id: "hacker-delight",
              title: "Hacker Experience Essentials",
              text: "Keep water stations full, maintain clean restrooms, hand out snacks every 4 hours, and provide earplugs/sleeping masks in designated rest areas."
            }
          ]
        }
      },
      {
        slug: "after-the-event",
        title: "After the Event",
        desc: "Post-mortems, metrics, winner follow-ups, and thank-yous",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Closing the loop and building community momentum",
          heroText: "After the closing ceremony, thank sponsors, pay out prizes promptly and hold a team retrospective.",
          sections: [
            {
              id: "post-event-checklist",
              title: "Post-Event Checklist",
              text: "Send attendee survey, publish winner project showcase, distribute tax receipts to sponsors, process reimbursements, and write an internal retrospective document."
            }
          ]
        }
      }
    ]
  },
  {
    id: "hardware-guide",
    title: "Hardware Hackathon Guide",
    icon: "Cpu",
    articles: [
      {
        slug: "hardware-intro",
        title: "Hardware Introduction",
        desc: "Why host hardware & IoT hackathons?",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Combining physical electronics with software intelligence",
          heroText: "Hardware hackathons allow participants to build physical gadgets, robotics, wearables, and smart home IoT systems using microcontrollers and sensors.",
          sections: [
            {
              id: "unique-aspects",
              title: "What Makes Hardware Special",
              text: "Hardware hackers need physical workbenches, soldering stations, component check-out counters, 3D printers, and safety gear."
            }
          ]
        }
      },
      {
        slug: "hardware-labs-resources",
        title: "Hardware Labs & Setup",
        desc: "Equipment inventories, component check-out, and safety",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Setting up a safe hardware lab",
          heroText: "Provide a diverse inventory of microcontrollers (Arduino, Raspberry Pi, ESP32), sensor kits, wire strippers, breadboards, and soldering equipment.",
          sections: [
            {
              id: "safety-protocols",
              title: "Mandatory Safety Rules",
              text: "Always require safety goggles in soldering areas, provide fume extractors, maintain a first aid burn kit, and prohibit high-voltage main grid hacking without approval.",
              callout: {
                type: "warning",
                title: "Safety First",
                text: "Have a trained lab manager supervise soldering stations at all times."
              }
            }
          ]
        }
      }
    ]
  },
  {
    id: "organizer-resources",
    title: "Organiser Resources",
    icon: "Tool",
    articles: [
      {
        slug: "template-links",
        title: "Templates to make",
        desc: "The planning documents every organising team needs",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Five documents to set up before you start",
          heroText: "Most teams end up building the same few documents. Set them up early and share them with every lead.",
          sections: [
            {
              id: "resources-grid",
              title: "What to set up",
              text: "- Budget sheet: every income and cost line, with a reserve\n- Sponsorship deck: audience, packages and contact\n- Run of show: the event minute by minute, with owners\n- Volunteer roster: shifts and responsibilities\n- Incident log: what happened, when, and what was done"
            }
          ]
        }
      },
      {
        slug: "host-exciting-mini-events",
        title: "Host Exciting Mini-Events",
        desc: "Cup stacking, Slides Karaoke, Esports, and trivia ideas",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Short breaks that keep people going",
          heroText: "Mini-events break up intense coding sessions, relieve stress, and create fun memories.",
          sections: [
            {
              id: "popular-activities",
              title: "Ideas that work",
              text: "1. Cup Stacking Challenge (Fastest team to build a 50-cup pyramid)\n2. Slides Karaoke (Hackers present random 5-slide decks they've never seen before)\n3. Midnight Cupcake Decorating\n4. Smash Bros / Valorant Tournament\n5. Tech Trivia & Meme Contest"
            }
          ]
        }
      },
      {
        slug: "software-for-hackathons",
        title: "Software for Hackathons",
        desc: "The recommended organising tech stack",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Tools that automate your operations",
          heroText: "Use software for ticketing, team matching, chat moderation and submissions.",
          sections: [
            {
              id: "stack-recommendations",
              title: "Recommended Tools",
              text: "- Project Submissions: Devpost / HackCulture\n- Community & Chat: Discord / Slack\n- Registration & Ticketing: Luma / Eventbrite\n- Mentorship: HelpQueue / Discord Ticket Bot\n- Live Stream: OBS Studio + YouTube Live"
            }
          ]
        }
      },
      {
        slug: "contributors",
        title: "Contributors",
        desc: "Acknowledgements and community maintainers",
        lastUpdated: "October 2026",
        content: {
          subtitle: "Who maintains this guide",
          heroText: "This guide is maintained by the Genesis team. Its structure is adapted from the MLH Hackathon Organiser Guide (guide.mlh.io).",
          sections: [
            {
              id: "contribute-back",
              title: "Want to contribute?",
              text: "Have a playbook or checklist to add, or spotted a mistake? Email partner@genesishacks.com."
            }
          ]
        }
      }
    ]
  }
];

/** Read time from the words actually on the page, at about 200 words a minute. */
function computeReadTime(article) {
  const c = article.content || {};
  const parts = [article.title, article.desc, c.subtitle, c.heroText];
  (c.sections || []).forEach((sec) => {
    parts.push(sec.title, sec.text);
    if (sec.callout) parts.push(sec.callout.title, sec.callout.text);
    (sec.checklist || []).forEach((item) => parts.push(item.text));
  });
  const words = parts.filter(Boolean).join(" ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

GUIDE_CATEGORIES.forEach((cat) => {
  cat.articles.forEach((art) => {
    art.readTime = computeReadTime(art);
  });
});

/** Helper to flatten all articles for global search */
export const ALL_GUIDE_ARTICLES = GUIDE_CATEGORIES.flatMap((cat) =>
  cat.articles.map((art) => ({
    ...art,
    categoryId: cat.id,
    categoryTitle: cat.title
  }))
);

/** Helper to find an article by category and slug */
export function getGuideArticle(catId, slug) {
  const category = GUIDE_CATEGORIES.find((c) => c.id === catId);
  if (!category) return null;
  const article = category.articles.find((a) => a.slug === slug);
  if (!article) return null;
  return { article, category };
}

/** Helper to find adjacent (prev/next) articles */
export function getAdjacentArticles(catId, slug) {
  const flattened = ALL_GUIDE_ARTICLES;
  const currentIndex = flattened.findIndex(
    (item) => item.categoryId === catId && item.slug === slug
  );
  if (currentIndex === -1) return { prev: null, next: null };
  const prev = currentIndex > 0 ? flattened[currentIndex - 1] : null;
  const next = currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null;
  return { prev, next };
}
