import Viewer from 'bpmn-js/lib/Viewer';

import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import callActivityDrilldownModule from './lib/customDrilldown/callActivityDrilldown';
import drilldownCenteringModule from './lib/customDrilldown/drilldownCentering';
import styleModule from './lib/styleModule';

var bpmnViewer = {
  Viewer: Viewer,
  customModules: {
    MoveCanvasModule,
    ZoomScrollModule,
    callActivityDrilldownModule,
    drilldownCenteringModule,
    styleModule
  },
};

export default bpmnViewer;
