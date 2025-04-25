export class SubProcessTweaks {

  constructor(eventBus, canvas, overlays) {
    this._eventBus = eventBus;
    this._canvas = canvas;
    this._overlays = overlays;
  }

  /**
   * Move collapsed subprocesses into view when drilling down.
   *
   * Overwrite default behaviour where zoom and scroll are saved in a session.
   * Zoom always reset to fit-viewport & centered when drilling down / moving up
   */
  centerAfterDrilldown() {
    this._eventBus.on('root.set', () => { this._canvas.zoom('fit-viewport', 'auto'); });
  }

  alignDrilldownButtons() {
      
    // move drilldown buttons for sub processes to default button position (bottom right)
    this._overlays.get({ type: 'drilldown' })
    .forEach((d) => {
      d.position = { bottom: -2, right: -20 };
      this._overlays._updateOverlay(d);
    });
  }
}

SubProcessTweaks.$inject = ['eventBus', 'canvas', 'overlays'];