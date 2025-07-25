"use strict";

function FlipImageData(e, t, s) {
  const r = 4 * t,
    o = new Uint8Array(r),
    n = e.buffer;
  for (let e = 0, t = Math.floor(s / 2); e < t; ++e) {
    const t = s - e - 1,
      a = new Uint8Array(n, e * r, r),
      l = new Uint8Array(n, t * r, r);
    o.set(a), a.set(l), l.set(o)
  }
}

function UnpremultiplyImageData(e) {
  for (let t = 0, s = e.length; t < s; t += 4) {
    const s = e[t + 3];
    if (255 === s) continue;
    const r = 255 / s;
    e[t] *= r, e[t + 1] *= r, e[t + 2] *= r
  }
}

function SendReady() {
  self.dispatchPort.postMessage({
    "type": "ready"
  }), self.outputPort.postMessage({
    "type": "ready"
  })
}

function SendError(e, t) {
  e || self.outputPort.postMessage({
    "type": "error",
    "jobId": self.activeJobId,
    "error": t.toString()
  }), SendDone()
}

function SendResult(e, t) {
  if (!e) {
    const e = t.transferables || [];
    self.outputPort.postMessage({
      "type": "result",
      "jobId": self.activeJobId,
      "result": t.result
    }, e)
  }
  SendDone()
}

function SendDone() {
  self.activeJobId = null, self.dispatchPort.postMessage({
    "type": "done"
  })
}

function SendProgress(e) {
  self.outputPort.postMessage({
    "type": "progress",
    "jobId": self.activeJobId,
    "progress": e
  })
}

function OnDispatchWorkerMessage(e) {
  const t = e.data,
    s = t["type"];
  if ("_import_scripts" === s) return void importScripts(...t["scripts"]);
  if ("_send_blob" === s) return void self.sentBlobs.set(t["id"], t["blob"]);
  if ("_send_buffer" === s) return void self.sentBuffers.set(t["id"], t["buffer"]);
  if ("_ready" === s) return void SendReady();
  const r = t["jobId"],
    o = t["isBroadcast"],
    n = t["params"];
  let a;
  if (self.activeJobId = r, self.JobHandlers.hasOwnProperty(s)) {
    try {
      a = self.JobHandlers[s](n)
    } catch (e) {
      return void SendError(o, "Exception in job handler: " + e)
    }
    a && a.then ? a.then((e => SendResult(o, e))).catch((e => SendError(o, "Rejection in job handler: " + e))) : SendResult(o, a)
  } else console.error(`no handler for message type '${s}'`)
}
self.dispatchPort = null, self.outputPort = null, self.workerNumber = -1, self.activeJobId = null, self.sentBlobs = new Map, self.sentBuffers = new Map, self.JobHandlers = {}, self.JobHandlers["ProcessImageData"] = function(e) {
  const t = e["buffer"],
    s = new Uint8Array(t),
    r = e["width"],
    o = e["height"];
  return e["flipY"] && FlipImageData(s, r, o), e["unpremultiply"] && UnpremultiplyImageData(s), {
    result: t,
    transferables: [t]
  }
}, self.addEventListener("message", (e => {
  const t = e.data,
    s = t["type"];
  switch (s) {
    case "init":
      return self.workerNumber = t["number"], self.dispatchPort = t["dispatch-port"], self.dispatchPort.onmessage = OnDispatchWorkerMessage, void(self.outputPort = t["output-port"]);
    case "terminate":
      return void self.close();
    default:
      return void console.error("unknown message '" + s + "'")
  }
}));