/**
 * Read-only access to the curated event archive.
 *
 * Events ship with the build (shared/data/events.js). Nothing is cached in
 * the visitor's browser any more, so every visitor sees the same counts
 * after a deploy (audit D13). The old browser-only admin editor is gone.
 */

import { ALL_EVENTS, PAST_EVENTS, UPCOMING_EVENTS } from "@shared/data/events";

const LEGACY_STORAGE_KEY = "genesis_events_db";

// Clear the stale copy older builds wrote to localStorage.
try {
  if (typeof window !== "undefined") window.localStorage.removeItem(LEGACY_STORAGE_KEY);
} catch {
  /* storage blocked: nothing to clear */
}

export const eventService = {
  getEvents() {
    return ALL_EVENTS;
  },
  getUpcomingEvents() {
    return UPCOMING_EVENTS;
  },
  getPastEvents() {
    return PAST_EVENTS;
  },
  /** Kept for older callers; the archive no longer changes at runtime. */
  subscribe() {
    return () => {};
  },
};
