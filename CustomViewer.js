import Viewer from 'bpmn-js/lib/Viewer';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import customDrilldownModule from './lib/customDrilldown';
import styleModule from './lib/styleModule';

export default class CustomViewer extends Viewer {
}

CustomViewer.prototype._customModules = [
  ZoomScrollModule,
  MoveCanvasModule,
  styleModule,
  customDrilldownModule
];

CustomViewer.prototype._modules = [].concat(
  Viewer.prototype._modules.filter(f => !f.drilldownBreadcrumbs),
  CustomViewer.prototype._customModules
);
