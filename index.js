import BpmnJS from "bpmn-js";

async function init() {
  // viewer instance
  var bpmnViewer = new BpmnJS({
    container: "#canvas",
  });

  async function openDiagram(bpmnXML) {
    // import diagram
    try {
      await bpmnViewer.importXML(bpmnXML);

      // access viewer components
      var canvas = bpmnViewer.get("canvas");
      var overlays = bpmnViewer.get("overlays");

      // zoom to fit full viewport
      canvas.zoom("fit-viewport");
    } catch (err) {
      console.error("could not import BPMN 2.0 diagram", err);
    }
  }

  var client = new XMLHttpRequest();
  client.open("GET", "/diagram.txt");
  client.onreadystatechange = function () {
    openDiagram(client.responseText);
  };

  client.send();
}

init();
