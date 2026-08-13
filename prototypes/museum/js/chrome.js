/* Persistent device chrome: status bar, top nav, tab bar, home indicator.
   These sit above every screen and react to which screen is showing. */

import { h, svg, t } from "./dom.js";
import { bindAttr, bindText } from "./reactive.js";
import {
  SCREENS_OVER_PHOTO, SCREENS_WITHOUT_SCRIM, SCREENS_WITHOUT_TOP_NAV,
  SCREENS_WITH_TAB_BAR, TABS, TAB_FOR_SCREEN, TOP_NAV_TITLES,
} from "./data.js";
import { back, go } from "./store.js";

const overPhoto = (s) => SCREENS_OVER_PHOTO.includes(s.screen);

export function chrome() {
  return [scrim(), statusBar(), topNav(), tabBar(), homeIndicator()];
}

function scrim() {
  const el = h("div.chrome-scrim");
  bindAttr(el, "data-over-photo", overPhoto);
  bindAttr(el, "data-hidden", (s) => SCREENS_WITHOUT_SCRIM.includes(s.screen));
  return el;
}

function statusBar() {
  const el = h(
    "div.status-bar",
    {},
    h("span", { text: "11:22" }),
    h(
      "span.status-bar__right",
      {},
      h("span.status-bar__bars", {}, h("i"), h("i"), h("i"), h("i")),
      h("span.status-bar__battery", {}, h("i"))
    )
  );
  // The status bar also sits over photos on the timed full-bleed screens.
  bindAttr(el, "data-over-photo", (s) =>
    overPhoto(s) || ["splash", "langloading", "paying", "scanning", "scan"].includes(s.screen)
  );
  return el;
}

function topNav() {
  const title = h("span.top-nav__title");
  bindText(title, (s) => TOP_NAV_TITLES[s.screen] ?? "");

  const el = h(
    "div.top-nav",
    {},
    h("button.top-nav__btn", { text: "‹", onClick: back, "aria-label": "Back" }),
    title,
    h(
      "button.top-nav__btn.top-nav__menu",
      { onClick: () => go("menu"), "aria-label": "Menu" },
      h("i"), h("i"), h("i")
    )
  );
  bindAttr(el, "data-over-photo", overPhoto);
  bindAttr(el, "data-hidden", (s) => SCREENS_WITHOUT_TOP_NAV.includes(s.screen));
  return el;
}

function tabBar() {
  const tabs = TABS.map((tab) => {
    const button = h(
      "button.tab",
      { onClick: () => go(tab.id), "aria-label": tab.name },
      svg(
        "svg",
        {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "1.7",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        },
        svg("path", { d: tab.d })
      ),
      t("tab__label", tab.name)
    );
    bindAttr(button, "data-selected", (s) => TAB_FOR_SCREEN[s.screen] === tab.id);
    return button;
  });

  const el = h("div.tab-bar", {}, h("div.tab-bar__fade"), h("div.tab-bar__inner", {}, ...tabs));
  bindAttr(el, "data-hidden", (s) => !SCREENS_WITH_TAB_BAR.includes(s.screen));
  return el;
}

function homeIndicator() {
  const el = h("div.home-indicator", {}, h("i"));
  bindAttr(el, "data-over-photo", overPhoto);
  return el;
}
