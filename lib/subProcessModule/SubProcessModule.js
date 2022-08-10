var domQuery = require('min-dom').query;

const breadcrumbContainer = domQuery('#breadcrumb');

function addToBreadcrumb(label, diagramId, callingDiagramId, callingObjectId) {
  var span;

  if (breadcrumbContainer.childNodes.length > 0) {
    // switch last node to link
    breadcrumbContainer.lastChild.classList.add('diagram-link');
    // append delimiter
    span = document.createElement('span');
    span.textContent = ' \\ ';
    breadcrumbContainer.appendChild(span);
  }

  // create + append new node
  span = document.createElement('span');
  span.textContent = label;
  span.dataset.index = breadcrumbContainer.childNodes.length;
  span.dataset.diagramId = diagramId;
  span.dataset.callingDiagramId = callingDiagramId;
  span.dataset.callingObjectId = callingObjectId;

  if (callingObjectId != null) span.title = `called by ${callingObjectId}`;

  breadcrumbContainer.appendChild(span);
}

function trimBreadcrumbTo(index) {
  var flag = false;
  var removeNodes = [];

  for (let i = 0; i < breadcrumbContainer.childNodes.length; i++) {
    if (flag) {
      // add to removable nodes
      removeNodes.push(breadcrumbContainer.childNodes[i]);
    } else if (breadcrumbContainer.childNodes[i].dataset.index === index) {
      // mark as last node
      flag = true;
    }
  }

  // remove subsequent nodes
  removeNodes.forEach(n => breadcrumb.removeChild(n));

  // switch last node to span
  breadcrumbContainer.lastChild.classList.remove('diagram-link');
}

export default function SubProcessModule(eventBus, canvas) {
  this._eventBus = eventBus;
  this._canvas = canvas;

  breadcrumbContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('diagram-link')) {
      // clicked object
      var { index, diagramId, callingDiagramId, callingObjectId } =
        event.target.dataset;

      // retrieve hierarchy
      var { data } = this._widget;

      // get new diagram from hierarchy
      var newDiagram = data.find(
        d =>
          d.diagramId == diagramId &&
          (d.callingDiagramId == callingDiagramId ||
            (callingDiagramId === 'undefined' &&
              typeof d.callingDiagramId === 'undefined')) &&
          (d.callingObjectId == callingObjectId ||
            (callingObjectId === 'undefined' &&
              typeof d.callingObjectId === 'undefined'))
      );

      // trim breadcrumb to clicked entry
      trimBreadcrumbTo(index);

      // set new diagram properties
      this._widget.diagramId = newDiagram.diagramId;
      this._widget.callingDiagramId = newDiagram.callingDiagramId;
      this._widget.callingObjectId = newDiagram.callingObjectId;
      this._widget.diagram = newDiagram.diagram;
      this._widget.current = newDiagram.current;
      this._widget.completed = newDiagram.completed;
      this._widget.error = newDiagram.error;

      // invoke loadDiagram of widget
      this._widget.loadDiagram();
    }
  });

  eventBus.on('element.click', (event) => {
    if (
      event.element.type === 'bpmn:CallActivity' &&
      (event.originalEvent.target.tagName === 'path' ||
        (event.originalEvent.target.tagName === 'rect' &&
          event.originalEvent.target.getAttribute('transform')))
    ) {
      // clicked object
      var objectId = event.element.id;

      // retrieve current index + hierarchy
      var { data, diagramId } = this._widget;

      // get new diagram from hierarchy
      var newDiagram = data.find(
        d =>
          d.callingDiagramId === diagramId && d.callingObjectId === objectId
      );

      // if insight allowed
      if (newDiagram && newDiagram.insight === 1) {
        // update breadcrumb
        addToBreadcrumb(
          newDiagram.breadcrumb,
          newDiagram.diagramId,
          newDiagram.callingDiagramId,
          newDiagram.callingObjectId,
          newDiagram.callingObjectId
        );

        // set new diagram properties
        this._widget.diagramId = newDiagram.diagramId;
        this._widget.callingDiagramId = newDiagram.callingDiagramId;
        this._widget.callingObjectId = newDiagram.callingObjectId;
        this._widget.diagram = newDiagram.diagram;
        this._widget.current = newDiagram.current;
        this._widget.completed = newDiagram.completed;
        this._widget.error = newDiagram.error;

        // invoke loadDiagram of widget
        this._widget.loadDiagram();
      }
    }
  });
}

SubProcessModule.prototype.setWidget = function (widget) {
  this._widget = widget;
};

SubProcessModule.prototype.resetBreadcrumb = function () {
  // retrieve current index + hierarchy
  var { data, diagramId, callingDiagramId, callingObjectId } = this._widget;

  // retrieve data of current diagram
  var { breadcrumb } = data.find(
    d =>
      d.diagramId === diagramId &&
      d.callingDiagramId === callingDiagramId &&
      d.callingObjectId === callingObjectId
  );

  // reset breadcrumb
  breadcrumbContainer.textContent = '';

  // add entry to current diagram breadcrumb
  addToBreadcrumb(breadcrumb, diagramId, callingDiagramId, callingObjectId);
};

SubProcessModule.$inject = ['eventBus', 'canvas'];
