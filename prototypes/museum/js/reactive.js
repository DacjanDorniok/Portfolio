/* A very small binding layer.
 *
 * Screens are built once, as real DOM, and then declare bindings: a function
 * that derives a value from state, and a function that applies it. After every
 * state change each binding recomputes, and only the ones whose value actually
 * moved touch the DOM. That keeps scroll position, focus and CSS transitions
 * intact — which a re-render-everything approach would throw away — while
 * costing far less machinery than a virtual DOM. */

const NOTHING = Symbol("nothing");
const bindings = [];

/**
 * @param {(state: object) => unknown} compute derives a value from state
 * @param {(value: unknown) => void} apply writes that value to the DOM
 */
export function bind(compute, apply) {
  bindings.push({ compute, apply, last: NOTHING });
}

/** Binds a single attribute; removing it when the value is null or false. */
export function bindAttr(el, name, compute) {
  bind(compute, (value) => {
    if (value == null || value === false) el.removeAttribute(name);
    else el.setAttribute(name, String(value));
  });
}

/** Binds text content. */
export function bindText(el, compute) {
  bind(compute, (value) => {
    el.textContent = value == null ? "" : String(value);
  });
}

/** Binds one inline style property — for genuinely dynamic geometry only. */
export function bindStyle(el, prop, compute) {
  bind(compute, (value) => {
    el.style[prop] = value == null ? "" : String(value);
  });
}

/**
 * Binds a variable-length list. `compute` returns an array of plain items;
 * `render` turns one item into an element. The list is rebuilt only when the
 * items' signature changes, so a stable list costs one JSON compare per pass.
 */
export function bindList(container, compute, render) {
  bind(
    (state) => JSON.stringify(compute(state)),
    (signature) => {
      container.replaceChildren(...JSON.parse(signature).map(render));
    }
  );
}

export function flush(state) {
  for (const binding of bindings) {
    const value = binding.compute(state);
    if (Object.is(value, binding.last)) continue;
    binding.last = value;
    binding.apply(value);
  }
}
