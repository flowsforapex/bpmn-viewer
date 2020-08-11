import BpmnJS from "bpmn-js/lib/NavigatedViewer";
import spViewModule from "./lib/spViewModule";

bpmnViewer = {
  BpmnJS,
  customModules: { spViewModule }
};

export default bpmnViewer;
