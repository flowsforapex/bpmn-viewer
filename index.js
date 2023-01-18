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

console.log(bpmnViewer.Viewer.prototype._modules);

export default bpmnViewer;
