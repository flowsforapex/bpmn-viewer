
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { domify } from 'min-dom';

export default function UserTaskModule(
  canvas, eventBus, elementRegistry, translate, overlays
) {
  this._canvas = canvas;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._translate = translate;
  this._overlays = overlays;
}

UserTaskModule.prototype.addOverlays = function () {

  const _this = this;

  const {userTaskData} = this._widget;
  
  this._elementRegistry.filter(function (e) {
    const bo = getBusinessObject(e);
    /* only show link button if
     * - element is userTask
     * - link is existing
     * - element is not iterating
     * - parent is not iterating
     */
    return is(e, 'bpmn:UserTask') && (userTaskData && userTaskData[e.id]) && !bo.loopCharacteristics && !bo.$parent.loopCharacteristics;
  }).forEach(function (el) {
    _this.addOverlay(el, userTaskData[el.id]);
  });
};

UserTaskModule.prototype.addOverlay = function (element, url) {

  const button = domify('<button class="bjs-drilldown fa fa-external-link"></button>');

  button.addEventListener('click', function () {
    window.open(url, '_self');
  });

  // add overlay
  this._overlays.add(element, 'iterations', {
    position: {
      bottom: -7,
      right: -8
    },
    html: button
  });
};

UserTaskModule.prototype.setWidget = function (widget) {
  this._widget = widget;
};

UserTaskModule.$inject = ['canvas', 'eventBus', 'elementRegistry', 'translate', 'overlays'];