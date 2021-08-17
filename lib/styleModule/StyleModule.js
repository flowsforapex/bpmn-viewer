export default function StyleModule(overlays) {
  this._overlays = overlays;
}

StyleModule.$inject = ['overlays'];

StyleModule.prototype.addStylesToElements = function (elements, css) {
  for (const e of elements) {
    var rect = document.querySelector(
      `g[data-element-id="${e}"]:not(.djs-connection) .djs-visual > :nth-child(1)`
    );

    if (rect) {
      for (const c in css) {
        rect.style[c] = css[c];
      }
    }
  }
};

StyleModule.prototype.showRunningInstanceCounters = function (
  elements,
  showHeatmap
) {
  var overlays = this._overlays;

  for (const element in elements) {
    overlays.add(element, {
      position: {
        top: 3,
        right: -5,
      },
      html: `<div class="instance_counter running"><i class="counter_icon fa fa-gear"></i>${elements[element]}</div>`,
    });

    if (showHeatmap) {
      overlays.add(element, {
        position: {
          top: 0,
          left: 0,
        },
        html: '<div class="heatmap_area running"></div>',
        // html: `<div class="heatmap_area running" style="-webkit-box-shadow:${getShadow(
        //   elements[element]
        // )}"></div>`,
      });
    }
  }
};

StyleModule.prototype.showErrorInstanceCounters = function (
  elements,
  showHeatmap
) {
  var overlays = this._overlays;

  for (const element in elements) {
    overlays.add(element, {
      position: {
        bottom: 35,
        right: -5,
      },
      html: `<div class="instance_counter error"><i class="counter_icon fa fa-warning"></i>${elements[element]}</div>`,
    });

    if (showHeatmap) {
      overlays.add(element, {
        position: {
          top: 40,
          left: 0,
        },
        html: '<div class="heatmap_area error"></div>',
        // html: `<div class="heatmap_area error" style="-webkit-box-shadow:${getShadow(
        //   elements[element]
        // )}"></div>`,
      });
    }
  }
};

function getShadow(counter) {
  console.log(counter);
  if (counter > 0) {
    var shadowWidth = counter * 10;
    // if (counter > 0 && counter <= 1) return '0px 0px 0px 0px #FF0000';
    // else if (counter > 1 && counter <= 2) return '0px 0px 25px 0px #FF0000';
    // else if (counter > 2 && counter <= 3) return '0px 0px 50px 0px #FF0000';
    return `0px 0px ${shadowWidth}px 0px`;
  }
}
