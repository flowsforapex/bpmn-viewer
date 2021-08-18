import { diff } from 'bpmn-js-differ';
import BpmnModdle from 'bpmn-moddle';

export default async function diffModels(first, second) {
  const { rootElement: definitions1 } = await new BpmnModdle().fromXML(first);
  const { rootElement: definitions2 } = await new BpmnModdle().fromXML(second);

  var changes = diff(definitions1, definitions2);
  console.log(changes._changed);
}
