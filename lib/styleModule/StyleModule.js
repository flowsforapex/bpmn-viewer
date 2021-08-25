export default function StyleModule() {}

StyleModule.prototype.addStylesToElements = function (elements, css) {
  for (const e of elements) {
    var rect = document.querySelector(
      `g[data-element-id="${e}"]:not(.djs-connection) .djs-visual > :nth-child(1)`
    );

    if (rect) {
      for (const c in css) {
        rect.style[c] = css[c];
      }
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
