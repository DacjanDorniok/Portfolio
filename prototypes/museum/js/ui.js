/* Pieces used by more than one screen. */

import { h, t } from "./dom.js";
import { bind, bindAttr, bindText } from "./reactive.js";
import { SHEET_SCREENS, WAVE, formatTime } from "./data.js";
import { audioLength, back, togglePlay, toggleTranscript } from "./store.js";

/**
 * A screen container. Every screen stays mounted so the cross-fade has
 * something to fade between; visibility is driven by data attributes.
 */
export function screen(id, options, ...children) {
  const { photo = false } = options || {};
  const isSheet = SHEET_SCREENS.includes(id);
  const el = h("div.screen", { "data-screen": id }, ...children);

  if (photo) el.setAttribute("data-photo", "");
  if (isSheet) el.setAttribute("data-sheet", "");

  bindAttr(el, "data-vis", (s) =>
    s.screen === id ? "current" : s.leaving === id ? "leaving" : "idle"
  );
  bindAttr(el, "data-dir", (s) => s.direction);
  return el;
}

/** Full-bleed photograph with its scrim and optional film grain. */
export function hero(options) {
  const { img, height, drift = true, grain = true, scrim = true, className = "" } = options;
  return h(
    "div.hero" + (className ? "." + className.split(" ").join(".") : ""),
    { style: height ? { height: `${height}px` } : undefined },
    h("div.hero__img" + (drift ? ".hero__img--drift" : ""), { bg: img }),
    scrim && h("div.hero__scrim"),
    grain && h("div.grain")
  );
}

/** Backdrop plus panel for a bottom sheet. Tapping the backdrop goes back. */
export function sheet(...children) {
  return [
    h("button.sheet-backdrop", { onClick: back, "aria-label": "Close" }),
    h("div.sheet", {}, h("div.sheet__grip"), ...children),
  ];
}

/** Determinate bar bound to the active timed sequence. */
export function progressBar(className = "") {
  const fill = h("div.progress__fill");
  bind(
    (s) => `${Math.round(s.progress * 100)}%`,
    (width) => { fill.style.width = width; }
  );
  return h("div.progress" + (className ? "." + className : ""), {}, fill);
}

/** Waveform whose played portion tracks the audio position. */
export function waveform() {
  const bars = WAVE.map((height) => h("span", { style: { height: `${height}px` } }));
  bars.forEach((bar, i) => {
    bindAttr(bar, "data-played", (s) => i / WAVE.length <= s.audio);
  });
  return h("span.wave", {}, ...bars);
}

/** Play / pause control. */
export function playButton(large = false) {
  const button = h("button.player__play" + (large ? ".player__play--lg" : ""), {
    onClick: togglePlay,
    "aria-label": "Play the audio guide",
  });
  bindText(button, (s) => (s.playing ? "❚❚" : "▶"));
  return button;
}

/** Elapsed time, formatted against whichever track is in scope. */
export function audioTime(className = "meta") {
  const el = h("span." + className.split(" ").join("."));
  bindText(el, (s) => formatTime(s.audio * audioLength(s)));
  return el;
}

/** Show / hide transcript button plus the region it controls. */
export function transcript(getText, { className = "" } = {}) {
  const label = h("button.btn.btn--outline.btn--sm", {
    onClick: toggleTranscript,
    style: { height: "44px", borderRadius: "11px", fontSize: "var(--t-xs)", letterSpacing: "0.06em" },
  });
  bindText(label, (s) => (s.transcriptOpen ? "Hide transcript" : "Show transcript"));

  const body = h("span.body-sm", {
    style: { display: "block", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--line-2)" },
  });
  bindText(body, getText);

  const region = h("div.collapse" + (className ? "." + className : ""), {}, body);
  bindAttr(region, "data-open", (s) => s.transcriptOpen);

  return { label, region };
}

/** Section heading: eyebrow, title, optional supporting line. */
export function pageHead(title, note, { eyebrow } = {}) {
  return h(
    "div.stack",
    { style: { gap: "8px", marginBottom: "24px" } },
    eyebrow && t("eyebrow", eyebrow),
    h("span.h1", { text: title }),
    note && h("span.body-sm", { text: note })
  );
}

export const chevron = () => t("chev", "→");
export const chevronAmber = () => t("chev--amber", "→");
