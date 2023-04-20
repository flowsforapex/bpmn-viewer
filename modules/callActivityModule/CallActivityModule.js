
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { domify } from 'min-dom';

var ARROW_DOWN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.81801948,3.50735931 L10.4996894,9.1896894 L10.5,4 L12,4 L12,12 L4,12 L4,10.5 L9.6896894,10.4996894 L3.75735931,4.56801948 C3.46446609,4.27512627 3.46446609,3.80025253 3.75735931,3.50735931 C4.05025253,3.21446609 4.52512627,3.21446609 4.81801948,3.50735931 Z"/></svg>';
export default function CustomDrilldown(
    canvas, eventBus, elementRegistry, overlays, moddle
) {
  this._canvas = canvas;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._overlays = overlays;
  this._moddle = moddle;

  var _self = this;

  // create and append breadcrumb
  this._breadcrumb = domify('<ul class="bjs-breadcrumbs" id="callActivityBreadcrumb"></ul>');
  var container = canvas.getContainer();
  container.appendChild(this._breadcrumb);

  // add overlay for drilldown-able elements
  eventBus.on('import.render.complete', function () {
    elementRegistry.filter(function (e) {
      return _self.canDrillDown(e);
    }).forEach(function (el) {
      _self.addOverlay(el);
    });
  });
}

CustomDrilldown.prototype.canDrillDown = function (element) {
  return (is(element, 'bpmn:CallActivity'));
};

CustomDrilldown.prototype.addOverlay = function (element) {
  var overlays = this._overlays;

  var _self = this;

  var button = domify(`<button class="bjs-drilldown">${ARROW_DOWN_SVG}</button>`);

  // remove (possible) existing overlay
  if (overlays.get({ element: element, type: 'drilldown' }).length) {
    this.removeOverlay(element);
  }

  // add event listener
  button.addEventListener('click', function (event) {

    // clicked object
    var objectId = element.id;

    // retrieve hieracry + current diagram
    var { data, diagramIdentifier } = _self._widget;

    // get new diagram from hierarchy
    var newDiagram = data.find(
      d =>
        d.callingDiagramIdentifier === diagramIdentifier &&
        d.callingObjectId === objectId
    );

    // if insight allowed
    if (newDiagram && newDiagram.insight === 1) {
      
      // set new diagram properties
      _self._widget.diagramIdentifier = newDiagram.diagramIdentifier;
      _self._widget.callingDiagramIdentifier = newDiagram.callingDiagramIdentifier;
      _self._widget.callingObjectId = newDiagram.callingObjectId;
      _self._widget.diagram = newDiagram.diagram;
      _self._widget.current = newDiagram.current;
      _self._widget.completed = newDiagram.completed;
      _self._widget.error = newDiagram.error;

      // update breadcrumb
      _self.updateBreadcrumb();

      // move down sub process breadcrumb
      const subProcessBreadcrumb = document.querySelector('.bjs-breadcrumbs:not(#callActivityBreadcrumb)');
      subProcessBreadcrumb.style.top = '60px';

      // invoke loadDiagram of widget
      _self._widget.loadDiagram();
    }
  });

  // add overlay
  overlays.add(element, 'drilldown', {
    position: {
      bottom: -7,
      right: -8
    },
    html: button
  });
};

CustomDrilldown.prototype.removeOverlay = function (element) {
  var overlays = this._overlays;

  // remove overlay
  overlays.remove({
    element: element,
    type: 'drilldown'
  });
};

CustomDrilldown.prototype.setWidget = function (widget) {
  this._widget = widget;
};

