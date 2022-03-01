import BpmnJSNavigated from 'bpmn-js/lib/NavigatedViewer';
import BpmnJS from 'bpmn-js/lib/Viewer';
import spViewModule from './lib/spViewModule';
import styleModule from './lib/styleModule';
import subProcessModule from './lib/subProcessModule';

var bpmnViewer = {
  Viewer: BpmnJS,
  NavigatedViewer: BpmnJSNavigated,
  customModules: {
    spViewModule,
    styleModule,
    subProcessModule,
  },
};

export default bpmnViewer;
