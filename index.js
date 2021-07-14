import BpmnJS from "bpmn-js/lib/Viewer";
import BpmnJSNavigated from "bpmn-js/lib/NavigatedViewer"
import spViewModule from "./lib/spViewModule";
import SVGModule from "./lib/SVGModule";

var bpmnViewer = {
  Viewer: BpmnJS,
  NavigatedViewer: BpmnJSNavigated,
  customModules: { 
    spViewModule,
    SVGModule
  }
};

export default bpmnViewer;
