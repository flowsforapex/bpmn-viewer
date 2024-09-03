import Viewer from 'bpmn-js/lib/Viewer';

import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import customPaletteProviderModule from './lib/viewerPalette';
import callActivityModule from './modules/callActivityModule';
import drilldownCentering from './modules/drilldownCentering';
import styleModule from './modules/styleModule';
import multiInstanceModule from './modules/multiInstanceModule';
import userTaskModule from './modules/userTaskModule/';

var bpmnViewer = {
  Viewer: Viewer,
  customModules: {
    MoveCanvasModule,
    ZoomScrollModule,
    drilldownCentering,
    callActivityModule,
    multiInstanceModule,
    styleModule,
    customPaletteProviderModule,
    userTaskModule
  },
};

export default bpmnViewer;
