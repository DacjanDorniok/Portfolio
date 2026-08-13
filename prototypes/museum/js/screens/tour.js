/* 24–27 · Tour: the catalogue, the route, a stop, and the ending. */

import { h, t } from "../dom.js";
import { bind, bindAttr, bindText } from "../reactive.js";
import { audioTime, hero, playButton, screen, transcript, waveform } from "../ui.js";
import {
  COMPLETE_STATS, IMG, SHOP_ITEMS, STOPS, TOURS, formatTime, tourMeta,
} from "../data.js";
import {
  currentStop, go, nextStop, openArtefact, openStop, prevStop, state,
} from "../store.js";

/* --- 24 All tours --------------------------------------------------------- */

export function toursScreen() {
  return screen(
    "tours",
    {},
    h(
      "div.scroll",
      { style: { padding: "112px 16px 104px" } },
      h("span.h1", { text: "Four ways in", style: { display: "block", marginBottom: "6px" } }),
      h("span.body-sm", {
        text: "Every tour is free with your ticket. Headphones help; the transcript is always there if not.",
        style: { display: "block", marginBottom: "22px" },
      }),
      h(
        "div.stack",
        { style: { gap: "14px" } },
        ...TOURS.map((tour, i) =>
          h(
            "button.tour-list-card",
            { onClick: () => i === 0 && go("tourdetail") },
            h(
              "span.tour-list-card__hero",
              {},
              h("span.hero__img", { bg: tour.img }),
              h("span.tour-list-card__scrim"),
              t("badge", "Free with your ticket"),
              h(
                "span.tour-list-card__title",
                {},
                t("tour-list-card__name", tour.name),
                t("tour-list-card__meta", tourMeta(tour))
              )
            ),
            t("tour-list-card__blurb", tour.blurb)
          )
        )
      )
    )
  );
}

/* --- 25 Tour detail ------------------------------------------------------- */

export function tourDetailScreen() {
  const heroFrame = hero({ img: IMG.dinoTour, height: 340 });
  heroFrame.append(
    h(
      "div.hero__body",
      { style: { bottom: "18px" } },
      t("eyebrow eyebrow--photo", "Free with your ticket"),
      h("span.display", { html: "Dinosaur<br>Era" }),
      h(
        "span",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(240,230,211,.6)",
          },
        },
        h("span", { text: "4 stops" }),
        h("span", { text: "·" }),
        h("span", { text: "45 minutes" }),
        h("span", { text: "·" }),
        h("span", { text: "Levels 1–2" })
      )
    )
  );

  return screen(
    "tourdetail",
    {},
    h(
      "div.scroll",
      { style: { paddingBottom: "150px" } },
      heroFrame,
      h(
        "div",
        { style: { padding: "4px 16px 0" } },
        h("span.body", {
          text: "Explore ancient giants up close in a fast, immersive journey through the age of dinosaurs. Start at the tail of the Diplodocus and end under the jaws of the Allosaurus.",
          style: { display: "block", marginBottom: "26px" },
        }),
        h("span.eyebrow", { text: "The route", style: { marginBottom: "14px" } }),
        h(
          "div.route",
          {},
          h(
            "div.stack",
            { style: { gap: "4px" } },
            ...STOPS.map((stop, i) =>
              h(
                "button.route-stop",
                { onClick: () => openStop(i) },
                h("span.route-stop__thumb", { bg: stop.img }),
                h(
                  "span.stack",
                  { style: { flex: "1", gap: "3px" } },
                  h("span.eyebrow.eyebrow--amber", { text: `Stop ${stop.n}`, style: { letterSpacing: "0.14em" } }),
                  h("span.h3", { text: stop.name }),
                  t("meta", `${stop.code} · ${stop.hall}`)
                ),
                h("span.chev", { text: "→", style: { fontSize: "16px" } })
              )
            )
          )
        ),
        h(
          "div.note",
          { style: { marginTop: "22px" } },
          t("note__mark", "◈"),
          t(
            "note__text",
            "Stops 3 and 4 are on Level 2. The lift by Gate 01 reaches both, and the route below avoids stairs entirely."
          )
        )
      )
    ),
    h(
      "div.action-bar.action-bar--above-nav",
      {},
      h("button.btn.btn--primary", {
        text: "Start the tour",
        onClick: () => openStop(0),
        style: { height: "56px" },
      })
    )
  );
}

/* --- 26 Tour stop --------------------------------------------------------- */

