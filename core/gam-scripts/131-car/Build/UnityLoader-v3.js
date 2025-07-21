function fetchAndCombineParts(baseUrl, numParts) {
  return new Promise(async (resolve, reject) => {
    try {
      const parts = [];
      for (let i = 0; i < numParts; i++) {
        const url = baseUrl + "." + ("00" + i).slice(-3) + ".part";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Missing part: " + url);
        parts.push(new Uint8Array(await res.arrayBuffer()));
      }
      const totalLength = parts.reduce((sum, arr) => sum + arr.length, 0);
      const merged = new Uint8Array(totalLength);
      let offset = 0;
      for (const arr of parts) {
        merged.set(arr, offset);
        offset += arr.length;
      }
      resolve(merged.buffer);
    } catch (e) {
      reject(e);
    }
  });
}

const dataBase = '/core/gam-scripts/131-car/Build/WebGL.data.unityweb';
const wasmBase = '/core/gam-scripts/131-car/Build/WebGL.wasm.code.unityweb';
const dataParts = 5;
const wasmParts = 2;

const realFetch = window.fetch.bind(window);
window.fetch = function(resource, options) {
  if (typeof resource === 'string' && resource.endsWith('WebGL.data.unityweb')) {
    return fetchAndCombineParts(dataBase, dataParts).then(buffer => new Response(buffer));
  }
  if (typeof resource === 'string' && resource.endsWith('WebGL.wasm.code.unityweb')) {
    return fetchAndCombineParts(wasmBase, wasmParts).then(buffer => new Response(buffer));
  }
  return realFetch(resource, options);
};
