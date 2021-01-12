import BpmnJS from "bpmn-js/lib/Viewer";
import BpmnJSNavigated from "bpmn-js/lib/NavigatedViewer"
import spViewModule from "../lib/spViewModule";

bpmnViewer = {
  BpmnJS,
  BpmnJSNavigated,
  customModules: { spViewModule }
};

export default bpmnViewer;
