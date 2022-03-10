import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

var domQuery = require('min-dom').query;

const breadcrumb = domQuery('#breadcrumb');

function addToBreadcrumb(label, id) {
  const span = document.createElement('span');

  if (breadcrumb.childNodes.length === 0) {
    span.textContent = label;
  } else {
    span.textContent = ` > ${label}`;
  }

  span.dataset.diagramId = id;

  breadcrumb.appendChild(span);
}

function trimBreadcrumbTo(id) {
  var flag = false;
  var removeNodes = [];
  
  for (let i = 0; i < breadcrumb.childNodes.length; i++) {
    if (breadcrumb.childNodes[i].dataset.diagramId === id) {
      flag = true;
    }
    if (flag) {
      removeNodes.push(breadcrumb.childNodes[i]);
    }
  }
  
  removeNodes.forEach(n => breadcrumb.removeChild(n));
}

export default function SubProcessModule(eventBus, canvas) {
  var bo;
  
  this._eventBus = eventBus;
  this._canvas = canvas;

  breadcrumb.addEventListener('click', (event) => {
    this.getDiagramContentById(event.target.dataset.diagramId).then(async (values) => {
        var { diagram, diagramId } = values;

        trimBreadcrumbTo(diagramId);

        this._widget.diagram = diagram;
        this._widget.diagramId = diagramId;
        this._widget.loadDiagram();

        // console.log(this._widget);
    });
  });

  eventBus.on('element.click', (event) => {
    if (event.element.type === 'bpmn:CallActivity') {
      bo = getBusinessObject(event.element);

      this.getDiagramContent(
        bo.get('apex:calledDiagram'),
        bo.get('apex:calledDiagramVersionSelection'),
        bo.get('apex:calledDiagramVersion')
      ).then(async (values) => {
          var { diagram, diagramId } = values;

          addToBreadcrumb(this._widget.diagramId, this._widget.diagramId);

          this._widget.diagram = diagram;
          this._widget.diagramId = diagramId;
          this._widget.loadDiagram();

          // console.log(this._widget);
      });
    }
  });
}

SubProcessModule.prototype.setWidget = function (widget) {
  this._widget = widget;
};

SubProcessModule.prototype.getDiagramContent = function (calledDiagram, versionSelection, version) {
  // ajaxIdentifier
  var { ajaxIdentifier } = this._widget.options;
  // ajax process
  return apex.server
    .plugin(
      ajaxIdentifier,
      {
        x01: 'GET_DIAGRAM_CONTENT',
        x02: calledDiagram,
        x03: versionSelection,
        x04: version
      },
      {}
    )
    .then(pData => pData);
};

SubProcessModule.prototype.getDiagramContentById = function (diagramId) {
  // ajaxIdentifier
  var { ajaxIdentifier } = this._widget.options;
  // ajax process
  return apex.server
    .plugin(
      ajaxIdentifier,
      {
        x01: 'GET_DIAGRAM_CONTENT_BY_ID',
        x02: diagramId
      },
      {}
    )
    .then(pData => pData);
};

SubProcessModule.$inject = ['eventBus', 'canvas'];
