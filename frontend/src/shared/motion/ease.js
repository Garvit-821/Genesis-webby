/** Shared easing curves so every reveal on the site moves the same way. */
export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.7, 0, 0.3, 1];
export const EASE_SNAP = [0.215, 0.61, 0.355, 1];

/** 1 - 2^(-10t), the expo-out curve the About cards already used. */
export const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
