/** Minimal element builder. `h('div.card', { onClick }, child, child)`. */
export function h(spec, props, ...children) {
  const [tag, ...classes] = spec.split(".");
  const el = document.createElement(tag || "div");
  if (classes.length) el.className = classes.join(" ");

  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === "onClick") el.addEventListener("click", value);
    else if (key === "style") Object.assign(el.style, value);
    else if (key === "text") el.textContent = value;
    else if (key === "html") el.innerHTML = value;
    else if (key === "bg") el.style.backgroundImage = `url(${value})`;
    else el.setAttribute(key, String(value));
  }

  append(el, children);
  return el;
}

/** Same as `h`, but for SVG elements, which need the namespaced constructor. */
export function svg(tag, props, ...children) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    el.setAttribute(key, String(value));
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

/** A `<span>` carrying text — the most common leaf in these screens. */
export function t(className, text) {
  return h("span." + className, { text });
}
