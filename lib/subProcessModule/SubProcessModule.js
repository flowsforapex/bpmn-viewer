
var domQuery = require('min-dom').query;

const breadcrumb = domQuery('#breadcrumb');

function addToBreadcrumb(label, id) {
  const span = document.createElement('span');

  if (breadcrumb.childNodes.length === 0) {
    span.textContent = label;
  } else {
    span.textContent = ` > ${label}`;
  }

  span.dataset.index = id;

  breadcrumb.appendChild(span);
}

function trimBreadcrumbTo(id) {
  var flag = false;
  var removeNodes = [];
  
  for (let i = 0; i < breadcrumb.childNodes.length; i++) {
    if (breadcrumb.childNodes[i].dataset.index === id) {
      flag = true;
    }
    if (flag) {
      removeNodes.push(breadcrumb.childNodes[i]);
    }
  }
  
  removeNodes.forEach(n => breadcrumb.removeChild(n));
}

export default function SubProcessModule(eventBus, canvas) {
  
  this._eventBus = eventBus;
  this._canvas = canvas;

  breadcrumb.addEventListener('click', (event) => {

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
  });

  eventBus.on('element.click', (event) => {
    if (event.element.type === 'bpmn:CallActivity') {
      
      // clicked object
      var objectId = event.element.id;

      // retrieve data of current diagram + hierarchy
      var { diagramId, data, index } = this._widget;

      // add entry to current diagram breadcrump
      addToBreadcrumb(diagramId, index);

      // get new diagram from hierarchy
      var newDiagram = data.find(d => d.callingDiagramId === diagramId && d.callingObjectId === objectId);

      // set index to reference new diagram in hierarchy
      this._widget.index = data.indexOf(newDiagram);
      
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
}

SubProcessModule.prototype.setWidget = function (widget) {
  this._widget = widget;
};

SubProcessModule.$inject = ['eventBus', 'canvas'];
