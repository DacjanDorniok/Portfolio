/* 07–15 · Ticket: visitors, slot, gate, details, checkout, and the ticket itself. */

import { h, t } from "../dom.js";
import { bind, bindAttr, bindList, bindText } from "../reactive.js";
import { chevronAmber, pageHead, screen, sheet } from "../ui.js";
import {
  ACCOMMODATIONS, DATES, GATES, IMG, PAST_TICKETS, PAYMENT_METHODS, QR_CELLS,
  SAVE_ACTIONS, SLOTS, TICKET_REF, VISITOR_TYPES,
} from "../data.js";
import {
  back, changeVisitors, checkoutSummary, dateLabel, go, setDate, setGate,
  setLocker, setNeedsAccess, setPayment, setSlot, slotLabel, ticketRows,
  toggleAccommodation, totalLabel, totalVisitors, visitorCountLabel,
} from "../store.js";

/* --- 07 Visitors ---------------------------------------------------------- */

export function visitorsScreen() {
  const rows = VISITOR_TYPES.map((type) => {
    const count = h("span.counter__n");
    bindText(count, (s) => s.visitors[type.key]);

    const row = h(
      "div.selectable.selectable--raise.visitor-row",
      {},
      h(
        "span.stack",
        { style: { flex: "1", gap: "3px" } },
        h("span", { text: type.name, style: { fontSize: "var(--t-md)", fontWeight: "700" } }),
        t("meta", type.sub)
      ),
      t("visitor-row__price", type.price === 0 ? "Free" : `€${type.price}`),
      h(
        "span.counter",
        {},
        h("button.counter__btn", {
          text: "−",
          onClick: () => changeVisitors(type.key, -1),
          "aria-label": `One fewer ${type.name.toLowerCase()} ticket`,
        }),
        count,
        h("button.counter__btn", {
          text: "+",
          onClick: () => changeVisitors(type.key, 1),
          "aria-label": `One more ${type.name.toLowerCase()} ticket`,
        })
      )
    );
    bindAttr(row, "data-selected", (s) => s.visitors[type.key] > 0);
    return row;
  });

  const countLabel = t("eyebrow", "");
  bindText(countLabel, visitorCountLabel);

  const total = h("span.total-row__amount");
  bindText(total, totalLabel);

  const cta = h("button.btn.btn--primary", { text: "Choose date & time", onClick: () => go("tickettime") });
  bind(
    (s) => totalVisitors(s) === 0,
    (empty) => {
      cta.disabled = empty;
    }
  );

  return screen(
    "ticket1",
    {},
    h(
      "div.scroll",
      { style: { padding: "118px 16px 168px" } },
      pageHead(
        "Who's coming?",
        "Choose a ticket for each visitor. Every guided tour is free once you're inside — this is only for entrance."
      ),
      h("div.stack", { style: { gap: "10px" } }, ...rows)
    ),
    h(
      "div.action-bar",
      {},
      h(
        "div.total-row",
        {},
        h(
          "span.stack",
          { style: { gap: "2px" } },
          countLabel,
          t("meta", "Entrance only · tours are free")
        ),
        total
      ),
      cta
    )
  );
}

/* --- 08 Date and slot ----------------------------------------------------- */

export function dateSlotScreen() {
  const dates = DATES.map((date, i) => {
    const button = h(
      "button.selectable.selectable--fill.date",
      { onClick: () => setDate(i) },
      t("date__dow", date.dow),
      t("date__d", date.d)
    );
    bindAttr(button, "data-selected", (s) => s.date === i);
    return button;
  });

  const slots = SLOTS.map((slot, i) => {
    const button = h(
      "button.selectable.selectable--fill.slot",
      { onClick: () => !slot.full && setSlot(i), "data-unavailable": slot.full || null },
      t("slot__t", slot.t),
      t("slot__sub", slot.sub)
    );
    if (!slot.full) bindAttr(button, "data-selected", (s) => s.slot === i);
    return button;
  });

  const summary = h("span.note__text");
  bindText(summary, (s) => `${visitorCountLabel(s)} · ${totalLabel(s)} total`);

  return screen(
    "tickettime",
    {},
    h(
      "div.scroll",
      { style: { padding: "118px 16px 132px" } },
      pageHead(
        "When are you coming?",
        "Timed entry keeps the halls breathable. Sold-out slots are marked."
      ),
      t("eyebrow", "Date · June 2026"),
      h("div.date-rail", { style: { marginTop: "10px" } }, ...dates),
      t("eyebrow", "Entry slot"),
      h("div.slot-grid", { style: { marginTop: "10px" } }, ...slots),
      h("div.note", {}, t("note__mark", "◈"), summary)
    ),
    h(
      "div.action-bar",
      {},
      h("button.btn.btn--primary", { text: "Choose your gate", onClick: () => go("ticket2") })
    )
  );
}

