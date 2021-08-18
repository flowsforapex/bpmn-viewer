import BpmnJSNavigated from 'bpmn-js/lib/NavigatedViewer';
import BpmnJS from 'bpmn-js/lib/Viewer';
import diffModels from './lib/diffModule';
import spViewModule from './lib/spViewModule';
import styleModule from './lib/styleModule';

var bpmnViewer = {
  Viewer: BpmnJS,
  NavigatedViewer: BpmnJSNavigated,
  customModules: {
    spViewModule,
    styleModule,
  },
  diffModels,
};

export default bpmnViewer;
