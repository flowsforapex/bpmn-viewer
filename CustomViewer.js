import Viewer from 'bpmn-js/lib/Viewer';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
// import styleModule from './lib/styleModule';
// import subProcessModule from './lib/subProcessModule';
import DrilldownModdule from './lib/callActivityDrilldown';

// var bpmnViewer = {
//   Viewer: Viewer,
//   NavigatedViewer: BpmnJSNavigated,
//   customModules: {
//     styleModule,
//     subProcessModule,
//   },
// };

// export default bpmnViewer;

export default class CustomViewer extends Viewer {
}

CustomViewer.prototype._customModules = [
  ZoomScrollModule,
  MoveCanvasModule,
  DrilldownModdule
];

CustomViewer.prototype._modules = [].concat(
  Viewer.prototype._modules.filter(f => !f.drilldownBreadcrumbs),
  CustomViewer.prototype._customModules
);
