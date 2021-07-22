
export default function HoverModule(eventBus, overlays, elementRegistry) {

    this._overlays = overlays;
    this._elementRegistry = elementRegistry;

    var currentOverlay;

    eventBus.on('element.hover', event => {
        
        if (['bpmn:Task','bpmn:UserTask','bpmn:ManualTask','bpmn:ScriptTask'].includes(event.element.type)) {
            currentOverlay = overlays.get({element: event.element, type: "addInfo"})[0];
            if (currentOverlay)  {
                currentOverlay.htmlContainer.style.display = 'block';

                event.gfx.onmouseleave = function() {
                    currentOverlay.htmlContainer.style.display = 'none';
                }
            }
        /* needed for overlay on top */
        // } else {
        //     if (currentOverlay)
        //         currentOverlay.htmlContainer.style.display = 'none';
        }
    });
}

HoverModule.$inject = [
    'eventBus',
    'overlays',
    'elementRegistry'
]

HoverModule.prototype.addOverlays = function(data) {

    var overlays = this._overlays,
        id;

    for (const name in data) {

        /* bottom right */
        // id = overlays.add(name, "addInfo", {
        //     position: { bottom: 0, right: 0 },
        //     html: '<div style="width: 100px; height: 80px;">' + data[name] + '</div>',
        // });

        /* on top -> deactivate */
        // id = overlays.add(name, "addInfo", {
        //     position: { left: -20, top: -20 },
        //     html: '<div class="addText_onTop">' + data[name] + '</div>',
        // });

        /* above */
        id = overlays.add(name, "addInfo", {
            position: { left: -20, top: -130 },
            html: '<div class="addText_above">' + data[name] + '</div>',
        });
        
        overlays.get(id).htmlContainer.style.display = 'none';

        overlays.add(name, "dots", {
            position: { bottom: 20, right: 20 },
            html: '<span>...</span>',
        });
    }
}