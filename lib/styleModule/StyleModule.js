export default function StyleModule() {}

StyleModule.prototype.addStylesToElements = function (elements, css) {
  for (const e of elements) {
    var rect = document.querySelector(
      `g[data-element-id="${ 
        e 
        }"]:not(.djs-connection) .djs-visual > :nth-child(1)`
    );

    if (rect) {
      for (const c in css) {
        rect.style[c] = css[c];
      }
    }
  }
};
