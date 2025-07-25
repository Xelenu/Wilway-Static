"use strict";
{
  class s {
    constructor() {
      this._broadcastChannel = "undefined" == typeof BroadcastChannel ? null : new BroadcastChannel("offline"), this._queuedMessages = [], this._onMessageCallback = null, this._broadcastChannel && (this._broadcastChannel.onmessage = s => this._OnBroadcastChannelMessage(s))
    }
    _OnBroadcastChannelMessage(s) {
      this._onMessageCallback ? this._onMessageCallback(s) : this._queuedMessages.push(s)
    }
    SetMessageCallback(s) {
      this._onMessageCallback = s;
      for (let s of this._queuedMessages) this._onMessageCallback(s);
      this._queuedMessages.length = 0
    }
  }
  window.OfflineClientInfo = new s
}