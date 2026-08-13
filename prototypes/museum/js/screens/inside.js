/* 16–23 · Inside: the floor map, the scanner, artefact lookup and the label. */

import { h, svg, t } from "../dom.js";
import { bind, bindAttr, bindList, bindStyle, bindText } from "../reactive.js";
import {
  audioTime, chevronAmber, playButton, progressBar, screen, sheet, transcript,
  waveform,
} from "../ui.js";
import {
  CROWD_ROWS, IMG, LEVELS, MAP_LEGEND, NUMPAD_KEYS, SEARCH_RESULTS, STOPS,
} from "../data.js";
import {
  back, currentArtefact, go, openArtefact, openStop, pressKey,
  rerouteToSkyGallery, setLevel, state, submitCode,
} from "../store.js";

/* --- 16 Floor map --------------------------------------------------------- */

export function mapScreen() {
  const rooms = h("div");
  bindList(
    rooms,
    (s) => LEVELS[s.level].rooms,
    (room) =>
      h(
        "div.room",
        {
          "data-crowd": room.crowd,
          style: { left: `${room.x}%`, top: `${room.y}%`, width: `${room.w}%`, height: `${room.h}%` },
        },
        t("room__n", room.n),
        h("span.room__legend", {}, h("span.room__dot"), t("room__sub", room.sub))
      )
  );

  const doors = h("div");
  bindList(
    doors,
    (s) => LEVELS[s.level].doors,
    (door) =>
      h("span.door", {
        style: door.v
          ? { left: `${door.x}%`, top: `${door.y}%`, width: "2.5px", height: `${door.l}%`, marginLeft: "-1.25px" }
          : { left: `${door.x}%`, top: `${door.y}%`, height: "2.5px", width: `${door.l}%`, marginTop: "-1.25px" },
      })
  );

  const routePath = svg("path", {
    fill: "none",
    stroke: "#E08B3A",
    "stroke-width": "0.7",
    "stroke-linecap": "round",
    "stroke-dasharray": "2.4 2",
  });
  bindAttr(routePath, "d", (s) => LEVELS[s.level].route);

  const pins = h("div");
  bindList(
    pins,
    (s) => LEVELS[s.level].pins,
    (pin) =>
      h(
        "button.pin",
        {
          onClick: () => openStop(pin.target),
          style: { left: `${pin.x}%`, top: `${pin.y}%`, transitionDelay: `${(pin.n - 1) * 0.14}s` },
        },
        t("pin__n", pin.n),
        t("pin__name", pin.name)
      )
  );

  const here = h("div.here", {}, h("span.here__dot"), t("here__label", "You are here"));
  bindStyle(here, "left", (s) => `${LEVELS[s.level].here[0]}%`);
  bindStyle(here, "top", (s) => `${LEVELS[s.level].here[1]}%`);

  const plan = h(
    "div.map__plan",
    {},
    h("span.map__grid"),
    rooms,
    doors,
    svg("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", class: "map__route" }, routePath),
    pins,
    here
  );
  bindAttr(plan, "data-pins", (s) => (s.pinsIn ? "in" : "out"));

  const title = h("span.map__title");
  bindText(title, (s) => LEVELS[s.level].title);
  const subtitle = h("span.map__sub");
  bindText(subtitle, (s) => LEVELS[s.level].sub);

  const levels = ["G", "1", "2"].map((label, i) => {
    const button = h("button.level", { text: label, onClick: () => setLevel(i) });
    bindAttr(button, "data-selected", (s) => s.level === i);
    return button;
  });

  return screen(
    "map",
    { photo: true },
    h("div.map__paper"),
    h("div.map__wash"),
    h("div.grain.grain--live", { style: { animation: "none", opacity: "0.1" } }),
    plan,
    h(
      "div.map__head",
      {},
      h("span.stack", { style: { gap: "5px", flex: "1" } }, title, subtitle),
      h("div.level-switch", {}, ...levels)
    ),
    h(
      "div.map__foot",
      {},
      h(
        "button.alert",
        { onClick: () => go("mapcrowd") },
        h("span.alert__beacon"),
        h(
          "span.stack",
          { style: { flex: "1", gap: "3px" } },
          h("span", { text: "Overcrowded area", style: { fontSize: "13px", fontWeight: "700" } }),
          h("span", {
            text: "Hall of Giants · about 18 min wait right now",
            style: { fontSize: "11px", color: "rgba(240,230,211,.58)" },
          })
        ),
        h("span", { text: "→", style: { fontSize: "16px", color: "rgba(240,230,211,.6)" } })
      ),
      h(
        "div.legend",
        {},
        ...MAP_LEGEND.map((entry) =>
          h("span", {}, h("i", { style: { background: entry.colour } }), h("span", { text: entry.name }))
        )
      )
    )
  );
}

