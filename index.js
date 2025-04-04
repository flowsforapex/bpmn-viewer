import BpmnViewer from 'bpmn-js/lib/Viewer';

// eslint-disable-next-line import/no-extraneous-dependencies
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
// eslint-disable-next-line import/no-extraneous-dependencies
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import customPaletteProviderModule from './lib/viewerPalette';
import badgeModule from './modules/badgeModule';
import callActivityModule from './modules/callActivityModule';
import multiInstanceModule from './modules/multiInstanceModule';
import styleModule from './modules/styleModule';
import subProcessTweaks from './modules/subProcessTweaks';
import userTaskModule from './modules/userTaskModule/';

import bpmnCSS from 'bpmn-js/dist/assets/bpmn-js.css';
import diagramCSS from 'bpmn-js/dist/assets/diagram-js.css';
import css from './assets/css/style.css';

import embeddedFontCSS from './assets/css/bpmn-embedded-font.css';
import embeddedRulesCSS from './assets/css/bpmn-embedded-rules.css';

class Viewer extends HTMLElement {
  constructor() {
    super();

    this.regionId = this.getAttribute('regionId');
    this.themePluginClass = this.getAttribute('themePluginClass');

    this.showToolbar = (this.getAttribute('showToolbar') === 'true');
    this.enableMousewheelZoom = (this.getAttribute('enableMousewheelZoom') === 'true');
    this.useBPMNcolors = (this.getAttribute('useBPMNcolors') === 'true');

    this.config = JSON.parse(this.getAttribute('config')) || {};

    // create shadow dom
    this.attachShadow({ mode: 'open' });
  }

  async initCSS() {

    // copy bpmn @font-face declaration into global dom
    const styleGlobal = document.createElement('style');
    styleGlobal.innerHTML = embeddedFontCSS.toString();
    document.head.appendChild(styleGlobal);

    // copy apex font file from global page to shadow dom
    const apexFontFile = Array.from(document.styleSheets).find(s => s.href && (s.href.includes('font-apex.min.css') || s.href.includes('font-apex.css')));

    if (apexFontFile) {
      const styleShadow = document.createElement('style');
      styleShadow.innerHTML = `@import "${apexFontFile.href}"`;
      this.shadowRoot.appendChild(styleShadow);
    }

    // import general css files into shadow dom
    const sheets = await Promise.all(
      [
        css,
        bpmnCSS,
        diagramCSS,
        embeddedRulesCSS,
      ]
      .map((file) => {
        const sheet = new CSSStyleSheet();
        return sheet.replace(file.toString());
      })
    );

    this.shadowRoot.adoptedStyleSheets = sheets;
  }

  initHTML() {

    const container = document.createElement('div');
    // general class for styling
    container.classList.add('flows4apex-viewer');
    // class determining plugin theme
    container.classList.add(this.themePluginClass);

    // create and append canvas container
    this.canvas = document.createElement('div');
    this.canvas.id = `${this.regionId}_canvas`;
    this.canvas.classList.add('canvas');

    container.appendChild(this.canvas);

    // append container
    this.shadowRoot.appendChild(container);
  }

  initViewer() {
    this.viewer = new BpmnViewer({
      component: this,
      container: this.shadowRoot.querySelector(`#${this.canvas.id}`),
      additionalModules: [
        ...(this.showToolbar || this.enableMousewheelZoom) ? [MoveCanvasModule] : [],
        ...(this.enableMousewheelZoom) ? [ZoomScrollModule] : [],
        subProcessTweaks,
        callActivityModule,
        multiInstanceModule,
        styleModule,
        ...(this.showToolbar) ? [customPaletteProviderModule] : [],
        userTaskModule,
        badgeModule
      ],
      bpmnRenderer: {
        defaultFillColor: 'var(--default-fill-color)',
        defaultStrokeColor: 'var(--default-stroke-color)',
        defaultLabelColor: 'var(--default-stroke-color)',
      },
      config: {
        currentStyle: this.config.currentStyle ||
        {
          'fill': '#6aad42',
          'border': 'black',
          'label': 'black'
        },
        completedStyle: this.config.completedStyle ||
        {
          'fill': '#8c9eb0',
          'border': 'black',
          'label': 'black'
        },
        errorStyle: this.config.errorStyle ||
        {
          'fill': '#d2423b',
          'border': 'black',
          'label': 'white'
        },
        allowDownload: Object.hasOwn(this.config, 'allowDownload') ? this.config.allowDownload : true,
      }
    });
  }

  getEventBus() {
    return this.viewer.get('eventBus');
  }

  connectedCallback() {

    this.initCSS();
    
    this.initHTML();

    this.initViewer();
  }

