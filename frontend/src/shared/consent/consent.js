/**
 * Consent storage + PostHog gate.
 * Analytics must not load until the visitor accepts (or has previously accepted).
 */

export const CONSENT_STORAGE_KEY = "genesis:consent";
export const CONSENT_EVENT = "genesis:consent-change";
export const CONSENT_OPEN_EVENT = "genesis:consent-open";

/** Reopens the banner so a visitor can change their choice (audit G06). */
export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}

export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.status === "accepted" || parsed?.status === "rejected") {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function setConsent(status) {
  const payload = {
    status,
    at: new Date().toISOString(),
    version: 1,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: payload }));
  return payload;
}

function loadPostHogScript() {
  return new Promise((resolve, reject) => {
    if (window.posthog?.__loaded) {
      resolve(window.posthog);
      return;
    }
    const key = process.env.REACT_APP_POSTHOG_KEY;
    const host = process.env.REACT_APP_POSTHOG_HOST;
    if (!key || !host || key.startsWith("%") || host.startsWith("%")) {
      resolve(null);
      return;
    }

    // Stub already present from older inline inject — prefer clean init
    const existing = document.querySelector("script[data-genesis-posthog]");
    if (existing) {
      resolve(window.posthog || null);
      return;
    }

    !(function (t, e) {
      var o, n, p, r;
      e.__SV ||
        ((window.posthog = e),
        (e._i = []),
        (e.init = function (i, s, a) {
          function g(t, e) {
            var o = e.split(".");
            2 == o.length && ((t = t[o[0]]), (e = o[1]));
            t[e] = function () {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
          }
          ((p = t.createElement("script")).type = "text/javascript"),
            (p.crossOrigin = "anonymous"),
            (p.async = !0),
            (p.dataset.genesisPosthog = "1"),
            (p.src =
              s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
              "/static/array.js"),
            (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(
              p,
              r,
            );
          var u = e;
          for (
            void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
              u.people = u.people || [],
              u.toString = function (t) {
                var e = "posthog";
                return (
                  "posthog" !== a && (e += "." + a),
                  t || (e += " (stub)"),
                  e
                );
              },
              u.people.toString = function () {
                return u.toString(1) + ".people (stub)";
              },
              (o =
                "init capture identify register reset opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing".split(
                  " ",
                )),
              (n = 0);
            n < o.length;
            n++
          )
            g(u, o[n]);
          e._i.push([i, s, a]);
        }),
        (e.__SV = 1));
    })(document, window.posthog || []);

    try {
      window.posthog.init(key, {
        api_host: host,
        person_profiles: "identified_only",
        disable_session_recording: true,
        persistence: "localStorage+cookie",
        session_recording: {
          recordCrossOriginIframes: false,
          capturePerformance: false,
        },
        loaded: (ph) => resolve(ph),
      });
      // Fallback if loaded callback is slow
      setTimeout(() => resolve(window.posthog || null), 2500);
    } catch (err) {
      reject(err);
    }
  });
}

let analyticsStarted = false;

export async function startAnalyticsIfAllowed() {
  const consent = getConsent();
  if (consent?.status !== "accepted" || analyticsStarted) return false;
  try {
    await loadPostHogScript();
    analyticsStarted = true;
    return true;
  } catch {
    return false;
  }
}

export function stopAnalytics() {
  try {
    window.posthog?.opt_out_capturing?.();
  } catch {
    /* ignore */
  }
}
