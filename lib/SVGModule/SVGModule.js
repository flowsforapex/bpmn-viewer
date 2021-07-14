
export default function SVGModule() {
}

SVGModule.prototype.addStyles = function(svg, css) {

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(svg, "text/xml");

    var def = xmlDoc.getElementsByTagName("defs");

    if (def.length > 0) {
        var style = document.createElement('style');
        def[0].appendChild(style);
        style.appendChild(document.createTextNode(css));
    }

    return new XMLSerializer().serializeToString(xmlDoc);
}