  loadData(data) {

    let oldLoaded = true;

    if (this.diagramIdentifier) {
      // load old diagram (if possible)
      this.diagram = data.find(d => d.diagramIdentifier === this.diagramIdentifier);
    } else {
      // otherwise: get root entry
      oldLoaded = false;
      this.diagram = data.find(d => !d.callActivityData || d.callActivityData.callingDiagramIdentifier === null);
    }

    if (this.diagram && this.diagram.callActivityData) {
      // set references to hierarchy
      this.data = data;
      
      const callActivityModule = this.viewer.get('callActivityModule');

      // reset & update breadcrumb
      if (!oldLoaded) {
        callActivityModule.resetBreadcrumb();
        callActivityModule.updateBreadcrumb();
      }
    }

    // // add highlighting if option is enabled
    // if (this.addHighlighting) {
    //   this.current = this.diagram.current;
    //   this.completed = this.diagram.completed;
    //   this.error = this.diagram.error;
    // }

    // // parse iterationData and attach to instance
    // try {
    //   this.iterationData = JSON.parse(this.diagram.iterationData);
    // } catch (e) {
    //   this.iterationData = null;
    // }
    
    // // parse userTaskData and attach to instance
    // try {
    //   this.userTaskData = JSON.parse(this.diagram.userTaskData);
    // } catch (e) {
    //   this.userTaskData = null;
    // }
  }

  async loadDiagram() {
    
    const result = await this.viewer.importXML(this.diagram.xml);
    const { warnings } = result;
      
    if (warnings.length > 0) {
      apex.debug.warn('Warnings during XML Import', warnings); // TODO emit event
    }
      
    this.zoom('fit-viewport');
      
    // get viewer modules
    const eventBus = this.viewer.get('eventBus');
    const multiInstanceModule = this.viewer.get('multiInstanceModule');
    const userTaskModule = this.viewer.get('userTaskModule');
    const subProcessTweaks = this.viewer.get('subProcessTweaks');
    const badgeModule = this.viewer.get('badgeModule');

    // update colors with the current highlighting info
    this.updateColors();
      
    // root.set -> drilled down into or moved out from sub process
    eventBus.on('root.set', (event) => {
      const {element} = event;
      // set zoom to center
      subProcessTweaks.centerAfterDrilldown();
      // if current element is not iterating -> iterating elements are handled inside module
      if (!multiInstanceModule.constructor.isMultiInstanceSubProcess(element)) {
        // update colors
        this.updateColors();
      }
    });

    // add overlays if iterationData is existing
    if (this.diagram.iterationData) {
      multiInstanceModule.addOverlays();
    }

    // add overlays if userTaskData is existing
    if (this.diagram.userTaskData) {
      userTaskModule.addOverlays();
    }
    
    // add overlays if badgesData is existing
    if (this.diagram.badgesData) {
      badgeModule.addOverlays();
    }

    subProcessTweaks.alignDrilldownButtons();
  }

  updateColors(current, completed, error) {
    // if any color option is enabled
    if (this.diagram.highlightingData || this.useBPMNcolors) {
      // get viewer module
      const styleModule = this.viewer.get('styleModule');
      // reset current colors
      this.resetColors();
      // add highlighting if option is enabled
      if (this.diagram.highlightingData) {
        styleModule.highlightElements(
          current || this.diagram.highlightingData.current,
          completed || this.diagram.highlightingData.completed,
          error || this.diagram.highlightingData.error
        );
      }
    }
  }
  
  resetColors() {
    // if any color option is enabled
    if (this.diagram.highlightingData || this.useBPMNcolors) {
      // get viewer module
      const styleModule = this.viewer.get('styleModule');
      // reset bpmn colors if option is not enabled
      if (!this.useBPMNcolors) {
        styleModule.resetBPMNcolors();
      }
      // reset highlighting
      styleModule.resetHighlighting();
    }
  }

  zoom(zoomOption) {
    this.viewer.get('canvas').zoom(zoomOption, 'auto');
  }

  async getDiagram() {
    const result = await this.viewer.saveXML({ format: true });
    const { xml } = result;
    return xml;
  }

  async getSVG() {
    const result = await this.viewer.saveSVG({ format: true });
    const { svg } = result;
        
    // add highlighting colors to image if option is enabled
    if (this.addHighlighting) {
      return this.viewer.get('styleModule').constructor.addStyleToSVG(svg);
    }

    return svg;
  }

  async downloadAsSVG() {
    const {allowDownload} = this.viewer.get('config').config;

    if (allowDownload) {
      const svg = await this.getSVG();
      
      const svgBlob = new Blob([svg], {
        type: 'image/svg+xml',
      });
      const fileName = Date.now();

      const downloadLink = document.createElement('a');
      downloadLink.download = fileName;
      downloadLink.href = window.URL.createObjectURL(svgBlob);
      downloadLink.click();
    }
  }
}

window.customElements.define('f4a-viewer', Viewer);