/* 01–04 · Arrival: splash, language, the preparing hold, and reading comfort. */

import { h, t } from "../dom.js";
import { bindAttr, bindText } from "../reactive.js";
import { pageHead, progressBar, screen } from "../ui.js";
import { APPEARANCES, BSL, FONT_LABELS, IMG, LANGUAGES } from "../data.js";
import {
  go, languageLine, setAppearance, setFontStep, setLanguage, state,
  toggleContrast,
} from "../store.js";

export function splashScreen() {
  return screen(
    "splash",
    { photo: true },
    h("div.hero__img.hero__img--drift", { bg: IMG.hall, style: { opacity: "0.34" } }),
    h("div", {
      style: {
        position: "absolute",
        inset: "0",
        background:
          "radial-gradient(80% 55% at 50% 42%, rgba(212,120,47,.30), rgba(0,0,0,0) 70%), linear-gradient(180deg,rgba(10,9,8,.72),rgba(10,9,8,.96))",
      },
    }),
    h("div.grain.grain--live"),
    h(
      "div.splash__center",
      {},
      h("div.splash__mark", { text: "HM" }),
      h(
        "div.stack",
        { style: { gap: "12px", alignItems: "center" } },
        h("span.display", { html: "History<br>Museum", style: { fontSize: "44px", lineHeight: "1.02" } }),
        h("span", {
          text: "Berlin · Est. 1889",
          style: {
            fontSize: "11px",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "rgba(240,230,211,.5)",
          },
        })
      ),
      h("div", { style: { width: "148px", marginTop: "14px" } }, progressBar())
    ),
    t("splash__foot", "Waking the collection")
  );
}

export function languageScreen() {
  const grid = h(
    "div.lang-grid",
    {},
    ...LANGUAGES.map(({ name, native }) => {
      const button = h(
        "button.selectable.lang",
        { onClick: () => setLanguage(name) },
        t("lang__name", name),
        t("lang__native", native)
      );
      bindAttr(button, "data-selected", (s) => s.language === name);
      return button;
    })
  );

  const bsl = h(
    "button.selectable.lang--bsl",
    { onClick: () => setLanguage(BSL) },
    t("lang__icon", "✋"),
    h(
      "span.stack",
      { style: { gap: "3px" } },
      t("lang__name", BSL),
      t("meta", "Signed video guides at every stop")
    )
  );
  bindAttr(bsl, "data-selected", (s) => s.language === BSL);

  return screen(
    "language",
    {},
    h("div.hero__img", { bg: IMG.hands, style: { opacity: "0.16", backgroundPosition: "center 20%" } }),
    h("div", {
      style: {
        position: "absolute",
        inset: "0",
        background: "linear-gradient(180deg,rgba(18,16,14,.55) 0%,var(--bg) 46%)",
      },
    }),
    h(
      "div.scroll.scroll--inset",
      {},
      pageHead(
        "Choose your language",
        "Everything after this — signage, audio guides, subtitles — arrives in the language you pick.",
        { eyebrow: "Step 1 of 2" }
      ),
      grid,
      bsl,
      h("button.btn.btn--primary", {
        text: "Continue",
        onClick: () => go("langloading"),
        style: { marginTop: "22px" },
      })
    )
  );
}

export function preparingScreen() {
  const line = h("span.display", { style: { fontSize: "36px", lineHeight: "1.08", whiteSpace: "pre-line" } });
  bindText(line, languageLine);

  return screen(
    "langloading",
    { photo: true },
    h("div.hero__img", { bg: IMG.sunburst, style: { opacity: "0.5" } }),
    h("div", {
      style: {
        position: "absolute",
        inset: "0",
        background: "linear-gradient(180deg,rgba(10,9,8,.35),rgba(10,9,8,.92))",
      },
    }),
    h("div.grain.grain--live"),
    h(
      "div.stack",
      {
        style: {
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "0",
          padding: "0 24px 80px",
          gap: "18px",
          color: "var(--on-photo)",
        },
      },
      t("eyebrow eyebrow--photo", "Preparing your visit"),
      line,
      progressBar()
    )
  );
}

export function accessibilityScreen() {
  return screen(
    "access",
    {},
    h(
      "div.scroll.scroll--inset",
      {},
      pageHead("Make it readable", "Set it once here. You can change it any time from the menu.", {
        eyebrow: "Step 2 of 2",
      }),
      textSizeCard(),
      appearanceCard(),
      h("button.btn.btn--primary", {
        text: "Enter the museum",
        onClick: () => go("home"),
        style: { marginTop: "22px" },
      })
    )
  );
}

function textSizeCard() {
  const label = t("eyebrow eyebrow--amber", "");
  bindText(label, (s) => FONT_LABELS[s.fontStep]);

  const fill = h("span.slider__fill");
  bindAttr(fill, "style", (s) => `width:${s.fontStep * 25}%`);

  const stops = [0, 1, 2, 3, 4].map((i) => {
    const stop = h(
      "button.slider__stop",
      { onClick: () => setFontStep(i), style: { left: `${i * 25}%` }, "aria-label": FONT_LABELS[i] },
      h("span.slider__dot")
    );
    bindAttr(stop, "data-selected", (s) => s.fontStep === i);
    return stop;
  });

  return h(
    "div.card.stack",
    { style: { gap: "16px" } },
    h(
      "div",
      { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between" } },
      h("span", { text: "Text size", style: { fontSize: "var(--t-md)", fontWeight: "700" } }),
      label
    ),
    h(
      "div.stepper",
      {},
      h("button.stepper__btn", {
        text: "A",
        onClick: () => setFontStep(state.fontStep - 1),
        style: { fontSize: "15px" },
        "aria-label": "Smaller text",
      }),
      h("div.slider", {}, h("span.slider__track"), fill, ...stops),
      h("button.stepper__btn", {
        text: "A",
        onClick: () => setFontStep(state.fontStep + 1),
        style: { fontSize: "24px" },
        "aria-label": "Larger text",
      })
    ),
    h(
      "div",
      { style: { borderTop: "1px solid var(--line-2)", paddingTop: "14px" } },
      h("span.body", {
        text: "Diplodocus lived roughly 152 million years ago. This paragraph resizes with your choice.",
        style: { display: "block", lineHeight: "1.6" },
      })
    )
  );
}

function appearanceCard() {
  const options = APPEARANCES.map(({ id, name }) => {
    const button = h(
      "button.selectable.appearance",
      { onClick: () => setAppearance(id) },
      h(`span.appearance__swatch.appearance__swatch--${id}`),
      t("appearance__name", name)
    );
    bindAttr(button, "data-selected", (s) => s.appearance === id);
    return button;
  });

  const track = h("span.switch");
  bindAttr(track, "data-selected", (s) => s.contrast);

  return h(
    "div.card.stack",
    { style: { gap: "14px", marginTop: "12px" } },
    h("span", { text: "Appearance", style: { fontSize: "var(--t-md)", fontWeight: "700" } }),
    h("div.appearance-row", {}, ...options),
    h(
      "button.toggle-row",
      { onClick: toggleContrast },
      h(
        "span.stack",
        { style: { gap: "3px" } },
        h("span", { text: "Higher contrast", style: { fontSize: "var(--t-sm)", fontWeight: "600" } }),
        t("meta", "Stronger text and dividers")
      ),
      track
    )
  );
}

export const arrivalScreens = () => [
  splashScreen(),
  languageScreen(),
  preparingScreen(),
  accessibilityScreen(),
];
