/* 05 · Plan: the home screen and the menu sheet. */

import { h, t } from "../dom.js";
import { chevron, hero, screen, sheet } from "../ui.js";
import { IMG, MENU_ITEMS, OPENING_HOURS, TOURS, tourMeta } from "../data.js";
import { go } from "../store.js";

export function homeScreen() {
  return screen(
    "home",
    {},
    h(
      "div.scroll",
      { style: { paddingBottom: "104px" } },
      homeHero(),
      h(
        "div",
        { style: { padding: "6px 16px 0", display: "flex", flexDirection: "column", gap: "20px" } },
        h("span.body", {
          text: "A collection that brings Berlin's deep past into the room with you — interactive displays, unrepeatable artefacts, and guided tours that cost nothing.",
          style: { lineHeight: "1.65" },
        }),
        h(
          "div.kv-list",
          {},
          ...OPENING_HOURS.map((row) =>
            h("div.kv", {}, t("kv__k", row.k), t("kv__v", row.v))
          )
        )
      ),
      toursRail(),
      giftShopPromo()
    )
  );
}

function homeHero() {
  const frame = hero({ img: IMG.hall, className: "home__hero" });
  frame.append(
    h(
      "div.hero__body",
      {},
      t("eyebrow eyebrow--photo", "Open now · until 18:00"),
      h("span.display", { html: "History<br>Museum" }),
      h("span.body-sm", {
        text: "Rudolstaedter Strasse 63 · 13467 Berlin",
        style: { color: "rgba(240,230,211,.7)" },
      }),
      h(
        "button.btn.btn--primary",
        { onClick: () => go("ticket1"), style: { height: "56px", justifyContent: "space-between", padding: "0 20px" } },
        h("span", { text: "Buy an entrance ticket" }),
        h("span", { text: "→", style: { fontSize: "18px" } })
      )
    )
  );
  return frame;
}

function toursRail() {
  return h(
    "div",
    { style: { padding: "34px 0 0" } },
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "0 16px 4px",
        },
      },
      h("span.h2", { text: "Guided tours" }),
      h("button.eyebrow.eyebrow--amber", {
        text: "All tours",
        onClick: () => go("tours"),
        style: { border: "none", background: "transparent", cursor: "pointer", fontWeight: "700", letterSpacing: "0.14em" },
      })
    ),
    h("span.meta", { text: "Free with your ticket", style: { display: "block", padding: "0 16px 16px" } }),
    h(
      "div.rail",
      {},
      ...TOURS.map((tour, i) =>
        h(
          "button.tour-card",
          { onClick: () => go(i === 0 ? "tourdetail" : "tours") },
          h("span.hero__img", { bg: tour.img }),
          h("span.tour-card__scrim"),
          t("badge", "Free"),
          h(
            "span.tour-card__body",
            {},
            t("tour-card__name", tour.name),
            t("tour-card__meta", tourMeta(tour))
          )
        )
      )
    )
  );
}

function giftShopPromo() {
  return h(
    "div",
    { style: { padding: "34px 16px 0" } },
    h(
      "button.promo",
      { onClick: () => {} },
      h("span.hero__img", { bg: IMG.vase, style: { backgroundPosition: "center 30%" } }),
      h("span.promo__scrim"),
      h(
        "span.promo__body",
        {},
        h(
          "span.stack",
          { style: { gap: "6px" } },
          h("span", {
            text: "The gift shop",
            style: { fontFamily: "var(--font-display)", fontSize: "26px", lineHeight: "1.05" },
          }),
          h("span", {
            text: "Casts, prints and books from the collection",
            style: { fontSize: "12px", color: "rgba(240,230,211,.62)" },
          })
        ),
        h("span", { text: "→", style: { fontSize: "18px" } })
      )
    )
  );
}

export function menuScreen() {
  return screen(
    "menu",
    {},
    ...sheet(
      h(
        "div.stack",
        { style: { gap: "2px" } },
        ...MENU_ITEMS.map((item) =>
          h(
            "button.menu-item",
            { onClick: () => item.to && go(item.to) },
            t("menu-item__icon", item.icon),
            h(
              "span.stack",
              { style: { flex: "1", gap: "2px" } },
              h("span", { text: item.name, style: { fontSize: "var(--t-md)", fontWeight: "600" } }),
              t("meta", item.sub)
            ),
            chevron()
          )
        )
      )
    )
  );
}

export const planScreens = () => [homeScreen(), menuScreen()];
