
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { domify } from 'min-dom';

var domQuery = require('min-dom').query;

var LOW_PRIORITY = 250;
var ARROW_DOWN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.81801948,3.50735931 L10.4996894,9.1896894 L10.5,4 L12,4 L12,12 L4,12 L4,10.5 L9.6896894,10.4996894 L3.75735931,4.56801948 C3.46446609,4.27512627 3.46446609,3.80025253 3.75735931,3.50735931 C4.05025253,3.21446609 4.52512627,3.21446609 4.81801948,3.50735931 Z"/></svg>';

var EMPTY_MARKER = 'bjs-drilldown-empty';

var temp;

/*
const data = [
  {
      diagram: '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:apex="https://flowsforapex.org" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1wzb475" targetNamespace="http://bpmn.io/schema/b" exporter="Flows for APEX" exporterVersion="22.2.0">\n  <bpmn:process id="Process_8bi81da4" isExecutable="false" apex:isCallable="false" apex:manualInput="false">\n    <bpmn:startEvent id="Event_0tsptvu">\n      <bpmn:outgoing>Flow_1kvc7xq</bpmn:outgoing>\n    </bpmn:startEvent>\n    <bpmn:task id="Activity_1n7ak6q" name="A">\n      <bpmn:incoming>Flow_1kvc7xq</bpmn:incoming>\n      <bpmn:outgoing>Flow_18pu87d</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id="Flow_1kvc7xq" sourceRef="Event_0tsptvu" targetRef="Activity_1n7ak6q" />\n    <bpmn:sequenceFlow id="Flow_18pu87d" sourceRef="Activity_1n7ak6q" targetRef="Activity_0l39a8a" />\n    <bpmn:endEvent id="Event_1ddk0gm">\n      <bpmn:incoming>Flow_155klko</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id="Flow_0xu1s7k" sourceRef="Activity_0l39a8a" targetRef="Activity_18sdb7r" />\n    <bpmn:callActivity id="Activity_0l39a8a" name="Call B" apex:manualInput="false" apex:calledDiagram="Test1" apex:calledDiagramVersionSelection="latestVersion">\n      <bpmn:incoming>Flow_18pu87d</bpmn:incoming>\n      <bpmn:outgoing>Flow_0xu1s7k</bpmn:outgoing>\n    </bpmn:callActivity>\n    <bpmn:sequenceFlow id="Flow_155klko" sourceRef="Activity_18sdb7r" targetRef="Event_1ddk0gm" />\n    <bpmn:callActivity id="Activity_18sdb7r" name="Call C" apex:manualInput="false" apex:calledDiagram="Test2" apex:calledDiagramVersionSelection="latestVersion">\n      <bpmn:incoming>Flow_0xu1s7k</bpmn:incoming>\n      <bpmn:outgoing>Flow_155klko</bpmn:outgoing>\n    </bpmn:callActivity>\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_8bi81da4">\n      <bpmndi:BPMNEdge id="Flow_0xu1s7k_di" bpmnElement="Flow_0xu1s7k">\n        <di:waypoint x="800" y="320" />\n        <di:waypoint x="850" y="320" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_18pu87d_di" bpmnElement="Flow_18pu87d">\n        <di:waypoint x="640" y="320" />\n        <di:waypoint x="700" y="320" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_1kvc7xq_di" bpmnElement="Flow_1kvc7xq">\n        <di:waypoint x="488" y="320" />\n        <di:waypoint x="540" y="320" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_155klko_di" bpmnElement="Flow_155klko">\n        <di:waypoint x="950" y="320" />\n        <di:waypoint x="1012" y="320" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="Event_0tsptvu_di" bpmnElement="Event_0tsptvu">\n        <dc:Bounds x="452" y="302" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_1n7ak6q_di" bpmnElement="Activity_1n7ak6q">\n        <dc:Bounds x="540" y="280" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_11cjfg5_di" bpmnElement="Activity_0l39a8a">\n        <dc:Bounds x="700" y="280" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Event_1ddk0gm_di" bpmnElement="Event_1ddk0gm">\n        <dc:Bounds x="1012" y="302" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_1rh2z2p_di" bpmnElement="Activity_18sdb7r">\n        <dc:Bounds x="850" y="280" width="100" height="80" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>\n',
      diagramIdentifier: 3,
      breadcrumb: 'Test ( Level: 0 )',
      insight: 1,
      current: [],
      completed: [],
      error: []
  },
  {
      diagram: '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:apex="https://flowsforapex.org" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1wzb475" targetNamespace="http://bpmn.io/schema/b" exporter="Flows for APEX" exporterVersion="22.2.0">\n  <bpmn:process id="Process_duqv68cg" isExecutable="false" apex:isCallable="true" apex:manualInput="false">\n    <bpmn:startEvent id="Event_116aqzg">\n      <bpmn:outgoing>Flow_04ahj5v</bpmn:outgoing>\n    </bpmn:startEvent>\n    <bpmn:task id="Activity_1s2az5o" name="B">\n      <bpmn:incoming>Flow_04ahj5v</bpmn:incoming>\n      <bpmn:outgoing>Flow_0gh7rlu</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id="Flow_04ahj5v" sourceRef="Event_116aqzg" targetRef="Activity_1s2az5o" />\n    <bpmn:endEvent id="Event_0pr0d71">\n      <bpmn:incoming>Flow_1gl7kx3</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id="Flow_0gh7rlu" sourceRef="Activity_1s2az5o" targetRef="Activity_0vev32v" />\n    <bpmn:sequenceFlow id="Flow_1gl7kx3" sourceRef="Activity_0vev32v" targetRef="Event_0pr0d71" />\n    <bpmn:callActivity id="Activity_0vev32v" name="Call D" apex:manualInput="false" apex:calledDiagram="Test4" apex:calledDiagramVersionSelection="latestVersion">\n      <bpmn:incoming>Flow_0gh7rlu</bpmn:incoming>\n      <bpmn:outgoing>Flow_1gl7kx3</bpmn:outgoing>\n    </bpmn:callActivity>\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_duqv68cg">\n      <bpmndi:BPMNEdge id="Flow_0gh7rlu_di" bpmnElement="Flow_0gh7rlu">\n        <di:waypoint x="770" y="310" />\n        <di:waypoint x="820" y="310" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_04ahj5v_di" bpmnElement="Flow_04ahj5v">\n        <di:waypoint x="618" y="310" />\n        <di:waypoint x="670" y="310" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_1gl7kx3_di" bpmnElement="Flow_1gl7kx3">\n        <di:waypoint x="920" y="310" />\n        <di:waypoint x="972" y="310" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="Event_116aqzg_di" bpmnElement="Event_116aqzg">\n        <dc:Bounds x="582" y="292" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_1s2az5o_di" bpmnElement="Activity_1s2az5o">\n        <dc:Bounds x="670" y="270" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Event_0pr0d71_di" bpmnElement="Event_0pr0d71">\n        <dc:Bounds x="972" y="292" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_0ao01ye_di" bpmnElement="Activity_0vev32v">\n        <dc:Bounds x="820" y="270" width="100" height="80" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>\n',
      diagramIdentifier: 4,
      callingDiagramIdentifier: 3,
      callingObjectId: 'Activity_0l39a8a',
      breadcrumb: 'Test1',
      insight: 1,
      current: [],
      completed: [],
      error: []
  },
  {
      diagram: '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:apex="https://flowsforapex.org" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1wzb475" targetNamespace="http://bpmn.io/schema/b" exporter="Flows for APEX" exporterVersion="22.2.0">\n  <bpmn:process id="Process_i0r7pz61" isExecutable="false" apex:isCallable="true" apex:manualInput="false">\n    <bpmn:startEvent id="Event_1kjoxeq">\n      <bpmn:outgoing>Flow_1dbddm0</bpmn:outgoing>\n    </bpmn:startEvent>\n    <bpmn:task id="Activity_0l2xi37" name="D">\n      <bpmn:incoming>Flow_1dbddm0</bpmn:incoming>\n      <bpmn:outgoing>Flow_157e9yi</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id="Flow_1dbddm0" sourceRef="Event_1kjoxeq" targetRef="Activity_0l2xi37" />\n    <bpmn:endEvent id="Event_085f5s3">\n      <bpmn:incoming>Flow_157e9yi</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id="Flow_157e9yi" sourceRef="Activity_0l2xi37" targetRef="Event_085f5s3" />\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_i0r7pz61">\n      <bpmndi:BPMNEdge id="Flow_1dbddm0_di" bpmnElement="Flow_1dbddm0">\n        <di:waypoint x="478" y="320" />\n        <di:waypoint x="530" y="320" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_157e9yi_di" bpmnElement="Flow_157e9yi">\n        <di:waypoint x="630" y="320" />\n        <di:waypoint x="682" y="320" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="Event_1kjoxeq_di" bpmnElement="Event_1kjoxeq">\n        <dc:Bounds x="442" y="302" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_0l2xi37_di" bpmnElement="Activity_0l2xi37">\n        <dc:Bounds x="530" y="280" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Event_085f5s3_di" bpmnElement="Event_085f5s3">\n        <dc:Bounds x="682" y="302" width="36" height="36" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>\n',
      diagramIdentifier: 5,
      callingDiagramIdentifier: 4,
      callingObjectId: 'Activity_0vev32v',
      breadcrumb: 'Test4',
      insight: 1,
      current: [],
      completed: [],
      error: []
  },
  {
      diagram: '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:apex="https://flowsforapex.org" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1wzb475" targetNamespace="http://bpmn.io/schema/b" exporter="Flows for APEX" exporterVersion="22.2.0">\n  <bpmn:process id="Process_9w9ln1oa" isExecutable="false" apex:isCallable="true" apex:manualInput="false">\n    <bpmn:startEvent id="Event_18ievgl">\n      <bpmn:outgoing>Flow_1ph9qgo</bpmn:outgoing>\n    </bpmn:startEvent>\n    <bpmn:task id="Activity_03wep3j" name="C">\n      <bpmn:incoming>Flow_1ph9qgo</bpmn:incoming>\n      <bpmn:outgoing>Flow_0phxgpd</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id="Flow_1ph9qgo" sourceRef="Event_18ievgl" targetRef="Activity_03wep3j" />\n    <bpmn:endEvent id="Event_0pxr9ak">\n      <bpmn:incoming>Flow_0phxgpd</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id="Flow_0phxgpd" sourceRef="Activity_03wep3j" targetRef="Event_0pxr9ak" />\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_9w9ln1oa">\n      <bpmndi:BPMNEdge id="Flow_1ph9qgo_di" bpmnElement="Flow_1ph9qgo">\n        <di:waypoint x="478" y="300" />\n        <di:waypoint x="530" y="300" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_0phxgpd_di" bpmnElement="Flow_0phxgpd">\n        <di:waypoint x="630" y="300" />\n        <di:waypoint x="682" y="300" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="Event_18ievgl_di" bpmnElement="Event_18ievgl">\n        <dc:Bounds x="442" y="282" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_03wep3j_di" bpmnElement="Activity_03wep3j">\n        <dc:Bounds x="530" y="260" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Event_0pxr9ak_di" bpmnElement="Event_0pxr9ak">\n        <dc:Bounds x="682" y="282" width="36" height="36" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>\n',
      diagramIdentifier: 6,
      callingDiagramIdentifier: 3,
      callingObjectId: 'Activity_18sdb7r',
      breadcrumb: 'Test2',
      insight: 1,
      current: [],
      completed: [],
      error: []
  }
];
*/

