import Viewer from 'bpmn-js/lib/Viewer';

import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import customPaletteProviderModule from './lib/viewerPalette';
import callActivityModule from './modules/callActivityModule';
import drilldownCentering from './modules/drilldownCentering';
import styleModule from './modules/styleModule';
import subProcessModule from './modules/subProcessModule';
import rightClickModule from './modules/rightClickModule';

var bpmnViewer = {
  Viewer: Viewer,
  customModules: {
    MoveCanvasModule,
    ZoomScrollModule,
    drilldownCentering,
    callActivityModule,
    subProcessModule,
    styleModule,
    customPaletteProviderModule,
    rightClickModule
  },
};

export default bpmnViewer;