/* --- 09 Starting gate ----------------------------------------------------- */

export function gateScreen() {
  const slotNote = h("span.note__text");
  bindText(slotNote, (s) => `Your slot: ${slotLabel(s)} · ${dateLabel(s)}`);

  const gates = GATES.map((gate, i) => {
    const button = h(
      "button.selectable.selectable--raise.gate",
      { onClick: () => !gate.full && setGate(i), "data-unavailable": gate.full || null },
      h("span.radio"),
      h(
        "span.stack",
        { style: { flex: "1", gap: "4px" } },
        t("gate__name", gate.name),
        t("gate__sub", gate.full ? "This gate is full for your slot" : gate.sub)
      ),
      h(`span.tag${gate.full ? ".tag--full" : ""}`, { text: gate.full ? "Full" : "Free" })
    );
    if (!gate.full) bindAttr(button, "data-selected", (s) => s.gate === i);
    return button;
  });

  return screen(
    "ticket2",
    {},
    h(
      "div.scroll",
      { style: { padding: "118px 16px 120px" } },
      pageHead(
        "Where do you start?",
        "Every tour is free with your ticket. Picking a gate now spreads the crowd out before anyone arrives."
      ),
      h(
        "div.note",
        { style: { background: "var(--raise)", marginBottom: "22px", alignItems: "center" } },
        t("note__mark", "◈"),
        slotNote
      ),
      h("div.stack", { style: { gap: "10px" } }, ...gates)
    ),
    h("div.action-bar", {}, h("button.btn.btn--primary", { text: "Continue", onClick: () => go("ticket3") }))
  );
}

/* --- 10 Visitor details --------------------------------------------------- */