/* --- 17 Overcrowded sheet ------------------------------------------------- */

export function crowdSheetScreen() {
  return screen(
    "mapcrowd",
    {},
    ...sheet(
      h(
        "div",
        { style: { display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "18px" } },
        h("span", {
          text: "◍",
          style: {
            width: "44px",
            height: "44px",
            flexShrink: "0",
            borderRadius: "12px",
            border: "1px solid rgba(196,68,62,.4)",
            background: "rgba(196,68,62,.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "17px",
            color: "var(--crimson)",
          },
        }),
        h(
          "span.stack",
          { style: { gap: "4px" } },
          h("span.h2", { text: "Hall of Giants" }),
          h("span.eyebrow", {
            text: "Overcrowded · about 18 min wait",
            style: { color: "var(--crimson)", letterSpacing: "0.1em" },
          })
        )
      ),
      h(
        "div.kv-list",
        { style: { marginBottom: "14px" } },
        ...CROWD_ROWS.map((row) =>
          h("div.kv", { style: { background: "var(--raise)" } }, t("kv__k", row.k), t("kv__v", row.v))
        )
      ),
      h("span.body-sm", {
        text: "The Sky Gallery on Level 2 is quiet right now and holds two of your four tour stops. You can take it out of order and come back.",
        style: { display: "block", marginBottom: "16px" },
      }),
      h(
        "div.btn-row",
        {},
        h("button.btn.btn--outline.btn--sm", { text: "Wait it out", onClick: back }),
        h("button.btn.btn--primary.btn--sm", {
          text: "Reroute to Sky Gallery",
          onClick: rerouteToSkyGallery,
          "data-grow": "1.4",
        })
      )
    )
  );
}

/* --- 18 Scanner ----------------------------------------------------------- */

export function scannerScreen() {
  return screen(
    "scan",
    { photo: true },
    h("div.hero__img", { bg: IMG.cracks, style: { opacity: "0.5", filter: "blur(1px)" } }),
    h("div", {
      style: {
        position: "absolute",
        inset: "0",
        background: "radial-gradient(58% 34% at 50% 42%, rgba(0,0,0,0) 40%, rgba(8,7,6,.86) 100%)",
      },
    }),
    h(
      "div",
      {
        style: {
          position: "absolute",
          left: "0",
          right: "0",
          top: "66px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px 0 6px",
          zIndex: "5",
          color: "var(--on-photo)",
        },
      },
      h("button.top-nav__btn", { text: "‹", onClick: back, "aria-label": "Back" }),
      t("top-nav__title", "Scan artefact"),
      h("span", { style: { width: "44px" } })
    ),
    h("div.scan__reticle", {}, h("i"), h("i"), h("i"), h("i")),
    h(
      "div.stack",
      {
        style: {
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "0",
          padding: "0 16px 106px",
          gap: "14px",
        },
      },
      h("span.body-sm", {
        text: "Hold your camera over the small square code on the artefact's label. It opens the guide, the audio, and the long read.",
        style: { textAlign: "center", color: "rgba(240,230,211,.78)" },
      }),
      h("button.btn.btn--primary", {
        text: "Start scanning",
        onClick: () => go("scanning"),
        style: { height: "56px" },
      }),
      h("div.rule", {}, h("i"), h("span", { text: "or" }), h("i")),
      h(
        "div.btn-row",
        {},
        h("button.btn.btn--outline.btn--sm", {
          text: "Enter its number",
          onClick: () => go("searchnum"),
          style: { background: "rgba(240,230,211,.05)", borderColor: "rgba(240,230,211,.18)", color: "#F0E6D3" },
        }),
        h("button.btn.btn--outline.btn--sm", {
          text: "Search by name",
          onClick: () => go("searchname"),
          style: { background: "rgba(240,230,211,.05)", borderColor: "rgba(240,230,211,.18)", color: "#F0E6D3" },
        })
      )
    )
  );
}

