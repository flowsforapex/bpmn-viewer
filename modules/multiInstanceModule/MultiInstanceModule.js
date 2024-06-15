
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { domify, query as domQuery } from 'min-dom';


export default function MultiInstanceModule(
  canvas, eventBus, elementRegistry, translate, overlays
) {
  this._canvas = canvas;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._translate = translate;
  this._overlays = overlays;

  var _self = this;

  const modal = domify(`
    <div id="modal">
      <div id ="modal-content">
        <div id="iteration-header">
          <input type="text" id="iteration-search" placeholder="Search.."/>
          <button class="fa fa-times"></button>
        </div>
        <table id="iteration-list">
          <thead>
            <tr>
              <th>Loop Counter</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `);

  // append content
  canvas.getContainer().appendChild(modal);

  eventBus.on('import.render.complete', function () {
    // add search listener for filtering
    const searchbar = domQuery('#iteration-search');
    searchbar.addEventListener('keyup', function (event) {
      _self.filterIterations(event);
    });
    // add close listener
    const closeButton = domQuery('#iteration-header button.fa-times');
    closeButton.addEventListener('click', function (event) {
      _self.closeIterations();
    });
  });

  // when diagram root changes
  eventBus.on('root.set', function (event) {
    const element = getBusinessObject(event.element);
    // if drilled down into subprocess
    if (is(element, 'bpmn:SubProcess')) { // TODO check if multi-instance
      _self.addBreadcrumbButton(element);
    }
  });
}

MultiInstanceModule.prototype.addOverlays = function () {
  
  const _this = this;
  
  this._elementRegistry.filter(function (e) {
    return _this.hasMultiInstance(e);
  }).forEach(function (el) {
    _this.addOverlay(el);
  });
};

MultiInstanceModule.prototype.addOverlay = function (element) {

  const button = domify('<button class="bjs-drilldown fa fa-list"></button>');

  const _this = this;

  button.addEventListener('click', function (event) {
    _this.openIterations(element);
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

MultiInstanceModule.prototype.addBreadcrumbButton = function (element) {

  const breadcrumb = domQuery('.bjs-breadcrumbs li:last-child'); // TODO fix selector for excluding call activity breadcrumb

  const button = domify('<button class="bjs-drilldown fa fa-list"></button>');

  const _this = this;

  button.addEventListener('click', function (event) {
    _this.openIterations(element);
  });

  breadcrumb.appendChild(button);
};

MultiInstanceModule.prototype.hasMultiInstance = function (element) {
  return (!(is(element, 'bpmn:SubProcess')) && this._widget.multiInstanceData[element.id]);
};

MultiInstanceModule.prototype.setWidget = function (widget) {
  this._widget = widget;
};

/*
MultiInstanceModule.prototype.addCounterOverlay = function (event) {

  const {element} = event;
  const businessObject = getBusinessObject(element);
  // id of the opened sub process
  const {id} = businessObject;

  // TODO retrieve data by using <id>
  const subProcessData = this._widget.multiInstanceData[id];

  for (const d in subProcessData) {
    if (Object.hasOwn(subProcessData, d)) {
      if (subProcessData[d].completed) {
        this._overlays.add(d, {
          position: {
            bottom: 10,
            left: -10
          },
          html: `
            <div class="instance-counter">
              <div class="completed">${subProcessData[d].completed}</div>
              <div class="current">${subProcessData[d].current}</div>
            </div>
            `
        });
      }
      if (subProcessData[d].error) {
        this._overlays.add(d, {
          position: {
            top: -10,
            left: -10
          },
          html: `
            <div class="instance-counter">
              <div></div>
              <div class="error">${subProcessData[d].error}</div>
            </div>
            `
        });
      }
    }
  }
};
*/

MultiInstanceModule.prototype.openDialog = function () {

  const searchbar = domQuery('#iteration-search');
  const modal = domQuery('#modal');

  // clear searchbar
  searchbar.value = '';
  // show modal
  modal.style.display = 'flex';
};

MultiInstanceModule.prototype.loadTable = function (data) {

  const tbody = domQuery('#iteration-list tbody');

  const addOnClick = is(this.currentElement, 'bpmn:SubProcess');

  tbody.replaceChildren(
    ...data.map((d) => {
      const row = domify(`
        <tr ${addOnClick ? 'class="clickable"' : ''}>
          <td>${d.loopCounter}</td>
          <td>${d.description}</td>
          <td>${d.status}</td>
        </tr>
      `);

      const _this = this;

      if (addOnClick) {
        row.addEventListener('click', function (event) {
          _this.loadIteration(d.stepKey);
          _this.closeIterations();
        });
      }

      return row;
    }));

  
};

MultiInstanceModule.prototype.openIterations = function (element) {

  const {id} = element;
  // TODO retrieve data by using <id>
  const subProcessData = this._widget.multiInstanceData[id];

  if (subProcessData) {

    // set reference
    this.currentElement = element;

    // store for later
    this._widget.subProcessData = subProcessData;

    this.loadTable(subProcessData);

    this.openDialog();

  } else {
    // TODO do anything here?
  }

};

MultiInstanceModule.prototype.closeIterations = function () {

  const modal = domQuery('#modal');

  modal.style.display = 'none';
};

MultiInstanceModule.prototype.loadIteration = function (value) {

  if (value) {

    // TODO extract this out of sub process data using <value>
    const highlightingData = this._widget.subProcessData.find(v => v.stepKey == value).highlighting;

    if (highlightingData) {
      // set new diagram properties
      // TODO probably need to set the currently selected instance as well
      this._widget.current = highlightingData.current;
      this._widget.completed = highlightingData.completed;
      this._widget.error = highlightingData.error;

      this._widget.updateColors();
    }
  }
};

MultiInstanceModule.prototype.filterIterations = function (event) {

  console.log(event);

  const {value} = event.target;

  const filtered = this._widget.subProcessData.filter(d => d.description.includes(value)); // TODO make other columns searchable as well

  this.loadTable(filtered);
};

MultiInstanceModule.$inject = ['canvas', 'eventBus', 'elementRegistry', 'translate', 'overlays'];