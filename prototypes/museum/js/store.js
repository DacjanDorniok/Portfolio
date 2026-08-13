/* Application state, the actions that change it, and the selectors screens read.
 *
 * One store, one notify. Nothing here touches the DOM. */

import {
  ACCOMMODATIONS, ARTEFACTS, BACK_TARGETS, BSL, DATES, GATES, SLOTS, STOPS, VISITOR_TYPES,
} from "./data.js";

const listeners = new Set();

export const state = {
  screen: "splash",
  leaving: null,
  direction: "forward",

  // Presentation preferences
  appearance: "dark",
  contrast: false,
  fontStep: 2,
  language: "English",

  // Timed sequences
  progress: 0,

  // Ticket flow
  visitors: { adult: 2, reduced: 0, child: 1 },
  date: 2,
  slot: 3,
  gate: 0,
  locker: "no",
  needsAccess: "yes",
  accommodations: [0, 3],
  visitorName: "Lara Meyer",
  payment: 0,

  // Inside the museum
  level: 1,
  pinsIn: false,
  code: "",

  // Audio guide
  playing: false,
  audio: 0.22,
  transcriptOpen: false,

  // Content focus
  stop: 0,
  artefact: 0,
  artefactFrom: "scan",
};

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function commit(patch) {
  Object.assign(state, patch);
  for (const fn of listeners) fn(state);
}

/* --- Timers --------------------------------------------------------------- */

let sequenceTimer = null;
let progressTimer = null;
let audioTimer = null;
let leaveTimer = null;
let pinTimer = null;

function clearTimers() {
  clearTimeout(sequenceTimer);
  clearInterval(progressTimer);
  sequenceTimer = progressTimer = null;
}

/** Runs a determinate progress bar for `ms`, then navigates to `next`. */
function runSequence(ms, next) {
  clearTimers();
  commit({ progress: 0 });
  const started = Date.now();
  progressTimer = setInterval(() => {
    const p = Math.min(1, (Date.now() - started) / ms);
    commit({ progress: p });
    if (p >= 1) clearInterval(progressTimer);
  }, 60);
  sequenceTimer = setTimeout(() => go(next), ms);
}

/* --- Navigation ----------------------------------------------------------- */

export function go(id, { back = false } = {}) {
  if (!id || id === state.screen) return;
  clearTimers();
  clearTimeout(leaveTimer);

  commit({ screen: id, leaving: state.screen, direction: back ? "back" : "forward" });
  leaveTimer = setTimeout(() => commit({ leaving: null }), 700);

  if (id === "langloading") runSequence(2200, "access");
  if (id === "paying") runSequence(1900, "confirm");
  if (id === "scanning") runSequence(2000, "found");
  if (id === "map") revealPins();
  if (id === "stop" || id === "artefact") stopAudio({ audio: 0.02 });
}

export function back() {
  go(BACK_TARGETS[state.screen] ?? (state.screen === "artefact" ? state.artefactFrom : "home"), {
    back: true,
  });
}

export function restart() {
  clearTimers();
  stopAudio();
  commit({ screen: "splash", leaving: null, stop: 0, code: "", progress: 0 });
  runSequence(2100, "language");
}

export function boot() {
  runSequence(2100, "language");
}

/* --- Preferences ---------------------------------------------------------- */

export const setLanguage = (name) => commit({ language: name });
export const setAppearance = (id) => commit({ appearance: id });
export const toggleContrast = () => commit({ contrast: !state.contrast });
export const setFontStep = (n) => commit({ fontStep: Math.max(0, Math.min(4, n)) });

/* --- Ticket flow ---------------------------------------------------------- */

export function changeVisitors(key, delta) {
  const next = Math.max(0, Math.min(9, state.visitors[key] + delta));
  commit({ visitors: { ...state.visitors, [key]: next } });
}

export const setDate = (i) => commit({ date: i });
export const setSlot = (i) => commit({ slot: i });
export const setGate = (i) => commit({ gate: i });
export const setLocker = (v) => commit({ locker: v });
export const setNeedsAccess = (v) => commit({ needsAccess: v });
export const setPayment = (i) => commit({ payment: i });

export function toggleAccommodation(i) {
  const on = state.accommodations.includes(i);
  commit({
    accommodations: on
      ? state.accommodations.filter((x) => x !== i)
      : [...state.accommodations, i],
  });
}

/* --- Map ------------------------------------------------------------------ */

export function setLevel(i) {
  commit({ level: i, pinsIn: false });
  revealPins(220);
}

function revealPins(delay = 260) {
  clearTimeout(pinTimer);
  commit({ pinsIn: false });
  pinTimer = setTimeout(() => commit({ pinsIn: true }), delay);
}

export function rerouteToSkyGallery() {
  setLevel(2);
  go("map", { back: true });
}