/* --- 19 Focus lock -------------------------------------------------------- */

export function scanningScreen() {
  return screen(
    "scanning",
    { photo: true },
    h("div.hero__img", { bg: IMG.diplodocus, style: { opacity: "0.62" } }),
    h("div", {
      style: {
        position: "absolute",
        inset: "0",
        background: "radial-gradient(46% 26% at 50% 40%, rgba(0,0,0,0) 42%, rgba(8,7,6,.9) 100%)",
      },
    }),
    h("div.scan__lock"),
    h(
      "div.stack",
      {
        style: {
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "0",
          padding: "0 24px 120px",
          alignItems: "center",
          gap: "12px",
        },
      },
      h("span", {
        text: "Scanning in progress",
        style: { fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--amber)" },
      }),
      h("span.h2", { text: "Hold steady", style: { color: "var(--on-photo)" } }),
      h("div", { style: { width: "150px", marginTop: "6px" } }, progressBar()),
      h("button.pill-btn", {
        text: "Stop scanning",
        onClick: back,
        style: { marginTop: "14px", height: "44px", padding: "0 22px" },
      })
    )
  );
}

/* --- 20 Artefact found ---------------------------------------------------- */

export function foundScreen() {
  return screen(
    "found",
    {},
    ...sheet(
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" } },
        h("span", {
          bg: IMG.diplodocus,
          style: {
            width: "76px",
            height: "76px",
            flexShrink: "0",
            borderRadius: "14px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid var(--line)",
          },
        }),
        h(
          "span.stack",
          { style: { gap: "5px" } },
          t("eyebrow eyebrow--amber", "Artefact found"),
          h("span.h2", { text: "Diplodocus" }),
          t("meta", "#5604 · Hall of Giants · Level 1")
        )
      ),
      h(
        "div.btn-row",
        {},
        h("button.btn.btn--outline.btn--sm", { text: "Scan another", onClick: back }),
        h("button.btn.btn--primary.btn--sm", {
          text: "Open the guide",
          onClick: () => openArtefact(0, "scan"),
          "data-grow": "1.5",
        })
      )
    )
  );
}

/* --- 21 Artefact number --------------------------------------------------- */

export function codeScreen() {
  const cells = [0, 1, 2, 3].map((i) => {
    const cell = h("span.code-cell");
    bindText(cell, (s) => s.code[i] ?? "");
    bindAttr(cell, "data-active", (s) => i < s.code.length || i === s.code.length);
    return cell;
  });

  const hint = h("span.meta", { style: { textAlign: "center", marginBottom: "auto", minHeight: "18px" } });
  bindText(hint, (s) =>
    s.code.length === 4 ? "Opening artefact…" : "Printed beneath the artefact's name on its label."
  );

  const submit = h("button.btn.btn--primary", {
    text: "Open artefact",
    onClick: submitCode,
    style: { marginTop: "12px" },
  });
  bind(
    (s) => s.code.length < 4,
    (incomplete) => {
      submit.disabled = incomplete;
    }
  );

  return screen(
    "searchnum",
    {},
    h(
      "div.stack",
      { style: { position: "absolute", left: "0", right: "0", top: "118px", bottom: "0", padding: "0 16px 26px" } },
      h("span.h2", { text: "Every label has a number", style: { marginBottom: "6px" } }),
      h("span.body-sm", {
        text: "Type the four digits printed under the artefact's name. Works without a camera, and without getting close.",
        style: { display: "block", marginBottom: "22px" },
      }),
      h("div.code-cells", {}, ...cells),
      hint,
      h(
        "div.numpad",
        {},
        ...NUMPAD_KEYS.map((key) =>
          h("button", {
            text: key,
            "data-blank": key === "" || null,
            onClick: () => key && pressKey(key),
          })
        )
      ),
      submit
    )
  );
}

/* --- 22 Search by name ---------------------------------------------------- */