export default function CustomDrilldown(
    canvas, eventBus, elementRegistry, overlays, moddle
) {
  this._canvas = canvas;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._overlays = overlays;
  this._moddle = moddle;

  var self = this;

  this._breadcrumb = domify('<ul class="bjs-breadcrumbs" id="callActivityBreadcrumb"></ul>');
  var container = canvas.getContainer();
  container.appendChild(this._breadcrumb);

  eventBus.on('import.render.complete', function () {
    elementRegistry.filter(function (e) {
      return self.canDrillDown(e);
    }).forEach(function (el) {
      self.addOverlay(el);
    });
  });

}

CustomDrilldown.prototype.canDrillDown = function (element) {
  return (is(element, 'bpmn:CallActivity'));
};

CustomDrilldown.prototype.addOverlay = function (element) {
  var canvas = this._canvas;
  var overlays = this._overlays;

  var _self = this;

  var existingOverlays = overlays.get({ element: element, type: 'drilldown' });
  if (existingOverlays.length) {
    this.removeOverlay(element);
  }

  var button = domify(
    `<button class="bjs-drilldown" data-element="${element.id}">${ARROW_DOWN_SVG}</button>`);

  // button.addEventListener('click', function () {   
  //   fetch('./assets/diagrams/CalledDiagram.bpmn')
  //   .then((data) => {
  //     data.text()
  //     .then((result) => {
  //       _self._widget.importXML(result);
  //       _self.addToBreadcrumb('dummy');
  //     });
  //   });
  // });

  button.addEventListener('click', function (event) {

    const button = event.path.filter((f => f.tagName === 'BUTTON'))[0];

    // clicked object
    var objectId = button.dataset.element;

    // retrieve current index + hierarchy
    var { data, diagramIdentifier } = _self._widget;

    // get new diagram from hierarchy
    var newDiagram = data.find(
      d =>
        d.callingDiagramIdentifier === diagramIdentifier &&
        d.callingObjectId === objectId
    );

    // if insight allowed
    if (newDiagram && newDiagram.insight === 1) {
      // update breadcrumb
      _self._addToBreadcrumb(
        newDiagram.breadcrumb,
        newDiagram.diagramIdentifier,
        newDiagram.callingDiagramIdentifier,
        newDiagram.callingObjectId
      );

      // set new diagram properties
      _self._widget.diagramIdentifier = newDiagram.diagramIdentifier;
      _self._widget.callingDiagramIdentifier =
        newDiagram.callingDiagramIdentifier;
      _self._widget.callingObjectId = newDiagram.callingObjectId;
      _self._widget.diagram = newDiagram.diagram;
      _self._widget.current = newDiagram.current;
      _self._widget.completed = newDiagram.completed;
      _self._widget.error = newDiagram.error;

      // invoke loadDiagram of widget
      _self._widget.loadDiagram();
    }
  });

  overlays.add(element, 'drilldown', {
    position: {
      bottom: -7,
      right: -8
    },
    html: button
  });
};

