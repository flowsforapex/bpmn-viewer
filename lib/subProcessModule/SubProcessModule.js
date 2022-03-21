
var domQuery = require('min-dom').query;

const breadcrumb = domQuery('#breadcrumb');

function addToBreadcrumb(id, label, callingObjectId) {
  var anchor = document.createElement('a');
  anchor.textContent = label;
  anchor.dataset.index = id;
  anchor.href = 'javascript:void(0);';

  if (breadcrumb.childNodes.length > 0) {
    var span = document.createElement('span');
    span.textContent = ` > ${callingObjectId} > `;
    breadcrumb.appendChild(span);
  }

  breadcrumb.appendChild(anchor);
}

function trimBreadcrumbTo(id) {
  var flag = false;
  var removeNodes = [];
  
  for (let i = 0; i < breadcrumb.childNodes.length; i++) {
    if (flag) {
      removeNodes.push(breadcrumb.childNodes[i]);
    } else if (breadcrumb.childNodes[i].dataset.index === id) {
      flag = true;
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

      // retrieve current index + hierarchy
      var { data, index } = this._widget;

      // retrieve data of current diagram
      var { diagramId } = data[index];

      // get new diagram from hierarchy
      var newDiagram = data.find(d => d.callingDiagramId === diagramId && d.callingObjectId === objectId);

      // set index to reference new diagram in hierarchy
      this._widget.index = data.indexOf(newDiagram);

      // update breadcrumb
      addToBreadcrumb(data.indexOf(newDiagram), newDiagram.breadcrumb, newDiagram.callingObjectId);
      
      // set new diagram properties
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

  // retrieve current index + hierarchy
  var { data, index } = this._widget;

  // retrieve data of current diagram
  var { breadcrumb, callingObjectId } = data[index];

  // add entry to current diagram breadcrumb
  addToBreadcrumb(index, breadcrumb, callingObjectId);
};

SubProcessModule.$inject = ['eventBus', 'canvas'];
