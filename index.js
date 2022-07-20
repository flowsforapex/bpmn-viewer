import BpmnJSNavigated from 'bpmn-js/lib/NavigatedViewer';
import BpmnJS from 'bpmn-js/lib/Viewer';
import styleModule from './lib/styleModule';
import subProcessModule from './lib/subProcessModule';

var bpmnViewer = {
  Viewer: BpmnJS,
  NavigatedViewer: BpmnJSNavigated,
  customModules: {
    styleModule,
    subProcessModule,
  },
};

export default bpmnViewer;
