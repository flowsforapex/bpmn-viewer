export default function StyleModule(config, bpmnRenderer, elementRegistry) {

  this.addStyleToElements = function (elements, css) {

    let element;

    for (const e of elements) {

      element = document.querySelector(`g[data-element-id="${e}"]:not(.djs-connection) .djs-visual`);

      if (element) {
        element.style.setProperty('--highlight-fill', css.fill);
        element.style.setProperty('--highlight-border', css.border);
        element.style.setProperty('--highlight-label', css.label);

        element.classList.add('add-highlighting');
      }
    }
  };
  
  this.highlightElements = function (current, completed, error) {
    if (current && current.length > 0) this.addStyleToElements(current, config.currentStyle);
    if (completed && completed.length > 0) this.addStyleToElements(completed, config.completedStyle);
    if (error && error.length > 0) this.addStyleToElements(error, config.errorStyle);
  };

  this.resetHighlighting = function () {

    const elements = Object.keys(elementRegistry._elements);
    let element;

    for (const e of elements) {

      element = document.querySelector(`g[data-element-id="${e}"]:not(.djs-connection) .djs-visual`);

      if (element) {
        element.style.removeProperty('--highlight-fill');
        element.style.removeProperty('--highlight-border');
        element.style.removeProperty('--highlight-label');

        element.classList.remove('add-highlighting');
      }
    }
  };

  this.resetBPMNcolors = function () {

    const elements = Object.keys(elementRegistry._elements);
    let element;

    for (const e of elements) {

      element = document.querySelector(`g[data-element-id="${e}"]:not(.djs-connection) .djs-visual`);

      if (element) {

        element.classList.add('reset-bpmn-colors');
      }
    }
  };

  this.addStyleToSVG = function (svg) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(svg, 'text/xml');
  
    const [defs] = xmlDoc.getElementsByTagName('defs');
  
    const styleNode = document.createElement('style');
    styleNode.setAttribute('type', 'text/css');

    const content = document.createTextNode('.djs-group { --default-fill-color: white; --default-stroke-color: black; }');
    styleNode.appendChild(content);
    
    defs.appendChild(styleNode);
  
    const xmlText = new XMLSerializer().serializeToString(xmlDoc);
  
    return xmlText;
  };
}

StyleModule.$inject = [
  // custom viewer properties nested inside parent config object
  'config.config',
  'config.bpmnRenderer',
  'elementRegistry'
];
