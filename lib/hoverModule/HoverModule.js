
export default function HoverModule(eventBus, overlays) {

    this._overlays = overlays;

    var currentElement,
        currentOverlay;

    eventBus.on('element.hover', event => {
        if (currentElement && event.element != currentElement) {
            if (currentOverlay && currentOverlay.length > 0) {
                currentOverlay[0].htmlContainer.style.display = 'none';
            }
            currentElement = null;
        } else if (event.element.type == 'bpmn:Task') {
            currentElement = event.element;
            currentOverlay = overlays.get({element: event.element, type: "addInfo"});
            if (currentOverlay && currentOverlay.length > 0)  {
                currentOverlay[0].htmlContainer.style.display = 'block';
            }
        }
    });
}

HoverModule.$inject = [
    'eventBus',
    'overlays'
]

HoverModule.prototype.addOverlays = function(data) {

    var overlays = this._overlays,
        id;

    for (const e in data) {

        // id = overlays.add(e, "addInfo", {
        //     position: {
        //       bottom: 0,
        //       right: 0
        //     },
        //     html: '<div style="width: 100px; height: 80px;">' + data[e] + '</div>',
        //   });

        id = overlays.add(e, "addInfo", {
            position: {
              left: -20,
              top: -20
            },
            html: '<div class="addText">' + data[e] + '</div>',
          });
        
        overlays.get(id).htmlContainer.style.display = 'none';

        overlays.add(e, "dots", {
            position: {
                bottom: 20,
                right: 20
            },
            html: '<span>...</span>',
          });
    }
}