export function stopScreen() {
  const heroImg = h("div.hero__img.hero__img--drift");
  bind(
    (s) => currentStop(s).img,
    (img) => { heroImg.style.backgroundImage = `url(${img})`; }
  );

  const ticks = STOPS.map((_, i) => {
    const tick = h("i");
    bindAttr(tick, "data-done", (s) => i <= s.stop);
    return tick;
  });

  const eyebrow = h("span.eyebrow.eyebrow--amber", { style: { marginBottom: "10px" } });
  bindText(eyebrow, (s) => `Stop ${s.stop + 1} of ${STOPS.length} · ${currentStop(s).hall}`);

  const name = h("span.h1", { style: { display: "block", marginBottom: "6px" } });
  bindText(name, (s) => currentStop(s).name);

  const code = h("span.meta", { style: { display: "block", marginBottom: "18px" } });
  bindText(code, (s) => currentStop(s).code);

  const length = h("span.meta.tabular");
  bindText(length, (s) => formatTime(currentStop(s).seconds));

  const script = transcript((s) => currentStop(s).transcript);

  const body = h("span.body");
  bindText(body, (s) => currentStop(s).body);

  const labelLink = h("span", { style: { fontSize: "var(--t-sm)", fontWeight: "700" } });
  bindText(labelLink, (s) => `Read the full label · ${currentStop(s).name}`);

  const next = h("button.btn.btn--primary.btn--sm", { onClick: nextStop, "data-grow": "1.3" });
  bindText(next, (s) => (s.stop >= STOPS.length - 1 ? "Finish tour" : "Next stop ›"));

  return screen(
    "stop",
    {},
    h(
      "div.scroll",
      { style: { paddingBottom: "190px" } },
      h(
        "div.hero",
        { style: { height: "400px" } },
        heroImg,
        h("div.hero__scrim", {
          style: {
            background:
              "linear-gradient(180deg,rgba(10,9,8,.6) 0%,rgba(10,9,8,0) 32%,rgba(10,9,8,.55) 72%,var(--bg) 100%)",
          },
        }),
        h("div.grain"),
        h("div.ticks", {}, ...ticks)
      ),
      h(
        "div.plaque",
        { style: { marginTop: "-104px" } },
        eyebrow,
        name,
        code,
        h(
          "div.player",
          {},
          playButton(true),
          h(
            "span.stack",
            { style: { flex: "1", gap: "9px" } },
            waveform(),
            h(
              "span",
              { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between" } },
              audioTime("body-sm tabular"),
              length
            )
          )
        ),
        h("div", { style: { marginTop: "16px" } }, script.label),
        script.region
      ),
      h(
        "div",
        { style: { padding: "26px 16px 0", display: "flex", flexDirection: "column", gap: "14px" } },
        t("eyebrow eyebrow--amber", "While you listen"),
        body
      ),
      h(
        "div",
        { style: { padding: "22px 16px 0" } },
        h(
          "button.link-row",
          { onClick: () => openArtefact(state.stop, "stop") },
          labelLink,
          h("span.chev--amber", { text: "→" })
        )
      )
    ),
    h(
      "div.action-bar.action-bar--row.action-bar--above-nav",
      {},
      h("button.btn.btn--outline.btn--sm", { text: "‹ Previous", onClick: prevStop, style: { height: "54px" } }),
      next
    )
  );
}

/* --- 27 Tour complete ----------------------------------------------------- */

export function completeScreen() {
  const heroFrame = hero({ img: IMG.firelight, height: 392 });
  heroFrame.append(
    h(
      "div.hero__body",
      { style: { animation: "hm-rise .7s var(--ease) both" } },
      h("span.eyebrow", { text: "Tour complete", style: { color: "#E08B3A", letterSpacing: "0.28em" } }),
      h("span.display", { html: "152 million<br>years, in 45<br>minutes" })
    )
  );

  return screen(
    "complete",
    {},
    h(
      "div.scroll",
      { style: { paddingBottom: "104px" } },
      heroFrame,
      h(
        "div",
        { style: { padding: "6px 16px 0" } },
        h(
          "div",
          { style: { display: "flex", gap: "8px", marginBottom: "24px" } },
          ...COMPLETE_STATS.map((stat) =>
            h("span.stat", {}, t("stat__n", stat.n), t("stat__k", stat.k))
          )
        ),
        h("span.body", {
          text: "If you want to keep going — Ancient Egypt, the Palaeolithic Period, the Mesopotamian civilisations — they are all free and all still open today.",
          style: { display: "block", marginBottom: "26px" },
        }),
        h(
          "button.link-row.link-row--amber",
          { onClick: () => go("tours"), style: { marginBottom: "30px", height: "56px" } },
          h("span", { text: "Pick another tour", style: { fontSize: "var(--t-sm)", fontWeight: "700" } }),
          h("span.chev--amber", { text: "→" })
        ),
        h("span.eyebrow", { text: "From the gift shop", style: { marginBottom: "6px" } }),
        h("span.meta", {
          text: "Optional, and only if you are passing. Your ticket takes 10% off each of these.",
          style: { display: "block", lineHeight: "1.6", marginBottom: "14px" },
        }),
        h(
          "div.rail",
          { style: { margin: "0 -16px", padding: "0 16px 4px", gap: "10px" } },
          ...SHOP_ITEMS.map((item) =>
            h(
              "span.shop-item",
              {},
              h("span.shop-item__img", { bg: item.img }),
              h("span", { text: item.name, style: { fontSize: "var(--t-sm)", fontWeight: "600", lineHeight: "1.3" } }),
              t("meta", item.price)
            )
          )
        )
      )
    )
  );
}

export const tourScreens = () => [
  toursScreen(),
  tourDetailScreen(),
  stopScreen(),
  completeScreen(),
];