export function detailsScreen() {
  const name = h("span");
  bindText(name, (s) => s.visitorName);

  const accommodations = h(
    "div.collapse",
    {},
    h(
      "div.stack",
      { style: { gap: "2px", borderTop: "1px solid var(--line-2)", paddingTop: "10px" } },
      ...ACCOMMODATIONS.map((label, i) => {
        const box = h("span.checkbox");
        bindAttr(box, "data-selected", (s) => s.accommodations.includes(i));
        bindText(box, (s) => (s.accommodations.includes(i) ? "✓" : ""));
        return h("button.check-item", { onClick: () => toggleAccommodation(i) }, box, h("span", { text: label }));
      })
    )
  );
  bindAttr(accommodations, "data-open", (s) => s.needsAccess === "yes");

  return screen(
    "ticket3",
    {},
    h(
      "div.scroll",
      { style: { padding: "118px 16px 120px" } },
      pageHead("Two quick questions", "Both are free. Both are easier to arrange now than at the door."),
      h(
        "div.card",
        { style: { marginBottom: "12px" } },
        h("span.eyebrow", { text: "Visitor name", style: { marginBottom: "10px" } }),
        h("div.field", {}, name, h("span.caret"))
      ),
      choiceCard(
        "Do you need a locker?",
        "Free of charge, by the cloakroom at Gate 01.",
        [
          { value: "yes", label: "Yes, please" },
          { value: "no", label: "No thanks" },
        ],
        (s) => s.locker,
        setLocker
      ),
      h(
        "div.card",
        {},
        h("span", {
          text: "Any accessibility accommodations?",
          style: { display: "block", fontSize: "var(--t-md)", fontWeight: "700", marginBottom: "4px" },
        }),
        h("span.meta", {
          text: "We arrange these before you arrive, at no cost.",
          style: { display: "block", marginBottom: "14px" },
        }),
        h(
          "div.choice-row",
          { style: { marginBottom: "14px" } },
          ...choiceButtons(
            [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            (s) => s.needsAccess,
            setNeedsAccess
          )
        ),
        accommodations
      )
    ),
    h("div.action-bar", {}, h("button.btn.btn--primary", { text: "Review and pay", onClick: () => go("checkout") }))
  );
}

function choiceCard(title, note, options, read, write) {
  return h(
    "div.card",
    { style: { marginBottom: "12px" } },
    h("span", {
      text: title,
      style: { display: "block", fontSize: "var(--t-md)", fontWeight: "700", marginBottom: "4px" },
    }),
    h("span.meta", { text: note, style: { display: "block", marginBottom: "14px" } }),
    h("div.choice-row", {}, ...choiceButtons(options, read, write))
  );
}

function choiceButtons(options, read, write) {
  return options.map(({ value, label }) => {
    const button = h(
      "button.selectable.selectable--raise.choice",
      { onClick: () => write(value) },
      h("span.radio.radio--sm"),
      h("span", { text: label })
    );
    bindAttr(button, "data-selected", (s) => read(s) === value);
    return button;
  });
}

/* --- 11 Checkout ---------------------------------------------------------- */

export function checkoutScreen() {
  const summary = h("div");
  bindList(summary, checkoutSummary, (row) =>
    h("div.summary-row", {}, t("kv__k", row.k), t("kv__v", row.v))
  );

  const total = h("span", {
    style: { fontFamily: "var(--font-display)", fontSize: "28px", lineHeight: "1" },
  });
  bindText(total, totalLabel);

  const methods = PAYMENT_METHODS.map((method, i) => {
    const button = h(
      "button.selectable.selectable--raise.pay",
      { onClick: () => setPayment(i) },
      h("span.pay__chip", { text: method.icon, style: { background: method.bg, color: method.fg } }),
      t("pay__name", method.name),
      h("span.radio.radio--sm")
    );
    bindAttr(button, "data-selected", (s) => s.payment === i);
    return button;
  });

  const payButton = h("button.btn.btn--primary", { onClick: () => go("paying") });
  bindText(payButton, (s) => `Pay ${totalLabel(s)}`);

  return screen(
    "checkout",
    {},
    h(
      "div.scroll",
      { style: { padding: "118px 16px 120px" } },
      h("span.h1", { text: "One ticket, one tap", style: { display: "block", marginBottom: "22px" } }),
      h(
        "div.card.card--flush",
        { style: { marginBottom: "22px" } },
        summary,
        h(
          "div",
          { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "16px" } },
          t("eyebrow", "Total"),
          total
        )
      ),
      h("span.eyebrow", { text: "Pay with", style: { marginBottom: "10px" } }),
      h("div.stack", { style: { gap: "8px" } }, ...methods),
      h("span.meta", {
        html: 'By paying you accept the museum\'s <a href="#terms">terms and conditions</a> and house rules.',
        style: { display: "block", marginTop: "16px", lineHeight: "1.6" },
      })
    ),
    h("div.action-bar", {}, payButton)
  );
}

/* --- 12 Processing -------------------------------------------------------- */

export function payingScreen() {
  const amount = h("span", { style: { fontFamily: "var(--font-display)", fontSize: "32px" } });
  bindText(amount, totalLabel);

  return screen(
    "paying",
    { photo: true },
    h("div.hero__img", { bg: IMG.goldHand, style: { opacity: "0.42" } }),
    h("div", {
      style: {
        position: "absolute",
        inset: "0",
        background: "linear-gradient(180deg,rgba(10,9,8,.5),rgba(10,9,8,.94))",
      },
    }),
    h(
      "div.center-stack",
      {},
      h("span.spinner"),
      h("span", {
        text: "Taking payment",
        style: {
          fontSize: "11px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(240,230,211,.5)",
        },
      }),
      amount
    )
  );
}

/* --- 13 Ticket ready ------------------------------------------------------ */

