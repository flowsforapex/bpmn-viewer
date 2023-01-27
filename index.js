import Viewer from 'bpmn-js/lib/Viewer';

import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import customDrilldownModule from './lib/customDrilldown';
import styleModule from './lib/styleModule';

var bpmnViewer = {
  Viewer: Viewer,
  customModules: {
    MoveCanvasModule,
    ZoomScrollModule,
    customDrilldownModule,
    styleModule
  },
};

export default bpmnViewer;
