
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { domify, query as domQuery } from 'min-dom';


export class MultiInstanceModule {
  
  constructor(canvas, eventBus, elementRegistry, translate, overlays) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._elementRegistry = elementRegistry;
    this._translate = translate;
    this._overlays = overlays;

    this.breadcrumbIteration = [];
    this.breadcrumbSelection = [];

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
      const { element } = event;

      // reset breadcrumb data (null all entries above the current)
      this.resetBreadcrumbData();

      // if drilled down into subprocess
      if (is(element, 'bpmn:SubProcess')) {
        if (this.hasIterationData(element)) {
          // update breadcrumb data: mark current entry as iterating
          this.breadcrumbIteration[this.getLastBreadcrumbIndex()] = true;
          // update breadcrumb: add button (if last element)
          this.appendBreadcrumbButton(element);
        }
        this.updateBreadcrumb();
      }

      // update highlighting (from current iteration)
      this.updateHighlighting();
    });
  }

  /* Initialisation */

  setWidget(widget) {
    this._widget = widget;
  }

  /* Helper */

  getIterationData(element) {

    const { id } = getBusinessObject(element);

    // get parent iteration from breadcrumb
    const parentIteration = this.breadcrumbSelection[this.getLastBreadcrumbIndex() - 1];

    // retrieve data from widget by using id and stepKey
    return (this._widget.iterationData &&
      this._widget.iterationData[id] &&
      this._widget.iterationData[id].filter(
        i => ((!parentIteration && !i.parentStepKey) || (parentIteration && i.parentStepKey == parentIteration.stepKey))
      )) || [];
  }

  /* Overlays */

  addOverlays() {
    this._elementRegistry
      // id element is no subprocess and has iteration data
      .filter(element => !(is(element, 'bpmn:SubProcess')) && this.hasIterationData(element))
      .forEach((element) => {
        this.addOverlay(element);
      });
  }

  addOverlay(element) {

    const button = domify('<button class="bjs-drilldown fa fa-list"></button>');

    // add onclick listener
    button.addEventListener('click', (_) => {
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
  }

  /* Boolean functions */

  isMultiInstanceSubProcess(element) {
    const businessObject = getBusinessObject(element);
    return is(element, 'bpmn:SubProcess') && businessObject.loopCharacteristics;
  }

  hasIterationData(element) {
    return this.getIterationData(element).length > 0;
  }

  /* Breadcrumb */

  getBreadcrumbElements() {
    const breadcrumb = domQuery('.bjs-breadcrumbs'); // TODO fix selector for excluding call activity breadcrumb
    return [...breadcrumb.children];
  }

  getLastBreadcrumbIndex() {
    const elements = this.getBreadcrumbElements();
    return elements.length - 1;
  }

  resetBreadcrumbData() {
    const lastIndex = this.getLastBreadcrumbIndex();

    this.breadcrumbIteration.splice(lastIndex + 1);
    this.breadcrumbSelection.splice(lastIndex + 1);
  }

  appendBreadcrumbButton(element) {

    const lastElement = this.getBreadcrumbElements().pop();

    // if element existing (might be null on diagram load)
    if (lastElement) {
      // create button
      const button = domify('<button class="bjs-drilldown fa fa-list"></button>');
      // add event listener
      button.addEventListener('click', (_) => {
        // open iterations for this element
        this.openIterations(element);
      });

      lastElement.append(button);
    }
  }

  updateBreadcrumb() {

    const elements = this.getBreadcrumbElements();

    for (let i = 0; i < elements.length; i++) {

      const data = this.breadcrumbIteration[i];

      // if current breadcrumb entry has iteration data & is not last element
      if (data && i < elements.length - 1) {

        const existing = domQuery('span.iteration-button', elements[i]);

        const span = domify('<span class="bjs-crumb iteration-button fa fa-list"></span>');
        
        // append span or replace text if existing
        if (!existing) elements[i].append(span);
        else existing.replaceWith(span);
      }

      const selected = this.breadcrumbSelection[i];

      // if current breadcrumb entry has selected iteration
      if (selected) {

        const existing = domQuery('span.iteration-desc', elements[i]);

        const span = domify(`<span class="bjs-crumb iteration-desc">${selected.description}</span>`);

        // append span or replace text if existing
        if (!existing) elements[i].append(span);
        else existing.replaceWith(span);
      }
    }
  }

  /* dialog */

  openDialog() {

    const searchbar = domQuery('#iteration-search input');
    const modal = domQuery('#modal');

    // clear searchbar
    searchbar.value = '';
    // show modal
    modal.style.display = 'flex';
  }

  loadTable(data) {

    const tbody = domQuery('#iteration-list tbody');

    // build table body
    tbody.replaceChildren(
      ...(data || this.dialogData).map((d) => {
        const row = domify(`
        <tr ${this.dialogClickable ? 'class="clickable"' : ''}>
          <td>${d.loopCounter}</td>
          <td>${d.description}</td>
          <td>${d.status}</td>
        </tr>
      `);

        // add onclick listener if rows are clickable (sub processes)
        if (this.dialogClickable) {
          row.addEventListener('click', (_) => {
            this.loadIteration(d.loopCounter);
            this.closeIterations();
          });
        }

        return row;
      }));
  }

  openIterations(element) {

    // store data and clickable info for later
    this.dialogData = this.getIterationData(element);
    this.dialogClickable = is(element, 'bpmn:SubProcess');

    if (this.dialogData) {

      this.loadTable();

      // set title
      const title = domQuery('#iteration-title span');
      title.textContent = getBusinessObject(element).name;

      this.openDialog();
    }
  }

  closeIterations() {

    const modal = domQuery('#modal');

    modal.style.display = 'none';
  }

  loadIteration(loopCounter) {

    const selectedIteration = this.dialogData.find(v => v.loopCounter == loopCounter);

    this.breadcrumbSelection[this.getLastBreadcrumbIndex()] = selectedIteration;

    this.updateBreadcrumb();
    this.updateHighlighting();
  }

  filterIterations(event) {

    const { value } = event.target;

    const filtered = this.dialogData.filter(
      d => d.description.includes(value) || d.status.includes(value)
    );

    this.loadTable(filtered);
  }

  /* Util */
  
  updateHighlighting() {

    if (this._widget) {

      const currentIteration = this.breadcrumbSelection[this.getLastBreadcrumbIndex()];

      if (currentIteration) {
        const { current, completed, error } = currentIteration.highlighting;
        this._widget.updateColors(current, completed, error);
      } else {
        this._widget.resetColors();
      }
    }
  }
}

MultiInstanceModule.$inject = ['canvas', 'eventBus', 'elementRegistry', 'translate', 'overlays'];