export function confirmScreen() {
  const rows = h("div.stub__rows");
  bindList(rows, ticketRows, (row) =>
    h("div.stub__row", {}, t("stub__k", row.k), t("stub__v", row.v))
  );

  return screen(
    "confirm",
    {},
    h(
      "div.scroll",
      { style: { padding: "112px 16px 104px" } },
      h(
        "div.stack",
        { style: { gap: "6px", marginBottom: "20px" } },
        t("eyebrow eyebrow--amber", "Paid · confirmed"),
        h("span.h1", { text: "Your ticket is ready" })
      ),
      h(
        "div.save-grid",
        { style: { marginBottom: "22px" } },
        ...SAVE_ACTIONS.map((action) =>
          h(
            "button.selectable.save-action",
            { onClick: () => action.to && go(action.to), "data-selected": action.primary || null },
            t("save-action__icon", action.icon),
            t("save-action__name", action.name)
          )
        )
      ),
      h(
        "div.stub",
        {},
        h(
          "div.stub__top",
          {},
          h("div.qr", {}, ...QR_CELLS.map((on) => h("span", { "data-on": on }))),
          t("eyebrow", TICKET_REF)
        ),
        h("div.stub__perf"),
        rows
      ),
      h(
        "button.link-row",
        { onClick: () => go("map"), style: { marginTop: "14px" } },
        h(
          "span.stack",
          { style: { gap: "2px" } },
          h("span", { text: "Plan your route", style: { fontSize: "var(--t-sm)", fontWeight: "700" } }),
          t("meta", "Gate 01 to the Hall of Giants")
        ),
        chevronAmber()
      )
    )
  );
}

/* --- 14 Wallet confirmation ----------------------------------------------- */

export function walletScreen() {
  return screen(
    "wallet",
    {},
    ...sheet(
      h(
        "div.stack",
        { style: { alignItems: "center", gap: "16px", textAlign: "center", padding: "16px 4px 0" } },
        h("span", {
          text: "✓",
          style: {
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "1px solid var(--amber)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            color: "var(--amber)",
          },
        }),
        h("span.h2", { text: "Your ticket has been added to Apple Wallet" }),
        h("span.body-sm", {
          text: "It will surface on your lock screen at 10:45, fifteen minutes before your slot.",
          style: { maxWidth: "280px" },
        }),
        h("button.btn.btn--primary.btn--sm", { text: "Back to my ticket", onClick: back, style: { marginTop: "6px" } })
      )
    )
  );
}

/* --- 15 My tickets -------------------------------------------------------- */

export function ticketsScreen() {
  const day = h("span.date-chip__day");
  bindText(day, (s) => DATES[s.date].d);

  const title = h("span", { style: { fontSize: "var(--t-md)", fontWeight: "700" } });
  bindText(title, (s) => `Entrance · ${visitorCountLabel(s)}`);

  const sub = h("span.meta");
  bindText(sub, (s) => `${slotLabel(s)} · Gate 01 · ${totalLabel(s)}`);

  return screen(
    "tickets",
    {},
    h(
      "div.scroll",
      { style: { padding: "118px 16px 104px" } },
      h("span.h1", { text: "My tickets", style: { display: "block", marginBottom: "20px" } }),
      h("span.eyebrow.eyebrow--amber", { text: "Today", style: { marginBottom: "10px" } }),
      h(
        "button.ticket-card",
        { onClick: () => go("confirm") },
        h(
          "span.ticket-card__main",
          {},
          h("span.date-chip", {}, t("date-chip__mon", "Jun"), day),
          h("span.stack", { style: { flex: "1", gap: "4px" } }, title, sub),
          chevronAmber()
        ),
        h(
          "span.ticket-card__status",
          {},
          h("span.pip"),
          t("note__text", "Valid · locker 14 reserved · wheelchair access arranged")
        )
      ),
      h(
        "div.note",
        { style: { marginTop: "14px" } },
        t("note__mark", "◈"),
        t(
          "note__text",
          "One ticket covers the whole museum. Every exhibition and every guided tour is included — there is nothing else to buy."
        )
      ),
      h("span.eyebrow", { text: "Earlier entrance tickets", style: { margin: "26px 0 10px" } }),
      h(
        "div.stack",
        { style: { gap: "8px" } },
        ...PAST_TICKETS.map((ticket) =>
          h(
            "div.past-ticket",
            {},
            h(
              "span.date-chip",
              { style: { width: "44px", height: "44px", background: "transparent" } },
              t("date-chip__mon", ticket.mon),
              h("span.date-chip__day", { text: ticket.day, style: { fontSize: "17px" } })
            ),
            h(
              "span.stack",
              { style: { flex: "1", gap: "3px" } },
              h("span", { text: ticket.name, style: { fontSize: "var(--t-sm)", fontWeight: "600" } }),
              t("meta", ticket.sub)
            ),
            t("meta", ticket.price)
          )
        )
      )
    )
  );
}

export const ticketScreens = () => [
  visitorsScreen(),
  dateSlotScreen(),
  gateScreen(),
  detailsScreen(),
  checkoutScreen(),
  payingScreen(),
  confirmScreen(),
  walletScreen(),
  ticketsScreen(),
];