CustomDrilldown.prototype.setWidget = function (widget) {
  this._widget = widget;
};

CustomDrilldown.prototype.addToBreadcrumb = function (
  label,
  diagramIdentifier,
  callingDiagramIdentifier,
  callingObjectId
) {

  var _self = this;

  var link = domify(
    `<li data-index="${this._breadcrumb.childNodes.length}" data-diagramIdentifier="${diagramIdentifier}" data-callingDiagramIdentifier="${callingDiagramIdentifier}" data-callingObjectId="$${callingObjectId}">
    <span class="bjs-crumb">
    <a title="called by ${callingObjectId}">${label}</a>
    </span>
    </li>`);

  link.addEventListener('click', function (event) {
    // clicked object
    var {
      index,
      diagramIdentifier,
      callingDiagramIdentifier,
      callingObjectId,
    } = event.target.dataset;

    // retrieve hierarchy
    var { data } = _self._widget;

    // get new diagram from hierarchy
    var newDiagram = data.find(
      d => d.diagramIdentifier == diagramIdentifier
    );

    // trim breadcrumb to clicked entry
    trimBreadcrumbTo(index);

    // set new diagram properties
    _self._widget.diagramIdentifier = newDiagram.diagramIdentifier;
    _self._widget.callingDiagramIdentifier =
      newDiagram.callingDiagramIdentifier;
    _self._widget.callingObjectId = newDiagram.callingObjectId;
    _self._widget.diagram = newDiagram.diagram;
    _self._widget.current = newDiagram.current;
    _self._widget.completed = newDiagram.completed;
    _self._widget.error = newDiagram.error;

    // invoke loadDiagram of widget
    _self._widget.loadDiagram();
  });

  this._breadcrumb.appendChild(link);

  // show breadcrumbs and expose state to .djs-container
  var visible = this._breadcrumb.childNodes.length > 0;
  
  if (visible) {
    this._breadcrumb.style.display = 'flex';
  } else {
    this._breadcrumb.style.display = 'none';
  }
};