CustomDrilldown.prototype.updateBreadcrumb = function () {

  var _self = this;

  // retrieve hierarchy
  var { data, diagramIdentifier, callingDiagramIdentifier, callingObjectId } = this._widget;

  // retrieve properties of current diagram
  var { breadcrumb } = data.find(
    d =>
      d.diagramIdentifier === diagramIdentifier &&
      d.callingDiagramIdentifier === callingDiagramIdentifier &&
      d.callingObjectId === callingObjectId
  );

  // breadcrumb list entry
  var link = domify(
    `<li data-index="${this._breadcrumb.childNodes.length}"
    ${diagramIdentifier ? ` data-diagramIdentifier="${diagramIdentifier}"` : ''}
    ${callingDiagramIdentifier ? ` data-callingDiagramIdentifier="${callingDiagramIdentifier}"` : ''}
    ${callingObjectId ? ` data-callingObjectId="$${callingObjectId}"` : ''}>` +
    `<span class="bjs-crumb"><a
    ${callingObjectId ? ` title="called by ${callingObjectId}"` : ''}>` +
    `${breadcrumb}</a></span></li>`);

  // add event listener
  link.addEventListener('click', function () {

    // clicked object
    var { index, diagramidentifier } = link.dataset;

    // get new diagram from hierarchy
    var newDiagram = data.find(
      d => d.diagramIdentifier == diagramidentifier
    );

    // all but last entry are clickable
    if (index < _self._breadcrumb.childNodes.length - 1) {

      // trim breadcrumb to clicked entry
      _self.trimBreadcrumbTo(index);

      // set new diagram properties
      _self._widget.diagramIdentifier = newDiagram.diagramIdentifier;
      _self._widget.callingDiagramIdentifier = newDiagram.callingDiagramIdentifier;
      _self._widget.callingObjectId = newDiagram.callingObjectId;
      _self._widget.diagram = newDiagram.diagram;
      _self._widget.current = newDiagram.current;
      _self._widget.completed = newDiagram.completed;
      _self._widget.error = newDiagram.error;

      // invoke loadDiagram of widget
      _self._widget.loadDiagram();
    }
  });

  // append entry
  this._breadcrumb.appendChild(link);

  // toggle visibility
  this.toggleBreadcrumbVisibility();
};

CustomDrilldown.prototype.resetBreadcrumb = function() {
  // remove all entries
  while(this._breadcrumb.firstChild) {
    this._breadcrumb.removeChild(this._breadcrumb.firstChild);
  }

  // toggle visibility
  this.toggleBreadcrumbVisibility();
}

CustomDrilldown.prototype.trimBreadcrumbTo = function (index) {
  var flag = false;
  var removeNodes = [];

  for (let i = 0; i < this._breadcrumb.childNodes.length; i++) {
    if (flag) {
      // add entry to removable nodes
      removeNodes.push(this._breadcrumb.childNodes[i]);
    } else if (this._breadcrumb.childNodes[i].dataset.index === index) {
      // mark as last node
      flag = true;
    }
  }

  // remove subsequent nodes
  removeNodes.forEach(n => this._breadcrumb.removeChild(n));

  // toggle visibility
  this.toggleBreadcrumbVisibility();
};

CustomDrilldown.prototype.toggleBreadcrumbVisibility = function () {
  // show/hide breadcrumb (depending on number of entries)
  if (this._breadcrumb.childNodes.length > 1) {
    
    const breadcrumbHeight = this._breadcrumb.offsetHeight;
    
    // show element
    this._breadcrumb.style.display = 'flex';
    
    // scroll canvas down
    this._canvas.scroll({ dx: 0, dy: 30 + breadcrumbHeight + 30 });

  } else {

    const subProcessBreadcrumb = document.querySelector('.bjs-breadcrumbs:not(#callActivityBreadcrumb)');

    // hide element
    this._breadcrumb.style.display = 'none';
    
    // move up sub process breadcrumb
    subProcessBreadcrumb.style.top = '30px';
  }
};

CustomDrilldown.prototype.setPositioning = function () {
  
};

CustomDrilldown.$inject = [
  'canvas',
  'eventBus',
  'elementRegistry',
  'overlays',
  'moddle'
];