/* Wires the whole thing together: build the DOM once, then let the store
   drive it. Nothing below re-creates elements on a state change.

   Portfolio build: the review harness (topbar, spec panel, flow map) is not
   part of this copy — the app runs on its own inside the case-study frame. */

import { flush } from "./reactive.js";
import { boot, state, subscribe, themeName } from "./store.js";
import { FONT_SCALE } from "./data.js";
import { chrome } from "./chrome.js";
import { arrivalScreens } from "./screens/arrival.js";
import { planScreens } from "./screens/plan.js";
import { ticketScreens } from "./screens/ticket.js";
import { insideScreens } from "./screens/inside.js";
import { tourScreens } from "./screens/tour.js";

const phone = document.getElementById("phone");
phone.append(
  ...arrivalScreens(),
  ...planScreens(),
  ...ticketScreens(),
  ...insideScreens(),
  ...tourScreens(),
  ...chrome()
);

/* Theme and type scale live as attributes on the device root, so every
   component picks them up through the cascade rather than through JS. */
function applyPresentation(s) {
  phone.dataset.theme = themeName(s);
  phone.dataset.contrast = s.contrast ? "high" : "normal";
  phone.style.setProperty("--scale", String(FONT_SCALE[s.fontStep]));
}

subscribe((s) => {
  applyPresentation(s);
  flush(s);
});

/* Deep link: `?screen=map` drops straight onto a screen with the boot sequence
   skipped, so the case study can frame a single screen and so screenshots are
   reproducible. Without it the app opens where a visitor would — the splash. */
function deepLink() {
  const q = new URLSearchParams(location.search);
  const screen = q.get("screen");
  if (!screen) return false;

  const num = (key, fallback) => (q.has(key) ? Number(q.get(key)) : fallback);
  Object.assign(state, {
    screen,
    leaving: null,
    appearance: q.get("appearance") || state.appearance,
    fontStep: num("fontStep", state.fontStep),
    artefact: num("artefact", state.artefact),
    stop: num("stop", state.stop),
    level: num("level", state.level),
    progress: 1,
    pinsIn: true, // the map reveals its pins on entry; a deep link has no entry
  });
  return true;
}

const linked = deepLink();
applyPresentation(state);
flush(state);
if (!linked) boot();
