
import { domify } from 'min-dom';

export default function RightClickModule(
  canvas, eventBus, translate
) {
  this._canvas = canvas;
  this._eventBus = eventBus;
  this._translate = translate;

  var _self = this;

  // create and append context menu container
  this._menu = domify('<div id="context-menu"></div>');
  this._options = domify('<ul class="menu-options"></ul>');
  
  this._menu.appendChild(this._options);
  
  canvas.getContainer().appendChild(this._menu);

  this.closeContextMenu();

  eventBus.on('element.contextmenu', (event) => {
    event.preventDefault();
    event.stopPropagation();

    _self.openContextMenu(event);
  });

  eventBus.on('element.click', (event) => {
    _self.closeContextMenu(event);
  });
}

RightClickModule.prototype.openContextMenu = function (event) {

  const { element } = event;
  const { id } = element;

  const x = event.originalEvent.pageX;
  const y = event.originalEvent.pageY;

  const contextMenuData = this._widget.contextMenuData[id];

  if (contextMenuData) {

    this._options.replaceChildren(
      ...contextMenuData.map((d) => {
        if (d.type === 'link') {
          return domify(`<li class="menu-option"><a href="${d.url}" target="${d.target}">${d.label}</a></li>`);
        }
        return null;
      }) 
    );

    this._menu.style.left = `${x}px`;
    this._menu.style.top = `${y}px`;

    this._menu.style.display = 'block';
  } else {
    this.closeContextMenu();
  }
};

RightClickModule.prototype.closeContextMenu = function () {
  this._menu.style.display = 'none';
};

RightClickModule.prototype.setWidget = function (widget) {
  this._widget = widget;
};

RightClickModule.$inject = ['canvas', 'eventBus', 'translate'];