/* --- Artefact lookup ------------------------------------------------------ */

export function openArtefact(index, from = "scan") {
  commit({ artefact: index, artefactFrom: from });
  go("artefact");
}

export function pressKey(key) {
  const next = key === "⌫" ? state.code.slice(0, -1) : state.code.length < 4 ? state.code + key : state.code;
  commit({ code: next });
  if (next.length === 4) setTimeout(() => openArtefact(0, "scan"), 350);
}

export function submitCode() {
  if (state.code.length === 4) openArtefact(0, "scan");
}

/* --- Audio guide ---------------------------------------------------------- */

export function togglePlay() {
  clearInterval(audioTimer);
  const playing = !state.playing;
  commit({ playing });
  if (!playing) return;

  audioTimer = setInterval(() => {
    const next = state.audio + 0.006;
    if (next >= 1) {
      clearInterval(audioTimer);
      commit({ audio: 1, playing: false });
    } else {
      commit({ audio: next });
    }
  }, 60);
}

function stopAudio(patch = {}) {
  clearInterval(audioTimer);
  commit({ playing: false, ...patch });
}

export const toggleTranscript = () => commit({ transcriptOpen: !state.transcriptOpen });

/* --- Tour progression ----------------------------------------------------- */

export function openStop(index) {
  commit({ stop: index });
  stopAudio({ audio: 0.02 });
  go("stop");
}

export function nextStop() {
  if (state.stop >= STOPS.length - 1) return go("complete");
  commit({ stop: state.stop + 1 });
  stopAudio({ audio: 0.02 });
}

export function prevStop() {
  if (state.stop === 0) return go("tourdetail", { back: true });
  commit({ stop: state.stop - 1 });
  stopAudio({ audio: 0.02 });
}

/* --- Selectors ------------------------------------------------------------ */

export const totalVisitors = (s) =>
  VISITOR_TYPES.reduce((sum, type) => sum + s.visitors[type.key], 0);

export const totalPrice = (s) =>
  VISITOR_TYPES.reduce((sum, type) => sum + s.visitors[type.key] * type.price, 0);

export const totalLabel = (s) => `€${totalPrice(s)}`;

export const visitorCountLabel = (s) => {
  const n = totalVisitors(s);
  return `${n} ${n === 1 ? "visitor" : "visitors"}`;
};

export const slotLabel = (s) => `${SLOTS[s.slot].t} – ${SLOTS[s.slot].end}`;
export const dateLabel = (s) => `${DATES[s.date].dow} ${DATES[s.date].d} June 2026`;
export const currentStop = (s) => STOPS[s.stop];
export const currentArtefact = (s) => ARTEFACTS[s.artefact] ?? ARTEFACTS[0];

/** The audio guide runs against the artefact label or the tour stop. */
export const audioLength = (s) => (s.screen === "artefact" ? 190 : STOPS[s.stop].seconds);

export const purchasedTypes = (s) => VISITOR_TYPES.filter((type) => s.visitors[type.key] > 0);

export const checkoutSummary = (s) => [
  ...purchasedTypes(s).map((type) => ({
    k: type.name,
    v: `${s.visitors[type.key]} × ${type.price === 0 ? "free" : `€${type.price}`}`,
  })),
  { k: "Date & slot", v: `${DATES[s.date].dow} ${DATES[s.date].d} · ${SLOTS[s.slot].t}` },
  { k: "Starting gate", v: GATES[s.gate].name },
  {
    k: "Extras",
    v: (s.locker === "yes" ? "Locker" : "No locker") + (s.needsAccess === "yes" ? " · accommodations" : ""),
  },
];

export const ticketRows = (s) => [
  { k: "Visitor", v: s.visitorName },
  { k: "Tickets", v: purchasedTypes(s).map((t) => `${s.visitors[t.key]} ${t.name.toLowerCase()}`).join(", ") },
  { k: "Date", v: dateLabel(s) },
  { k: "Entry slot", v: slotLabel(s) },
  { k: "Starting tour", v: GATES[s.gate].name },
  { k: "Locker", v: s.locker === "yes" ? "Reserved · no. 14" : "Not needed" },
  { k: "Accommodations", v: s.needsAccess === "yes" ? accommodationNames(s) : "None" },
];

function accommodationNames(s) {
  const names = s.accommodations.map((i) => ACCOMMODATIONS[i]).filter(Boolean);
  return names.length ? names.join(", ") : "None";
}

/** "Auto" follows the device; there is no separate auto palette. */
export const themeName = (s) =>
  s.appearance === "auto"
    ? window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
    : s.appearance;

export const languageLine = (s) =>
  s.language === BSL ? "Signed guides,\nloading" : `Your guide,\nin ${s.language}`;
