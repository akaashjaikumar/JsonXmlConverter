document.addEventListener("DOMContentLoaded", function () {
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const convertButton = document.getElementById("convertButton");

  convertButton.addEventListener("click", function () {
    const input = inputText.value;

    try {
      if (input.trim().startsWith('{')) {
        // JSON to XML
        const jsonObj = JSON.parse(input);
        const xmlStr = convertJsonToXml(jsonObj);
        outputText.value = xmlStr;
      } else if (input.trim().startsWith('<')) {
        // XML to JSON
        const xmlDoc = new DOMParser().parseFromString(input, "text/xml");
        const jsonStr = convertXmlToJson(xmlDoc);
        outputText.value = jsonStr;
      } else {
        outputText.value = "Invalid input. Please provide valid JSON or XML.";
      }
    } catch (error) {
      console.error("Conversion error:", error);
      outputText.value = "Conversion error: " + error.message;
    }
  });

  function convertJsonToXml(obj) {
    return jsonToXml(obj, "root");
  }

  function jsonToXml(obj, tagName) {
    let xml = `<${tagName}>\n`;

    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        xml += jsonToXml(item, tagName) + "\n";
      });
    } else if (typeof obj === "object") {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          xml += jsonToXml(obj[key], key) + "\n";
        }
      }
    } else {
      xml += `${obj}\n`;
    }

    xml += `</${tagName}>`;
    return xml;
  }

  function convertXmlToJson(xml) {
    const xmlDoc = xml.documentElement;
    const jsonObj = xmlToJson(xmlDoc);

    return JSON.stringify(jsonObj, null, 2);
  }

  function xmlToJson(xml) {
    if (xml.nodeType == Node.ELEMENT_NODE) {
      const obj = {};
      if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
          const item = xml.childNodes[i];
          if (item.nodeType == Node.ELEMENT_NODE) {
            if (typeof obj[item.nodeName] == "undefined") {
              obj[item.nodeName] = xmlToJson(item);
            } else {
              if (typeof obj[item.nodeName].push == "undefined") {
                const old = obj[item.nodeName];
                obj[item.nodeName] = [];
                obj[item.nodeName].push(old);
              }
              obj[item.nodeName].push(xmlToJson(item));
            }
          } else if (item.nodeType == Node.TEXT_NODE && item.nodeValue.trim() !== "") {
            obj[item.nodeName] = item.textContent.trim();
          }
        }
      }
      return obj;
    } else if (xml.nodeType == Node.TEXT_NODE && xml.nodeValue.trim() !== "") {
      return xml.nodeValue.trim();
    }
  }
});
