
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

  eventBus.on('import.render.complete', () => {
    // add search listener for filtering
    const searchbar = domQuery('#iteration-search input');
    searchbar.addEventListener('keyup', (event) => {
      this.filterIterations(event);
    });
    // add close listener
    const closeButton = domQuery('#iteration-title button.fa-times');
    closeButton.addEventListener('click', (event) => {
      this.closeIterations();
    });
  });

  // when diagram root changes
  eventBus.on('root.set', (event) => {
    const {element} = event;

    // reset breadcrumb data (null all entries above the current)
    this.resetBreadcrumbData();
    
    // if drilled down into subprocess
    if (is(element, 'bpmn:SubProcess')) {
      // update breadcrumb: add button (if last element)
      this.updateBreadcrumbButton(element);
      // update breadcrumb: add/update iteration text (from breadcrumbData)
      this.updateBreadcrumbText();
    }

    // update highlighting (from current iteration)
    this.updateHighlighting();
  });
}

MultiInstanceModule.prototype.addOverlays = function () {
  this._elementRegistry
  // id element is no subprocess and has iteration data
  .filter(element => !(is(element, 'bpmn:SubProcess')) && this.hasIterationData(element))
  .forEach((element) => {
    this.addOverlay(element);
  });
};

/**
 * Called from outside (widget)
 * @param {element} element 
 * @returns true if element is subprocess and has iteration data
 */
MultiInstanceModule.prototype.isMultiInstanceSubProcess = function (element) {
  const businessObject = getBusinessObject(element);
  return is(element, 'bpmn:SubProcess') && this.hasIterationData(businessObject);
};

MultiInstanceModule.prototype.addOverlay = function (element) {

  const button = domify('<button class="bjs-drilldown fa fa-list"></button>');

  button.addEventListener('click', (event) => {
    this.openIterations(element);
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

MultiInstanceModule.prototype.updateBreadcrumbButton = function (element) {

  const elements = this.getBreadcrumbElements();

  for (let i = 0; i < elements.length; i++) {

    // if last breadcrumb entry & button not yet existing
    if (this.hasIterationData(element) && i === elements.length - 1 && !domQuery('button.bjs-drilldown', elements[i])) {
      // create button
      const button = domify('<button class="bjs-drilldown fa fa-list"></button>');
      // add event listener
      button.addEventListener('click', (event) => {
        // open iterations for this element
        this.openIterations(element);
      });

      elements[i].append(button);
    }
  }
};

MultiInstanceModule.prototype.updateBreadcrumbText = function () {

  const elements = this.getBreadcrumbElements();

  for (let i = 0; i < elements.length; i++) {

    const data = this.breadcrumbData[i];

    // if current breadcrumb entry has data
    if (data) {

      const text = domQuery('span.iteration', elements[i]);

      const span = domify(`<span class="bjs-crumb iteration" style="margin-left: 8px;">
                              <a>${data.description}</a>
                              </span>`
                            );

      // append span or replace text if existing
      if (!text) elements[i].append(span);
      else text.replaceWith(span);
    }
  }
};

MultiInstanceModule.prototype.hasIterationData = function (element) {
  return this.getIterationData(element).length > 0;
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

MultiInstanceModule.prototype.loadTable = function (addOnClick) {

  const tbody = domQuery('#iteration-list tbody');

  tbody.replaceChildren(
    ...this.dialogData.map((d) => {
      const row = domify(`
        <tr ${addOnClick ? 'class="clickable"' : ''}>
          <td>${d.loopCounter}</td>
          <td>${d.description}</td>
          <td>${d.status}</td>
        </tr>
      `);

      if (addOnClick) {
        row.addEventListener('click', (event) => {
          this.loadIteration(d.stepKey);
          this.closeIterations();
        });
      }

      return row;
    }));

  
};

MultiInstanceModule.prototype.getIterationData = function (element) {
  
  const {id} = getBusinessObject(element);

  const parentIteration = this.breadcrumbData[this.getLastBreadcrumbIndex() - 1];

  // retrieve data from widget by using <id>
  return (this._widget.iterationData &&
         this._widget.iterationData[id] &&
         this._widget.iterationData[id].filter(i => (!parentIteration && !i.parentStepKey) || (parentIteration && i.parentStepKey == parentIteration.stepKey))) || [];
};

MultiInstanceModule.prototype.openIterations = function (element) {

  this.dialogData = this.getIterationData(element);

  if (this.dialogData) {

    const addOnClick = is(element, 'bpmn:SubProcess');
    
    this.loadTable(addOnClick);

    // set title
    const title = domQuery('#iteration-title span');
    title.textContent = getBusinessObject(element).name;

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

    const selectedIteration = this.dialogData.find(v => v.stepKey == value);

    this.breadcrumbData[this.getLastBreadcrumbIndex()] = selectedIteration;

    this.updateBreadcrumbText();
    this.updateHighlighting();
  }
};

MultiInstanceModule.prototype.updateHighlighting = function () {

  const currentIteration = this.breadcrumbData[this.getLastBreadcrumbIndex()];

  if (currentIteration) {

    const {current, completed, error} = currentIteration.highlighting;

    this._widget.updateColors(current, completed, error);
  } else if (this._widget) this._widget.resetColors();
};

MultiInstanceModule.prototype.filterIterations = function (event) {

  const {value} = event.target;

  const filtered = this.dialogData.filter(
    d => d.description.includes(value) || d.status.includes(value)
  );

  this.loadTable(filtered);
};

MultiInstanceModule.$inject = ['canvas', 'eventBus', 'elementRegistry', 'translate', 'overlays'];