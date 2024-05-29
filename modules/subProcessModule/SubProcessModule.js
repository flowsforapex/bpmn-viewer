
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { domify } from 'min-dom';

export default function SubProcessModule(
  canvas, eventBus, translate
) {
  this._canvas = canvas;
  this._eventBus = eventBus;
  this._translate = translate;

  var _self = this;

  // create and append select list
  this._select = domify('<select class="bjs-breadcrumbs" id="instanceSelect"></select>');
  canvas.getContainer().appendChild(this._select);

  // add event listener for select list
  this._select.addEventListener('change', function (event) {
    _self.loadInstance(event.target.value);
  });

  // when diagram root changes
  eventBus.on('root.set', function (event) {
    const {type} = event.element;
    // if drilled down into subprocess
    if (type === 'bpmn:SubProcess') { // TODO check if multi-instance
      _self.updateSelect(event);
    } else {
      // hide select list
      _self.toggleSelectVisibility(false);
    }
  });
}

SubProcessModule.prototype.setWidget = function (widget) {
  this._widget = widget;
};

SubProcessModule.prototype.updateSelect = function (event) {

  const translate = this._translate;

  const {element} = event;
  const businessObject = getBusinessObject(element);
  // id of the opened sub process
  const {id} = businessObject;

  // TODO retrieve data by using <id>
  const subProcessData = this._widget.multiInstanceData[id];

  // TODO set sub process data
  this._widget.subProcessData = subProcessData;

  // TODO extract this out of data
  const instanceIdsList = subProcessData;

  // clear select list
  this.clearSelect();

  // add first empty option
  this._select.appendChild(domify(`<option value="">${translate('- Select instance -')}</option>`));

  // add all instances
  instanceIdsList.forEach((i) => {
    this._select.appendChild(domify(`<option value="${i.value}">${i.label}</option>`));
  });

  this.toggleSelectVisibility(true);
};

SubProcessModule.prototype.loadInstance = function (value) {

  this._widget.resetHighlighting();

  if (value) {

    // TODO extract this out of sub process data using <value>
    const instanceData = this._widget.subProcessData.find(v => v.value == value).data;

    // set new diagram properties
    // TODO probably need to set the currently selected instance as well
    this._widget.current = instanceData.current;
    this._widget.completed = instanceData.completed;
    this._widget.error = instanceData.error;

    this._widget.addHighlighting();
  }
};

SubProcessModule.prototype.clearSelect = function () {
  // remove all entries
  while (this._select.firstChild) {
    this._select.removeChild(this._select.firstChild);
  }
};

SubProcessModule.prototype.toggleSelectVisibility = function (visible) {
  // show/hide breadcrumb (depending on number of entries)
  if (visible) {
    
    // show element
    this._select.style.display = 'block';
    
    // move down
    this._select.style.top = '60px';    

  } else {

    // hide element
    this._select.style.display = 'none';
  }
};

SubProcessModule.$inject = ['canvas', 'eventBus', 'translate'];