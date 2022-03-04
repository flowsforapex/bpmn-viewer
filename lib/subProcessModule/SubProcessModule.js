import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

var domQuery = require('min-dom').query;

const breadcrumb = domQuery('#breadcrumb');

export default function SubProcessModule(eventBus, canvas) {
  var bo;
  var diagram;
  
  this._eventBus = eventBus;
  this._canvas = canvas;

  eventBus.on('element.click', (event) => {
    if (event.element.type === 'bpmn:CallActivity') {
      bo = getBusinessObject(event.element);

      this.getDiagramContent(
        bo.get('apex:calledDiagram'),
        bo.get('apex:calledDiagramVersionSelection'),
        bo.get('apex:calledDiagramVersion')
      ).then(async (values) => {
          diagram = values.diagram;
          
          // breadcrumb.textContent = diagram;
          
          // console.log(this._viewer);
          
          try {
            await this._viewer.importXML(diagram);
            // zoom to fit full viewport
            this._canvas.zoom('fit-viewport');
          } catch (err) {
            console.error('could not import BPMN 2.0 diagram', err);
          }
      });
    }
  });
}

SubProcessModule.prototype.setViewerInstance = function (viewer, options) {
  this._viewer = viewer;
  this._options = options;
};

SubProcessModule.prototype.getDiagramContent = function (calledDiagram, versionSelection, version) {
  // ajaxIdentifier
  var { ajaxIdentifier } = this._options;
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

SubProcessModule.$inject = ['eventBus', 'canvas'];
