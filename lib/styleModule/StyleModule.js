export default function StyleModule() {}

StyleModule.prototype.addStylesToElements = function (elements, css) {
  for (const e of elements) {
    var rect = document.querySelector(
      `g[data-element-id="${e}"]:not(.djs-connection) .djs-visual > rect`
    );
    var circles = document.querySelectorAll(
      `g[data-element-id="${e}"]:not(.djs-connection) .djs-visual > circle`
    );
    var polygons = document.querySelectorAll(
      `g[data-element-id="${e}"]:not(.djs-connection) .djs-visual > polygon`
    );
    var text = document.querySelector(
      `g[data-element-id="${e}"]:not(.djs-connection) .djs-visual > text`
    );
    var paths = document.querySelectorAll(
      `g[data-element-id="${e}"]:not(.djs-connection) .djs-visual > path`
    );

    if (css.fill !== undefined) {
      if (rect) rect.style.fill = css.fill;
      if (circles.length > 0) circles.forEach(c => (c.style.fill = css.fill));
      if (polygons.length > 0) { polygons.forEach(p => (p.style.fill = css.fill)); }
      if (rect && paths.length > 0) { paths.forEach(p => (p.style.fill = css.fill)); }
    }

    if (css.border !== undefined) {
      if (rect) rect.style.stroke = css.border;
      if (circles.length > 0) { circles.forEach(c => (c.style.stroke = css.border)); }
      if (polygons.length > 0) { polygons.forEach(p => (p.style.stroke = css.border)); }
    }

    if (css.label !== undefined) {
      if (text) text.style.fill = css.label;
      if (paths.length > 0) paths.forEach(p => (p.style.stroke = css.label));
      if (polygons.length > 0 && paths.length > 0) { paths.forEach(p => (p.style.fill = css.label)); }
    }
  }
};

StyleModule.prototype.addToSVGStyle = function (svg, style) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(svg, 'text/xml');

  var defs = xmlDoc.getElementsByTagName('defs')[0];

  var styleNode = document.createElement('style');
  styleNode.setAttribute('type', 'text/css');
  var content = document.createTextNode(style);
  styleNode.appendChild(content);
  defs.appendChild(styleNode);

  var xmlText = new XMLSerializer().serializeToString(xmlDoc);

  return xmlText;
};
