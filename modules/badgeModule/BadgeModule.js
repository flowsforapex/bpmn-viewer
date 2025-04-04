
// eslint-disable-next-line import/no-extraneous-dependencies
import { domify } from 'min-dom';

export class BadgeModule {

  constructor(canvas, eventBus, elementRegistry, translate, overlays, component) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._elementRegistry = elementRegistry;
    this._translate = translate;
    this._overlays = overlays;
    this._component = component;
  }

  addOverlays() {

    const { badgesData } = this._component.diagram;

    this._elementRegistry.filter(element => badgesData && badgesData[element.id])
    .forEach((element) => {
      this.addOverlay(element, badgesData[element.id]);
    });
  }

  addOverlay(element, badges) {

    badges.forEach((b) => {

      if (b.label || b.icon) {

        let position;
        
        if (b.position === 'TopLeft') position = { top: -30, left: 0 };
        else if (b.position === 'TopRight') position = { top: -30, right: 0 };
        else if (b.position === 'BottomLeft') position = { bottom: -2, left: 0 };
        // else if (b.position === 'BottomRight') position = { bottom: -2, right: 0 };
        
        const badge = domify(
          `<div class="element-badge">
            ${b.icon ? `<span class="element-badge-icon fa ${b.icon}"></span>` : ''}
            ${b.label ? `<span class="element-badge-text">${b.label}</span>` : ''}
          </div>`);

        if (b.textColor) badge.querySelector('.element-badge-text').style.color = b.textColor;
        if (b.iconColor) badge.querySelector('.element-badge-icon').style.color = b.iconColor;
        if (b.borderColor) badge.style.border = `1px solid ${b.borderColor}`;
        if (b.backgroundColor) badge.style.backgroundColor = b.backgroundColor;

        if (b.shape === 'square') {
          // nothing to do here
        } else if (b.shape === 'default') {
          badge.style.borderRadius = '0.5em';
        } else if (b.shape === 'circle') {
          badge.style.borderRadius = '100%';
        }

        const i = this._overlays.add(element, 'iterations', {
            position: position,
            html: badge,
          });

        // align badge position based on content after rendering
        if (b.position === 'TopLeft' || b.position === 'BottomLeft') {

          const {offsetWidth} = badge;
          const overlay = this._overlays.get(i);

          // TODO align position depending on shape?

          if (b.position === 'TopLeft') {
            if (b.icon) overlay.position = { top: overlay.position.top, left: overlay.position.left - offsetWidth - 5 };
            else overlay.position = { top: overlay.position.top, left: overlay.position.left - offsetWidth };
          } else if (b.position === 'BottomLeft') {
            if (b.icon) overlay.position = { bottom: overlay.position.bottom, left: overlay.position.left - offsetWidth - 5 };
            else overlay.position = { bottom: overlay.position.bottom, left: overlay.position.left - offsetWidth };
          }

          this._overlays._updateOverlay(overlay);
        }
      }
    });
  }
}

BadgeModule.$inject = [
  'canvas',
  'eventBus',
  'elementRegistry',
  'translate',
  'overlays',
  'config.component'
];