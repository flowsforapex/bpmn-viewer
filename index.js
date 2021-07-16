import BpmnJS from "bpmn-js/lib/Viewer";
import BpmnJSNavigated from "bpmn-js/lib/NavigatedViewer"
import spViewModule from "./lib/spViewModule";
import styleModule from "./lib/styleModule";

var bpmnViewer = {
  Viewer: BpmnJS,
  NavigatedViewer: BpmnJSNavigated,
  customModules: { 
    spViewModule,
    styleModule
  }
};

export default bpmnViewer;