export function searchScreen() {
  return screen(
    "searchname",
    {},
    h(
      "div.scroll.scroll--inset",
      {},
      h(
        "div.search-field",
        {},
        h("span", { text: "⌕", style: { color: "var(--amber)", fontSize: "15px" } }),
        h("span", { text: "diplo", style: { flex: "1", fontSize: "var(--t-md)" } }),
        h("span.caret")
      ),
      h("span.eyebrow", { text: `${SEARCH_RESULTS.length} results`, style: { marginBottom: "12px" } }),
      h(
        "div.stack",
        { style: { gap: "8px" } },
        ...SEARCH_RESULTS.map((result) =>
          h(
            "button.result",
            { onClick: () => openArtefact(result.artefact, "searchname") },
            h("span.result__thumb", { bg: result.img }),
            h(
              "span.stack",
              { style: { flex: "1", gap: "4px" } },
              h("span", { text: result.name, style: { fontSize: "var(--t-md)", fontWeight: "600" } }),
              t("meta", result.sub)
            ),
            h("span.chev", { text: "→", style: { fontSize: "16px" } })
          )
        )
      )
    )
  );
}

/* --- 23 Artefact label ---------------------------------------------------- */

export function artefactScreen() {
  const heroImg = h("div.hero__img.hero__img--drift");
  bind(
    (s) => currentArtefact(s).img,
    (img) => { heroImg.style.backgroundImage = `url(${img})`; }
  );

  const code = h("span.plaque__code");
  bindText(code, (s) => currentArtefact(s).code);
  const name = h("span.h1", { style: { display: "block" } });
  bindText(name, (s) => currentArtefact(s).name);
  const latin = h("span.plaque__latin");
  bindText(latin, (s) => currentArtefact(s).latin);

  const plaqueRows = h("div");
  bindList(
    plaqueRows,
    (s) => currentArtefact(s).plaque,
    (row) => h("div.plaque__row", {}, t("plaque__k", row.k), t("plaque__v", row.v))
  );

  const quote = transcript((s) => `“${STOPS[s.artefact].transcript}”`);

  const figureImg = h("span.figure__img");
  bind(
    (s) => currentArtefact(s).figImg,
    (img) => { figureImg.style.backgroundImage = `url(${img})`; }
  );
  const figureCaption = h("span.figure__caption");
  bindText(figureCaption, (s) => currentArtefact(s).figCaption);

  const stopLink = h("span", { style: { fontSize: "var(--t-sm)", fontWeight: "700" } });
  bindText(stopLink, (s) => `Dinosaur Era · stop ${s.artefact + 1} of 4`);

  return screen(
    "artefact",
    {},
    h(
      "div.scroll",
      { style: { paddingBottom: "104px" } },
      h("div.hero.artefact__hero", {}, heroImg, h("div.hero__scrim"), h("div.grain")),
      h("div.plaque", {}, code, name, latin, plaqueRows),
      audioCard(quote),
      prose("Origin", (s) => currentArtefact(s).origin1, (s) => currentArtefact(s).origin2),
      h("div.figure", {}, figureImg, h("span.figure__scrim"), figureCaption),
      prose("Habits", (s) => currentArtefact(s).habits1, (s) => currentArtefact(s).habits2),
      h(
        "div",
        { style: { padding: "26px 16px 0" } },
        h(
          "button.link-row.link-row--amber",
          { onClick: () => openStop(state.artefact), style: { height: "60px" } },
          h("span.stack", { style: { gap: "3px" } }, t("eyebrow eyebrow--amber", "Part of a tour"), stopLink),
          chevronAmber()
        )
      )
    )
  );
}

function audioCard(quote) {
  return h(
    "div.card.card--raise",
    { style: { margin: "14px 16px 0" } },
    h(
      "div.player",
      {},
      playButton(),
      h(
        "span.stack",
        { style: { flex: "1", gap: "8px" } },
        h(
          "span",
          { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px" } },
          h("span", { text: "Audio guide", style: { fontSize: "var(--t-sm)", fontWeight: "700" } }),
          audioTime()
        ),
        waveform()
      )
    ),
    h(
      "div.btn-row",
      { style: { marginTop: "16px" } },
      quote.label,
      h("button.btn.btn--outline.btn--sm", {
        text: "Sign language",
        onClick: () => {},
        style: { height: "44px", borderRadius: "11px" },
      })
    ),
    quote.region
  );
}

function prose(heading, first, second) {
  const a = h("span.body");
  bindText(a, first);
  const b = h("span.body");
  bindText(b, second);
  return h("div.prose", {}, t("eyebrow eyebrow--amber", heading), a, b);
}

export const insideScreens = () => [
  mapScreen(),
  crowdSheetScreen(),
  scannerScreen(),
  scanningScreen(),
  foundScreen(),
  codeScreen(),
  searchScreen(),
  artefactScreen(),
];
