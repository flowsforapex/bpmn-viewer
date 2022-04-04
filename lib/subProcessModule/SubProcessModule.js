var domQuery = require('min-dom').query;

const breadcrumbContainer = domQuery('#breadcrumb');

function addToBreadcrumb(index, label, callingObjectId) {

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
  span.dataset.index = index;
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
      var { index } = event.target.dataset;

      // retrieve hierarchy
      var { data } = this._widget;

      // get new diagram from hierarchy
      var newDiagram = data[index];

      // trim breadcrumb to clicked entry
      trimBreadcrumbTo(index);

      // set index to reference new diagram in hierarchy
      this._widget.index = index;
      
      // set new diagram properties
      this._widget.diagramId = newDiagram.diagramId;
      this._widget.diagram = newDiagram.diagram;
      this._widget.current = newDiagram.current;
      this._widget.completed = newDiagram.completed;
      this._widget.error = newDiagram.error;

      // invoke loadDiagram of widget
      this._widget.loadDiagram();
    }
  });

  eventBus.on('element.click', (event) => {
    if (event.element.type === 'bpmn:CallActivity' && (
      event.originalEvent.target.tagName === 'path' || (
        event.originalEvent.target.tagName === 'rect' && event.originalEvent.target.getAttribute('transform')
      )
    )) {
      
      // clicked object
      var objectId = event.element.id;

      // retrieve current index + hierarchy
      var { data, index } = this._widget;

      // retrieve data of current diagram
      var { diagramId } = data[index];

      // get new diagram from hierarchy
      var newDiagram = data.find(d => d.callingDiagramId === diagramId && d.callingObjectId === objectId);

      // if insight allowed
      if (newDiagram.insight === 1) {

        // set index to reference new diagram in hierarchy
        this._widget.index = data.indexOf(newDiagram);

        // update breadcrumb
        addToBreadcrumb(data.indexOf(newDiagram), newDiagram.breadcrumb, newDiagram.callingObjectId);
        
        // set new diagram properties
        this._widget.diagramId = newDiagram.diagramId;
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

  // retrieve current index + hierarchy
  var { data, index } = this._widget;

  // retrieve data of current diagram
  var { breadcrumb, callingObjectId } = data[index];

  // reset breadcrumb
  breadcrumbContainer.textContent = '';

  // add entry to current diagram breadcrumb
  addToBreadcrumb(index, breadcrumb, callingObjectId);
};

SubProcessModule.$inject = ['eventBus', 'canvas'];
