import ChangeSupportModule from 'diagram-js/lib/features/change-support';
import OverlaysModule from 'diagram-js/lib/features/overlays';
import RootElementsModule from 'diagram-js/lib/features/root-elements';

import DrilldownBreadcrumbs from 'bpmn-js/lib/features/drilldown/DrilldownBreadcrumbs';
import DrilldownOverlayBehavior from 'bpmn-js/lib/features/drilldown/DrilldownOverlayBehavior';
import SubprocessCompatibility from 'bpmn-js/lib/features/drilldown/SubprocessCompatibility';
import DrilldownCentering from './DrilldownCentering';

import CustomDrilldown from './CustomDrilldown';

export default {
  __depends__: [OverlaysModule, ChangeSupportModule, RootElementsModule],
  __init__: ['drilldownBreadcrumbs', 'drilldownOverlayBehavior', 'drilldownCentering', 'subprocessCompatibility', 'customDrilldown'],
  drilldownBreadcrumbs: ['type', DrilldownBreadcrumbs],
  drilldownCentering: ['type', DrilldownCentering],
  drilldownOverlayBehavior: ['type', DrilldownOverlayBehavior],
  subprocessCompatibility: ['type', SubprocessCompatibility],
  customDrilldown: ['type', CustomDrilldown],
};