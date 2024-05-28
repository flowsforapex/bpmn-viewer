export default function StyleModule(config, bpmnRenderer, elementRegistry) {

  this.addStyleToElements = function(elements, css) {
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
  }
  
  this.highlightElements = function (current, completed, error) {
    if (current && current.length > 0) this.addStyleToElements(current, config.currentStyle);
    if (completed && completed.length > 0) this.addStyleToElements(completed, config.completedStyle);
    if (error && error.length > 0) this.addStyleToElements(error, config.errorStyle);
  };

  this.resetHighlighting = function() {
    console.log(elementRegistry);
    this.addStyleToElements(
      Object.keys(elementRegistry._elements),
      {fill: bpmnRenderer.defaultFillColor, border: bpmnRenderer.defaultStrokeColor, label: bpmnRenderer.defaultLabelColor});
  }

  this.addStyleToSVG = function (svg) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(svg, 'text/xml');
  
    var defs = xmlDoc.getElementsByTagName('defs')[0];
  
    var styleNode = document.createElement('style');
    styleNode.setAttribute('type', 'text/css');
    var content = document.createTextNode('.djs-group { --default-fill-color: white; --default-stroke-color: black; }');
    styleNode.appendChild(content);
    defs.appendChild(styleNode);
  
    var xmlText = new XMLSerializer().serializeToString(xmlDoc);
  
    return xmlText;
  };
}

StyleModule.$inject = [
  // custom viewer properties nested inside parent config object
  'config.config',
  'config.bpmnRenderer',
  'elementRegistry'
];
