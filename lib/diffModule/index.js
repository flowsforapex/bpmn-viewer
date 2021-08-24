import { diff } from 'bpmn-js-differ';
import BpmnModdle from 'bpmn-moddle';

export default async function diffModels(first, second) {
  const { rootElement: definitions1 } = await new BpmnModdle().fromXML(first);
  const { rootElement: definitions2 } = await new BpmnModdle().fromXML(second);

  var changes = diff(definitions1, definitions2);

  for (const c in changes._changed) {
    console.log(changes._changed[c].attrs);

    var rect = document.querySelectorAll(
      `g[data-element-id="${c}"]:not(.djs-connection) .djs-visual > :nth-child(1)`
    );
    if (rect) {
      rect.forEach(r => (r.style.fill = 'yellow'));
    }
  }

  for (const c in changes._added) {
    var rect = document.querySelectorAll(
      `g[data-element-id="${c}"]:not(.djs-connection) .djs-visual > :nth-child(1)`
    );
    if (rect) {
      rect.forEach(r => (r.style.fill = 'green'));
    }
  }

  for (const c in changes._removed) {
    var rect = document.querySelectorAll(
      `g[data-element-id="${c}"]:not(.djs-connection) .djs-visual > :nth-child(1)`
    );
    if (rect) {
      rect.forEach(r => (r.style.fill = 'red'));
    }
  }
}
