"use strict";
! function() {
  let p = !0;
  "pass" !== (new class {
    #p = "pass";
    getProp() {
      return this.#p
    }
  }).getProp() && (p = !1), p && (window["C3_ModernJSSupport_OK"] = !0)
}();