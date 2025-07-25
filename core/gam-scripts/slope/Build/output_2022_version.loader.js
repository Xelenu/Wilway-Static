function createUnityInstance(r, n, l) {
  function s(e, r) {
    if (!s.aborted && n.showBanner) return "error" == r && (s.aborted = !0), n.showBanner(e, r);
    switch (r) {
      case "error":
        console.error(e);
        break;
      case "warning":
        console.warn(e);
        break;
      default:
        console.log(e)
    }
  }

  function t(e) {
    var r = e.reason || e.error,
      n = r ? r.toString() : e.message || e.reason || "",
      t = r && r.stack ? r.stack.toString() : "";
    (n += "\n" + (t = t.startsWith(n) ? t.substring(n.length) : t).trim()) && c.stackTraceRegExp && c.stackTraceRegExp.test(n) && g(n, e.filename || r && (r.fileName || r.sourceURL) || "", e.lineno || r && (r.lineNumber || r.line) || 0)
  }

  function e(e, r, n) {
    var t = e[r];
    void 0 !== t && t || (console.warn('Config option "' + r + '" is missing or empty. Falling back to default value: "' + n + '". Consider updating your WebGL template to include the missing config option.'), e[r] = n)
  }
  l = l || function() {};
  var o, c = {
    canvas: r,
    webglContextAttributes: {
      preserveDrawingBuffer: !1,
      powerPreference: 2
    },
    streamingAssetsUrl: "StreamingAssets",
    downloadProgress: {},
    deinitializers: [],
    intervals: {},
    setInterval: function(e, r) {
      e = window.setInterval(e, r);
      return this.intervals[e] = !0, e
    },
    clearInterval: function(e) {
      delete this.intervals[e], window.clearInterval(e)
    },
    preRun: [],
    postRun: [],
    print: function(e) {
      console.log(e)
    },
    printErr: function(e) {
      console.error(e), "string" == typeof e && -1 != e.indexOf("wasm streaming compile failed") && (-1 != e.toLowerCase().indexOf("mime") ? s('HTTP Response Header "Content-Type" configured incorrectly on the server for file ' + c.codeUrl + ' , should be "application/wasm". Startup time performance will suffer.', "warning") : s('WebAssembly streaming compilation failed! This can happen for example if "Content-Encoding" HTTP header is incorrectly enabled on the server for file ' + c.codeUrl + ", but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.", "warning"))
    },
    locateFile: function(e) {
      return "build.wasm" == e ? this.codeUrl : e
    },
    disabledCanvasEvents: ["contextmenu", "dragstart"]
  };
  for (o in e(n, "companyName", "Unity"), e(n, "productName", "WebGL Player"), e(n, "productVersion", "1.0"), n) c[o] = n[o];
  c.streamingAssetsUrl = new URL(c.streamingAssetsUrl, document.URL).href;
  var a = c.disabledCanvasEvents.slice();

  function i(e) {
    e.preventDefault()
  }
  a.forEach(function(e) {
    r.addEventListener(e, i)
  }), window.addEventListener("error", t), window.addEventListener("unhandledrejection", t);
  var d = "",
    u = "";

  function f(e) {
    document.webkitCurrentFullScreenElement === r ? r.style.width && (d = r.style.width, u = r.style.height, r.style.width = "100%", r.style.height = "100%") : d && (r.style.width = d, r.style.height = u, u = d = "")
  }
  document.addEventListener("webkitfullscreenchange", f), c.deinitializers.push(function() {
    for (var e in c.disableAccessToMediaDevices(), a.forEach(function(e) {
        r.removeEventListener(e, i)
      }), window.removeEventListener("error", t), window.removeEventListener("unhandledrejection", t), document.removeEventListener("webkitfullscreenchange", f), c.intervals) window.clearInterval(e);
    c.intervals = {}
  }), c.QuitCleanup = function() {
    for (var e = 0; e < c.deinitializers.length; e++) c.deinitializers[e]();
    c.deinitializers = [], "function" == typeof c.onQuit && c.onQuit()
  };
  var h = {
    Module: c,
    SetFullscreen: function() {
      if (c.SetFullscreen) return c.SetFullscreen.apply(c, arguments);
      c.print("Failed to set Fullscreen mode: Player not loaded yet.")
    },
    SendMessage: function() {
      if (c.SendMessage) return c.SendMessage.apply(c, arguments);
      c.print("Failed to execute SendMessage: Player not loaded yet.")
    },
    Quit: function() {
      return new Promise(function(e, r) {
        c.shouldQuit = !0, c.onQuit = e
      })
    },
    GetMemoryInfo: function() {
      var e = c._getMemInfo();
      return {
        totalWASMHeapSize: c.HEAPU32[e >> 2],
        usedWASMHeapSize: c.HEAPU32[1 + (e >> 2)],
        totalJSHeapSize: c.HEAPF64[1 + (e >> 3)],
        usedJSHeapSize: c.HEAPF64[2 + (e >> 3)]
      }
    }
  };

  function g(e, r, n) {
    -1 == e.indexOf("fullscreen error") && (c.startupErrorHandler ? c.startupErrorHandler(e, r, n) : c.errorHandler && c.errorHandler(e, r, n) || (console.log("Invoking error handler due to\n" + e), "function" == typeof dump && dump("Invoking error handler due to\n" + e), g.didShowErrorMessage || (-1 != (e = "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" + e).indexOf("DISABLE_EXCEPTION_CATCHING") ? e = "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace." : -1 != e.indexOf("Cannot enlarge memory arrays") ? e = "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings." : -1 == e.indexOf("Invalid array buffer length") && -1 == e.indexOf("Invalid typed array length") && -1 == e.indexOf("out of memory") && -1 == e.indexOf("could not allocate memory") || (e = "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."), alert(e), g.didShowErrorMessage = !0)))
  }

  function p(e, r) {
    if ("symbolsUrl" != e) {
      var n = c.downloadProgress[e],
        t = (n = n || (c.downloadProgress[e] = {
          started: !1,
          finished: !1,
          lengthComputable: !1,
          total: 0,
          loaded: 0
        }), "object" != typeof r || "progress" != r.type && "load" != r.type || (n.started || (n.started = !0, n.lengthComputable = r.lengthComputable), n.total = r.total, n.loaded = r.loaded, "load" == r.type && (n.finished = !0)), 0),
        o = 0,
        a = 0,
        i = 0,
        s = 0;
      for (e in c.downloadProgress) {
        if (!(n = c.downloadProgress[e]).started) return;
        a++, n.lengthComputable ? (t += n.loaded, o += n.total, i++) : n.finished || s++
      }
      l(.9 * (a ? (a - s - (o ? i * (o - t) / o : 0)) / a : 0))
    }
  }

  function m() {
    new Promise(function(a, e) {
      var i = document.createElement("script");
      i.src = c.frameworkUrl, i.onload = function() {
        if ("undefined" == typeof unityFramework || !unityFramework) {
          var e, r = [
            ["br", "br"],
            ["gz", "gzip"]
          ];
          for (e in r) {
            var n, t = r[e];
            if (c.frameworkUrl.endsWith("." + t[0])) return n = "Unable to parse " + c.frameworkUrl + "!", "file:" == location.protocol ? void s(n + " Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.", "error") : (n += ' This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: ' + t[1] + '" present. Check browser Console and Devtools Network tab to debug.', "br" == t[0] && "http:" == location.protocol && (t = -1 != ["localhost", "127.0.0.1"].indexOf(location.hostname) ? "" : "Migrate your server to use HTTPS.", n = /Firefox/.test(navigator.userAgent) ? "Unable to parse " + c.frameworkUrl + '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported in Firefox over HTTP connections. ' + t + ' See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1670675">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information.' : "Unable to parse " + c.frameworkUrl + '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.'), void s(n, "error"))
          }
          s("Unable to parse " + c.frameworkUrl + "! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)", "error")
        }
        var o = unityFramework;
        unityFramework = null, i.onload = null, a(o)
      }, i.onerror = function(e) {
        s("Unable to load file " + c.frameworkUrl + "! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)", "error")
      }, document.body.appendChild(i), c.deinitializers.push(function() {
        document.body.removeChild(i)
      })
    }).then(function(e) {
      e(c)
    });
    p(n = "dataUrl"), e = c.fetchWithProgress, r = c[n], r = /file:\/\//.exec(r) ? "same-origin" : void 0;
    var n, e, r, t = e(c[n], {
      method: "GET",
      companyName: c.companyName,
      productName: c.productName,
      productVersion: c.productVersion,
      control: "no-store",
      mode: r,
      onProgress: function(e) {
        p(n, e)
      }
    }).then(function(e) {
      return e.parsedBody
    }).catch(function(e) {
      var r = "Failed to download file " + c[n];
      "file:" == location.protocol ? s(r + ". Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.", "error") : console.error(r)
    });
    c.preRun.push(function() {
      c.addRunDependency("dataUrl"), t.then(function(e) {
        var r = new DataView(e.buffer, e.byteOffset, e.byteLength),
          n = 0,
          t = "UnityWebData1.0\0";
        if (!String.fromCharCode.apply(null, e.subarray(n, n + t.length)) == t) throw "unknown data format";
        var o = r.getUint32(n += t.length, !0);
        for (n += 4; n < o;) {
          var a = r.getUint32(n, !0),
            i = (n += 4, r.getUint32(n, !0)),
            s = (n += 4, r.getUint32(n, !0)),
            l = (n += 4, String.fromCharCode.apply(null, e.subarray(n, n + s)));
          n += s;
          for (var d = 0, u = l.indexOf("/", d) + 1; 0 < u; d = u, u = l.indexOf("/", d) + 1) c.FS_createPath(l.substring(0, d), l.substring(d, u - 1), !0, !0);
          c.FS_createDataFile(l, null, e.subarray(a, a + i), !0, !0, !0)
        }
        c.removeRunDependency("dataUrl")
      })
    })
  }
  return c.SystemInfo = function() {
    var e, r, n, t, o = navigator.userAgent + " ",
      a = [
        ["Firefox", "Firefox"],
        ["OPR", "Opera"],
        ["Edg", "Edge"],
        ["SamsungBrowser", "Samsung Browser"],
        ["Trident", "Internet Explorer"],
        ["MSIE", "Internet Explorer"],
        ["Chrome", "Chrome"],
        ["CriOS", "Chrome on iOS Safari"],
        ["FxiOS", "Firefox on iOS Safari"],
        ["Safari", "Safari"]
      ];

    function i(e, r, n) {
      return (e = RegExp(e, "i").exec(r)) && e[n]
    }
    for (var s = 0; s < a.length; ++s)
      if (r = i(a[s][0] + "[/ ](.*?)[ \\)]", o, 1)) {
        e = a[s][1];
        break
      }
    "Safari" == e && (r = i("Version/(.*?) ", o, 1)), "Internet Explorer" == e && (r = i("rv:(.*?)\\)? ", o, 1) || r);
    for (var l = [
        ["Windows (.*?)[;)]", "Windows"],
        ["Android ([0-9_.]+)", "Android"],
        ["iPhone OS ([0-9_.]+)", "iPhoneOS"],
        ["iPad.*? OS ([0-9_.]+)", "iPadOS"],
        ["FreeBSD( )", "FreeBSD"],
        ["OpenBSD( )", "OpenBSD"],
        ["Linux|X11()", "Linux"],
        ["Mac OS X ([0-9_\\.]+)", "MacOS"],
        ["bot|google|baidu|bing|msn|teoma|slurp|yandex", "Search Bot"]
      ], d = 0; d < l.length; ++d)
      if (u = i(l[d][0], o, 1)) {
        n = l[d][1], u = u.replace(/_/g, ".");
        break
      } var u = {
        "NT 5.0": "2000",
        "NT 5.1": "XP",
        "NT 5.2": "Server 2003",
        "NT 6.0": "Vista",
        "NT 6.1": "7",
        "NT 6.2": "8",
        "NT 6.3": "8.1",
        "NT 10.0": "10"
      } [u] || u,
      c = ((c = document.createElement("canvas")) && (gl = c.getContext("webgl2"), glVersion = gl ? 2 : 0, gl || (gl = c && c.getContext("webgl")) && (glVersion = 1), gl && (t = gl.getExtension("WEBGL_debug_renderer_info") && gl.getParameter(37446) || gl.getParameter(7937))), "undefined" != typeof SharedArrayBuffer),
      f = "object" == typeof WebAssembly && "function" == typeof WebAssembly.compile;
    return {
      width: screen.width,
      height: screen.height,
      userAgent: o.trim(),
      browser: e || "Unknown browser",
      browserVersion: r || "Unknown version",
      mobile: /Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),
      os: n || "Unknown OS",
      osVersion: u || "Unknown OS Version",
      gpu: t || "Unknown GPU",
      language: navigator.userLanguage || navigator.language,
      hasWebGL: glVersion,
      hasCursorLock: !!document.body.requestPointerLock,
      hasFullscreen: !!document.body.requestFullscreen || !!document.body.webkitRequestFullscreen,
      hasThreads: c,
      hasWasm: f,
      hasWasmThreads: !1
    }
  }(), c.abortHandler = function(e) {
    return g(e, "", 0), !0
  }, Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50), c.readBodyWithProgress = function(a, i, s) {
    var e = a.body ? a.body.getReader() : void 0,
      l = void 0 !== a.headers.get("Content-Length"),
      d = function(e, r) {
        if (!r) return 0;
        var r = e.headers.get("Content-Encoding"),
          n = parseInt(e.headers.get("Content-Length"));
        switch (r) {
          case "br":
            return Math.round(5 * n);
          case "gzip":
            return Math.round(4 * n);
          default:
            return n
        }
      }(a, l),
      u = new Uint8Array(d),
      c = [],
      f = 0,
      h = 0;
    return l || console.warn("[UnityCache] Response is served without Content-Length header. Please reconfigure server to include valid Content-Length for better download performance."),
      function o() {
        return void 0 === e ? a.arrayBuffer().then(function(e) {
          var r = new Uint8Array(e);
          return i({
            type: "progress",
            response: a,
            total: e.length,
            loaded: 0,
            lengthComputable: l,
            chunk: s ? r : null
          }), r
        }) : e.read().then(function(e) {
          if (e.done) {
            if (f === d) return u;
            if (f < d) return u.slice(0, f);
            for (var r = new Uint8Array(f), n = (r.set(u, 0), h), t = 0; t < c.length; ++t) r.set(c[t], n), n += c[t].length;
            return r
          }
          return f + e.value.length <= u.length ? (u.set(e.value, f), h = f + e.value.length) : c.push(e.value), f += e.value.length, i({
            type: "progress",
            response: a,
            total: Math.max(d, f),
            loaded: f,
            lengthComputable: l,
            chunk: s ? e.value : null
          }), o()
        })
      }().then(function(e) {
        return i({
          type: "load",
          response: a,
          total: e.length,
          loaded: e.length,
          lengthComputable: l,
          chunk: null
        }), a.parsedBody = e, a
      })
  }, c.fetchWithProgress = function(e, r) {
    var n = function() {};
    return r && r.onProgress && (n = r.onProgress), fetch(e, r).then(function(e) {
      return c.readBodyWithProgress(e, n, r.enableStreamingDownload)
    })
  }, new Promise(function(e, r) {
    var n;
    c.SystemInfo.hasWebGL ? 1 == c.SystemInfo.hasWebGL ? (n = 'Your browser does not support graphics API "WebGL 2" which is required for this content.', "Safari" == c.SystemInfo.browser && parseInt(c.SystemInfo.browserVersion) < 15 && (c.SystemInfo.mobile || 1 < navigator.maxTouchPoints ? n += "\nUpgrade to iOS 15 or later." : n += "\nUpgrade to Safari 15 or later."), r(n)) : c.SystemInfo.hasWasm ? (c.startupErrorHandler = r, l(0), c.postRun.push(function() {
      l(1), delete c.startupErrorHandler, e(h)
    }), m()) : r("Your browser does not support WebAssembly.") : r("Your browser does not support WebGL.")
  })
}