CustomDrilldown.prototype.trimBreadcrumbTo = function (index) {
  var flag = false;
  var removeNodes = [];

  for (let i = 0; i < this._breadcrumb.childNodes.length; i++) {
    if (flag) {
      // add to removable nodes
      removeNodes.push(this._breadcrumb.childNodes[i]);
    } else if (this._breadcrumb.childNodes[i].dataset.index === index) {
      // mark as last node
      flag = true;
    }
  }

  // remove subsequent nodes
  removeNodes.forEach(n => this._breadcrumb.removeChild(n));
};

CustomDrilldown.prototype.resetBreadcrumb = function () {
  // retrieve current index + hierarchy
  var { data, diagramIdentifier, callingDiagramIdentifier, callingObjectId } =
    this._widget;

  // retrieve data of current diagram
  var { breadcrumb } = data.find(
    d =>
      d.diagramIdentifier === diagramIdentifier &&
      d.callingDiagramIdentifier === callingDiagramIdentifier &&
      d.callingObjectId === callingObjectId
  );

  // reset breadcrumb
  this._breadcrumb.textContent = '';

  // add entry to current diagram breadcrumb
  this.addToBreadcrumb(
    breadcrumb,
    diagramIdentifier,
    callingDiagramIdentifier,
    callingObjectId
  );
};

CustomDrilldown.$inject = [
  'canvas',
  'eventBus',
  'elementRegistry',
  'overlays',
  'moddle'
];