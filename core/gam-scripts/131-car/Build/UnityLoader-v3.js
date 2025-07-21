function fetchAndCombineParts(baseUrl, numParts) {
  return new Promise(function(resolve, reject) {
    var parts = [];
    var totalLength = 0;
    var loaded = 0;
    function loadPart(i) {
      if (i >= numParts) {
        const dataBase = '/core/gam-scripts/131-car/Build/WebGL.data.unityweb';
const wasmBase = '/core/gam-scripts/131-car/Build/WebGL.wasm.code.unityweb';
const dataParts = 5;
const wasmParts = 2;

const realFetch = window.fetch.bind(window);
window.fetch = function(resource, options) {
  if (typeof resource === 'string' && resource.endsWith('WebGL.data.unityweb')) {
    return fetchAndCombineParts(dataBase, dataParts).then(function(buffer) { return new Response(buffer); });
  }
  if (typeof resource === 'string' && resource.endsWith('WebGL.wasm.code.unityweb')) {
    return fetchAndCombineParts(wasmBase, wasmParts).then(function(buffer) { return new Response(buffer); });
  }
  return realFetch(resource, options);
};
        var merged = new Uint8Array(totalLength);
        var offset = 0;
        for (var j = 0; j < numParts; j++) {
          merged.set(parts[j], offset);
          offset += parts[j].length;
        }
        resolve(merged.buffer);
        return;
      }
      var url = baseUrl + "." + ("00" + i).slice(-3) + ".part";
      fetch(url).then(function(res) {
        if (!res.ok) throw new Error("Missing part: " + url);
        return res.arrayBuffer();
      }).then(function(buf) {
        var arr = new Uint8Array(buf);
        parts[i] = arr;
        totalLength += arr.length;
        loadPart(i + 1);
      }).catch(function(err) {
        reject(err);
      });
    }
    loadPart(0);
  });
}
