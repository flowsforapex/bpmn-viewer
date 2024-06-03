
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

export default function SubProcessModule(
  eventBus, overlays
) {
  this._eventBus = eventBus;
  this._overlays = overlays;

  var _self = this;

  // when diagram root changes
  eventBus.on('root.set', function (event) {
    const {type} = event.element;
    // if drilled down into subprocess
    if (type === 'bpmn:SubProcess') { // TODO check if multi-instance
      _self.addCounterOverlay(event);
    }
  });
}

SubProcessModule.prototype.setWidget = function (widget) {
  this._widget = widget;
};

SubProcessModule.prototype.addCounterOverlay = function (event) {

  const {element} = event;
  const businessObject = getBusinessObject(element);
  // id of the opened sub process
  const {id} = businessObject;

  // TODO retrieve data by using <id>
  const subProcessData = this._widget.multiInstanceData[id];

  for (const d in subProcessData) {
    if (Object.hasOwn(subProcessData, d)) {
      this._overlays.add(d, {
        position: {
          bottom: 14,
          left: 0
        },
        html: `
          <div class="instance-counter">
            <div class="completed">${subProcessData[d].completed}</div>
            <div class="current">${subProcessData[d].current}</div>
            <div class="error">${subProcessData[d].error}</div>
          </div>
          `
      });
    }
  }
};

SubProcessModule.$inject = ['eventBus', 'overlays'];