
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { domify, query as domQuery } from 'min-dom';


export default function MultiInstanceModule(
  canvas, eventBus, elementRegistry, translate, overlays
) {
  var _self = this;
  
  this._canvas = canvas;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._translate = translate;
  this._overlays = overlays;

  this.breadcrumbData = [];

  const modal = domify(`
    <div id="modal">
      <div id ="modal-content">
        <div id="iteration-title">
          <span></span>
          <button class="fa fa-times"></button>
        </div>
        <div id="iteration-search">
          <input type="text" placeholder="Search.."/>
        </div>
        <div id="iteration-list">
            <table>
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
    </div>
  `);

  // append content
  canvas.getContainer().appendChild(modal);

  eventBus.on('import.render.complete', function () {
    // add search listener for filtering
    const searchbar = domQuery('#iteration-search input');
    searchbar.addEventListener('keyup', function (event) {
      _self.filterIterations(event);
    });
    // add close listener
    const closeButton = domQuery('#iteration-title button.fa-times');
    closeButton.addEventListener('click', function (event) {
      _self.closeIterations();
    });
  });

  // when diagram root changes
  eventBus.on('root.set', function (event) {

    const element = getBusinessObject(event.element);

    // if drilled down into subprocess
    if (is(element, 'bpmn:SubProcess') && _self.hasIterationData(element)) {
      _self.setSubprocessData(element);
      _self.updateBreadcrumb(element);
    }

    _self.resetBreadcrumbData();
    _self.updateHighlighting();
  });
}

MultiInstanceModule.prototype.addOverlays = function () {
  
  const _this = this;
  
  this._elementRegistry.filter(function (e) {
    return !(is(e, 'bpmn:SubProcess')) && _this.hasIterationData(e);
  }).forEach(function (el) {
    _this.addOverlay(el);
  });
};

MultiInstanceModule.prototype.isMultiInstanceSubProcess = function (element) {
  const businessObject = getBusinessObject(element);
  return is(businessObject, 'bpmn:SubProcess') && this.hasIterationData(businessObject);
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

MultiInstanceModule.prototype.getBreadcrumbElements = function () {
  const breadcrumb = domQuery('.bjs-breadcrumbs'); // TODO fix selector for excluding call activity breadcrumb
  return [...breadcrumb.children];
};


MultiInstanceModule.prototype.getLastBreadcrumbIndex = function () {
    const elements = this.getBreadcrumbElements();
    return elements.length - 1;
};

MultiInstanceModule.prototype.resetBreadcrumbData = function () {
  const lastIndex = this.getLastBreadcrumbIndex();
  
  for (let i = this.breadcrumbData.length - 1; i > lastIndex; i--) {
    this.breadcrumbData[i] = null;
  }
};

MultiInstanceModule.prototype.updateBreadcrumb = function (element) {

  const elements = this.getBreadcrumbElements();

  const _this = this;

  for (let i = 0; i < elements.length; i++) {

    // if last breadcrumb entry
    if (i === elements.length - 1 && !domQuery('button.bjs-drilldown', elements[i])) {
      // create button
      const button = domify('<button class="bjs-drilldown fa fa-list"></button>');
      // add event listener
      button.addEventListener('click', function (event) {
        // open iterations for this element
        _this.openIterations(element);
      });

      elements[i].append(button);
    }

    const data = this.breadcrumbData[i];

    if (data) {

      const text = domQuery('span.iteration', elements[i]);

      const element = domify(`<span class="bjs-crumb iteration" style="margin-left: 8px;">
                              <a>${data.description}</a>
                              </span>`
                            );

      if (!text) elements[i].append(element);
      else text.replaceWith(element);
    }
  }
};

MultiInstanceModule.prototype.hasIterationData = function (element) {
  return (this._widget.iterationData && this._widget.iterationData[element.id]);
};

MultiInstanceModule.prototype.setSubprocessData = function (element) {
  const {id} = element;
  
  // retrieve data from widget by using <id>
  this.subProcessData = this._widget.iterationData[id];
};

MultiInstanceModule.prototype.setWidget = function (widget) {
  this._widget = widget;
};

MultiInstanceModule.prototype.openDialog = function () {

  const searchbar = domQuery('#iteration-search input');
  const modal = domQuery('#modal');

  // clear searchbar
  searchbar.value = '';
  // show modal
  modal.style.display = 'flex';
};

MultiInstanceModule.prototype.loadTable = function (data, addOnClick) {

  const tbody = domQuery('#iteration-list tbody');

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

  if (this.subProcessData) {

    const addOnClick = is(element, 'bpmn:SubProcess');
    
    this.loadTable(this.subProcessData, addOnClick);

    // set title
    const title = domQuery('#iteration-title span');
    title.textContent = element.name;

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

    const iterationData = this.subProcessData.find(v => v.stepKey == value);

    this.breadcrumbData[this.getLastBreadcrumbIndex()] = iterationData;

    this.updateBreadcrumb();
    this.updateHighlighting();

    // // TODO extract this out of sub process data using <value>
    // const highlightingData = iterationData.highlighting;

    // if (highlightingData) {
    //   // set new diagram properties
    //   // TODO probably need to set the currently selected instance as well
    //   const {current, completed, error} = highlightingData;

    //   this._widget.updateColors(current, completed, error);

    //   // TODO update breadcrumb
    //   const breadcrumb = domQuery('.bjs-breadcrumbs'); // TODO fix selector for excluding call activity breadcrumb
    //   const children = [...breadcrumb.children];

    //   const element = domify(`<span class="bjs-crumb iteration" style="margin-left: 8px;">
    //     <a>${iterationData.description}</a>
    //   </span>`);
      
    //   this.breadcrumbData[children.length - 1].text = element;

    //   this.updateBreadcrumb();
    // }
  }
};

MultiInstanceModule.prototype.updateHighlighting = function () {

  const iterationData = this.breadcrumbData[this.getLastBreadcrumbIndex()];

  if (iterationData) {

    const {current, completed, error} = iterationData.highlighting;

    this._widget.updateColors(current, completed, error);
  } else if (this._widget) this._widget.resetColors();
};

MultiInstanceModule.prototype.filterIterations = function (event) {

  const {value} = event.target;

  const filtered = this._widget.subProcessData.filter(
    d => d.description.includes(value) || d.status.includes(value)
  ); // TODO make other columns searchable as well

  this.loadTable(filtered);
};

MultiInstanceModule.$inject = ['canvas', 'eventBus', 'elementRegistry', 'translate', 'overlays'];