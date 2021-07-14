import BpmnJS from "bpmn-js/lib/Viewer";
import BpmnJSNavigated from "bpmn-js/lib/NavigatedViewer"
import spViewModule from "./lib/spViewModule";

var bpmnViewer = {
  Viewer: BpmnJS,
  NavigatedViewer: BpmnJSNavigated,
  customModules: { spViewModule }
};

export default bpmnViewer;
