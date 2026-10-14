// HeroCanvas is deliberately not re-exported: Hero lazy-loads it so three.js
// stays out of the first download (audit F04).
export { default as Hero } from "./Hero";
