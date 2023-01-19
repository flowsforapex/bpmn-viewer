// import Viewer from 'bpmn-js/lib/Viewer';
import CustomViewer from './CustomViewer';

var bpmnViewer = {
  Viewer: CustomViewer,
  // NavigatedViewer: BpmnJSNavigated,
  // customModules: {
  //   styleModule,
  //   subProcessModule,
  // },
};

export default bpmnViewer;
