/* Module for zooming into a Subprocess*/
// import CoreModule from './bpmn-viewer.js';

var spViewModule = {
  __depends__: [],
  __init__: ['sPViewModule'],
  sPViewModule: ['type', SPViewModule],
};

SPViewModule.$inject = ['eventBus'];

function SPViewModule(eventBus) {
  var currentExpandedProcess;
  var previousTextStyle;
  var previousIconStyle;
  var previousRectStyle;

  var isExpanded;
  var originalWidth;
  var originalHeight;
  var originalX = 0;
  var originalY = 0;

  var hiddenElements;

  function setProcessTextStyle(parentProcess, textStyle) {
    var previousStyle;
    var visualElements = parentProcess.getElementsByClassName('djs-visual');
    if (visualElements.length != 0) {
      var textElements = visualElements[0].getElementsByTagName('text');
      if (textElements.length != 0) {
        previousStyle = textElements[0].getAttribute('style');
        textElements[0].setAttribute('style', textStyle);
      }
    }
    return previousStyle;
  }

  function setProcessIconStyle(parentProcess, textStyle) {
    var previousStyle;
    var visualElements = parentProcess.getElementsByClassName('djs-visual');
    if (visualElements.length != 0) {
      var rectElements = visualElements[0].getElementsByTagName('rect');
      if (rectElements.length != 0) {
        previousStyle = rectElements[1].getAttribute('style');
        rectElements[1].setAttribute('style', textStyle);
      }
    }
    return previousStyle;
  }

  function setProcessIconRect(parentProcess, textStyle) {
    var previousStyle;
    var visualElements = parentProcess.getElementsByClassName('djs-visual');
    if (visualElements.length != 0) {
      var pathElements = visualElements[0].getElementsByTagName('path');
      if (pathElements.length != 0) {
        previousStyle = pathElements[0].getAttribute('style');
        pathElements[0].setAttribute('style', textStyle);
      }
    }
    return previousStyle;
  }

  function parseMatrix(matrix) {
    matrix = matrix.replace('matrix(', '');
    matrix = matrix.replace(')', '');
    return matrix.split(' ');
  }

  function difference(a, b) {
    return Math.abs(a - b);
  }

  function calculateCorrectBounds(subElements) {
    var bounds = { width: 0, height: 0, x: 0, y: 0 };
    var parentBounds = { width: 0, height: 0, x: 0, y: 0 };
    var shapeElement = subElements.parentElement ? subElements.parentElement.children[0] : null;

    // getting parent x, y with and height for later calculations
    if (shapeElement) {
      var rectElement = shapeElement.getElementsByTagName('rect');
      parentBounds.x = rectElement[0].getAttribute('x');
      parentBounds.y = rectElement[0].getAttribute('y');
      parentBounds.width = rectElement[0].getAttribute('width');
      parentBounds.height = rectElement[0].getAttribute('height');
    }

    var minX = 100000;
    var maxX = 0;
    var minY = 100000;
    var maxY = 0;

    subElements.subProcs.forEach((subElement) => {
      // looping Event type Elements that have a matrix that has to be parsed to extract coordinates
      Array.from(subElement.children).forEach((childElement) => {
        if (childElement.hasAttributes('transform')) {
          var transform = childElement.getAttribute('transform');
          if (transform != null) {
            var result = parseMatrix(transform);
            var rectElements = childElement.getElementsByTagName('rect');

            if (result.length >= 6) {
              if (rectElements.length != 0) {
                Array.from(rectElements).forEach((rectElement) => {
                  // we are applying those multipliers here so the items are not directly at the edge of the parent
                  var width =
                    parseInt(rectElement.getAttribute('width'), 10) * 2;
                  var height =
                    parseInt(rectElement.getAttribute('height'), 10) * 2;

                  if (parseInt(result[4], 10) < minX) {
                    minX = parseInt(result[4], 10);
                  }
                  if (parseInt(result[5], 10) < minY) {
                    minY = parseInt(result[5], 10);
                  }
                  if (parseInt(result[4], 10) + width > maxX) {
                    maxX = parseInt(result[4], 10) + width;
                  }
                  if (parseInt(result[5], 10) + height > maxY) {
                    maxY = parseInt(result[5], 10) + height;
                  }
                });
              }
            }
          }
        }
      });

      // looping through all the normal rects that dont have a matrix
      var tagElements = subElement.getElementsByTagName('rect');
      if (tagElements.length != 0) {
        var x = Number(tagElements[0].getAttribute('x'));
        var y = Number(tagElements[0].getAttribute('y'));

        // We are applying those multipliers here so the items are not directly at the edge of the parent
        var width = Number(tagElements[0].getAttribute('width')) * 2;
        var height = Number(tagElements[0].getAttribute('height')) * 2;

        // skip "faulty" elements that have 0, 0 as coordinates
        if (x > 0 && y > 0) {
          if (x < minX) {
            minX = x;
          }
          if (x + width > maxX) {
            maxX = x + width;
          }
          if (y < minY) {
            minY = y;
          }
          if (y + height > maxY) {
            maxY = y + height;
          }
        }
      }
    });

    // calculating width and height
    bounds.width = maxX - minX;
    bounds.height = maxY - minY;

    // parsing parentPos
    var transform = subElements.parentElement ? subElements.parentElement.children[0].getAttribute('transform') : null;
    if (transform) {
      var matrix = parseMatrix(transform);
      if (matrix.length >= 6) {
        parentBounds.x = parseInt(matrix[4], 10);
        parentBounds.y = parseInt(matrix[5], 10);
      }
    }

    var centerPointParentX = Math.abs(parentBounds.x - parentBounds.width / 2);
    var centerPointParentY = Math.abs(parentBounds.y - parentBounds.height / 2);

    var centerExtremeX = Math.abs(maxX - (maxX - minX) / 2);
    var centerExtremeY = Math.abs(maxY - (maxY - minY) / 2);

    // with this code we are checking wether the subElements are centered in the mainProc
    if (centerExtremeX != centerPointParentX) {
      // apply offset X (the offset we have to apply so the elements are centered on the X axis)
      var offsetX = difference(centerExtremeX, centerPointParentX);
      if (centerPointParentX < centerExtremeX) {
        offsetX = -offsetX;
      }
    }

    if (centerExtremeY != centerPointParentY) {
      // apply offset Y (the offset we have to apply so the elements are centered on the Y axis)
      var offsetY = difference(centerExtremeY, centerPointParentY);
      if (centerPointParentY < centerExtremeY) {
        offsetY = -offsetY;
      }
    }

    // calculating new process position (the offsets could be added here instead of moving all the subElements we would only move the parentProc)
    bounds.x = -(bounds.width / 2 - parentBounds.width / 2);
    bounds.y = -(bounds.height / 2 - parentBounds.height / 2);
    return bounds;
  }

  function setBoxBounds(subElements, originalBounds) {
    var shapeElement = subElements.parentElement ? subElements.parentElement.children[0] : null;
    if (shapeElement) {
      var rectElement = shapeElement.getElementsByTagName('rect');
      rectElement[0].setAttribute('width', originalBounds.width);
      rectElement[0].setAttribute('height', originalBounds.height);
      rectElement[0].setAttribute('x', originalBounds.x);
      rectElement[0].setAttribute('y', originalBounds.y);
    }
  }

  function getOriginalBounds(subElements) {
    var shapeElement = subElements.parentElement.getElementsByClassName(
      'djs-element djs-shape selected'
    );
    if (shapeElement.length != 0) {
      var rectElement = shapeElement[0].getElementsByTagName('rect');
      originalWidth = rectElement[0].getAttribute('width');
      originalHeight = rectElement[0].getAttribute('height');
    }
  }

  function getSubProcessElements(elementID) {
    var subElementWithParent = { subProcs: new Array(), parentElement: null };
    var djsGroupElements = document.getElementsByClassName('djs-group');
    Array.from(djsGroupElements).forEach((djsGroupElement) => {
      if (djsGroupElement.children != 0) {
        if (
          djsGroupElement.children[0].getAttribute('data-element-id') ==
          elementID
        ) {
          var tagElements = djsGroupElement.getElementsByTagName('path');
          if (tagElements.length != 0) {
            if (tagElements[0].getAttribute('data-marker') == 'sub-process') {
              subElementWithParent.parentElement = djsGroupElement;
              var djsChildrenElements =
                djsGroupElement.getElementsByClassName('djs-children');
              Array.from(djsChildrenElements).forEach((djsChildrenElement) => {
                var djsChildrenGroupElements =
                  djsChildrenElement.getElementsByClassName('djs-group');
                Array.from(djsChildrenGroupElements).forEach(
                  (djsChildrenGroupElement) => {
                    subElementWithParent.subProcs.push(djsChildrenGroupElement);
                  }
                );
              });
            }
          }
        }
      }
    });
    return subElementWithParent;
  }

  function getAllElementsInRect(left, right, top, bottom) {
    var elementsInRect = new Array();
    var layerElements = document.getElementsByClassName('layer-base');
    Array.from(layerElements[0].children).forEach((layerElement) => {
      if (layerElement.children.length != 0) {
        var transform = layerElement.children[0].getAttribute('transform');
        if (transform) {
          var matrix = parseMatrix(transform);
          if (matrix.length >= 6) {
            var x = parseInt(matrix[4], 10);
            var y = parseInt(matrix[5], 10);
            if ((x >= left && x <= right) || (y >= top && y <= bottom)) {
              var elementID =
                layerElement.children[0].getAttribute('data-element-id');
              if (
                elementID.includes('TextAnnotation') ||
                elementID.includes('Association') ||
                elementID.includes('label')
              ) {
                elementsInRect.push(layerElement.children[0]);
              }
            }
          }
        } else if (layerElement.children[0].length != 0) {
          var rectElement =
            layerElement.children[0].getElementsByTagName('rect');
          if (rectElement.length != 0) {
            var x = parseInt(rectElement[0].getAttribute('x'), 10);
            var y = parseInt(rectElement[0].getAttribute('y'), 10);
            if ((x >= left && x <= right) || (y >= top && y <= bottom)) {
              var elementID =
                layerElement.children[0].getAttribute('data-element-id');
              if (elementID.includes('Association')) {
                elementsInRect.push(layerElement.children[0]);
              }
            }
          }
        }
      }
    });
    return elementsInRect;
  }

  eventBus.on('element.click', function (event) {
    if (event.element.type == 'bpmn:SubProcess') {
      var subElements = getSubProcessElements(event.element.id);
      var testBounds = calculateCorrectBounds(subElements);

      var transform = subElements.parentElement ? subElements.parentElement.children[0].getAttribute('transform') : null;
      if (transform) {
        var matrix = parseMatrix(transform);
        if (matrix.length >= 6) {
          var x = parseInt(matrix[4], 10) + testBounds.x;
          var y = parseInt(matrix[5], 10) + testBounds.y;
          hiddenElements = getAllElementsInRect(
            x,
            x + testBounds.width,
            y,
            y + testBounds.height
          );
        }
      }

      if (subElements.subProcs != 0) {
        if (!isExpanded) {
          getOriginalBounds(subElements);
          currentExpandedProcess = subElements.parentElement;
          isExpanded = true;
          setBoxBounds(subElements, testBounds);
          previousTextStyle = setProcessTextStyle(
            subElements.parentElement,
            'fill: none;'
          );
          previousIconStyle = setProcessIconStyle(
            subElements.parentElement,
            'fill: none; stroke: none;'
          );
          previousRectStyle = setProcessIconRect(
            subElements.parentElement,
            'stroke: none;'
          );
          subElements.subProcs.forEach((subElement) => {
            subElement.lastElementChild.setAttribute(
              'style',
              'display: block;'
            );
          });

          if (hiddenElements != 0) {
            hiddenElements.forEach((hiddenElement) => {
              hiddenElement.setAttribute('style', 'display: none;');
            });
          }
        } else if (currentExpandedProcess == subElements.parentElement) {
          subElements.subProcs.forEach((subElement) => {
            subElement.lastElementChild.setAttribute('style', 'display: none;');
          });
          isExpanded = false;
          setBoxBounds(subElements, {
            width: originalWidth,
            height: originalHeight,
            x: originalX,
            y: originalY,
          });
          setProcessTextStyle(subElements.parentElement, previousTextStyle);
          setProcessIconStyle(subElements.parentElement, previousIconStyle);
          setProcessIconRect(subElements.parentElement, previousRectStyle);

          if (hiddenElements != 0) {
            hiddenElements.forEach((hiddenElement) => {
              hiddenElement.setAttribute('style', 'display: block;');
            });
          }
        }
      }
    }
  });
}

export default spViewModule;
