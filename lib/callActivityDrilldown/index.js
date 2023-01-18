import ChangeSupportModule from 'diagram-js/lib/features/change-support';
import OverlaysModule from 'diagram-js/lib/features/overlays';
import RootElementsModule from 'diagram-js/lib/features/root-elements';

import CustomDrilldown from './CustomDrilldown';

import DrilldownBreadcrumbs from './DrilldownBreadcrumbs';
import DrilldownCentering from './DrilldownCentering';
import DrilldownOverlayBehavior from './DrilldownOverlayBehavior';
import SubprocessCompatibility from './SubprocessCompatibility';

export default {
  __depends__: [OverlaysModule, ChangeSupportModule, RootElementsModule],
  __init__: ['customDrilldown', 'drilldownBreadcrumbs', 'drilldownOverlayBehavior', 'drilldownCentering', 'subprocessCompatibility'],
  customDrilldown: ['type', CustomDrilldown],
  drilldownBreadcrumbs: ['type', DrilldownBreadcrumbs],
  drilldownCentering: ['type', DrilldownCentering],
  drilldownOverlayBehavior: ['type', DrilldownOverlayBehavior],
  subprocessCompatibility: ['type', SubprocessCompatibility]
};