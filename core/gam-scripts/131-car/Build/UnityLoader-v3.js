async function fetchAndCombineParts(baseUrl, numParts) {
  const parts = [];
  for (let i = 0; i < numParts; i++) {
    const url = `${baseUrl}.${String(i).padStart(3, '0')}.part`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Missing part: ${url}`);
    parts.push(new Uint8Array(await res.arrayBuffer()));
  }
  const totalLength = parts.reduce((sum, arr) => sum + arr.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of parts) {
    merged.set(arr, offset);
    offset += arr.length;
  }
  return merged.buffer;
}

(async () => {
  const dataParts = 5;
  const wasmParts = 5;
  const dataBase = '/core/gam-scripts/131-car/Build/WebGL.data.unityweb';
  const wasmBase = '/core/gam-scripts/131-car/Build/WebGL.wasm.code.unityweb';
  const [dataBuffer, wasmBuffer] = await Promise.all([
    fetchAndCombineParts(dataBase, dataParts),
    fetchAndCombineParts(wasmBase, wasmParts)
  ]);
  const realFetch = window.fetch.bind(window);
  window.fetch = function(resource, options) {
    if (typeof resource === 'string' && resource.endsWith('WebGL.data.unityweb')) {
      return Promise.resolve(new Response(dataBuffer));
    }
    if (typeof resource === 'string' && resource.endsWith('WebGL.wasm.code.unityweb')) {
      return Promise.resolve(new Response(wasmBuffer));
    }
    return realFetch(resource, options);
  };
  const unityScript = document.createElement('script');
  unityScript.src = '/core/gam-scripts/131-car/Build/UnityLoader-v3.js';
  document.body.appendChild(unityScript);
})();
