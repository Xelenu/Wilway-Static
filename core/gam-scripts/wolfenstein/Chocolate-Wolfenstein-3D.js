var Module = typeof Module !== "undefined" ? Module : {};
if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
    Module.finishedDataFileDownloads = 0
}
Module.expectedDataFileDownloads++;
((function() {
    var loadPackage = (function(metadata) {
        var PACKAGE_PATH;
        if (typeof window === "object") {
            PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/")
        } else if (typeof location !== "undefined") {
            PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/")
        } else {
            throw "using preloaded data can only be done on a web page or in a web worker"
        }
        var PACKAGE_NAME = "Chocolate-Wolfenstein-3D.data";
        var REMOTE_PACKAGE_BASE = "/core/gam-scripts/wolfenstein/Chocolate-Wolfenstein-3D.data";
        if (typeof Module["locateFilePackage"] === "function" && !Module["locateFile"]) {
            Module["locateFile"] = Module["locateFilePackage"];
            err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")
        }
        var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
        var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
        var PACKAGE_UUID = metadata.package_uuid;

        function fetchRemotePackage(packageName, packageSize, callback, errback) {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", packageName, true);
            xhr.responseType = "arraybuffer";
            xhr.onprogress = (function(event) {
                var url = packageName;
                var size = packageSize;
                if (event.total) size = event.total;
                if (event.loaded) {
                    if (!xhr.addedTotal) {
                        xhr.addedTotal = true;
                        if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
                        Module.dataFileDownloads[url] = {
                            loaded: event.loaded,
                            total: size
                        }
                    } else {
                        Module.dataFileDownloads[url].loaded = event.loaded
                    }
                    var total = 0;
                    var loaded = 0;
                    var num = 0;
                    for (var download in Module.dataFileDownloads) {
                        var data = Module.dataFileDownloads[download];
                        total += data.total;
                        loaded += data.loaded;
                        num++
                    }
                    total = Math.ceil(total * Module.expectedDataFileDownloads / num);
                    if (Module["setStatus"]) Module["setStatus"]("Downloading data... (" + loaded + "/" + total + ")")
                } else if (!Module.dataFileDownloads) {
                    if (Module["setStatus"]) Module["setStatus"]("Downloading data...")
                }
            });
            xhr.onerror = (function(event) {
                throw new Error("NetworkError for: " + packageName)
            });
            xhr.onload = (function(event) {
                if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || xhr.status == 0 && xhr.response) {
                    var packageData = xhr.response;
                    callback(packageData)
                } else {
                    throw new Error(xhr.statusText + " : " + xhr.responseURL)
                }
            });
            xhr.send(null)
        }

        function handleError(error) {
            console.error("package error:", error)
        }
        var fetchedCallback = null;
        var fetched = Module["getPreloadedPackage"] ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;
        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, (function(data) {
            if (fetchedCallback) {
                fetchedCallback(data);
                fetchedCallback = null
            } else {
                fetched = data
            }
        }), handleError);

        function runWithFS() {
            function assert(check, msg) {
                if (!check) throw msg + (new Error).stack
            }

            function DataRequest(start, end, audio) {
                this.start = start;
                this.end = end;
                this.audio = audio
            }
            DataRequest.prototype = {
                requests: {},
                open: (function(mode, name) {
                    this.name = name;
                    this.requests[name] = this;
                    Module["addRunDependency"]("fp " + this.name)
                }),
                send: (function() {}),
                onload: (function() {
                    var byteArray = this.byteArray.subarray(this.start, this.end);
                    this.finish(byteArray)
                }),
                finish: (function(byteArray) {
                    var that = this;
                    Module["FS_createDataFile"](this.name, null, byteArray, true, true, true);
                    Module["removeRunDependency"]("fp " + that.name);
                    this.requests[this.name] = null
                })
            };
            var files = metadata.files;
            for (var i = 0; i < files.length; ++i) {
                (new DataRequest(files[i].start, files[i].end, files[i].audio)).open("GET", files[i].filename)
            }

            function processPackageData(arrayBuffer) {
                Module.finishedDataFileDownloads++;
                assert(arrayBuffer, "Loading data file failed.");
                assert(arrayBuffer instanceof ArrayBuffer, "bad input to processPackageData");
                var byteArray = new Uint8Array(arrayBuffer);
                var ptr = Module["getMemory"](byteArray.length);
                Module["HEAPU8"].set(byteArray, ptr);
                DataRequest.prototype.byteArray = Module["HEAPU8"].subarray(ptr, ptr + byteArray.length);
                var files = metadata.files;
                for (var i = 0; i < files.length; ++i) {
                    DataRequest.prototype.requests[files[i].filename].onload()
                }
                Module["removeRunDependency"]("datafile_./Chocolate-Wolfenstein-3D.data")
            }
            Module["addRunDependency"]("datafile_./Chocolate-Wolfenstein-3D.data");
            if (!Module.preloadResults) Module.preloadResults = {};
            Module.preloadResults[PACKAGE_NAME] = {
                fromCache: false
            };
            if (fetched) {
                processPackageData(fetched);
                fetched = null
            } else {
                fetchedCallback = processPackageData
            }
        }
        if (Module["calledRun"]) {
            runWithFS()
        } else {
            if (!Module["preRun"]) Module["preRun"] = [];
            Module["preRun"].push(runWithFS)
        }
    });
    loadPackage({
        "files": [{
            "start": 0,
            "audio": 0,
            "end": 1156,
            "filename": "/audiohed.wl1"
        }, {
            "start": 1156,
            "audio": 0,
            "end": 133769,
            "filename": "/audiot.wl1"
        }, {
            "start": 133769,
            "audio": 0,
            "end": 161194,
            "filename": "/gamemaps.wl1"
        }, {
            "start": 161194,
            "audio": 0,
            "end": 161596,
            "filename": "/maphead.wl1"
        }, {
            "start": 161596,
            "audio": 0,
            "end": 162620,
            "filename": "/vgadict.wl1"
        }, {
            "start": 162620,
            "audio": 0,
            "end": 489188,
            "filename": "/vgagraph.wl1"
        }, {
            "start": 489188,
            "audio": 0,
            "end": 489659,
            "filename": "/vgahead.wl1"
        }, {
            "start": 489659,
            "audio": 0,
            "end": 1232571,
            "filename": "/vswap.wl1"
        }],
        "remote_package_size": 1232571,
        "package_uuid": "8da972fb-fec5-446b-b907-e141deb3edd7"
    })
}))();
var moduleOverrides = {};
var key;
for (key in Module) {
    if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key]
    }
}
Module["arguments"] = [];
Module["thisProgram"] = "./this.program";
Module["quit"] = (function(status, toThrow) {
    throw toThrow
});
Module["preRun"] = [];
Module["postRun"] = [];
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === "object";
ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (Module["ENVIRONMENT"]) {
    throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)")
}
var scriptDirectory = "";

function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
    } else {
        return scriptDirectory + path
    }
}
if (ENVIRONMENT_IS_NODE) {
    scriptDirectory = __dirname + "/";
    var nodeFS;
    var nodePath;
    Module["read"] = function shell_read(filename, binary) {
        var ret;
        if (!nodeFS) nodeFS = require("fs");
        if (!nodePath) nodePath = require("path");
        filename = nodePath["normalize"](filename);
        ret = nodeFS["readFileSync"](filename);
        return binary ? ret : ret.toString()
    };
    Module["readBinary"] = function readBinary(filename) {
        var ret = Module["read"](filename, true);
        if (!ret.buffer) {
            ret = new Uint8Array(ret)
        }
        assert(ret.buffer);
        return ret
    };
    if (process["argv"].length > 1) {
        Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/")
    }
    Module["arguments"] = process["argv"].slice(2);
    if (typeof module !== "undefined") {
        module["exports"] = Module
    }
    process["on"]("uncaughtException", (function(ex) {
        if (!(ex instanceof ExitStatus)) {
            throw ex
        }
    }));
    process["on"]("unhandledRejection", abort);
    Module["quit"] = (function(status) {
        process["exit"](status)
    });
    Module["inspect"] = (function() {
        return "[Emscripten Module object]"
    })
} else if (ENVIRONMENT_IS_SHELL) {
    if (typeof read != "undefined") {
        Module["read"] = function shell_read(f) {
            return read(f)
        }
    }
    Module["readBinary"] = function readBinary(f) {
        var data;
        if (typeof readbuffer === "function") {
            return new Uint8Array(readbuffer(f))
        }
        data = read(f, "binary");
        assert(typeof data === "object");
        return data
    };
    if (typeof scriptArgs != "undefined") {
        Module["arguments"] = scriptArgs
    } else if (typeof arguments != "undefined") {
        Module["arguments"] = arguments
    }
    if (typeof quit === "function") {
        Module["quit"] = (function(status) {
            quit(status)
        })
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
    } else if (document.currentScript) {
        scriptDirectory = document.currentScript.src
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
    } else {
        scriptDirectory = ""
    }
    Module["read"] = function shell_read(url) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText
    };
    if (ENVIRONMENT_IS_WORKER) {
        Module["readBinary"] = function readBinary(url) {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response)
        }
    }
    Module["readAsync"] = function readAsync(url, onload, onerror) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response);
                return
            }
            onerror()
        };
        xhr.onerror = onerror;
        xhr.send(null)
    };
    Module["setWindowTitle"] = (function(title) {
        document.title = title
    })
} else {
    throw new Error("environment detection error")
}
var out = Module["print"] || (typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null);
var err = Module["printErr"] || (typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || out);
for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key]
    }
}
moduleOverrides = undefined;
assert(typeof Module["memoryInitializerPrefixURL"] === "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["pthreadMainPrefixURL"] === "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["cdInitializerPrefixURL"] === "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["filePackagePrefixURL"] === "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
var STACK_ALIGN = 16;
stackSave = stackRestore = stackAlloc = (function() {
    abort("cannot use the stack before compiled code is ready to run, and has provided stack access")
});

function staticAlloc(size) {
    assert(!staticSealed);
    var ret = STATICTOP;
    STATICTOP = STATICTOP + size + 15 & -16;
    assert(STATICTOP < TOTAL_MEMORY, "not enough memory for static allocation - increase TOTAL_MEMORY");
    return ret
}

function dynamicAlloc(size) {
    assert(DYNAMICTOP_PTR);
    var ret = HEAP32[DYNAMICTOP_PTR >> 2];
    var end = ret + size + 15 & -16;
    HEAP32[DYNAMICTOP_PTR >> 2] = end;
    if (end >= TOTAL_MEMORY) {
        var success = enlargeMemory();
        if (!success) {
            HEAP32[DYNAMICTOP_PTR >> 2] = ret;
            return 0
        }
    }
    return ret
}

function alignMemory(size, factor) {
    if (!factor) factor = STACK_ALIGN;
    var ret = size = Math.ceil(size / factor) * factor;
    return ret
}

function getNativeTypeSize(type) {
    switch (type) {
        case "i1":
        case "i8":
            return 1;
        case "i16":
            return 2;
        case "i32":
            return 4;
        case "i64":
            return 8;
        case "float":
            return 4;
        case "double":
            return 8;
        default: {
            if (type[type.length - 1] === "*") {
                return 4
            } else if (type[0] === "i") {
                var bits = parseInt(type.substr(1));
                assert(bits % 8 === 0);
                return bits / 8
            } else {
                return 0
            }
        }
    }
}

function warnOnce(text) {
    if (!warnOnce.shown) warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text)
    }
}
var asm2wasmImports = {
    "f64-rem": (function(x, y) {
        return x % y
    }),
    "debugger": (function() {
        debugger
    })
};
var functionPointers = new Array(0);
var funcWrappers = {};

function getFuncWrapper(func, sig) {
    if (!func) return;
    assert(sig);
    if (!funcWrappers[sig]) {
        funcWrappers[sig] = {}
    }
    var sigCache = funcWrappers[sig];
    if (!sigCache[func]) {
        if (sig.length === 1) {
            sigCache[func] = function dynCall_wrapper() {
                return dynCall(sig, func)
            }
        } else if (sig.length === 2) {
            sigCache[func] = function dynCall_wrapper(arg) {
                return dynCall(sig, func, [arg])
            }
        } else {
            sigCache[func] = function dynCall_wrapper() {
                return dynCall(sig, func, Array.prototype.slice.call(arguments))
            }
        }
    }
    return sigCache[func]
}

function dynCall(sig, ptr, args) {
    if (args && args.length) {
        assert(args.length == sig.length - 1);
        assert("dynCall_" + sig in Module, "bad function pointer type - no table for sig '" + sig + "'");
        return Module["dynCall_" + sig].apply(null, [ptr].concat(args))
    } else {
        assert(sig.length == 1);
        assert("dynCall_" + sig in Module, "bad function pointer type - no table for sig '" + sig + "'");
        return Module["dynCall_" + sig].call(null, ptr)
    }
}
var tempRet0 = 0;
var setTempRet0 = (function(value) {
    tempRet0 = value
});
var getTempRet0 = (function() {
    return tempRet0
});
var GLOBAL_BASE = 1024;
var ABORT = false;
var EXITSTATUS = 0;

function assert(condition, text) {
    if (!condition) {
        abort("Assertion failed: " + text)
    }
}

function setValue(ptr, value, type, noSafe) {
    type = type || "i8";
    if (type.charAt(type.length - 1) === "*") type = "i32";
    switch (type) {
        case "i1":
            HEAP8[ptr >> 0] = value;
            break;
        case "i8":
            HEAP8[ptr >> 0] = value;
            break;
        case "i16":
            HEAP16[ptr >> 1] = value;
            break;
        case "i32":
            HEAP32[ptr >> 2] = value;
            break;
        case "i64":
            tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= +1 ? tempDouble > +0 ? (Math_min(+Math_floor(tempDouble / +4294967296), +4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / +4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
            break;
        case "float":
            HEAPF32[ptr >> 2] = value;
            break;
        case "double":
            HEAPF64[ptr >> 3] = value;
            break;
        default:
            abort("invalid type for setValue: " + type)
    }
}
var ALLOC_NORMAL = 0;
var ALLOC_STATIC = 2;
var ALLOC_NONE = 4;

function allocate(slab, types, allocator, ptr) {
    var zeroinit, size;
    if (typeof slab === "number") {
        zeroinit = true;
        size = slab
    } else {
        zeroinit = false;
        size = slab.length
    }
    var singleType = typeof types === "string" ? types : null;
    var ret;
    if (allocator == ALLOC_NONE) {
        ret = ptr
    } else {
        ret = [typeof _malloc === "function" ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length))
    }
    if (zeroinit) {
        var stop;
        ptr = ret;
        assert((ret & 3) == 0);
        stop = ret + (size & ~3);
        for (; ptr < stop; ptr += 4) {
            HEAP32[ptr >> 2] = 0
        }
        stop = ret + size;
        while (ptr < stop) {
            HEAP8[ptr++ >> 0] = 0
        }
        return ret
    }
    if (singleType === "i8") {
        if (slab.subarray || slab.slice) {
            HEAPU8.set(slab, ret)
        } else {
            HEAPU8.set(new Uint8Array(slab), ret)
        }
        return ret
    }
    var i = 0,
        type, typeSize, previousType;
    while (i < size) {
        var curr = slab[i];
        type = singleType || types[i];
        if (type === 0) {
            i++;
            continue
        }
        assert(type, "Must know what type to store in allocate!");
        if (type == "i64") type = "i32";
        setValue(ret + i, curr, type);
        if (previousType !== type) {
            typeSize = getNativeTypeSize(type);
            previousType = type
        }
        i += typeSize
    }
    return ret
}

function getMemory(size) {
    if (!staticSealed) return staticAlloc(size);
    if (!runtimeInitialized) return dynamicAlloc(size);
    return _malloc(size)
}

function Pointer_stringify(ptr, length) {
    if (length === 0 || !ptr) return "";
    var hasUtf = 0;
    var t;
    var i = 0;
    while (1) {
        assert(ptr + i < TOTAL_MEMORY);
        t = HEAPU8[ptr + i >> 0];
        hasUtf |= t;
        if (t == 0 && !length) break;
        i++;
        if (length && i == length) break
    }
    if (!length) length = i;
    var ret = "";
    if (hasUtf < 128) {
        var MAX_CHUNK = 1024;
        var curr;
        while (length > 0) {
            curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
            ret = ret ? ret + curr : curr;
            ptr += MAX_CHUNK;
            length -= MAX_CHUNK
        }
        return ret
    }
    return UTF8ToString(ptr)
}
var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

function UTF8ArrayToString(u8Array, idx) {
    var endPtr = idx;
    while (u8Array[endPtr]) ++endPtr;
    if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr))
    } else {
        var u0, u1, u2, u3, u4, u5;
        var str = "";
        while (1) {
            u0 = u8Array[idx++];
            if (!u0) return str;
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue
            }
            u1 = u8Array[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue
            }
            u2 = u8Array[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2
            } else {
                u3 = u8Array[idx++] & 63;
                if ((u0 & 248) == 240) {
                    u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3
                } else {
                    u4 = u8Array[idx++] & 63;
                    if ((u0 & 252) == 248) {
                        u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4
                    } else {
                        u5 = u8Array[idx++] & 63;
                        u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5
                    }
                }
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0)
            } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
            }
        }
    }
}

function UTF8ToString(ptr) {
    return UTF8ArrayToString(HEAPU8, ptr)
}

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 2097151) {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 67108863) {
            if (outIdx + 4 >= endIdx) break;
            outU8Array[outIdx++] = 248 | u >> 24;
            outU8Array[outIdx++] = 128 | u >> 18 & 63;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 5 >= endIdx) break;
            outU8Array[outIdx++] = 252 | u >> 30;
            outU8Array[outIdx++] = 128 | u >> 24 & 63;
            outU8Array[outIdx++] = 128 | u >> 18 & 63;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        }
    }
    outU8Array[outIdx] = 0;
    return outIdx - startIdx
}

function stringToUTF8(str, outPtr, maxBytesToWrite) {
    assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
}

function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127) {
            ++len
        } else if (u <= 2047) {
            len += 2
        } else if (u <= 65535) {
            len += 3
        } else if (u <= 2097151) {
            len += 4
        } else if (u <= 67108863) {
            len += 5
        } else {
            len += 6
        }
    }
    return len
}
var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

function allocateUTF8(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = _malloc(size);
    if (ret) stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}

function allocateUTF8OnStack(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = stackAlloc(size);
    stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}

function demangle(func) {
    warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
    return func
}

function demangleAll(text) {
    var regex = /__Z[\w\d_]+/g;
    return text.replace(regex, (function(x) {
        var y = demangle(x);
        return x === y ? x : y + " [" + x + "]"
    }))
}

function jsStackTrace() {
    var err = new Error;
    if (!err.stack) {
        try {
            throw new Error(0)
        } catch (e) {
            err = e
        }
        if (!err.stack) {
            return "(no stack trace available)"
        }
    }
    return err.stack.toString()
}

function stackTrace() {
    var js = jsStackTrace();
    if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
    return demangleAll(js)
}
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;

function alignUp(x, multiple) {
    if (x % multiple > 0) {
        x += multiple - x % multiple
    }
    return x
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateGlobalBuffer(buf) {
    Module["buffer"] = buffer = buf
}

function updateGlobalBufferViews() {
    Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
    Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
    Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer)
}
var STATIC_BASE, STATICTOP, staticSealed;
var STACK_BASE, STACKTOP, STACK_MAX;
var DYNAMIC_BASE, DYNAMICTOP_PTR;
STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
staticSealed = false;

function writeStackCookie() {
    assert((STACK_MAX & 3) == 0);
    HEAPU32[(STACK_MAX >> 2) - 1] = 34821223;
    HEAPU32[(STACK_MAX >> 2) - 2] = 2310721022
}

function checkStackCookie() {
    if (HEAPU32[(STACK_MAX >> 2) - 1] != 34821223 || HEAPU32[(STACK_MAX >> 2) - 2] != 2310721022) {
        abort("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x" + HEAPU32[(STACK_MAX >> 2) - 2].toString(16) + " " + HEAPU32[(STACK_MAX >> 2) - 1].toString(16))
    }
    if (HEAP32[0] !== 1668509029) throw "Runtime error: The application has corrupted its heap memory area (address zero)!"
}

function abortStackOverflow(allocSize) {
    abort("Stack overflow! Attempted to allocate " + allocSize + " bytes on the stack, but stack has only " + (STACK_MAX - stackSave() + allocSize) + " bytes available!")
}

function abortStackOverflowEmterpreter() {
    abort("Emterpreter stack overflow! Decrease the recursion level or increase EMT_STACK_MAX in tools/emterpretify.py (current value " + EMT_STACK_MAX + ").")
}

function abortOnCannotGrowMemory() {
    abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
}

function enlargeMemory() {
    abortOnCannotGrowMemory()
}
var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 268435456;
if (TOTAL_MEMORY < TOTAL_STACK) err("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
assert(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined, "JS engine does not provide full typed array support");
if (Module["buffer"]) {
    buffer = Module["buffer"];
    assert(buffer.byteLength === TOTAL_MEMORY, "provided buffer should be " + TOTAL_MEMORY + " bytes, but it is " + buffer.byteLength)
} else {
    if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") {
        assert(TOTAL_MEMORY % WASM_PAGE_SIZE === 0);
        Module["wasmMemory"] = new WebAssembly.Memory({
            "initial": TOTAL_MEMORY / WASM_PAGE_SIZE,
            "maximum": TOTAL_MEMORY / WASM_PAGE_SIZE
        });
        buffer = Module["wasmMemory"].buffer
    } else {
        buffer = new ArrayBuffer(TOTAL_MEMORY)
    }
    assert(buffer.byteLength === TOTAL_MEMORY);
    Module["buffer"] = buffer
}
updateGlobalBufferViews();

function getTotalMemory() {
    return TOTAL_MEMORY
}
HEAP32[0] = 1668509029;
HEAP16[1] = 25459;
if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99) throw "Runtime error: expected the system to be little-endian!";

function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
            callback();
            continue
        }
        var func = callback.func;
        if (typeof func === "number") {
            if (callback.arg === undefined) {
                Module["dynCall_v"](func)
            } else {
                Module["dynCall_vi"](func, callback.arg)
            }
        } else {
            func(callback.arg === undefined ? null : callback.arg)
        }
    }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;

function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}

function ensureInitRuntime() {
    checkStackCookie();
    if (runtimeInitialized) return;
    runtimeInitialized = true;
    callRuntimeCallbacks(__ATINIT__)
}

function preMain() {
    checkStackCookie();
    callRuntimeCallbacks(__ATMAIN__)
}

function exitRuntime() {
    checkStackCookie();
    callRuntimeCallbacks(__ATEXIT__);
    runtimeExited = true
}

function postRun() {
    checkStackCookie();
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}

function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
        assert(str.charCodeAt(i) === str.charCodeAt(i) & 255);
        HEAP8[buffer++ >> 0] = str.charCodeAt(i)
    }
    if (!dontAddNull) HEAP8[buffer >> 0] = 0
}
assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
var Math_abs = Math.abs;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_min = Math.min;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
    var orig = id;
    while (1) {
        if (!runDependencyTracking[id]) return id;
        id = orig + Math.random()
    }
    return id
}

function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (id) {
        assert(!runDependencyTracking[id]);
        runDependencyTracking[id] = 1;
        if (runDependencyWatcher === null && typeof setInterval !== "undefined") {
            runDependencyWatcher = setInterval((function() {
                if (ABORT) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                    return
                }
                var shown = false;
                for (var dep in runDependencyTracking) {
                    if (!shown) {
                        shown = true;
                        err("still waiting on run dependencies:")
                    }
                    err("dependency: " + dep)
                }
                if (shown) {
                    err("(end of list)")
                }
            }), 1e4)
        }
    } else {
        err("warning: run dependency added without ID")
    }
}

function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (id) {
        assert(runDependencyTracking[id]);
        delete runDependencyTracking[id]
    } else {
        err("warning: run dependency removed without ID")
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
        }
    }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
var dataURIPrefix = "data:application/octet-stream;base64,";

function isDataURI(filename) {
    return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0
}

function integrateWasmJS() {
    var wasmTextFile = "Chocolate-Wolfenstein-3D.wast";
    var wasmBinaryFile = "Chocolate-Wolfenstein-3D.wasm";
    var asmjsCodeFile = "Chocolate-Wolfenstein-3D.temp.asm.js";
    if (!isDataURI(wasmTextFile)) {
        wasmTextFile = locateFile(wasmTextFile)
    }
    if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile)
    }
    if (!isDataURI(asmjsCodeFile)) {
        asmjsCodeFile = locateFile(asmjsCodeFile)
    }
    var wasmPageSize = 64 * 1024;
    var info = {
        "global": null,
        "env": null,
        "asm2wasm": asm2wasmImports,
        "parent": Module
    };
    var exports = null;

    function mergeMemory(newBuffer) {
        var oldBuffer = Module["buffer"];
        if (newBuffer.byteLength < oldBuffer.byteLength) {
            err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here")
        }
        var oldView = new Int8Array(oldBuffer);
        var newView = new Int8Array(newBuffer);
        newView.set(oldView);
        updateGlobalBuffer(newBuffer);
        updateGlobalBufferViews()
    }

    function getBinary() {
        try {
            if (Module["wasmBinary"]) {
                return new Uint8Array(Module["wasmBinary"])
            }
            if (Module["readBinary"]) {
                return Module["readBinary"](wasmBinaryFile)
            } else {
                throw "both async and sync fetching of the wasm failed"
            }
        } catch (err) {
            abort(err)
        }
    }

    function getBinaryPromise() {
        if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
            return fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }).then((function(response) {
                if (!response["ok"]) {
                    throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                }
                return response["arrayBuffer"]()
            })).catch((function() {
                return getBinary()
            }))
        }
        return new Promise((function(resolve, reject) {
            resolve(getBinary())
        }))
    }

    function doNativeWasm(global, env, providedBuffer) {
        if (typeof WebAssembly !== "object") {
            abort("No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead.");
            err("no native wasm support detected");
            return false
        }
        if (!(Module["wasmMemory"] instanceof WebAssembly.Memory)) {
            err("no native wasm Memory in use");
            return false
        }
        env["memory"] = Module["wasmMemory"];
        info["global"] = {
            "NaN": NaN,
            "Infinity": Infinity
        };
        info["global.Math"] = Math;
        info["env"] = env;

        function receiveInstance(instance, module) {
            exports = instance.exports;
            if (exports.memory) mergeMemory(exports.memory);
            Module["asm"] = exports;
            Module["usingWasm"] = true;
            removeRunDependency("wasm-instantiate")
        }
        addRunDependency("wasm-instantiate");
        if (Module["instantiateWasm"]) {
            try {
                return Module["instantiateWasm"](info, receiveInstance)
            } catch (e) {
                err("Module.instantiateWasm callback failed with error: " + e);
                return false
            }
        }
        var trueModule = Module;

        function receiveInstantiatedSource(output) {
            assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
            trueModule = null;
            receiveInstance(output["instance"], output["module"])
        }

        function instantiateArrayBuffer(receiver) {
            getBinaryPromise().then((function(binary) {
                return WebAssembly.instantiate(binary, info)
            })).then(receiver, (function(reason) {
                err("failed to asynchronously prepare wasm: " + reason);
                abort(reason)
            }))
        }
        if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
            WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }), info).then(receiveInstantiatedSource, (function(reason) {
                err("wasm streaming compile failed: " + reason);
                err("falling back to ArrayBuffer instantiation");
                instantiateArrayBuffer(receiveInstantiatedSource)
            }))
        } else {
            instantiateArrayBuffer(receiveInstantiatedSource)
        }
        return {}
    }
    Module["asmPreload"] = Module["asm"];
    var asmjsReallocBuffer = Module["reallocBuffer"];
    var wasmReallocBuffer = (function(size) {
        var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
        size = alignUp(size, PAGE_MULTIPLE);
        var old = Module["buffer"];
        var oldSize = old.byteLength;
        if (Module["usingWasm"]) {
            try {
                var result = Module["wasmMemory"].grow((size - oldSize) / wasmPageSize);
                if (result !== (-1 | 0)) {
                    return Module["buffer"] = Module["wasmMemory"].buffer
                } else {
                    return null
                }
            } catch (e) {
                console.error("Module.reallocBuffer: Attempted to grow from " + oldSize + " bytes to " + size + " bytes, but got error: " + e);
                return null
            }
        }
    });
    Module["reallocBuffer"] = (function(size) {
        if (finalMethod === "asmjs") {
            return asmjsReallocBuffer(size)
        } else {
            return wasmReallocBuffer(size)
        }
    });
    var finalMethod = "";
    Module["asm"] = (function(global, env, providedBuffer) {
        if (!env["table"]) {
            var TABLE_SIZE = Module["wasmTableSize"];
            if (TABLE_SIZE === undefined) TABLE_SIZE = 1024;
            var MAX_TABLE_SIZE = Module["wasmMaxTableSize"];
            if (typeof WebAssembly === "object" && typeof WebAssembly.Table === "function") {
                if (MAX_TABLE_SIZE !== undefined) {
                    env["table"] = new WebAssembly.Table({
                        "initial": TABLE_SIZE,
                        "maximum": MAX_TABLE_SIZE,
                        "element": "anyfunc"
                    })
                } else {
                    env["table"] = new WebAssembly.Table({
                        "initial": TABLE_SIZE,
                        element: "anyfunc"
                    })
                }
            } else {
                env["table"] = new Array(TABLE_SIZE)
            }
            Module["wasmTable"] = env["table"]
        }
        if (!env["__memory_base"]) {
            env["__memory_base"] = Module["STATIC_BASE"]
        }
        if (!env["__table_base"]) {
            env["__table_base"] = 0
        }
        var exports;
        exports = doNativeWasm(global, env, providedBuffer);
        assert(exports, "no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: http://kripken.github.io/emscripten-site/docs/compiling/WebAssembly.html#binaryen-methods");
        return exports
    })
}
integrateWasmJS();
STATIC_BASE = GLOBAL_BASE;
STATICTOP = STATIC_BASE + 219776;
__ATINIT__.push({
    func: (function() {
        ___emscripten_environ_constructor()
    })
});
var STATIC_BUMP = 219776;
Module["STATIC_BASE"] = STATIC_BASE;
Module["STATIC_BUMP"] = STATIC_BUMP;
var tempDoublePtr = STATICTOP;
STATICTOP += 16;
assert(tempDoublePtr % 8 == 0);
var EMTSTACKTOP = getMemory(1048576);
var EMT_STACK_MAX = EMTSTACKTOP + 1048576;
var eb = getMemory(53e3);
assert(eb % 8 === 0);
__ATPRERUN__.push((function() {
    HEAPU8.set([140, 0, 35, 0, 0, 0, 0, 0, 2, 25, 0, 0, 167, 213, 0, 0, 2, 26, 0, 0, 215, 83, 0, 0, 2, 27, 0, 0, 168, 213, 0, 0, 1, 20, 0, 0, 136, 28, 0, 0, 0, 21, 28, 0, 136, 28, 0, 0, 1, 29, 192, 2, 3, 28, 28, 29, 137, 28, 0, 0, 130, 28, 0, 0, 136, 29, 0, 0, 49, 28, 28, 29, 88, 0, 0, 0, 1, 29, 192, 2, 135, 28, 0, 0, 29, 0, 0, 0, 1, 28, 176, 2, 3, 19, 21, 28, 1, 28, 168, 2, 3, 18, 21, 28, 1, 28, 160, 2, 3, 17, 21, 28, 1, 28, 152, 2, 3, 16, 21, 28, 1, 28, 144, 2, 3, 15, 21, 28, 1, 28, 136, 2, 3, 14, 21, 28, 1, 28, 128, 2, 3, 12, 21, 28, 1, 28, 120, 2, 3, 11, 21, 28, 1, 28, 112, 2, 3, 7, 21, 28, 1, 28, 104, 2, 3, 6, 21, 28, 1, 28, 96, 2, 3, 4, 21, 28, 1, 28, 88, 2, 3, 1, 21, 28, 1, 28, 180, 2, 3, 13, 21, 28, 0, 0, 21, 0, 2, 29, 0, 0, 80, 20, 1, 0, 1, 30, 88, 2, 135, 28, 1, 0, 0, 29, 30, 0, 1, 30, 55, 0, 1, 29, 97, 0, 135, 28, 2, 0, 30, 29, 0, 0, 2, 28, 0, 0, 170, 89, 3, 0, 1, 29, 0, 0, 84, 28, 29, 0, 2, 29, 0, 0, 172, 89, 3, 0, 1, 28, 0, 0, 84, 29, 28, 0, 2, 28, 0, 0, 174, 89, 3, 0, 1, 29, 64, 1, 84, 28, 29, 0, 2, 29, 0, 0, 176, 89, 3, 0, 1, 28, 160, 0, 84, 29, 28, 0, 1, 29, 0, 0, 1, 30, 0, 0, 1, 31, 64, 1, 2, 32, 0, 0, 84, 79, 1, 0, 82, 32, 32, 0, 2, 33, 0, 0, 0, 86, 3, 0, 82, 33, 33, 0, 7, 32, 32, 33, 26, 32, 32, 39, 1, 33, 127, 0, 135, 28, 3, 0, 29, 30, 31, 32, 33, 0, 0, 0, 2, 28, 0, 0, 190, 115, 1, 0, 78, 28, 28, 0, 33, 28, 28, 127, 121, 28, 4, 0, 1, 33, 127, 0, 135, 28, 4, 0, 33, 0, 0, 0, 1, 33, 16, 0, 135, 28, 5, 0, 33, 0, 0, 0, 135, 28, 6, 0, 135, 28, 7, 0, 1, 33, 0, 0, 1, 32, 16, 0, 1, 31, 55, 0, 135, 28, 8, 0, 33, 32, 31, 0, 2, 28, 0, 0, 68, 85, 3, 0, 82, 28, 28, 0, 34, 28, 28, 8, 121, 28, 63, 4, 1, 31, 14, 0, 1, 32, 2, 0, 2, 33, 0, 0, 189, 116, 1, 0, 135, 28, 9, 0, 31, 32, 33, 0, 1, 33, 14, 0, 1, 32, 7, 0, 2, 31, 0, 0, 205, 116, 1, 0, 135, 28, 9, 0, 33, 32, 31, 0, 1, 31, 16, 0, 1, 32, 10, 0, 2, 33, 0, 0, 217, 116, 1, 0, 135, 28, 9, 0, 31, 32, 33, 0, 1, 33, 16, 0, 1, 32, 12, 0, 2, 31, 0, 0, 222, 116, 1, 0, 135, 28, 9, 0, 33, 32, 31, 0, 1, 31, 9, 0, 1, 32, 14, 0, 2, 33, 0, 0, 227, 116, 1, 0, 135, 28, 9, 0, 31, 32, 33, 0, 1, 33, 5, 0, 1, 32, 16, 0, 2, 31, 0, 0, 243, 116, 1, 0, 135, 28, 9, 0, 33, 32, 31, 0, 1, 31, 1, 0, 1, 32, 18, 0, 2, 33, 0, 0, 5, 117, 1, 0, 135, 28, 9, 0, 31, 32, 33, 0, 2, 28, 0, 0, 30, 90, 3, 0, 79, 28, 28, 0, 2, 33, 0, 0, 31, 90, 3, 0, 79, 33, 33, 0, 41, 33, 33, 8, 20, 28, 28, 33, 41, 28, 28, 16, 42, 28, 28, 16, 25, 28, 28, 1, 85, 1, 28, 0, 2, 33, 0, 0, 186, 116, 1, 0, 135, 28, 10, 0, 13, 33, 1, 0, 1, 33, 26, 0, 1, 32, 2, 0, 135, 28, 9, 0, 33, 32, 13, 0, 1, 32, 26, 0, 1, 33, 12, 0, 2, 31, 0, 0, 72, 90, 3, 0, 79, 31, 31, 0, 2, 30, 0, 0, 73, 90, 3, 0, 79, 30, 30, 0, 41, 30, 30, 8, 20, 31, 31, 30, 41, 31, 31, 16, 42, 31, 31, 16, 27, 31, 31, 10, 2, 30, 0, 0, 68, 85, 3, 0, 82, 30, 30, 0, 3, 31, 31, 30, 27, 31, 31, 10, 3, 31, 0, 31, 25, 31, 31, 4, 135, 28, 9, 0, 32, 33, 31, 0, 2, 28, 0, 0, 86, 90, 3, 0, 79, 28, 28, 0, 2, 31, 0, 0, 87, 90, 3, 0, 79, 31, 31, 0, 41, 31, 31, 8, 20, 28, 28, 31, 2, 31, 0, 0, 88, 90, 3, 0, 79, 31, 31, 0, 41, 31, 31, 16, 20, 28, 28, 31, 2, 31, 0, 0, 89, 90, 3, 0, 79, 31, 31, 0, 41, 31, 31, 24, 20, 28, 28, 31, 0, 1, 28, 0, 28, 8, 1, 70, 1, 28, 52, 23, 15, 28, 8, 28, 1, 31, 52, 23, 125, 8, 28, 8, 31, 0, 0, 0, 76, 31, 1, 0, 145, 22, 31, 0, 2, 31, 0, 0, 72, 90, 3, 0, 79, 31, 31, 0, 2, 28, 0, 0, 73, 90, 3, 0, 79, 28, 28, 0, 41, 28, 28, 8, 20, 31, 31, 28, 41, 31, 31, 16, 42, 31, 31, 16, 27, 31, 31, 10, 2, 28, 0, 0, 68, 85, 3, 0, 82, 28, 28, 0, 3, 31, 31, 28, 27, 31, 31, 10, 3, 1, 0, 31, 127, 31, 0, 0, 115, 31, 1, 0, 127, 31, 0, 0, 104, 28, 1, 2, 108, 31, 2, 28, 127, 31, 0, 0, 88, 28, 31, 0, 145, 28, 28, 0, 59, 31, 104, 16, 145, 31, 31, 0, 65, 23, 28, 31, 145, 23, 23, 0, 59, 33, 70, 0, 145, 33, 33, 0, 66, 28, 23, 33, 145, 28, 28, 0, 76, 32, 8, 0, 145, 33, 32, 0, 64, 31, 28, 33, 145, 31, 31, 0, 75, 1, 31, 0, 73, 31, 23, 22, 1, 33, 0, 0, 125, 1, 31, 1, 33, 0, 0, 0, 28, 9, 8, 60, 27, 33, 9, 60, 4, 10, 8, 33, 1, 31, 208, 0, 1, 28, 80, 0, 1, 32, 88, 2, 6, 32, 8, 32, 25, 32, 32, 57, 135, 33, 8, 0, 31, 28, 32, 0, 1, 32, 224, 0, 1, 28, 80, 0, 30, 31, 9, 10, 25, 31, 31, 57, 135, 33, 8, 0, 32, 28, 31, 0, 1, 31, 30, 0, 1, 28, 10, 0, 2, 32, 0, 0, 187, 132, 1, 0, 135, 33, 9, 0, 31, 28, 32, 0, 28, 0, 10, 10, 1, 32, 248, 0, 1, 28, 80, 0, 25, 31, 0, 57, 135, 33, 8, 0, 32, 28, 31, 0, 1, 31, 8, 1, 1, 28, 80, 0, 27, 32, 0, 10, 4, 32, 10, 32, 25, 32, 32, 57, 135, 33, 8, 0, 31, 28, 32, 0, 135, 33, 11, 0, 1, 32, 0, 0, 1, 28, 255, 0, 1, 31, 208, 13, 1, 30, 30, 0, 135, 33, 12, 0, 32, 28, 31, 30, 2, 33, 0, 0, 84, 90, 3, 0, 79, 33, 33, 0, 2, 30, 0, 0, 85, 90, 3, 0, 79, 30, 30, 0, 41, 30, 30, 8, 20, 33, 33, 30, 0, 0, 33, 0, 41, 33, 0, 16, 42, 33, 33, 16, 120, 33, 3, 0, 1, 8, 0, 0, 119, 0, 15, 0, 2, 33, 0, 0, 78, 90, 3, 0, 79, 33, 33, 0, 2, 30, 0, 0, 79, 90, 3, 0, 79, 30, 30, 0, 41, 30, 30, 8, 20, 33, 33, 30, 41, 33, 33, 16, 42, 33, 33, 16, 27, 33, 33, 100, 41, 30, 0, 16, 42, 30, 30, 16, 6, 8, 33, 30, 2, 30, 0, 0, 80, 90, 3, 0, 79, 30, 30, 0, 2, 33, 0, 0, 81, 90, 3, 0, 79, 33, 33, 0, 41, 33, 33, 8, 20, 30, 30, 33, 0, 0, 30, 0, 41, 30, 0, 16, 42, 30, 30, 16, 120, 30, 3, 0, 1, 5, 0, 0, 119, 0, 15, 0, 2, 30, 0, 0, 74, 90, 3, 0, 79, 30, 30, 0, 2, 33, 0, 0, 75, 90, 3, 0, 79, 33, 33, 0, 41, 33, 33, 8, 20, 30, 30, 33, 41, 30, 30, 16, 42, 30, 30, 16, 27, 30, 30, 100, 41, 33, 0, 16, 42, 33, 33, 16, 6, 5, 30, 33, 2, 33, 0, 0, 82, 90, 3, 0, 79, 33, 33, 0, 2, 30, 0, 0, 83, 90, 3, 0, 79, 30, 30, 0, 41, 30, 30, 8, 20, 33, 33, 30, 0, 0, 33, 0, 41, 33, 0, 16, 42, 33, 33, 16, 120, 33, 3, 0, 1, 2, 0, 0, 119, 0, 15, 0, 2, 33, 0, 0, 76, 90, 3, 0, 79, 33, 33, 0, 2, 30, 0, 0, 77, 90, 3, 0, 79, 30, 30, 0, 41, 30, 30, 8, 20, 33, 33, 30, 41, 33, 33, 16, 42, 33, 33, 16, 27, 33, 33, 100, 41, 30, 0, 16, 42, 30, 30, 16, 6, 2, 33, 30, 1, 30, 244, 1, 5, 3, 1, 30, 120, 1, 3, 0, 1, 20, 29, 0, 119, 0, 152, 0, 1, 30, 0, 0, 49, 30, 30, 1, 164, 7, 0, 0, 1, 0, 0, 0, 1, 30, 244, 1, 5, 30, 0, 30, 85, 4, 30, 0, 2, 33, 0, 0, 25, 117, 1, 0, 135, 30, 10, 0, 13, 33, 4, 0, 1, 33, 36, 0, 135, 31, 13, 0, 13, 0, 0, 0, 41, 31, 31, 1, 4, 33, 33, 31, 1, 31, 7, 0, 135, 30, 9, 0, 33, 31, 13, 0, 31, 30, 0, 50, 120, 30, 4, 0, 1, 31, 42, 0, 135, 30, 14, 0, 31, 0, 0, 0, 31, 30, 0, 10, 32, 30, 30, 0, 2, 31, 0, 0, 33, 87, 1, 0, 78, 31, 31, 0, 32, 31, 31, 0, 20, 30, 30, 31, 121, 30, 2, 0, 135, 30, 11, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 121, 30, 48, 0, 1, 31, 5, 0, 135, 30, 16, 0, 31, 0, 0, 0, 135, 30, 17, 0, 27, 30, 30, 7, 29, 24, 30, 100, 2, 30, 0, 0, 92, 79, 1, 0, 82, 30, 30, 0, 2, 31, 0, 0, 156, 86, 3, 0, 82, 31, 31, 0, 4, 31, 24, 31, 47, 30, 30, 31, 108, 7, 0, 0, 2, 30, 0, 0, 160, 86, 3, 0, 82, 30, 30, 0, 40, 30, 30, 1, 0, 24, 30, 0, 2, 30, 0, 0, 160, 86, 3, 0, 85, 30, 24, 0, 1, 31, 0, 0, 1, 33, 16, 0, 2, 28, 0, 0, 96, 79, 1, 0, 41, 32, 24, 2, 94, 28, 28, 32, 135, 30, 8, 0, 31, 33, 28, 0, 135, 30, 11, 0, 2, 30, 0, 0, 156, 86, 3, 0, 135, 28, 17, 0, 27, 28, 28, 7, 29, 28, 28, 100, 85, 30, 28, 0, 2, 28, 0, 0, 92, 79, 1, 0, 1, 30, 35, 0, 85, 28, 30, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 33, 30, 30, 0, 120, 30, 210, 255, 135, 30, 18, 0, 41, 30, 30, 24, 42, 30, 30, 24, 120, 30, 64, 0, 47, 30, 0, 1, 160, 7, 0, 0, 25, 0, 0, 1, 119, 0, 169, 255, 119, 0, 1, 0, 135, 30, 11, 0, 1, 28, 43, 0, 135, 30, 14, 0, 28, 0, 0, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 120, 30, 3, 0, 1, 20, 29, 0, 119, 0, 49, 0, 1, 28, 5, 0, 135, 30, 16, 0, 28, 0, 0, 0, 135, 30, 17, 0, 27, 30, 30, 7, 29, 24, 30, 100, 2, 30, 0, 0, 92, 79, 1, 0, 82, 30, 30, 0, 2, 28, 0, 0, 156, 86, 3, 0, 82, 28, 28, 0, 4, 28, 24, 28, 47, 30, 30, 28, 116, 8, 0, 0, 2, 30, 0, 0, 160, 86, 3, 0, 82, 30, 30, 0, 40, 30, 30, 1, 0, 24, 30, 0, 2, 30, 0, 0, 160, 86, 3, 0, 85, 30, 24, 0, 1, 28, 0, 0, 1, 33, 16, 0, 2, 31, 0, 0, 96, 79, 1, 0, 41, 32, 24, 2, 94, 31, 31, 32, 135, 30, 8, 0, 28, 33, 31, 0, 135, 30, 11, 0, 2, 30, 0, 0, 156, 86, 3, 0, 135, 31, 17, 0, 27, 31, 31, 7, 29, 31, 31, 100, 85, 30, 31, 0, 2, 31, 0, 0, 92, 79, 1, 0, 1, 30, 35, 0, 85, 31, 30, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 33, 30, 30, 0, 120, 30, 210, 255, 1, 20, 29, 0, 32, 30, 20, 29, 121, 30, 49, 2, 34, 30, 8, 0, 121, 30, 3, 0, 1, 20, 46, 0, 119, 0, 127, 0, 1, 0, 0, 0, 85, 6, 0, 0, 2, 31, 0, 0, 186, 116, 1, 0, 135, 30, 10, 0, 13, 31, 6, 0, 1, 31, 37, 0, 135, 33, 13, 0, 13, 0, 0, 0, 41, 33, 33, 1, 4, 31, 31, 33, 1, 33, 14, 0, 135, 30, 9, 0, 31, 33, 13, 0, 31, 30, 0, 10, 120, 30, 4, 0, 1, 33, 42, 0, 135, 30, 14, 0, 33, 0, 0, 0, 38, 30, 0, 1, 32, 30, 30, 0, 2, 33, 0, 0, 33, 87, 1, 0, 78, 33, 33, 0, 32, 33, 33, 0, 20, 30, 30, 33, 121, 30, 2, 0, 135, 30, 11, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 121, 30, 48, 0, 1, 33, 5, 0, 135, 30, 16, 0, 33, 0, 0, 0, 135, 30, 17, 0, 27, 30, 30, 7, 29, 24, 30, 100, 2, 30, 0, 0, 92, 79, 1, 0, 82, 30, 30, 0, 2, 33, 0, 0, 156, 86, 3, 0, 82, 33, 33, 0, 4, 33, 24, 33, 47, 30, 30, 33, 204, 9, 0, 0, 2, 30, 0, 0, 160, 86, 3, 0, 82, 30, 30, 0, 40, 30, 30, 1, 0, 24, 30, 0, 2, 30, 0, 0, 160, 86, 3, 0, 85, 30, 24, 0, 1, 33, 0, 0, 1, 31, 16, 0, 2, 28, 0, 0, 96, 79, 1, 0, 41, 32, 24, 2, 94, 28, 28, 32, 135, 30, 8, 0, 33, 31, 28, 0, 135, 30, 11, 0, 2, 30, 0, 0, 156, 86, 3, 0, 135, 28, 17, 0, 27, 28, 28, 7, 29, 28, 28, 100, 85, 30, 28, 0, 2, 28, 0, 0, 92, 79, 1, 0, 1, 30, 35, 0, 85, 28, 30, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 33, 30, 30, 0, 120, 30, 210, 255, 135, 30, 18, 0, 41, 30, 30, 24, 42, 30, 30, 24, 120, 30, 218, 1, 47, 30, 0, 8, 0, 10, 0, 0, 25, 0, 0, 1, 119, 0, 171, 255, 119, 0, 1, 0, 1, 30, 99, 0, 47, 30, 30, 8, 112, 10, 0, 0, 1, 28, 30, 0, 135, 30, 16, 0, 28, 0, 0, 0, 135, 30, 19, 0, 1, 30, 16, 39, 3, 0, 3, 30, 85, 7, 0, 0, 2, 28, 0, 0, 25, 117, 1, 0, 135, 30, 10, 0, 13, 28, 7, 0, 1, 28, 36, 0, 135, 31, 13, 0, 13, 0, 0, 0, 41, 31, 31, 1, 4, 28, 28, 31, 1, 31, 7, 0, 135, 30, 9, 0, 28, 31, 13, 0, 135, 30, 11, 0, 1, 31, 48, 0, 135, 30, 14, 0, 31, 0, 0, 0, 119, 0, 12, 0, 120, 8, 10, 0, 1, 31, 30, 0, 135, 30, 16, 0, 31, 0, 0, 0, 135, 30, 19, 0, 1, 31, 47, 0, 135, 30, 14, 0, 31, 0, 0, 0, 0, 0, 3, 0, 119, 0, 2, 0, 1, 20, 46, 0, 32, 30, 20, 46, 121, 30, 5, 0, 1, 31, 43, 0, 135, 30, 14, 0, 31, 0, 0, 0, 0, 0, 3, 0, 135, 30, 11, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 121, 30, 48, 0, 1, 31, 5, 0, 135, 30, 16, 0, 31, 0, 0, 0, 135, 30, 17, 0, 27, 30, 30, 7, 29, 24, 30, 100, 2, 30, 0, 0, 92, 79, 1, 0, 82, 30, 30, 0, 2, 31, 0, 0, 156, 86, 3, 0, 82, 31, 31, 0, 4, 31, 24, 31, 47, 30, 30, 31, 112, 11, 0, 0, 2, 30, 0, 0, 160, 86, 3, 0, 82, 30, 30, 0, 40, 30, 30, 1, 0, 24, 30, 0, 2, 30, 0, 0, 160, 86, 3, 0, 85, 30, 24, 0, 1, 31, 0, 0, 1, 28, 16, 0, 2, 33, 0, 0, 96, 79, 1, 0, 41, 32, 24, 2, 94, 33, 33, 32, 135, 30, 8, 0, 31, 28, 33, 0, 135, 30, 11, 0, 2, 30, 0, 0, 156, 86, 3, 0, 135, 33, 17, 0, 27, 33, 33, 7, 29, 33, 33, 100, 85, 30, 33, 0, 2, 33, 0, 0, 92, 79, 1, 0, 1, 30, 35, 0, 85, 33, 30, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 33, 30, 30, 0, 120, 30, 210, 255, 34, 30, 5, 0, 121, 30, 3, 0, 1, 20, 69, 0, 119, 0, 126, 0, 1, 1, 0, 0, 85, 11, 1, 0, 2, 33, 0, 0, 186, 116, 1, 0, 135, 30, 10, 0, 13, 33, 11, 0, 1, 33, 37, 0, 135, 28, 13, 0, 13, 0, 0, 0, 41, 28, 28, 1, 4, 33, 33, 28, 1, 28, 16, 0, 135, 30, 9, 0, 33, 28, 13, 0, 31, 30, 1, 10, 120, 30, 4, 0, 1, 28, 42, 0, 135, 30, 14, 0, 28, 0, 0, 0, 38, 30, 1, 1, 32, 30, 30, 0, 2, 28, 0, 0, 33, 87, 1, 0, 78, 28, 28, 0, 32, 28, 28, 0, 20, 30, 30, 28, 121, 30, 2, 0, 135, 30, 11, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 121, 30, 48, 0, 1, 28, 5, 0, 135, 30, 16, 0, 28, 0, 0, 0, 135, 30, 17, 0, 27, 30, 30, 7, 29, 24, 30, 100, 2, 30, 0, 0, 92, 79, 1, 0, 82, 30, 30, 0, 2, 28, 0, 0, 156, 86, 3, 0, 82, 28, 28, 0, 4, 28, 24, 28, 47, 30, 30, 28, 188, 12, 0, 0, 2, 30, 0, 0, 160, 86, 3, 0, 82, 30, 30, 0, 40, 30, 30, 1, 0, 24, 30, 0, 2, 30, 0, 0, 160, 86, 3, 0, 85, 30, 24, 0, 1, 28, 0, 0, 1, 33, 16, 0, 2, 31, 0, 0, 96, 79, 1, 0, 41, 32, 24, 2, 94, 31, 31, 32, 135, 30, 8, 0, 28, 33, 31, 0, 135, 30, 11, 0, 2, 30, 0, 0, 156, 86, 3, 0, 135, 31, 17, 0, 27, 31, 31, 7, 29, 31, 31, 100, 85, 30, 31, 0, 2, 31, 0, 0, 92, 79, 1, 0, 1, 30, 35, 0, 85, 31, 30, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 33, 30, 30, 0, 120, 30, 210, 255, 135, 30, 18, 0, 41, 30, 30, 24, 42, 30, 30, 24, 120, 30, 30, 1, 47, 30, 1, 5, 240, 12, 0, 0, 25, 1, 1, 1, 119, 0, 171, 255, 119, 0, 1, 0, 1, 30, 99, 0, 47, 30, 30, 5, 96, 13, 0, 0, 1, 31, 30, 0, 135, 30, 16, 0, 31, 0, 0, 0, 135, 30, 19, 0, 1, 30, 16, 39, 3, 0, 0, 30, 85, 12, 0, 0, 2, 31, 0, 0, 25, 117, 1, 0, 135, 30, 10, 0, 13, 31, 12, 0, 1, 31, 36, 0, 135, 33, 13, 0, 13, 0, 0, 0, 41, 33, 33, 1, 4, 31, 31, 33, 1, 33, 7, 0, 135, 30, 9, 0, 31, 33, 13, 0, 135, 30, 11, 0, 1, 33, 48, 0, 135, 30, 14, 0, 33, 0, 0, 0, 119, 0, 11, 0, 120, 5, 9, 0, 1, 33, 30, 0, 135, 30, 16, 0, 33, 0, 0, 0, 135, 30, 19, 0, 1, 33, 47, 0, 135, 30, 14, 0, 33, 0, 0, 0, 119, 0, 2, 0, 1, 20, 69, 0, 32, 30, 20, 69, 121, 30, 4, 0, 1, 33, 43, 0, 135, 30, 14, 0, 33, 0, 0, 0, 135, 30, 11, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 121, 30, 48, 0, 1, 33, 5, 0, 135, 30, 16, 0, 33, 0, 0, 0, 135, 30, 17, 0, 27, 30, 30, 7, 29, 24, 30, 100, 2, 30, 0, 0, 92, 79, 1, 0, 82, 30, 30, 0, 2, 33, 0, 0, 156, 86, 3, 0, 82, 33, 33, 0, 4, 33, 24, 33, 47, 30, 30, 33, 88, 14, 0, 0, 2, 30, 0, 0, 160, 86, 3, 0, 82, 30, 30, 0, 40, 30, 30, 1, 0, 24, 30, 0, 2, 30, 0, 0, 160, 86, 3, 0, 85, 30, 24, 0, 1, 33, 0, 0, 1, 31, 16, 0, 2, 28, 0, 0, 96, 79, 1, 0, 41, 32, 24, 2, 94, 28, 28, 32, 135, 30, 8, 0, 33, 31, 28, 0, 135, 30, 11, 0, 2, 30, 0, 0, 156, 86, 3, 0, 135, 28, 17, 0, 27, 28, 28, 7, 29, 28, 28, 100, 85, 30, 28, 0, 2, 28, 0, 0, 92, 79, 1, 0, 1, 30, 35, 0, 85, 28, 30, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 33, 30, 30, 0, 120, 30, 210, 255, 34, 30, 2, 0, 121, 30, 3, 0, 1, 20, 92, 0, 119, 0, 126, 0, 1, 1, 0, 0, 85, 14, 1, 0, 2, 28, 0, 0, 186, 116, 1, 0, 135, 30, 10, 0, 13, 28, 14, 0, 1, 28, 37, 0, 135, 31, 13, 0, 13, 0, 0, 0, 41, 31, 31, 1, 4, 28, 28, 31, 1, 31, 18, 0, 135, 30, 9, 0, 28, 31, 13, 0, 31, 30, 1, 10, 120, 30, 4, 0, 1, 31, 42, 0, 135, 30, 14, 0, 31, 0, 0, 0, 38, 30, 1, 1, 32, 30, 30, 0, 2, 31, 0, 0, 33, 87, 1, 0, 78, 31, 31, 0, 32, 31, 31, 0, 20, 30, 30, 31, 121, 30, 2, 0, 135, 30, 11, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 121, 30, 48, 0, 1, 31, 5, 0, 135, 30, 16, 0, 31, 0, 0, 0, 135, 30, 17, 0, 27, 30, 30, 7, 29, 24, 30, 100, 2, 30, 0, 0, 92, 79, 1, 0, 82, 30, 30, 0, 2, 31, 0, 0, 156, 86, 3, 0, 82, 31, 31, 0, 4, 31, 24, 31, 47, 30, 30, 31, 164, 15, 0, 0, 2, 30, 0, 0, 160, 86, 3, 0, 82, 30, 30, 0, 40, 30, 30, 1, 0, 24, 30, 0, 2, 30, 0, 0, 160, 86, 3, 0, 85, 30, 24, 0, 1, 31, 0, 0, 1, 28, 16, 0, 2, 33, 0, 0, 96, 79, 1, 0, 41, 32, 24, 2, 94, 33, 33, 32, 135, 30, 8, 0, 31, 28, 33, 0, 135, 30, 11, 0, 2, 30, 0, 0, 156, 86, 3, 0, 135, 33, 17, 0, 27, 33, 33, 7, 29, 33, 33, 100, 85, 30, 33, 0, 2, 33, 0, 0, 92, 79, 1, 0, 1, 30, 35, 0, 85, 33, 30, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 33, 30, 30, 0, 120, 30, 210, 255, 135, 30, 18, 0, 41, 30, 30, 24, 42, 30, 30, 24, 120, 30, 100, 0, 47, 30, 1, 2, 216, 15, 0, 0, 25, 1, 1, 1, 119, 0, 171, 255, 119, 0, 1, 0, 1, 30, 99, 0, 47, 30, 30, 2, 72, 16, 0, 0, 1, 33, 30, 0, 135, 30, 16, 0, 33, 0, 0, 0, 135, 30, 19, 0, 1, 30, 16, 39, 3, 30, 0, 30, 85, 15, 30, 0, 2, 33, 0, 0, 25, 117, 1, 0, 135, 30, 10, 0, 13, 33, 15, 0, 1, 33, 36, 0, 135, 28, 13, 0, 13, 0, 0, 0, 41, 28, 28, 1, 4, 33, 33, 28, 1, 28, 7, 0, 135, 30, 9, 0, 33, 28, 13, 0, 135, 30, 11, 0, 1, 28, 48, 0, 135, 30, 14, 0, 28, 0, 0, 0, 119, 0, 11, 0, 120, 2, 9, 0, 1, 28, 30, 0, 135, 30, 16, 0, 28, 0, 0, 0, 135, 30, 19, 0, 1, 28, 47, 0, 135, 30, 14, 0, 28, 0, 0, 0, 119, 0, 2, 0, 1, 20, 92, 0, 32, 30, 20, 92, 121, 30, 4, 0, 1, 28, 43, 0, 135, 30, 14, 0, 28, 0, 0, 0, 135, 30, 11, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 121, 30, 48, 0, 1, 28, 5, 0, 135, 30, 16, 0, 28, 0, 0, 0, 135, 30, 17, 0, 27, 30, 30, 7, 29, 24, 30, 100, 2, 30, 0, 0, 92, 79, 1, 0, 82, 30, 30, 0, 2, 28, 0, 0, 156, 86, 3, 0, 82, 28, 28, 0, 4, 28, 24, 28, 47, 30, 30, 28, 64, 17, 0, 0, 2, 30, 0, 0, 160, 86, 3, 0, 82, 30, 30, 0, 40, 30, 30, 1, 0, 24, 30, 0, 2, 30, 0, 0, 160, 86, 3, 0, 85, 30, 24, 0, 1, 28, 0, 0, 1, 33, 16, 0, 2, 31, 0, 0, 96, 79, 1, 0, 41, 32, 24, 2, 94, 31, 31, 32, 135, 30, 8, 0, 28, 33, 31, 0, 135, 30, 11, 0, 2, 30, 0, 0, 156, 86, 3, 0, 135, 31, 17, 0, 27, 31, 31, 7, 29, 31, 31, 100, 85, 30, 31, 0, 2, 31, 0, 0, 92, 79, 1, 0, 1, 30, 35, 0, 85, 31, 30, 0, 135, 30, 15, 0, 41, 30, 30, 16, 42, 30, 30, 16, 33, 30, 30, 0, 120, 30, 210, 255, 85, 16, 8, 0, 2, 31, 0, 0, 186, 116, 1, 0, 135, 30, 10, 0, 13, 31, 16, 0, 1, 31, 37, 0, 135, 33, 13, 0, 13, 0, 0, 0, 41, 33, 33, 1, 4, 31, 31, 33, 1, 33, 14, 0, 135, 30, 9, 0, 31, 33, 13, 0, 85, 17, 5, 0, 2, 33, 0, 0, 186, 116, 1, 0, 135, 30, 10, 0, 13, 33, 17, 0, 1, 33, 37, 0, 135, 31, 13, 0, 13, 0, 0, 0, 41, 31, 31, 1, 4, 33, 33, 31, 1, 31, 16, 0, 135, 30, 9, 0, 33, 31, 13, 0, 85, 18, 2, 0, 2, 31, 0, 0, 186, 116, 1, 0, 135, 30, 10, 0, 13, 31, 18, 0, 1, 31, 37, 0, 135, 33, 13, 0, 13, 0, 0, 0, 41, 33, 33, 1, 4, 31, 31, 33, 1, 33, 18, 0, 135, 30, 9, 0, 31, 33, 13, 0, 1, 33, 99, 0, 15, 33, 33, 8, 1, 31, 16, 39, 1, 28, 0, 0, 125, 30, 33, 31, 28, 0, 0, 0, 3, 30, 30, 3, 1, 31, 99, 0, 15, 31, 31, 5, 1, 33, 16, 39, 1, 32, 0, 0, 125, 28, 31, 33, 32, 0, 0, 0, 3, 30, 30, 28, 1, 32, 99, 0, 15, 32, 32, 2, 1, 33, 16, 39, 1, 31, 0, 0, 125, 28, 32, 33, 31, 0, 0, 0, 3, 24, 30, 28, 135, 28, 20, 0, 24, 0, 0, 0, 85, 19, 24, 0, 2, 30, 0, 0, 25, 117, 1, 0, 135, 28, 10, 0, 13, 30, 19, 0, 1, 30, 36, 0, 135, 31, 13, 0, 13, 0, 0, 0, 41, 31, 31, 1, 4, 30, 30, 31, 1, 31, 7, 0, 135, 28, 9, 0, 30, 31, 13, 0, 2, 28, 0, 0, 68, 85, 3, 0, 82, 24, 28, 0, 2, 28, 0, 0, 48, 158, 2, 0, 41, 31, 24, 4, 3, 24, 28, 31, 85, 24, 8, 0, 109, 24, 4, 5, 109, 24, 8, 2, 27, 28, 9, 60, 3, 28, 28, 10, 109, 24, 12, 28, 119, 0, 23, 0, 1, 31, 14, 0, 1, 30, 4, 0, 2, 33, 0, 0, 29, 117, 1, 0, 135, 28, 9, 0, 31, 30, 33, 0, 1, 33, 10, 0, 1, 30, 16, 0, 2, 31, 0, 0, 54, 117, 1, 0, 135, 28, 9, 0, 33, 30, 31, 0, 135, 28, 11, 0, 1, 31, 0, 0, 1, 30, 255, 0, 1, 33, 208, 13, 1, 32, 30, 0, 135, 28, 12, 0, 31, 30, 33, 32, 1, 32, 152, 58, 135, 28, 20, 0, 32, 0, 0, 0, 135, 28, 21, 0, 135, 28, 11, 0, 2, 28, 0, 0, 156, 86, 3, 0, 135, 32, 17, 0, 27, 32, 32, 7, 29, 32, 32, 100, 85, 28, 32, 0, 135, 32, 7, 0, 135, 32, 18, 0, 41, 32, 32, 24, 42, 32, 32, 24, 121, 32, 17, 0, 1, 28, 0, 0, 1, 33, 255, 0, 1, 30, 0, 0, 1, 31, 0, 0, 1, 29, 0, 0, 1, 34, 30, 0, 135, 32, 22, 0, 28, 33, 30, 31, 29, 34, 0, 0, 135, 32, 23, 0, 1, 34, 55, 0, 1, 29, 97, 0, 135, 32, 24, 0, 34, 29, 0, 0, 137, 21, 0, 0, 139, 0, 0, 0, 1, 29, 5, 0, 135, 32, 16, 0, 29, 0, 0, 0, 135, 32, 17, 0, 27, 32, 32, 7, 29, 24, 32, 100, 2, 32, 0, 0, 92, 79, 1, 0, 82, 32, 32, 0, 2, 29, 0, 0, 156, 86, 3, 0, 82, 29, 29, 0, 4, 29, 24, 29, 47, 32, 32, 29, 44, 20, 0, 0, 2, 32, 0, 0, 160, 86, 3, 0, 82, 32, 32, 0, 40, 32, 32, 1, 0, 24, 32, 0, 2, 32, 0, 0, 160, 86, 3, 0, 85, 32, 24, 0, 1, 29, 0, 0, 1, 34, 16, 0, 2, 31, 0, 0, 96, 79, 1, 0, 41, 30, 24, 2, 94, 31, 31, 30, 135, 32, 8, 0, 29, 34, 31, 0, 135, 32, 11, 0, 2, 32, 0, 0, 156, 86, 3, 0, 135, 31, 17, 0, 27, 31, 31, 7, 29, 31, 31, 100, 85, 32, 31, 0, 2, 31, 0, 0, 92, 79, 1, 0, 1, 32, 35, 0, 85, 31, 32, 0, 135, 32, 18, 0, 41, 32, 32, 24, 42, 32, 32, 24, 121, 32, 211, 255, 1, 31, 0, 0, 1, 34, 255, 0, 1, 29, 0, 0, 1, 30, 0, 0, 1, 33, 0, 0, 1, 28, 30, 0, 135, 32, 22, 0, 31, 34, 29, 30, 33, 28, 0, 0, 135, 32, 23, 0, 1, 28, 55, 0, 1, 33, 97, 0, 135, 32, 24, 0, 28, 33, 0, 0, 137, 21, 0, 0, 139, 0, 0, 0, 140, 7, 51, 0, 0, 0, 0, 0, 2, 43, 0, 0, 255, 255, 0, 0, 2, 44, 0, 0, 3, 90, 3, 0, 2, 45, 0, 0, 82, 4, 0, 0, 2, 46, 0, 0, 80, 4, 0, 0, 2, 47, 0, 0, 81, 4, 0, 0, 1, 22, 0, 0, 136, 48, 0, 0, 0, 42, 48, 0, 136, 48, 0, 0, 1, 49, 160, 1, 3, 48, 48, 49, 137, 48, 0, 0, 130, 48, 0, 0, 136, 49, 0, 0, 49, 48, 48, 49, 228, 20, 0, 0, 1, 49, 160, 1, 135, 48, 0, 0, 49, 0, 0, 0, 1, 48, 134, 1, 3, 39, 42, 48, 1, 48, 132, 1, 3, 40, 42, 48, 1, 48, 0, 1, 3, 41, 42, 48, 1, 48, 128, 0, 3, 34, 42, 48, 0, 35, 42, 0, 1, 48, 130, 1, 3, 36, 42, 48, 1, 48, 128, 1, 3, 37, 42, 48, 1, 48, 136, 1, 3, 38, 42, 48, 120, 3, 4, 0, 1, 48, 0, 0, 83, 34, 48, 0, 119, 0, 3, 0, 135, 48, 25, 0, 34, 3, 0, 0, 1, 48, 0, 0, 83, 35, 48, 0, 135, 12, 13, 0, 34, 0, 0, 0, 135, 48, 17, 0, 27, 48, 48, 7, 29, 7, 48, 100, 2, 48, 0, 0, 230, 89, 3, 0, 1, 49, 0, 0, 83, 48, 49, 0, 2, 49, 0, 0, 96, 85, 3, 0, 1, 48, 0, 0, 85, 49, 48, 0, 25, 31, 38, 16, 26, 32, 0, 1, 25, 33, 38, 1, 41, 48, 4, 24, 42, 48, 48, 24, 0, 29, 48, 0, 33, 26, 29, 0, 25, 27, 38, 2, 32, 28, 6, 0, 32, 29, 29, 0, 32, 30, 5, 0, 0, 13, 7, 0, 25, 11, 7, 17, 0, 15, 7, 0, 1, 24, 0, 0, 1, 21, 0, 0, 1, 16, 1, 0, 1, 14, 0, 0, 1, 4, 8, 0, 135, 48, 26, 0, 38, 0, 0, 0, 41, 48, 24, 24, 42, 48, 48, 24, 121, 48, 42, 0, 135, 48, 25, 0, 41, 34, 0, 0, 19, 48, 12, 43, 1, 49, 0, 0, 95, 41, 48, 49, 135, 49, 27, 0, 41, 39, 40, 0, 2, 49, 0, 0, 216, 85, 3, 0, 81, 48, 39, 0, 3, 48, 32, 48, 85, 49, 48, 0, 2, 48, 0, 0, 220, 85, 3, 0, 85, 48, 1, 0, 2, 48, 0, 0, 2, 90, 3, 0, 78, 48, 48, 0, 40, 48, 48, 1, 0, 25, 48, 0, 2, 48, 0, 0, 2, 90, 3, 0, 83, 48, 25, 0, 41, 48, 25, 24, 42, 48, 48, 24, 120, 48, 12, 0, 78, 25, 44, 0, 2, 48, 0, 0, 4, 90, 3, 0, 78, 48, 48, 0, 83, 44, 48, 0, 2, 49, 0, 0, 170, 86, 1, 0, 135, 48, 28, 0, 49, 0, 0, 0, 83, 44, 25, 0, 119, 0, 5, 0, 2, 49, 0, 0, 170, 86, 1, 0, 135, 48, 28, 0, 49, 0, 0, 0, 2, 48, 0, 0, 96, 85, 3, 0, 82, 19, 48, 0, 2, 48, 0, 0, 96, 85, 3, 0, 1, 49, 0, 0, 85, 48, 49, 0, 2, 49, 0, 0, 230, 89, 3, 0, 78, 20, 49, 0, 2, 49, 0, 0, 230, 89, 3, 0, 1, 48, 0, 0, 83, 49, 48, 0, 135, 48, 17, 0, 27, 48, 48, 7, 29, 25, 48, 100, 79, 48, 31, 0, 103, 49, 31, 1, 41, 49, 49, 8, 20, 48, 48, 49, 103, 49, 31, 2, 41, 49, 49, 16, 20, 48, 48, 49, 103, 49, 31, 3, 41, 49, 49, 24, 20, 48, 48, 49, 0, 8, 48, 0, 13, 3, 8, 4, 121, 3, 15, 0, 1, 48, 17, 0, 4, 49, 25, 15, 16, 48, 48, 49, 1, 49, 8, 0, 4, 50, 25, 13, 16, 49, 49, 50, 19, 48, 48, 49, 121, 48, 3, 0, 1, 22, 12, 0, 119, 0, 6, 0, 1, 10, 1, 0, 0, 18, 16, 0, 0, 23, 4, 0, 119, 0, 2, 0, 1, 22, 12, 0, 32, 48, 22, 12, 121, 48, 175, 0, 125, 9, 3, 15, 25, 0, 0, 0, 1, 49, 0, 0, 1, 48, 7, 0, 138, 8, 49, 48, 124, 23, 0, 0, 100, 23, 0, 0, 24, 24, 0, 0, 100, 23, 0, 0, 232, 24, 0, 0, 100, 23, 0, 0, 132, 25, 0, 0, 1, 10, 1, 0, 0, 13, 25, 0, 0, 18, 16, 0, 0, 23, 8, 0, 0, 15, 9, 0, 119, 0, 157, 0, 3, 4, 34, 12, 78, 3, 4, 0, 41, 49, 3, 24, 42, 49, 49, 24, 120, 49, 25, 0, 135, 49, 27, 0, 34, 36, 37, 0, 49, 49, 5, 21, 184, 23, 0, 0, 1, 10, 1, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 23, 0, 0, 0, 15, 9, 0, 119, 0, 142, 0, 120, 28, 10, 0, 81, 49, 36, 0, 49, 49, 6, 49, 224, 23, 0, 0, 1, 10, 1, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 23, 0, 0, 0, 15, 9, 0, 119, 0, 132, 0, 25, 49, 12, 1, 1, 48, 0, 0, 95, 34, 49, 48, 78, 3, 4, 0, 1, 49, 1, 0, 135, 48, 29, 0, 3, 49, 0, 0, 83, 4, 48, 0, 1, 10, 0, 0, 0, 13, 25, 0, 1, 18, 1, 0, 1, 23, 0, 0, 0, 15, 9, 0, 119, 0, 118, 0, 1, 48, 126, 0, 47, 48, 48, 12, 60, 24, 0, 0, 1, 10, 1, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 23, 2, 0, 0, 15, 9, 0, 119, 0, 109, 0, 3, 3, 34, 12, 78, 48, 3, 0, 121, 48, 9, 0, 1, 10, 0, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 16, 1, 0, 1, 23, 2, 0, 0, 15, 9, 0, 25, 12, 12, 1, 119, 0, 98, 0, 135, 48, 27, 0, 34, 36, 37, 0, 49, 48, 5, 21, 144, 24, 0, 0, 1, 10, 1, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 23, 2, 0, 0, 15, 9, 0, 119, 0, 88, 0, 120, 28, 10, 0, 81, 48, 36, 0, 49, 48, 6, 48, 184, 24, 0, 0, 1, 10, 1, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 23, 2, 0, 0, 15, 9, 0, 119, 0, 78, 0, 1, 48, 32, 0, 83, 3, 48, 0, 25, 12, 12, 1, 1, 49, 0, 0, 95, 34, 12, 49, 1, 10, 0, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 16, 1, 0, 1, 23, 2, 0, 0, 15, 9, 0, 119, 0, 66, 0, 3, 4, 34, 12, 78, 3, 4, 0, 41, 48, 3, 24, 42, 48, 48, 24, 120, 48, 25, 0, 135, 48, 27, 0, 34, 36, 37, 0, 49, 48, 5, 21, 36, 25, 0, 0, 1, 10, 1, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 23, 4, 0, 0, 15, 9, 0, 119, 0, 51, 0, 120, 28, 10, 0, 81, 48, 36, 0, 49, 48, 6, 48, 76, 25, 0, 0, 1, 10, 1, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 23, 4, 0, 0, 15, 9, 0, 119, 0, 41, 0, 25, 48, 12, 1, 1, 49, 0, 0, 95, 34, 48, 49, 78, 3, 4, 0, 1, 48, 255, 255, 135, 49, 29, 0, 3, 48, 0, 0, 83, 4, 49, 0, 1, 10, 0, 0, 0, 13, 25, 0, 1, 18, 1, 0, 1, 23, 4, 0, 0, 15, 9, 0, 119, 0, 27, 0, 120, 12, 9, 0, 1, 10, 0, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 16, 1, 0, 1, 23, 6, 0, 0, 15, 9, 0, 1, 12, 0, 0, 119, 0, 18, 0, 3, 3, 34, 12, 78, 48, 3, 0, 32, 48, 48, 32, 121, 48, 6, 0, 25, 48, 12, 1, 90, 48, 34, 48, 120, 48, 3, 0, 1, 48, 0, 0, 83, 3, 48, 0, 1, 10, 0, 0, 0, 13, 25, 0, 0, 18, 16, 0, 1, 16, 1, 0, 1, 23, 6, 0, 0, 15, 9, 0, 26, 12, 12, 1, 119, 0, 1, 0, 1, 49, 17, 0, 4, 48, 25, 11, 47, 49, 49, 48, 184, 26, 0, 0, 78, 49, 38, 0, 120, 49, 4, 0, 0, 4, 14, 0, 1, 3, 0, 0, 119, 0, 6, 0, 135, 49, 25, 0, 2, 34, 0, 0, 1, 10, 0, 0, 1, 4, 1, 0, 1, 3, 1, 0, 78, 49, 33, 0, 33, 49, 49, 0, 19, 49, 26, 49, 0, 9, 49, 0, 1, 49, 1, 0, 125, 8, 9, 49, 3, 0, 0, 0, 1, 49, 0, 0, 125, 14, 9, 49, 4, 0, 0, 0, 78, 49, 27, 0, 120, 49, 7, 0, 1, 49, 0, 0, 125, 10, 9, 49, 10, 0, 0, 0, 0, 17, 8, 0, 1, 22, 43, 0, 119, 0, 22, 0, 3, 3, 34, 12, 120, 12, 8, 0, 0, 11, 25, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 1, 3, 0, 0, 1, 22, 63, 0, 119, 0, 13, 0, 26, 48, 3, 1, 135, 49, 25, 0, 48, 3, 0, 0, 0, 11, 25, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 26, 3, 12, 1, 1, 22, 64, 0, 119, 0, 3, 0, 1, 17, 0, 0, 1, 22, 43, 0, 32, 49, 22, 43, 121, 49, 21, 5, 41, 49, 10, 24, 42, 49, 49, 24, 120, 49, 8, 0, 0, 9, 21, 0, 0, 4, 16, 0, 0, 10, 14, 0, 0, 8, 17, 0, 0, 3, 12, 0, 1, 22, 63, 0, 119, 0, 11, 5, 1, 48, 8, 0, 1, 49, 86, 4, 138, 19, 48, 49, 96, 45, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 172, 45, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 208, 45, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 252, 45, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0], eb + 0);
    HEAPU8.set([84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 76, 46, 0, 0, 80, 46, 0, 0, 108, 46, 0, 0, 84, 44, 0, 0, 112, 46, 0, 0, 144, 46, 0, 0, 148, 46, 0, 0, 188, 46, 0, 0, 244, 46, 0, 0, 248, 46, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 84, 44, 0, 0, 252, 46, 0, 0, 41, 49, 20, 24, 42, 49, 49, 24, 120, 49, 8, 0, 0, 9, 21, 0, 0, 4, 16, 0, 0, 10, 14, 0, 0, 8, 17, 0, 0, 3, 12, 0, 1, 22, 63, 0, 119, 0, 168, 0, 135, 9, 13, 0, 34, 0, 0, 0, 135, 49, 27, 0, 34, 36, 37, 0, 34, 49, 9, 127, 41, 50, 20, 24, 42, 50, 50, 24, 135, 48, 30, 0, 50, 0, 0, 0, 33, 48, 48, 0, 19, 49, 49, 48, 15, 48, 9, 5, 20, 48, 30, 48, 19, 49, 49, 48, 120, 49, 7, 0, 0, 4, 16, 0, 0, 10, 14, 0, 0, 8, 17, 0, 0, 3, 12, 0, 1, 22, 63, 0, 119, 0, 147, 0, 120, 28, 10, 0, 81, 49, 36, 0, 49, 49, 6, 49, 248, 44, 0, 0, 0, 4, 16, 0, 0, 10, 14, 0, 0, 8, 17, 0, 0, 3, 12, 0, 1, 22, 63, 0, 119, 0, 137, 0, 25, 3, 9, 1, 19, 49, 3, 43, 0, 8, 49, 0, 47, 49, 12, 8, 68, 45, 0, 0, 19, 49, 3, 43, 0, 4, 49, 0, 0, 3, 8, 0, 26, 48, 3, 1, 90, 48, 34, 48, 95, 34, 3, 48, 26, 48, 4, 1, 41, 48, 48, 16, 42, 48, 48, 16, 0, 4, 48, 0, 19, 48, 4, 43, 0, 3, 48, 0, 54, 48, 12, 3, 24, 45, 0, 0, 95, 34, 12, 20, 0, 4, 16, 0, 0, 10, 14, 0, 0, 8, 17, 0, 25, 3, 12, 1, 1, 22, 64, 0, 119, 0, 111, 0, 3, 3, 34, 12, 120, 12, 8, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 0, 8, 17, 0, 1, 3, 0, 0, 1, 22, 63, 0, 119, 0, 102, 0, 26, 48, 3, 1, 135, 49, 25, 0, 48, 3, 0, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 0, 8, 17, 0, 26, 3, 12, 1, 1, 22, 64, 0, 119, 0, 92, 0, 135, 49, 25, 0, 2, 34, 0, 0, 0, 9, 21, 0, 0, 4, 16, 0, 1, 10, 1, 0, 1, 8, 1, 0, 0, 3, 12, 0, 1, 22, 63, 0, 119, 0, 83, 0, 0, 9, 21, 0, 0, 4, 16, 0, 1, 49, 0, 0, 125, 10, 29, 14, 49, 0, 0, 0, 1, 49, 1, 0, 125, 8, 29, 17, 49, 0, 0, 0, 0, 3, 12, 0, 1, 22, 63, 0, 119, 0, 72, 0, 3, 3, 34, 12, 78, 49, 3, 0, 120, 49, 8, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 0, 8, 17, 0, 0, 3, 12, 0, 1, 22, 63, 0, 119, 0, 62, 0, 25, 48, 3, 1, 135, 49, 25, 0, 3, 48, 0, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 0, 8, 17, 0, 0, 3, 12, 0, 1, 22, 64, 0, 119, 0, 52, 0, 119, 0, 44, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 0, 8, 17, 0, 1, 3, 0, 0, 1, 22, 63, 0, 119, 0, 44, 0, 119, 0, 36, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 0, 8, 17, 0, 135, 3, 13, 0, 34, 0, 0, 0, 1, 22, 63, 0, 119, 0, 35, 0, 119, 0, 27, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 0, 8, 17, 0, 90, 49, 34, 12, 33, 49, 49, 0, 38, 49, 49, 1, 3, 3, 12, 49, 1, 22, 63, 0, 119, 0, 24, 0, 0, 9, 21, 0, 1, 4, 1, 0, 0, 10, 14, 0, 0, 8, 17, 0, 32, 48, 12, 0, 121, 48, 4, 0, 1, 48, 0, 0, 0, 49, 48, 0, 119, 0, 3, 0, 26, 48, 12, 1, 0, 49, 48, 0, 0, 3, 49, 0, 1, 22, 63, 0, 119, 0, 10, 0, 119, 0, 2, 0, 119, 0, 1, 0, 0, 9, 21, 0, 0, 4, 16, 0, 0, 10, 14, 0, 0, 8, 17, 0, 0, 3, 12, 0, 1, 22, 63, 0, 119, 0, 1, 0, 32, 48, 22, 63, 121, 48, 8, 0, 1, 22, 0, 0, 41, 48, 18, 24, 42, 48, 48, 24, 120, 48, 3, 0, 0, 12, 3, 0, 119, 0, 2, 0, 1, 22, 64, 0, 32, 48, 22, 64, 121, 48, 27, 0, 1, 22, 0, 0, 2, 48, 0, 0, 216, 85, 3, 0, 85, 48, 0, 0, 2, 48, 0, 0, 220, 85, 3, 0, 85, 48, 1, 0, 78, 12, 44, 0, 2, 48, 0, 0, 4, 90, 3, 0, 78, 48, 48, 0, 83, 44, 48, 0, 135, 48, 28, 0, 35, 0, 0, 0, 83, 44, 12, 0, 135, 48, 25, 0, 35, 34, 0, 0, 2, 48, 0, 0, 216, 85, 3, 0, 85, 48, 0, 0, 2, 48, 0, 0, 220, 85, 3, 0, 85, 48, 1, 0, 135, 48, 28, 0, 34, 0, 0, 0, 0, 12, 3, 0, 41, 48, 4, 24, 42, 48, 48, 24, 32, 3, 48, 0, 1, 48, 0, 0, 125, 4, 3, 24, 48, 0, 0, 0, 121, 3, 3, 0, 0, 48, 7, 0, 119, 0, 3, 0, 26, 49, 25, 70, 0, 48, 49, 0, 0, 3, 48, 0, 1, 48, 35, 0, 4, 49, 25, 3, 48, 48, 48, 49, 252, 47, 0, 0, 0, 7, 25, 0, 40, 48, 4, 1, 0, 4, 48, 0, 119, 0, 5, 0, 1, 49, 5, 0, 135, 48, 16, 0, 49, 0, 0, 0, 0, 7, 3, 0, 41, 48, 4, 24, 42, 48, 48, 24, 32, 3, 48, 0, 120, 3, 42, 0, 135, 48, 25, 0, 41, 34, 0, 0, 19, 48, 12, 43, 1, 49, 0, 0, 95, 41, 48, 49, 135, 49, 27, 0, 41, 39, 40, 0, 2, 49, 0, 0, 216, 85, 3, 0, 81, 48, 39, 0, 3, 48, 32, 48, 85, 49, 48, 0, 2, 48, 0, 0, 220, 85, 3, 0, 85, 48, 1, 0, 2, 48, 0, 0, 2, 90, 3, 0, 78, 48, 48, 0, 40, 48, 48, 1, 0, 25, 48, 0, 2, 48, 0, 0, 2, 90, 3, 0, 83, 48, 25, 0, 41, 48, 25, 24, 42, 48, 48, 24, 120, 48, 12, 0, 78, 25, 44, 0, 2, 48, 0, 0, 4, 90, 3, 0, 78, 48, 48, 0, 83, 44, 48, 0, 2, 49, 0, 0, 170, 86, 1, 0, 135, 48, 28, 0, 49, 0, 0, 0, 83, 44, 25, 0, 119, 0, 5, 0, 2, 49, 0, 0, 170, 86, 1, 0, 135, 48, 28, 0, 49, 0, 0, 0, 135, 48, 11, 0, 41, 48, 8, 24, 42, 48, 48, 24, 120, 48, 7, 0, 0, 24, 4, 0, 0, 21, 9, 0, 1, 16, 0, 0, 0, 14, 10, 0, 0, 4, 23, 0, 119, 0, 55, 249, 120, 3, 42, 0, 135, 48, 25, 0, 41, 34, 0, 0, 19, 48, 12, 43, 1, 49, 0, 0, 95, 41, 48, 49, 135, 49, 27, 0, 41, 39, 40, 0, 2, 49, 0, 0, 216, 85, 3, 0, 81, 48, 39, 0, 3, 48, 32, 48, 85, 49, 48, 0, 2, 48, 0, 0, 220, 85, 3, 0, 85, 48, 1, 0, 2, 48, 0, 0, 2, 90, 3, 0, 78, 48, 48, 0, 40, 48, 48, 1, 0, 41, 48, 0, 2, 48, 0, 0, 2, 90, 3, 0, 83, 48, 41, 0, 41, 48, 41, 24, 42, 48, 48, 24, 120, 48, 12, 0, 78, 41, 44, 0, 2, 48, 0, 0, 4, 90, 3, 0, 78, 48, 48, 0, 83, 44, 48, 0, 2, 49, 0, 0, 170, 86, 1, 0, 135, 48, 28, 0, 49, 0, 0, 0, 83, 44, 41, 0, 119, 0, 5, 0, 2, 49, 0, 0, 170, 86, 1, 0, 135, 48, 28, 0, 49, 0, 0, 0, 41, 48, 10, 24, 42, 48, 48, 24, 121, 48, 5, 0, 135, 48, 11, 0, 135, 48, 6, 0, 137, 42, 0, 0, 139, 10, 0, 0, 2, 48, 0, 0, 216, 85, 3, 0, 85, 48, 0, 0, 2, 48, 0, 0, 220, 85, 3, 0, 85, 48, 1, 0, 135, 48, 28, 0, 35, 0, 0, 0, 135, 48, 11, 0, 135, 48, 6, 0, 137, 42, 0, 0, 139, 10, 0, 0, 140, 3, 39, 0, 0, 0, 0, 0, 2, 28, 0, 0, 255, 255, 0, 0, 2, 29, 0, 0, 211, 172, 1, 0, 2, 30, 0, 0, 212, 172, 1, 0, 1, 21, 0, 0, 136, 31, 0, 0, 0, 26, 31, 0, 136, 31, 0, 0, 25, 31, 31, 48, 137, 31, 0, 0, 130, 31, 0, 0, 136, 32, 0, 0, 49, 31, 31, 32, 48, 50, 0, 0, 1, 32, 48, 0, 135, 31, 0, 0, 32, 0, 0, 0, 25, 17, 26, 24, 0, 24, 26, 0, 25, 20, 26, 4, 25, 25, 0, 6, 79, 31, 25, 0, 103, 32, 25, 1, 41, 32, 32, 8, 20, 31, 31, 32, 41, 31, 31, 16, 42, 31, 31, 16, 0, 4, 31, 0, 79, 31, 0, 0, 103, 32, 0, 1, 41, 32, 32, 8, 20, 31, 31, 32, 38, 31, 31, 248, 41, 31, 31, 16, 42, 31, 31, 16, 0, 15, 31, 0, 25, 22, 0, 2, 79, 31, 22, 0, 103, 32, 22, 1, 41, 32, 32, 8, 20, 31, 31, 32, 41, 31, 31, 16, 42, 31, 31, 16, 26, 16, 31, 2, 27, 3, 4, 13, 3, 23, 16, 3, 85, 24, 23, 0, 1, 32, 23, 0, 135, 31, 8, 0, 15, 23, 32, 0, 27, 31, 4, 42, 3, 23, 1, 31, 2, 31, 0, 0, 3, 90, 3, 0, 2, 32, 0, 0, 96, 33, 1, 0, 79, 33, 23, 0, 103, 34, 23, 1, 41, 34, 34, 8, 20, 33, 33, 34, 41, 33, 33, 16, 42, 33, 33, 16, 41, 33, 33, 2, 94, 32, 32, 33, 83, 31, 32, 0, 2, 32, 0, 0, 4, 90, 3, 0, 1, 31, 45, 0, 83, 32, 31, 0, 2, 31, 0, 0, 136, 79, 1, 0, 82, 31, 31, 0, 121, 31, 30, 0, 25, 23, 0, 8, 2, 31, 0, 0, 166, 89, 3, 0, 79, 32, 23, 0, 103, 33, 23, 1, 41, 33, 33, 8, 20, 32, 32, 33, 19, 32, 32, 28, 79, 33, 0, 0, 103, 34, 0, 1, 41, 34, 34, 8, 20, 33, 33, 34, 19, 33, 33, 28, 3, 32, 32, 33, 84, 31, 32, 0, 2, 32, 0, 0, 168, 89, 3, 0, 79, 31, 22, 0, 103, 33, 22, 1, 41, 33, 33, 8, 20, 31, 31, 33, 19, 31, 31, 28, 3, 31, 3, 31, 84, 32, 31, 0, 27, 32, 4, 42, 3, 32, 1, 32, 25, 32, 32, 2, 135, 31, 31, 0, 32, 0, 0, 0, 33, 23, 2, 0, 121, 23, 4, 0, 38, 32, 2, 63, 135, 31, 32, 0, 32, 4, 0, 0, 135, 31, 11, 0, 135, 31, 17, 0, 27, 31, 31, 7, 29, 5, 31, 100, 135, 31, 6, 0, 25, 10, 20, 16, 25, 11, 0, 4, 26, 18, 15, 1, 25, 19, 0, 8, 25, 12, 20, 1, 25, 13, 17, 16, 25, 14, 17, 16, 1, 7, 8, 0, 1, 6, 23, 0, 0, 3, 4, 0, 135, 31, 17, 0, 27, 31, 31, 7, 29, 31, 31, 100, 4, 31, 31, 5, 47, 31, 7, 31, 68, 52, 0, 0, 135, 31, 17, 0, 27, 31, 31, 7, 29, 4, 31, 100, 32, 5, 6, 23, 1, 31, 24, 0, 1, 32, 23, 0, 125, 6, 5, 31, 32, 0, 0, 0, 82, 31, 24, 0, 135, 32, 8, 0, 15, 31, 6, 0, 121, 23, 4, 0, 38, 31, 2, 63, 135, 32, 32, 0, 31, 3, 0, 0, 135, 32, 11, 0, 0, 9, 4, 0, 1, 32, 8, 0, 1, 31, 70, 0, 125, 7, 5, 32, 31, 0, 0, 0, 119, 0, 5, 0, 1, 32, 5, 0, 135, 31, 16, 0, 32, 0, 0, 0, 0, 9, 5, 0, 2, 31, 0, 0, 229, 89, 3, 0, 78, 31, 31, 0, 121, 31, 29, 0, 2, 31, 0, 0, 124, 79, 1, 0, 82, 31, 31, 0, 1, 32, 0, 0, 1, 33, 2, 0, 138, 31, 32, 33, 136, 52, 0, 0, 144, 52, 0, 0, 119, 0, 5, 0, 135, 32, 33, 0, 119, 0, 3, 0, 135, 32, 34, 0, 119, 0, 1, 0, 2, 31, 0, 0, 124, 79, 1, 0, 2, 32, 0, 0, 124, 79, 1, 0, 82, 32, 32, 0, 40, 32, 32, 1, 85, 31, 32, 0, 1, 31, 3, 0, 135, 32, 16, 0, 31, 0, 0, 0, 135, 32, 6, 0, 2, 32, 0, 0, 229, 89, 3, 0, 1, 31, 0, 0, 83, 32, 31, 0, 2, 31, 0, 0, 230, 89, 3, 0, 78, 4, 31, 0, 41, 31, 4, 24, 42, 31, 31, 24, 121, 31, 191, 0, 1, 32, 96, 0, 41, 33, 4, 24, 42, 33, 33, 24, 47, 32, 32, 33, 32, 53, 0, 0, 1, 32, 255, 0, 19, 32, 4, 32, 1, 33, 224, 0, 3, 32, 32, 33, 1, 33, 255, 0, 19, 32, 32, 33, 0, 31, 32, 0, 119, 0, 2, 0, 0, 31, 4, 0, 0, 8, 31, 0, 25, 4, 3, 1, 79, 31, 11, 0, 103, 32, 11, 1, 41, 32, 32, 8, 20, 31, 31, 32, 41, 31, 31, 16, 42, 31, 31, 16, 0, 5, 31, 0, 47, 31, 4, 5, 148, 54, 0, 0, 27, 31, 4, 42, 3, 27, 1, 31, 79, 31, 27, 0, 103, 32, 27, 1, 41, 32, 32, 8, 20, 31, 31, 32, 41, 31, 31, 16, 42, 31, 31, 16, 121, 31, 8, 0, 27, 31, 4, 42, 3, 31, 1, 31, 102, 31, 31, 2, 41, 32, 8, 24, 42, 32, 32, 24, 52, 31, 31, 32, 160, 53, 0, 0, 25, 4, 4, 1, 56, 31, 5, 4, 148, 54, 0, 0, 119, 0, 237, 255, 82, 32, 24, 0, 1, 33, 25, 0, 1, 34, 16, 0, 1, 35, 45, 0, 135, 31, 3, 0, 18, 32, 33, 34, 35, 0, 0, 0, 27, 31, 3, 42, 3, 27, 1, 31, 0, 8, 27, 0, 2, 31, 0, 0, 3, 90, 3, 0, 2, 35, 0, 0, 112, 33, 1, 0, 79, 34, 8, 0, 103, 33, 8, 1, 41, 33, 33, 8, 20, 34, 34, 33, 41, 34, 34, 16, 42, 34, 34, 16, 41, 34, 34, 2, 94, 35, 35, 34, 83, 31, 35, 0, 2, 35, 0, 0, 4, 90, 3, 0, 1, 31, 45, 0, 83, 35, 31, 0, 2, 31, 0, 0, 166, 89, 3, 0, 79, 35, 19, 0, 103, 34, 19, 1, 41, 34, 34, 8, 20, 35, 35, 34, 19, 35, 35, 28, 79, 34, 0, 0, 103, 33, 0, 1, 41, 33, 33, 8, 20, 34, 34, 33, 19, 34, 34, 28, 3, 35, 35, 34, 84, 31, 35, 0, 2, 35, 0, 0, 168, 89, 3, 0, 27, 31, 3, 13, 79, 34, 22, 0, 103, 33, 22, 1, 41, 33, 33, 8, 20, 34, 34, 33, 19, 34, 34, 28, 3, 31, 31, 34, 84, 35, 31, 0, 25, 35, 27, 2, 135, 31, 31, 0, 35, 0, 0, 0, 135, 31, 11, 0, 135, 31, 35, 0, 0, 1, 15, 24, 4, 16, 2, 0, 135, 31, 6, 0, 0, 3, 4, 0, 119, 0, 85, 0, 1, 31, 0, 0, 47, 31, 31, 3, 228, 55, 0, 0, 1, 4, 0, 0, 27, 31, 4, 42, 3, 27, 1, 31, 79, 31, 27, 0, 103, 35, 27, 1, 41, 35, 35, 8, 20, 31, 31, 35, 41, 31, 31, 16, 42, 31, 31, 16, 121, 31, 8, 0, 27, 31, 4, 42, 3, 31, 1, 31, 102, 31, 31, 2, 41, 35, 8, 24, 42, 35, 35, 24, 52, 31, 31, 35, 244, 54, 0, 0, 25, 4, 4, 1, 56, 31, 3, 4, 228, 55, 0, 0, 119, 0, 237, 255, 82, 35, 24, 0, 1, 34, 25, 0, 1, 33, 16, 0, 1, 32, 45, 0, 135, 31, 3, 0, 18, 35, 34, 33, 32, 0, 0, 0, 27, 31, 3, 42, 3, 27, 1, 31, 0, 8, 27, 0, 2, 31, 0, 0, 3, 90, 3, 0, 2, 32, 0, 0, 112, 33, 1, 0, 79, 33, 8, 0, 103, 34, 8, 1, 41, 34, 34, 8, 20, 33, 33, 34, 41, 33, 33, 16, 42, 33, 33, 16, 41, 33, 33, 2, 94, 32, 32, 33, 83, 31, 32, 0, 2, 32, 0, 0, 4, 90, 3, 0, 1, 31, 45, 0, 83, 32, 31, 0, 2, 31, 0, 0, 166, 89, 3, 0, 79, 32, 19, 0, 103, 33, 19, 1, 41, 33, 33, 8, 20, 32, 32, 33, 19, 32, 32, 28, 79, 33, 0, 0, 103, 34, 0, 1, 41, 34, 34, 8, 20, 33, 33, 34, 19, 33, 33, 28, 3, 32, 32, 33, 84, 31, 32, 0, 2, 32, 0, 0, 168, 89, 3, 0, 27, 31, 3, 13, 79, 33, 22, 0, 103, 34, 22, 1, 41, 34, 34, 8, 20, 33, 33, 34, 19, 33, 33, 28, 3, 31, 31, 33, 84, 32, 31, 0, 25, 32, 27, 2, 135, 31, 31, 0, 32, 0, 0, 0, 135, 31, 11, 0, 135, 31, 35, 0, 0, 1, 15, 24, 4, 16, 2, 0, 135, 31, 6, 0, 0, 3, 4, 0, 135, 31, 26, 0, 20, 0, 0, 0, 79, 31, 10, 0, 103, 32, 10, 1, 41, 32, 32, 8, 20, 31, 31, 32, 103, 32, 10, 2, 41, 32, 32, 16, 20, 31, 31, 32, 103, 32, 10, 3, 41, 32, 32, 24, 20, 31, 31, 32, 1, 32, 0, 0, 1, 33, 5, 0, 138, 31, 32, 33, 60, 56, 0, 0, 52, 56, 0, 0, 52, 56, 0, 0, 52, 56, 0, 0, 56, 58, 0, 0, 0, 8, 3, 0, 119, 0, 13, 1, 82, 4, 24, 0, 1, 33, 25, 0, 1, 34, 16, 0, 1, 35, 45, 0, 135, 32, 3, 0, 18, 4, 33, 34, 35, 0, 0, 0, 27, 32, 3, 42, 3, 27, 1, 32, 0, 8, 27, 0, 2, 32, 0, 0, 3, 90, 3, 0, 2, 35, 0, 0, 112, 33, 1, 0, 79, 34, 8, 0, 103, 33, 8, 1, 41, 33, 33, 8, 20, 34, 34, 33, 41, 34, 34, 16, 42, 34, 34, 16, 41, 34, 34, 2, 94, 35, 35, 34, 83, 32, 35, 0, 2, 35, 0, 0, 4, 90, 3, 0, 1, 32, 45, 0, 83, 35, 32, 0, 2, 32, 0, 0, 166, 89, 3, 0, 79, 35, 19, 0, 103, 34, 19, 1, 41, 34, 34, 8, 20, 35, 35, 34, 19, 35, 35, 28, 79, 34, 0, 0, 103, 33, 0, 1, 41, 33, 33, 8, 20, 34, 34, 33, 19, 34, 34, 28, 3, 35, 35, 34, 84, 32, 35, 0, 2, 35, 0, 0, 168, 89, 3, 0, 27, 32, 3, 13, 79, 34, 22, 0, 103, 33, 22, 1, 41, 33, 33, 8, 20, 34, 34, 33, 19, 34, 34, 28, 3, 32, 32, 34, 84, 35, 32, 0, 25, 35, 27, 2, 135, 32, 31, 0, 35, 0, 0, 0, 135, 32, 11, 0, 121, 3, 23, 0, 27, 32, 3, 42, 3, 32, 1, 32, 26, 27, 32, 42, 79, 32, 27, 0, 103, 35, 27, 1, 41, 35, 35, 8, 20, 32, 32, 35, 41, 32, 32, 16, 42, 32, 32, 16, 121, 32, 13, 0, 26, 27, 4, 6, 85, 24, 27, 0, 1, 35, 23, 0, 135, 32, 8, 0, 15, 27, 35, 0, 135, 32, 11, 0, 1, 35, 5, 0, 135, 32, 14, 0, 35, 0, 0, 0, 1, 35, 114, 0, 135, 32, 16, 0, 35, 0, 0, 0, 120, 3, 8, 0, 79, 32, 11, 0, 103, 35, 11, 1, 41, 35, 35, 8, 20, 32, 32, 35, 41, 32, 32, 16, 42, 32, 32, 16, 0, 3, 32, 0, 26, 3, 3, 1, 27, 32, 3, 42, 3, 27, 1, 32, 79, 32, 27, 0, 103, 35, 27, 1, 41, 35, 35, 8, 20, 32, 32, 35, 41, 32, 32, 16, 42, 32, 32, 16, 121, 32, 239, 255, 135, 32, 35, 0, 0, 1, 15, 24, 3, 16, 2, 0, 135, 32, 17, 0, 27, 32, 32, 7, 29, 4, 32, 100, 1, 35, 5, 0, 135, 32, 16, 0, 35, 0, 0, 0, 135, 32, 26, 0, 17, 0, 0, 0, 135, 32, 17, 0, 27, 32, 32, 7, 29, 32, 32, 100, 4, 32, 32, 4, 34, 27, 32, 20, 79, 32, 14, 0, 103, 35, 14, 1, 41, 35, 35, 8, 20, 32, 32, 35, 103, 35, 14, 2, 41, 35, 35, 16, 20, 32, 32, 35, 103, 35, 14, 3, 41, 35, 35, 24, 20, 32, 32, 35, 33, 32, 32, 8, 19, 32, 32, 27, 120, 32, 234, 255, 0, 8, 3, 0, 119, 0, 142, 0, 82, 5, 24, 0, 1, 35, 25, 0, 1, 34, 16, 0, 1, 33, 45, 0, 135, 32, 3, 0, 18, 5, 35, 34, 33, 0, 0, 0, 27, 32, 3, 42, 3, 4, 1, 32, 0, 27, 4, 0, 2, 32, 0, 0, 3, 90, 3, 0, 2, 33, 0, 0, 112, 33, 1, 0, 79, 34, 27, 0, 103, 35, 27, 1, 41, 35, 35, 8, 20, 34, 34, 35, 41, 34, 34, 16, 42, 34, 34, 16, 41, 34, 34, 2, 94, 33, 33, 34, 83, 32, 33, 0, 2, 33, 0, 0, 4, 90, 3, 0, 1, 32, 45, 0, 83, 33, 32, 0, 2, 32, 0, 0, 166, 89, 3, 0, 79, 33, 19, 0, 103, 34, 19, 1, 41, 34, 34, 8, 20, 33, 33, 34, 19, 33, 33, 28, 79, 34, 0, 0, 103, 35, 0, 1, 41, 35, 35, 8, 20, 34, 34, 35, 19, 34, 34, 28, 3, 33, 33, 34, 84, 32, 33, 0, 2, 33, 0, 0, 168, 89, 3, 0, 27, 32, 3, 13, 79, 34, 22, 0, 103, 35, 22, 1, 41, 35, 35, 8, 20, 34, 34, 35, 19, 34, 34, 28, 3, 32, 32, 34, 84, 33, 32, 0, 25, 33, 4, 2, 135, 32, 31, 0, 33, 0, 0, 0, 135, 32, 11, 0, 79, 32, 11, 0, 103, 33, 11, 1, 41, 33, 33, 8, 20, 32, 32, 33, 41, 32, 32, 16, 42, 32, 32, 16, 26, 4, 32, 1, 46, 32, 3, 4, 172, 59, 0, 0, 27, 32, 3, 42, 3, 32, 1, 32, 25, 27, 32, 42, 79, 32, 27, 0, 103, 33, 27, 1, 41, 33, 33, 8, 20, 32, 32, 33, 41, 32, 32, 16, 42, 32, 32, 16, 121, 32, 20, 0, 25, 4, 5, 6, 85, 24, 4, 0, 1, 33, 23, 0, 135, 32, 8, 0, 15, 4, 33, 0, 135, 32, 11, 0, 1, 33, 5, 0, 135, 32, 14, 0, 33, 0, 0, 0, 1, 33, 114, 0, 135, 32, 16, 0, 33, 0, 0, 0, 79, 32, 11, 0, 103, 33, 11, 1, 41, 33, 33, 8, 20, 32, 32, 33, 41, 32, 32, 16, 42, 32, 32, 16, 26, 4, 32, 1, 45, 33, 3, 4, 192, 59, 0, 0, 1, 33, 0, 0, 0, 32, 33, 0, 119, 0, 3, 0, 25, 33, 3, 1, 0, 32, 33, 0, 0, 3, 32, 0, 27, 32, 3, 42, 3, 27, 1, 32, 79, 32, 27, 0, 103, 33, 27, 1, 41, 33, 33, 8, 20, 32, 32, 33, 41, 32, 32, 16, 42, 32, 32, 16, 121, 32, 240, 255, 135, 32, 35, 0, 0, 1, 15, 24, 3, 16, 2, 0, 135, 32, 17, 0, 27, 32, 32, 7, 29, 4, 32, 100, 1, 33, 5, 0, 135, 32, 16, 0, 33, 0, 0, 0, 135, 32, 26, 0, 17, 0, 0, 0, 135, 32, 17, 0, 27, 32, 32, 7, 29, 32, 32, 100, 4, 32, 32, 4, 34, 27, 32, 20, 79, 32, 13, 0, 103, 33, 13, 1, 41, 33, 33, 8, 20, 32, 32, 33, 103, 33, 13, 2, 41, 33, 33, 16, 20, 32, 32, 33, 103, 33, 13, 3, 41, 33, 33, 24, 20, 32, 32, 33, 33, 32, 32, 8, 19, 32, 32, 27, 120, 32, 234, 255, 0, 8, 3, 0, 119, 0, 1, 0, 78, 31, 20, 0, 120, 31, 15, 0, 2, 31, 0, 0, 240, 73, 2, 0, 78, 31, 31, 0, 120, 31, 9, 0, 2, 31, 0, 0, 221, 73, 2, 0, 78, 31, 31, 0, 120, 31, 3, 0, 1, 3, 0, 0, 119, 0, 6, 0, 1, 21, 51, 0, 119, 0, 4, 0, 1, 21, 51, 0, 119, 0, 2, 0, 1, 21, 51, 0, 32, 31, 21, 51, 121, 31, 3, 0, 1, 21, 0, 0, 1, 3, 1, 0, 78, 31, 12, 0, 121, 31, 7, 0, 2, 31, 0, 0, 178, 78, 2, 0, 78, 31, 31, 0, 120, 31, 3, 0, 1, 4, 2, 0, 119, 0, 13, 0, 2, 31, 0, 0, 235, 73, 2, 0, 78, 31, 31, 0, 121, 31, 3, 0, 1, 4, 2, 0, 119, 0, 7, 0, 120, 3, 4, 0, 0, 5, 9, 0, 0, 3, 8, 0, 119, 0, 180, 253, 1, 4, 1, 0, 119, 0, 1, 0, 135, 31, 6, 0, 2, 31, 0, 0, 140, 79, 1, 0, 82, 31, 31, 0, 45, 31, 31, 8, 48, 61, 0, 0, 1, 3, 0, 0, 119, 0, 38, 0, 82, 32, 24, 0, 1, 33, 25, 0, 1, 34, 16, 0, 1, 35, 45, 0, 135, 31, 3, 0, 18, 32, 33, 34, 35, 0, 0, 0, 2, 31, 0, 0, 166, 89, 3, 0, 79, 35, 19, 0, 103, 34, 19, 1, 41, 34, 34, 8, 20, 35, 35, 34, 19, 35, 35, 28, 79, 34, 0, 0, 103, 33, 0, 1, 41, 33, 33, 8, 20, 34, 34, 33, 19, 34, 34, 28, 3, 35, 35, 34, 84, 31, 35, 0, 2, 35, 0, 0, 168, 89, 3, 0, 27, 31, 8, 13, 79, 34, 22, 0, 103, 33, 22, 1, 41, 33, 33, 8, 20, 34, 34, 33, 19, 34, 34, 28, 3, 31, 31, 34, 84, 35, 31, 0, 27, 35, 8, 42, 3, 35, 1, 35, 25, 35, 35, 2, 135, 31, 31, 0, 35, 0, 0, 0, 1, 3, 1, 0, 2, 31, 0, 0, 136, 79, 1, 0, 85, 31, 3, 0, 121, 23, 4, 0, 38, 35, 2, 63, 135, 31, 32, 0, 35, 8, 0, 0, 135, 31, 11, 0, 19, 31, 8, 28, 0, 27, 31, 0, 83, 25, 27, 0, 42, 35, 27, 8, 107, 25, 1, 35, 2, 35, 0, 0, 140, 79, 1, 0, 85, 35, 8, 0, 38, 35, 4, 3, 1, 31, 1, 0, 1, 38, 2, 0, 138, 35, 31, 38, 44, 62, 0, 0, 232, 62, 0, 0, 1, 27, 0, 0, 137, 26, 0, 0, 139, 27, 0, 0, 119, 0, 55, 0, 27, 31, 8, 42, 3, 31, 1, 31, 25, 3, 31, 38, 79, 31, 3, 0, 103, 34, 3, 1, 41, 34, 34, 8, 20, 31, 31, 34, 103, 34, 3, 2, 41, 34, 34, 16, 20, 31, 31, 34, 103, 34, 3, 3, 41, 34, 34, 24, 20, 31, 31, 34, 120, 31, 4, 0, 0, 27, 8, 0, 137, 26, 0, 0, 139, 27, 0, 0, 1, 34, 32, 0, 135, 31, 14, 0, 34, 0, 0, 0, 1, 34, 0, 0, 1, 33, 255, 0, 1, 32, 43, 0, 1, 36, 0, 0, 1, 37, 0, 0, 1, 38, 10, 0, 135, 31, 22, 0, 34, 33, 32, 36, 37, 38, 0, 0, 79, 38, 3, 0, 103, 37, 3, 1, 41, 37, 37, 8, 20, 38, 38, 37, 103, 37, 3, 2, 41, 37, 37, 16, 20, 38, 38, 37, 103, 37, 3, 3, 41, 37, 37, 24, 20, 38, 38, 37, 38, 38, 38, 15, 1, 37, 0, 0, 135, 31, 36, 0, 38, 37, 0, 0, 0, 27, 8, 0, 137, 26, 0, 0, 139, 27, 0, 0, 119, 0, 1, 0, 1, 38, 39, 0, 135, 31, 14, 0, 38, 0, 0, 0, 1, 27, 255, 255, 137, 26, 0, 0, 139, 27, 0, 0, 119, 0, 199, 255, 1, 35, 0, 0, 139, 35, 0, 0, 140, 1, 16, 0, 0, 0, 0, 0, 2, 5, 0, 0, 31, 90, 3, 0, 2, 6, 0, 0, 30, 90, 3, 0, 2, 7, 0, 0, 195, 213, 0, 0, 1, 1, 0, 0, 136, 8, 0, 0, 0, 3, 8, 0, 136, 8, 0, 0, 25, 8, 8, 16, 137, 8, 0, 0, 130, 8, 0, 0, 136, 9, 0, 0, 49, 8, 8, 9, 96, 63, 0, 0, 1, 9, 16, 0, 135, 8, 0, 0, 9, 0, 0, 0, 0, 2, 3, 0, 2, 8, 0, 0, 152, 86, 3, 0, 82, 4, 8, 0, 2, 8, 0, 0, 152, 86, 3, 0, 25, 9, 4, 1, 85, 8, 9, 0, 85, 2, 4, 0, 109, 2, 4, 0, 2, 8, 0, 0, 41, 116, 1, 0, 135, 9, 37, 0, 8, 2, 0, 0, 1, 9, 2, 0, 50, 9, 9, 0, 200, 63, 0, 0, 2, 8, 0, 0, 64, 116, 1, 0, 2, 10, 0, 0, 227, 115, 1, 0, 1, 11, 106, 5, 2, 12, 0, 0, 91, 116, 1, 0, 135, 9, 38, 0, 8, 10, 11, 12, 1, 9, 0, 0, 1, 12, 2, 0, 138, 0, 9, 12, 232, 63, 0, 0, 240, 63, 0, 0, 137, 3, 0, 0, 139, 0, 0, 0, 119, 0, 4, 0, 1, 1, 5, 0, 119, 0, 2, 0, 119, 0, 1, 0, 32, 9, 1, 5, 121, 9, 51, 0, 135, 9, 39, 0, 2, 9, 0, 0, 3, 90, 3, 0, 1, 12, 0, 0, 83, 9, 12, 0, 2, 12, 0, 0, 4, 90, 3, 0, 1, 9, 15, 0, 83, 12, 9, 0, 1, 12, 0, 0, 1, 11, 255, 0, 1, 10, 0, 0, 1, 8, 0, 0, 1, 13, 0, 0, 1, 14, 30, 0, 135, 9, 22, 0, 12, 11, 10, 8, 13, 14, 0, 0, 2, 9, 0, 0, 0, 86, 3, 0, 82, 4, 9, 0, 1, 14, 192, 254, 5, 9, 4, 14, 2, 14, 0, 0, 80, 79, 1, 0, 82, 14, 14, 0, 3, 9, 9, 14, 43, 9, 9, 1, 0, 2, 9, 0, 2, 14, 0, 0, 84, 79, 1, 0, 82, 14, 14, 0, 27, 13, 4, 216, 3, 14, 14, 13, 1, 13, 98, 0, 135, 9, 40, 0, 2, 14, 13, 0, 135, 9, 23, 0, 135, 9, 41, 0, 135, 9, 42, 0, 135, 9, 43, 0, 135, 9, 44, 0, 135, 9, 45, 0, 135, 9, 46, 0, 135, 9, 47, 0, 135, 9, 21, 0, 2, 9, 0, 0, 99, 90, 3, 0, 1, 13, 0, 0, 83, 9, 13, 0, 2, 13, 0, 0, 101, 90, 3, 0, 78, 0, 13, 0, 41, 13, 0, 24, 42, 13, 13, 24, 120, 13, 35, 0, 2, 13, 0, 0, 32, 90, 3, 0, 79, 13, 13, 0, 2, 9, 0, 0, 33, 90, 3, 0, 79, 9, 9, 0, 41, 9, 9, 8, 20, 13, 13, 9, 2, 9, 0, 0, 34, 90, 3, 0, 79, 9, 9, 0, 41, 9, 9, 16, 20, 13, 13, 9, 2, 9, 0, 0, 35, 90, 3, 0, 79, 9, 9, 0, 41, 9, 9, 24, 20, 13, 13, 9, 0, 4, 13, 0, 2, 13, 0, 0, 36, 90, 3, 0, 83, 13, 4, 0, 2, 13, 0, 0, 37, 90, 3, 0, 42, 9, 4, 8, 83, 13, 9, 0, 2, 9, 0, 0, 38, 90, 3, 0, 42, 13, 4, 16, 83, 9, 13, 0, 2, 13, 0, 0, 39, 90, 3, 0, 42, 9, 4, 24, 83, 13, 9, 0, 2, 9, 0, 0, 99, 90, 3, 0, 78, 9, 9, 0, 32, 9, 9, 0, 2, 13, 0, 0, 12, 87, 3, 0, 82, 13, 13, 0, 33, 13, 13, 21, 20, 9, 9, 13, 121, 9, 5, 0, 135, 9, 21, 0, 2, 9, 0, 0, 101, 90, 3, 0, 78, 0, 9, 0, 2, 9, 0, 0, 100, 90, 3, 0, 1, 13, 0, 0, 83, 9, 13, 0, 41, 13, 0, 24, 42, 13, 13, 24, 120, 13, 2, 0, 135, 13, 48, 0, 2, 13, 0, 0, 26, 90, 3, 0, 1, 9, 1, 0, 83, 13, 9, 0, 2, 13, 0, 0, 100, 116, 1, 0, 135, 9, 49, 0, 13, 0, 0, 0, 2, 9, 0, 0, 101, 90, 3, 0, 78, 9, 9, 0, 120, 9, 3, 0, 135, 9, 50, 0, 119, 0, 10, 0, 2, 13, 0, 0, 36, 87, 3, 0, 82, 13, 13, 0, 135, 9, 51, 0, 13, 0, 0, 0, 2, 9, 0, 0, 101, 90, 3, 0, 1, 13, 0, 0, 83, 9, 13, 0, 2, 13, 0, 0, 99, 90, 3, 0, 78, 13, 13, 0, 120, 13, 3, 0, 135, 13, 52, 0, 119, 0, 9, 0, 2, 13, 0, 0, 99, 90, 3, 0, 1, 9, 0, 0, 83, 13, 9, 0, 2, 9, 0, 0, 27, 90, 3, 0, 1, 13, 1, 0, 83, 9, 13, 0, 135, 13, 44, 0, 1, 9, 0, 0, 1, 14, 255, 0, 1, 8, 208, 13, 1, 10, 30, 0, 135, 13, 12, 0, 9, 14, 8, 10, 1, 10, 0, 0, 135, 13, 53, 0, 10, 0, 0, 0, 135, 13, 54, 0, 2, 13, 0, 0, 26, 90, 3, 0, 1, 10, 0, 0, 83, 13, 10, 0, 2, 10, 0, 0, 110, 90, 3, 0, 78, 10, 10, 0, 33, 10, 10, 0, 2, 13, 0, 0, 224, 86, 3, 0, 82, 13, 13, 0, 33, 13, 13, 3, 19, 10, 10, 13, 121, 10, 2, 0, 135, 10, 55, 0, 2, 10, 0, 0, 101, 90, 3, 0, 78, 10, 10, 0, 2, 13, 0, 0, 100, 90, 3, 0, 78, 13, 13, 0, 20, 10, 10, 13, 41, 10, 10, 24, 42, 10, 10, 24, 120, 10, 242, 0, 2, 10, 0, 0, 224, 86, 3, 0, 82, 10, 10, 0, 1, 13, 1, 0, 1, 15, 9, 0, 138, 10, 13, 15, 168, 67, 0, 0, 76, 70, 0, 0, 28, 67, 0, 0, 28, 67, 0, 0, 28, 67, 0, 0, 152, 70, 0, 0, 28, 67, 0, 0, 28, 67, 0, 0, 160, 70, 0, 0, 2, 13, 0, 0, 12, 87, 3, 0, 82, 13, 13, 0, 32, 13, 13, 21, 121, 13, 29, 0, 2, 13, 0, 0, 0, 86, 3, 0, 82, 4, 13, 0, 1, 12, 192, 254, 5, 13, 4, 12, 2, 12, 0, 0, 80, 79, 1, 0, 82, 12, 12, 0, 3, 13, 13, 12, 43, 13, 13, 1, 0, 2, 13, 0, 2, 12, 0, 0, 84, 79, 1, 0, 82, 12, 12, 0, 27, 15, 4, 216, 3, 12, 12, 15, 1, 15, 98, 0, 135, 13, 40, 0, 2, 12, 15, 0, 135, 13, 23, 0, 135, 13, 41, 0, 135, 13, 42, 0, 135, 13, 43, 0, 135, 13, 44, 0, 135, 13, 45, 0, 135, 13, 46, 0, 135, 13, 47, 0, 135, 13, 21, 0, 135, 13, 39, 0, 119, 0, 72, 255, 2, 13, 0, 0, 12, 87, 3, 0, 82, 13, 13, 0, 32, 13, 13, 21, 121, 13, 29, 0, 2, 13, 0, 0, 0, 86, 3, 0, 82, 4, 13, 0, 1, 8, 192, 254, 5, 13, 4, 8, 2, 8, 0, 0, 80, 79, 1, 0, 82, 8, 8, 0, 3, 13, 13, 8, 43, 13, 13, 1, 0, 2, 13, 0, 2, 8, 0, 0, 84, 79, 1, 0, 82, 8, 8, 0, 27, 14, 4, 216, 3, 8, 8, 14, 1, 14, 98, 0, 135, 13, 40, 0, 2, 8, 14, 0, 135, 13, 23, 0, 135, 13, 41, 0, 135, 13, 42, 0, 135, 13, 43, 0, 135, 13, 44, 0, 135, 13, 45, 0, 135, 13, 46, 0, 135, 13, 47, 0, 135, 13, 21, 0, 2, 13, 0, 0, 50, 90, 3, 0, 1, 14, 0, 0, 83, 13, 14, 0, 2, 14, 0, 0, 51, 90, 3, 0, 1, 13, 0, 0, 83, 14, 13, 0, 135, 13, 46, 0, 1, 14, 0, 0, 1, 8, 255, 0, 1, 9, 0, 0, 1, 11, 0, 0, 1, 12, 0, 0, 1, 15, 30, 0, 135, 13, 22, 0, 14, 8, 9, 11, 12, 15, 0, 0, 135, 13, 39, 0, 135, 13, 56, 0, 2, 13, 0, 0, 12, 87, 3, 0, 82, 13, 13, 0, 32, 13, 13, 21, 121, 13, 29, 0, 2, 13, 0, 0, 0, 86, 3, 0, 82, 4, 13, 0, 1, 15, 192, 254, 5, 13, 4, 15, 2, 15, 0, 0, 80, 79, 1, 0, 82, 15, 15, 0, 3, 13, 13, 15, 43, 13, 13, 1, 0, 2, 13, 0, 2, 15, 0, 0, 84, 79, 1, 0, 82, 15, 15, 0, 27, 12, 4, 216, 3, 15, 15, 12, 1, 12, 98, 0, 135, 13, 40, 0, 2, 15, 12, 0, 135, 13, 23, 0, 135, 13, 41, 0, 135, 13, 42, 0, 135, 13, 43, 0, 135, 13, 44, 0, 135, 13, 45, 0, 135, 13, 46, 0, 135, 13, 47, 0, 135, 13, 21, 0, 2, 13, 0, 0, 36, 90, 3, 0, 79, 13, 13, 0, 2, 12, 0, 0, 37, 90, 3, 0, 79, 12, 12, 0, 41, 12, 12, 8, 20, 13, 13, 12, 2, 12, 0, 0, 38, 90, 3, 0, 79, 12, 12, 0, 41, 12, 12, 16, 20, 13, 13, 12, 2, 12, 0, 0, 39, 90, 3, 0, 79, 12, 12, 0, 41, 12, 12, 24, 20, 13, 13, 12, 0, 0, 13, 0, 2, 13, 0, 0, 32, 90, 3, 0, 83, 13, 0, 0, 2, 13, 0, 0, 33, 90, 3, 0, 42, 12, 0, 8, 83, 13, 12, 0, 2, 12, 0, 0, 34, 90, 3, 0, 42, 13, 0, 16, 83, 12, 13, 0, 2, 13, 0, 0, 35, 90, 3, 0, 42, 12, 0, 24, 83, 13, 12, 0, 79, 12, 6, 0, 79, 13, 5, 0, 41, 13, 13, 8, 20, 12, 12, 13, 0, 0, 12, 0, 41, 12, 0, 16, 42, 12, 12, 16, 32, 12, 12, 9, 121, 12, 23, 0, 2, 12, 0, 0, 208, 15, 1, 0, 2, 13, 0, 0, 72, 90, 3, 0, 79, 13, 13, 0, 2, 15, 0, 0, 73, 90, 3, 0, 79, 15, 15, 0, 41, 15, 15, 8, 20, 13, 13, 15, 41, 13, 13, 16, 42, 13, 13, 16, 41, 13, 13, 2, 94, 12, 12, 13, 2, 13, 0, 0, 255, 255, 0, 0, 19, 12, 12, 13, 0, 4, 12, 0, 83, 6, 4, 0, 42, 12, 4, 8, 83, 5, 12, 0, 119, 0, 177, 254, 2, 12, 0, 0, 224, 86, 3, 0, 82, 12, 12, 0, 32, 12, 12, 9, 121, 12, 6, 0, 1, 12, 9, 0, 83, 6, 12, 0, 1, 12, 0, 0, 83, 5, 12, 0, 119, 0, 167, 254, 25, 12, 0, 1, 41, 12, 12, 16, 42, 12, 12, 16, 0, 4, 12, 0, 83, 6, 4, 0, 42, 12, 4, 8, 83, 5, 12, 0, 119, 0, 159, 254, 135, 12, 57, 0, 2, 12, 0, 0, 99, 90, 3, 0, 1, 13, 1, 0, 83, 12, 13, 0, 2, 13, 0, 0, 44, 90, 3, 0, 79, 13, 13, 0, 2, 12, 0, 0, 45, 90, 3, 0, 79, 12, 12, 0, 41, 12, 12, 8, 20, 13, 13, 12, 41, 13, 13, 16, 42, 13, 13, 16, 36, 13, 13, 255, 121, 13, 142, 254, 1, 1, 33, 0, 119, 0, 6, 0, 1, 1, 36, 0, 119, 0, 4, 0, 119, 0, 66, 255, 1, 1, 5, 0, 119, 0, 83, 254, 32, 10, 1, 33, 121, 10, 66, 0, 1, 13, 0, 0, 1, 15, 255, 0, 1, 12, 0, 0, 1, 11, 0, 0, 1, 9, 0, 0, 1, 8, 30, 0, 135, 10, 22, 0, 13, 15, 12, 11, 9, 8, 0, 0, 2, 10, 0, 0, 84, 79, 1, 0, 82, 10, 10, 0, 31, 10, 10, 200, 121, 10, 8, 0, 2, 8, 0, 0, 248, 85, 3, 0, 82, 8, 8, 0, 1, 9, 0, 0, 1, 11, 0, 0, 135, 10, 58, 0, 8, 9, 11, 0, 135, 10, 39, 0, 2, 11, 0, 0, 36, 90, 3, 0, 79, 11, 11, 0, 2, 9, 0, 0, 37, 90, 3, 0, 79, 9, 9, 0, 41, 9, 9, 8, 20, 11, 11, 9, 2, 9, 0, 0, 38, 90, 3, 0, 79, 9, 9, 0, 41, 9, 9, 16, 20, 11, 11, 9, 2, 9, 0, 0, 39, 90, 3, 0, 79, 9, 9, 0, 41, 9, 9, 24, 20, 11, 11, 9, 79, 9, 6, 0, 79, 8, 5, 0, 41, 8, 8, 8, 20, 9, 9, 8, 2, 8, 0, 0, 255, 255, 0, 0, 19, 9, 9, 8, 25, 9, 9, 1, 2, 8, 0, 0, 255, 255, 0, 0, 19, 9, 9, 8, 135, 10, 59, 0, 11, 9, 0, 0, 2, 0, 0, 0, 40, 31, 1, 0, 2, 1, 0, 0, 131, 135, 1, 0, 25, 2, 0, 12, 78, 10, 1, 0, 83, 0, 10, 0, 25, 0, 0, 1, 25, 1, 1, 1, 54, 10, 0, 2, 156, 71, 0, 0, 119, 0, 90, 0, 32, 10, 1, 36, 121, 10, 88, 0, 2, 10, 0, 0, 12, 87, 3, 0, 82, 10, 10, 0, 32, 10, 10, 21, 121, 10, 29, 0, 2, 10, 0, 0, 0, 86, 3, 0, 82, 4, 10, 0, 1, 9, 192, 254, 5, 10, 4, 9, 2, 9, 0, 0, 80, 79, 1, 0, 82, 9, 9, 0, 3, 10, 10, 9, 43, 10, 10, 1, 0, 2, 10, 0, 2, 9, 0, 0, 84, 79, 1, 0, 82, 9, 9, 0, 27, 11, 4, 216, 3, 9, 9, 11, 1, 11, 98, 0, 135, 10, 40, 0, 2, 9, 11, 0, 135, 10, 23, 0, 135, 10, 41, 0, 135, 10, 42, 0, 135, 10, 43, 0, 135, 10, 44, 0, 135, 10, 45, 0, 135, 10, 46, 0, 135, 10, 47, 0, 135, 10, 21, 0, 1, 11, 0, 0, 1, 9, 255, 0, 1, 8, 0, 0, 1, 12, 0, 0, 1, 15, 0, 0, 1, 13, 30, 0, 135, 10, 22, 0, 11, 9, 8, 12, 15, 13, 0, 0, 135, 10, 39, 0, 135, 10, 60, 0, 135, 10, 39, 0, 2, 13, 0, 0, 36, 90, 3, 0, 79, 13, 13, 0, 2, 15, 0, 0, 37, 90, 3, 0, 79, 15, 15, 0, 41, 15, 15, 8, 20, 13, 13, 15, 2, 15, 0, 0, 38, 90, 3, 0, 79, 15, 15, 0, 41, 15, 15, 16, 20, 13, 13, 15, 2, 15, 0, 0, 39, 90, 3, 0, 79, 15, 15, 0, 41, 15, 15, 24, 20, 13, 13, 15, 79, 15, 6, 0, 79, 12, 5, 0, 41, 12, 12, 8, 20, 15, 15, 12, 2, 12, 0, 0, 255, 255, 0, 0, 19, 15, 15, 12, 25, 15, 15, 1, 2, 12, 0, 0, 255, 255, 0, 0, 19, 15, 15, 12, 135, 10, 59, 0, 13, 15, 0, 0, 2, 0, 0, 0, 40, 31, 1, 0, 2, 1, 0, 0, 131, 135, 1, 0, 25, 2, 0, 12, 78, 10, 1, 0, 83, 0, 10, 0, 25, 0, 0, 1, 25, 1, 1, 1, 54, 10, 0, 2, 4, 73, 0, 0, 2, 10, 0, 0, 76, 31, 1, 0, 1, 15, 8, 0, 83, 10, 15, 0, 2, 15, 0, 0, 77, 31, 1, 0, 1, 10, 0, 0, 83, 15, 10, 0, 2, 10, 0, 0, 78, 31, 1, 0, 1, 15, 0, 0, 83, 10, 15, 0, 2, 15, 0, 0, 79, 31, 1, 0, 1, 10, 0, 0, 83, 15, 10, 0, 137, 3, 0, 0, 139, 0, 0, 0, 140, 1, 12, 0, 0, 0, 0, 0, 136, 5, 0, 0, 0, 4, 5, 0, 136, 5, 0, 0, 25, 5, 5, 112, 137, 5, 0, 0, 130, 5, 0, 0, 136, 6, 0, 0, 49, 5, 5, 6, 156, 73, 0, 0, 1, 6, 112, 0, 135, 5, 0, 0, 6, 0, 0, 0, 25, 1, 4, 104, 0, 3, 4, 0, 1, 6, 64, 4, 1, 9, 4, 0, 138, 0, 6, 9, 208, 73, 0, 0, 144, 74, 0, 0, 132, 78, 0, 0, 28, 83, 0, 0, 1, 3, 0, 0, 137, 4, 0, 0, 139, 3, 0, 0, 119, 0, 143, 2, 1, 6, 2, 0, 135, 5, 61, 0, 6, 0, 0, 0, 2, 5, 0, 0, 176, 89, 3, 0, 1, 6, 160, 0, 84, 5, 6, 0, 2, 5, 0, 0, 66, 135, 1, 0, 135, 6, 62, 0, 5, 0, 0, 0, 121, 6, 21, 0, 2, 6, 0, 0, 224, 86, 3, 0, 1, 5, 2, 0, 85, 6, 5, 0, 2, 5, 0, 0, 248, 86, 3, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 44, 90, 3, 0, 1, 5, 0, 0, 83, 6, 5, 0, 2, 5, 0, 0, 45, 90, 3, 0, 1, 6, 0, 0, 83, 5, 6, 0, 2, 6, 0, 0, 220, 86, 3, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 176, 89, 3, 0, 1, 6, 200, 0, 84, 5, 6, 0, 2, 6, 0, 0, 224, 85, 3, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 168, 30, 1, 0, 1, 6, 0, 0, 84, 5, 6, 0, 1, 3, 1, 0, 137, 4, 0, 0, 139, 3, 0, 0, 119, 0, 1, 0, 2, 5, 0, 0, 220, 86, 3, 0, 82, 5, 5, 0, 121, 5, 18, 0, 2, 5, 0, 0, 0, 160, 2, 0, 2, 7, 0, 0, 218, 131, 1, 0, 79, 7, 7, 0, 2, 8, 0, 0, 219, 131, 1, 0, 79, 8, 8, 0, 41, 8, 8, 8, 20, 7, 7, 8, 41, 7, 7, 16, 42, 7, 7, 16, 41, 7, 7, 2, 94, 5, 5, 7, 33, 5, 5, 0, 0, 6, 5, 0, 119, 0, 3, 0, 1, 5, 0, 0, 0, 6, 5, 0, 0, 3, 6, 0, 1, 5, 2, 0, 135, 6, 61, 0, 5, 0, 0, 0, 121, 3, 19, 0, 2, 6, 0, 0, 224, 85, 3, 0, 1, 5, 1, 0, 85, 6, 5, 0, 2, 6, 0, 0, 50, 132, 1, 0, 135, 5, 63, 0, 6, 0, 0, 0, 1, 6, 1, 0, 135, 5, 64, 0, 6, 0, 0, 0, 2, 5, 0, 0, 224, 85, 3, 0, 1, 6, 0, 0, 85, 5, 6, 0, 1, 3, 1, 0, 137, 4, 0, 0, 139, 3, 0, 0, 1, 5, 23, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 24, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 36, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 37, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 41, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 30, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 0, 0, 1, 7, 255, 0, 1, 8, 0, 0, 1, 9, 0, 0, 1, 10, 0, 0, 1, 11, 30, 0, 135, 6, 22, 0, 5, 7, 8, 9, 10, 11, 0, 0, 2, 6, 0, 0, 84, 79, 1, 0, 82, 6, 6, 0, 31, 6, 6, 200, 121, 6, 8, 0, 2, 11, 0, 0, 248, 85, 3, 0, 82, 11, 11, 0, 1, 10, 0, 0, 1, 9, 0, 0, 135, 6, 58, 0, 11, 10, 9, 0, 2, 6, 0, 0, 208, 86, 3, 0, 1, 9, 14, 0, 85, 6, 9, 0, 135, 0, 34, 0, 2, 9, 0, 0, 64, 43, 2, 0, 2, 6, 0, 0, 208, 86, 3, 0, 82, 6, 6, 0, 1, 10, 5, 1, 3, 6, 6, 10, 41, 6, 6, 2, 94, 1, 9, 6, 121, 1, 13, 0, 135, 9, 65, 0, 1, 0, 0, 0, 2, 9, 0, 0, 64, 43, 2, 0, 2, 6, 0, 0, 208, 86, 3, 0, 82, 6, 6, 0, 1, 10, 5, 1, 3, 6, 6, 10, 41, 6, 6, 2, 1, 10, 0, 0, 97, 9, 6, 10, 1, 6, 19, 1, 135, 10, 66, 0, 6, 0, 0, 0, 2, 10, 0, 0, 36, 87, 3, 0, 85, 10, 0, 0, 2, 10, 0, 0, 220, 86, 3, 0, 1, 9, 0, 0, 135, 6, 64, 0, 9, 0, 0, 0, 85, 10, 6, 0, 2, 6, 0, 0, 3, 90, 3, 0, 1, 10, 0, 0, 83, 6, 10, 0, 2, 10, 0, 0, 4, 90, 3, 0, 1, 6, 15, 0, 83, 10, 6, 0, 135, 6, 6, 0, 1, 10, 0, 0, 1, 9, 255, 0, 1, 11, 0, 0, 1, 8, 0, 0, 1, 7, 0, 0, 1, 5, 30, 0, 135, 6, 22, 0, 10, 9, 11, 8, 7, 5, 0, 0, 2, 6, 0, 0, 12, 87, 3, 0, 82, 6, 6, 0, 33, 6, 6, 21, 121, 6, 2, 0, 135, 6, 67, 0, 2, 6, 0, 0, 101, 90, 3, 0, 78, 0, 6, 0, 2, 6, 0, 0, 100, 90, 3, 0, 78, 6, 6, 0, 20, 6, 0, 6, 41, 6, 6, 24, 42, 6, 6, 24, 120, 6, 9, 0, 2, 5, 0, 0, 36, 87, 3, 0, 82, 5, 5, 0, 135, 6, 51, 0, 5, 0, 0, 0, 2, 6, 0, 0, 101, 90, 3, 0, 78, 0, 6, 0, 41, 6, 0, 24, 42, 6, 6, 24, 121, 6, 5, 0, 2, 6, 0, 0, 224, 86, 3, 0, 1, 5, 7, 0, 85, 6, 5, 0, 2, 5, 0, 0, 36, 86, 3, 0, 135, 6, 17, 0, 27, 6, 6, 7, 29, 6, 6, 100, 85, 5, 6, 0, 2, 6, 0, 0, 227, 89, 3, 0, 78, 6, 6, 0, 121, 6, 4, 0, 135, 6, 68, 0, 121, 6, 2, 0, 135, 6, 69, 0, 2, 6, 0, 0, 28, 48, 2, 0, 82, 0, 6, 0, 121, 0, 7, 0, 135, 6, 65, 0, 0, 0, 0, 0, 2, 6, 0, 0, 28, 48, 2, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 32, 48, 2, 0, 82, 0, 5, 0, 121, 0, 7, 0, 135, 5, 65, 0, 0, 0, 0, 0, 2, 5, 0, 0, 32, 48, 2, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 80, 48, 2, 0, 82, 0, 6, 0, 121, 0, 7, 0, 135, 6, 65, 0, 0, 0, 0, 0, 2, 6, 0, 0, 80, 48, 2, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 84, 48, 2, 0, 82, 0, 5, 0, 121, 0, 7, 0, 135, 5, 65, 0, 0, 0, 0, 0, 2, 5, 0, 0, 84, 48, 2, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 100, 48, 2, 0, 82, 0, 6, 0, 121, 0, 7, 0, 135, 6, 65, 0, 0, 0, 0, 0, 2, 6, 0, 0, 100, 48, 2, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 56, 48, 2, 0, 82, 0, 5, 0, 120, 0, 4, 0, 1, 3, 1, 0, 137, 4, 0, 0, 139, 3, 0, 0, 135, 5, 65, 0, 0, 0, 0, 0, 2, 5, 0, 0, 56, 48, 2, 0, 1, 6, 0, 0, 85, 5, 6, 0, 1, 3, 1, 0, 137, 4, 0, 0, 139, 3, 0, 0, 119, 0, 1, 0, 2, 5, 0, 0, 220, 86, 3, 0, 82, 5, 5, 0, 121, 5, 18, 0, 2, 5, 0, 0, 0, 160, 2, 0, 2, 7, 0, 0, 218, 131, 1, 0, 79, 7, 7, 0, 2, 8, 0, 0, 219, 131, 1, 0, 79, 8, 8, 0, 41, 8, 8, 8, 20, 7, 7, 8, 41, 7, 7, 16, 42, 7, 7, 16, 41, 7, 7, 2, 94, 5, 5, 7, 33, 5, 5, 0, 0, 6, 5, 0, 119, 0, 3, 0, 1, 5, 0, 0, 0, 6, 5, 0, 121, 6, 61, 0, 0, 0, 3, 0, 2, 1, 0, 0, 96, 64, 1, 0, 25, 2, 0, 100, 116, 0, 1, 0, 25, 0, 0, 4, 25, 1, 1, 4, 54, 6, 0, 2, 244, 78, 0, 0, 1, 5, 2, 0, 135, 6, 61, 0, 5, 0, 0, 0, 2, 6, 0, 0, 224, 85, 3, 0, 1, 5, 1, 0, 85, 6, 5, 0, 2, 6, 0, 0, 48, 160, 2, 0, 2, 7, 0, 0, 218, 131, 1, 0, 79, 7, 7, 0, 2, 8, 0, 0, 219, 131, 1, 0, 79, 8, 8, 0, 41, 8, 8, 8, 20, 7, 7, 8, 41, 7, 7, 16, 42, 7, 7, 16, 41, 7, 7, 5, 3, 6, 6, 7, 135, 5, 70, 0, 3, 6, 0, 0, 135, 5, 13, 0, 3, 0, 0, 0, 3, 2, 3, 5, 2, 5, 0, 0, 162, 135, 1, 0, 78, 5, 5, 0, 83, 2, 5, 0, 2, 6, 0, 0, 163, 135, 1, 0, 78, 6, 6, 0, 107, 2, 1, 6, 2, 5, 0, 0, 164, 135, 1, 0, 78, 5, 5, 0, 107, 2, 2, 5, 135, 5, 62, 0, 3, 0, 0, 0, 121, 5, 4, 0, 1, 6, 1, 0, 135, 5, 71, 0, 6, 0, 0, 0, 2, 5, 0, 0, 224, 85, 3, 0, 1, 6, 0, 0, 85, 5, 6, 0, 1, 3, 1, 0, 137, 4, 0, 0, 139, 3, 0, 0, 1, 5, 2, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 23, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 24, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 36, 0, 135, 6, 61, 0], eb + 10240);
    HEAPU8.set([5, 0, 0, 0, 1, 5, 37, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 40, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 30, 0, 135, 6, 61, 0, 5, 0, 0, 0, 1, 5, 0, 0, 1, 7, 255, 0, 1, 8, 0, 0, 1, 11, 0, 0, 1, 9, 0, 0, 1, 10, 30, 0, 135, 6, 22, 0, 5, 7, 8, 11, 9, 10, 0, 0, 2, 6, 0, 0, 84, 79, 1, 0, 82, 6, 6, 0, 31, 6, 6, 200, 121, 6, 8, 0, 2, 10, 0, 0, 248, 85, 3, 0, 82, 10, 10, 0, 1, 9, 0, 0, 1, 11, 0, 0, 135, 6, 58, 0, 10, 9, 11, 0, 2, 6, 0, 0, 208, 86, 3, 0, 1, 11, 14, 0, 85, 6, 11, 0, 135, 0, 34, 0, 2, 11, 0, 0, 64, 43, 2, 0, 2, 6, 0, 0, 208, 86, 3, 0, 82, 6, 6, 0, 1, 9, 5, 1, 3, 6, 6, 9, 41, 6, 6, 2, 94, 1, 11, 6, 121, 1, 13, 0, 135, 11, 65, 0, 1, 0, 0, 0, 2, 11, 0, 0, 64, 43, 2, 0, 2, 6, 0, 0, 208, 86, 3, 0, 82, 6, 6, 0, 1, 9, 5, 1, 3, 6, 6, 9, 41, 6, 6, 2, 1, 9, 0, 0, 97, 11, 6, 9, 1, 6, 19, 1, 135, 9, 66, 0, 6, 0, 0, 0, 2, 9, 0, 0, 36, 87, 3, 0, 85, 9, 0, 0, 2, 9, 0, 0, 220, 86, 3, 0, 1, 11, 0, 0, 135, 6, 71, 0, 11, 0, 0, 0, 85, 9, 6, 0, 2, 6, 0, 0, 3, 90, 3, 0, 1, 9, 0, 0, 83, 6, 9, 0, 2, 9, 0, 0, 4, 90, 3, 0, 1, 6, 15, 0, 83, 9, 6, 0, 135, 6, 6, 0, 1, 9, 0, 0, 1, 11, 255, 0, 1, 10, 0, 0, 1, 8, 0, 0, 1, 7, 0, 0, 1, 5, 30, 0, 135, 6, 22, 0, 9, 11, 10, 8, 7, 5, 0, 0, 2, 6, 0, 0, 12, 87, 3, 0, 82, 6, 6, 0, 33, 6, 6, 21, 121, 6, 2, 0, 135, 6, 67, 0, 2, 6, 0, 0, 101, 90, 3, 0, 78, 0, 6, 0, 2, 6, 0, 0, 100, 90, 3, 0, 78, 6, 6, 0, 20, 6, 0, 6, 41, 6, 6, 24, 42, 6, 6, 24, 120, 6, 9, 0, 2, 5, 0, 0, 36, 87, 3, 0, 82, 5, 5, 0, 135, 6, 51, 0, 5, 0, 0, 0, 2, 6, 0, 0, 101, 90, 3, 0, 78, 0, 6, 0, 41, 6, 0, 24, 42, 6, 6, 24, 121, 6, 5, 0, 2, 6, 0, 0, 224, 86, 3, 0, 1, 5, 7, 0, 85, 6, 5, 0, 2, 5, 0, 0, 36, 86, 3, 0, 135, 6, 17, 0, 27, 6, 6, 7, 29, 6, 6, 100, 85, 5, 6, 0, 2, 6, 0, 0, 227, 89, 3, 0, 78, 6, 6, 0, 121, 6, 4, 0, 135, 6, 68, 0, 121, 6, 2, 0, 135, 6, 69, 0, 2, 6, 0, 0, 28, 48, 2, 0, 82, 0, 6, 0, 121, 0, 7, 0, 135, 6, 65, 0, 0, 0, 0, 0, 2, 6, 0, 0, 28, 48, 2, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 32, 48, 2, 0, 82, 0, 5, 0, 121, 0, 7, 0, 135, 5, 65, 0, 0, 0, 0, 0, 2, 5, 0, 0, 32, 48, 2, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 80, 48, 2, 0, 82, 0, 6, 0, 121, 0, 7, 0, 135, 6, 65, 0, 0, 0, 0, 0, 2, 6, 0, 0, 80, 48, 2, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 84, 48, 2, 0, 82, 0, 5, 0, 121, 0, 7, 0, 135, 5, 65, 0, 0, 0, 0, 0, 2, 5, 0, 0, 84, 48, 2, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 96, 48, 2, 0, 82, 0, 6, 0, 121, 0, 7, 0, 135, 6, 65, 0, 0, 0, 0, 0, 2, 6, 0, 0, 96, 48, 2, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 56, 48, 2, 0, 82, 0, 5, 0, 120, 0, 4, 0, 1, 3, 1, 0, 137, 4, 0, 0, 139, 3, 0, 0, 135, 5, 65, 0, 0, 0, 0, 0, 2, 5, 0, 0, 56, 48, 2, 0, 1, 6, 0, 0, 85, 5, 6, 0, 1, 3, 1, 0, 137, 4, 0, 0, 139, 3, 0, 0, 119, 0, 1, 0, 1, 5, 2, 0, 135, 6, 61, 0, 5, 0, 0, 0, 2, 6, 0, 0, 172, 89, 3, 0, 1, 5, 0, 0, 84, 6, 5, 0, 2, 5, 0, 0, 170, 89, 3, 0, 1, 6, 0, 0, 84, 5, 6, 0, 2, 6, 0, 0, 174, 89, 3, 0, 1, 5, 64, 1, 84, 6, 5, 0, 2, 5, 0, 0, 176, 89, 3, 0, 1, 6, 160, 0, 84, 5, 6, 0, 2, 5, 0, 0, 48, 27, 1, 0, 135, 7, 72, 0, 135, 8, 72, 0, 38, 8, 8, 1, 25, 8, 8, 7, 19, 7, 7, 8, 27, 7, 7, 80, 3, 5, 5, 7, 135, 6, 62, 0, 5, 0, 0, 0, 121, 6, 16, 0, 135, 6, 11, 0, 135, 6, 34, 0, 135, 6, 19, 0, 1, 5, 0, 0, 1, 7, 255, 0, 1, 8, 43, 0, 1, 10, 0, 0, 1, 11, 0, 0, 1, 9, 10, 0, 135, 6, 22, 0, 5, 7, 8, 10, 11, 9, 0, 0, 1, 9, 0, 0, 135, 6, 73, 0, 9, 1, 0, 0, 135, 6, 23, 0, 2, 6, 0, 0, 176, 89, 3, 0, 1, 9, 200, 0, 84, 6, 9, 0, 2, 9, 0, 0, 224, 85, 3, 0, 1, 6, 0, 0, 85, 9, 6, 0, 1, 3, 1, 0, 137, 4, 0, 0, 139, 3, 0, 0, 119, 0, 111, 253, 1, 6, 0, 0, 139, 6, 0, 0, 140, 0, 15, 0, 0, 0, 0, 0, 2, 8, 0, 0, 199, 213, 0, 0, 2, 9, 0, 0, 200, 213, 0, 0, 2, 10, 0, 0, 196, 213, 0, 0, 1, 6, 0, 0, 136, 11, 0, 0, 0, 7, 11, 0, 136, 11, 0, 0, 25, 11, 11, 16, 137, 11, 0, 0, 130, 11, 0, 0, 136, 12, 0, 0, 49, 11, 11, 12, 100, 84, 0, 0, 1, 12, 16, 0, 135, 11, 0, 0, 12, 0, 0, 0, 25, 4, 7, 4, 0, 5, 7, 0, 135, 11, 74, 0, 2, 11, 0, 0, 110, 90, 3, 0, 78, 11, 11, 0, 2, 12, 0, 0, 111, 90, 3, 0, 78, 12, 12, 0, 20, 11, 11, 12, 41, 11, 11, 24, 42, 11, 11, 24, 120, 11, 3, 0, 135, 11, 75, 0, 119, 0, 29, 0, 135, 1, 17, 0, 2, 11, 0, 0, 36, 86, 3, 0, 82, 11, 11, 0, 25, 0, 11, 4, 2, 11, 0, 0, 36, 86, 3, 0, 85, 11, 0, 0, 27, 11, 0, 100, 28, 11, 11, 7, 4, 0, 11, 1, 1, 11, 0, 0, 47, 11, 11, 0, 228, 84, 0, 0, 135, 11, 16, 0, 0, 0, 0, 0, 119, 0, 8, 0, 34, 11, 0, 248, 121, 11, 6, 0, 2, 11, 0, 0, 36, 86, 3, 0, 27, 12, 1, 7, 29, 12, 12, 100, 85, 11, 12, 0, 2, 12, 0, 0, 8, 87, 3, 0, 1, 11, 4, 0, 85, 12, 11, 0, 2, 11, 0, 0, 28, 87, 3, 0, 1, 12, 0, 0, 85, 11, 12, 0, 2, 12, 0, 0, 32, 87, 3, 0, 1, 11, 0, 0, 85, 12, 11, 0, 2, 11, 0, 0, 64, 44, 3, 0, 2, 12, 0, 0, 96, 44, 3, 0, 82, 12, 12, 0, 85, 11, 12, 0, 2, 12, 0, 0, 68, 44, 3, 0, 2, 11, 0, 0, 100, 44, 3, 0, 82, 11, 11, 0, 85, 12, 11, 0, 2, 11, 0, 0, 72, 44, 3, 0, 2, 12, 0, 0, 104, 44, 3, 0, 82, 12, 12, 0, 85, 11, 12, 0, 2, 12, 0, 0, 76, 44, 3, 0, 2, 11, 0, 0, 108, 44, 3, 0, 82, 11, 11, 0, 85, 12, 11, 0, 2, 11, 0, 0, 80, 44, 3, 0, 2, 12, 0, 0, 112, 44, 3, 0, 80, 12, 12, 0, 84, 11, 12, 0, 2, 12, 0, 0, 96, 44, 3, 0, 1, 11, 0, 0, 85, 12, 11, 0, 2, 11, 0, 0, 100, 44, 3, 0, 1, 12, 0, 0, 85, 11, 12, 0, 2, 12, 0, 0, 104, 44, 3, 0, 1, 11, 0, 0, 85, 12, 11, 0, 2, 11, 0, 0, 108, 44, 3, 0, 1, 12, 0, 0, 85, 11, 12, 0, 2, 12, 0, 0, 112, 44, 3, 0, 1, 11, 0, 0, 84, 12, 11, 0, 2, 11, 0, 0, 111, 90, 3, 0, 78, 11, 11, 0, 121, 11, 139, 0, 2, 11, 0, 0, 16, 87, 3, 0, 82, 6, 11, 0, 25, 0, 6, 1, 2, 11, 0, 0, 16, 87, 3, 0, 85, 11, 0, 0, 78, 1, 6, 0, 2, 11, 0, 0, 96, 44, 3, 0, 38, 12, 1, 1, 83, 11, 12, 0, 2, 12, 0, 0, 97, 44, 3, 0, 1, 11, 255, 0, 19, 11, 1, 11, 43, 11, 11, 1, 38, 11, 11, 1, 83, 12, 11, 0, 2, 11, 0, 0, 98, 44, 3, 0, 1, 12, 255, 0, 19, 12, 1, 12, 43, 12, 12, 2, 38, 12, 12, 1, 83, 11, 12, 0, 2, 12, 0, 0, 99, 44, 3, 0, 1, 11, 255, 0, 19, 11, 1, 11, 43, 11, 11, 3, 38, 11, 11, 1, 83, 12, 11, 0, 2, 11, 0, 0, 100, 44, 3, 0, 1, 12, 255, 0, 19, 12, 1, 12, 43, 12, 12, 4, 38, 12, 12, 1, 83, 11, 12, 0, 2, 12, 0, 0, 101, 44, 3, 0, 1, 11, 255, 0, 19, 11, 1, 11, 43, 11, 11, 5, 38, 11, 11, 1, 83, 12, 11, 0, 2, 11, 0, 0, 102, 44, 3, 0, 1, 12, 255, 0, 19, 12, 1, 12, 43, 12, 12, 6, 38, 12, 12, 1, 83, 11, 12, 0, 2, 12, 0, 0, 103, 44, 3, 0, 1, 11, 255, 0, 19, 11, 1, 11, 43, 11, 11, 7, 83, 12, 11, 0, 2, 11, 0, 0, 104, 44, 3, 0, 1, 12, 0, 0, 83, 11, 12, 0, 2, 12, 0, 0, 105, 44, 3, 0, 1, 11, 0, 0, 83, 12, 11, 0, 2, 11, 0, 0, 106, 44, 3, 0, 1, 12, 0, 0, 83, 11, 12, 0, 2, 12, 0, 0, 107, 44, 3, 0, 1, 11, 0, 0, 83, 12, 11, 0, 2, 11, 0, 0, 108, 44, 3, 0, 1, 12, 0, 0, 83, 11, 12, 0, 2, 12, 0, 0, 109, 44, 3, 0, 1, 11, 0, 0, 83, 12, 11, 0, 2, 11, 0, 0, 110, 44, 3, 0, 1, 12, 0, 0, 83, 11, 12, 0, 2, 12, 0, 0, 111, 44, 3, 0, 1, 11, 0, 0, 83, 12, 11, 0, 2, 11, 0, 0, 112, 44, 3, 0, 1, 12, 0, 0, 83, 11, 12, 0, 2, 12, 0, 0, 113, 44, 3, 0, 1, 11, 0, 0, 83, 12, 11, 0, 25, 1, 6, 2, 2, 11, 0, 0, 16, 87, 3, 0, 85, 11, 1, 0, 78, 0, 0, 0, 2, 11, 0, 0, 28, 87, 3, 0, 85, 11, 0, 0, 25, 6, 6, 3, 2, 11, 0, 0, 16, 87, 3, 0, 85, 11, 6, 0, 78, 1, 1, 0, 2, 11, 0, 0, 32, 87, 3, 0, 85, 11, 1, 0, 2, 11, 0, 0, 20, 87, 3, 0, 82, 11, 11, 0, 45, 11, 6, 11, 252, 87, 0, 0, 2, 11, 0, 0, 224, 86, 3, 0, 1, 12, 1, 0, 85, 11, 12, 0, 2, 12, 0, 0, 8, 87, 3, 0, 82, 6, 12, 0, 2, 12, 0, 0, 28, 87, 3, 0, 5, 11, 6, 0, 85, 12, 11, 0, 2, 11, 0, 0, 32, 87, 3, 0, 5, 12, 6, 1, 85, 11, 12, 0, 137, 7, 0, 0, 139, 0, 0, 0, 135, 12, 76, 0, 2, 12, 0, 0, 108, 90, 3, 0, 78, 12, 12, 0, 121, 12, 31, 0, 135, 12, 68, 0, 121, 12, 29, 0, 135, 0, 77, 0, 38, 12, 0, 1, 121, 12, 8, 0, 2, 12, 0, 0, 96, 44, 3, 0, 2, 11, 0, 0, 48, 65, 1, 0, 82, 11, 11, 0, 1, 13, 1, 0, 95, 12, 11, 13, 38, 13, 0, 2, 121, 13, 8, 0, 2, 13, 0, 0, 96, 44, 3, 0, 2, 11, 0, 0, 52, 65, 1, 0, 82, 11, 11, 0, 1, 12, 1, 0, 95, 13, 11, 12, 38, 12, 0, 4, 121, 12, 8, 0, 2, 12, 0, 0, 96, 44, 3, 0, 2, 11, 0, 0, 56, 65, 1, 0, 82, 11, 11, 0, 1, 13, 1, 0, 95, 12, 11, 13, 2, 13, 0, 0, 109, 90, 3, 0, 78, 13, 13, 0, 121, 13, 26, 0, 135, 2, 78, 0, 2, 13, 0, 0, 100, 85, 3, 0, 82, 3, 13, 0, 1, 13, 0, 0, 47, 13, 13, 3, 48, 89, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 19, 13, 1, 2, 121, 13, 9, 0, 2, 13, 0, 0, 96, 44, 3, 0, 2, 11, 0, 0, 64, 65, 1, 0, 41, 12, 0, 2, 94, 11, 11, 12, 1, 12, 1, 0, 95, 13, 11, 12, 25, 0, 0, 1, 52, 12, 0, 3, 48, 89, 0, 0, 41, 12, 1, 1, 0, 1, 12, 0, 119, 0, 241, 255, 2, 11, 0, 0, 98, 44, 3, 0, 78, 11, 11, 0, 32, 11, 11, 0, 1, 13, 35, 0, 1, 14, 70, 0, 125, 12, 11, 13, 14, 0, 0, 0, 2, 14, 0, 0, 8, 87, 3, 0, 82, 14, 14, 0, 5, 0, 12, 14, 2, 14, 0, 0, 208, 73, 2, 0, 2, 12, 0, 0, 208, 64, 1, 0, 82, 12, 12, 0, 90, 14, 14, 12, 121, 14, 8, 0, 2, 14, 0, 0, 32, 87, 3, 0, 2, 12, 0, 0, 32, 87, 3, 0, 82, 12, 12, 0, 4, 12, 12, 0, 85, 14, 12, 0, 2, 12, 0, 0, 208, 73, 2, 0, 2, 14, 0, 0, 216, 64, 1, 0, 82, 14, 14, 0, 90, 12, 12, 14, 121, 12, 8, 0, 2, 12, 0, 0, 32, 87, 3, 0, 2, 14, 0, 0, 32, 87, 3, 0, 82, 14, 14, 0, 3, 14, 14, 0, 85, 12, 14, 0, 2, 14, 0, 0, 208, 73, 2, 0, 2, 12, 0, 0, 220, 64, 1, 0, 82, 12, 12, 0, 90, 14, 14, 12, 121, 14, 8, 0, 2, 14, 0, 0, 28, 87, 3, 0, 2, 12, 0, 0, 28, 87, 3, 0, 82, 12, 12, 0, 4, 12, 12, 0, 85, 14, 12, 0, 2, 12, 0, 0, 208, 73, 2, 0, 2, 14, 0, 0, 212, 64, 1, 0, 82, 14, 14, 0, 90, 12, 12, 14, 121, 12, 8, 0, 2, 12, 0, 0, 28, 87, 3, 0, 2, 14, 0, 0, 28, 87, 3, 0, 82, 14, 14, 0, 3, 14, 14, 0, 85, 12, 14, 0, 2, 14, 0, 0, 108, 90, 3, 0, 78, 14, 14, 0, 121, 14, 43, 0, 135, 14, 68, 0, 121, 14, 41, 0, 135, 14, 79, 0, 4, 5, 0, 0, 135, 14, 68, 0, 121, 14, 2, 0, 135, 14, 69, 0, 82, 14, 5, 0, 2, 12, 0, 0, 84, 79, 1, 0, 82, 12, 12, 0, 43, 12, 12, 1, 4, 2, 14, 12, 1, 12, 13, 0, 2, 14, 0, 0, 200, 86, 3, 0, 82, 14, 14, 0, 4, 3, 12, 14, 2, 14, 0, 0, 28, 87, 3, 0, 2, 12, 0, 0, 28, 87, 3, 0, 82, 12, 12, 0, 82, 13, 4, 0, 2, 11, 0, 0, 80, 79, 1, 0, 82, 11, 11, 0, 43, 11, 11, 1, 4, 13, 13, 11, 27, 13, 13, 10, 6, 13, 13, 3, 3, 12, 12, 13, 85, 14, 12, 0, 2, 12, 0, 0, 32, 87, 3, 0, 2, 14, 0, 0, 32, 87, 3, 0, 82, 14, 14, 0, 27, 13, 2, 20, 6, 13, 13, 3, 3, 14, 14, 13, 85, 12, 14, 0, 2, 14, 0, 0, 109, 90, 3, 0, 78, 14, 14, 0, 120, 14, 5, 0, 2, 14, 0, 0, 8, 87, 3, 0, 82, 4, 14, 0, 119, 0, 80, 0, 135, 14, 80, 0, 4, 5, 0, 0, 2, 14, 0, 0, 8, 87, 3, 0, 82, 2, 14, 0, 2, 12, 0, 0, 98, 44, 3, 0, 78, 12, 12, 0, 32, 12, 12, 0, 1, 13, 35, 0, 1, 11, 70, 0, 125, 14, 12, 13, 11, 0, 0, 0, 5, 1, 14, 2, 82, 0, 4, 0, 1, 14, 64, 0, 15, 14, 14, 0, 2, 11, 0, 0, 113, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 121, 14, 7, 0, 2, 14, 0, 0, 28, 87, 3, 0, 82, 14, 14, 0, 3, 0, 14, 1, 1, 6, 45, 0, 119, 0, 13, 0, 34, 14, 0, 192, 2, 11, 0, 0, 112, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 121, 14, 6, 0, 2, 14, 0, 0, 28, 87, 3, 0, 82, 14, 14, 0, 4, 0, 14, 1, 1, 6, 45, 0, 32, 14, 6, 45, 121, 14, 4, 0, 2, 14, 0, 0, 28, 87, 3, 0, 85, 14, 0, 0, 82, 0, 5, 0, 1, 14, 64, 0, 15, 14, 14, 0, 2, 11, 0, 0, 111, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 121, 14, 7, 0, 2, 14, 0, 0, 32, 87, 3, 0, 82, 14, 14, 0, 3, 0, 14, 1, 1, 6, 50, 0, 119, 0, 13, 0, 34, 14, 0, 192, 2, 11, 0, 0, 110, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 121, 14, 6, 0, 2, 14, 0, 0, 32, 87, 3, 0, 82, 14, 14, 0, 4, 0, 14, 1, 1, 6, 50, 0, 32, 14, 6, 50, 121, 14, 4, 0, 2, 14, 0, 0, 32, 87, 3, 0, 85, 14, 0, 0, 0, 4, 2, 0, 27, 0, 4, 100, 1, 14, 0, 0, 4, 3, 14, 0, 2, 14, 0, 0, 28, 87, 3, 0, 82, 1, 14, 0, 47, 14, 0, 1, 128, 92, 0, 0, 0, 1, 0, 0, 1, 6, 54, 0, 119, 0, 5, 0, 47, 14, 1, 3, 144, 92, 0, 0, 0, 1, 3, 0, 1, 6, 54, 0, 32, 14, 6, 54, 121, 14, 4, 0, 2, 14, 0, 0, 28, 87, 3, 0, 85, 14, 1, 0, 2, 14, 0, 0, 32, 87, 3, 0, 82, 2, 14, 0, 47, 14, 0, 2, 192, 92, 0, 0, 1, 6, 57, 0, 119, 0, 7, 0, 47, 14, 2, 3, 212, 92, 0, 0, 0, 0, 3, 0, 1, 6, 57, 0, 119, 0, 2, 0, 0, 0, 2, 0, 32, 14, 6, 57, 121, 14, 4, 0, 2, 14, 0, 0, 32, 87, 3, 0, 85, 14, 0, 0, 2, 14, 0, 0, 110, 90, 3, 0, 78, 14, 14, 0, 120, 14, 3, 0, 137, 7, 0, 0, 139, 0, 0, 0, 2, 14, 0, 0, 28, 87, 3, 0, 6, 11, 1, 4, 85, 14, 11, 0, 2, 11, 0, 0, 32, 87, 3, 0, 6, 14, 0, 4, 85, 11, 14, 0, 2, 14, 0, 0, 103, 44, 3, 0, 78, 14, 14, 0, 33, 14, 14, 0, 38, 14, 14, 1, 41, 14, 14, 1, 2, 11, 0, 0, 102, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 41, 14, 14, 1, 2, 11, 0, 0, 101, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 41, 14, 14, 1, 38, 14, 14, 126, 2, 11, 0, 0, 100, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 41, 14, 14, 1, 2, 11, 0, 0, 99, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 41, 14, 14, 1, 2, 11, 0, 0, 98, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 41, 14, 14, 1, 38, 14, 14, 126, 2, 11, 0, 0, 97, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 41, 14, 14, 1, 2, 11, 0, 0, 96, 44, 3, 0, 78, 11, 11, 0, 33, 11, 11, 0, 20, 14, 14, 11, 1, 11, 255, 0, 19, 14, 14, 11, 0, 5, 14, 0, 2, 14, 0, 0, 16, 87, 3, 0, 82, 6, 14, 0, 2, 14, 0, 0, 16, 87, 3, 0, 25, 11, 6, 1, 85, 14, 11, 0, 83, 6, 5, 0, 2, 11, 0, 0, 28, 87, 3, 0, 82, 11, 11, 0, 1, 14, 255, 0, 19, 11, 11, 14, 0, 6, 11, 0, 2, 11, 0, 0, 16, 87, 3, 0, 82, 5, 11, 0, 2, 11, 0, 0, 16, 87, 3, 0, 25, 14, 5, 1, 85, 11, 14, 0, 83, 5, 6, 0, 2, 14, 0, 0, 32, 87, 3, 0, 82, 14, 14, 0, 1, 11, 255, 0, 19, 14, 14, 11, 0, 5, 14, 0, 2, 14, 0, 0, 16, 87, 3, 0, 82, 6, 14, 0, 2, 14, 0, 0, 16, 87, 3, 0, 25, 11, 6, 1, 85, 14, 11, 0, 83, 6, 5, 0, 2, 11, 0, 0, 16, 87, 3, 0, 82, 11, 11, 0, 2, 14, 0, 0, 20, 87, 3, 0, 82, 14, 14, 0, 26, 14, 14, 8, 48, 11, 11, 14, 248, 94, 0, 0, 2, 11, 0, 0, 8, 87, 3, 0, 82, 6, 11, 0, 2, 11, 0, 0, 28, 87, 3, 0, 2, 13, 0, 0, 28, 87, 3, 0, 82, 13, 13, 0, 5, 14, 13, 6, 85, 11, 14, 0, 2, 14, 0, 0, 32, 87, 3, 0, 2, 13, 0, 0, 32, 87, 3, 0, 82, 13, 13, 0, 5, 11, 13, 6, 85, 14, 11, 0, 137, 7, 0, 0, 139, 0, 0, 0, 119, 0, 7, 0, 2, 11, 0, 0, 224, 86, 3, 0, 1, 14, 1, 0, 85, 11, 14, 0, 137, 7, 0, 0, 139, 0, 0, 0, 139, 0, 0, 0, 140, 0, 10, 0, 0, 0, 0, 0, 2, 3, 0, 0, 111, 90, 3, 0, 78, 3, 3, 0, 2, 4, 0, 0, 5, 90, 3, 0, 78, 4, 4, 0, 20, 3, 3, 4, 41, 3, 3, 24, 42, 3, 3, 24, 121, 3, 2, 0, 139, 0, 0, 0, 2, 3, 0, 0, 96, 85, 3, 0, 82, 2, 3, 0, 2, 3, 0, 0, 61, 74, 2, 0, 78, 3, 3, 0, 121, 3, 120, 0, 2, 3, 0, 0, 60, 74, 2, 0, 78, 3, 3, 0, 121, 3, 116, 0, 2, 3, 0, 0, 57, 74, 2, 0, 78, 3, 3, 0, 121, 3, 112, 0, 2, 3, 0, 0, 46, 90, 3, 0, 1, 4, 100, 0, 83, 3, 4, 0, 2, 4, 0, 0, 47, 90, 3, 0, 1, 3, 0, 0, 83, 4, 3, 0, 2, 3, 0, 0, 48, 90, 3, 0, 1, 4, 99, 0, 83, 3, 4, 0, 2, 4, 0, 0, 49, 90, 3, 0, 1, 3, 0, 0, 83, 4, 3, 0, 2, 3, 0, 0, 50, 90, 3, 0, 1, 4, 3, 0, 83, 3, 4, 0, 2, 4, 0, 0, 51, 90, 3, 0, 1, 3, 0, 0, 83, 4, 3, 0, 2, 3, 0, 0, 36, 90, 3, 0, 1, 4, 0, 0, 83, 3, 4, 0, 2, 4, 0, 0, 37, 90, 3, 0, 1, 3, 0, 0, 83, 4, 3, 0, 2, 3, 0, 0, 38, 90, 3, 0, 1, 4, 0, 0, 83, 3, 4, 0, 2, 4, 0, 0, 39, 90, 3, 0, 1, 3, 0, 0, 83, 4, 3, 0, 2, 3, 0, 0, 86, 90, 3, 0, 79, 3, 3, 0, 2, 4, 0, 0, 87, 90, 3, 0, 79, 4, 4, 0, 41, 4, 4, 8, 20, 3, 3, 4, 2, 4, 0, 0, 88, 90, 3, 0, 79, 4, 4, 0, 41, 4, 4, 16, 20, 3, 3, 4, 2, 4, 0, 0, 89, 90, 3, 0, 79, 4, 4, 0, 41, 4, 4, 24, 20, 3, 3, 4, 2, 4, 0, 0, 16, 164, 0, 0, 3, 0, 3, 4, 2, 4, 0, 0, 86, 90, 3, 0, 83, 4, 0, 0, 2, 4, 0, 0, 87, 90, 3, 0, 42, 3, 0, 8, 83, 4, 3, 0, 2, 3, 0, 0, 88, 90, 3, 0, 42, 4, 0, 16, 83, 3, 4, 0, 2, 4, 0, 0, 89, 90, 3, 0, 42, 3, 0, 24, 83, 4, 3, 0, 1, 4, 3, 0, 135, 3, 81, 0, 4, 0, 0, 0, 135, 3, 47, 0, 135, 3, 42, 0, 135, 3, 46, 0, 135, 3, 45, 0, 135, 3, 21, 0, 135, 3, 39, 0, 1, 4, 2, 0, 135, 3, 61, 0, 4, 0, 0, 0, 135, 3, 82, 0, 2, 4, 0, 0, 197, 136, 1, 0, 135, 3, 63, 0, 4, 0, 0, 0, 2, 3, 0, 0, 200, 47, 2, 0, 82, 0, 3, 0, 121, 0, 7, 0, 135, 3, 65, 0, 0, 0, 0, 0, 2, 3, 0, 0, 200, 47, 2, 0, 1, 4, 0, 0, 85, 3, 4, 0, 135, 4, 6, 0, 135, 4, 83, 0, 2, 4, 0, 0, 12, 87, 3, 0, 82, 4, 4, 0, 34, 4, 4, 17, 121, 4, 2, 0, 135, 4, 23, 0, 2, 4, 0, 0, 216, 73, 2, 0, 78, 4, 4, 0, 121, 4, 41, 0, 2, 4, 0, 0, 177, 78, 2, 0, 78, 4, 4, 0, 121, 4, 37, 0, 2, 4, 0, 0, 178, 78, 2, 0, 78, 4, 4, 0, 33, 4, 4, 0, 2, 3, 0, 0, 102, 90, 3, 0, 78, 3, 3, 0, 33, 3, 3, 0, 19, 4, 4, 3, 121, 4, 27, 0, 135, 4, 39, 0, 1, 3, 2, 0, 135, 4, 61, 0, 3, 0, 0, 0, 135, 4, 82, 0, 2, 3, 0, 0, 69, 137, 1, 0, 135, 4, 63, 0, 3, 0, 0, 0, 2, 4, 0, 0, 200, 47, 2, 0, 82, 0, 4, 0, 121, 0, 7, 0, 135, 4, 65, 0, 0, 0, 0, 0, 2, 4, 0, 0, 200, 47, 2, 0, 1, 3, 0, 0, 85, 4, 3, 0, 135, 3, 6, 0, 135, 3, 83, 0, 135, 3, 84, 0, 2, 3, 0, 0, 52, 87, 3, 0, 1, 4, 1, 0, 85, 3, 4, 0, 2, 4, 0, 0, 50, 74, 2, 0, 78, 4, 4, 0, 121, 4, 36, 0, 2, 4, 0, 0, 49, 74, 2, 0, 78, 4, 4, 0, 121, 4, 32, 0, 2, 4, 0, 0, 68, 74, 2, 0, 78, 4, 4, 0, 121, 4, 28, 0, 135, 4, 39, 0, 1, 3, 2, 0, 135, 4, 61, 0, 3, 0, 0, 0, 135, 4, 82, 0, 2, 3, 0, 0, 103, 137, 1, 0, 135, 4, 63, 0, 3, 0, 0, 0, 2, 4, 0, 0, 200, 47, 2, 0, 82, 0, 4, 0, 121, 0, 7, 0, 135, 4, 65, 0, 0, 0, 0, 0, 2, 4, 0, 0, 200, 47, 2, 0, 1, 3, 0, 0, 85, 4, 3, 0, 135, 3, 6, 0, 135, 3, 83, 0, 2, 3, 0, 0, 12, 87, 3, 0, 82, 3, 3, 0, 34, 3, 3, 18, 121, 3, 2, 0, 135, 3, 23, 0, 2, 3, 0, 0, 107, 44, 3, 0, 78, 3, 3, 0, 121, 3, 5, 0, 2, 3, 0, 0, 229, 89, 3, 0, 1, 4, 1, 0, 83, 3, 4, 0, 2, 4, 0, 0, 229, 89, 3, 0, 78, 4, 4, 0, 121, 4, 83, 0, 135, 0, 34, 0, 2, 4, 0, 0, 64, 43, 2, 0, 2, 3, 0, 0, 56, 87, 3, 0, 82, 3, 3, 0, 1, 5, 5, 1, 3, 3, 3, 5, 41, 3, 3, 2, 94, 1, 4, 3, 121, 1, 13, 0, 135, 4, 65, 0, 1, 0, 0, 0, 2, 4, 0, 0, 64, 43, 2, 0, 2, 3, 0, 0, 56, 87, 3, 0, 82, 3, 3, 0, 1, 5, 5, 1, 3, 3, 3, 5, 41, 3, 3, 2, 1, 5, 0, 0, 97, 4, 3, 5, 1, 3, 16, 0, 1, 4, 64, 0, 1, 6, 145, 0, 135, 5, 85, 0, 3, 4, 6, 0, 135, 5, 11, 0, 135, 5, 83, 0, 2, 5, 0, 0, 229, 89, 3, 0, 1, 6, 0, 0, 83, 5, 6, 0, 135, 6, 34, 0, 2, 6, 0, 0, 192, 65, 1, 0, 2, 5, 0, 0, 72, 90, 3, 0, 79, 5, 5, 0, 2, 4, 0, 0, 73, 90, 3, 0, 79, 4, 4, 0, 41, 4, 4, 8, 20, 5, 5, 4, 41, 5, 5, 16, 42, 5, 5, 16, 27, 5, 5, 10, 2, 4, 0, 0, 30, 90, 3, 0, 79, 4, 4, 0, 2, 3, 0, 0, 31, 90, 3, 0, 79, 3, 3, 0, 41, 3, 3, 8, 20, 4, 4, 3, 41, 4, 4, 16, 42, 4, 4, 16, 3, 5, 5, 4, 41, 5, 5, 2, 94, 2, 6, 5, 2, 6, 0, 0, 56, 87, 3, 0, 85, 6, 2, 0, 1, 5, 5, 1, 3, 5, 2, 5, 135, 6, 86, 0, 5, 0, 0, 0, 2, 6, 0, 0, 227, 89, 3, 0, 78, 6, 6, 0, 121, 6, 4, 0, 135, 6, 68, 0, 121, 6, 2, 0, 135, 6, 69, 0, 2, 6, 0, 0, 36, 86, 3, 0, 135, 5, 17, 0, 27, 5, 5, 7, 29, 5, 5, 100, 85, 6, 5, 0, 139, 0, 0, 0, 38, 5, 2, 252, 1, 6, 64, 4, 45, 5, 5, 6, 80, 100, 0, 0, 135, 5, 39, 0, 135, 5, 82, 0, 135, 5, 87, 0, 2, 0, 0, 0, 135, 5, 84, 0, 2, 5, 0, 0, 3, 90, 3, 0, 1, 6, 0, 0, 83, 5, 6, 0, 2, 6, 0, 0, 4, 90, 3, 0, 1, 5, 15, 0, 83, 6, 5, 0, 135, 5, 6, 0, 139, 0, 0, 0, 32, 5, 2, 27, 1, 6, 58, 4, 4, 6, 2, 6, 35, 6, 6, 9, 20, 5, 5, 6, 2, 6, 0, 0, 106, 44, 3, 0, 78, 6, 6, 0, 33, 6, 6, 0, 20, 5, 5, 6, 120, 5, 50, 0, 2, 5, 0, 0, 217, 73, 2, 0, 78, 5, 5, 0, 33, 5, 5, 0, 2, 6, 0, 0, 52, 87, 3, 0, 82, 6, 6, 0, 33, 6, 6, 0, 19, 5, 5, 6, 120, 5, 2, 0, 139, 0, 0, 0, 1, 6, 1, 0, 135, 5, 61, 0, 6, 0, 0, 0, 2, 5, 0, 0, 224, 85, 3, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 3, 90, 3, 0, 1, 5, 0, 0, 83, 6, 5, 0, 2, 5, 0, 0, 4, 90, 3, 0, 1, 6, 15, 0, 83, 5, 6, 0, 135, 6, 88, 0, 33, 2, 6, 0, 2, 6, 0, 0, 12, 87, 3, 0, 82, 6, 6, 0, 34, 6, 6, 20, 19, 6, 2, 6, 121, 6, 2, 0, 135, 6, 23, 0, 2, 6, 0, 0, 227, 89, 3, 0, 78, 6, 6, 0, 121, 6, 4, 0, 135, 6, 68, 0, 121, 6, 2, 0, 135, 6, 69, 0, 2, 6, 0, 0, 36, 86, 3, 0, 135, 5, 17, 0, 27, 5, 5, 7, 29, 5, 5, 100, 85, 6, 5, 0, 139, 0, 0, 0, 135, 1, 34, 0, 2, 5, 0, 0, 64, 43, 2, 0, 2, 6, 0, 0, 56, 87, 3, 0, 82, 6, 6, 0, 1, 4, 5, 1, 3, 6, 6, 4, 41, 6, 6, 2, 94, 0, 5, 6, 121, 0, 13, 0, 135, 5, 65, 0, 0, 0, 0, 0, 2, 5, 0, 0, 64, 43, 2, 0, 2, 6, 0, 0, 56, 87, 3, 0, 82, 6, 6, 0, 1, 4, 5, 1, 3, 6, 6, 4, 41, 6, 6, 2, 1, 4, 0, 0, 97, 5, 6, 4, 135, 4, 39, 0, 1, 6, 0, 0, 1, 5, 255, 0, 1, 3, 0, 0, 1, 7, 0, 0, 1, 8, 0, 0, 1, 9, 30, 0, 135, 4, 22, 0, 6, 5, 3, 7, 8, 9, 0, 0, 2, 8, 0, 0, 106, 44, 3, 0, 78, 8, 8, 0, 32, 8, 8, 0, 1, 7, 27, 0, 125, 9, 8, 2, 7, 0, 0, 0, 135, 4, 87, 0, 9, 0, 0, 0, 2, 4, 0, 0, 3, 90, 3, 0, 1, 9, 0, 0, 83, 4, 9, 0, 2, 9, 0, 0, 4, 90, 3, 0, 1, 4, 15, 0, 83, 9, 4, 0, 135, 4, 6, 0, 1, 9, 0, 0, 1, 7, 255, 0, 1, 8, 0, 0, 1, 3, 0, 0, 1, 5, 0, 0, 1, 6, 30, 0, 135, 4, 22, 0, 9, 7, 8, 3, 5, 6, 0, 0, 2, 4, 0, 0, 12, 87, 3, 0, 82, 4, 4, 0, 33, 4, 4, 21, 121, 4, 2, 0, 135, 4, 67, 0, 2, 4, 0, 0, 101, 90, 3, 0, 78, 0, 4, 0, 2, 4, 0, 0, 100, 90, 3, 0, 78, 4, 4, 0, 20, 4, 0, 4, 41, 4, 4, 24, 42, 4, 4, 24, 120, 4, 38, 0, 135, 4, 34, 0, 2, 4, 0, 0, 192, 65, 1, 0, 2, 6, 0, 0, 72, 90, 3, 0, 79, 6, 6, 0, 2, 5, 0, 0, 73, 90, 3, 0, 79, 5, 5, 0, 41, 5, 5, 8, 20, 6, 6, 5, 41, 6, 6, 16, 42, 6, 6, 16, 27, 6, 6, 10, 2, 5, 0, 0, 30, 90, 3, 0, 79, 5, 5, 0, 2, 3, 0, 0, 31, 90, 3, 0, 79, 3, 3, 0, 41, 3, 3, 8, 20, 5, 5, 3, 41, 5, 5, 16, 42, 5, 5, 16, 3, 6, 6, 5, 41, 6, 6, 2, 94, 0, 4, 6, 2, 4, 0, 0, 56, 87, 3, 0, 85, 4, 0, 0, 1, 6, 5, 1, 3, 6, 0, 6, 135, 4, 86, 0, 6, 1, 0, 0, 2, 4, 0, 0, 101, 90, 3, 0, 78, 0, 4, 0, 41, 4, 0, 24, 42, 4, 4, 24, 121, 4, 5, 0, 2, 4, 0, 0, 224, 86, 3, 0, 1, 6, 7, 0, 85, 4, 6, 0, 2, 6, 0, 0, 36, 86, 3, 0, 135, 4, 17, 0, 27, 4, 4, 7, 29, 4, 4, 100, 85, 6, 4, 0, 2, 4, 0, 0, 227, 89, 3, 0, 78, 4, 4, 0, 120, 4, 2, 0, 139, 0, 0, 0, 135, 4, 68, 0, 120, 4, 2, 0, 139, 0, 0, 0, 135, 4, 69, 0, 139, 0, 0, 0, 140, 0, 19, 0, 0, 0, 0, 0, 2, 8, 0, 0, 255, 255, 0, 0, 2, 9, 0, 0, 187, 213, 0, 0, 2, 10, 0, 0, 194, 213, 0, 0, 2, 11, 0, 0, 5, 90, 3, 0, 78, 11, 11, 0, 121, 11, 8, 0, 135, 11, 89, 0, 1, 12, 0, 0, 1, 13, 255, 0, 1, 14, 208, 13, 1, 15, 30, 0, 135, 11, 12, 0, 12, 13, 14, 15, 2, 11, 0, 0, 56, 90, 3, 0, 1, 15, 255, 255, 83, 11, 15, 0, 2, 15, 0, 0, 57, 90, 3, 0, 1, 11, 255, 255, 42, 11, 11, 8, 83, 15, 11, 0, 2, 11, 0, 0, 58, 90, 3, 0, 1, 15, 255, 255, 42, 15, 15, 16, 83, 11, 15, 0, 2, 15, 0, 0, 59, 90, 3, 0, 1, 11, 255, 255, 42, 11, 11, 24, 83, 15, 11, 0, 1, 15, 9, 0, 135, 11, 14, 0, 15, 0, 0, 0, 2, 11, 0, 0, 248, 86, 3, 0, 82, 0, 11, 0, 120, 0, 22, 0, 2, 11, 0, 0, 236, 86, 3, 0, 82, 4, 11, 0, 25, 1, 4, 51, 79, 11, 1, 0, 103, 15, 1, 1, 41, 15, 15, 8, 20, 11, 11, 15, 0, 1, 11, 0, 41, 11, 1, 16, 42, 11, 11, 16, 0, 5, 11, 0, 0, 0, 5, 0, 1, 15, 179, 0, 15, 15, 15, 5, 1, 14, 76, 255, 1, 13, 180, 0, 125, 11, 15, 14, 13, 0, 0, 0, 3, 5, 11, 0, 119, 0, 83, 0, 25, 1, 0, 26, 2, 11, 0, 0, 236, 86, 3, 0, 82, 4, 11, 0, 25, 5, 4, 26, 25, 3, 4, 30, 25, 0, 0, 30, 79, 13, 3, 0, 103, 14, 3, 1, 41, 14, 14, 8, 20, 13, 13, 14, 103, 14, 3, 2, 41, 14, 14, 16, 20, 13, 13, 14, 103, 14, 3, 3, 41, 14, 14, 24, 20, 13, 13, 14, 79, 14, 0, 0, 103, 15, 0, 1, 41, 15, 15, 8, 20, 14, 14, 15, 103, 15, 0, 2, 41, 15, 15, 16, 20, 14, 14, 15, 103, 15, 0, 3, 41, 15, 15, 24, 20, 14, 14, 15, 4, 11, 13, 14, 76, 11, 11, 0, 145, 11, 11, 0, 79, 13, 1, 0, 103, 15, 1, 1, 41, 15, 15, 8, 20, 13, 13, 15, 103, 15, 1, 2, 41, 15, 15, 16, 20, 13, 13, 15, 103, 15, 1, 3, 41, 15, 15, 24, 20, 13, 13, 15, 79, 15, 5, 0, 103, 12, 5, 1, 41, 12, 12, 8, 20, 15, 15, 12, 103, 12, 5, 2, 41, 12, 12, 16, 20, 15, 15, 12, 103, 12, 5, 3, 41, 12, 12, 24, 20, 15, 15, 12, 4, 14, 13, 15, 76, 14, 14, 0, 145, 14, 14, 0, 135, 6, 90, 0, 11, 14, 0, 0, 145, 6, 6, 0, 59, 14, 0, 0, 145, 14, 14, 0, 71, 5, 6, 14, 62, 14, 0, 0, 151, 89, 185, 84, 251, 33, 25, 64, 63, 7, 6, 14, 145, 7, 7, 0, 25, 1, 4, 51, 79, 14, 1, 0, 103, 11, 1, 1, 41, 11, 11, 8, 20, 14, 14, 11, 0, 1, 14, 0, 126, 14, 5, 7, 6, 0, 0, 0, 62, 11, 0, 0, 151, 89, 185, 84, 251, 33, 25, 64, 66, 14, 14, 11, 59, 11, 104, 1, 65, 14, 14, 11, 75, 5, 14, 0, 41, 14, 1, 16, 42, 14, 14, 16, 0, 0, 14, 0, 15, 2, 5, 0, 1, 14, 104, 1, 3, 3, 0, 14, 4, 14, 5, 0, 1, 15, 104, 1, 1, 13, 0, 0, 125, 11, 2, 15, 13, 0, 0, 0, 3, 14, 14, 11, 125, 11, 2, 0, 3, 0, 0, 0, 4, 11, 11, 5, 47, 14, 14, 11, 204, 106, 0, 0, 121, 2, 5, 0, 1, 11, 104, 1, 4, 11, 0, 11, 0, 14, 11, 0, 119, 0, 2, 0, 0, 14, 0, 0, 0, 0, 14, 0, 0, 2, 4, 0, 2, 14, 0, 0, 8, 87, 3, 0, 82, 14, 14, 0, 41, 14, 14, 1, 0, 3, 14, 0, 3, 11, 3, 0, 47, 11, 5, 11, 52, 106, 0, 0, 4, 11, 5, 0, 0, 14, 11, 0, 119, 0, 2, 0, 0, 14, 3, 0, 0, 3, 14, 0, 3, 0, 3, 0, 25, 4, 2, 51, 19, 14, 1, 8, 3, 2, 3, 14, 19, 14, 2, 8, 0, 3, 14, 0, 1, 11, 103, 1, 41, 13, 3, 16, 42, 13, 13, 16, 47, 11, 11, 13, 128, 106, 0, 0, 2, 11, 0, 0, 152, 254, 0, 0, 3, 11, 2, 11, 19, 11, 11, 8, 0, 14, 11, 0, 119, 0, 2, 0, 0, 14, 3, 0, 0, 3, 14, 0, 83, 4, 3, 0, 42, 11, 3, 8, 107, 4, 1, 11, 135, 11, 89, 0, 135, 11, 75, 0, 52, 11, 0, 5, 160, 107, 0, 0, 2, 11, 0, 0, 236, 86, 3, 0, 82, 2, 11, 0, 25, 1, 2, 51, 79, 11, 1, 0, 103, 14, 1, 1, 41, 14, 14, 8, 20, 11, 11, 14, 0, 1, 11, 0, 119, 0, 208, 255, 15, 11, 0, 5, 125, 0, 11, 3, 0, 0, 0, 0, 0, 2, 4, 0, 2, 11, 0, 0, 8, 87, 3, 0, 82, 11, 11, 0, 41, 11, 11, 1, 0, 3, 11, 0, 4, 14, 0, 3, 47, 14, 14, 5, 8, 107, 0, 0, 4, 14, 5, 0, 0, 11, 14, 0, 119, 0, 4, 0, 1, 14, 0, 0, 4, 14, 14, 3, 0, 11, 14, 0, 0, 3, 11, 0, 3, 0, 3, 0, 25, 4, 2, 51, 19, 11, 1, 8, 3, 2, 3, 11, 19, 11, 2, 8, 0, 3, 11, 0, 41, 14, 3, 16, 42, 14, 14, 16, 34, 14, 14, 0, 121, 14, 6, 0, 1, 14, 104, 1, 3, 14, 2, 14, 19, 14, 14, 8, 0, 11, 14, 0, 119, 0, 2, 0, 0, 11, 3, 0, 0, 3, 11, 0, 83, 4, 3, 0, 42, 14, 3, 8, 107, 4, 1, 14, 135, 14, 89, 0, 135, 14, 75, 0, 52, 14, 0, 5, 160, 107, 0, 0, 2, 14, 0, 0, 236, 86, 3, 0, 82, 2, 14, 0, 25, 1, 2, 51, 79, 14, 1, 0, 103, 11, 1, 1, 41, 11, 11, 8, 20, 14, 14, 11, 0, 1, 14, 0, 119, 0, 208, 255, 135, 14, 91, 0, 2, 14, 0, 0, 33, 87, 1, 0, 78, 14, 14, 0, 121, 14, 2, 0, 135, 14, 11, 0, 2, 11, 0, 0, 172, 86, 3, 0, 82, 11, 11, 0, 2, 13, 0, 0, 176, 86, 3, 0, 82, 13, 13, 0, 2, 15, 0, 0, 180, 86, 3, 0, 82, 15, 15, 0, 2, 12, 0, 0, 184, 86, 3, 0, 82, 12, 12, 0, 1, 16, 4, 0, 135, 14, 92, 0, 11, 13, 15, 12, 16, 0, 0, 0, 135, 14, 6, 0, 2, 16, 0, 0, 240, 85, 3, 0, 82, 16, 16, 0, 2, 12, 0, 0, 172, 86, 3, 0, 82, 12, 12, 0, 2, 15, 0, 0, 176, 86, 3, 0, 82, 15, 15, 0, 2, 13, 0, 0, 180, 86, 3, 0, 82, 13, 13, 0, 2, 11, 0, 0, 184, 86, 3, 0, 82, 11, 11, 0, 1, 17, 70, 0, 1, 18, 0, 0, 135, 14, 93, 0, 16, 12, 15, 13, 11, 17, 18, 0, 1, 18, 100, 0, 135, 14, 94, 0, 18, 0, 0, 0, 135, 14, 39, 0, 2, 14, 0, 0, 44, 90, 3, 0, 79, 14, 14, 0, 2, 18, 0, 0, 45, 90, 3, 0, 79, 18, 18, 0, 41, 18, 18, 8, 20, 14, 14, 18, 26, 14, 14, 1, 41, 14, 14, 16, 42, 14, 14, 16, 0, 5, 14, 0, 2, 14, 0, 0, 44, 90, 3, 0, 83, 14, 5, 0, 2, 14, 0, 0, 45, 90, 3, 0, 42, 18, 5, 8, 83, 14, 18, 0, 41, 18, 5, 16, 42, 18, 18, 16, 36, 18, 18, 255, 121, 18, 2, 0, 139, 0, 0, 0, 2, 18, 0, 0, 46, 90, 3, 0, 1, 14, 100, 0, 83, 18, 14, 0, 2, 14, 0, 0, 47, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 60, 90, 3, 0, 1, 14, 1, 0, 83, 18, 14, 0, 2, 14, 0, 0, 61, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 62, 90, 3, 0, 1, 14, 0, 0, 83, 18, 14, 0, 2, 14, 0, 0, 63, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 52, 90, 3, 0, 1, 14, 1, 0, 83, 18, 14, 0, 2, 14, 0, 0, 53, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 54, 90, 3, 0, 1, 14, 0, 0, 83, 18, 14, 0, 2, 14, 0, 0, 55, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 56, 90, 3, 0, 1, 14, 1, 0, 83, 18, 14, 0, 2, 14, 0, 0, 57, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 58, 90, 3, 0, 1, 14, 0, 0, 83, 18, 14, 0, 2, 14, 0, 0, 59, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 48, 90, 3, 0, 1, 14, 8, 0, 83, 18, 14, 0, 2, 14, 0, 0, 49, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 50, 90, 3, 0, 1, 14, 0, 0, 83, 18, 14, 0, 2, 14, 0, 0, 51, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 182, 89, 3, 0, 1, 14, 0, 0, 84, 18, 14, 0, 2, 14, 0, 0, 180, 89, 3, 0, 1, 18, 0, 0, 84, 14, 18, 0, 2, 18, 0, 0, 70, 90, 3, 0, 1, 14, 0, 0, 83, 18, 14, 0, 2, 14, 0, 0, 71, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 68, 90, 3, 0, 1, 14, 0, 0, 83, 18, 14, 0, 2, 14, 0, 0, 69, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 66, 90, 3, 0, 1, 14, 0, 0, 83, 18, 14, 0, 2, 14, 0, 0, 67, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 2, 18, 0, 0, 12, 87, 3, 0, 82, 18, 18, 0, 32, 18, 18, 21, 121, 18, 2, 0, 139, 0, 0, 0, 135, 18, 46, 0, 135, 18, 47, 0, 135, 18, 45, 0, 135, 18, 42, 0, 135, 18, 41, 0, 135, 18, 43, 0, 139, 0, 0, 0, 140, 7, 32, 0, 0, 0, 0, 0, 2, 24, 0, 0, 123, 213, 0, 0, 2, 25, 0, 0, 122, 213, 0, 0, 2, 26, 0, 0, 255, 0, 0, 0, 136, 27, 0, 0, 0, 23, 27, 0, 136, 27, 0, 0, 25, 27, 27, 16, 137, 27, 0, 0, 130, 27, 0, 0, 136, 28, 0, 0, 49, 27, 27, 28, 224, 110, 0, 0, 1, 28, 16, 0, 135, 27, 0, 0, 28, 0, 0, 0, 0, 19, 23, 0, 5, 16, 4, 3, 7, 20, 16, 5, 135, 27, 7, 0, 135, 27, 17, 0, 27, 27, 27, 7, 29, 7, 27, 100, 106, 27, 0, 4, 82, 28, 0, 0, 135, 21, 95, 0, 0, 27, 28, 0, 2, 28, 0, 0, 236, 85, 3, 0, 82, 22, 28, 0, 106, 28, 22, 4, 82, 27, 22, 0, 135, 22, 95, 0, 22, 28, 27, 0, 135, 18, 96, 0, 21, 0, 0, 0, 41, 27, 6, 24, 42, 27, 27, 24, 32, 17, 27, 0, 16, 16, 16, 5, 25, 15, 0, 16, 0, 6, 7, 0, 1, 0, 0, 0, 1, 7, 1, 0, 120, 17, 7, 0, 135, 27, 18, 0, 41, 27, 27, 24, 42, 27, 27, 24, 121, 27, 3, 0, 1, 6, 4, 0, 119, 0, 151, 0, 135, 13, 96, 0, 22, 0, 0, 0, 34, 27, 7, 2, 121, 27, 112, 0, 33, 14, 7, 0, 121, 16, 13, 0, 0, 8, 7, 0, 0, 5, 0, 0, 32, 27, 8, 0, 20, 27, 14, 27, 125, 5, 27, 0, 5, 0, 0, 0, 34, 27, 8, 1, 121, 27, 3, 0, 25, 8, 8, 1, 119, 0, 249, 255, 0, 0, 5, 0, 119, 0, 98, 0, 0, 12, 7, 0, 0, 8, 0, 0, 1, 5, 0, 0, 2, 27, 0, 0, 228, 85, 3, 0, 82, 9, 27, 0, 23, 27, 8, 9, 0, 11, 27, 0, 1, 27, 1, 0, 22, 27, 27, 9, 26, 27, 27, 1, 19, 27, 27, 8, 0, 9, 27, 0, 38, 28, 8, 1, 32, 28, 28, 0, 121, 28, 6, 0, 2, 28, 0, 0, 232, 85, 3, 0, 82, 28, 28, 0, 0, 27, 28, 0, 119, 0, 3, 0, 1, 28, 0, 0, 0, 27, 28, 0, 42, 28, 8, 1, 21, 27, 27, 28, 0, 8, 27, 0, 16, 27, 11, 3, 16, 28, 9, 4, 19, 27, 27, 28, 121, 27, 53, 0, 3, 9, 9, 2, 82, 28, 15, 0, 5, 27, 28, 9, 3, 27, 18, 27, 3, 27, 27, 1, 90, 10, 27, 11, 2, 27, 0, 0, 88, 79, 1, 0, 82, 27, 27, 0, 32, 27, 27, 8, 121, 27, 10, 0, 2, 28, 0, 0, 236, 85, 3, 0, 82, 28, 28, 0, 106, 28, 28, 16, 5, 27, 28, 9, 3, 27, 13, 27, 3, 27, 27, 1, 95, 27, 11, 10, 119, 0, 30, 0, 19, 27, 10, 26, 0, 10, 27, 0, 2, 27, 0, 0, 96, 95, 2, 0, 41, 28, 10, 2, 3, 10, 27, 28, 2, 27, 0, 0, 236, 85, 3, 0, 82, 27, 27, 0, 106, 27, 27, 4, 78, 29, 10, 0, 102, 30, 10, 1, 102, 31, 10, 2, 135, 28, 97, 0, 27, 29, 30, 31, 85, 19, 28, 0, 2, 28, 0, 0, 236, 85, 3, 0, 82, 10, 28, 0, 106, 31, 10, 16, 5, 28, 31, 9, 3, 9, 13, 28, 106, 28, 10, 4, 103, 10, 28, 9, 3, 30, 11, 1, 5, 31, 30, 10, 3, 31, 9, 31, 135, 28, 1, 0, 31, 19, 10, 0, 120, 8, 7, 0, 1, 6, 23, 0, 119, 0, 51, 0, 120, 8, 3, 0, 1, 6, 23, 0, 119, 0, 48, 0, 26, 5, 5, 1, 25, 5, 5, 1, 55, 28, 5, 20, 192, 111, 0, 0, 32, 28, 12, 0, 20, 28, 14, 28, 125, 0, 28, 8, 0, 0, 0, 0, 34, 28, 12, 1, 121, 28, 3, 0, 25, 12, 12, 1, 119, 0, 162, 255, 2, 28, 0, 0, 33, 87, 1, 0, 78, 28, 28, 0, 32, 28, 28, 0, 1, 31, 0, 0, 125, 7, 28, 7, 31, 0, 0, 0, 135, 31, 98, 0, 22, 0, 0, 0, 1, 28, 0, 0, 2, 30, 0, 0, 240, 85, 3, 0, 82, 30, 30, 0, 1, 29, 0, 0, 135, 31, 99, 0, 22, 28, 30, 29, 135, 31, 100, 0, 2, 29, 0, 0, 236, 85, 3, 0, 82, 29, 29, 0, 135, 31, 101, 0, 29, 0, 0, 0, 25, 6, 6, 1, 135, 31, 17, 0, 27, 31, 31, 7, 29, 31, 31, 100, 4, 5, 6, 31, 1, 31, 0, 0, 47, 31, 31, 5, 192, 113, 0, 0, 27, 29, 5, 100, 28, 29, 29, 7, 135, 31, 16, 0, 29, 0, 0, 0, 119, 0, 100, 255, 32, 31, 6, 4, 121, 31, 24, 0, 135, 31, 98, 0, 21, 0, 0, 0, 1, 29, 0, 0, 2, 30, 0, 0, 240, 85, 3, 0, 82, 30, 30, 0, 1, 28, 0, 0, 135, 31, 99, 0, 22, 29, 30, 28, 135, 31, 100, 0, 2, 28, 0, 0, 236, 85, 3, 0, 82, 28, 28, 0, 135, 31, 101, 0, 28, 0, 0, 0, 135, 31, 102, 0, 21, 0, 0, 0, 135, 31, 102, 0, 22, 0, 0, 0, 1, 22, 1, 0, 137, 23, 0, 0, 139, 22, 0, 0, 119, 0, 27, 0, 32, 31, 6, 23, 121, 31, 25, 0, 135, 31, 98, 0, 21, 0, 0, 0, 135, 31, 98, 0, 22, 0, 0, 0, 1, 28, 0, 0, 2, 30, 0, 0, 240, 85, 3, 0, 82, 30, 30, 0, 1, 29, 0, 0, 135, 31, 99, 0, 22, 28, 30, 29, 135, 31, 100, 0, 2, 29, 0, 0, 236, 85, 3, 0, 82, 29, 29, 0, 135, 31, 101, 0, 29, 0, 0, 0, 135, 31, 102, 0, 21, 0, 0, 0, 135, 31, 102, 0, 22, 0, 0, 0, 1, 22, 0, 0, 137, 23, 0, 0, 139, 22, 0, 0, 1, 31, 0, 0, 139, 31, 0, 0, 140, 1, 21, 0, 0, 0, 0, 0, 2, 12, 0, 0, 223, 83, 0, 0, 2, 13, 0, 0, 229, 89, 3, 0, 1, 9, 0, 0, 136, 14, 0, 0, 0, 10, 14, 0, 136, 14, 0, 0, 25, 14, 14, 48, 137, 14, 0, 0, 130, 14, 0, 0, 136, 15, 0, 0, 49, 14, 14, 15, 228, 114, 0, 0, 1, 15, 48, 0, 135, 14, 0, 0, 15, 0, 0, 0, 25, 2, 10, 20, 0, 3, 10, 0, 2, 14, 0, 0, 172, 89, 3, 0, 1, 15, 0, 0, 84, 14, 15, 0, 2, 15, 0, 0, 170, 89, 3, 0, 1, 14, 0, 0, 84, 15, 14, 0, 2, 14, 0, 0, 174, 89, 3, 0, 1, 15, 64, 1, 84, 14, 15, 0, 2, 15, 0, 0, 176, 89, 3, 0, 1, 14, 200, 0, 84, 15, 14, 0, 2, 14, 0, 0, 12, 87, 3, 0, 82, 4, 14, 0, 135, 14, 103, 0, 4, 0, 0, 0, 1, 15, 0, 0, 1, 16, 255, 0, 1, 17, 208, 13, 1, 18, 10, 0, 135, 14, 12, 0, 15, 16, 17, 18, 25, 5, 3, 16, 25, 6, 2, 16, 25, 7, 2, 16, 25, 8, 3, 1, 0, 0, 4, 0, 78, 14, 13, 0, 121, 14, 27, 0, 2, 14, 0, 0, 124, 79, 1, 0, 82, 14, 14, 0, 1, 18, 0, 0, 1, 17, 2, 0, 138, 14, 18, 17, 152, 115, 0, 0, 160, 115, 0, 0, 119, 0, 5, 0, 135, 18, 33, 0, 119, 0, 3, 0, 135, 18, 34, 0, 119, 0, 1, 0, 2, 14, 0, 0, 124, 79, 1, 0, 2, 18, 0, 0, 124, 79, 1, 0, 82, 18, 18, 0, 40, 18, 18, 1, 85, 14, 18, 0, 1, 14, 3, 0, 135, 18, 16, 0, 14, 0, 0, 0, 135, 18, 6, 0, 1, 18, 0, 0, 83, 13, 18, 0, 1, 14, 5, 0, 135, 18, 16, 0, 14, 0, 0, 0, 135, 18, 26, 0, 3, 0, 0, 0, 79, 18, 5, 0, 103, 14, 5, 1, 41, 14, 14, 8, 20, 18, 18, 14, 103, 14, 5, 2, 41, 14, 14, 16, 20, 18, 18, 14, 103, 14, 5, 3, 41, 14, 14, 24, 20, 18, 18, 14, 1, 14, 0, 0, 1, 17, 7, 0, 138, 18, 14, 17, 68, 116, 0, 0, 64, 116, 0, 0, 152, 117, 0, 0, 64, 116, 0, 0, 156, 117, 0, 0, 64, 116, 0, 0, 80, 118, 0, 0, 119, 0, 133, 0, 25, 1, 0, 1, 1, 17, 19, 0, 47, 17, 17, 0, 16, 117, 0, 0, 1, 14, 21, 0, 135, 17, 104, 0, 14, 0, 0, 0, 2, 17, 0, 0, 168, 89, 3, 0, 2, 14, 0, 0, 84, 79, 1, 0, 82, 14, 14, 0, 2, 16, 0, 0, 0, 86, 3, 0, 82, 16, 16, 0, 7, 14, 14, 16, 2, 16, 0, 0, 217, 255, 0, 0, 3, 14, 14, 16, 84, 17, 14, 0, 2, 14, 0, 0, 170, 89, 3, 0, 1, 17, 0, 0, 84, 14, 17, 0, 2, 17, 0, 0, 172, 89, 3, 0, 1, 14, 64, 1, 84, 17, 14, 0, 2, 14, 0, 0, 3, 90, 3, 0, 1, 17, 19, 0, 83, 14, 17, 0, 2, 17, 0, 0, 4, 90, 3, 0, 1, 14, 45, 0, 83, 17, 14, 0, 2, 17, 0, 0, 136, 131, 1, 0, 135, 14, 105, 0, 17, 0, 0, 0, 2, 17, 0, 0, 156, 131, 1, 0, 135, 14, 105, 0, 17, 0, 0, 0, 2, 17, 0, 0, 173, 131, 1, 0, 135, 14, 105, 0, 17, 0, 0, 0, 135, 14, 11, 0, 1, 0, 21, 0, 119, 0, 4, 0, 135, 14, 104, 0, 1, 0, 0, 0, 0, 0, 1, 0, 135, 14, 11, 0, 1, 17, 0, 0, 135, 14, 14, 0, 17, 0, 0, 0, 135, 14, 17, 0, 27, 14, 14, 7, 29, 1, 14, 100, 1, 17, 5, 0, 135, 14, 16, 0, 17, 0, 0, 0, 135, 14, 26, 0, 2, 0, 0, 0, 135, 14, 17, 0, 27, 14, 14, 7, 29, 14, 14, 100, 4, 14, 14, 1, 34, 11, 14, 10, 79, 14, 7, 0, 103, 17, 7, 1, 41, 17, 17, 8, 20, 14, 14, 17, 103, 17, 7, 2, 41, 17, 17, 16, 20, 14, 14, 17, 103, 17, 7, 3, 41, 17, 17, 24, 20, 14, 14, 17, 33, 14, 14, 8, 19, 14, 14, 11, 120, 14, 234, 255, 119, 0, 48, 0, 119, 0, 171, 255, 26, 0, 0, 1, 1, 14, 4, 0, 15, 14, 14, 0, 1, 17, 4, 0, 125, 0, 14, 0, 17, 0, 0, 0, 1, 17, 18, 0, 47, 17, 17, 0, 204, 117, 0, 0, 135, 17, 103, 0, 0, 0, 0, 0, 119, 0, 3, 0, 135, 17, 104, 0, 0, 0, 0, 0, 135, 17, 11, 0, 1, 14, 0, 0, 135, 17, 14, 0, 14, 0, 0, 0, 135, 17, 17, 0, 27, 17, 17, 7, 29, 1, 17, 100, 1, 14, 5, 0, 135, 17, 16, 0, 14, 0, 0, 0, 135, 17, 26, 0, 2, 0, 0, 0, 135, 17, 17, 0, 27, 17, 17, 7, 29, 17, 17, 100, 4, 17, 17, 1, 34, 11, 17, 10, 79, 17, 6, 0, 103, 14, 6, 1, 41, 14, 14, 8, 20, 17, 17, 14, 103, 14, 6, 2, 41, 14, 14, 16, 20, 17, 17, 14, 103, 14, 6, 3, 41, 14, 14, 24, 20, 17, 17, 14, 33, 17, 17, 8, 19, 17, 17, 11, 120, 17, 234, 255, 119, 0, 2, 0, 119, 0, 211, 255, 78, 18, 3, 0, 120, 18, 15, 0, 2, 18, 0, 0, 221, 73, 2, 0, 78, 18, 18, 0, 120, 18, 11, 0, 78, 18, 8, 0, 121, 18, 3, 0, 1, 9, 24, 0, 119, 0, 7, 0, 2, 18, 0, 0, 235, 73, 2, 0, 78, 18, 18, 0, 121, 18, 57, 255, 1, 9, 24, 0, 119, 0, 1, 0, 32, 18, 9, 24, 121, 18, 31, 0, 1, 14, 39, 0, 135, 18, 14, 0, 14, 0, 0, 0, 1, 14, 0, 0, 1, 17, 255, 0, 1, 16, 43, 0, 1, 15, 0, 0, 1, 19, 0, 0, 1, 20, 10, 0, 135, 18, 22, 0, 14, 17, 16, 15, 19, 20, 0, 0, 2, 18, 0, 0, 84, 79, 1, 0, 82, 18, 18, 0, 31, 18, 18, 200, 120, 18, 4, 0, 137, 10, 0, 0, 1, 18, 0, 0, 139, 18, 0, 0, 2, 20, 0, 0, 248, 85, 3, 0, 82, 20, 20, 0, 1, 19, 0, 0, 1, 15, 0, 0, 135, 18, 58, 0, 20, 19, 15, 0, 137, 10, 0, 0, 1, 18, 0, 0, 139, 18, 0, 0, 46, 18, 4, 0, 64, 119, 0, 0, 1, 15, 32, 0, 135, 18, 14, 0, 15, 0, 0, 0, 2, 15, 0, 0, 187, 131, 1, 0, 135, 18, 63, 0, 15, 0, 0, 0, 135, 18, 106, 0, 0, 0, 0, 0, 1, 15, 32, 0, 135, 18, 14, 0, 15, 0, 0, 0, 1, 15, 0, 0, 1, 19, 255, 0, 1, 20, 43, 0, 1, 16, 0, 0, 1, 17, 0, 0, 1, 14, 10, 0, 135, 18, 22, 0, 15, 19, 20, 16, 17, 14, 0, 0, 2, 18, 0, 0, 84, 79, 1, 0, 82, 18, 18, 0, 31, 18, 18, 200, 120, 18, 4, 0, 137, 10, 0, 0, 1, 18, 0, 0, 139, 18, 0, 0, 2, 14, 0, 0, 248, 85, 3, 0, 82, 14, 14, 0, 1, 17, 0, 0, 1, 16, 0, 0, 135, 18, 58, 0, 14, 17, 16, 0, 137, 10, 0, 0, 1, 18, 0, 0, 139, 18, 0, 0, 140, 0, 16, 0, 0, 0, 0, 0, 2, 7, 0, 0, 174, 213, 0, 0, 2, 8, 0, 0, 136, 213, 0, 0, 2, 9, 0, 0, 173, 213, 0, 0, 2, 11, 0, 0, 64, 220, 2, 0, 1, 12, 0, 0, 1, 13, 0, 16, 135, 10, 107, 0, 11, 12, 13, 0, 2, 10, 0, 0, 236, 86, 3, 0, 82, 1, 10, 0, 25, 0, 1, 34], eb + 20480);
    HEAPU8.set([25, 1, 1, 36, 79, 10, 1, 0, 103, 13, 1, 1, 41, 13, 13, 8, 20, 10, 10, 13, 2, 13, 0, 0, 255, 255, 0, 0, 19, 10, 10, 13, 2, 13, 0, 0, 64, 220, 2, 0, 79, 12, 0, 0, 103, 11, 0, 1, 41, 11, 11, 8, 20, 12, 12, 11, 2, 11, 0, 0, 255, 255, 0, 0, 19, 12, 12, 11, 41, 12, 12, 6, 3, 13, 13, 12, 1, 12, 1, 0, 95, 10, 13, 12, 2, 12, 0, 0, 240, 85, 3, 0, 82, 12, 12, 0, 135, 0, 96, 0, 12, 0, 0, 0, 2, 12, 0, 0, 168, 86, 3, 0, 82, 12, 12, 0, 3, 0, 0, 12, 2, 12, 0, 0, 148, 86, 3, 0, 85, 12, 0, 0, 2, 12, 0, 0, 32, 86, 3, 0, 2, 13, 0, 0, 244, 85, 3, 0, 82, 13, 13, 0, 85, 12, 13, 0, 2, 13, 0, 0, 236, 86, 3, 0, 82, 1, 13, 0, 25, 2, 1, 51, 79, 13, 2, 0, 103, 12, 2, 1, 41, 12, 12, 8, 20, 13, 13, 12, 41, 13, 13, 16, 42, 13, 13, 16, 0, 2, 13, 0, 2, 13, 0, 0, 198, 89, 3, 0, 27, 12, 2, 10, 84, 13, 12, 0, 2, 12, 0, 0, 80, 142, 2, 0, 41, 13, 2, 2, 94, 3, 12, 13, 2, 12, 0, 0, 72, 86, 3, 0, 85, 12, 3, 0, 2, 12, 0, 0, 184, 143, 2, 0, 41, 13, 2, 2, 94, 2, 12, 13, 2, 12, 0, 0, 76, 86, 3, 0, 85, 12, 2, 0, 25, 6, 1, 26, 79, 12, 6, 0, 103, 13, 6, 1, 41, 13, 13, 8, 20, 12, 12, 13, 103, 13, 6, 2, 41, 13, 13, 16, 20, 12, 12, 13, 103, 13, 6, 3, 41, 13, 13, 24, 20, 12, 12, 13, 0, 6, 12, 0, 2, 12, 0, 0, 164, 86, 3, 0, 82, 5, 12, 0, 34, 12, 5, 0, 41, 12, 12, 31, 42, 12, 12, 31, 0, 4, 12, 0, 34, 12, 2, 0, 41, 12, 12, 31, 42, 12, 12, 31, 135, 2, 108, 0, 5, 4, 2, 12, 135, 12, 109, 0, 2, 13, 0, 0, 0, 128, 0, 0, 1, 10, 0, 0, 135, 2, 110, 0, 2, 12, 13, 10, 135, 10, 109, 0, 1, 13, 16, 0, 135, 2, 111, 0, 2, 10, 13, 0, 135, 13, 109, 0, 4, 2, 6, 2, 2, 13, 0, 0, 64, 86, 3, 0, 85, 13, 2, 0, 25, 1, 1, 30, 79, 13, 1, 0, 103, 10, 1, 1, 41, 10, 10, 8, 20, 13, 13, 10, 103, 10, 1, 2, 41, 10, 10, 16, 20, 13, 13, 10, 103, 10, 1, 3, 41, 10, 10, 24, 20, 13, 13, 10, 0, 1, 13, 0, 34, 13, 3, 0, 41, 13, 13, 31, 42, 13, 13, 31, 135, 3, 108, 0, 5, 4, 3, 13, 135, 13, 109, 0, 2, 10, 0, 0, 0, 128, 0, 0, 1, 12, 0, 0, 135, 3, 110, 0, 3, 13, 10, 12, 135, 12, 109, 0, 1, 10, 16, 0, 135, 3, 111, 0, 3, 12, 10, 0, 135, 10, 109, 0, 3, 3, 1, 3, 2, 10, 0, 0, 68, 86, 3, 0, 85, 10, 3, 0, 2, 10, 0, 0, 194, 89, 3, 0, 43, 12, 2, 16, 84, 10, 12, 0, 2, 12, 0, 0, 196, 89, 3, 0, 43, 10, 3, 16, 84, 12, 10, 0, 2, 10, 0, 0, 128, 15, 1, 0, 2, 12, 0, 0, 72, 90, 3, 0, 79, 12, 12, 0, 2, 13, 0, 0, 73, 90, 3, 0, 79, 13, 13, 0, 41, 13, 13, 8, 20, 12, 12, 13, 41, 12, 12, 16, 42, 12, 12, 16, 27, 12, 12, 10, 2, 13, 0, 0, 68, 85, 3, 0, 82, 13, 13, 0, 3, 12, 12, 13, 90, 3, 10, 12, 2, 10, 0, 0, 184, 86, 3, 0, 82, 2, 10, 0, 1, 10, 1, 0, 47, 10, 10, 2, 244, 122, 0, 0, 1, 1, 0, 0, 2, 12, 0, 0, 180, 86, 3, 0, 82, 12, 12, 0, 135, 10, 107, 0, 0, 3, 12, 0, 25, 1, 1, 1, 2, 10, 0, 0, 32, 86, 3, 0, 82, 10, 10, 0, 3, 0, 0, 10, 2, 10, 0, 0, 184, 86, 3, 0, 82, 2, 10, 0, 28, 10, 2, 2, 54, 10, 1, 10, 176, 122, 0, 0, 119, 0, 2, 0, 1, 1, 0, 0, 47, 10, 1, 2, 68, 123, 0, 0, 1, 12, 25, 0, 2, 13, 0, 0, 180, 86, 3, 0, 82, 13, 13, 0, 135, 10, 107, 0, 0, 12, 13, 0, 25, 1, 1, 1, 2, 10, 0, 0, 184, 86, 3, 0, 82, 10, 10, 0, 56, 10, 10, 1, 68, 123, 0, 0, 2, 10, 0, 0, 32, 86, 3, 0, 82, 10, 10, 0, 3, 0, 0, 10, 119, 0, 240, 255, 135, 10, 112, 0, 135, 10, 113, 0, 135, 10, 114, 0, 2, 10, 0, 0, 217, 73, 2, 0, 78, 10, 10, 0, 33, 10, 10, 0, 2, 13, 0, 0, 12, 87, 3, 0, 82, 13, 13, 0, 32, 13, 13, 21, 19, 10, 10, 13, 2, 13, 0, 0, 56, 90, 3, 0, 79, 13, 13, 0, 2, 12, 0, 0, 57, 90, 3, 0, 79, 12, 12, 0, 41, 12, 12, 8, 20, 13, 13, 12, 2, 12, 0, 0, 58, 90, 3, 0, 79, 12, 12, 0, 41, 12, 12, 16, 20, 13, 13, 12, 2, 12, 0, 0, 59, 90, 3, 0, 79, 12, 12, 0, 41, 12, 12, 24, 20, 13, 13, 12, 33, 13, 13, 255, 19, 10, 10, 13, 121, 10, 2, 0, 135, 10, 115, 0, 2, 13, 0, 0, 240, 85, 3, 0, 82, 13, 13, 0, 135, 10, 98, 0, 13, 0, 0, 0, 2, 10, 0, 0, 148, 86, 3, 0, 1, 13, 0, 0, 85, 10, 13, 0, 2, 13, 0, 0, 27, 90, 3, 0, 78, 13, 13, 0, 120, 13, 51, 0, 2, 13, 0, 0, 25, 90, 3, 0, 78, 13, 13, 0, 121, 13, 40, 0, 2, 13, 0, 0, 224, 85, 3, 0, 1, 10, 0, 0, 85, 13, 10, 0, 2, 10, 0, 0, 3, 90, 3, 0, 1, 13, 7, 0, 83, 10, 13, 0, 2, 13, 0, 0, 4, 90, 3, 0, 1, 10, 127, 0, 83, 13, 10, 0, 2, 10, 0, 0, 166, 89, 3, 0, 1, 13, 4, 0, 84, 10, 13, 0, 2, 13, 0, 0, 168, 89, 3, 0, 1, 10, 1, 0, 84, 13, 10, 0, 1, 13, 0, 0, 1, 12, 0, 0, 1, 11, 50, 0, 1, 14, 10, 0, 2, 15, 0, 0, 190, 115, 1, 0, 79, 15, 15, 0, 135, 10, 3, 0, 13, 12, 11, 14, 15, 0, 0, 0, 2, 15, 0, 0, 48, 86, 3, 0, 82, 15, 15, 0, 135, 10, 116, 0, 15, 0, 0, 0, 2, 15, 0, 0, 185, 115, 1, 0, 135, 10, 31, 0, 15, 0, 0, 0, 135, 10, 100, 0, 2, 15, 0, 0, 236, 85, 3, 0, 82, 15, 15, 0, 135, 10, 101, 0, 15, 0, 0, 0, 119, 0, 11, 0, 2, 10, 0, 0, 27, 90, 3, 0, 1, 15, 0, 0, 83, 10, 15, 0, 2, 15, 0, 0, 36, 86, 3, 0, 135, 10, 17, 0, 27, 10, 10, 7, 29, 10, 10, 100, 85, 15, 10, 0, 2, 10, 0, 0, 25, 90, 3, 0, 78, 10, 10, 0, 120, 10, 2, 0, 139, 0, 0, 0, 2, 10, 0, 0, 40, 86, 3, 0, 82, 10, 10, 0, 25, 1, 10, 1, 2, 10, 0, 0, 40, 86, 3, 0, 85, 10, 1, 0, 2, 10, 0, 0, 44, 86, 3, 0, 82, 10, 10, 0, 2, 15, 0, 0, 8, 87, 3, 0, 82, 15, 15, 0, 3, 0, 10, 15, 2, 15, 0, 0, 44, 86, 3, 0, 85, 15, 0, 0, 36, 15, 0, 35, 121, 15, 2, 0, 139, 0, 0, 0, 2, 15, 0, 0, 44, 86, 3, 0, 26, 10, 0, 35, 85, 15, 10, 0, 2, 10, 0, 0, 48, 86, 3, 0, 41, 15, 1, 1, 85, 10, 15, 0, 2, 15, 0, 0, 40, 86, 3, 0, 1, 10, 0, 0, 85, 15, 10, 0, 139, 0, 0, 0, 140, 1, 14, 0, 0, 0, 0, 0, 2, 4, 0, 0, 180, 213, 0, 0, 2, 5, 0, 0, 255, 0, 0, 0, 2, 6, 0, 0, 182, 213, 0, 0, 1, 3, 0, 0, 2, 7, 0, 0, 26, 90, 3, 0, 78, 7, 7, 0, 120, 7, 32, 0, 2, 7, 0, 0, 208, 86, 3, 0, 1, 8, 14, 0, 85, 7, 8, 0, 135, 8, 34, 0, 2, 8, 0, 0, 64, 43, 2, 0, 2, 7, 0, 0, 208, 86, 3, 0, 82, 7, 7, 0, 1, 9, 5, 1, 3, 7, 7, 9, 41, 7, 7, 2, 94, 1, 8, 7, 121, 1, 13, 0, 135, 8, 65, 0, 1, 0, 0, 0, 2, 8, 0, 0, 64, 43, 2, 0, 2, 7, 0, 0, 208, 86, 3, 0, 82, 7, 7, 0, 1, 9, 5, 1, 3, 7, 7, 9, 41, 7, 7, 2, 1, 9, 0, 0, 97, 8, 7, 9, 1, 7, 19, 1, 135, 9, 66, 0, 7, 0, 0, 0, 119, 0, 38, 0, 135, 9, 117, 0, 0, 0, 0, 0, 121, 9, 2, 0, 139, 0, 0, 0, 2, 9, 0, 0, 208, 86, 3, 0, 1, 7, 14, 0, 85, 9, 7, 0, 135, 1, 34, 0, 2, 7, 0, 0, 64, 43, 2, 0, 2, 9, 0, 0, 208, 86, 3, 0, 82, 9, 9, 0, 1, 8, 5, 1, 3, 9, 9, 8, 41, 9, 9, 2, 94, 2, 7, 9, 121, 2, 13, 0, 135, 7, 65, 0, 2, 0, 0, 0, 2, 7, 0, 0, 64, 43, 2, 0, 2, 9, 0, 0, 208, 86, 3, 0, 82, 9, 9, 0, 1, 8, 5, 1, 3, 9, 9, 8, 41, 9, 9, 2, 1, 8, 0, 0, 97, 7, 9, 8, 1, 9, 19, 1, 135, 8, 66, 0, 9, 0, 0, 0, 2, 8, 0, 0, 36, 87, 3, 0, 85, 8, 1, 0, 135, 8, 118, 0, 1, 8, 58, 4, 1, 10, 6, 0, 138, 0, 8, 10, 48, 130, 0, 0, 56, 130, 0, 0, 72, 130, 0, 0, 88, 130, 0, 0, 104, 130, 0, 0, 120, 130, 0, 0, 135, 8, 119, 0, 1, 9, 0, 0, 1, 7, 208, 13, 1, 10, 10, 0, 135, 8, 12, 0, 9, 5, 7, 10, 2, 8, 0, 0, 216, 86, 3, 0, 1, 10, 0, 0, 85, 8, 10, 0, 2, 8, 0, 0, 56, 135, 1, 0, 2, 7, 0, 0, 0, 30, 1, 0, 1, 9, 0, 0, 135, 10, 120, 0, 8, 7, 9, 0, 1, 8, 255, 255, 1, 7, 11, 0, 138, 10, 8, 7, 156, 127, 0, 0, 112, 127, 0, 0, 112, 127, 0, 0, 112, 127, 0, 0, 112, 127, 0, 0, 112, 127, 0, 0, 112, 127, 0, 0, 112, 127, 0, 0, 172, 127, 0, 0, 16, 128, 0, 0, 204, 128, 0, 0, 2, 8, 0, 0, 216, 86, 3, 0, 82, 8, 8, 0, 120, 8, 89, 0, 135, 8, 119, 0, 1, 13, 0, 0, 1, 12, 208, 13, 1, 7, 10, 0, 135, 8, 12, 0, 13, 5, 12, 7, 119, 0, 78, 0, 1, 13, 0, 0, 135, 8, 121, 0, 13, 0, 0, 0, 119, 0, 74, 0, 2, 9, 0, 0, 76, 31, 1, 0, 81, 9, 9, 0, 2, 7, 0, 0, 78, 31, 1, 0, 81, 7, 7, 0, 41, 7, 7, 16, 20, 9, 9, 7, 120, 9, 10, 0, 2, 9, 0, 0, 66, 135, 1, 0, 135, 0, 62, 0, 9, 0, 0, 0, 135, 9, 119, 0, 120, 0, 2, 0, 119, 0, 58, 0, 1, 3, 21, 0, 119, 0, 60, 0, 135, 9, 119, 0, 1, 7, 0, 0, 1, 8, 208, 13, 1, 11, 10, 0, 135, 9, 12, 0, 7, 5, 8, 11, 119, 0, 49, 0, 2, 9, 0, 0, 216, 86, 3, 0, 1, 11, 1, 0, 85, 9, 11, 0, 2, 11, 0, 0, 26, 90, 3, 0, 78, 11, 11, 0, 120, 11, 31, 0, 2, 11, 0, 0, 208, 86, 3, 0, 1, 9, 7, 0, 85, 11, 9, 0, 135, 9, 34, 0, 2, 9, 0, 0, 64, 43, 2, 0, 2, 11, 0, 0, 208, 86, 3, 0, 82, 11, 11, 0, 1, 8, 5, 1, 3, 11, 11, 8, 41, 11, 11, 2, 94, 1, 9, 11, 121, 1, 13, 0, 135, 9, 65, 0, 1, 0, 0, 0, 2, 9, 0, 0, 64, 43, 2, 0, 2, 11, 0, 0, 208, 86, 3, 0, 82, 11, 11, 0, 1, 8, 5, 1, 3, 11, 11, 8, 41, 11, 11, 2, 1, 8, 0, 0, 97, 9, 11, 8, 1, 11, 12, 1, 135, 8, 66, 0, 11, 0, 0, 0, 1, 11, 0, 0, 1, 9, 0, 0, 1, 7, 0, 0, 1, 12, 0, 0, 1, 13, 10, 0, 135, 8, 22, 0, 11, 5, 9, 7, 12, 13, 0, 0, 119, 0, 2, 0, 119, 0, 180, 255, 2, 10, 0, 0, 216, 86, 3, 0, 82, 10, 10, 0, 121, 10, 144, 255, 32, 10, 3, 21, 121, 10, 49, 0, 2, 10, 0, 0, 44, 90, 3, 0, 1, 8, 0, 0, 83, 10, 8, 0, 2, 8, 0, 0, 45, 90, 3, 0, 1, 10, 0, 0, 83, 8, 10, 0, 2, 10, 0, 0, 220, 86, 3, 0, 1, 8, 0, 0, 85, 10, 8, 0, 2, 8, 0, 0, 224, 86, 3, 0, 1, 10, 2, 0, 85, 8, 10, 0, 2, 10, 0, 0, 248, 86, 3, 0, 1, 8, 0, 0, 85, 10, 8, 0, 2, 8, 0, 0, 168, 30, 1, 0, 1, 10, 0, 0, 84, 8, 10, 0, 2, 10, 0, 0, 76, 31, 1, 0, 1, 8, 8, 0, 84, 10, 8, 0, 2, 8, 0, 0, 78, 31, 1, 0, 1, 10, 8, 0, 43, 10, 10, 16, 84, 8, 10, 0, 2, 1, 0, 0, 40, 31, 1, 0, 2, 2, 0, 0, 131, 135, 1, 0, 25, 0, 1, 12, 78, 10, 2, 0, 83, 1, 10, 0, 25, 1, 1, 1, 25, 2, 2, 1, 54, 10, 1, 0, 128, 129, 0, 0, 2, 10, 0, 0, 216, 86, 3, 0, 1, 8, 1, 0, 85, 10, 8, 0, 135, 8, 122, 0, 2, 8, 0, 0, 101, 90, 3, 0, 78, 8, 8, 0, 2, 10, 0, 0, 100, 90, 3, 0, 78, 10, 10, 0, 20, 8, 8, 10, 41, 8, 8, 24, 42, 8, 8, 24, 120, 8, 2, 0, 139, 0, 0, 0, 2, 8, 0, 0, 76, 31, 1, 0, 1, 10, 0, 0, 84, 8, 10, 0, 2, 10, 0, 0, 78, 31, 1, 0, 1, 8, 0, 0, 43, 8, 8, 16, 84, 10, 8, 0, 2, 1, 0, 0, 40, 31, 1, 0, 2, 2, 0, 0, 143, 135, 1, 0, 25, 0, 1, 9, 78, 8, 2, 0, 83, 1, 8, 0, 25, 1, 1, 1, 25, 2, 2, 1, 54, 8, 1, 0, 16, 130, 0, 0, 139, 0, 0, 0, 119, 0, 23, 0, 135, 8, 123, 0, 119, 0, 21, 0, 1, 9, 0, 0, 135, 8, 64, 0, 9, 0, 0, 0, 119, 0, 17, 0, 1, 9, 0, 0, 135, 8, 71, 0, 9, 0, 0, 0, 119, 0, 13, 0, 1, 9, 0, 0, 135, 8, 124, 0, 9, 0, 0, 0, 119, 0, 9, 0, 1, 9, 0, 0, 135, 8, 125, 0, 9, 0, 0, 0, 119, 0, 5, 0, 1, 9, 0, 0, 135, 8, 126, 0, 9, 0, 0, 0, 119, 0, 1, 0, 135, 8, 122, 0, 139, 0, 0, 0, 140, 1, 22, 0, 0, 0, 0, 0, 2, 12, 0, 0, 221, 131, 1, 0, 2, 13, 0, 0, 220, 131, 1, 0, 2, 14, 0, 0, 159, 0, 0, 0, 1, 9, 0, 0, 136, 15, 0, 0, 0, 10, 15, 0, 136, 15, 0, 0, 1, 16, 112, 1, 3, 15, 15, 16, 137, 15, 0, 0, 130, 15, 0, 0, 136, 16, 0, 0, 49, 15, 15, 16, 232, 130, 0, 0, 1, 16, 112, 1, 135, 15, 0, 0, 16, 0, 0, 0, 1, 15, 88, 1, 3, 8, 10, 15, 1, 15, 80, 1, 3, 1, 10, 15, 1, 15, 96, 1, 3, 5, 10, 15, 25, 6, 10, 32, 0, 7, 10, 0, 2, 16, 0, 0, 199, 131, 1, 0, 135, 15, 25, 0, 5, 16, 0, 0, 121, 0, 64, 0, 2, 15, 0, 0, 218, 131, 1, 0, 79, 15, 15, 0, 2, 16, 0, 0, 219, 131, 1, 0, 79, 16, 16, 0, 41, 16, 16, 8, 20, 15, 15, 16, 41, 15, 15, 16, 42, 15, 15, 16, 0, 0, 15, 0, 2, 15, 0, 0, 0, 160, 2, 0, 41, 16, 0, 2, 94, 15, 15, 16, 121, 15, 48, 0, 25, 16, 0, 48, 107, 5, 7, 16, 2, 16, 0, 0, 0, 159, 2, 0, 78, 16, 16, 0, 120, 16, 4, 0, 135, 16, 25, 0, 6, 5, 0, 0, 119, 0, 10, 0, 2, 16, 0, 0, 0, 159, 2, 0, 85, 1, 16, 0, 109, 1, 4, 5, 1, 15, 44, 1, 2, 17, 0, 0, 222, 131, 1, 0, 135, 16, 127, 0, 6, 15, 17, 1, 135, 16, 128, 0, 6, 0, 0, 0, 2, 16, 0, 0, 228, 131, 1, 0, 135, 9, 129, 0, 6, 16, 0, 0, 2, 17, 0, 0, 48, 160, 2, 0, 41, 15, 0, 5, 3, 17, 17, 15, 135, 16, 25, 0, 7, 17, 0, 0, 1, 17, 1, 0, 1, 15, 32, 0, 135, 16, 130, 0, 7, 17, 15, 9, 1, 15, 32, 0, 1, 17, 0, 0, 135, 16, 131, 0, 9, 15, 17, 0, 1, 17, 0, 0, 1, 15, 0, 0, 135, 16, 132, 0, 9, 17, 15, 0, 135, 16, 133, 0, 9, 0, 0, 0, 1, 9, 1, 0, 137, 10, 0, 0, 139, 9, 0, 0, 1, 15, 1, 0, 135, 16, 134, 0, 15, 0, 0, 0, 2, 16, 0, 0, 212, 131, 1, 0, 2, 15, 0, 0, 176, 31, 1, 0, 1, 17, 29, 0, 135, 0, 120, 0, 16, 15, 17, 0, 1, 17, 255, 255, 47, 17, 17, 0, 224, 134, 0, 0, 25, 4, 5, 7, 2, 17, 0, 0, 0, 160, 2, 0, 41, 15, 0, 2, 3, 2, 17, 15, 82, 15, 2, 0, 120, 15, 3, 0, 1, 9, 12, 0, 119, 0, 15, 0, 2, 17, 0, 0, 231, 131, 1, 0, 135, 15, 62, 0, 17, 0, 0, 0, 32, 3, 15, 0, 1, 17, 1, 0, 135, 15, 134, 0, 17, 0, 0, 0, 120, 3, 6, 0, 1, 17, 19, 0, 135, 15, 135, 0, 0, 17, 0, 0, 135, 15, 11, 0, 1, 9, 12, 0, 32, 15, 9, 12, 121, 15, 78, 0, 1, 9, 0, 0, 1, 17, 32, 0, 135, 15, 14, 0, 17, 0, 0, 0, 2, 15, 0, 0, 48, 160, 2, 0, 41, 17, 0, 5, 3, 3, 15, 17, 135, 17, 25, 0, 7, 3, 0, 0, 25, 17, 0, 48, 83, 4, 17, 0, 2, 17, 0, 0, 224, 85, 3, 0, 1, 15, 0, 0, 85, 17, 15, 0, 82, 15, 2, 0, 120, 15, 18, 0, 79, 15, 13, 0, 79, 17, 12, 0, 41, 17, 17, 8, 20, 15, 15, 17, 41, 15, 15, 16, 42, 15, 15, 16, 0, 11, 15, 0, 27, 15, 0, 13, 25, 1, 15, 56, 25, 17, 11, 86, 4, 16, 14, 11, 1, 18, 10, 0, 1, 19, 45, 0, 135, 15, 3, 0, 17, 1, 16, 18, 19, 0, 0, 0, 119, 0, 3, 0, 27, 15, 0, 13, 25, 1, 15, 56, 135, 15, 11, 0, 79, 15, 13, 0, 79, 19, 12, 0, 41, 19, 19, 8, 20, 15, 15, 19, 41, 15, 15, 16, 42, 15, 15, 16, 0, 11, 15, 0, 25, 19, 11, 87, 1, 18, 1, 0, 1, 16, 31, 0, 1, 17, 145, 0, 4, 17, 17, 11, 135, 15, 136, 0, 19, 1, 7, 7, 18, 16, 17, 0, 41, 15, 15, 24, 42, 15, 15, 24, 120, 15, 33, 0, 79, 15, 13, 0, 79, 17, 12, 0, 41, 17, 17, 8, 20, 15, 15, 17, 41, 15, 15, 16, 42, 15, 15, 16, 0, 11, 15, 0, 25, 17, 11, 86, 4, 16, 14, 11, 1, 18, 10, 0, 1, 19, 45, 0, 135, 15, 3, 0, 17, 1, 16, 18, 19, 0, 0, 0, 1, 19, 19, 0, 135, 15, 135, 0, 0, 19, 0, 0, 135, 15, 11, 0, 1, 19, 39, 0, 135, 15, 14, 0, 19, 0, 0, 0, 2, 15, 0, 0, 212, 131, 1, 0, 2, 19, 0, 0, 176, 31, 1, 0, 1, 18, 29, 0, 135, 0, 120, 0, 15, 19, 18, 0, 36, 18, 0, 255, 121, 18, 147, 255, 1, 0, 0, 0, 119, 0, 54, 0, 1, 18, 1, 0, 85, 2, 18, 0, 135, 18, 25, 0, 3, 7, 0, 0, 2, 18, 0, 0, 0, 159, 2, 0, 78, 18, 18, 0, 120, 18, 4, 0, 135, 18, 25, 0, 6, 5, 0, 0, 119, 0, 10, 0, 2, 18, 0, 0, 0, 159, 2, 0, 85, 8, 18, 0, 109, 8, 4, 5, 1, 19, 44, 1, 2, 15, 0, 0, 222, 131, 1, 0, 135, 18, 127, 0, 6, 19, 15, 8, 135, 18, 128, 0, 6, 0, 0, 0, 2, 18, 0, 0, 228, 131, 1, 0, 135, 0, 129, 0, 6, 18, 0, 0, 1, 15, 32, 0, 1, 19, 1, 0, 135, 18, 130, 0, 7, 15, 19, 0, 1, 19, 32, 0, 1, 15, 0, 0, 135, 18, 131, 0, 0, 19, 15, 0, 1, 15, 1, 0, 135, 18, 137, 0, 15, 0, 0, 0, 1, 15, 104, 0, 1, 19, 85, 0, 135, 18, 132, 0, 0, 15, 19, 0, 135, 18, 133, 0, 0, 0, 0, 0, 1, 19, 32, 0, 135, 18, 14, 0, 19, 0, 0, 0, 2, 18, 0, 0, 224, 85, 3, 0, 1, 19, 1, 0, 85, 18, 19, 0, 1, 0, 1, 0, 119, 0, 2, 0, 1, 0, 0, 0, 1, 18, 0, 0, 1, 15, 255, 0, 1, 16, 43, 0, 1, 17, 0, 0, 1, 20, 0, 0, 1, 21, 10, 0, 135, 19, 22, 0, 18, 15, 16, 17, 20, 21, 0, 0, 0, 11, 0, 0, 137, 10, 0, 0, 139, 11, 0, 0, 140, 6, 23, 0, 0, 0, 0, 0, 2, 16, 0, 0, 96, 91, 2, 0, 2, 17, 0, 0, 0, 1, 0, 0, 2, 18, 0, 0, 0, 4, 0, 0, 1, 12, 0, 0, 136, 19, 0, 0, 0, 14, 19, 0, 136, 19, 0, 0, 3, 19, 19, 18, 137, 19, 0, 0, 130, 19, 0, 0, 136, 20, 0, 0, 49, 19, 19, 20, 100, 135, 0, 0, 135, 19, 0, 0, 18, 0, 0, 0, 0, 13, 14, 0, 1, 19, 255, 0, 5, 19, 2, 19, 28, 11, 19, 63, 1, 19, 255, 0, 5, 19, 3, 19, 28, 9, 19, 63, 1, 19, 255, 0, 5, 19, 4, 19, 28, 10, 19, 63, 1, 20, 1, 0, 135, 19, 16, 0, 20, 0, 0, 0, 2, 20, 0, 0, 96, 87, 2, 0, 2, 21, 0, 0, 96, 95, 2, 0, 135, 19, 1, 0, 20, 21, 18, 0, 2, 21, 0, 0, 96, 95, 2, 0, 135, 19, 1, 0, 16, 21, 18, 0, 1, 19, 0, 0, 47, 19, 19, 5, 56, 138, 0, 0, 2, 19, 0, 0, 96, 87, 2, 0, 41, 21, 0, 2, 3, 7, 19, 21, 41, 21, 0, 2, 3, 8, 16, 21, 47, 21, 1, 0, 220, 136, 0, 0, 1, 2, 0, 0, 2, 21, 0, 0, 33, 87, 1, 0, 78, 21, 21, 0, 32, 21, 21, 0, 2, 19, 0, 0, 88, 79, 1, 0, 82, 19, 19, 0, 32, 19, 19, 8, 20, 21, 21, 19, 121, 21, 24, 0, 1, 19, 1, 0, 135, 21, 16, 0, 19, 0, 0, 0, 2, 21, 0, 0, 88, 79, 1, 0, 82, 1, 21, 0, 2, 19, 0, 0, 96, 95, 2, 0, 135, 21, 1, 0, 19, 16, 18, 0, 32, 21, 1, 8, 121, 21, 10, 0, 2, 19, 0, 0, 236, 85, 3, 0, 82, 19, 19, 0, 1, 20, 2, 0, 1, 22, 0, 0, 135, 21, 138, 0, 19, 20, 16, 22, 17, 0, 0, 0, 119, 0, 8, 0, 1, 12, 8, 0, 119, 0, 6, 0, 2, 22, 0, 0, 96, 95, 2, 0, 135, 21, 1, 0, 22, 16, 18, 0, 1, 12, 8, 0, 32, 21, 12, 8, 121, 21, 16, 0, 1, 12, 0, 0, 2, 22, 0, 0, 248, 85, 3, 0, 82, 22, 22, 0, 1, 20, 1, 0, 1, 19, 0, 0, 135, 21, 138, 0, 22, 20, 16, 19, 17, 0, 0, 0, 135, 21, 100, 0, 2, 19, 0, 0, 236, 85, 3, 0, 82, 19, 19, 0, 135, 21, 101, 0, 19, 0, 0, 0, 25, 2, 2, 1, 52, 21, 2, 5, 56, 138, 0, 0, 119, 0, 198, 255, 1, 4, 0, 0, 0, 2, 7, 0, 0, 3, 0, 0, 0, 6, 8, 0, 79, 15, 2, 0, 4, 19, 11, 15, 5, 21, 19, 4, 6, 21, 21, 5, 3, 21, 21, 15, 83, 6, 21, 0, 103, 15, 2, 1, 4, 20, 9, 15, 5, 19, 20, 4, 6, 19, 19, 5, 3, 19, 19, 15, 107, 6, 1, 19, 103, 15, 2, 2, 4, 20, 10, 15, 5, 21, 20, 4, 6, 21, 21, 5, 3, 21, 21, 15, 107, 6, 2, 21, 47, 21, 3, 1, 76, 137, 0, 0, 25, 2, 2, 4, 25, 3, 3, 1, 25, 6, 6, 4, 119, 0, 233, 255, 119, 0, 1, 0, 2, 21, 0, 0, 33, 87, 1, 0, 78, 21, 21, 0, 32, 21, 21, 0, 2, 19, 0, 0, 88, 79, 1, 0, 82, 19, 19, 0, 32, 19, 19, 8, 20, 21, 21, 19, 121, 21, 24, 0, 1, 19, 1, 0, 135, 21, 16, 0, 19, 0, 0, 0, 2, 21, 0, 0, 88, 79, 1, 0, 82, 15, 21, 0, 2, 19, 0, 0, 96, 95, 2, 0, 135, 21, 1, 0, 19, 16, 18, 0, 32, 21, 15, 8, 121, 21, 10, 0, 2, 19, 0, 0, 236, 85, 3, 0, 82, 19, 19, 0, 1, 20, 2, 0, 1, 22, 0, 0, 135, 21, 138, 0, 19, 20, 16, 22, 17, 0, 0, 0, 119, 0, 8, 0, 1, 12, 17, 0, 119, 0, 6, 0, 2, 22, 0, 0, 96, 95, 2, 0, 135, 21, 1, 0, 22, 16, 18, 0, 1, 12, 17, 0, 32, 21, 12, 17, 121, 21, 16, 0, 1, 12, 0, 0, 2, 22, 0, 0, 248, 85, 3, 0, 82, 22, 22, 0, 1, 20, 1, 0, 1, 19, 0, 0, 135, 21, 138, 0, 22, 20, 16, 19, 17, 0, 0, 0, 135, 21, 100, 0, 2, 19, 0, 0, 236, 85, 3, 0, 82, 19, 19, 0, 135, 21, 101, 0, 19, 0, 0, 0, 25, 4, 4, 1, 53, 21, 4, 5, 224, 136, 0, 0, 1, 21, 255, 0, 19, 21, 11, 21, 0, 6, 21, 0, 1, 21, 255, 0, 19, 21, 9, 21, 0, 4, 21, 0, 1, 21, 255, 0, 19, 21, 10, 21, 0, 3, 21, 0, 1, 2, 0, 0, 41, 21, 2, 2, 3, 15, 13, 21, 83, 15, 6, 0, 107, 15, 1, 4, 107, 15, 2, 3, 25, 2, 2, 1, 53, 21, 2, 17, 96, 138, 0, 0, 2, 19, 0, 0, 96, 95, 2, 0, 135, 21, 1, 0, 19, 13, 18, 0, 2, 21, 0, 0, 88, 79, 1, 0, 82, 21, 21, 0, 32, 21, 21, 8, 121, 21, 16, 0, 2, 19, 0, 0, 236, 85, 3, 0, 82, 19, 19, 0, 1, 20, 2, 0, 1, 22, 0, 0, 135, 21, 138, 0, 19, 20, 13, 22, 17, 0, 0, 0, 2, 21, 0, 0, 5, 90, 3, 0, 1, 22, 1, 0, 83, 21, 22, 0, 137, 14, 0, 0, 139, 0, 0, 0, 119, 0, 21, 0, 2, 21, 0, 0, 248, 85, 3, 0, 82, 21, 21, 0, 1, 20, 1, 0, 1, 19, 0, 0, 135, 22, 138, 0, 21, 20, 13, 19, 17, 0, 0, 0, 135, 22, 100, 0, 2, 19, 0, 0, 236, 85, 3, 0, 82, 19, 19, 0, 135, 22, 101, 0, 19, 0, 0, 0, 2, 22, 0, 0, 5, 90, 3, 0, 1, 19, 1, 0, 83, 22, 19, 0, 137, 14, 0, 0, 139, 0, 0, 0, 139, 0, 0, 0, 140, 4, 19, 0, 0, 0, 0, 0, 2, 11, 0, 0, 96, 91, 2, 0, 2, 12, 0, 0, 96, 87, 2, 0, 2, 13, 0, 0, 96, 95, 2, 0, 1, 6, 0, 0, 1, 15, 1, 0, 135, 14, 16, 0, 15, 0, 0, 0, 1, 15, 0, 4, 135, 14, 1, 0, 12, 13, 15, 0, 1, 15, 0, 4, 135, 14, 1, 0, 11, 13, 15, 0, 1, 14, 0, 0, 47, 14, 14, 3, 240, 141, 0, 0, 47, 14, 1, 0, 128, 140, 0, 0, 1, 4, 0, 0, 2, 14, 0, 0, 33, 87, 1, 0, 78, 14, 14, 0, 32, 14, 14, 0, 2, 15, 0, 0, 88, 79, 1, 0, 82, 15, 15, 0, 32, 15, 15, 8, 20, 14, 14, 15, 121, 14, 24, 0, 1, 15, 1, 0, 135, 14, 16, 0, 15, 0, 0, 0, 2, 14, 0, 0, 88, 79, 1, 0, 82, 1, 14, 0, 1, 15, 0, 4, 135, 14, 1, 0, 13, 11, 15, 0, 32, 14, 1, 8, 121, 14, 11, 0, 2, 15, 0, 0, 236, 85, 3, 0, 82, 15, 15, 0, 1, 16, 2, 0, 1, 17, 0, 0, 1, 18, 0, 1, 135, 14, 138, 0, 15, 16, 11, 17, 18, 0, 0, 0, 119, 0, 7, 0, 1, 6, 8, 0, 119, 0, 5, 0, 1, 18, 0, 4, 135, 14, 1, 0, 13, 11, 18, 0, 1, 6, 8, 0, 32, 14, 6, 8, 121, 14, 17, 0, 1, 6, 0, 0, 2, 18, 0, 0, 248, 85, 3, 0, 82, 18, 18, 0, 1, 17, 1, 0, 1, 16, 0, 0, 1, 15, 0, 1, 135, 14, 138, 0, 18, 17, 11, 16, 15, 0, 0, 0, 135, 14, 100, 0, 2, 15, 0, 0, 236, 85, 3, 0, 82, 15, 15, 0, 135, 14, 101, 0, 15, 0, 0, 0, 25, 4, 4, 1, 52, 14, 4, 3, 240, 141, 0, 0, 119, 0, 198, 255, 1, 5, 0, 0, 0, 4, 0, 0, 41, 14, 4, 2, 3, 8, 12, 14, 79, 10, 8, 0, 41, 14, 4, 2, 3, 7, 11, 14, 41, 14, 4, 2, 3, 9, 2, 14, 79, 15, 9, 0, 4, 15, 15, 10, 5, 14, 15, 5, 6, 14, 14, 3, 3, 14, 14, 10, 83, 7, 14, 0, 103, 10, 8, 1, 103, 16, 9, 1, 4, 16, 16, 10, 5, 15, 16, 5, 6, 15, 15, 3, 3, 15, 15, 10, 107, 7, 1, 15, 103, 8, 8, 2, 103, 16, 9, 2, 4, 16, 16, 8, 5, 14, 16, 5, 6, 14, 14, 3, 3, 14, 14, 8, 107, 7, 2, 14, 47, 14, 4, 1, 4, 141, 0, 0, 25, 4, 4, 1, 119, 0, 226, 255, 119, 0, 1, 0, 2, 14, 0, 0, 33, 87, 1, 0, 78, 14, 14, 0, 32, 14, 14, 0, 2, 15, 0, 0, 88, 79, 1, 0, 82, 15, 15, 0, 32, 15, 15, 8, 20, 14, 14, 15, 121, 14, 24, 0, 1, 15, 1, 0, 135, 14, 16, 0, 15, 0, 0, 0, 2, 14, 0, 0, 88, 79, 1, 0, 82, 10, 14, 0, 1, 15, 0, 4, 135, 14, 1, 0, 13, 11, 15, 0, 32, 14, 10, 8, 121, 14, 11, 0, 2, 15, 0, 0, 236, 85, 3, 0, 82, 15, 15, 0, 1, 16, 2, 0, 1, 17, 0, 0, 1, 18, 0, 1, 135, 14, 138, 0, 15, 16, 11, 17, 18, 0, 0, 0, 119, 0, 7, 0, 1, 6, 17, 0, 119, 0, 5, 0, 1, 18, 0, 4, 135, 14, 1, 0, 13, 11, 18, 0, 1, 6, 17, 0, 32, 14, 6, 17, 121, 14, 17, 0, 1, 6, 0, 0, 2, 18, 0, 0, 248, 85, 3, 0, 82, 18, 18, 0, 1, 17, 1, 0, 1, 16, 0, 0, 1, 15, 0, 1, 135, 14, 138, 0, 18, 17, 11, 16, 15, 0, 0, 0, 135, 14, 100, 0, 2, 15, 0, 0, 236, 85, 3, 0, 82, 15, 15, 0, 135, 14, 101, 0, 15, 0, 0, 0, 25, 5, 5, 1, 53, 14, 5, 3, 132, 140, 0, 0, 1, 15, 0, 4, 135, 14, 1, 0, 13, 2, 15, 0, 2, 14, 0, 0, 88, 79, 1, 0, 82, 14, 14, 0, 32, 14, 14, 8, 121, 14, 16, 0, 2, 15, 0, 0, 236, 85, 3, 0, 82, 15, 15, 0, 1, 16, 2, 0, 1, 17, 0, 0, 1, 18, 0, 1, 135, 14, 138, 0, 15, 16, 2, 17, 18, 0, 0, 0, 2, 14, 0, 0, 5, 90, 3, 0, 1, 18, 0, 0, 83, 14, 18, 0, 139, 0, 0, 0, 119, 0, 21, 0, 2, 14, 0, 0, 248, 85, 3, 0, 82, 14, 14, 0, 1, 17, 1, 0, 1, 16, 0, 0, 1, 15, 0, 1, 135, 18, 138, 0, 14, 17, 2, 16, 15, 0, 0, 0, 135, 18, 100, 0, 2, 15, 0, 0, 236, 85, 3, 0, 82, 15, 15, 0, 135, 18, 101, 0, 15, 0, 0, 0, 2, 18, 0, 0, 5, 90, 3, 0, 1, 15, 0, 0, 83, 18, 15, 0, 139, 0, 0, 0, 139, 0, 0, 0, 140, 1, 15, 0, 0, 0, 0, 0, 2, 5, 0, 0, 180, 213, 0, 0, 2, 6, 0, 0, 96, 213, 0, 0, 2, 7, 0, 0, 97, 213, 0, 0, 136, 8, 0, 0, 0, 4, 8, 0, 136, 8, 0, 0, 25, 8, 8, 32, 137, 8, 0, 0, 130, 8, 0, 0, 136, 9, 0, 0, 49, 8, 8, 9, 240, 142, 0, 0, 1, 9, 32, 0, 135, 8, 0, 0, 9, 0, 0, 0, 0, 0, 4, 0, 135, 8, 139, 0, 1, 9, 0, 0, 1, 10, 255, 0, 1, 11, 208, 13, 1, 12, 10, 0, 135, 8, 12, 0, 9, 10, 11, 12, 25, 1, 0, 1, 25, 2, 0, 2, 25, 3, 0, 3, 135, 8, 26, 0, 0, 0, 0, 0, 78, 8, 1, 0, 78, 12, 0, 0, 20, 8, 8, 12, 78, 12, 2, 0, 20, 8, 8, 12, 78, 12, 3, 0, 20, 8, 8, 12, 2, 12, 0, 0, 240, 73, 2, 0, 78, 12, 12, 0, 20, 8, 8, 12, 2, 12, 0, 0, 221, 73, 2, 0, 78, 12, 12, 0, 20, 8, 8, 12, 2, 12, 0, 0, 235, 73, 2, 0, 78, 12, 12, 0, 20, 8, 8, 12, 41, 8, 8, 24, 42, 8, 8, 24, 120, 8, 2, 0, 119, 0, 3, 0, 135, 8, 140, 0, 119, 0, 230, 255, 2, 8, 0, 0, 75, 134, 1, 0, 2, 12, 0, 0, 192, 59, 1, 0, 1, 11, 0, 0, 135, 0, 120, 0, 8, 12, 11, 0, 1, 8, 0, 0, 1, 11, 12, 0, 138, 0, 8, 11, 228, 143, 0, 0, 8, 144, 0, 0, 64, 144, 0, 0, 224, 143, 0, 0, 224, 143, 0, 0, 120, 144, 0, 0, 224, 143, 0, 0, 156, 144, 0, 0, 224, 143, 0, 0, 224, 143, 0, 0, 208, 144, 0, 0, 0, 145, 0, 0, 119, 0, 115, 0, 2, 11, 0, 0, 128, 85, 3, 0, 82, 11, 11, 0, 121, 11, 111, 0, 1, 12, 0, 0, 135, 11, 141, 0, 12, 0, 0, 0, 135, 11, 139, 0, 119, 0, 106, 0, 2, 11, 0, 0, 128, 85, 3, 0, 82, 11, 11, 0, 33, 11, 11, 1, 121, 11, 101, 0, 1, 12, 1, 0, 135, 11, 141, 0, 12, 0, 0, 0, 135, 11, 142, 0, 135, 11, 139, 0, 1, 12, 32, 0, 135, 11, 14, 0, 12, 0, 0, 0, 119, 0, 92, 0, 2, 11, 0, 0, 128, 85, 3, 0, 82, 11, 11, 0, 33, 11, 11, 2, 121, 11, 87, 0, 1, 12, 2, 0, 135, 11, 141, 0, 12, 0, 0, 0, 135, 11, 142, 0, 135, 11, 139, 0, 1, 12, 32, 0, 135, 11, 14, 0, 12, 0, 0, 0, 119, 0, 78, 0, 2, 11, 0, 0, 136, 85, 3, 0, 82, 11, 11, 0, 121, 11, 74, 0, 1, 12, 0, 0, 135, 11, 143, 0, 12, 0, 0, 0, 135, 11, 139, 0, 119, 0, 69, 0, 2, 8, 0, 0, 136, 85, 3, 0, 82, 8, 8, 0, 33, 8, 8, 2, 121, 8, 64, 0, 1, 11, 2, 0, 135, 8, 143, 0, 11, 0, 0, 0, 135, 8, 139, 0, 1, 11, 32, 0, 135, 8, 14, 0, 11, 0, 0, 0, 119, 0, 56, 0, 2, 8, 0, 0, 132, 85, 3, 0, 82, 8, 8, 0, 121, 8, 52, 0, 1, 11, 0, 0, 135, 8, 144, 0, 11, 0, 0, 0, 135, 8, 139, 0, 1, 11, 32, 0, 135, 8, 14, 0, 11, 0, 0, 0, 119, 0, 44, 0, 2, 11, 0, 0, 132, 85, 3, 0, 82, 11, 11, 0, 33, 11, 11, 1, 121, 11, 39, 0, 1, 12, 1, 0, 135, 11, 144, 0, 12, 0, 0, 0, 135, 11, 139, 0, 1, 12, 32, 0, 135, 11, 14, 0, 12, 0, 0, 0, 2, 11, 0, 0, 208, 86, 3, 0, 1, 12, 14, 0, 85, 11, 12, 0, 135, 12, 34, 0, 2, 12, 0, 0, 64, 43, 2, 0, 2, 11, 0, 0, 208, 86, 3, 0, 82, 11, 11, 0, 1, 8, 5, 1, 3, 11, 11, 8, 41, 11, 11, 2, 94, 1, 12, 11, 121, 1, 13, 0, 135, 12, 65, 0, 1, 0, 0, 0, 2, 12, 0, 0, 64, 43, 2, 0, 2, 11, 0, 0, 208, 86, 3, 0, 82, 11, 11, 0, 1, 8, 5, 1, 3, 11, 11, 8, 41, 11, 11, 2, 1, 8, 0, 0, 97, 12, 11, 8, 1, 11, 19, 1, 135, 8, 66, 0, 11, 0, 0, 0, 119, 0, 1, 0, 1, 8, 255, 255, 54, 8, 8, 0, 136, 143, 0, 0, 1, 11, 0, 0, 1, 12, 255, 0, 1, 10, 43, 0, 1, 9, 0, 0, 1, 13, 0, 0, 1, 14, 10, 0, 135, 8, 22, 0, 11, 12, 10, 9, 13, 14, 0, 0, 137, 4, 0, 0, 1, 8, 0, 0, 139, 8, 0, 0, 140, 1, 18, 0, 0, 0, 0, 0, 2, 9, 0, 0, 207, 213, 0, 0, 2, 10, 0, 0, 213, 213, 0, 0, 2, 11, 0, 0, 88, 213, 0, 0, 136, 12, 0, 0, 0, 8, 12, 0, 136, 12, 0, 0, 25, 12, 12, 32, 137, 12, 0, 0, 130, 12, 0, 0, 136, 13, 0, 0, 49, 12, 12, 13, 56, 146, 0, 0, 1, 13, 32, 0, 135, 12, 0, 0, 13, 0, 0, 0, 0, 7, 8, 0, 2, 12, 0, 0, 60, 87, 3, 0, 85, 12, 0, 0, 2, 12, 0, 0, 224, 85, 3, 0, 82, 4, 12, 0, 2, 12, 0, 0, 224, 85, 3, 0, 1, 13, 0, 0, 85, 12, 13, 0, 1, 12, 1, 0, 135, 13, 61, 0, 12, 0, 0, 0, 1, 12, 0, 0, 1, 14, 0, 0, 1, 15, 64, 1, 1, 16, 200, 0, 1, 17, 17, 0, 135, 13, 3, 0, 12, 14, 15, 16, 17, 0, 0, 0, 135, 13, 145, 0, 25, 5, 7, 1, 25, 6, 7, 16, 1, 1, 1, 0, 1, 0, 1, 0, 41, 13, 1, 24, 42, 13, 13, 24, 121, 13, 17, 0, 1, 17, 1, 0, 135, 13, 146, 0, 17, 0, 0, 0, 135, 13, 11, 0, 41, 13, 0, 24, 42, 13, 13, 24, 120, 13, 3, 0, 1, 0, 0, 0, 119, 0, 8, 0, 1, 17, 0, 0, 1, 16, 255, 0, 1, 15, 208, 13, 1, 14, 10, 0, 135, 13, 12, 0, 17, 16, 15, 14, 1, 0, 0, 0, 1, 14, 5, 0, 135, 13, 16, 0, 14, 0, 0, 0, 2, 13, 0, 0, 96, 85, 3, 0, 1, 14, 0, 0, 85, 13, 14, 0, 135, 14, 26, 0, 7, 0, 0, 0, 79, 14, 6, 0, 103, 13, 6, 1, 41, 13, 13, 8, 20, 14, 14, 13, 103, 13, 6, 2, 41, 13, 13, 16, 20, 14, 14, 13, 103, 13, 6, 3, 41, 13, 13, 24, 20, 14, 14, 13, 0, 1, 14, 0, 1, 14, 0, 0, 1, 15, 5, 0, 138, 1, 14, 15, 208, 164, 0, 0, 96, 147, 0, 0, 96, 147, 0, 0, 96, 147, 0, 0, 216, 164, 0, 0, 2, 14, 0, 0, 96, 85, 3, 0, 82, 14, 14, 0, 1, 15, 13, 0, 1, 13, 70, 4, 138, 14, 15, 13, 172, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0], eb + 30720);
    HEAPU8.set([144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 180, 164, 0, 0, 144, 164, 0, 0, 144, 164, 0, 0, 184, 164, 0, 0, 188, 164, 0, 0, 192, 164, 0, 0, 196, 164, 0, 0, 200, 164, 0, 0, 78, 13, 7, 0, 32, 13, 13, 0, 1, 15, 4, 0, 125, 1, 13, 1, 15, 0, 0, 0, 1, 2, 7, 0, 119, 0, 13, 0, 1, 2, 18, 0, 119, 0, 11, 0, 119, 0, 5, 0, 119, 0, 253, 255, 119, 0, 252, 255, 119, 0, 2, 0, 119, 0, 250, 255, 1, 2, 8, 0, 119, 0, 4, 0, 1, 2, 7, 0, 119, 0, 2, 0, 119, 0, 254, 255, 32, 14, 2, 7, 121, 14, 20, 0, 1, 2, 0, 0, 1, 14, 0, 0, 1, 15, 7, 0, 138, 1, 14, 15, 24, 165, 0, 0, 16, 165, 0, 0, 32, 165, 0, 0, 16, 165, 0, 0, 36, 165, 0, 0, 16, 165, 0, 0, 44, 165, 0, 0, 1, 1, 0, 0, 119, 0, 7, 0, 1, 2, 8, 0, 119, 0, 5, 0, 119, 0, 1, 0, 1, 2, 18, 0, 119, 0, 2, 0, 119, 0, 251, 255, 32, 14, 2, 8, 121, 14, 53, 0, 2, 14, 0, 0, 84, 87, 3, 0, 82, 1, 14, 0, 1, 14, 1, 0, 47, 14, 14, 1, 244, 165, 0, 0, 2, 14, 0, 0, 84, 87, 3, 0, 26, 15, 1, 1, 85, 14, 15, 0, 2, 15, 0, 0, 60, 87, 3, 0, 82, 3, 15, 0, 26, 2, 3, 1, 2, 15, 0, 0, 60, 87, 3, 0, 85, 15, 2, 0, 78, 15, 2, 0, 32, 15, 15, 94, 121, 15, 6, 0, 78, 14, 3, 0, 135, 15, 147, 0, 14, 0, 0, 0, 32, 15, 15, 80, 120, 15, 3, 0, 0, 3, 2, 0, 119, 0, 243, 255, 2, 15, 0, 0, 84, 87, 3, 0, 26, 14, 1, 2, 85, 15, 14, 0, 26, 1, 2, 1, 2, 14, 0, 0, 60, 87, 3, 0, 85, 14, 1, 0, 78, 14, 1, 0, 32, 14, 14, 94, 121, 14, 8, 0, 78, 15, 2, 0, 135, 14, 147, 0, 15, 0, 0, 0, 32, 14, 14, 80, 121, 14, 3, 0, 1, 1, 1, 0, 119, 0, 4, 0, 0, 2, 1, 0, 119, 0, 241, 255, 1, 1, 0, 0, 1, 15, 20, 0, 135, 14, 148, 0, 15, 0, 0, 0, 119, 0, 15, 0, 32, 14, 2, 18, 121, 14, 13, 0, 2, 14, 0, 0, 84, 87, 3, 0, 82, 14, 14, 0, 2, 15, 0, 0, 88, 87, 3, 0, 82, 15, 15, 0, 15, 14, 14, 15, 38, 14, 14, 1, 0, 1, 14, 0, 1, 15, 20, 0, 135, 14, 148, 0, 15, 0, 0, 0, 2, 14, 0, 0, 96, 85, 3, 0, 82, 14, 14, 0, 33, 14, 14, 27, 78, 15, 5, 0, 32, 15, 15, 0, 19, 14, 14, 15, 120, 14, 18, 251, 135, 14, 6, 0, 2, 14, 0, 0, 224, 85, 3, 0, 85, 14, 4, 0, 137, 8, 0, 0, 139, 0, 0, 0, 140, 0, 13, 0, 0, 0, 0, 0, 2, 4, 0, 0, 255, 0, 0, 0, 2, 5, 0, 0, 208, 13, 0, 0, 2, 6, 0, 0, 188, 2, 0, 0, 136, 7, 0, 0, 0, 0, 7, 0, 136, 7, 0, 0, 25, 7, 7, 16, 137, 7, 0, 0, 130, 7, 0, 0, 136, 8, 0, 0, 49, 7, 7, 8, 200, 166, 0, 0, 1, 8, 16, 0, 135, 7, 0, 0, 8, 0, 0, 0, 2, 7, 0, 0, 108, 79, 1, 0, 82, 7, 7, 0, 33, 7, 7, 255, 121, 7, 46, 0, 2, 7, 0, 0, 103, 90, 3, 0, 1, 8, 1, 0, 83, 7, 8, 0, 135, 8, 149, 0, 2, 7, 0, 0, 104, 79, 1, 0, 82, 7, 7, 0, 1, 9, 0, 0, 135, 8, 150, 0, 7, 9, 0, 0, 2, 8, 0, 0, 108, 79, 1, 0, 82, 2, 8, 0, 28, 1, 2, 10, 2, 8, 0, 0, 255, 255, 0, 0, 19, 8, 1, 8, 0, 3, 8, 0, 2, 8, 0, 0, 72, 90, 3, 0, 83, 8, 3, 0, 2, 8, 0, 0, 73, 90, 3, 0, 42, 9, 3, 8, 83, 8, 9, 0, 27, 9, 1, 10, 4, 9, 2, 9, 2, 8, 0, 0, 255, 255, 0, 0, 19, 9, 9, 8, 0, 1, 9, 0, 2, 9, 0, 0, 30, 90, 3, 0, 83, 9, 1, 0, 2, 9, 0, 0, 31, 90, 3, 0, 42, 8, 1, 8, 83, 9, 8, 0, 1, 9, 0, 0, 135, 8, 151, 0, 9, 0, 0, 0, 1, 9, 0, 0, 135, 8, 73, 0, 9, 0, 0, 0, 1, 9, 7, 0, 135, 8, 5, 0, 9, 0, 0, 0, 2, 8, 0, 0, 103, 90, 3, 0, 78, 8, 8, 0, 120, 8, 2, 0, 135, 8, 152, 0, 1, 0, 0, 0, 2, 8, 0, 0, 103, 90, 3, 0, 78, 8, 8, 0, 120, 8, 97, 0, 1, 9, 99, 0, 135, 8, 153, 0, 9, 0, 0, 0, 135, 8, 11, 0, 1, 9, 0, 0, 1, 7, 30, 0, 135, 8, 12, 0, 9, 4, 5, 7, 1, 7, 26, 4, 135, 8, 94, 0, 7, 0, 0, 0, 41, 8, 8, 24, 42, 8, 8, 24, 120, 8, 83, 0, 1, 7, 0, 0, 1, 9, 0, 0, 1, 10, 0, 0, 1, 11, 0, 0, 1, 12, 30, 0, 135, 8, 22, 0, 7, 4, 9, 10, 11, 12, 0, 0, 1, 12, 101, 0, 135, 8, 153, 0, 12, 0, 0, 0, 135, 8, 11, 0, 1, 12, 0, 0, 1, 11, 30, 0, 135, 8, 12, 0, 12, 4, 5, 11, 135, 8, 94, 0, 6, 0, 0, 0, 41, 8, 8, 24, 42, 8, 8, 24, 120, 8, 62, 0, 1, 11, 0, 0, 1, 12, 0, 0, 1, 10, 0, 0, 1, 9, 0, 0, 1, 7, 30, 0, 135, 8, 22, 0, 11, 4, 12, 10, 9, 7, 0, 0, 135, 8, 154, 0, 135, 8, 11, 0, 1, 7, 0, 0, 1, 9, 30, 0, 135, 8, 12, 0, 7, 4, 5, 9, 135, 8, 94, 0, 6, 0, 0, 0, 41, 8, 8, 24, 42, 8, 8, 24, 120, 8, 43, 0, 25, 1, 0, 1, 30, 9, 0, 4, 135, 8, 155, 0, 9, 0, 0, 0, 2, 8, 0, 0, 224, 86, 3, 0, 82, 8, 8, 0, 32, 8, 8, 7, 121, 8, 3, 0, 0, 0, 1, 0, 119, 0, 32, 0, 1, 9, 0, 0, 1, 7, 0, 0, 1, 10, 0, 0, 1, 12, 0, 0, 1, 11, 30, 0, 135, 8, 22, 0, 9, 4, 7, 10, 12, 11, 0, 0, 2, 8, 0, 0, 84, 79, 1, 0, 82, 8, 8, 0, 31, 8, 8, 200, 121, 8, 8, 0, 2, 11, 0, 0, 248, 85, 3, 0, 82, 11, 11, 0, 1, 12, 0, 0, 1, 10, 0, 0, 135, 8, 58, 0, 11, 12, 10, 0, 1, 10, 7, 0, 135, 8, 5, 0, 10, 0, 0, 0, 2, 8, 0, 0, 103, 90, 3, 0, 78, 8, 8, 0, 120, 8, 3, 0, 0, 0, 1, 0, 119, 0, 163, 255, 0, 0, 1, 0, 119, 0, 1, 0, 1, 10, 0, 0, 1, 12, 0, 0, 1, 11, 0, 0, 1, 7, 0, 0, 1, 9, 30, 0, 135, 8, 22, 0, 10, 4, 12, 11, 7, 9, 0, 0, 2, 8, 0, 0, 217, 73, 2, 0, 78, 8, 8, 0, 33, 8, 8, 0, 2, 9, 0, 0, 102, 90, 3, 0, 78, 9, 9, 0, 33, 9, 9, 0, 19, 8, 8, 9, 121, 8, 3, 0, 135, 8, 156, 0, 119, 0, 4, 0, 1, 9, 0, 0, 135, 8, 87, 0, 9, 0, 0, 0, 2, 8, 0, 0, 101, 90, 3, 0, 78, 8, 8, 0, 2, 9, 0, 0, 100, 90, 3, 0, 78, 9, 9, 0, 20, 8, 8, 9, 41, 8, 8, 24, 42, 8, 8, 24, 121, 8, 124, 255, 1, 9, 0, 0, 135, 8, 151, 0, 9, 0, 0, 0, 2, 8, 0, 0, 103, 90, 3, 0, 78, 8, 8, 0, 120, 8, 117, 255, 1, 9, 0, 0, 1, 7, 0, 0, 1, 11, 0, 0, 1, 12, 0, 0, 1, 10, 30, 0, 135, 8, 22, 0, 9, 4, 7, 11, 12, 10, 0, 0, 1, 10, 7, 0, 135, 8, 5, 0, 10, 0, 0, 0, 119, 0, 105, 255, 140, 1, 16, 0, 0, 0, 0, 0, 2, 6, 0, 0, 176, 31, 1, 0, 2, 7, 0, 0, 0, 160, 2, 0, 2, 8, 0, 0, 212, 131, 1, 0, 136, 9, 0, 0, 0, 5, 9, 0, 136, 9, 0, 0, 1, 10, 80, 1, 3, 9, 9, 10, 137, 9, 0, 0, 130, 9, 0, 0, 136, 10, 0, 0, 49, 9, 9, 10, 104, 170, 0, 0, 1, 10, 80, 1, 135, 9, 0, 0, 10, 0, 0, 0, 1, 9, 56, 1, 3, 4, 5, 9, 1, 9, 48, 1, 3, 1, 5, 9, 1, 9, 64, 1, 3, 2, 5, 9, 0, 3, 5, 0, 2, 10, 0, 0, 199, 131, 1, 0, 135, 9, 25, 0, 2, 10, 0, 0, 121, 0, 71, 0, 2, 9, 0, 0, 218, 131, 1, 0, 79, 9, 9, 0, 2, 10, 0, 0, 219, 131, 1, 0, 79, 10, 10, 0, 41, 10, 10, 8, 20, 9, 9, 10, 41, 9, 9, 16, 42, 9, 9, 16, 0, 0, 9, 0, 41, 9, 0, 2, 94, 9, 7, 9, 121, 9, 57, 0, 25, 10, 0, 48, 107, 2, 7, 10, 2, 10, 0, 0, 0, 159, 2, 0, 78, 10, 10, 0, 120, 10, 4, 0, 135, 10, 25, 0, 3, 2, 0, 0, 119, 0, 10, 0, 2, 10, 0, 0, 0, 159, 2, 0, 85, 1, 10, 0, 109, 1, 4, 2, 1, 9, 44, 1, 2, 11, 0, 0, 222, 131, 1, 0, 135, 10, 127, 0, 3, 9, 11, 1, 2, 10, 0, 0, 80, 132, 1, 0, 135, 4, 129, 0, 3, 10, 0, 0, 1, 11, 32, 0, 1, 9, 0, 0, 135, 10, 131, 0, 4, 11, 9, 0, 2, 10, 0, 0, 101, 90, 3, 0, 1, 9, 1, 0, 83, 10, 9, 0, 1, 10, 0, 0, 1, 11, 0, 0, 135, 9, 157, 0, 4, 10, 11, 0, 2, 9, 0, 0, 101, 90, 3, 0, 1, 11, 0, 0, 83, 9, 11, 0, 135, 11, 133, 0, 4, 0, 0, 0, 135, 11, 41, 0, 135, 11, 42, 0, 135, 11, 43, 0, 135, 11, 44, 0, 135, 11, 45, 0, 135, 11, 46, 0, 135, 11, 47, 0, 135, 11, 21, 0, 2, 9, 0, 0, 36, 87, 3, 0, 82, 9, 9, 0, 135, 11, 51, 0, 9, 0, 0, 0, 1, 4, 1, 0, 137, 5, 0, 0, 139, 4, 0, 0, 1, 9, 0, 0, 135, 11, 134, 0, 9, 0, 0, 0, 1, 11, 29, 0, 135, 0, 120, 0, 8, 6, 11, 0, 1, 11, 255, 255, 47, 11, 11, 0, 216, 172, 0, 0, 41, 11, 0, 2, 94, 11, 7, 11, 120, 11, 8, 0, 1, 11, 29, 0, 135, 0, 120, 0, 8, 6, 11, 0, 36, 11, 0, 255, 121, 11, 249, 255, 1, 0, 0, 0, 119, 0, 57, 0, 1, 9, 32, 0, 135, 11, 14, 0, 9, 0, 0, 0, 25, 9, 0, 48, 107, 2, 7, 9, 2, 9, 0, 0, 0, 159, 2, 0, 78, 9, 9, 0, 120, 9, 4, 0, 135, 9, 25, 0, 3, 2, 0, 0, 119, 0, 10, 0, 2, 9, 0, 0, 0, 159, 2, 0, 85, 4, 9, 0, 109, 4, 4, 2, 1, 11, 44, 1, 2, 10, 0, 0, 222, 131, 1, 0, 135, 9, 127, 0, 3, 11, 10, 4, 2, 9, 0, 0, 80, 132, 1, 0, 135, 0, 129, 0, 3, 9, 0, 0, 1, 10, 32, 0, 1, 11, 0, 0, 135, 9, 131, 0, 0, 10, 11, 0, 1, 11, 0, 0, 135, 9, 137, 0, 11, 0, 0, 0, 2, 9, 0, 0, 101, 90, 3, 0, 1, 11, 1, 0, 83, 9, 11, 0, 1, 9, 104, 0, 1, 10, 85, 0, 135, 11, 157, 0, 0, 9, 10, 0, 135, 11, 133, 0, 0, 0, 0, 0, 2, 11, 0, 0, 216, 86, 3, 0, 1, 10, 1, 0, 85, 11, 10, 0, 1, 11, 32, 0, 135, 10, 14, 0, 11, 0, 0, 0, 2, 10, 0, 0, 252, 30, 1, 0, 1, 11, 1, 0, 84, 10, 11, 0, 1, 0, 1, 0, 119, 0, 2, 0, 1, 0, 0, 0, 1, 10, 0, 0, 1, 9, 255, 0, 1, 12, 43, 0, 1, 13, 0, 0, 1, 14, 0, 0, 1, 15, 10, 0, 135, 11, 22, 0, 10, 9, 12, 13, 14, 15, 0, 0, 0, 4, 0, 0, 137, 5, 0, 0, 139, 4, 0, 0, 140, 1, 10, 0, 0, 0, 0, 0, 2, 2, 0, 0, 186, 213, 0, 0, 2, 3, 0, 0, 184, 213, 0, 0, 2, 4, 0, 0, 89, 90, 3, 0, 1, 1, 0, 0, 1, 5, 0, 0, 1, 6, 2, 0, 138, 0, 5, 6, 76, 173, 0, 0, 84, 173, 0, 0, 139, 0, 0, 0, 119, 0, 4, 0, 1, 1, 2, 0, 119, 0, 2, 0, 119, 0, 1, 0, 32, 5, 1, 2, 121, 5, 63, 0, 2, 5, 0, 0, 224, 86, 3, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 36, 86, 3, 0, 135, 5, 17, 0, 27, 5, 5, 7, 29, 5, 5, 100, 85, 6, 5, 0, 2, 5, 0, 0, 192, 89, 3, 0, 1, 6, 0, 0, 84, 5, 6, 0, 2, 6, 0, 0, 28, 86, 3, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 96, 44, 3, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 100, 44, 3, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 104, 44, 3, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 108, 44, 3, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 112, 44, 3, 0, 1, 6, 0, 0, 84, 5, 6, 0, 2, 6, 0, 0, 44, 87, 3, 0, 1, 5, 0, 0, 85, 6, 5, 0, 2, 5, 0, 0, 48, 87, 3, 0, 1, 6, 0, 0, 85, 5, 6, 0, 2, 6, 0, 0, 112, 90, 3, 0, 1, 5, 0, 0, 83, 6, 5, 0, 2, 5, 0, 0, 227, 89, 3, 0, 78, 5, 5, 0, 121, 5, 4, 0, 135, 5, 68, 0, 121, 5, 2, 0, 135, 5, 69, 0, 2, 5, 0, 0, 111, 90, 3, 0, 78, 5, 5, 0, 121, 5, 2, 0, 135, 5, 7, 0, 135, 5, 158, 0, 2, 5, 0, 0, 106, 90, 3, 0, 1, 6, 0, 0, 83, 5, 6, 0, 135, 6, 159, 0, 135, 6, 160, 0, 2, 6, 0, 0, 236, 86, 3, 0, 82, 0, 6, 0, 2, 6, 0, 0, 232, 86, 3, 0, 85, 6, 0, 0, 121, 0, 23, 0, 135, 6, 161, 0, 0, 0, 0, 0, 2, 6, 0, 0, 232, 86, 3, 0, 82, 6, 6, 0, 25, 1, 6, 65, 79, 6, 1, 0, 103, 5, 1, 1, 41, 5, 5, 8, 20, 6, 6, 5, 103, 5, 1, 2, 41, 5, 5, 16, 20, 6, 6, 5, 103, 5, 1, 3, 41, 5, 5, 24, 20, 6, 6, 5, 0, 0, 6, 0, 2, 6, 0, 0, 232, 86, 3, 0, 85, 6, 0, 0, 33, 6, 0, 0, 120, 6, 235, 255, 135, 6, 162, 0, 135, 6, 89, 0, 2, 6, 0, 0, 86, 90, 3, 0, 79, 6, 6, 0, 2, 5, 0, 0, 87, 90, 3, 0, 79, 5, 5, 0, 41, 5, 5, 8, 20, 6, 6, 5, 2, 5, 0, 0, 88, 90, 3, 0, 79, 5, 5, 0, 41, 5, 5, 16, 20, 6, 6, 5, 79, 5, 4, 0, 41, 5, 5, 24, 20, 6, 6, 5, 2, 5, 0, 0, 8, 87, 3, 0, 82, 5, 5, 0, 3, 1, 6, 5, 2, 5, 0, 0, 86, 90, 3, 0, 83, 5, 1, 0, 2, 5, 0, 0, 87, 90, 3, 0, 42, 6, 1, 8, 83, 5, 6, 0, 2, 6, 0, 0, 88, 90, 3, 0, 42, 5, 1, 16, 83, 6, 5, 0, 42, 5, 1, 24, 83, 4, 5, 0, 135, 5, 163, 0, 2, 5, 0, 0, 5, 90, 3, 0, 78, 5, 5, 0, 121, 5, 7, 0, 1, 6, 0, 0, 1, 7, 255, 0, 1, 8, 208, 13, 1, 9, 30, 0, 135, 5, 12, 0, 6, 7, 8, 9, 135, 5, 164, 0, 2, 5, 0, 0, 0, 87, 3, 0, 82, 0, 5, 0, 121, 0, 9, 0, 135, 5, 16, 0, 0, 0, 0, 0, 2, 5, 0, 0, 36, 86, 3, 0, 135, 9, 17, 0, 27, 9, 9, 7, 29, 9, 9, 100, 85, 5, 9, 0, 2, 9, 0, 0, 4, 87, 3, 0, 82, 0, 9, 0, 121, 0, 3, 0, 135, 9, 16, 0, 0, 0, 0, 0, 2, 9, 0, 0, 111, 90, 3, 0, 78, 9, 9, 0, 121, 9, 10, 0, 135, 9, 18, 0, 41, 9, 9, 24, 42, 9, 9, 24, 121, 9, 6, 0, 135, 9, 6, 0, 2, 9, 0, 0, 224, 86, 3, 0, 1, 5, 7, 0, 85, 9, 5, 0, 1, 9, 1, 0, 135, 5, 165, 0, 9, 0, 0, 0, 2, 5, 0, 0, 224, 86, 3, 0, 82, 0, 5, 0, 32, 5, 0, 0, 2, 9, 0, 0, 100, 90, 3, 0, 78, 9, 9, 0, 32, 9, 9, 0, 19, 5, 5, 9, 120, 5, 130, 255, 32, 5, 0, 2, 2, 9, 0, 0, 112, 90, 3, 0, 78, 9, 9, 0, 32, 9, 9, 0, 20, 5, 5, 9, 121, 5, 2, 0, 139, 0, 0, 0, 2, 5, 0, 0, 112, 90, 3, 0, 1, 9, 0, 0, 83, 5, 9, 0, 1, 5, 208, 13, 1, 8, 1, 0, 135, 9, 166, 0, 5, 8, 0, 0, 139, 0, 0, 0, 140, 1, 17, 0, 0, 0, 0, 0, 2, 10, 0, 0, 235, 73, 2, 0, 2, 11, 0, 0, 240, 73, 2, 0, 2, 12, 0, 0, 221, 73, 2, 0, 136, 13, 0, 0, 0, 9, 13, 0, 136, 13, 0, 0, 25, 13, 13, 48, 137, 13, 0, 0, 130, 13, 0, 0, 136, 14, 0, 0, 49, 13, 13, 14, 232, 176, 0, 0, 1, 14, 48, 0, 135, 13, 0, 0, 14, 0, 0, 0, 25, 8, 9, 20, 0, 7, 9, 0, 135, 13, 63, 0, 0, 0, 0, 0, 135, 13, 6, 0, 25, 0, 8, 1, 25, 1, 8, 2, 25, 2, 8, 3, 135, 13, 26, 0, 8, 0, 0, 0, 78, 13, 0, 0, 78, 14, 8, 0, 20, 13, 13, 14, 78, 14, 1, 0, 20, 13, 13, 14, 78, 14, 2, 0, 20, 13, 13, 14, 78, 14, 11, 0, 20, 13, 13, 14, 78, 14, 12, 0, 20, 13, 13, 14, 78, 14, 10, 0, 20, 13, 13, 14, 41, 13, 13, 24, 42, 13, 13, 24, 120, 13, 2, 0, 119, 0, 3, 0, 135, 13, 140, 0, 119, 0, 236, 255, 2, 13, 0, 0, 166, 89, 3, 0, 80, 2, 13, 0, 2, 13, 0, 0, 255, 255, 0, 0, 19, 13, 2, 13, 0, 3, 13, 0, 2, 13, 0, 0, 168, 89, 3, 0, 80, 4, 13, 0, 2, 13, 0, 0, 255, 255, 0, 0, 19, 13, 4, 13, 0, 5, 13, 0, 25, 6, 7, 1, 135, 13, 17, 0, 27, 13, 13, 7, 29, 0, 13, 100, 1, 1, 0, 0, 135, 13, 26, 0, 7, 0, 0, 0, 1, 13, 9, 0, 135, 14, 17, 0, 27, 14, 14, 7, 29, 14, 14, 100, 4, 14, 14, 0, 48, 13, 13, 14, 72, 178, 0, 0, 1, 13, 0, 0, 1, 16, 2, 0, 138, 1, 13, 16, 228, 177, 0, 0, 0, 178, 0, 0, 119, 0, 19, 0, 1, 14, 8, 0, 1, 15, 13, 0, 1, 16, 23, 0, 135, 13, 3, 0, 3, 5, 14, 15, 16, 0, 0, 0, 119, 0, 12, 0, 2, 13, 0, 0, 166, 89, 3, 0, 84, 13, 2, 0, 2, 13, 0, 0, 168, 89, 3, 0, 84, 13, 4, 0, 2, 16, 0, 0, 76, 132, 1, 0, 135, 13, 31, 0, 16, 0, 0, 0, 119, 0, 1, 0, 135, 13, 11, 0, 135, 13, 17, 0, 27, 13, 13, 7, 29, 0, 13, 100, 40, 13, 1, 1, 0, 1, 13, 0, 119, 0, 4, 0, 1, 16, 5, 0, 135, 13, 16, 0, 16, 0, 0, 0, 2, 13, 0, 0, 73, 74, 2, 0, 78, 13, 13, 0, 120, 13, 14, 0, 2, 13, 0, 0, 62, 74, 2, 0, 78, 13, 13, 0, 120, 13, 10, 0, 78, 13, 7, 0, 78, 16, 10, 0, 20, 13, 13, 16, 78, 16, 6, 0, 20, 13, 13, 16, 41, 13, 13, 24, 42, 13, 13, 24, 32, 13, 13, 0, 120, 13, 197, 255, 78, 13, 7, 0, 2, 16, 0, 0, 73, 74, 2, 0, 78, 16, 16, 0, 20, 13, 13, 16, 41, 13, 13, 24, 42, 13, 13, 24, 120, 13, 3, 0, 1, 0, 0, 0, 119, 0, 5, 0, 1, 16, 32, 0, 135, 13, 14, 0, 16, 0, 0, 0, 1, 0, 1, 0, 135, 13, 6, 0, 25, 1, 8, 1, 25, 2, 8, 2, 25, 3, 8, 3, 135, 13, 26, 0, 8, 0, 0, 0, 78, 13, 1, 0, 78, 16, 8, 0, 20, 13, 13, 16, 78, 16, 2, 0, 20, 13, 13, 16, 78, 16, 3, 0, 20, 13, 13, 16, 78, 16, 11, 0, 20, 13, 13, 16, 78, 16, 12, 0, 20, 13, 13, 16, 78, 16, 10, 0, 20, 13, 13, 16, 41, 13, 13, 24, 42, 13, 13, 24, 120, 13, 2, 0, 119, 0, 3, 0, 135, 13, 140, 0, 119, 0, 236, 255, 2, 16, 0, 0, 128, 79, 1, 0, 41, 15, 0, 2, 94, 16, 16, 15, 135, 13, 14, 0, 16, 0, 0, 0, 137, 9, 0, 0, 139, 0, 0, 0, 140, 1, 16, 0, 0, 0, 0, 0, 2, 6, 0, 0, 240, 73, 2, 0, 2, 7, 0, 0, 235, 73, 2, 0, 2, 8, 0, 0, 221, 73, 2, 0, 136, 9, 0, 0, 0, 5, 9, 0, 136, 9, 0, 0, 25, 9, 9, 32, 137, 9, 0, 0, 130, 9, 0, 0, 136, 10, 0, 0, 49, 9, 9, 10, 164, 179, 0, 0, 1, 10, 32, 0, 135, 9, 0, 0, 10, 0, 0, 0, 0, 4, 5, 0, 135, 9, 167, 0, 1, 10, 0, 0, 1, 11, 255, 0, 1, 12, 208, 13, 1, 13, 10, 0, 135, 9, 12, 0, 10, 11, 12, 13, 25, 0, 4, 1, 25, 1, 4, 2, 25, 2, 4, 3, 135, 9, 26, 0, 4, 0, 0, 0, 78, 9, 0, 0, 78, 13, 4, 0, 20, 9, 9, 13, 78, 13, 1, 0, 20, 9, 9, 13, 78, 13, 2, 0, 20, 9, 9, 13, 78, 13, 6, 0, 20, 9, 9, 13, 78, 13, 8, 0, 20, 9, 9, 13, 78, 13, 7, 0, 20, 9, 9, 13, 41, 9, 9, 24, 42, 9, 9, 24, 120, 9, 2, 0, 119, 0, 3, 0, 135, 9, 140, 0, 119, 0, 236, 255, 25, 0, 4, 1, 25, 1, 4, 2, 25, 2, 4, 3, 2, 9, 0, 0, 83, 132, 1, 0, 2, 13, 0, 0, 128, 33, 1, 0, 1, 12, 0, 0, 135, 3, 120, 0, 9, 13, 12, 0, 1, 12, 0, 0, 1, 10, 4, 0, 138, 3, 12, 10, 108, 180, 0, 0, 204, 180, 0, 0, 60, 181, 0, 0, 144, 181, 0, 0, 119, 0, 75, 0, 2, 12, 0, 0, 108, 90, 3, 0, 2, 13, 0, 0, 108, 90, 3, 0, 78, 13, 13, 0, 40, 13, 13, 1, 83, 12, 13, 0, 135, 13, 68, 0, 121, 13, 2, 0, 135, 13, 69, 0, 135, 13, 167, 0, 2, 13, 0, 0, 99, 132, 1, 0, 1, 12, 255, 255, 83, 13, 12, 0, 2, 12, 0, 0, 100, 132, 1, 0, 1, 13, 255, 255, 42, 13, 13, 8, 83, 12, 13, 0, 1, 12, 32, 0, 135, 13, 14, 0, 12, 0, 0, 0, 119, 0, 51, 0, 135, 12, 167, 0, 1, 13, 0, 0, 1, 9, 255, 0, 1, 11, 208, 13, 1, 10, 10, 0, 135, 12, 12, 0, 13, 9, 11, 10, 135, 12, 26, 0, 4, 0, 0, 0, 78, 12, 0, 0, 78, 10, 4, 0, 20, 12, 12, 10, 78, 10, 1, 0, 20, 12, 12, 10, 78, 10, 2, 0, 20, 12, 12, 10, 78, 10, 6, 0, 20, 12, 12, 10, 78, 10, 8, 0, 20, 12, 12, 10, 78, 10, 7, 0, 20, 12, 12, 10, 41, 12, 12, 24, 42, 12, 12, 24, 120, 12, 2, 0, 119, 0, 25, 0, 135, 12, 140, 0, 119, 0, 236, 255, 2, 13, 0, 0, 109, 90, 3, 0, 2, 12, 0, 0, 109, 90, 3, 0, 78, 12, 12, 0, 40, 12, 12, 1, 83, 13, 12, 0, 135, 12, 167, 0, 2, 12, 0, 0, 99, 132, 1, 0, 1, 13, 255, 255, 83, 12, 13, 0, 2, 13, 0, 0, 100, 132, 1, 0, 1, 12, 255, 255, 42, 12, 12, 8, 83, 13, 12, 0, 1, 13, 32, 0, 135, 12, 14, 0, 13, 0, 0, 0, 119, 0, 2, 0, 119, 0, 207, 255, 1, 12, 255, 255, 54, 12, 12, 3, 48, 180, 0, 0, 1, 10, 0, 0, 1, 11, 255, 0, 1, 9, 43, 0, 1, 13, 0, 0, 1, 14, 0, 0, 1, 15, 10, 0, 135, 12, 22, 0, 10, 11, 9, 13, 14, 15, 0, 0, 137, 5, 0, 0, 1, 12, 0, 0, 139, 12, 0, 0, 140, 1, 12, 0, 0, 0, 0, 0, 2, 3, 0, 0, 255, 0, 0, 0, 2, 4, 0, 0, 192, 61, 1, 0, 2, 5, 0, 0, 85, 134, 1, 0, 135, 6, 168, 0, 1, 6, 0, 0, 135, 0, 120, 0, 5, 4, 6, 0, 33, 6, 0, 255, 121, 6, 115, 0, 28, 1, 0, 2, 2, 6, 0, 0, 144, 63, 1, 0, 41, 7, 1, 2, 94, 6, 6, 7, 120, 6, 17, 0, 1, 7, 6, 0, 135, 6, 14, 0, 7, 0, 0, 0, 2, 7, 0, 0, 95, 134, 1, 0, 135, 6, 63, 0, 7, 0, 0, 0, 135, 6, 6, 0, 135, 6, 83, 0, 135, 6, 168, 0, 1, 6, 0, 0, 135, 0, 120, 0, 5, 4, 6, 0, 32, 6, 0, 255, 121, 6, 236, 255, 119, 0, 93, 0, 1, 7, 32, 0, 135, 6, 14, 0, 7, 0, 0, 0, 2, 6, 0, 0, 26, 90, 3, 0, 78, 6, 6, 0, 121, 6, 8, 0, 2, 7, 0, 0, 195, 134, 1, 0, 135, 6, 62, 0, 7, 0, 0, 0, 120, 6, 3, 0, 1, 2, 9, 0, 119, 0, 37, 0, 1, 7, 0, 0, 1, 8, 43, 0, 1, 9, 0, 0, 1, 10, 0, 0, 1, 11, 10, 0, 135, 6, 22, 0, 7, 3, 8, 9, 10, 11, 0, 0, 135, 6, 169, 0, 2, 6, 0, 0, 4, 135, 1, 0, 2, 11, 0, 0, 176, 63, 1, 0, 1, 10, 28, 0, 135, 0, 120, 0, 6, 11, 10, 0, 1, 10, 0, 0, 49, 10, 10, 0, 236, 182, 0, 0, 1, 2, 12, 0, 119, 0, 16, 0, 1, 11, 0, 0, 1, 6, 43, 0, 1, 9, 0, 0, 1, 8, 0, 0, 1, 7, 10, 0, 135, 10, 22, 0, 11, 3, 6, 9, 8, 7, 0, 0, 135, 10, 168, 0, 1, 10, 0, 0, 135, 0, 120, 0, 5, 4, 10, 0, 32, 10, 0, 255, 121, 10, 186, 255, 119, 0, 43, 0, 32, 10, 2, 9, 121, 10, 12, 0, 1, 7, 0, 0, 1, 8, 43, 0, 1, 9, 0, 0, 1, 6, 0, 0, 1, 11, 10, 0, 135, 10, 22, 0, 7, 3, 8, 9, 6, 11, 0, 0, 1, 10, 0, 0, 139, 10, 0, 0, 119, 0, 30, 0, 32, 10, 2, 12, 121, 10, 28, 0, 1, 11, 32, 0, 135, 10, 14, 0, 11, 0, 0, 0, 135, 10, 150, 0, 0, 1, 0, 0, 2, 10, 0, 0, 216, 86, 3, 0, 1, 11, 1, 0, 85, 10, 11, 0, 1, 10, 0, 0, 1, 6, 43, 0, 1, 9, 0, 0, 1, 8, 0, 0, 1, 7, 10, 0, 135, 11, 22, 0, 10, 3, 6, 9, 8, 7, 0, 0, 2, 11, 0, 0, 252, 30, 1, 0, 1, 7, 1, 0, 84, 11, 7, 0, 2, 7, 0, 0, 220, 86, 3, 0, 1, 11, 0, 0, 85, 7, 11, 0, 1, 11, 0, 0, 139, 11, 0, 0, 1, 7, 0, 0, 1, 8, 43, 0, 1, 9, 0, 0, 1, 6, 0, 0, 1, 10, 10, 0, 135, 11, 22, 0, 7, 3, 8, 9, 6, 10, 0, 0, 1, 11, 0, 0, 139, 11, 0, 0, 140, 1, 11, 0, 0, 0, 0, 0, 136, 5, 0, 0, 0, 4, 5, 0, 136, 5, 0, 0, 25, 5, 5, 32, 137, 5, 0, 0, 130, 5, 0, 0, 136, 6, 0, 0, 49, 5, 5, 6, 48, 184, 0, 0, 1, 6, 32, 0, 135, 5, 0, 0, 6, 0, 0, 0, 0, 3, 4, 0, 1, 6, 0, 0, 1, 7, 0, 0, 1, 8, 64, 1, 1, 9, 200, 0, 1, 10, 41, 0, 135, 5, 3, 0, 6, 7, 8, 9, 10, 0, 0, 0, 2, 5, 0, 0, 224, 85, 3, 0, 1, 10, 1, 0, 85, 5, 10, 0, 1, 5, 112, 0, 1, 9, 184, 0, 1, 8, 30, 0, 135, 10, 8, 0, 5, 9, 8, 0, 1, 8, 75, 0, 1, 9, 50, 0, 1, 5, 175, 0, 1, 7, 140, 0, 1, 6, 45, 0, 135, 10, 3, 0, 8, 9, 5, 7, 6, 0, 0, 0, 1, 6, 75, 0, 1, 7, 250, 0, 1, 5, 50, 0, 1, 9, 43, 0, 135, 10, 170, 0, 6, 7, 5, 9, 1, 9, 50, 0, 1, 5, 190, 0, 1, 7, 75, 0, 1, 6, 43, 0, 135, 10, 171, 0, 9, 5, 7, 6, 1, 6, 75, 0, 1, 7, 250, 0, 1, 5, 190, 0, 1, 9, 35, 0, 135, 10, 170, 0, 6, 7, 5, 9, 1, 9, 50, 0, 1, 5, 190, 0, 1, 7, 250, 0, 1, 6, 35, 0, 135, 10, 171, 0, 9, 5, 7, 6, 1, 6, 0, 0, 1, 7, 10, 0, 1, 5, 64, 1, 1, 9, 24, 0, 1, 8, 0, 0, 135, 10, 3, 0, 6, 7, 5, 9, 8, 0, 0, 0, 1, 8, 0, 0, 1, 9, 63, 1, 1, 5, 32, 0, 1, 7, 44, 0, 135, 10, 170, 0, 8, 9, 5, 7, 120, 0, 7, 0, 1, 7, 60, 0, 1, 5, 0, 0, 1, 9, 40, 0, 135, 10, 8, 0, 7, 5, 9, 0, 119, 0, 6, 0, 1, 9, 60, 0, 1, 5, 0, 0, 1, 7, 41, 0, 135, 10, 8, 0, 9, 5, 7, 0, 1, 7, 0, 0, 1, 5, 23, 0, 135, 10, 135, 0, 7, 5, 0, 0, 1, 5, 1, 0, 1, 7, 23, 0, 135, 10, 135, 0, 5, 7, 0, 0, 1, 7, 2, 0, 1, 5, 23, 0, 135, 10, 135, 0, 7, 5, 0, 0, 1, 5, 3, 0, 1, 7, 23, 0, 135, 10, 135, 0, 5, 7, 0, 0, 1, 7, 4, 0, 1, 5, 23, 0, 135, 10, 135, 0, 7, 5, 0, 0, 1, 5, 5, 0, 1, 7, 23, 0, 135, 10, 135, 0, 5, 7, 0, 0, 1, 7, 6, 0, 1, 5, 23, 0, 135, 10, 135, 0, 7, 5, 0, 0, 1, 5, 7, 0, 1, 7, 23, 0, 135, 10, 135, 0, 5, 7, 0, 0, 1, 7, 8, 0, 1, 5, 23, 0, 135, 10, 135, 0, 7, 5, 0, 0, 1, 5, 9, 0, 1, 7, 23, 0, 135, 10, 135, 0, 5, 7, 0, 0, 2, 7, 0, 0, 212, 131, 1, 0, 2, 5, 0, 0, 176, 31, 1, 0, 135, 10, 172, 0, 7, 5, 0, 0, 135, 10, 11, 0, 1, 5, 0, 0, 1, 7, 255, 0, 1, 9, 208, 13, 1, 8, 10, 0, 135, 10, 12, 0, 5, 7, 9, 8, 25, 0, 3, 1, 25, 1, 3, 2, 25, 2, 3, 3, 135, 10, 26, 0, 3, 0, 0, 0, 78, 10, 0, 0, 78, 8, 3, 0, 20, 10, 10, 8, 78, 8, 1, 0, 20, 10, 10, 8, 78, 8, 2, 0, 20, 10, 10, 8, 2, 8, 0, 0, 240, 73, 2, 0, 78, 8, 8, 0, 20, 10, 10, 8, 2, 8, 0, 0, 221, 73, 2, 0, 78, 8, 8, 0, 20, 10, 10, 8, 2, 8, 0, 0, 235, 73, 2, 0, 78, 8, 8, 0, 20, 10, 10, 8, 41, 10, 10, 24, 42, 10, 10, 24, 120, 10, 2, 0, 119, 0, 3, 0, 135, 10, 140, 0, 119, 0, 230, 255, 137, 4, 0, 0, 139, 0, 0, 0, 140, 1, 11, 0, 0, 0, 0, 0, 2, 5, 0, 0, 31, 116, 1, 0, 135, 4, 49, 0, 5, 0, 0, 0, 2, 4, 0, 0, 144, 19, 1, 0, 41, 5, 0, 2, 94, 1, 4, 5, 135, 4, 61, 0, 1, 0, 0, 0, 2, 4, 0, 0, 192, 47, 2, 0, 41, 5, 1, 2, 3, 1, 4, 5, 2, 5, 0, 0, 16, 87, 3, 0, 82, 4, 1, 0, 85, 5, 4, 0, 1, 5, 1, 0, 1, 6, 0, 0, 135, 4, 150, 0, 5, 6, 0, 0, 2, 4, 0, 0, 16, 87, 3, 0, 82, 2, 4, 0, 25, 0, 2, 1, 2, 4, 0, 0, 16, 87, 3, 0, 85, 4, 0, 0, 78, 3, 2, 0, 2, 4, 0, 0, 30, 90, 3, 0, 83, 4, 3, 0, 2, 4, 0, 0, 31, 90, 3, 0, 42, 6, 3, 8, 83, 4, 6, 0, 2, 6, 0, 0, 28, 90, 3, 0, 1, 4, 3, 0, 83, 6, 4, 0, 2, 4, 0, 0, 29, 90, 3, 0, 1, 6, 0, 0, 83, 4, 6, 0, 103, 6, 2, 2, 41, 6, 6, 8, 79, 4, 0, 0, 20, 6, 6, 4, 0, 0, 6, 0, 2, 6, 0, 0, 16, 87, 3, 0, 25, 4, 2, 4, 85, 6, 4, 0, 2, 4, 0, 0, 20, 87, 3, 0, 3, 6, 2, 0, 85, 4, 6, 0, 1, 4, 0, 0, 1, 5, 255, 0, 1, 7, 0, 0, 1, 8, 0, 0, 1, 9, 0, 0, 1, 10, 30, 0, 135, 6, 22, 0, 4, 5, 7, 8, 9, 10, 0, 0, 2, 6, 0, 0, 3, 90, 3, 0, 1, 10, 0, 0, 83, 6, 10, 0, 2, 10, 0, 0, 4, 90, 3, 0, 1, 6, 15, 0, 83, 10, 6, 0, 2, 6, 0, 0, 0, 86, 3, 0, 82, 0, 6, 0, 1, 10, 192, 254, 5, 6, 0, 10, 2, 10, 0, 0, 80, 79, 1, 0, 82, 10, 10, 0, 3, 6, 6, 10, 43, 6, 6, 1, 0, 2, 6, 0, 2, 10, 0, 0, 84, 79, 1, 0, 82, 10, 10, 0, 27, 9, 0, 216, 3, 10, 10, 9, 1, 9, 98, 0, 135, 6, 40, 0, 2, 10, 9, 0, 135, 6, 23, 0, 135, 6, 41, 0, 135, 6, 42, 0, 135, 6, 43, 0, 135, 6, 44, 0, 135, 6, 45, 0, 135, 6, 46, 0, 135, 6, 47, 0, 135, 6, 21, 0, 2, 6, 0, 0, 100, 90, 3, 0, 1, 9, 0, 0, 83, 6, 9, 0, 2, 9, 0, 0, 111, 90, 3, 0, 1, 6, 1, 0, 83, 9, 6, 0, 135, 6, 48, 0, 135, 6, 50, 0, 1, 9, 0, 0, 135, 6, 53, 0, 9, 0, 0, 0, 82, 0, 1, 0, 120, 0, 8, 0, 2, 6, 0, 0, 111, 90, 3, 0, 1, 9, 0, 0, 83, 6, 9, 0, 135, 9, 54, 0, 135, 9, 39, 0, 139, 0, 0, 0, 135, 9, 65, 0, 0, 0, 0, 0, 1, 9, 0, 0, 85, 1, 9, 0, 2, 9, 0, 0, 111, 90, 3, 0, 1, 6, 0, 0, 83, 9, 6, 0, 135, 6, 54, 0, 135, 6, 39, 0, 139, 0, 0, 0, 140, 0, 11, 0, 0, 0, 0, 0, 136, 5, 0, 0, 0, 4, 5, 0, 136, 5, 0, 0, 25, 5, 5, 32, 137, 5, 0, 0, 130, 5, 0, 0, 136, 6, 0, 0, 49, 5, 5, 6, 20, 189, 0, 0, 1, 6, 32, 0, 135, 5, 0, 0, 6, 0, 0, 0, 0, 0, 4, 0, 1, 6, 0, 0, 1, 7, 0, 0, 1, 8, 64, 1, 1, 9, 200, 0, 1, 10, 41, 0, 135, 5, 3, 0, 6, 7, 8, 9, 10, 0, 0, 0, 1, 10, 112, 0, 1, 9, 184, 0, 1, 8, 30, 0, 135, 5, 8, 0, 10, 9, 8, 0, 1, 8, 6, 0, 1, 9, 19, 0, 1, 10, 52, 1, 1, 7, 162, 0, 1, 6, 45, 0, 135, 5, 3, 0, 8, 9, 10, 7, 6, 0, 0, 0, 1, 6, 6, 0, 1, 7, 58, 1, 1, 10, 19, 0, 1, 9, 43, 0, 135, 5, 170, 0, 6, 7, 10, 9, 1, 9, 19, 0, 1, 10, 181, 0, 1, 7, 6, 0, 1, 6, 43, 0, 135, 5, 171, 0, 9, 10, 7, 6, 1, 6, 6, 0, 1, 7, 58, 1, 1, 10, 181, 0, 1, 9, 35, 0, 135, 5, 170, 0, 6, 7, 10, 9, 1, 9, 19, 0, 1, 10, 181, 0, 1, 7, 58, 1, 1, 6, 35, 0, 135, 5, 171, 0, 9, 10, 7, 6, 2, 5, 0, 0, 3, 90, 3, 0, 1, 6, 71, 0, 83, 5, 6, 0, 2, 6, 0, 0, 4, 90, 3, 0, 1, 5, 45, 0, 83, 6, 5, 0, 2, 5, 0, 0, 168, 89, 3, 0, 1, 6, 2, 0, 84, 5, 6, 0, 2, 6, 0, 0, 170, 89, 3, 0, 1, 5, 0, 0, 84, 6, 5, 0, 2, 6, 0, 0, 33, 135, 1, 0, 135, 5, 105, 0, 6, 0, 0, 0, 2, 5, 0, 0, 3, 90, 3, 0, 1, 6, 23, 0, 83, 5, 6, 0, 2, 6, 0, 0, 4, 90, 3, 0, 1, 5, 45, 0, 83, 6, 5, 0, 2, 6, 0, 0, 85, 134, 1, 0, 2, 7, 0, 0, 192, 61, 1, 0, 135, 5, 172, 0, 6, 7, 0, 0, 1, 7, 42, 0, 1, 6, 23, 0, 1, 10, 42, 0, 135, 5, 8, 0, 7, 6, 10, 0, 1, 10, 42, 0, 1, 6, 49, 0, 1, 7, 43, 0, 135, 5, 8, 0, 10, 6, 7, 0, 1, 7, 42, 0, 1, 6, 75, 0, 1, 10, 44, 0, 135, 5, 8, 0, 7, 6, 10, 0, 1, 10, 42, 0, 1, 6, 101, 0, 1, 7, 45, 0, 135, 5, 8, 0, 10, 6, 7, 0, 1, 7, 42, 0, 1, 6, 127, 0, 1, 10, 46, 0, 135, 5, 8, 0, 7, 6, 10, 0, 1, 10, 42, 0, 1, 6, 153, 0, 1, 7, 47, 0, 135, 5, 8, 0, 10, 6, 7, 0, 135, 5, 11, 0, 1, 7, 0, 0, 1, 6, 255, 0, 1, 10, 208, 13, 1, 9, 10, 0, 135, 5, 12, 0, 7, 6, 10, 9, 25, 1, 0, 1, 25, 2, 0, 2, 25, 3, 0, 3, 135, 5, 26, 0, 0, 0, 0, 0, 78, 5, 1, 0, 78, 9, 0, 0, 20, 5, 5, 9, 78, 9, 2, 0, 20, 5, 5, 9, 78, 9, 3, 0, 20, 5, 5, 9, 2, 9, 0, 0, 240, 73, 2, 0, 78, 9, 9, 0, 20, 5, 5, 9, 2, 9, 0, 0, 221, 73, 2, 0, 78, 9, 9, 0, 20, 5, 5, 9, 2, 9, 0, 0, 235, 73, 2, 0, 78, 9, 9, 0, 20, 5, 5, 9, 41, 5, 5, 24, 42, 5, 5, 24, 120, 5, 2, 0, 119, 0, 3, 0, 135, 5, 140, 0, 119, 0, 230, 255, 137, 4, 0, 0, 139, 0, 0, 0, 140, 0, 11, 0, 0, 0, 0, 0, 136, 5, 0, 0, 0, 4, 5, 0, 136, 5, 0, 0, 25, 5, 5, 32, 137, 5, 0, 0, 130, 5, 0, 0, 136, 6, 0, 0, 49, 5, 5, 6, 160, 191, 0, 0, 1, 6, 32, 0, 135, 5, 0, 0, 6, 0, 0, 0, 0, 0, 4, 0, 1, 6, 0, 0, 1, 7, 0, 0, 1, 8, 64, 1, 1, 9, 200, 0, 1, 10, 41, 0, 135, 5, 3, 0, 6, 7, 8, 9, 10, 0, 0, 0, 1, 10, 112, 0, 1, 9, 184, 0, 1, 8, 30, 0, 135, 5, 8, 0, 10, 9, 8, 0, 2, 5, 0, 0, 3, 90, 3, 0, 1, 8, 71, 0, 83, 5, 8, 0, 2, 8, 0, 0, 4, 90, 3, 0, 1, 5, 45, 0, 83, 8, 5, 0, 2, 5, 0, 0, 166, 89, 3, 0, 1, 8, 70, 0, 84, 5, 8, 0, 2, 8, 0, 0, 168, 89, 3, 0, 1, 5, 68, 0, 84, 8, 5, 0, 2, 8, 0, 0, 14, 135, 1, 0, 135, 5, 31, 0, 8, 0, 0, 0, 1, 8, 45, 0, 1, 9, 90, 0, 1, 10, 225, 0, 1, 7, 67, 0, 1, 6, 45, 0, 135, 5, 3, 0, 8, 9, 10, 7, 6, 0, 0, 0, 1, 6, 45, 0, 1, 7, 14, 1, 1, 10, 90, 0, 1, 9, 43, 0, 135, 5, 170, 0, 6, 7, 10, 9, 1, 9, 90, 0, 1, 10, 157, 0, 1, 7, 45, 0, 1, 6, 43, 0, 135, 5, 171, 0, 9, 10, 7, 6, 1, 6, 45, 0, 1, 7, 14, 1, 1, 10, 157, 0, 1, 9, 35, 0, 135, 5, 170, 0, 6, 7, 10, 9, 1, 9, 90, 0, 1, 10, 157, 0, 1, 7, 14, 1, 1, 6, 35, 0, 135, 5, 171, 0, 9, 10, 7, 6, 2, 6, 0, 0, 4, 135, 1, 0, 2, 7, 0, 0, 176, 63, 1, 0, 135, 5, 172, 0, 6, 7, 0, 0, 1, 7, 235, 0, 1, 6, 107, 0, 2, 10, 0, 0, 10, 135, 1, 0, 79, 10, 10, 0, 2, 9, 0, 0, 11, 135, 1, 0, 79, 9, 9, 0, 41, 9, 9, 8, 20, 10, 10, 9, 41, 10, 10, 16, 42, 10, 10, 16, 25, 10, 10, 31, 135, 5, 8, 0, 7, 6, 10, 0, 135, 5, 11, 0, 1, 10, 0, 0, 1, 6, 255, 0, 1, 7, 208, 13, 1, 9, 10, 0, 135, 5, 12, 0, 10, 6, 7, 9, 25, 1, 0, 1, 25, 2, 0, 2, 25, 3, 0, 3, 135, 5, 26, 0, 0, 0, 0, 0, 78, 5, 1, 0, 78, 9, 0, 0, 20, 5, 5, 9, 78, 9, 2, 0, 20, 5, 5, 9, 78, 9, 3, 0, 20, 5, 5, 9, 2, 9, 0, 0, 240, 73, 2, 0, 78, 9, 9, 0, 20, 5, 5, 9, 2, 9, 0, 0, 221, 73, 2, 0, 78, 9, 9, 0, 20, 5, 5, 9, 2, 9, 0, 0, 235, 73, 2, 0, 78, 9, 9, 0, 20, 5, 5, 9, 41, 5, 5, 24, 42, 5, 5, 24, 120, 5, 2, 0, 119, 0, 3, 0, 135, 5, 140, 0, 119, 0, 230, 255, 137, 4, 0, 0, 139, 0, 0, 0, 140, 0, 9, 0, 0, 0, 0, 0, 135, 2, 44, 0, 2, 2, 0, 0, 170, 89, 3, 0, 1, 3, 0, 0, 84, 2, 3, 0, 2, 3, 0, 0, 172, 89, 3, 0, 1, 2, 0, 0, 84, 3, 2, 0, 2, 2, 0, 0, 174, 89, 3, 0, 1, 3, 64, 1, 84, 2, 3, 0, 2, 3, 0, 0, 176, 89, 3, 0, 1, 2, 160, 0, 84, 3, 2, 0, 2, 3, 0, 0, 0, 86, 3, 0, 82, 3, 3, 0, 27, 2, 3, 217, 2, 3, 0, 0, 84, 79, 1, 0, 82, 3, 3, 0, 3, 0, 2, 3, 1, 2, 0, 0, 1, 4, 0, 0, 2, 5, 0, 0, 80, 79, 1, 0, 82, 5, 5, 0, 2, 6, 0, 0, 190, 115, 1, 0, 79, 6, 6, 0, 135, 3, 92, 0, 2, 4, 5, 0, 6, 0, 0, 0, 2, 3, 0, 0, 0, 86, 3, 0, 82, 0, 3, 0, 1, 6, 32, 255, 5, 3, 0, 6, 2, 6, 0, 0, 80, 79, 1, 0, 82, 6, 6, 0, 3, 3, 3, 6, 43, 3, 3, 4, 0, 1, 3, 0, 2, 6, 0, 0, 84, 79, 1, 0, 82, 6, 6, 0, 27, 5, 0, 168, 3, 6, 6, 5, 43, 6, 6, 1, 1, 5, 146, 0, 135, 3, 173, 0, 1, 6, 5, 0, 2, 3, 0, 0, 0, 86, 3, 0, 82, 0, 3, 0, 2, 3, 0, 0, 170, 89, 3, 0, 1, 6, 32, 255, 5, 5, 0, 6, 2, 6, 0, 0, 80, 79, 1, 0, 82, 6, 6, 0, 3, 5, 5, 6, 43, 5, 5, 1, 84, 3, 5, 0, 2, 5, 0, 0, 172, 89, 3, 0, 2, 3, 0, 0, 84, 79, 1, 0, 82, 3, 3, 0, 27, 6, 0, 168, 3, 3, 3, 6, 43, 3, 3, 1, 84, 5, 3, 0, 2, 3, 0, 0, 174, 89, 3, 0, 1, 5, 224, 0, 5, 5, 0, 5, 84, 3, 5, 0, 2, 5, 0, 0, 176, 89, 3, 0, 27, 3, 0, 48, 84, 5, 3, 0, 135, 3, 11, 0, 1, 5, 0, 0, 1, 6, 255, 0, 1, 4, 208, 13, 1, 2, 30, 0, 135, 3, 12, 0, 5, 6, 4, 2, 1, 2, 10, 0, 1, 4, 10, 0, 135, 3, 174, 0, 2, 4, 0, 0, 1, 4, 70, 0, 135, 3, 94, 0, 4, 0, 0, 0, 1, 4, 0, 0, 1, 2, 255, 0, 1, 6, 0, 0, 1, 5, 0, 0, 1, 7, 0, 0, 1, 8, 30, 0, 135, 3, 22, 0, 4, 2, 6, 5, 7, 8, 0, 0, 135, 3, 23, 0, 135, 3, 11, 0, 139, 0, 0, 0, 140, 1, 8, 0, 0, 0, 0, 0, 2, 1, 0, 0, 224, 85, 3, 0, 1, 2, 0, 0, 85, 1, 2, 0, 2, 2, 0, 0, 208, 86, 3, 0, 1, 1, 23, 0, 85, 2, 1, 0, 135, 1, 34, 0, 2, 1, 0, 0, 64, 43, 2, 0, 2, 2, 0, 0, 208, 86, 3, 0, 82, 2, 2, 0, 1, 3, 5, 1, 3, 2, 2, 3, 41, 2, 2, 2, 94, 0, 1, 2, 121, 0, 13, 0, 135, 1, 65, 0, 0, 0, 0, 0, 2, 1, 0, 0, 64, 43, 2, 0, 2, 2, 0, 0, 208, 86, 3, 0, 82, 2, 2, 0, 1, 3, 5, 1, 3, 2, 2, 3, 41, 2, 2, 2, 1, 3, 0, 0, 97, 1, 2, 3, 1, 2, 28, 1, 135, 3, 66, 0, 2, 0, 0, 0, 135, 3, 154, 0, 135, 3, 11, 0, 1, 2, 0, 0, 1, 1, 255, 0, 1, 4, 208, 13, 1, 5, 10, 0, 135, 3, 12, 0, 2, 1, 4, 5, 2, 3, 0, 0, 224, 85, 3, 0, 1, 5, 1, 0, 85, 3, 5, 0, 135, 5, 83, 0, 2, 5, 0, 0, 208, 86, 3, 0, 1, 3, 14, 0, 85, 5, 3, 0, 135, 3, 34, 0, 2, 3, 0, 0, 64, 43, 2, 0, 2, 5, 0, 0, 208, 86, 3, 0, 82, 5, 5, 0, 1, 4, 5, 1, 3, 5, 5, 4, 41, 5, 5, 2, 94, 0, 3, 5, 120, 0, 15, 0, 1, 5, 19, 1, 135, 3, 66, 0, 5, 0, 0, 0, 1, 5, 0, 0, 1, 4, 255, 0, 1, 1, 43, 0, 1, 2, 0, 0, 1, 6, 0, 0, 1, 7, 10, 0, 135, 3, 22, 0, 5, 4, 1, 2, 6, 7, 0, 0, 1, 3, 0, 0, 139, 3, 0, 0, 135, 3, 65, 0, 0, 0, 0, 0, 2, 3, 0, 0, 64, 43, 2, 0, 2, 7, 0, 0, 208, 86, 3, 0, 82, 7, 7, 0, 1, 6, 5, 1, 3, 7, 7, 6, 41, 7, 7, 2, 1, 6, 0, 0, 97, 3, 7, 6, 1, 7, 19, 1, 135, 6, 66, 0, 7, 0, 0, 0, 1, 7, 0, 0, 1, 3, 255, 0, 1, 2, 43, 0, 1, 1, 0, 0, 1, 4, 0, 0, 1, 5, 10, 0, 135, 6, 22, 0, 7, 3, 2, 1, 4, 5, 0, 0, 1, 6, 0, 0, 139, 6, 0, 0, 140, 1, 10, 0, 0, 0, 0, 0, 2, 5, 0, 0, 1, 3, 0, 0, 2, 6, 0, 0, 2, 4, 0, 0, 1, 3, 0, 0, 136, 7, 0, 0, 0, 4, 7, 0, 136, 7, 0, 0, 25, 7, 7, 48, 137, 7, 0, 0, 130, 7, 0, 0, 136, 8, 0, 0, 49, 7, 7, 8, 80, 197, 0, 0, 1, 8, 48, 0, 135, 7, 0, 0, 8, 0, 0, 0, 0, 1, 4, 0, 135, 7, 17, 0, 27, 7, 7, 7, 29, 2, 7, 100, 135, 7, 175, 0, 1, 0, 0, 0, 121, 7, 14, 1, 82, 7, 1, 0, 1, 8, 1, 3, 1, 9, 2, 1, 138, 7, 8, 9, 136, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0], eb + 40960);
    HEAPU8.set([132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 132, 201, 0, 0, 140, 201, 0, 0, 119, 0, 3, 0, 119, 0, 19, 0, 119, 0, 18, 0, 135, 7, 175, 0, 1, 0, 0, 0, 120, 7, 245, 254, 119, 0, 1, 0, 1, 8, 50, 0, 135, 7, 16, 0, 8, 0, 0, 0, 135, 7, 17, 0, 27, 7, 7, 7, 29, 7, 7, 100, 4, 7, 7, 2, 50, 7, 0, 7, 208, 201, 0, 0, 1, 0, 0, 0, 1, 3, 8, 0, 119, 0, 2, 0, 119, 0, 228, 254, 32, 7, 3, 8, 121, 7, 3, 0, 137, 4, 0, 0, 139, 0, 0, 0, 1, 3, 1, 0, 137, 4, 0, 0, 139, 3, 0, 0, 140, 0, 6, 0, 0, 0, 0, 0, 2, 4, 0, 0, 36, 86, 3, 0, 82, 3, 4, 0, 135, 4, 17, 0, 27, 4, 4, 7, 29, 4, 4, 100, 47, 4, 4, 3, 48, 202, 0, 0, 2, 4, 0, 0, 36, 86, 3, 0, 135, 5, 17, 0, 27, 5, 5, 7, 29, 5, 5, 100, 85, 4, 5, 0, 135, 3, 17, 0, 27, 5, 3, 7, 29, 0, 5, 100, 2, 5, 0, 0, 36, 86, 3, 0, 82, 1, 5, 0, 4, 2, 0, 1, 2, 5, 0, 0, 8, 87, 3, 0, 85, 5, 2, 0, 120, 2, 19, 0, 27, 4, 1, 100, 25, 4, 4, 100, 28, 4, 4, 7, 4, 4, 4, 3, 135, 5, 16, 0, 4, 0, 0, 0, 2, 5, 0, 0, 8, 87, 3, 0, 1, 4, 1, 0, 85, 5, 4, 0, 2, 4, 0, 0, 36, 86, 3, 0, 2, 5, 0, 0, 36, 86, 3, 0, 82, 5, 5, 0, 25, 5, 5, 1, 85, 4, 5, 0, 139, 0, 0, 0, 2, 5, 0, 0, 36, 86, 3, 0, 85, 5, 0, 0, 37, 5, 2, 10, 121, 5, 2, 0, 139, 0, 0, 0, 2, 5, 0, 0, 8, 87, 3, 0, 1, 4, 10, 0, 85, 5, 4, 0, 139, 0, 0, 0, 140, 1, 8, 0, 0, 0, 0, 0, 136, 6, 0, 0, 0, 4, 6, 0, 136, 6, 0, 0, 25, 6, 6, 32, 137, 6, 0, 0, 130, 6, 0, 0, 136, 7, 0, 0, 49, 6, 6, 7, 8, 203, 0, 0, 1, 7, 32, 0, 135, 6, 0, 0, 7, 0, 0, 0, 0, 1, 4, 0, 135, 6, 17, 0, 27, 6, 6, 7, 29, 2, 6, 100, 25, 3, 1, 16, 1, 7, 5, 0, 135, 6, 16, 0, 7, 0, 0, 0, 135, 6, 26, 0, 1, 0, 0, 0, 135, 6, 17, 0, 27, 6, 6, 7, 29, 6, 6, 100, 4, 6, 6, 2, 15, 5, 6, 0, 79, 6, 3, 0, 103, 7, 3, 1, 41, 7, 7, 8, 20, 6, 6, 7, 103, 7, 3, 2, 41, 7, 7, 16, 20, 6, 6, 7, 103, 7, 3, 3, 41, 7, 7, 24, 20, 6, 6, 7, 33, 6, 6, 8, 19, 6, 6, 5, 120, 6, 234, 255, 137, 4, 0, 0, 139, 0, 0, 0, 140, 1, 4, 0, 0, 0, 0, 0, 2, 1, 0, 0, 208, 86, 3, 0, 1, 2, 0, 0, 85, 1, 2, 0, 135, 2, 34, 0, 2, 2, 0, 0, 64, 43, 2, 0, 2, 1, 0, 0, 208, 86, 3, 0, 82, 1, 1, 0, 1, 3, 5, 1, 3, 1, 1, 3, 41, 1, 1, 2, 94, 0, 2, 1, 121, 0, 13, 0, 135, 2, 65, 0, 0, 0, 0, 0, 2, 2, 0, 0, 64, 43, 2, 0, 2, 1, 0, 0, 208, 86, 3, 0, 82, 1, 1, 0, 1, 3, 5, 1, 3, 1, 1, 3, 41, 1, 1, 2, 1, 3, 0, 0, 97, 2, 1, 3, 1, 1, 5, 1, 135, 3, 66, 0, 1, 0, 0, 0, 135, 3, 123, 0, 2, 3, 0, 0, 208, 86, 3, 0, 1, 1, 14, 0, 85, 3, 1, 0, 135, 1, 34, 0, 2, 1, 0, 0, 64, 43, 2, 0, 2, 3, 0, 0, 208, 86, 3, 0, 82, 3, 3, 0, 1, 2, 5, 1, 3, 3, 3, 2, 41, 3, 3, 2, 94, 0, 1, 3, 120, 0, 6, 0, 1, 3, 19, 1, 135, 1, 66, 0, 3, 0, 0, 0, 1, 1, 1, 0, 139, 1, 0, 0, 135, 1, 65, 0, 0, 0, 0, 0, 2, 1, 0, 0, 64, 43, 2, 0, 2, 3, 0, 0, 208, 86, 3, 0, 82, 3, 3, 0, 1, 2, 5, 1, 3, 3, 3, 2, 41, 3, 3, 2, 1, 2, 0, 0, 97, 1, 3, 2, 1, 3, 19, 1, 135, 2, 66, 0, 3, 0, 0, 0, 1, 2, 1, 0, 139, 2, 0, 0, 140, 1, 9, 0, 0, 0, 0, 0, 136, 2, 0, 0, 0, 0, 2, 0, 136, 2, 0, 0, 25, 2, 2, 16, 137, 2, 0, 0, 130, 2, 0, 0, 136, 3, 0, 0, 49, 2, 2, 3, 208, 204, 0, 0, 1, 3, 16, 0, 135, 2, 0, 0, 3, 0, 0, 0, 135, 1, 72, 0, 2, 3, 0, 0, 48, 27, 1, 0, 135, 4, 72, 0, 38, 4, 4, 1, 25, 4, 4, 7, 19, 4, 4, 1, 27, 4, 4, 80, 3, 3, 3, 4, 135, 2, 62, 0, 3, 0, 0, 0, 120, 2, 6, 0, 135, 2, 119, 0, 137, 0, 0, 0, 1, 2, 0, 0, 139, 2, 0, 0, 119, 0, 16, 0, 135, 2, 11, 0, 135, 2, 34, 0, 135, 2, 19, 0, 1, 3, 0, 0, 1, 4, 255, 0, 1, 5, 43, 0, 1, 6, 0, 0, 1, 7, 0, 0, 1, 8, 10, 0, 135, 2, 22, 0, 3, 4, 5, 6, 7, 8, 0, 0, 1, 8, 0, 0, 135, 2, 73, 0, 8, 0, 0, 0, 1, 2, 0, 0, 139, 2, 0, 0, 140, 0, 8, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 3, 255, 0, 1, 4, 0, 0, 1, 5, 0, 0, 1, 6, 0, 0, 1, 7, 30, 0, 135, 1, 22, 0, 2, 3, 4, 5, 6, 7, 0, 0, 1, 7, 0, 0, 1, 6, 0, 0, 1, 5, 64, 1, 1, 4, 200, 0, 1, 3, 130, 0, 135, 1, 3, 0, 7, 6, 5, 4, 3, 0, 0, 0, 1, 3, 100, 0, 135, 1, 61, 0, 3, 0, 0, 0, 1, 3, 216, 0, 1, 4, 110, 0, 1, 5, 100, 0, 135, 1, 8, 0, 3, 4, 5, 0, 135, 1, 11, 0, 2, 1, 0, 0, 80, 49, 2, 0, 82, 0, 1, 0, 121, 0, 7, 0, 135, 1, 65, 0, 0, 0, 0, 0, 2, 1, 0, 0, 80, 49, 2, 0, 1, 5, 0, 0, 85, 1, 5, 0, 1, 1, 0, 0, 1, 4, 255, 0, 1, 3, 208, 13, 1, 6, 30, 0, 135, 5, 12, 0, 1, 4, 3, 6, 1, 6, 234, 1, 135, 5, 94, 0, 6, 0, 0, 0, 1, 6, 0, 0, 1, 3, 255, 0, 1, 4, 0, 0, 1, 1, 0, 0, 1, 7, 0, 0, 1, 2, 30, 0, 135, 5, 22, 0, 6, 3, 4, 1, 7, 2, 0, 0, 139, 0, 0, 0, 140, 0, 9, 0, 0, 0, 0, 0, 1, 3, 150, 0, 135, 2, 61, 0, 3, 0, 0, 0, 2, 0, 0, 0, 24, 50, 2, 0, 82, 3, 0, 0, 135, 2, 176, 0, 3, 0, 0, 0, 82, 1, 0, 0, 121, 1, 5, 0, 135, 2, 65, 0, 1, 0, 0, 0, 1, 2, 0, 0, 85, 0, 2, 0, 1, 3, 0, 0, 1, 4, 255, 0, 1, 5, 0, 0, 1, 6, 0, 0, 1, 7, 0, 0, 1, 8, 30, 0, 135, 2, 22, 0, 3, 4, 5, 6, 7, 8, 0, 0, 135, 2, 177, 0, 139, 0, 0, 0, 140, 2, 4, 0, 0, 0, 0, 0, 2, 3, 0, 0, 105, 130, 1, 0, 135, 2, 49, 0, 3, 0, 0, 0, 135, 2, 178, 0, 0, 1, 0, 0, 135, 2, 179, 0, 2, 3, 0, 0, 118, 130, 1, 0, 135, 2, 49, 0, 3, 0, 0, 0, 135, 2, 180, 0, 2, 3, 0, 0, 127, 130, 1, 0, 135, 2, 49, 0, 3, 0, 0, 0, 135, 2, 181, 0, 1, 2, 0, 0, 139, 2, 0, 0, 140, 0, 1, 0, 0, 0, 0, 0, 139, 0, 0, 0], eb + 51200);
    var relocations = [];
    relocations = relocations.concat([72, 1592, 1788, 1940, 2052, 2396, 2548, 2572, 2816, 3148, 3300, 3324, 3560, 3892, 4044, 4068, 4304, 5052, 5332, 5960, 5964, 5968, 5972, 5976, 5980, 5984, 6044, 6084, 6176, 6260, 6300, 6408, 6448, 6648, 6908, 6912, 6916, 6920, 6924, 6928, 6932, 6936, 6940, 6944, 6948, 6952, 6956, 6960, 6964, 6968, 6972, 6976, 6980, 6984, 6988, 6992, 6996, 7e3, 7004, 7008, 7012, 7016, 7020, 7024, 7028, 7032, 7036, 7040, 7044, 7048, 7052, 7056, 7060, 7064, 7068, 7072, 7076, 7080, 7084, 7088, 7092, 7096, 7100, 7104, 7108, 7112, 7116, 7120, 7124, 7128, 7132, 7136, 7140, 7144, 7148, 7152, 7156, 7160, 7164, 7168, 7172, 7176, 7180, 7184, 7188, 7192, 7196, 7200, 7204, 7208, 7212, 7216, 7220, 7224, 7228, 7232, 7236, 7240, 7244, 7248, 7252, 7256, 7260, 7264, 7268, 7272, 7276, 7280, 7284, 7288, 7292, 7296, 7300, 7304, 7308, 7312, 7316, 7320, 7324, 7328, 7332, 7336, 7340, 7344, 7348, 7352, 7356, 7360, 7364, 7368, 7372, 7376, 7380, 7384, 7388, 7392, 7396, 7400, 7404, 7408, 7412, 7416, 7420, 7424, 7428, 7432, 7436, 7440, 7444, 7448, 7452, 7456, 7460, 7464, 7468, 7472, 7476, 7480, 7484, 7488, 7492, 7496, 7500, 7504, 7508, 7512, 7516, 7520, 7524, 7528, 7532, 7536, 7540, 7544, 7548, 7552, 7556, 7560, 7564, 7568, 7572, 7576, 7580, 7584, 7588, 7592, 7596, 7600, 7604, 7608, 7612, 7616, 7620, 7624, 7628, 7632, 7636, 7640, 7644, 7648, 7652, 7656, 7660, 7664, 7668, 7672, 7676, 7680, 7684, 7688, 7692, 7696, 7700, 7704, 7708, 7712, 7716, 7720, 7724, 7728, 7732, 7736, 7740, 7744, 7748, 7752, 7756, 7760, 7764, 7768, 7772, 7776, 7780, 7784, 7788, 7792, 7796, 7800, 7804, 7808, 7812, 7816, 7820, 7824, 7828, 7832, 7836, 7840, 7844, 7848, 7852, 7856, 7860, 7864, 7868, 7872, 7876, 7880, 7884, 7888, 7892, 7896, 7900, 7904, 7908, 7912, 7916, 7920, 7924, 7928, 7932, 7936, 7940, 7944, 7948, 7952, 7956, 7960, 7964, 7968, 7972, 7976, 7980, 7984, 7988, 7992, 7996, 8e3, 8004, 8008, 8012, 8016, 8020, 8024, 8028, 8032, 8036, 8040, 8044, 8048, 8052, 8056, 8060, 8064, 8068, 8072, 8076, 8080, 8084, 8088, 8092, 8096, 8100, 8104, 8108, 8112, 8116, 8120, 8124, 8128, 8132, 8136, 8140, 8144, 8148, 8152, 8156, 8160, 8164, 8168, 8172, 8176, 8180, 8184, 8188, 8192, 8196, 8200, 8204, 8208, 8212, 8216, 8220, 8224, 8228, 8232, 8236, 8240, 8244, 8248, 8252, 8256, 8260, 8264, 8268, 8272, 8276, 8280, 8284, 8288, 8292, 8296, 8300, 8304, 8308, 8312, 8316, 8320, 8324, 8328, 8332, 8336, 8340, 8344, 8348, 8352, 8356, 8360, 8364, 8368, 8372, 8376, 8380, 8384, 8388, 8392, 8396, 8400, 8404, 8408, 8412, 8416, 8420, 8424, 8428, 8432, 8436, 8440, 8444, 8448, 8452, 8456, 8460, 8464, 8468, 8472, 8476, 8480, 8484, 8488, 8492, 8496, 8500, 8504, 8508, 8512, 8516, 8520, 8524, 8528, 8532, 8536, 8540, 8544, 8548, 8552, 8556, 8560, 8564, 8568, 8572, 8576, 8580, 8584, 8588, 8592, 8596, 8600, 8604, 8608, 8612, 8616, 8620, 8624, 8628, 8632, 8636, 8640, 8644, 8648, 8652, 8656, 8660, 8664, 8668, 8672, 8676, 8680, 8684, 8688, 8692, 8696, 8700, 8704, 8708, 8712, 8716, 8720, 8724, 8728, 8732, 8736, 8740, 8744, 8748, 8752, 8756, 8760, 8764, 8768, 8772, 8776, 8780, 8784, 8788, 8792, 8796, 8800, 8804, 8808, 8812, 8816, 8820, 8824, 8828, 8832, 8836, 8840, 8844, 8848, 8852, 8856, 8860, 8864, 8868, 8872, 8876, 8880, 8884, 8888, 8892, 8896, 8900, 8904, 8908, 8912, 8916, 8920, 8924, 8928, 8932, 8936, 8940, 8944, 8948, 8952, 8956, 8960, 8964, 8968, 8972, 8976, 8980, 8984, 8988, 8992, 8996, 9e3, 9004, 9008, 9012, 9016, 9020, 9024, 9028, 9032, 9036, 9040, 9044, 9048, 9052, 9056, 9060, 9064, 9068, 9072, 9076, 9080, 9084, 9088, 9092, 9096, 9100, 9104, 9108, 9112, 9116, 9120, 9124, 9128, 9132, 9136, 9140, 9144, 9148, 9152, 9156, 9160, 9164, 9168, 9172, 9176, 9180, 9184, 9188, 9192, 9196, 9200, 9204, 9208, 9212, 9216, 9220, 9224, 9228, 9232, 9236, 9240, 9244, 9248, 9252, 9256, 9260, 9264, 9268, 9272, 9276, 9280, 9284, 9288, 9292, 9296, 9300, 9304, 9308, 9312, 9316, 9320, 9324, 9328, 9332, 9336, 9340, 9344, 9348, 9352, 9356, 9360, 9364, 9368, 9372, 9376, 9380, 9384, 9388, 9392, 9396, 9400, 9404, 9408, 9412, 9416, 9420, 9424, 9428, 9432, 9436, 9440, 9444, 9448, 9452, 9456, 9460, 9464, 9468, 9472, 9476, 9480, 9484, 9488, 9492, 9496, 9500, 9504, 9508, 9512, 9516, 9520, 9524, 9528, 9532, 9536, 9540, 9544, 9548, 9552, 9556, 9560, 9564, 9568, 9572, 9576, 9580, 9584, 9588, 9592, 9596, 9600, 9604, 9608, 9612, 9616, 9620, 9624, 9628, 9632, 9636, 9640, 9644, 9648, 9652, 9656, 9660, 9664, 9668, 9672, 9676, 9680, 9684, 9688, 9692, 9696, 9700, 9704, 9708, 9712, 9716, 9720, 9724, 9728, 9732, 9736, 9740, 9744, 9748, 9752, 9756, 9760, 9764, 9768, 9772, 9776, 9780, 9784, 9788, 9792, 9796, 9800, 9804, 9808, 9812, 9816, 9820, 9824, 9828, 9832, 9836, 9840, 9844, 9848, 9852, 9856, 9860, 9864, 9868, 9872, 9876, 9880, 9884, 9888, 9892, 9896, 9900, 9904, 9908, 9912, 9916, 9920, 9924, 9928, 9932, 9936, 9940, 9944, 9948, 9952, 9956, 9960, 9964, 9968, 9972, 9976, 9980, 9984, 9988, 9992, 9996, 1e4, 10004, 10008, 10012, 10016, 10020, 10024, 10028, 10032, 10036, 10040, 10044, 10048, 10052, 10056, 10060, 10064, 10068, 10072, 10076, 10080, 10084, 10088, 10092, 10096, 10100, 10104, 10108, 10112, 10116, 10120, 10124, 10128, 10132, 10136, 10140, 10144, 10148, 10152, 10156, 10160, 10164, 10168, 10172, 10176, 10180, 10184, 10188, 10192, 10196, 10200, 10204, 10208, 10212, 10216, 10220, 10224, 10228, 10232, 10236, 10240, 10244, 10248, 10252, 10256, 10260, 10264, 10268, 10272, 10276, 10280, 10284, 10288, 10292, 10296, 10300, 10304, 10308, 10312, 10316, 10320, 10324, 10328, 10332, 10336, 10340, 10344, 10348, 10352, 10356, 10360, 10364, 10368, 10372, 10376, 10380, 10384, 10388, 10392, 10396, 10400, 10404, 10408, 10412, 10416, 10420, 10424, 10428, 10432, 10436, 10440, 10444, 10448, 10452, 10456, 10460, 10464, 10468, 10472, 10476, 10480, 10484, 10488, 10492, 10496, 10500, 10504, 10508, 10512, 10516, 10520, 10524, 10528, 10532, 10536, 10540, 10544, 10548, 10552, 10556, 10560, 10564, 10568, 10572, 10576, 10580, 10584, 10588, 10592, 10596, 10600, 10604, 10608, 10612, 10616, 10620, 10624, 10628, 10632, 10636, 10640, 10644, 10648, 10652, 10656, 10660, 10664, 10668, 10672, 10676, 10680, 10684, 10688, 10692, 10696, 10700, 10704, 10708, 10712, 10716, 10720, 10724, 10728, 10732, 10736, 10740, 10744, 10748, 10752, 10756, 10760, 10764, 10768, 10772, 10776, 10780, 10784, 10788, 10792, 10796, 10800, 10804, 10808, 10812, 10816, 10820, 10824, 10828, 10832, 10836, 10840, 10844, 10848, 10852, 10856, 10860, 10864, 10868, 10872, 10876, 10880, 10884, 10888, 10892, 10896, 10900, 10904, 10908, 10912, 10916, 10920, 10924, 10928, 10932, 10936, 10940, 10944, 10948, 10952, 10956, 10960, 10964, 10968, 10972, 10976, 10980, 10984, 10988, 10992, 10996, 11e3, 11004, 11008, 11012, 11016, 11020, 11024, 11028, 11032, 11036, 11040, 11044, 11048, 11052, 11056, 11060, 11064, 11068, 11072, 11076, 11080, 11084, 11088, 11092, 11096, 11100, 11104, 11108, 11112, 11116, 11120, 11124, 11128, 11132, 11136, 11140, 11144, 11148, 11152, 11156, 11160, 11164, 11168, 11172, 11176, 11180, 11184, 11188, 11192, 11196, 11200, 11204, 11208, 11212, 11216, 11220, 11224, 11228, 11232, 11236, 11240, 11244, 11248, 11252, 11256, 11260, 11264, 11268, 11272, 11276, 11280, 11284, 11288, 11292, 11296, 11300, 11304, 11308, 11312, 11316, 11320, 11324, 11328, 11332, 11336, 11340, 11344, 11484, 11528, 11584, 12264, 12832, 13288, 13436, 13440, 13564, 13644, 13708, 13720, 13980, 14048, 14060, 14368, 14372, 14376, 14380, 14384, 15156, 15280, 15652, 15892, 15896, 16208, 16288, 16340, 16344, 17144, 17148, 17152, 17156, 17160, 17164, 17168, 17172, 17176, 18352, 18712, 18828, 18864, 18868, 18872, 18876, 20228, 21588, 21716, 22504, 22756, 22816, 23664, 23684, 23732, 23748, 24228, 25616, 27108, 27172, 27236, 27296, 27384, 27508, 28368, 28948, 29100, 29396, 29580, 29584, 29732, 29736, 29740, 29744, 29748, 29752, 29756, 29776, 30140, 30488, 31400, 31468, 31484, 31532, 32476, 32480, 32484, 32488, 32492, 32496, 32580, 32584, 32588, 32592, 32596, 32600, 32604, 32608, 32612, 32616, 32620, 33172, 33316, 33496, 33864, 34648, 34760, 34792, 35028, 35128, 35380, 35452, 35716, 35724, 35960, 36088, 36332, 36576, 36784, 36788, 36792, 36796, 36800, 36804, 36808, 36812, 36816, 36820, 36824, 36828, 37300, 37416, 37708, 37712, 37716, 37720, 37724, 37752, 37756, 37760, 37764, 37768, 37772, 37776, 37780, 37784, 37788, 37792, 37796, 37800, 37804, 37808, 37812, 37816, 37820, 37824, 37828, 37832, 37836, 37840, 37844, 37848, 37852, 37856, 37860, 37864, 37868, 37872, 37876, 37880, 37884, 37888, 37892, 37896, 37900, 37904, 37908, 37912, 37916, 37920, 37924, 37928, 37932, 37936, 37940, 37944, 37948, 37952, 37956, 37960, 37964, 37968, 37972, 37976, 37980, 37984, 37988, 37992, 37996, 38e3, 38004, 38008, 38012, 38016, 38020, 38024, 38028, 38032, 38036, 38040, 38044, 38048, 38052, 38056, 38060, 38064, 38068, 38072, 38076, 38080, 38084, 38088, 38092, 38096, 38100, 38104, 38108, 38112, 38116, 38120, 38124, 38128, 38132, 38136, 38140, 38144, 38148, 38152, 38156, 38160, 38164, 38168, 38172, 38176, 38180, 38184, 38188, 38192, 38196, 38200, 38204, 38208, 38212, 38216, 38220, 38224, 38228, 38232, 38236, 38240, 38244, 38248, 38252, 38256, 38260, 38264, 38268, 38272, 38276, 38280, 38284, 38288, 38292, 38296, 38300, 38304, 38308, 38312, 38316, 38320, 38324, 38328, 38332, 38336, 38340, 38344, 38348, 38352, 38356, 38360, 38364, 38368, 38372, 38376, 38380, 38384, 38388, 38392, 38396, 38400, 38404, 38408, 38412, 38416, 38420, 38424, 38428, 38432, 38436, 38440, 38444, 38448, 38452, 38456, 38460, 38464, 38468, 38472, 38476, 38480, 38484, 38488, 38492, 38496, 38500, 38504, 38508, 38512, 38516, 38520, 38524, 38528, 38532, 38536, 38540, 38544, 38548, 38552, 38556, 38560, 38564, 38568, 38572, 38576, 38580, 38584, 38588, 38592, 38596, 38600, 38604, 38608, 38612, 38616, 38620, 38624, 38628, 38632, 38636, 38640, 38644, 38648, 38652, 38656, 38660, 38664, 38668, 38672, 38676, 38680, 38684, 38688, 38692, 38696, 38700, 38704, 38708, 38712, 38716, 38720, 38724, 38728, 38732, 38736, 38740, 38744, 38748, 38752, 38756, 38760, 38764, 38768, 38772, 38776, 38780, 38784, 38788, 38792, 38796, 38800, 38804, 38808, 38812, 38816, 38820, 38824, 38828, 38832, 38836, 38840, 38844, 38848, 38852, 38856, 38860, 38864, 38868, 38872, 38876, 38880, 38884, 38888, 38892, 38896, 38900, 38904, 38908, 38912, 38916, 38920, 38924, 38928, 38932, 38936, 38940, 38944, 38948, 38952, 38956, 38960, 38964, 38968, 38972, 38976, 38980, 38984, 38988, 38992, 38996, 39e3, 39004, 39008, 39012, 39016, 39020, 39024, 39028, 39032, 39036, 39040, 39044, 39048, 39052, 39056, 39060, 39064, 39068, 39072, 39076, 39080, 39084, 39088, 39092, 39096, 39100, 39104, 39108, 39112, 39116, 39120, 39124, 39128, 39132, 39136, 39140, 39144, 39148, 39152, 39156, 39160, 39164, 39168, 39172, 39176, 39180, 39184, 39188, 39192, 39196, 39200, 39204, 39208, 39212, 39216, 39220, 39224, 39228, 39232, 39236, 39240, 39244, 39248, 39252, 39256, 39260, 39264, 39268, 39272, 39276, 39280, 39284, 39288, 39292, 39296, 39300, 39304, 39308, 39312, 39316, 39320, 39324, 39328, 39332, 39336, 39340, 39344, 39348, 39352, 39356, 39360, 39364, 39368, 39372, 39376, 39380, 39384, 39388, 39392, 39396, 39400, 39404, 39408, 39412, 39416, 39420, 39424, 39428, 39432, 39436, 39440, 39444, 39448, 39452, 39456, 39460, 39464, 39468, 39472, 39476, 39480, 39484, 39488, 39492, 39496, 39500, 39504, 39508, 39512, 39516, 39520, 39524, 39528, 39532, 39536, 39540, 39544, 39548, 39552, 39556, 39560, 39564, 39568, 39572, 39576, 39580, 39584, 39588, 39592, 39596, 39600, 39604, 39608, 39612, 39616, 39620, 39624, 39628, 39632, 39636, 39640, 39644, 39648, 39652, 39656, 39660, 39664, 39668, 39672, 39676, 39680, 39684, 39688, 39692, 39696, 39700, 39704, 39708, 39712, 39716, 39720, 39724, 39728, 39732, 39736, 39740, 39744, 39748, 39752, 39756, 39760, 39764, 39768, 39772, 39776, 39780, 39784, 39788, 39792, 39796, 39800, 39804, 39808, 39812, 39816, 39820, 39824, 39828, 39832, 39836, 39840, 39844, 39848, 39852, 39856, 39860, 39864, 39868, 39872, 39876, 39880, 39884, 39888, 39892, 39896, 39900, 39904, 39908, 39912, 39916, 39920, 39924, 39928, 39932, 39936, 39940, 39944, 39948, 39952, 39956, 39960, 39964, 39968, 39972, 39976, 39980, 39984, 39988, 39992, 39996, 4e4, 40004, 40008, 40012, 40016, 40020, 40024, 40028, 40032, 40036, 40040, 40044, 40048, 40052, 40056, 40060, 40064, 40068, 40072, 40076, 40080, 40084, 40088, 40092, 40096, 40100, 40104, 40108, 40112, 40116, 40120, 40124, 40128, 40132, 40136, 40140, 40144, 40148, 40152, 40156, 40160, 40164, 40168, 40172, 40176, 40180, 40184, 40188, 40192, 40196, 40200, 40204, 40208, 40212, 40216, 40220, 40224, 40228, 40232, 40236, 40240, 40244, 40248, 40252, 40256, 40260, 40264, 40268, 40272, 40276, 40280, 40284, 40288, 40292, 40296, 40300, 40304, 40308, 40312, 40316, 40320, 40324, 40328, 40332, 40336, 40340, 40344, 40348, 40352, 40356, 40360, 40364, 40368, 40372, 40376, 40380, 40384, 40388, 40392, 40396, 40400, 40404, 40408, 40412, 40416, 40420, 40424, 40428, 40432, 40436, 40440, 40444, 40448, 40452, 40456, 40460, 40464, 40468, 40472, 40476, 40480, 40484, 40488, 40492, 40496, 40500, 40504, 40508, 40512, 40516, 40520, 40524, 40528, 40532, 40536, 40540, 40544, 40548, 40552, 40556, 40560, 40564, 40568, 40572, 40576, 40580, 40584, 40588, 40592, 40596, 40600, 40604, 40608, 40612, 40616, 40620, 40624, 40628, 40632, 40636, 40640, 40644, 40648, 40652, 40656, 40660, 40664, 40668, 40672, 40676, 40680, 40684, 40688, 40692, 40696, 40700, 40704, 40708, 40712, 40716, 40720, 40724, 40728, 40732, 40736, 40740, 40744, 40748, 40752, 40756, 40760, 40764, 40768, 40772, 40776, 40780, 40784, 40788, 40792, 40796, 40800, 40804, 40808, 40812, 40816, 40820, 40824, 40828, 40832, 40836, 40840, 40844, 40848, 40852, 40856, 40860, 40864, 40868, 40872, 40876, 40880, 40884, 40888, 40892, 40896, 40900, 40904, 40908, 40912, 40916, 40920, 40924, 40928, 40932, 40936, 40940, 40944, 40948, 40952, 40956, 40960, 40964, 40968, 40972, 40976, 40980, 40984, 40988, 40992, 40996, 41e3, 41004, 41008, 41012, 41016, 41020, 41024, 41028, 41032, 41036, 41040, 41044, 41048, 41052, 41056, 41060, 41064, 41068, 41072, 41076, 41080, 41084, 41088, 41092, 41096, 41100, 41104, 41108, 41112, 41116, 41120, 41124, 41128, 41132, 41136, 41140, 41144, 41148, 41152, 41156, 41160, 41164, 41168, 41172, 41176, 41180, 41184, 41188, 41192, 41196, 41200, 41204, 41208, 41212, 41216, 41220, 41224, 41228, 41232, 41236, 41240, 41244, 41248, 41252, 41256, 41260, 41264, 41268, 41272, 41276, 41280, 41284, 41288, 41292, 41296, 41300, 41304, 41308, 41312, 41316, 41320, 41324, 41328, 41332, 41336, 41340, 41344, 41348, 41352, 41356, 41360, 41364, 41368, 41372, 41376, 41380, 41384, 41388, 41392, 41396, 41400, 41404, 41408, 41412, 41416, 41420, 41424, 41428, 41432, 41436, 41440, 41444, 41448, 41452, 41456, 41460, 41464, 41468, 41472, 41476, 41480, 41484, 41488, 41492, 41496, 41500, 41504, 41508, 41512, 41516, 41520, 41524, 41528, 41532, 41536, 41540, 41544, 41548, 41552, 41556, 41560, 41564, 41568, 41572, 41576, 41580, 41584, 41588, 41592, 41596, 41600, 41604, 41608, 41612, 41616, 41620, 41624, 41628, 41632, 41636, 41640, 41644, 41648, 41652, 41656, 41660, 41664, 41668, 41672, 41676, 41680, 41684, 41688, 41692, 41696, 41700, 41704, 41708, 41712, 41716, 41720, 41724, 41728, 41732, 41736, 41740, 41744, 41748, 41752, 41756, 41760, 41764, 41768, 41772, 41776, 41780, 41784, 41788, 41792, 41796, 41800, 41804, 41808, 41812, 41816, 41820, 41824, 41828, 41832, 41836, 41840, 41844, 41848, 41852, 41856, 41860, 41864, 41868, 41872, 41876, 41880, 41884, 41888, 41892, 41896, 41900, 41904, 41908, 41912, 41916, 41920, 41924, 41928, 41932, 41936, 41940, 41944, 41948, 41952, 41956, 41960, 41964, 41968, 41972, 41976, 41980, 41984, 41988, 41992, 41996, 42e3, 42004, 42008, 42012, 42016, 42020, 42024, 42028, 42032, 42036, 42040, 42044, 42048, 42052, 42056, 42060, 42064, 42068, 42072, 42076, 42080, 42084, 42088, 42092, 42096, 42100, 42104, 42108, 42112, 42116, 42120, 42124, 42228, 42232, 42236, 42240, 42244, 42248, 42252, 42316, 42680, 43608, 43984, 44348, 44352, 45272, 45512, 45528, 45532, 45972, 46168, 46172, 46176, 46180, 46492, 46816, 47136, 48388, 49040, 50496, 50556, 50560, 50564, 50568, 50572, 50576, 50580, 50584, 50588, 50592, 50596, 50600, 50604, 50608, 50612, 50616, 50620, 50624, 50628, 50632, 50636, 50640, 50644, 50648, 50652, 50656, 50660, 50664, 50668, 50672, 50676, 50680, 50684, 50688, 50692, 50696, 50700, 50704, 50708, 50712, 50716, 50720, 50724, 50728, 50732, 50736, 50740, 50744, 50748, 50752, 50756, 50760, 50764, 50768, 50772, 50776, 50780, 50784, 50788, 50792, 50796, 50800, 50804, 50808, 50812, 50816, 50820, 50824, 50828, 50832, 50836, 50840, 50844, 50848, 50852, 50856, 50860, 50864, 50868, 50872, 50876, 50880, 50884, 50888, 50892, 50896, 50900, 50904, 50908, 50912, 50916, 50920, 50924, 50928, 50932, 50936, 50940, 50944, 50948, 50952, 50956, 50960, 50964, 50968, 50972, 50976, 50980, 50984, 50988, 50992, 50996, 51e3, 51004, 51008, 51012, 51016, 51020, 51024, 51028, 51032, 51036, 51040, 51044, 51048, 51052, 51056, 51060, 51064, 51068, 51072, 51076, 51080, 51084, 51088, 51092, 51096, 51100, 51104, 51108, 51112, 51116, 51120, 51124, 51128, 51132, 51136, 51140, 51144, 51148, 51152, 51156, 51160, 51164, 51168, 51172, 51176, 51180, 51184, 51188, 51192, 51196, 51200, 51204, 51208, 51212, 51216, 51220, 51224, 51228, 51232, 51236, 51240, 51244, 51248, 51252, 51256, 51260, 51264, 51268, 51272, 51276, 51280, 51284, 51288, 51292, 51296, 51300, 51304, 51308, 51312, 51316, 51320, 51324, 51328, 51332, 51336, 51340, 51344, 51348, 51352, 51356, 51360, 51364, 51368, 51372, 51376, 51380, 51384, 51388, 51392, 51396, 51400, 51404, 51408, 51412, 51416, 51420, 51424, 51428, 51432, 51436, 51440, 51444, 51448, 51452, 51456, 51460, 51464, 51468, 51472, 51476, 51480, 51484, 51488, 51492, 51496, 51500, 51504, 51508, 51512, 51516, 51520, 51524, 51528, 51532, 51536, 51540, 51544, 51548, 51552, 51556, 51560, 51564, 51568, 51572, 51576, 51580, 51584, 51648, 51732, 51960, 52416]);
    for (var i = 0; i < relocations.length; i++) {
        assert(relocations[i] % 4 === 0);
        assert(relocations[i] >= 0 && relocations[i] < eb + 53e3);
        assert(HEAPU32[eb + relocations[i] >> 2] + eb < -1 >>> 0, [i, relocations[i]]);
        HEAPU32[eb + relocations[i] >> 2] = HEAPU32[eb + relocations[i] >> 2] + eb
    }
}));
var ERRNO_CODES = {
    EPERM: 1,
    ENOENT: 2,
    ESRCH: 3,
    EINTR: 4,
    EIO: 5,
    ENXIO: 6,
    E2BIG: 7,
    ENOEXEC: 8,
    EBADF: 9,
    ECHILD: 10,
    EAGAIN: 11,
    EWOULDBLOCK: 11,
    ENOMEM: 12,
    EACCES: 13,
    EFAULT: 14,
    ENOTBLK: 15,
    EBUSY: 16,
    EEXIST: 17,
    EXDEV: 18,
    ENODEV: 19,
    ENOTDIR: 20,
    EISDIR: 21,
    EINVAL: 22,
    ENFILE: 23,
    EMFILE: 24,
    ENOTTY: 25,
    ETXTBSY: 26,
    EFBIG: 27,
    ENOSPC: 28,
    ESPIPE: 29,
    EROFS: 30,
    EMLINK: 31,
    EPIPE: 32,
    EDOM: 33,
    ERANGE: 34,
    ENOMSG: 42,
    EIDRM: 43,
    ECHRNG: 44,
    EL2NSYNC: 45,
    EL3HLT: 46,
    EL3RST: 47,
    ELNRNG: 48,
    EUNATCH: 49,
    ENOCSI: 50,
    EL2HLT: 51,
    EDEADLK: 35,
    ENOLCK: 37,
    EBADE: 52,
    EBADR: 53,
    EXFULL: 54,
    ENOANO: 55,
    EBADRQC: 56,
    EBADSLT: 57,
    EDEADLOCK: 35,
    EBFONT: 59,
    ENOSTR: 60,
    ENODATA: 61,
    ETIME: 62,
    ENOSR: 63,
    ENONET: 64,
    ENOPKG: 65,
    EREMOTE: 66,
    ENOLINK: 67,
    EADV: 68,
    ESRMNT: 69,
    ECOMM: 70,
    EPROTO: 71,
    EMULTIHOP: 72,
    EDOTDOT: 73,
    EBADMSG: 74,
    ENOTUNIQ: 76,
    EBADFD: 77,
    EREMCHG: 78,
    ELIBACC: 79,
    ELIBBAD: 80,
    ELIBSCN: 81,
    ELIBMAX: 82,
    ELIBEXEC: 83,
    ENOSYS: 38,
    ENOTEMPTY: 39,
    ENAMETOOLONG: 36,
    ELOOP: 40,
    EOPNOTSUPP: 95,
    EPFNOSUPPORT: 96,
    ECONNRESET: 104,
    ENOBUFS: 105,
    EAFNOSUPPORT: 97,
    EPROTOTYPE: 91,
    ENOTSOCK: 88,
    ENOPROTOOPT: 92,
    ESHUTDOWN: 108,
    ECONNREFUSED: 111,
    EADDRINUSE: 98,
    ECONNABORTED: 103,
    ENETUNREACH: 101,
    ENETDOWN: 100,
    ETIMEDOUT: 110,
    EHOSTDOWN: 112,
    EHOSTUNREACH: 113,
    EINPROGRESS: 115,
    EALREADY: 114,
    EDESTADDRREQ: 89,
    EMSGSIZE: 90,
    EPROTONOSUPPORT: 93,
    ESOCKTNOSUPPORT: 94,
    EADDRNOTAVAIL: 99,
    ENETRESET: 102,
    EISCONN: 106,
    ENOTCONN: 107,
    ETOOMANYREFS: 109,
    EUSERS: 87,
    EDQUOT: 122,
    ESTALE: 116,
    ENOTSUP: 95,
    ENOMEDIUM: 123,
    EILSEQ: 84,
    EOVERFLOW: 75,
    ECANCELED: 125,
    ENOTRECOVERABLE: 131,
    EOWNERDEAD: 130,
    ESTRPIPE: 86
};
var ERRNO_MESSAGES = {
    0: "Success",
    1: "Not super-user",
    2: "No such file or directory",
    3: "No such process",
    4: "Interrupted system call",
    5: "I/O error",
    6: "No such device or address",
    7: "Arg list too long",
    8: "Exec format error",
    9: "Bad file number",
    10: "No children",
    11: "No more processes",
    12: "Not enough core",
    13: "Permission denied",
    14: "Bad address",
    15: "Block device required",
    16: "Mount device busy",
    17: "File exists",
    18: "Cross-device link",
    19: "No such device",
    20: "Not a directory",
    21: "Is a directory",
    22: "Invalid argument",
    23: "Too many open files in system",
    24: "Too many open files",
    25: "Not a typewriter",
    26: "Text file busy",
    27: "File too large",
    28: "No space left on device",
    29: "Illegal seek",
    30: "Read only file system",
    31: "Too many links",
    32: "Broken pipe",
    33: "Math arg out of domain of func",
    34: "Math result not representable",
    35: "File locking deadlock error",
    36: "File or path name too long",
    37: "No record locks available",
    38: "Function not implemented",
    39: "Directory not empty",
    40: "Too many symbolic links",
    42: "No message of desired type",
    43: "Identifier removed",
    44: "Channel number out of range",
    45: "Level 2 not synchronized",
    46: "Level 3 halted",
    47: "Level 3 reset",
    48: "Link number out of range",
    49: "Protocol driver not attached",
    50: "No CSI structure available",
    51: "Level 2 halted",
    52: "Invalid exchange",
    53: "Invalid request descriptor",
    54: "Exchange full",
    55: "No anode",
    56: "Invalid request code",
    57: "Invalid slot",
    59: "Bad font file fmt",
    60: "Device not a stream",
    61: "No data (for no delay io)",
    62: "Timer expired",
    63: "Out of streams resources",
    64: "Machine is not on the network",
    65: "Package not installed",
    66: "The object is remote",
    67: "The link has been severed",
    68: "Advertise error",
    69: "Srmount error",
    70: "Communication error on send",
    71: "Protocol error",
    72: "Multihop attempted",
    73: "Cross mount point (not really error)",
    74: "Trying to read unreadable message",
    75: "Value too large for defined data type",
    76: "Given log. name not unique",
    77: "f.d. invalid for this operation",
    78: "Remote address changed",
    79: "Can   access a needed shared lib",
    80: "Accessing a corrupted shared lib",
    81: ".lib section in a.out corrupted",
    82: "Attempting to link in too many libs",
    83: "Attempting to exec a shared library",
    84: "Illegal byte sequence",
    86: "Streams pipe error",
    87: "Too many users",
    88: "Socket operation on non-socket",
    89: "Destination address required",
    90: "Message too long",
    91: "Protocol wrong type for socket",
    92: "Protocol not available",
    93: "Unknown protocol",
    94: "Socket type not supported",
    95: "Not supported",
    96: "Protocol family not supported",
    97: "Address family not supported by protocol family",
    98: "Address already in use",
    99: "Address not available",
    100: "Network interface is not configured",
    101: "Network is unreachable",
    102: "Connection reset by network",
    103: "Connection aborted",
    104: "Connection reset by peer",
    105: "No buffer space available",
    106: "Socket is already connected",
    107: "Socket is not connected",
    108: "Can't send after socket shutdown",
    109: "Too many references",
    110: "Connection timed out",
    111: "Connection refused",
    112: "Host is down",
    113: "Host is unreachable",
    114: "Socket already connected",
    115: "Connection already in progress",
    116: "Stale file handle",
    122: "Quota exceeded",
    123: "No medium (in tape drive)",
    125: "Operation canceled",
    130: "Previous owner died",
    131: "State not recoverable"
};

function ___setErrNo(value) {
    if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
    else err("failed to set errno from JS");
    return value
}
var PATH = {
    splitPath: (function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1)
    }),
    normalizeArray: (function(parts, allowAboveRoot) {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
                parts.splice(i, 1)
            } else if (last === "..") {
                parts.splice(i, 1);
                up++
            } else if (up) {
                parts.splice(i, 1);
                up--
            }
        }
        if (allowAboveRoot) {
            for (; up; up--) {
                parts.unshift("..")
            }
        }
        return parts
    }),
    normalize: (function(path) {
        var isAbsolute = path.charAt(0) === "/",
            trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter((function(p) {
            return !!p
        })), !isAbsolute).join("/");
        if (!path && !isAbsolute) {
            path = "."
        }
        if (path && trailingSlash) {
            path += "/"
        }
        return (isAbsolute ? "/" : "") + path
    }),
    dirname: (function(path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
            return "."
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1)
        }
        return root + dir
    }),
    basename: (function(path) {
        if (path === "/") return "/";
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1)
    }),
    extname: (function(path) {
        return PATH.splitPath(path)[3]
    }),
    join: (function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"))
    }),
    join2: (function(l, r) {
        return PATH.normalize(l + "/" + r)
    }),
    resolve: (function() {
        var resolvedPath = "",
            resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path !== "string") {
                throw new TypeError("Arguments to path.resolve must be strings")
            } else if (!path) {
                return ""
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/"
        }
        resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((function(p) {
            return !!p
        })), !resolvedAbsolute).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
    }),
    relative: (function(from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);

        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== "") break
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== "") break
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1)
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break
            }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..")
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/")
    })
};
var TTY = {
    ttys: [],
    init: (function() {}),
    shutdown: (function() {}),
    register: (function(dev, ops) {
        TTY.ttys[dev] = {
            input: [],
            output: [],
            ops: ops
        };
        FS.registerDevice(dev, TTY.stream_ops)
    }),
    stream_ops: {
        open: (function(stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
                throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
            }
            stream.tty = tty;
            stream.seekable = false
        }),
        close: (function(stream) {
            stream.tty.ops.flush(stream.tty)
        }),
        flush: (function(stream) {
            stream.tty.ops.flush(stream.tty)
        }),
        read: (function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
                var result;
                try {
                    result = stream.tty.ops.get_char(stream.tty)
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                }
                if (result === undefined && bytesRead === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result
            }
            if (bytesRead) {
                stream.node.timestamp = Date.now()
            }
            return bytesRead
        }),
        write: (function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
            }
            try {
                for (var i = 0; i < length; i++) {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                }
            } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO)
            }
            if (length) {
                stream.node.timestamp = Date.now()
            }
            return i
        })
    },
    default_tty_ops: {
        get_char: (function(tty) {
            if (!tty.input.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                    var BUFSIZE = 256;
                    var buf = new Buffer(BUFSIZE);
                    var bytesRead = 0;
                    var isPosixPlatform = process.platform != "win32";
                    var fd = process.stdin.fd;
                    if (isPosixPlatform) {
                        var usingDevice = false;
                        try {
                            fd = fs.openSync("/dev/stdin", "r");
                            usingDevice = true
                        } catch (e) {}
                    }
                    try {
                        bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null)
                    } catch (e) {
                        if (e.toString().indexOf("EOF") != -1) bytesRead = 0;
                        else throw e
                    }
                    if (usingDevice) {
                        fs.closeSync(fd)
                    }
                    if (bytesRead > 0) {
                        result = buf.slice(0, bytesRead).toString("utf-8")
                    } else {
                        result = null
                    }
                } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                    result = window.prompt("Input: ");
                    if (result !== null) {
                        result += "\n"
                    }
                } else if (typeof readline == "function") {
                    result = readline();
                    if (result !== null) {
                        result += "\n"
                    }
                }
                if (!result) {
                    return null
                }
                tty.input = intArrayFromString(result, true)
            }
            return tty.input.shift()
        }),
        put_char: (function(tty, val) {
            if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        }),
        flush: (function(tty) {
            if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        })
    },
    default_tty1_ops: {
        put_char: (function(tty, val) {
            if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        }),
        flush: (function(tty) {
            if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        })
    }
};
var MEMFS = {
    ops_table: null,
    mount: (function(mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0)
    }),
    createNode: (function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        lookup: MEMFS.node_ops.lookup,
                        mknod: MEMFS.node_ops.mknod,
                        rename: MEMFS.node_ops.rename,
                        unlink: MEMFS.node_ops.unlink,
                        rmdir: MEMFS.node_ops.rmdir,
                        readdir: MEMFS.node_ops.readdir,
                        symlink: MEMFS.node_ops.symlink
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek
                    }
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek,
                        read: MEMFS.stream_ops.read,
                        write: MEMFS.stream_ops.write,
                        allocate: MEMFS.stream_ops.allocate,
                        mmap: MEMFS.stream_ops.mmap,
                        msync: MEMFS.stream_ops.msync
                    }
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        readlink: MEMFS.node_ops.readlink
                    },
                    stream: {}
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: FS.chrdev_stream_ops
                }
            }
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {}
        } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null
        } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream
        } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream
        }
        node.timestamp = Date.now();
        if (parent) {
            parent.contents[name] = node
        }
        return node
    }),
    getFileDataAsRegularArray: (function(node) {
        if (node.contents && node.contents.subarray) {
            var arr = [];
            for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
            return arr
        }
        return node.contents
    }),
    getFileDataAsTypedArray: (function(node) {
        if (!node.contents) return new Uint8Array;
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents)
    }),
    expandFileStorage: (function(node, newCapacity) {
        if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
            node.contents = MEMFS.getFileDataAsRegularArray(node);
            node.usedBytes = node.contents.length
        }
        if (!node.contents || node.contents.subarray) {
            var prevCapacity = node.contents ? node.contents.length : 0;
            if (prevCapacity >= newCapacity) return;
            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
            newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
            if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
            var oldContents = node.contents;
            node.contents = new Uint8Array(newCapacity);
            if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
            return
        }
        if (!node.contents && newCapacity > 0) node.contents = [];
        while (node.contents.length < newCapacity) node.contents.push(0)
    }),
    resizeFileStorage: (function(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
            return
        }
        if (!node.contents || node.contents.subarray) {
            var oldContents = node.contents;
            node.contents = new Uint8Array(new ArrayBuffer(newSize));
            if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
            }
            node.usedBytes = newSize;
            return
        }
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else
            while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize
    }),
    node_ops: {
        getattr: (function(node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
                attr.size = 4096
            } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes
            } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length
            } else {
                attr.size = 0
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr
        }),
        setattr: (function(node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
            if (attr.size !== undefined) {
                MEMFS.resizeFileStorage(node, attr.size)
            }
        }),
        lookup: (function(parent, name) {
            throw FS.genericErrors[ERRNO_CODES.ENOENT]
        }),
        mknod: (function(parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev)
        }),
        rename: (function(old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {}
                if (new_node) {
                    for (var i in new_node.contents) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                    }
                }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            old_node.parent = new_dir
        }),
        unlink: (function(parent, name) {
            delete parent.contents[name]
        }),
        rmdir: (function(parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
            }
            delete parent.contents[name]
        }),
        readdir: (function(node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue
                }
                entries.push(key)
            }
            return entries
        }),
        symlink: (function(parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node
        }),
        readlink: (function(node) {
            if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            return node.link
        })
    },
    stream_ops: {
        read: (function(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            assert(size >= 0);
            if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset)
            } else {
                for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
            }
            return size
        }),
        write: (function(stream, buffer, offset, length, position, canOwn) {
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                    assert(position === 0, "canOwn must imply no weird position inside the file");
                    node.contents = buffer.subarray(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (node.usedBytes === 0 && position === 0) {
                    node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
                    node.usedBytes = length;
                    return length
                } else if (position + length <= node.usedBytes) {
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                    return length
                }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position);
            else {
                for (var i = 0; i < length; i++) {
                    node.contents[position + i] = buffer[offset + i]
                }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length
        }),
        llseek: (function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.usedBytes
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            return position
        }),
        allocate: (function(stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
        }),
        mmap: (function(stream, buffer, offset, length, position, prot, flags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
                allocated = false;
                ptr = contents.byteOffset
            } else {
                if (position > 0 || position + length < stream.node.usedBytes) {
                    if (contents.subarray) {
                        contents = contents.subarray(position, position + length)
                    } else {
                        contents = Array.prototype.slice.call(contents, position, position + length)
                    }
                }
                allocated = true;
                ptr = _malloc(length);
                if (!ptr) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOMEM)
                }
                buffer.set(contents, ptr)
            }
            return {
                ptr: ptr,
                allocated: allocated
            }
        }),
        msync: (function(stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
            }
            if (mmapFlags & 2) {
                return 0
            }
            var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0
        })
    }
};
var IDBFS = {
    dbs: {},
    indexedDB: (function() {
        if (typeof indexedDB !== "undefined") return indexedDB;
        var ret = null;
        if (typeof window === "object") ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, "IDBFS used, but indexedDB not supported");
        return ret
    }),
    DB_VERSION: 21,
    DB_STORE_NAME: "FILE_DATA",
    mount: (function(mount) {
        return MEMFS.mount.apply(null, arguments)
    }),
    syncfs: (function(mount, populate, callback) {
        IDBFS.getLocalSet(mount, (function(err, local) {
            if (err) return callback(err);
            IDBFS.getRemoteSet(mount, (function(err, remote) {
                if (err) return callback(err);
                var src = populate ? remote : local;
                var dst = populate ? local : remote;
                IDBFS.reconcile(src, dst, callback)
            }))
        }))
    }),
    getDB: (function(name, callback) {
        var db = IDBFS.dbs[name];
        if (db) {
            return callback(null, db)
        }
        var req;
        try {
            req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION)
        } catch (e) {
            return callback(e)
        }
        if (!req) {
            return callback("Unable to connect to IndexedDB")
        }
        req.onupgradeneeded = (function(e) {
            var db = e.target.result;
            var transaction = e.target.transaction;
            var fileStore;
            if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME)
            } else {
                fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME)
            }
            if (!fileStore.indexNames.contains("timestamp")) {
                fileStore.createIndex("timestamp", "timestamp", {
                    unique: false
                })
            }
        });
        req.onsuccess = (function() {
            db = req.result;
            IDBFS.dbs[name] = db;
            callback(null, db)
        });
        req.onerror = (function(e) {
            callback(this.error);
            e.preventDefault()
        })
    }),
    getLocalSet: (function(mount, callback) {
        var entries = {};

        function isRealDir(p) {
            return p !== "." && p !== ".."
        }

        function toAbsolute(root) {
            return (function(p) {
                return PATH.join2(root, p)
            })
        }
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
        while (check.length) {
            var path = check.pop();
            var stat;
            try {
                stat = FS.stat(path)
            } catch (e) {
                return callback(e)
            }
            if (FS.isDir(stat.mode)) {
                check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
            }
            entries[path] = {
                timestamp: stat.mtime
            }
        }
        return callback(null, {
            type: "local",
            entries: entries
        })
    }),
    getRemoteSet: (function(mount, callback) {
        var entries = {};
        IDBFS.getDB(mount.mountpoint, (function(err, db) {
            if (err) return callback(err);
            try {
                var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                transaction.onerror = (function(e) {
                    callback(this.error);
                    e.preventDefault()
                });
                var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                var index = store.index("timestamp");
                index.openKeyCursor().onsuccess = (function(event) {
                    var cursor = event.target.result;
                    if (!cursor) {
                        return callback(null, {
                            type: "remote",
                            db: db,
                            entries: entries
                        })
                    }
                    entries[cursor.primaryKey] = {
                        timestamp: cursor.key
                    };
                    cursor.continue()
                })
            } catch (e) {
                return callback(e)
            }
        }))
    }),
    loadLocalEntry: (function(path, callback) {
        var stat, node;
        try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path)
        } catch (e) {
            return callback(e)
        }
        if (FS.isDir(stat.mode)) {
            return callback(null, {
                timestamp: stat.mtime,
                mode: stat.mode
            })
        } else if (FS.isFile(stat.mode)) {
            node.contents = MEMFS.getFileDataAsTypedArray(node);
            return callback(null, {
                timestamp: stat.mtime,
                mode: stat.mode,
                contents: node.contents
            })
        } else {
            return callback(new Error("node type not supported"))
        }
    }),
    storeLocalEntry: (function(path, entry, callback) {
        try {
            if (FS.isDir(entry.mode)) {
                FS.mkdir(path, entry.mode)
            } else if (FS.isFile(entry.mode)) {
                FS.writeFile(path, entry.contents, {
                    canOwn: true
                })
            } else {
                return callback(new Error("node type not supported"))
            }
            FS.chmod(path, entry.mode);
            FS.utime(path, entry.timestamp, entry.timestamp)
        } catch (e) {
            return callback(e)
        }
        callback(null)
    }),
    removeLocalEntry: (function(path, callback) {
        try {
            var lookup = FS.lookupPath(path);
            var stat = FS.stat(path);
            if (FS.isDir(stat.mode)) {
                FS.rmdir(path)
            } else if (FS.isFile(stat.mode)) {
                FS.unlink(path)
            }
        } catch (e) {
            return callback(e)
        }
        callback(null)
    }),
    loadRemoteEntry: (function(store, path, callback) {
        var req = store.get(path);
        req.onsuccess = (function(event) {
            callback(null, event.target.result)
        });
        req.onerror = (function(e) {
            callback(this.error);
            e.preventDefault()
        })
    }),
    storeRemoteEntry: (function(store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = (function() {
            callback(null)
        });
        req.onerror = (function(e) {
            callback(this.error);
            e.preventDefault()
        })
    }),
    removeRemoteEntry: (function(store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = (function() {
            callback(null)
        });
        req.onerror = (function(e) {
            callback(this.error);
            e.preventDefault()
        })
    }),
    reconcile: (function(src, dst, callback) {
        var total = 0;
        var create = [];
        Object.keys(src.entries).forEach((function(key) {
            var e = src.entries[key];
            var e2 = dst.entries[key];
            if (!e2 || e.timestamp > e2.timestamp) {
                create.push(key);
                total++
            }
        }));
        var remove = [];
        Object.keys(dst.entries).forEach((function(key) {
            var e = dst.entries[key];
            var e2 = src.entries[key];
            if (!e2) {
                remove.push(key);
                total++
            }
        }));
        if (!total) {
            return callback(null)
        }
        var completed = 0;
        var db = src.type === "remote" ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);

        function done(err) {
            if (err) {
                if (!done.errored) {
                    done.errored = true;
                    return callback(err)
                }
                return
            }
            if (++completed >= total) {
                return callback(null)
            }
        }
        transaction.onerror = (function(e) {
            done(this.error);
            e.preventDefault()
        });
        create.sort().forEach((function(path) {
            if (dst.type === "local") {
                IDBFS.loadRemoteEntry(store, path, (function(err, entry) {
                    if (err) return done(err);
                    IDBFS.storeLocalEntry(path, entry, done)
                }))
            } else {
                IDBFS.loadLocalEntry(path, (function(err, entry) {
                    if (err) return done(err);
                    IDBFS.storeRemoteEntry(store, path, entry, done)
                }))
            }
        }));
        remove.sort().reverse().forEach((function(path) {
            if (dst.type === "local") {
                IDBFS.removeLocalEntry(path, done)
            } else {
                IDBFS.removeRemoteEntry(store, path, done)
            }
        }))
    })
};
var NODEFS = {
    isWindows: false,
    staticInit: (function() {
        NODEFS.isWindows = !!process.platform.match(/^win/);
        var flags = process["binding"]("constants");
        if (flags["fs"]) {
            flags = flags["fs"]
        }
        NODEFS.flagsForNodeMap = {
            "1024": flags["O_APPEND"],
            "64": flags["O_CREAT"],
            "128": flags["O_EXCL"],
            "0": flags["O_RDONLY"],
            "2": flags["O_RDWR"],
            "4096": flags["O_SYNC"],
            "512": flags["O_TRUNC"],
            "1": flags["O_WRONLY"]
        }
    }),
    bufferFrom: (function(arrayBuffer) {
        return Buffer.alloc ? Buffer.from(arrayBuffer) : new Buffer(arrayBuffer)
    }),
    mount: (function(mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0)
    }),
    createNode: (function(parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node
    }),
    getMode: (function(path) {
        var stat;
        try {
            stat = fs.lstatSync(path);
            if (NODEFS.isWindows) {
                stat.mode = stat.mode | (stat.mode & 292) >> 2
            }
        } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code])
        }
        return stat.mode
    }),
    realPath: (function(node) {
        var parts = [];
        while (node.parent !== node) {
            parts.push(node.name);
            node = node.parent
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts)
    }),
    flagsForNode: (function(flags) {
        flags &= ~2097152;
        flags &= ~2048;
        flags &= ~32768;
        flags &= ~524288;
        var newFlags = 0;
        for (var k in NODEFS.flagsForNodeMap) {
            if (flags & k) {
                newFlags |= NODEFS.flagsForNodeMap[k];
                flags ^= k
            }
        }
        if (!flags) {
            return newFlags
        } else {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
    }),
    node_ops: {
        getattr: (function(node) {
            var path = NODEFS.realPath(node);
            var stat;
            try {
                stat = fs.lstatSync(path)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
            if (NODEFS.isWindows && !stat.blksize) {
                stat.blksize = 4096
            }
            if (NODEFS.isWindows && !stat.blocks) {
                stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0
            }
            return {
                dev: stat.dev,
                ino: stat.ino,
                mode: stat.mode,
                nlink: stat.nlink,
                uid: stat.uid,
                gid: stat.gid,
                rdev: stat.rdev,
                size: stat.size,
                atime: stat.atime,
                mtime: stat.mtime,
                ctime: stat.ctime,
                blksize: stat.blksize,
                blocks: stat.blocks
            }
        }),
        setattr: (function(node, attr) {
            var path = NODEFS.realPath(node);
            try {
                if (attr.mode !== undefined) {
                    fs.chmodSync(path, attr.mode);
                    node.mode = attr.mode
                }
                if (attr.timestamp !== undefined) {
                    var date = new Date(attr.timestamp);
                    fs.utimesSync(path, date, date)
                }
                if (attr.size !== undefined) {
                    fs.truncateSync(path, attr.size)
                }
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        lookup: (function(parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            var mode = NODEFS.getMode(path);
            return NODEFS.createNode(parent, name, mode)
        }),
        mknod: (function(parent, name, mode, dev) {
            var node = NODEFS.createNode(parent, name, mode, dev);
            var path = NODEFS.realPath(node);
            try {
                if (FS.isDir(node.mode)) {
                    fs.mkdirSync(path, node.mode)
                } else {
                    fs.writeFileSync(path, "", {
                        mode: node.mode
                    })
                }
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
            return node
        }),
        rename: (function(oldNode, newDir, newName) {
            var oldPath = NODEFS.realPath(oldNode);
            var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
            try {
                fs.renameSync(oldPath, newPath)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        unlink: (function(parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            try {
                fs.unlinkSync(path)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        rmdir: (function(parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            try {
                fs.rmdirSync(path)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        readdir: (function(node) {
            var path = NODEFS.realPath(node);
            try {
                return fs.readdirSync(path)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        symlink: (function(parent, newName, oldPath) {
            var newPath = PATH.join2(NODEFS.realPath(parent), newName);
            try {
                fs.symlinkSync(oldPath, newPath)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        readlink: (function(node) {
            var path = NODEFS.realPath(node);
            try {
                path = fs.readlinkSync(path);
                path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
                return path
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        })
    },
    stream_ops: {
        open: (function(stream) {
            var path = NODEFS.realPath(stream.node);
            try {
                if (FS.isFile(stream.node.mode)) {
                    stream.nfd = fs.openSync(path, NODEFS.flagsForNode(stream.flags))
                }
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        close: (function(stream) {
            try {
                if (FS.isFile(stream.node.mode) && stream.nfd) {
                    fs.closeSync(stream.nfd)
                }
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        read: (function(stream, buffer, offset, length, position) {
            if (length === 0) return 0;
            try {
                return fs.readSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position)
            } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        write: (function(stream, buffer, offset, length, position) {
            try {
                return fs.writeSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position)
            } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        llseek: (function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    try {
                        var stat = fs.fstatSync(stream.nfd);
                        position += stat.size
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            return position
        })
    }
};
var WORKERFS = {
    DIR_MODE: 16895,
    FILE_MODE: 33279,
    reader: null,
    mount: (function(mount) {
        assert(ENVIRONMENT_IS_WORKER);
        if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync;
        var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
        var createdParents = {};

        function ensureParent(path) {
            var parts = path.split("/");
            var parent = root;
            for (var i = 0; i < parts.length - 1; i++) {
                var curr = parts.slice(0, i + 1).join("/");
                if (!createdParents[curr]) {
                    createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0)
                }
                parent = createdParents[curr]
            }
            return parent
        }

        function base(path) {
            var parts = path.split("/");
            return parts[parts.length - 1]
        }
        Array.prototype.forEach.call(mount.opts["files"] || [], (function(file) {
            WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate)
        }));
        (mount.opts["blobs"] || []).forEach((function(obj) {
            WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"])
        }));
        (mount.opts["packages"] || []).forEach((function(pack) {
            pack["metadata"].files.forEach((function(file) {
                var name = file.filename.substr(1);
                WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack["blob"].slice(file.start, file.end))
            }))
        }));
        return root
    }),
    createNode: (function(parent, name, mode, dev, contents, mtime) {
        var node = FS.createNode(parent, name, mode);
        node.mode = mode;
        node.node_ops = WORKERFS.node_ops;
        node.stream_ops = WORKERFS.stream_ops;
        node.timestamp = (mtime || new Date).getTime();
        assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
        if (mode === WORKERFS.FILE_MODE) {
            node.size = contents.size;
            node.contents = contents
        } else {
            node.size = 4096;
            node.contents = {}
        }
        if (parent) {
            parent.contents[name] = node
        }
        return node
    }),
    node_ops: {
        getattr: (function(node) {
            return {
                dev: 1,
                ino: undefined,
                mode: node.mode,
                nlink: 1,
                uid: 0,
                gid: 0,
                rdev: undefined,
                size: node.size,
                atime: new Date(node.timestamp),
                mtime: new Date(node.timestamp),
                ctime: new Date(node.timestamp),
                blksize: 4096,
                blocks: Math.ceil(node.size / 4096)
            }
        }),
        setattr: (function(node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
        }),
        lookup: (function(parent, name) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }),
        mknod: (function(parent, name, mode, dev) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        rename: (function(oldNode, newDir, newName) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        unlink: (function(parent, name) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        rmdir: (function(parent, name) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        readdir: (function(node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue
                }
                entries.push(key)
            }
            return entries
        }),
        symlink: (function(parent, newName, oldPath) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        readlink: (function(node) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        })
    },
    stream_ops: {
        read: (function(stream, buffer, offset, length, position) {
            if (position >= stream.node.size) return 0;
            var chunk = stream.node.contents.slice(position, position + length);
            var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
            buffer.set(new Uint8Array(ab), offset);
            return chunk.size
        }),
        write: (function(stream, buffer, offset, length, position) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO)
        }),
        llseek: (function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.size
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            return position
        })
    }
};
STATICTOP += 16;
STATICTOP += 16;
STATICTOP += 16;
var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    trackingDelegate: {},
    tracking: {
        openFlags: {
            READ: 1,
            WRITE: 2
        }
    },
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    handleFSError: (function(e) {
        if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
        return ___setErrNo(e.errno)
    }),
    lookupPath: (function(path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
        if (!path) return {
            path: "",
            node: null
        };
        var defaults = {
            follow_mount: true,
            recurse_count: 0
        };
        for (var key in defaults) {
            if (opts[key] === undefined) {
                opts[key] = defaults[key]
            }
        }
        if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
        }
        var parts = PATH.normalizeArray(path.split("/").filter((function(p) {
            return !!p
        })), false);
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
                break
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                    current = current.mounted.root
                }
            }
            if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                    var link = FS.readlink(current_path);
                    current_path = PATH.resolve(PATH.dirname(current_path), link);
                    var lookup = FS.lookupPath(current_path, {
                        recurse_count: opts.recurse_count
                    });
                    current = lookup.node;
                    if (count++ > 40) {
                        throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                    }
                }
            }
        }
        return {
            path: current_path,
            node: current
        }
    }),
    getPath: (function(node) {
        var path;
        while (true) {
            if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path) return mount;
                return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent
        }
    }),
    hashName: (function(parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0
        }
        return (parentid + hash >>> 0) % FS.nameTable.length
    }),
    hashAddNode: (function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node
    }),
    hashRemoveNode: (function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next
        } else {
            var current = FS.nameTable[hash];
            while (current) {
                if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break
                }
                current = current.name_next
            }
        }
    }),
    lookupNode: (function(parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
            throw new FS.ErrnoError(err, parent)
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
                return node
            }
        }
        return FS.lookup(parent, name)
    }),
    createNode: (function(parent, name, mode, rdev) {
        if (!FS.FSNode) {
            FS.FSNode = (function(parent, name, mode, rdev) {
                if (!parent) {
                    parent = this
                }
                this.parent = parent;
                this.mount = parent.mount;
                this.mounted = null;
                this.id = FS.nextInode++;
                this.name = name;
                this.mode = mode;
                this.node_ops = {};
                this.stream_ops = {};
                this.rdev = rdev
            });
            FS.FSNode.prototype = {};
            var readMode = 292 | 73;
            var writeMode = 146;
            Object.defineProperties(FS.FSNode.prototype, {
                read: {
                    get: (function() {
                        return (this.mode & readMode) === readMode
                    }),
                    set: (function(val) {
                        val ? this.mode |= readMode : this.mode &= ~readMode
                    })
                },
                write: {
                    get: (function() {
                        return (this.mode & writeMode) === writeMode
                    }),
                    set: (function(val) {
                        val ? this.mode |= writeMode : this.mode &= ~writeMode
                    })
                },
                isFolder: {
                    get: (function() {
                        return FS.isDir(this.mode)
                    })
                },
                isDevice: {
                    get: (function() {
                        return FS.isChrdev(this.mode)
                    })
                }
            })
        }
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node
    }),
    destroyNode: (function(node) {
        FS.hashRemoveNode(node)
    }),
    isRoot: (function(node) {
        return node === node.parent
    }),
    isMountpoint: (function(node) {
        return !!node.mounted
    }),
    isFile: (function(mode) {
        return (mode & 61440) === 32768
    }),
    isDir: (function(mode) {
        return (mode & 61440) === 16384
    }),
    isLink: (function(mode) {
        return (mode & 61440) === 40960
    }),
    isChrdev: (function(mode) {
        return (mode & 61440) === 8192
    }),
    isBlkdev: (function(mode) {
        return (mode & 61440) === 24576
    }),
    isFIFO: (function(mode) {
        return (mode & 61440) === 4096
    }),
    isSocket: (function(mode) {
        return (mode & 49152) === 49152
    }),
    flagModes: {
        "r": 0,
        "rs": 1052672,
        "r+": 2,
        "w": 577,
        "wx": 705,
        "xw": 705,
        "w+": 578,
        "wx+": 706,
        "xw+": 706,
        "a": 1089,
        "ax": 1217,
        "xa": 1217,
        "a+": 1090,
        "ax+": 1218,
        "xa+": 1218
    },
    modeStringToFlags: (function(str) {
        var flags = FS.flagModes[str];
        if (typeof flags === "undefined") {
            throw new Error("Unknown file open mode: " + str)
        }
        return flags
    }),
    flagsToPermissionString: (function(flag) {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
            perms += "w"
        }
        return perms
    }),
    nodePermissions: (function(node, perms) {
        if (FS.ignorePermissions) {
            return 0
        }
        if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
            return ERRNO_CODES.EACCES
        } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
            return ERRNO_CODES.EACCES
        } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
            return ERRNO_CODES.EACCES
        }
        return 0
    }),
    mayLookup: (function(dir) {
        var err = FS.nodePermissions(dir, "x");
        if (err) return err;
        if (!dir.node_ops.lookup) return ERRNO_CODES.EACCES;
        return 0
    }),
    mayCreate: (function(dir, name) {
        try {
            var node = FS.lookupNode(dir, name);
            return ERRNO_CODES.EEXIST
        } catch (e) {}
        return FS.nodePermissions(dir, "wx")
    }),
    mayDelete: (function(dir, name, isdir) {
        var node;
        try {
            node = FS.lookupNode(dir, name)
        } catch (e) {
            return e.errno
        }
        var err = FS.nodePermissions(dir, "wx");
        if (err) {
            return err
        }
        if (isdir) {
            if (!FS.isDir(node.mode)) {
                return ERRNO_CODES.ENOTDIR
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return ERRNO_CODES.EBUSY
            }
        } else {
            if (FS.isDir(node.mode)) {
                return ERRNO_CODES.EISDIR
            }
        }
        return 0
    }),
    mayOpen: (function(node, flags) {
        if (!node) {
            return ERRNO_CODES.ENOENT
        }
        if (FS.isLink(node.mode)) {
            return ERRNO_CODES.ELOOP
        } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return ERRNO_CODES.EISDIR
            }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
    }),
    MAX_OPEN_FDS: 4096,
    nextfd: (function(fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
                return fd
            }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
    }),
    getStream: (function(fd) {
        return FS.streams[fd]
    }),
    createStream: (function(stream, fd_start, fd_end) {
        if (!FS.FSStream) {
            FS.FSStream = (function() {});
            FS.FSStream.prototype = {};
            Object.defineProperties(FS.FSStream.prototype, {
                object: {
                    get: (function() {
                        return this.node
                    }),
                    set: (function(val) {
                        this.node = val
                    })
                },
                isRead: {
                    get: (function() {
                        return (this.flags & 2097155) !== 1
                    })
                },
                isWrite: {
                    get: (function() {
                        return (this.flags & 2097155) !== 0
                    })
                },
                isAppend: {
                    get: (function() {
                        return this.flags & 1024
                    })
                }
            })
        }
        var newStream = new FS.FSStream;
        for (var p in stream) {
            newStream[p] = stream[p]
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream
    }),
    closeStream: (function(fd) {
        FS.streams[fd] = null
    }),
    chrdev_stream_ops: {
        open: (function(stream) {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
                stream.stream_ops.open(stream)
            }
        }),
        llseek: (function() {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
        })
    },
    major: (function(dev) {
        return dev >> 8
    }),
    minor: (function(dev) {
        return dev & 255
    }),
    makedev: (function(ma, mi) {
        return ma << 8 | mi
    }),
    registerDevice: (function(dev, ops) {
        FS.devices[dev] = {
            stream_ops: ops
        }
    }),
    getDevice: (function(dev) {
        return FS.devices[dev]
    }),
    getMounts: (function(mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts)
        }
        return mounts
    }),
    syncfs: (function(populate, callback) {
        if (typeof populate === "function") {
            callback = populate;
            populate = false
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
            console.log("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;

        function doCallback(err) {
            assert(FS.syncFSRequests > 0);
            FS.syncFSRequests--;
            return callback(err)
        }

        function done(err) {
            if (err) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(err)
                }
                return
            }
            if (++completed >= mounts.length) {
                doCallback(null)
            }
        }
        mounts.forEach((function(mount) {
            if (!mount.type.syncfs) {
                return done(null)
            }
            mount.type.syncfs(mount, populate, done)
        }))
    }),
    mount: (function(type, opts, mountpoint) {
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
            });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
            }
            if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
            }
        }
        var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
            FS.root = mountRoot
        } else if (node) {
            node.mounted = mount;
            if (node.mount) {
                node.mount.mounts.push(mount)
            }
        }
        return mountRoot
    }),
    unmount: (function(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, {
            follow_mount: false
        });
        if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach((function(hash) {
            var current = FS.nameTable[hash];
            while (current) {
                var next = current.name_next;
                if (mounts.indexOf(current.mount) !== -1) {
                    FS.destroyNode(current)
                }
                current = next
            }
        }));
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1)
    }),
    lookup: (function(parent, name) {
        return parent.node_ops.lookup(parent, name)
    }),
    mknod: (function(path, mode, dev) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        return parent.node_ops.mknod(parent, name, mode, dev)
    }),
    create: (function(path, mode) {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0)
    }),
    mkdir: (function(path, mode) {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0)
    }),
    mkdirTree: (function(path, mode) {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
                FS.mkdir(d, mode)
            } catch (e) {
                if (e.errno != ERRNO_CODES.EEXIST) throw e
            }
        }
    }),
    mkdev: (function(path, mode, dev) {
        if (typeof dev === "undefined") {
            dev = mode;
            mode = 438
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev)
    }),
    symlink: (function(oldpath, newpath) {
        if (!PATH.resolve(oldpath)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        var lookup = FS.lookupPath(newpath, {
            parent: true
        });
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        return parent.node_ops.symlink(parent, newname, oldpath)
    }),
    rename: (function(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        try {
            lookup = FS.lookupPath(old_path, {
                parent: true
            });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, {
                parent: true
            });
            new_dir = lookup.node
        } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(ERRNO_CODES.EXDEV)
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
        }
        var new_node;
        try {
            new_node = FS.lookupNode(new_dir, new_name)
        } catch (e) {}
        if (old_node === new_node) {
            return
        }
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        }
        if (new_dir !== old_dir) {
            err = FS.nodePermissions(old_dir, "w");
            if (err) {
                throw new FS.ErrnoError(err)
            }
        }
        try {
            if (FS.trackingDelegate["willMovePath"]) {
                FS.trackingDelegate["willMovePath"](old_path, new_path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
        FS.hashRemoveNode(old_node);
        try {
            old_dir.node_ops.rename(old_node, new_dir, new_name)
        } catch (e) {
            throw e
        } finally {
            FS.hashAddNode(old_node)
        }
        try {
            if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path)
        } catch (e) {
            console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
    }),
    rmdir: (function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    }),
    readdir: (function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
        }
        return node.node_ops.readdir(node)
    }),
    unlink: (function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    }),
    readlink: (function(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        return PATH.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
    }),
    stat: (function(path, dontFollow) {
        var lookup = FS.lookupPath(path, {
            follow: !dontFollow
        });
        var node = lookup.node;
        if (!node) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        return node.node_ops.getattr(node)
    }),
    lstat: (function(path) {
        return FS.stat(path, true)
    }),
    chmod: (function(path, mode, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        node.node_ops.setattr(node, {
            mode: mode & 4095 | node.mode & ~4095,
            timestamp: Date.now()
        })
    }),
    lchmod: (function(path, mode) {
        FS.chmod(path, mode, true)
    }),
    fchmod: (function(fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        FS.chmod(stream.node, mode)
    }),
    chown: (function(path, uid, gid, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        node.node_ops.setattr(node, {
            timestamp: Date.now()
        })
    }),
    lchown: (function(path, uid, gid) {
        FS.chown(path, uid, gid, true)
    }),
    fchown: (function(fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        FS.chown(stream.node, uid, gid)
    }),
    truncate: (function(path, len) {
        if (len < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: true
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
        }
        if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var err = FS.nodePermissions(node, "w");
        if (err) {
            throw new FS.ErrnoError(err)
        }
        node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
        })
    }),
    ftruncate: (function(fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        FS.truncate(stream.node, len)
    }),
    utime: (function(path, atime, mtime) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
        })
    }),
    open: (function(path, flags, mode, fd_start, fd_end) {
        if (path === "") {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === "undefined" ? 438 : mode;
        if (flags & 64) {
            mode = mode & 4095 | 32768
        } else {
            mode = 0
        }
        var node;
        if (typeof path === "object") {
            node = path
        } else {
            path = PATH.normalize(path);
            try {
                var lookup = FS.lookupPath(path, {
                    follow: !(flags & 131072)
                });
                node = lookup.node
            } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
            if (node) {
                if (flags & 128) {
                    throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
                }
            } else {
                node = FS.mknod(path, mode, 0);
                created = true
            }
        }
        if (!node) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        if (FS.isChrdev(node.mode)) {
            flags &= ~512
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
        }
        if (!created) {
            var err = FS.mayOpen(node, flags);
            if (err) {
                throw new FS.ErrnoError(err)
            }
        }
        if (flags & 512) {
            FS.truncate(node, 0)
        }
        flags &= ~(128 | 512);
        var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
        }, fd_start, fd_end);
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
                console.log("FS.trackingDelegate error on read file: " + path)
            }
        }
        try {
            if (FS.trackingDelegate["onOpenFile"]) {
                var trackingFlags = 0;
                if ((flags & 2097155) !== 1) {
                    trackingFlags |= FS.tracking.openFlags.READ
                }
                if ((flags & 2097155) !== 0) {
                    trackingFlags |= FS.tracking.openFlags.WRITE
                }
                FS.trackingDelegate["onOpenFile"](path, trackingFlags)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message)
        }
        return stream
    }),
    close: (function(stream) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if (stream.getdents) stream.getdents = null;
        try {
            if (stream.stream_ops.close) {
                stream.stream_ops.close(stream)
            }
        } catch (e) {
            throw e
        } finally {
            FS.closeStream(stream.fd)
        }
        stream.fd = null
    }),
    isClosed: (function(stream) {
        return stream.fd === null
    }),
    llseek: (function(stream, offset, whence) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position
    }),
    read: (function(stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
        }
        if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead
    }),
    write: (function(stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
        }
        if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        if (stream.flags & 1024) {
            FS.llseek(stream, 0, 2)
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
            if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path)
        } catch (e) {
            console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + e.message)
        }
        return bytesWritten
    }),
    allocate: (function(stream, offset, length) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
        }
        if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
        }
        stream.stream_ops.allocate(stream, offset, length)
    }),
    mmap: (function(stream, buffer, offset, length, position, prot, flags) {
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(ERRNO_CODES.EACCES)
        }
        if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags)
    }),
    msync: (function(stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
            return 0
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
    }),
    munmap: (function(stream) {
        return 0
    }),
    ioctl: (function(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTTY)
        }
        return stream.stream_ops.ioctl(stream, cmd, arg)
    }),
    readFile: (function(path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "r";
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0)
        } else if (opts.encoding === "binary") {
            ret = buf
        }
        FS.close(stream);
        return ret
    }),
    writeFile: (function(path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "w";
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data === "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
        } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
        } else {
            throw new Error("Unsupported data type")
        }
        FS.close(stream)
    }),
    cwd: (function() {
        return FS.currentPath
    }),
    chdir: (function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        if (lookup.node === null) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
        }
        var err = FS.nodePermissions(lookup.node, "x");
        if (err) {
            throw new FS.ErrnoError(err)
        }
        FS.currentPath = lookup.path
    }),
    createDefaultDirectories: (function() {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user")
    }),
    createDefaultDevices: (function() {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
            read: (function() {
                return 0
            }),
            write: (function(stream, buffer, offset, length, pos) {
                return length
            })
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var random_device;
        if (typeof crypto !== "undefined") {
            var randomBuffer = new Uint8Array(1);
            random_device = (function() {
                crypto.getRandomValues(randomBuffer);
                return randomBuffer[0]
            })
        } else if (ENVIRONMENT_IS_NODE) {
            random_device = (function() {
                return require("crypto")["randomBytes"](1)[0]
            })
        } else {
            random_device = (function() {
                abort("random_device")
            })
        }
        FS.createDevice("/dev", "random", random_device);
        FS.createDevice("/dev", "urandom", random_device);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp")
    }),
    createSpecialDirectories: (function() {
        FS.mkdir("/proc");
        FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount({
            mount: (function() {
                var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
                node.node_ops = {
                    lookup: (function(parent, name) {
                        var fd = +name;
                        var stream = FS.getStream(fd);
                        if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                        var ret = {
                            parent: null,
                            mount: {
                                mountpoint: "fake"
                            },
                            node_ops: {
                                readlink: (function() {
                                    return stream.path
                                })
                            }
                        };
                        ret.parent = ret;
                        return ret
                    })
                };
                return node
            })
        }, {}, "/proc/self/fd")
    }),
    createStandardStreams: (function() {
        if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdin")
        }
        if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdout")
        }
        if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"])
        } else {
            FS.symlink("/dev/tty1", "/dev/stderr")
        }
        var stdin = FS.open("/dev/stdin", "r");
        assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
        var stdout = FS.open("/dev/stdout", "w");
        assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
        var stderr = FS.open("/dev/stderr", "w");
        assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")")
    }),
    ensureErrnoError: (function() {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = (function(errno) {
                this.errno = errno;
                for (var key in ERRNO_CODES) {
                    if (ERRNO_CODES[key] === errno) {
                        this.code = key;
                        break
                    }
                }
            });
            this.setErrno(errno);
            this.message = ERRNO_MESSAGES[errno];
            if (this.stack) Object.defineProperty(this, "stack", {
                value: (new Error).stack,
                writable: true
            });
            if (this.stack) this.stack = demangleAll(this.stack)
        };
        FS.ErrnoError.prototype = new Error;
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [ERRNO_CODES.ENOENT].forEach((function(code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>"
        }))
    }),
    staticInit: (function() {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = {
            "MEMFS": MEMFS,
            "IDBFS": IDBFS,
            "NODEFS": NODEFS,
            "WORKERFS": WORKERFS
        }
    }),
    init: (function(input, output, error) {
        assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams()
    }),
    quit: (function() {
        FS.init.initialized = false;
        var fflush = Module["_fflush"];
        if (fflush) fflush(0);
        for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
                continue
            }
            FS.close(stream)
        }
    }),
    getMode: (function(canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode
    }),
    joinPath: (function(parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == "/") path = path.substr(1);
        return path
    }),
    absolutePath: (function(relative, base) {
        return PATH.resolve(base, relative)
    }),
    standardizePath: (function(path) {
        return PATH.normalize(path)
    }),
    findObject: (function(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
            return ret.object
        } else {
            ___setErrNo(ret.error);
            return null
        }
    }),
    analyzePath: (function(path, dontResolveLastLink) {
        try {
            var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            path = lookup.path
        } catch (e) {}
        var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
        };
        try {
            var lookup = FS.lookupPath(path, {
                parent: true
            });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/"
        } catch (e) {
            ret.error = e.errno
        }
        return ret
    }),
    createFolder: (function(parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode)
    }),
    createPath: (function(parent, path, canRead, canWrite) {
        parent = typeof parent === "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
                FS.mkdir(current)
            } catch (e) {}
            parent = current
        }
        return current
    }),
    createFile: (function(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode)
    }),
    createDataFile: (function(parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
            if (typeof data === "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
                data = arr
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, "w");
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode)
        }
        return node
    }),
    createDevice: (function(parent, name, input, output) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
            open: (function(stream) {
                stream.seekable = false
            }),
            close: (function(stream) {
                if (output && output.buffer && output.buffer.length) {
                    output(10)
                }
            }),
            read: (function(stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input()
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                    }
                    if (result === null || result === undefined) break;
                    bytesRead++;
                    buffer[offset + i] = result
                }
                if (bytesRead) {
                    stream.node.timestamp = Date.now()
                }
                return bytesRead
            }),
            write: (function(stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i])
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    }
                }
                if (length) {
                    stream.node.timestamp = Date.now()
                }
                return i
            })
        });
        return FS.mkdev(path, mode, dev)
    }),
    createLink: (function(parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path)
    }),
    forceLoadFile: (function(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
        } else if (Module["read"]) {
            try {
                obj.contents = intArrayFromString(Module["read"](obj.url), true);
                obj.usedBytes = obj.contents.length
            } catch (e) {
                success = false
            }
        } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.")
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success
    }),
    createLazyFile: (function(parent, name, url, canRead, canWrite) {
        function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
                return undefined
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset]
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest;
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined")
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || [])
                } else {
                    return intArrayFromString(xhr.responseText || "", true)
                }
            });
            var lazyArray = this;
            lazyArray.setDataGetter((function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end)
                }
                if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum]
            }));
            if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                console.log("LazyFiles on gzip forces download of the whole file when length is accessed")
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true
        };
        if (typeof XMLHttpRequest !== "undefined") {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array;
            Object.defineProperties(lazyArray, {
                length: {
                    get: (function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._length
                    })
                },
                chunkSize: {
                    get: (function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._chunkSize
                    })
                }
            });
            var properties = {
                isDevice: false,
                contents: lazyArray
            }
        } else {
            var properties = {
                isDevice: false,
                url: url
            }
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
            node.contents = properties.contents
        } else if (properties.url) {
            node.contents = null;
            node.url = properties.url
        }
        Object.defineProperties(node, {
            usedBytes: {
                get: (function() {
                    return this.contents.length
                })
            }
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((function(key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
                if (!FS.forceLoadFile(node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                }
                return fn.apply(null, arguments)
            }
        }));
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
            if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO)
            }
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i]
                }
            } else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i)
                }
            }
            return size
        };
        node.stream_ops = stream_ops;
        return node
    }),
    createPreloadedFile: (function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init();
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency("cp " + fullname);

        function processData(byteArray) {
            function finish(byteArray) {
                if (preFinish) preFinish();
                if (!dontCreateFile) {
                    FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
                }
                if (onload) onload();
                removeRunDependency(dep)
            }
            var handled = false;
            Module["preloadPlugins"].forEach((function(plugin) {
                if (handled) return;
                if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, (function() {
                        if (onerror) onerror();
                        removeRunDependency(dep)
                    }));
                    handled = true
                }
            }));
            if (!handled) finish(byteArray)
        }
        addRunDependency(dep);
        if (typeof url == "string") {
            Browser.asyncLoad(url, (function(byteArray) {
                processData(byteArray)
            }), onerror)
        } else {
            processData(url)
        }
    }),
    indexedDB: (function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    }),
    DB_NAME: (function() {
        return "EM_FS_" + window.location.pathname
    }),
    DB_VERSION: 20,
    DB_STORE_NAME: "FILE_DATA",
    saveFilesToDB: (function(paths, onload, onerror) {
        onload = onload || (function() {});
        onerror = onerror || (function() {});
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            console.log("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME)
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;

            function finish() {
                if (fail == 0) onload();
                else onerror()
            }
            paths.forEach((function(path) {
                var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                putRequest.onsuccess = function putRequest_onsuccess() {
                    ok++;
                    if (ok + fail == total) finish()
                };
                putRequest.onerror = function putRequest_onerror() {
                    fail++;
                    if (ok + fail == total) finish()
                }
            }));
            transaction.onerror = onerror
        };
        openRequest.onerror = onerror
    }),
    loadFilesFromDB: (function(paths, onload, onerror) {
        onload = onload || (function() {});
        onerror = onerror || (function() {});
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = onerror;
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
                var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
            } catch (e) {
                onerror(e);
                return
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;

            function finish() {
                if (fail == 0) onload();
                else onerror()
            }
            paths.forEach((function(path) {
                var getRequest = files.get(path);
                getRequest.onsuccess = function getRequest_onsuccess() {
                    if (FS.analyzePath(path).exists) {
                        FS.unlink(path)
                    }
                    FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                    ok++;
                    if (ok + fail == total) finish()
                };
                getRequest.onerror = function getRequest_onerror() {
                    fail++;
                    if (ok + fail == total) finish()
                }
            }));
            transaction.onerror = onerror
        };
        openRequest.onerror = onerror
    })
};

function _emscripten_set_main_loop_timing(mode, value) {
    Browser.mainLoop.timingMode = mode;
    Browser.mainLoop.timingValue = value;
    if (!Browser.mainLoop.func) {
        console.error("emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.");
        return 1
    }
    if (mode == 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick)
        };
        Browser.mainLoop.method = "timeout"
    } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
            Browser.requestAnimationFrame(Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "rAF"
    } else if (mode == 2) {
        if (typeof setImmediate === "undefined") {
            var setImmediates = [];
            var emscriptenMainLoopMessageId = "setimmediate";

            function Browser_setImmediate_messageHandler(event) {
                if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                    event.stopPropagation();
                    setImmediates.shift()()
                }
            }
            addEventListener("message", Browser_setImmediate_messageHandler, true);
            setImmediate = function Browser_emulated_setImmediate(func) {
                setImmediates.push(func);
                if (ENVIRONMENT_IS_WORKER) {
                    if (Module["setImmediates"] === undefined) Module["setImmediates"] = [];
                    Module["setImmediates"].push(func);
                    postMessage({
                        target: emscriptenMainLoopMessageId
                    })
                } else postMessage(emscriptenMainLoopMessageId, "*")
            }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
            setImmediate(Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "immediate"
    }
    return 0
}

function _emscripten_get_now() {
    abort()
}

function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
    Module["noExitRuntime"] = true;
    assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
    Browser.mainLoop.func = func;
    Browser.mainLoop.arg = arg;
    var browserIterationFunc;
    if (typeof arg !== "undefined") {
        browserIterationFunc = (function() {
            Module["dynCall_vi"](func, arg)
        })
    } else {
        browserIterationFunc = (function() {
            Module["dynCall_v"](func)
        })
    }
    var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
    Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
            var start = Date.now();
            var blocker = Browser.mainLoop.queue.shift();
            blocker.func(blocker.arg);
            if (Browser.mainLoop.remainingBlockers) {
                var remaining = Browser.mainLoop.remainingBlockers;
                var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
                if (blocker.counted) {
                    Browser.mainLoop.remainingBlockers = next
                } else {
                    next = next + .5;
                    Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9
                }
            }
            console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
            Browser.mainLoop.updateStatus();
            if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
            setTimeout(Browser.mainLoop.runner, 0);
            return
        }
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
            Browser.mainLoop.scheduler();
            return
        } else if (Browser.mainLoop.timingMode == 0) {
            Browser.mainLoop.tickStartTime = _emscripten_get_now()
        }
        if (Browser.mainLoop.method === "timeout" && Module.ctx) {
            err("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");
            Browser.mainLoop.method = ""
        }
        Browser.mainLoop.runIter(browserIterationFunc);
        checkStackCookie();
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
        if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
        Browser.mainLoop.scheduler()
    };
    if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
        else _emscripten_set_main_loop_timing(1, 1);
        Browser.mainLoop.scheduler()
    }
    if (simulateInfiniteLoop) {
        throw "SimulateInfiniteLoop"
    }
}
var Browser = {
    mainLoop: {
        scheduler: null,
        method: "",
        currentlyRunningMainloop: 0,
        func: null,
        arg: 0,
        timingMode: 0,
        timingValue: 0,
        currentFrameNumber: 0,
        queue: [],
        pause: (function() {
            Browser.mainLoop.scheduler = null;
            Browser.mainLoop.currentlyRunningMainloop++
        }),
        resume: (function() {
            Browser.mainLoop.currentlyRunningMainloop++;
            var timingMode = Browser.mainLoop.timingMode;
            var timingValue = Browser.mainLoop.timingValue;
            var func = Browser.mainLoop.func;
            Browser.mainLoop.func = null;
            _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true);
            _emscripten_set_main_loop_timing(timingMode, timingValue);
            Browser.mainLoop.scheduler()
        }),
        updateStatus: (function() {
            if (Module["setStatus"]) {
                var message = Module["statusMessage"] || "Please wait...";
                var remaining = Browser.mainLoop.remainingBlockers;
                var expected = Browser.mainLoop.expectedBlockers;
                if (remaining) {
                    if (remaining < expected) {
                        Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
                    } else {
                        Module["setStatus"](message)
                    }
                } else {
                    Module["setStatus"]("")
                }
            }
        }),
        runIter: (function(func) {
            if (ABORT) return;
            if (Module["preMainLoop"]) {
                var preRet = Module["preMainLoop"]();
                if (preRet === false) {
                    return
                }
            }
            try {
                func()
            } catch (e) {
                if (e instanceof ExitStatus) {
                    return
                } else {
                    if (e && typeof e === "object" && e.stack) err("exception thrown: " + [e, e.stack]);
                    throw e
                }
            }
            if (Module["postMainLoop"]) Module["postMainLoop"]()
        })
    },
    isFullscreen: false,
    pointerLock: false,
    moduleContextCreatedCallbacks: [],
    workers: [],
    init: (function() {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
        if (Browser.initted) return;
        Browser.initted = true;
        try {
            new Blob;
            Browser.hasBlobConstructor = true
        } catch (e) {
            Browser.hasBlobConstructor = false;
            console.log("warning: no blob constructor, cannot create blobs with mimetypes")
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null;
        Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
            console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
            Module.noImageDecoding = true
        }
        var imagePlugin = {};
        imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
        };
        imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
            var b = null;
            if (Browser.hasBlobConstructor) {
                try {
                    b = new Blob([byteArray], {
                        type: Browser.getMimetype(name)
                    });
                    if (b.size !== byteArray.length) {
                        b = new Blob([(new Uint8Array(byteArray)).buffer], {
                            type: Browser.getMimetype(name)
                        })
                    }
                } catch (e) {
                    warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                }
            }
            if (!b) {
                var bb = new Browser.BlobBuilder;
                bb.append((new Uint8Array(byteArray)).buffer);
                b = bb.getBlob()
            }
            var url = Browser.URLObject.createObjectURL(b);
            assert(typeof url == "string", "createObjectURL must return a url as a string");
            var img = new Image;
            img.onload = function img_onload() {
                assert(img.complete, "Image " + name + " could not be decoded");
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                Module["preloadedImages"][name] = canvas;
                Browser.URLObject.revokeObjectURL(url);
                if (onload) onload(byteArray)
            };
            img.onerror = function img_onerror(event) {
                console.log("Image " + url + " could not be decoded");
                if (onerror) onerror()
            };
            img.src = url
        };
        Module["preloadPlugins"].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
            return !Module.noAudioDecoding && name.substr(-4) in {
                ".ogg": 1,
                ".wav": 1,
                ".mp3": 1
            }
        };
        audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
            var done = false;

            function finish(audio) {
                if (done) return;
                done = true;
                Module["preloadedAudios"][name] = audio;
                if (onload) onload(byteArray)
            }

            function fail() {
                if (done) return;
                done = true;
                Module["preloadedAudios"][name] = new Audio;
                if (onerror) onerror()
            }
            if (Browser.hasBlobConstructor) {
                try {
                    var b = new Blob([byteArray], {
                        type: Browser.getMimetype(name)
                    })
                } catch (e) {
                    return fail()
                }
                var url = Browser.URLObject.createObjectURL(b);
                assert(typeof url == "string", "createObjectURL must return a url as a string");
                var audio = new Audio;
                audio.addEventListener("canplaythrough", (function() {
                    finish(audio)
                }), false);
                audio.onerror = function audio_onerror(event) {
                    if (done) return;
                    console.log("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");

                    function encode64(data) {
                        var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                        var PAD = "=";
                        var ret = "";
                        var leftchar = 0;
                        var leftbits = 0;
                        for (var i = 0; i < data.length; i++) {
                            leftchar = leftchar << 8 | data[i];
                            leftbits += 8;
                            while (leftbits >= 6) {
                                var curr = leftchar >> leftbits - 6 & 63;
                                leftbits -= 6;
                                ret += BASE[curr]
                            }
                        }
                        if (leftbits == 2) {
                            ret += BASE[(leftchar & 3) << 4];
                            ret += PAD + PAD
                        } else if (leftbits == 4) {
                            ret += BASE[(leftchar & 15) << 2];
                            ret += PAD
                        }
                        return ret
                    }
                    audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                    finish(audio)
                };
                audio.src = url;
                Browser.safeSetTimeout((function() {
                    finish(audio)
                }), 1e4)
            } else {
                return fail()
            }
        };
        Module["preloadPlugins"].push(audioPlugin);

        function pointerLockChange() {
            Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]
        }
        var canvas = Module["canvas"];
        if (canvas) {
            canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (function() {});
            canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (function() {});
            canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
            document.addEventListener("pointerlockchange", pointerLockChange, false);
            document.addEventListener("mozpointerlockchange", pointerLockChange, false);
            document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
            document.addEventListener("mspointerlockchange", pointerLockChange, false);
            if (Module["elementPointerLock"]) {
                canvas.addEventListener("click", (function(ev) {
                    if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                        Module["canvas"].requestPointerLock();
                        ev.preventDefault()
                    }
                }), false)
            }
        }
    }),
    createContext: (function(canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
        var ctx;
        var contextHandle;
        if (useWebGL) {
            var contextAttributes = {
                antialias: false,
                alpha: false
            };
            if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                    contextAttributes[attribute] = webGLContextAttributes[attribute]
                }
            }
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
                ctx = GL.getContext(contextHandle).GLctx
            }
        } else {
            ctx = canvas.getContext("2d")
        }
        if (!ctx) return null;
        if (setInModule) {
            if (!useWebGL) assert(typeof GLctx === "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
            Module.ctx = ctx;
            if (useWebGL) GL.makeContextCurrent(contextHandle);
            Module.useWebGL = useWebGL;
            Browser.moduleContextCreatedCallbacks.forEach((function(callback) {
                callback()
            }));
            Browser.init()
        }
        return ctx
    }),
    destroyContext: (function(canvas, useWebGL, setInModule) {}),
    fullscreenHandlersInstalled: false,
    lockPointer: undefined,
    resizeCanvas: undefined,
    requestFullscreen: (function(lockPointer, resizeCanvas, vrDevice) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        Browser.vrDevice = vrDevice;
        if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === "undefined") Browser.resizeCanvas = false;
        if (typeof Browser.vrDevice === "undefined") Browser.vrDevice = null;
        var canvas = Module["canvas"];

        function fullscreenChange() {
            Browser.isFullscreen = false;
            var canvasContainer = canvas.parentNode;
            if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                canvas.exitFullscreen = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (function() {});
                canvas.exitFullscreen = canvas.exitFullscreen.bind(document);
                if (Browser.lockPointer) canvas.requestPointerLock();
                Browser.isFullscreen = true;
                if (Browser.resizeCanvas) {
                    Browser.setFullscreenCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            } else {
                canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                canvasContainer.parentNode.removeChild(canvasContainer);
                if (Browser.resizeCanvas) {
                    Browser.setWindowedCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            }
            if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
            if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen)
        }
        if (!Browser.fullscreenHandlersInstalled) {
            Browser.fullscreenHandlersInstalled = true;
            document.addEventListener("fullscreenchange", fullscreenChange, false);
            document.addEventListener("mozfullscreenchange", fullscreenChange, false);
            document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
            document.addEventListener("MSFullscreenChange", fullscreenChange, false)
        }
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? (function() {
            canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])
        }) : null) || (canvasContainer["webkitRequestFullScreen"] ? (function() {
            canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
        }) : null);
        if (vrDevice) {
            canvasContainer.requestFullscreen({
                vrDisplay: vrDevice
            })
        } else {
            canvasContainer.requestFullscreen()
        }
    }),
    requestFullScreen: (function(lockPointer, resizeCanvas, vrDevice) {
        err("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead.");
        Browser.requestFullScreen = (function(lockPointer, resizeCanvas, vrDevice) {
            return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice)
        });
        return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice)
    }),
    nextRAF: 0,
    fakeRequestAnimationFrame: (function(func) {
        var now = Date.now();
        if (Browser.nextRAF === 0) {
            Browser.nextRAF = now + 1e3 / 60
        } else {
            while (now + 2 >= Browser.nextRAF) {
                Browser.nextRAF += 1e3 / 60
            }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay)
    }),
    requestAnimationFrame: function requestAnimationFrame(func) {
        if (typeof window === "undefined") {
            Browser.fakeRequestAnimationFrame(func)
        } else {
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"] || Browser.fakeRequestAnimationFrame
            }
            window.requestAnimationFrame(func)
        }
    },
    safeCallback: (function(func) {
        return (function() {
            if (!ABORT) return func.apply(null, arguments)
        })
    }),
    allowAsyncCallbacks: true,
    queuedAsyncCallbacks: [],
    pauseAsyncCallbacks: (function() {
        Browser.allowAsyncCallbacks = false
    }),
    resumeAsyncCallbacks: (function() {
        Browser.allowAsyncCallbacks = true;
        if (Browser.queuedAsyncCallbacks.length > 0) {
            var callbacks = Browser.queuedAsyncCallbacks;
            Browser.queuedAsyncCallbacks = [];
            callbacks.forEach((function(func) {
                func()
            }))
        }
    }),
    safeRequestAnimationFrame: (function(func) {
        return Browser.requestAnimationFrame((function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
                func()
            } else {
                Browser.queuedAsyncCallbacks.push(func)
            }
        }))
    }),
    safeSetTimeout: (function(func, timeout) {
        Module["noExitRuntime"] = true;
        return setTimeout((function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
                func()
            } else {
                Browser.queuedAsyncCallbacks.push(func)
            }
        }), timeout)
    }),
    safeSetInterval: (function(func, timeout) {
        Module["noExitRuntime"] = true;
        return setInterval((function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
                func()
            }
        }), timeout)
    }),
    getMimetype: (function(name) {
        return {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "bmp": "image/bmp",
            "ogg": "audio/ogg",
            "wav": "audio/wav",
            "mp3": "audio/mpeg"
        } [name.substr(name.lastIndexOf(".") + 1)]
    }),
    getUserMedia: (function(func) {
        if (!window.getUserMedia) {
            window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
        }
        window.getUserMedia(func)
    }),
    getMovementX: (function(event) {
        return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
    }),
    getMovementY: (function(event) {
        return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
    }),
    getMouseWheelDelta: (function(event) {
        var delta = 0;
        switch (event.type) {
            case "DOMMouseScroll":
                delta = event.detail;
                break;
            case "mousewheel":
                delta = event.wheelDelta;
                break;
            case "wheel":
                delta = event["deltaY"];
                break;
            default:
                throw "unrecognized mouse wheel event: " + event.type
        }
        return delta
    }),
    mouseX: 0,
    mouseY: 0,
    mouseMovementX: 0,
    mouseMovementY: 0,
    touches: {},
    lastTouches: {},
    calculateMouseEvent: (function(event) {
        if (Browser.pointerLock) {
            if (event.type != "mousemove" && "mozMovementX" in event) {
                Browser.mouseMovementX = Browser.mouseMovementY = 0
            } else {
                Browser.mouseMovementX = Browser.getMovementX(event);
                Browser.mouseMovementY = Browser.getMovementY(event)
            }
            if (typeof SDL != "undefined") {
                Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
            } else {
                Browser.mouseX += Browser.mouseMovementX;
                Browser.mouseY += Browser.mouseMovementY
            }
        } else {
            var rect = Module["canvas"].getBoundingClientRect();
            var cw = Module["canvas"].width;
            var ch = Module["canvas"].height;
            var scrollX = typeof window.scrollX !== "undefined" ? window.scrollX : window.pageXOffset;
            var scrollY = typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
            assert(typeof scrollX !== "undefined" && typeof scrollY !== "undefined", "Unable to retrieve scroll position, mouse positions likely broken.");
            if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                var touch = event.touch;
                if (touch === undefined) {
                    return
                }
                var adjustedX = touch.pageX - (scrollX + rect.left);
                var adjustedY = touch.pageY - (scrollY + rect.top);
                adjustedX = adjustedX * (cw / rect.width);
                adjustedY = adjustedY * (ch / rect.height);
                var coords = {
                    x: adjustedX,
                    y: adjustedY
                };
                if (event.type === "touchstart") {
                    Browser.lastTouches[touch.identifier] = coords;
                    Browser.touches[touch.identifier] = coords
                } else if (event.type === "touchend" || event.type === "touchmove") {
                    var last = Browser.touches[touch.identifier];
                    if (!last) last = coords;
                    Browser.lastTouches[touch.identifier] = last;
                    Browser.touches[touch.identifier] = coords
                }
                return
            }
            var x = event.pageX - (scrollX + rect.left);
            var y = event.pageY - (scrollY + rect.top);
            x = x * (cw / rect.width);
            y = y * (ch / rect.height);
            Browser.mouseMovementX = x - Browser.mouseX;
            Browser.mouseMovementY = y - Browser.mouseY;
            Browser.mouseX = x;
            Browser.mouseY = y
        }
    }),
    asyncLoad: (function(url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
        Module["readAsync"](url, (function(arrayBuffer) {
            assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
            onload(new Uint8Array(arrayBuffer));
            if (dep) removeRunDependency(dep)
        }), (function(event) {
            if (onerror) {
                onerror()
            } else {
                throw 'Loading data file "' + url + '" failed.'
            }
        }));
        if (dep) addRunDependency(dep)
    }),
    resizeListeners: [],
    updateResizeListeners: (function() {
        var canvas = Module["canvas"];
        Browser.resizeListeners.forEach((function(listener) {
            listener(canvas.width, canvas.height)
        }))
    }),
    setCanvasSize: (function(width, height, noUpdates) {
        var canvas = Module["canvas"];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners()
    }),
    windowedWidth: 0,
    windowedHeight: 0,
    setFullscreenCanvasSize: (function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >> 2];
            flags = flags | 8388608;
            HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    }),
    setWindowedCanvasSize: (function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >> 2];
            flags = flags & ~8388608;
            HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    }),
    updateCanvasDimensions: (function(canvas, wNative, hNative) {
        if (wNative && hNative) {
            canvas.widthNative = wNative;
            canvas.heightNative = hNative
        } else {
            wNative = canvas.widthNative;
            hNative = canvas.heightNative
        }
        var w = wNative;
        var h = hNative;
        if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
            if (w / h < Module["forcedAspectRatio"]) {
                w = Math.round(h * Module["forcedAspectRatio"])
            } else {
                h = Math.round(w / Module["forcedAspectRatio"])
            }
        }
        if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
            var factor = Math.min(screen.width / w, screen.height / h);
            w = Math.round(w * factor);
            h = Math.round(h * factor)
        }
        if (Browser.resizeCanvas) {
            if (canvas.width != w) canvas.width = w;
            if (canvas.height != h) canvas.height = h;
            if (typeof canvas.style != "undefined") {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height")
            }
        } else {
            if (canvas.width != wNative) canvas.width = wNative;
            if (canvas.height != hNative) canvas.height = hNative;
            if (typeof canvas.style != "undefined") {
                if (w != wNative || h != hNative) {
                    canvas.style.setProperty("width", w + "px", "important");
                    canvas.style.setProperty("height", h + "px", "important")
                } else {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height")
                }
            }
        }
    }),
    wgetRequests: {},
    nextWgetRequestHandle: 0,
    getNextWgetRequestHandle: (function() {
        var handle = Browser.nextWgetRequestHandle;
        Browser.nextWgetRequestHandle++;
        return handle
    })
};

function _SDL_GetTicks() {
    return Date.now() - SDL.startTime | 0
}

function _SDL_LockSurface(surf) {
    var surfData = SDL.surfaces[surf];
    surfData.locked++;
    if (surfData.locked > 1) return 0;
    if (!surfData.buffer) {
        surfData.buffer = _malloc(surfData.width * surfData.height * 4);
        HEAP32[surf + 20 >> 2] = surfData.buffer
    }
    HEAP32[surf + 20 >> 2] = surfData.buffer;
    if (surf == SDL.screen && Module.screenIsReadOnly && surfData.image) return 0;
    if (SDL.defaults.discardOnLock) {
        if (!surfData.image) {
            surfData.image = surfData.ctx.createImageData(surfData.width, surfData.height)
        }
        if (!SDL.defaults.opaqueFrontBuffer) return
    } else {
        surfData.image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height)
    }
    if (surf == SDL.screen && SDL.defaults.opaqueFrontBuffer) {
        var data = surfData.image.data;
        var num = data.length;
        for (var i = 0; i < num / 4; i++) {
            data[i * 4 + 3] = 255
        }
    }
    if (SDL.defaults.copyOnLock && !SDL.defaults.discardOnLock) {
        if (surfData.isFlagSet(2097152)) {
            throw "CopyOnLock is not supported for SDL_LockSurface with SDL_HWPALETTE flag set" + (new Error).stack
        } else {
            HEAPU8.set(surfData.image.data, surfData.buffer)
        }
    }
    return 0
}
var SDL = {
    defaults: {
        width: 320,
        height: 200,
        copyOnLock: false,
        discardOnLock: false,
        opaqueFrontBuffer: false
    },
    version: null,
    surfaces: {},
    canvasPool: [],
    events: [],
    fonts: [null],
    audios: [null],
    rwops: [null],
    music: {
        audio: null,
        volume: 1
    },
    mixerFrequency: 22050,
    mixerFormat: 32784,
    mixerNumChannels: 2,
    mixerChunkSize: 1024,
    channelMinimumNumber: 0,
    GL: false,
    glAttributes: {
        0: 3,
        1: 3,
        2: 2,
        3: 0,
        4: 0,
        5: 1,
        6: 16,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 1,
        16: 0,
        17: 0,
        18: 0
    },
    keyboardState: null,
    keyboardMap: {},
    canRequestFullscreen: false,
    isRequestingFullscreen: false,
    textInput: false,
    startTime: null,
    initFlags: 0,
    buttonState: 0,
    modState: 0,
    DOMButtons: [0, 0, 0],
    DOMEventToSDLEvent: {},
    TOUCH_DEFAULT_ID: 0,
    eventHandler: null,
    eventHandlerContext: null,
    eventHandlerTemp: 0,
    keyCodes: {
        16: 1249,
        17: 1248,
        18: 1250,
        20: 1081,
        33: 1099,
        34: 1102,
        35: 1101,
        36: 1098,
        37: 1104,
        38: 1106,
        39: 1103,
        40: 1105,
        44: 316,
        45: 1097,
        46: 127,
        91: 1251,
        93: 1125,
        96: 1122,
        97: 1113,
        98: 1114,
        99: 1115,
        100: 1116,
        101: 1117,
        102: 1118,
        103: 1119,
        104: 1120,
        105: 1121,
        106: 1109,
        107: 1111,
        109: 1110,
        110: 1123,
        111: 1108,
        112: 1082,
        113: 1083,
        114: 1084,
        115: 1085,
        116: 1086,
        117: 1087,
        118: 1088,
        119: 1089,
        120: 1090,
        121: 1091,
        122: 1092,
        123: 1093,
        124: 1128,
        125: 1129,
        126: 1130,
        127: 1131,
        128: 1132,
        129: 1133,
        130: 1134,
        131: 1135,
        132: 1136,
        133: 1137,
        134: 1138,
        135: 1139,
        144: 1107,
        160: 94,
        161: 33,
        162: 34,
        163: 35,
        164: 36,
        165: 37,
        166: 38,
        167: 95,
        168: 40,
        169: 41,
        170: 42,
        171: 43,
        172: 124,
        173: 45,
        174: 123,
        175: 125,
        176: 126,
        181: 127,
        182: 129,
        183: 128,
        188: 44,
        190: 46,
        191: 47,
        192: 96,
        219: 91,
        220: 92,
        221: 93,
        222: 39,
        224: 1251
    },
    scanCodes: {
        8: 42,
        9: 43,
        13: 40,
        27: 41,
        32: 44,
        35: 204,
        39: 53,
        44: 54,
        46: 55,
        47: 56,
        48: 39,
        49: 30,
        50: 31,
        51: 32,
        52: 33,
        53: 34,
        54: 35,
        55: 36,
        56: 37,
        57: 38,
        58: 203,
        59: 51,
        61: 46,
        91: 47,
        92: 49,
        93: 48,
        96: 52,
        97: 4,
        98: 5,
        99: 6,
        100: 7,
        101: 8,
        102: 9,
        103: 10,
        104: 11,
        105: 12,
        106: 13,
        107: 14,
        108: 15,
        109: 16,
        110: 17,
        111: 18,
        112: 19,
        113: 20,
        114: 21,
        115: 22,
        116: 23,
        117: 24,
        118: 25,
        119: 26,
        120: 27,
        121: 28,
        122: 29,
        127: 76,
        305: 224,
        308: 226,
        316: 70
    },
    loadRect: (function(rect) {
        return {
            x: HEAP32[rect + 0 >> 2],
            y: HEAP32[rect + 4 >> 2],
            w: HEAP32[rect + 8 >> 2],
            h: HEAP32[rect + 12 >> 2]
        }
    }),
    updateRect: (function(rect, r) {
        HEAP32[rect >> 2] = r.x;
        HEAP32[rect + 4 >> 2] = r.y;
        HEAP32[rect + 8 >> 2] = r.w;
        HEAP32[rect + 12 >> 2] = r.h
    }),
    intersectionOfRects: (function(first, second) {
        var leftX = Math.max(first.x, second.x);
        var leftY = Math.max(first.y, second.y);
        var rightX = Math.min(first.x + first.w, second.x + second.w);
        var rightY = Math.min(first.y + first.h, second.y + second.h);
        return {
            x: leftX,
            y: leftY,
            w: Math.max(leftX, rightX) - leftX,
            h: Math.max(leftY, rightY) - leftY
        }
    }),
    checkPixelFormat: (function(fmt) {
        var format = HEAP32[fmt >> 2];
        if (format != -2042224636) {
            warnOnce("Unsupported pixel format!")
        }
    }),
    loadColorToCSSRGB: (function(color) {
        var rgba = HEAP32[color >> 2];
        return "rgb(" + (rgba & 255) + "," + (rgba >> 8 & 255) + "," + (rgba >> 16 & 255) + ")"
    }),
    loadColorToCSSRGBA: (function(color) {
        var rgba = HEAP32[color >> 2];
        return "rgba(" + (rgba & 255) + "," + (rgba >> 8 & 255) + "," + (rgba >> 16 & 255) + "," + (rgba >> 24 & 255) / 255 + ")"
    }),
    translateColorToCSSRGBA: (function(rgba) {
        return "rgba(" + (rgba & 255) + "," + (rgba >> 8 & 255) + "," + (rgba >> 16 & 255) + "," + (rgba >>> 24) / 255 + ")"
    }),
    translateRGBAToCSSRGBA: (function(r, g, b, a) {
        return "rgba(" + (r & 255) + "," + (g & 255) + "," + (b & 255) + "," + (a & 255) / 255 + ")"
    }),
    translateRGBAToColor: (function(r, g, b, a) {
        return r | g << 8 | b << 16 | a << 24
    }),
    makeSurface: (function(width, height, flags, usePageCanvas, source, rmask, gmask, bmask, amask) {
        flags = flags || 0;
        var is_SDL_HWSURFACE = flags & 1;
        var is_SDL_HWPALETTE = flags & 2097152;
        var is_SDL_OPENGL = flags & 67108864;
        var surf = _malloc(60);
        var pixelFormat = _malloc(44);
        var bpp = is_SDL_HWPALETTE ? 1 : 4;
        var buffer = 0;
        if (!is_SDL_HWSURFACE && !is_SDL_OPENGL) {
            buffer = _malloc(width * height * 4)
        }
        HEAP32[surf >> 2] = flags;
        HEAP32[surf + 4 >> 2] = pixelFormat;
        HEAP32[surf + 8 >> 2] = width;
        HEAP32[surf + 12 >> 2] = height;
        HEAP32[surf + 16 >> 2] = width * bpp;
        HEAP32[surf + 20 >> 2] = buffer;
        HEAP32[surf + 36 >> 2] = 0;
        HEAP32[surf + 40 >> 2] = 0;
        HEAP32[surf + 44 >> 2] = Module["canvas"].width;
        HEAP32[surf + 48 >> 2] = Module["canvas"].height;
        HEAP32[surf + 56 >> 2] = 1;
        HEAP32[pixelFormat >> 2] = -2042224636;
        HEAP32[pixelFormat + 4 >> 2] = 0;
        HEAP8[pixelFormat + 8 >> 0] = bpp * 8;
        HEAP8[pixelFormat + 9 >> 0] = bpp;
        HEAP32[pixelFormat + 12 >> 2] = rmask || 255;
        HEAP32[pixelFormat + 16 >> 2] = gmask || 65280;
        HEAP32[pixelFormat + 20 >> 2] = bmask || 16711680;
        HEAP32[pixelFormat + 24 >> 2] = amask || 4278190080;
        SDL.GL = SDL.GL || is_SDL_OPENGL;
        var canvas;
        if (!usePageCanvas) {
            if (SDL.canvasPool.length > 0) {
                canvas = SDL.canvasPool.pop()
            } else {
                canvas = document.createElement("canvas")
            }
            canvas.width = width;
            canvas.height = height
        } else {
            canvas = Module["canvas"]
        }
        var webGLContextAttributes = {
            antialias: SDL.glAttributes[13] != 0 && SDL.glAttributes[14] > 1,
            depth: SDL.glAttributes[6] > 0,
            stencil: SDL.glAttributes[7] > 0,
            alpha: SDL.glAttributes[3] > 0
        };
        var ctx = Browser.createContext(canvas, is_SDL_OPENGL, usePageCanvas, webGLContextAttributes);
        SDL.surfaces[surf] = {
            width: width,
            height: height,
            canvas: canvas,
            ctx: ctx,
            surf: surf,
            buffer: buffer,
            pixelFormat: pixelFormat,
            alpha: 255,
            flags: flags,
            locked: 0,
            usePageCanvas: usePageCanvas,
            source: source,
            isFlagSet: (function(flag) {
                return flags & flag
            })
        };
        return surf
    }),
    copyIndexedColorData: (function(surfData, rX, rY, rW, rH) {
        if (!surfData.colors) {
            return
        }
        var fullWidth = Module["canvas"].width;
        var fullHeight = Module["canvas"].height;
        var startX = rX || 0;
        var startY = rY || 0;
        var endX = (rW || fullWidth - startX) + startX;
        var endY = (rH || fullHeight - startY) + startY;
        var buffer = surfData.buffer;
        if (!surfData.image.data32) {
            surfData.image.data32 = new Uint32Array(surfData.image.data.buffer)
        }
        var data32 = surfData.image.data32;
        var colors32 = surfData.colors32;
        for (var y = startY; y < endY; ++y) {
            var base = y * fullWidth;
            for (var x = startX; x < endX; ++x) {
                data32[base + x] = colors32[HEAPU8[buffer + base + x >> 0]]
            }
        }
    }),
    freeSurface: (function(surf) {
        var refcountPointer = surf + 56;
        var refcount = HEAP32[refcountPointer >> 2];
        if (refcount > 1) {
            HEAP32[refcountPointer >> 2] = refcount - 1;
            return
        }
        var info = SDL.surfaces[surf];
        if (!info.usePageCanvas && info.canvas) SDL.canvasPool.push(info.canvas);
        if (info.buffer) _free(info.buffer);
        _free(info.pixelFormat);
        _free(surf);
        SDL.surfaces[surf] = null;
        if (surf === SDL.screen) {
            SDL.screen = null
        }
    }),
    blitSurface: (function(src, srcrect, dst, dstrect, scale) {
        var srcData = SDL.surfaces[src];
        var dstData = SDL.surfaces[dst];
        var sr, dr;
        if (srcrect) {
            sr = SDL.loadRect(srcrect)
        } else {
            sr = {
                x: 0,
                y: 0,
                w: srcData.width,
                h: srcData.height
            }
        }
        if (dstrect) {
            dr = SDL.loadRect(dstrect)
        } else {
            dr = {
                x: 0,
                y: 0,
                w: srcData.width,
                h: srcData.height
            }
        }
        if (dstData.clipRect) {
            var widthScale = !scale || sr.w === 0 ? 1 : sr.w / dr.w;
            var heightScale = !scale || sr.h === 0 ? 1 : sr.h / dr.h;
            dr = SDL.intersectionOfRects(dstData.clipRect, dr);
            sr.w = dr.w * widthScale;
            sr.h = dr.h * heightScale;
            if (dstrect) {
                SDL.updateRect(dstrect, dr)
            }
        }
        var blitw, blith;
        if (scale) {
            blitw = dr.w;
            blith = dr.h
        } else {
            blitw = sr.w;
            blith = sr.h
        }
        if (sr.w === 0 || sr.h === 0 || blitw === 0 || blith === 0) {
            return 0
        }
        var oldAlpha = dstData.ctx.globalAlpha;
        dstData.ctx.globalAlpha = srcData.alpha / 255;
        dstData.ctx.drawImage(srcData.canvas, sr.x, sr.y, sr.w, sr.h, dr.x, dr.y, blitw, blith);
        dstData.ctx.globalAlpha = oldAlpha;
        if (dst != SDL.screen) {
            warnOnce("WARNING: copying canvas data to memory for compatibility");
            _SDL_LockSurface(dst);
            dstData.locked--
        }
        return 0
    }),
    downFingers: {},
    savedKeydown: null,
    receiveEvent: (function(event) {
        function unpressAllPressedKeys() {
            for (var code in SDL.keyboardMap) {
                SDL.events.push({
                    type: "keyup",
                    keyCode: SDL.keyboardMap[code]
                })
            }
        }
        switch (event.type) {
            case "touchstart":
            case "touchmove": {
                event.preventDefault();
                var touches = [];
                if (event.type === "touchstart") {
                    for (var i = 0; i < event.touches.length; i++) {
                        var touch = event.touches[i];
                        if (SDL.downFingers[touch.identifier] != true) {
                            SDL.downFingers[touch.identifier] = true;
                            touches.push(touch)
                        }
                    }
                } else {
                    touches = event.touches
                }
                var firstTouch = touches[0];
                if (firstTouch) {
                    if (event.type == "touchstart") {
                        SDL.DOMButtons[0] = 1
                    }
                    var mouseEventType;
                    switch (event.type) {
                        case "touchstart":
                            mouseEventType = "mousedown";
                            break;
                        case "touchmove":
                            mouseEventType = "mousemove";
                            break
                    }
                    var mouseEvent = {
                        type: mouseEventType,
                        button: 0,
                        pageX: firstTouch.clientX,
                        pageY: firstTouch.clientY
                    };
                    SDL.events.push(mouseEvent)
                }
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    SDL.events.push({
                        type: event.type,
                        touch: touch
                    })
                }
                break
            };
            case "touchend": {
                event.preventDefault();
                for (var i = 0; i < event.changedTouches.length; i++) {
                    var touch = event.changedTouches[i];
                    if (SDL.downFingers[touch.identifier] === true) {
                        delete SDL.downFingers[touch.identifier]
                    }
                }
                var mouseEvent = {
                    type: "mouseup",
                    button: 0,
                    pageX: event.changedTouches[0].clientX,
                    pageY: event.changedTouches[0].clientY
                };
                SDL.DOMButtons[0] = 0;
                SDL.events.push(mouseEvent);
                for (var i = 0; i < event.changedTouches.length; i++) {
                    var touch = event.changedTouches[i];
                    SDL.events.push({
                        type: "touchend",
                        touch: touch
                    })
                }
                break
            };
            case "DOMMouseScroll":
            case "mousewheel":
            case "wheel":
                var delta = -Browser.getMouseWheelDelta(event);
                delta = delta == 0 ? 0 : delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1);
                var button = delta > 0 ? 3 : 4;
                SDL.events.push({
                    type: "mousedown",
                    button: button,
                    pageX: event.pageX,
                    pageY: event.pageY
                });
                SDL.events.push({
                    type: "mouseup",
                    button: button,
                    pageX: event.pageX,
                    pageY: event.pageY
                });
                SDL.events.push({
                    type: "wheel",
                    deltaX: 0,
                    deltaY: delta
                });
                event.preventDefault();
                break;
            case "mousemove":
                if (SDL.DOMButtons[0] === 1) {
                    SDL.events.push({
                        type: "touchmove",
                        touch: {
                            identifier: 0,
                            deviceID: -1,
                            pageX: event.pageX,
                            pageY: event.pageY
                        }
                    })
                }
                if (Browser.pointerLock) {
                    if ("mozMovementX" in event) {
                        event["movementX"] = event["mozMovementX"];
                        event["movementY"] = event["mozMovementY"]
                    }
                    if (event["movementX"] == 0 && event["movementY"] == 0) {
                        event.preventDefault();
                        return
                    }
                };
            case "keydown":
            case "keyup":
            case "keypress":
            case "mousedown":
            case "mouseup":
                if (event.type !== "keydown" || !SDL.unicode && !SDL.textInput || event.keyCode === 8 || event.keyCode === 9) {
                    event.preventDefault()
                }
                if (event.type == "mousedown") {
                    SDL.DOMButtons[event.button] = 1;
                    SDL.events.push({
                        type: "touchstart",
                        touch: {
                            identifier: 0,
                            deviceID: -1,
                            pageX: event.pageX,
                            pageY: event.pageY
                        }
                    })
                } else if (event.type == "mouseup") {
                    if (!SDL.DOMButtons[event.button]) {
                        return
                    }
                    SDL.events.push({
                        type: "touchend",
                        touch: {
                            identifier: 0,
                            deviceID: -1,
                            pageX: event.pageX,
                            pageY: event.pageY
                        }
                    });
                    SDL.DOMButtons[event.button] = 0
                }
                if (event.type === "keydown" || event.type === "mousedown") {
                    SDL.canRequestFullscreen = true
                } else if (event.type === "keyup" || event.type === "mouseup") {
                    if (SDL.isRequestingFullscreen) {
                        Module["requestFullscreen"](true, true);
                        SDL.isRequestingFullscreen = false
                    }
                    SDL.canRequestFullscreen = false
                }
                if (event.type === "keypress" && SDL.savedKeydown) {
                    SDL.savedKeydown.keypressCharCode = event.charCode;
                    SDL.savedKeydown = null
                } else if (event.type === "keydown") {
                    SDL.savedKeydown = event
                }
                if (event.type !== "keypress" || SDL.textInput) {
                    SDL.events.push(event)
                }
                break;
            case "mouseout":
                for (var i = 0; i < 3; i++) {
                    if (SDL.DOMButtons[i]) {
                        SDL.events.push({
                            type: "mouseup",
                            button: i,
                            pageX: event.pageX,
                            pageY: event.pageY
                        });
                        SDL.DOMButtons[i] = 0
                    }
                }
                event.preventDefault();
                break;
            case "focus":
                SDL.events.push(event);
                event.preventDefault();
                break;
            case "blur":
                SDL.events.push(event);
                unpressAllPressedKeys();
                event.preventDefault();
                break;
            case "visibilitychange":
                SDL.events.push({
                    type: "visibilitychange",
                    visible: !document.hidden
                });
                unpressAllPressedKeys();
                event.preventDefault();
                break;
            case "unload":
                if (Browser.mainLoop.runner) {
                    SDL.events.push(event);
                    Browser.mainLoop.runner()
                }
                return;
            case "resize":
                SDL.events.push(event);
                if (event.preventDefault) {
                    event.preventDefault()
                }
                break
        }
        if (SDL.events.length >= 1e4) {
            err("SDL event queue full, dropping events");
            SDL.events = SDL.events.slice(0, 1e4)
        }
        SDL.flushEventsToHandler();
        return
    }),
    lookupKeyCodeForEvent: (function(event) {
        var code = event.keyCode;
        if (code >= 65 && code <= 90) {
            code += 32
        } else {
            code = SDL.keyCodes[event.keyCode] || event.keyCode;
            if (event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT && code >= (224 | 1 << 10) && code <= (227 | 1 << 10)) {
                code += 4
            }
        }
        return code
    }),
    handleEvent: (function(event) {
        if (event.handled) return;
        event.handled = true;
        switch (event.type) {
            case "touchstart":
            case "touchend":
            case "touchmove": {
                Browser.calculateMouseEvent(event);
                break
            };
            case "keydown":
            case "keyup": {
                var down = event.type === "keydown";
                var code = SDL.lookupKeyCodeForEvent(event);
                HEAP8[SDL.keyboardState + code >> 0] = down;
                SDL.modState = (HEAP8[SDL.keyboardState + 1248 >> 0] ? 64 : 0) | (HEAP8[SDL.keyboardState + 1249 >> 0] ? 1 : 0) | (HEAP8[SDL.keyboardState + 1250 >> 0] ? 256 : 0) | (HEAP8[SDL.keyboardState + 1252 >> 0] ? 128 : 0) | (HEAP8[SDL.keyboardState + 1253 >> 0] ? 2 : 0) | (HEAP8[SDL.keyboardState + 1254 >> 0] ? 512 : 0);
                if (down) {
                    SDL.keyboardMap[code] = event.keyCode
                } else {
                    delete SDL.keyboardMap[code]
                }
                break
            };
            case "mousedown":
            case "mouseup":
                if (event.type == "mousedown") {
                    SDL.buttonState |= 1 << event.button
                } else if (event.type == "mouseup") {
                    SDL.buttonState &= ~(1 << event.button)
                };
            case "mousemove": {
                Browser.calculateMouseEvent(event);
                break
            }
        }
    }),
    flushEventsToHandler: (function() {
        if (!SDL.eventHandler) return;
        while (SDL.pollEvent(SDL.eventHandlerTemp)) {
            Module["dynCall_iii"](SDL.eventHandler, SDL.eventHandlerContext, SDL.eventHandlerTemp)
        }
    }),
    pollEvent: (function(ptr) {
        if (SDL.initFlags & 512 && SDL.joystickEventState) {
            SDL.queryJoysticks()
        }
        if (ptr) {
            while (SDL.events.length > 0) {
                if (SDL.makeCEvent(SDL.events.shift(), ptr) !== false) return 1
            }
            return 0
        } else {
            return SDL.events.length > 0
        }
    }),
    makeCEvent: (function(event, ptr) {
        if (typeof event === "number") {
            _memcpy(ptr, event, 28);
            _free(event);
            return
        }
        SDL.handleEvent(event);
        switch (event.type) {
            case "keydown":
            case "keyup": {
                var down = event.type === "keydown";
                var key = SDL.lookupKeyCodeForEvent(event);
                var scan;
                if (key >= 1024) {
                    scan = key - 1024
                } else {
                    scan = SDL.scanCodes[key] || key
                }
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                HEAP8[ptr + 8 >> 0] = down ? 1 : 0;
                HEAP8[ptr + 9 >> 0] = 0;
                HEAP32[ptr + 12 >> 2] = scan;
                HEAP32[ptr + 16 >> 2] = key;
                HEAP16[ptr + 20 >> 1] = SDL.modState;
                HEAP32[ptr + 24 >> 2] = event.keypressCharCode || key;
                break
            };
            case "keypress": {
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                var cStr = intArrayFromString(String.fromCharCode(event.charCode));
                for (var i = 0; i < cStr.length; ++i) {
                    HEAP8[ptr + (8 + i) >> 0] = cStr[i]
                }
                break
            };
            case "mousedown":
            case "mouseup":
            case "mousemove": {
                if (event.type != "mousemove") {
                    var down = event.type === "mousedown";
                    HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                    HEAP32[ptr + 4 >> 2] = 0;
                    HEAP32[ptr + 8 >> 2] = 0;
                    HEAP32[ptr + 12 >> 2] = 0;
                    HEAP8[ptr + 16 >> 0] = event.button + 1;
                    HEAP8[ptr + 17 >> 0] = down ? 1 : 0;
                    HEAP32[ptr + 20 >> 2] = Browser.mouseX;
                    HEAP32[ptr + 24 >> 2] = Browser.mouseY
                } else {
                    HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                    HEAP32[ptr + 4 >> 2] = 0;
                    HEAP32[ptr + 8 >> 2] = 0;
                    HEAP32[ptr + 12 >> 2] = 0;
                    HEAP32[ptr + 16 >> 2] = SDL.buttonState;
                    HEAP32[ptr + 20 >> 2] = Browser.mouseX;
                    HEAP32[ptr + 24 >> 2] = Browser.mouseY;
                    HEAP32[ptr + 28 >> 2] = Browser.mouseMovementX;
                    HEAP32[ptr + 32 >> 2] = Browser.mouseMovementY
                }
                break
            };
            case "wheel": {
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                HEAP32[ptr + 16 >> 2] = event.deltaX;
                HEAP32[ptr + 20 >> 2] = event.deltaY;
                break
            };
            case "touchstart":
            case "touchend":
            case "touchmove": {
                var touch = event.touch;
                if (!Browser.touches[touch.identifier]) break;
                var w = Module["canvas"].width;
                var h = Module["canvas"].height;
                var x = Browser.touches[touch.identifier].x / w;
                var y = Browser.touches[touch.identifier].y / h;
                var lx = Browser.lastTouches[touch.identifier].x / w;
                var ly = Browser.lastTouches[touch.identifier].y / h;
                var dx = x - lx;
                var dy = y - ly;
                if (touch["deviceID"] === undefined) touch.deviceID = SDL.TOUCH_DEFAULT_ID;
                if (dx === 0 && dy === 0 && event.type === "touchmove") return false;
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                HEAP32[ptr + 4 >> 2] = _SDL_GetTicks();
                tempI64 = [touch.deviceID >>> 0, (tempDouble = touch.deviceID, +Math_abs(tempDouble) >= +1 ? tempDouble > +0 ? (Math_min(+Math_floor(tempDouble / +4294967296), +4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / +4294967296) >>> 0 : 0)], HEAP32[ptr + 8 >> 2] = tempI64[0], HEAP32[ptr + 12 >> 2] = tempI64[1];
                tempI64 = [touch.identifier >>> 0, (tempDouble = touch.identifier, +Math_abs(tempDouble) >= +1 ? tempDouble > +0 ? (Math_min(+Math_floor(tempDouble / +4294967296), +4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / +4294967296) >>> 0 : 0)], HEAP32[ptr + 16 >> 2] = tempI64[0], HEAP32[ptr + 20 >> 2] = tempI64[1];
                HEAPF32[ptr + 24 >> 2] = x;
                HEAPF32[ptr + 28 >> 2] = y;
                HEAPF32[ptr + 32 >> 2] = dx;
                HEAPF32[ptr + 36 >> 2] = dy;
                if (touch.force !== undefined) {
                    HEAPF32[ptr + 40 >> 2] = touch.force
                } else {
                    HEAPF32[ptr + 40 >> 2] = event.type == "touchend" ? 0 : 1
                }
                break
            };
            case "unload": {
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                break
            };
            case "resize": {
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                HEAP32[ptr + 4 >> 2] = event.w;
                HEAP32[ptr + 8 >> 2] = event.h;
                break
            };
            case "joystick_button_up":
            case "joystick_button_down": {
                var state = event.type === "joystick_button_up" ? 0 : 1;
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                HEAP8[ptr + 4 >> 0] = event.index;
                HEAP8[ptr + 5 >> 0] = event.button;
                HEAP8[ptr + 6 >> 0] = state;
                break
            };
            case "joystick_axis_motion": {
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                HEAP8[ptr + 4 >> 0] = event.index;
                HEAP8[ptr + 5 >> 0] = event.axis;
                HEAP32[ptr + 8 >> 2] = SDL.joystickAxisValueConversion(event.value);
                break
            };
            case "focus": {
                var SDL_WINDOWEVENT_FOCUS_GAINED = 12;
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                HEAP32[ptr + 4 >> 2] = 0;
                HEAP8[ptr + 8 >> 0] = SDL_WINDOWEVENT_FOCUS_GAINED;
                break
            };
            case "blur": {
                var SDL_WINDOWEVENT_FOCUS_LOST = 13;
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                HEAP32[ptr + 4 >> 2] = 0;
                HEAP8[ptr + 8 >> 0] = SDL_WINDOWEVENT_FOCUS_LOST;
                break
            };
            case "visibilitychange": {
                var SDL_WINDOWEVENT_SHOWN = 1;
                var SDL_WINDOWEVENT_HIDDEN = 2;
                var visibilityEventID = event.visible ? SDL_WINDOWEVENT_SHOWN : SDL_WINDOWEVENT_HIDDEN;
                HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
                HEAP32[ptr + 4 >> 2] = 0;
                HEAP8[ptr + 8 >> 0] = visibilityEventID;
                break
            };
            default:
                throw "Unhandled SDL event: " + event.type
        }
    }),
    makeFontString: (function(height, fontName) {
        if (fontName.charAt(0) != "'" && fontName.charAt(0) != '"') {
            fontName = '"' + fontName + '"'
        }
        return height + "px " + fontName + ", serif"
    }),
    estimateTextWidth: (function(fontData, text) {
        var h = fontData.size;
        var fontString = SDL.makeFontString(h, fontData.name);
        var tempCtx = SDL.ttfContext;
        assert(tempCtx, "TTF_Init must have been called");
        tempCtx.save();
        tempCtx.font = fontString;
        var ret = tempCtx.measureText(text).width | 0;
        tempCtx.restore();
        return ret
    }),
    allocateChannels: (function(num) {
        if (SDL.numChannels && SDL.numChannels >= num && num != 0) return;
        SDL.numChannels = num;
        SDL.channels = [];
        for (var i = 0; i < num; i++) {
            SDL.channels[i] = {
                audio: null,
                volume: 1
            }
        }
    }),
    setGetVolume: (function(info, volume) {
        if (!info) return 0;
        var ret = info.volume * 128;
        if (volume != -1) {
            info.volume = Math.min(Math.max(volume, 0), 128) / 128;
            if (info.audio) {
                try {
                    info.audio.volume = info.volume;
                    if (info.audio.webAudioGainNode) info.audio.webAudioGainNode["gain"]["value"] = info.volume
                } catch (e) {
                    err("setGetVolume failed to set audio volume: " + e)
                }
            }
        }
        return ret
    }),
    setPannerPosition: (function(info, x, y, z) {
        if (!info) return;
        if (info.audio) {
            if (info.audio.webAudioPannerNode) {
                info.audio.webAudioPannerNode["setPosition"](x, y, z)
            }
        }
    }),
    playWebAudio: (function(audio) {
        if (!audio) return;
        if (audio.webAudioNode) return;
        if (!SDL.webAudioAvailable()) return;
        try {
            var webAudio = audio.resource.webAudio;
            audio.paused = false;
            if (!webAudio.decodedBuffer) {
                if (webAudio.onDecodeComplete === undefined) abort("Cannot play back audio object that was not loaded");
                webAudio.onDecodeComplete.push((function() {
                    if (!audio.paused) SDL.playWebAudio(audio)
                }));
                return
            }
            audio.webAudioNode = SDL.audioContext["createBufferSource"]();
            audio.webAudioNode["buffer"] = webAudio.decodedBuffer;
            audio.webAudioNode["loop"] = audio.loop;
            audio.webAudioNode["onended"] = (function() {
                audio["onended"]()
            });
            audio.webAudioPannerNode = SDL.audioContext["createPanner"]();
            audio.webAudioPannerNode["setPosition"](0, 0, -.5);
            audio.webAudioPannerNode["panningModel"] = "equalpower";
            audio.webAudioGainNode = SDL.audioContext["createGain"]();
            audio.webAudioGainNode["gain"]["value"] = audio.volume;
            audio.webAudioNode["connect"](audio.webAudioPannerNode);
            audio.webAudioPannerNode["connect"](audio.webAudioGainNode);
            audio.webAudioGainNode["connect"](SDL.audioContext["destination"]);
            audio.webAudioNode["start"](0, audio.currentPosition);
            audio.startTime = SDL.audioContext["currentTime"] - audio.currentPosition
        } catch (e) {
            err("playWebAudio failed: " + e)
        }
    }),
    pauseWebAudio: (function(audio) {
        if (!audio) return;
        if (audio.webAudioNode) {
            try {
                audio.currentPosition = (SDL.audioContext["currentTime"] - audio.startTime) % audio.resource.webAudio.decodedBuffer.duration;
                audio.webAudioNode["onended"] = undefined;
                audio.webAudioNode.stop(0);
                audio.webAudioNode = undefined
            } catch (e) {
                err("pauseWebAudio failed: " + e)
            }
        }
        audio.paused = true
    }),
    openAudioContext: (function() {
        if (!SDL.audioContext) {
            if (typeof AudioContext !== "undefined") SDL.audioContext = new AudioContext;
            else if (typeof webkitAudioContext !== "undefined") SDL.audioContext = new webkitAudioContext
        }
    }),
    webAudioAvailable: (function() {
        return !!SDL.audioContext
    }),
    fillWebAudioBufferFromHeap: (function(heapPtr, sizeSamplesPerChannel, dstAudioBuffer) {
        var numChannels = SDL.audio.channels;
        for (var c = 0; c < numChannels; ++c) {
            var channelData = dstAudioBuffer["getChannelData"](c);
            if (channelData.length != sizeSamplesPerChannel) {
                throw "Web Audio output buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + sizeSamplesPerChannel + " samples!"
            }
            if (SDL.audio.format == 32784) {
                for (var j = 0; j < sizeSamplesPerChannel; ++j) {
                    channelData[j] = HEAP16[heapPtr + (j * numChannels + c) * 2 >> 1] / 32768
                }
            } else if (SDL.audio.format == 8) {
                for (var j = 0; j < sizeSamplesPerChannel; ++j) {
                    var v = HEAP8[heapPtr + (j * numChannels + c) >> 0];
                    channelData[j] = (v >= 0 ? v - 128 : v + 128) / 128
                }
            } else if (SDL.audio.format == 33056) {
                for (var j = 0; j < sizeSamplesPerChannel; ++j) {
                    channelData[j] = HEAPF32[heapPtr + (j * numChannels + c) * 4 >> 2]
                }
            } else {
                throw "Invalid SDL audio format " + SDL.audio.format + "!"
            }
        }
    }),
    debugSurface: (function(surfData) {
        console.log("dumping surface " + [surfData.surf, surfData.source, surfData.width, surfData.height]);
        var image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
        var data = image.data;
        var num = Math.min(surfData.width, surfData.height);
        for (var i = 0; i < num; i++) {
            console.log("   diagonal " + i + ":" + [data[i * surfData.width * 4 + i * 4 + 0], data[i * surfData.width * 4 + i * 4 + 1], data[i * surfData.width * 4 + i * 4 + 2], data[i * surfData.width * 4 + i * 4 + 3]])
        }
    }),
    joystickEventState: 1,
    lastJoystickState: {},
    joystickNamePool: {},
    recordJoystickState: (function(joystick, state) {
        var buttons = new Array(state.buttons.length);
        for (var i = 0; i < state.buttons.length; i++) {
            buttons[i] = SDL.getJoystickButtonState(state.buttons[i])
        }
        SDL.lastJoystickState[joystick] = {
            buttons: buttons,
            axes: state.axes.slice(0),
            timestamp: state.timestamp,
            index: state.index,
            id: state.id
        }
    }),
    getJoystickButtonState: (function(button) {
        if (typeof button === "object") {
            return button["pressed"]
        } else {
            return button > 0
        }
    }),
    queryJoysticks: (function() {
        for (var joystick in SDL.lastJoystickState) {
            var state = SDL.getGamepad(joystick - 1);
            var prevState = SDL.lastJoystickState[joystick];
            if (typeof state === "undefined") return;
            if (state === null) return;
            if (typeof state.timestamp !== "number" || state.timestamp !== prevState.timestamp || !state.timestamp) {
                var i;
                for (i = 0; i < state.buttons.length; i++) {
                    var buttonState = SDL.getJoystickButtonState(state.buttons[i]);
                    if (buttonState !== prevState.buttons[i]) {
                        SDL.events.push({
                            type: buttonState ? "joystick_button_down" : "joystick_button_up",
                            joystick: joystick,
                            index: joystick - 1,
                            button: i
                        })
                    }
                }
                for (i = 0; i < state.axes.length; i++) {
                    if (state.axes[i] !== prevState.axes[i]) {
                        SDL.events.push({
                            type: "joystick_axis_motion",
                            joystick: joystick,
                            index: joystick - 1,
                            axis: i,
                            value: state.axes[i]
                        })
                    }
                }
                SDL.recordJoystickState(joystick, state)
            }
        }
    }),
    joystickAxisValueConversion: (function(value) {
        value = Math.min(1, Math.max(value, -1));
        return Math.ceil((value + 1) * 32767.5 - 32768)
    }),
    getGamepads: (function() {
        var fcn = navigator.getGamepads || navigator.webkitGamepads || navigator.mozGamepads || navigator.gamepads || navigator.webkitGetGamepads;
        if (fcn !== undefined) {
            return fcn.apply(navigator)
        } else {
            return []
        }
    }),
    getGamepad: (function(deviceIndex) {
        var gamepads = SDL.getGamepads();
        if (gamepads.length > deviceIndex && deviceIndex >= 0) {
            return gamepads[deviceIndex]
        }
        return null
    })
};

function _Mix_FreeChunk(id) {
    SDL.audios[id] = null
}

function _Mix_GroupAvailable() {}

function _Mix_GroupOldest() {}

function _Mix_LoadWAV_RW(rwopsID, freesrc) {
    var rwops = SDL.rwops[rwopsID];
    if (rwops === undefined) return 0;
    var filename = "";
    var audio;
    var webAudio;
    var bytes;
    if (rwops.filename !== undefined) {
        filename = PATH.resolve(rwops.filename);
        var raw = Module["preloadedAudios"][filename];
        if (!raw) {
            if (raw === null) err("Trying to reuse preloaded audio, but freePreloadedMediaOnUse is set!");
            if (!Module.noAudioDecoding) warnOnce("Cannot find preloaded audio " + filename);
            try {
                bytes = FS.readFile(filename)
            } catch (e) {
                err("Couldn't find file for: " + filename);
                return 0
            }
        }
        if (Module["freePreloadedMediaOnUse"]) {
            Module["preloadedAudios"][filename] = null
        }
        audio = raw
    } else if (rwops.bytes !== undefined) {
        if (SDL.webAudioAvailable()) bytes = HEAPU8.buffer.slice(rwops.bytes, rwops.bytes + rwops.count);
        else bytes = HEAPU8.subarray(rwops.bytes, rwops.bytes + rwops.count)
    } else {
        return 0
    }
    var arrayBuffer = bytes ? bytes.buffer || bytes : bytes;
    var canPlayWithWebAudio = Module["SDL_canPlayWithWebAudio"] === undefined || Module["SDL_canPlayWithWebAudio"](filename, arrayBuffer);
    if (bytes !== undefined && SDL.webAudioAvailable() && canPlayWithWebAudio) {
        audio = undefined;
        webAudio = {};
        webAudio.onDecodeComplete = [];

        function onDecodeComplete(data) {
            webAudio.decodedBuffer = data;
            webAudio.onDecodeComplete.forEach((function(e) {
                e()
            }));
            webAudio.onDecodeComplete = undefined
        }
        SDL.audioContext["decodeAudioData"](arrayBuffer, onDecodeComplete)
    } else if (audio === undefined && bytes) {
        var blob = new Blob([bytes], {
            type: rwops.mimetype
        });
        var url = URL.createObjectURL(blob);
        audio = new Audio;
        audio.src = url;
        audio.mozAudioChannelType = "content"
    }
    var id = SDL.audios.length;
    SDL.audios.push({
        source: filename,
        audio: audio,
        webAudio: webAudio
    });
    return id
}

function _Mix_PlayChannel(channel, id, loops) {
    var info = SDL.audios[id];
    if (!info) return -1;
    if (!info.audio && !info.webAudio) return -1;
    if (channel == -1) {
        for (var i = SDL.channelMinimumNumber; i < SDL.numChannels; i++) {
            if (!SDL.channels[i].audio) {
                channel = i;
                break
            }
        }
        if (channel == -1) {
            err("All " + SDL.numChannels + " channels in use!");
            return -1
        }
    }
    var channelInfo = SDL.channels[channel];
    var audio;
    if (info.webAudio) {
        audio = {};
        audio.resource = info;
        audio.paused = false;
        audio.currentPosition = 0;
        audio.play = (function() {
            SDL.playWebAudio(this)
        });
        audio.pause = (function() {
            SDL.pauseWebAudio(this)
        })
    } else {
        audio = info.audio.cloneNode(true);
        audio.numChannels = info.audio.numChannels;
        audio.frequency = info.audio.frequency
    }
    audio["onended"] = function SDL_audio_onended() {
        if (channelInfo.audio == this) {
            channelInfo.audio.paused = true;
            channelInfo.audio = null
        }
        if (SDL.channelFinished) getFuncWrapper(SDL.channelFinished, "vi")(channel)
    };
    channelInfo.audio = audio;
    audio.loop = loops != 0;
    audio.volume = channelInfo.volume;
    audio.play();
    return channel
}

function _Mix_PlayChannelTimed() {
    return _Mix_PlayChannel.apply(null, arguments)
}

function _Mix_SetPanning(channel, left, right) {
    left /= 255;
    right /= 255;
    SDL.setPannerPosition(SDL.channels[channel], right - left, 0, .1);
    return 1
}

function _SDL_ConvertSurface(surf, format, flags) {
    if (format) {
        SDL.checkPixelFormat(format)
    }
    var oldData = SDL.surfaces[surf];
    var ret = SDL.makeSurface(oldData.width, oldData.height, oldData.flags, false, "copy:" + oldData.source);
    var newData = SDL.surfaces[ret];
    newData.ctx.globalCompositeOperation = "copy";
    newData.ctx.drawImage(oldData.canvas, 0, 0);
    newData.ctx.globalCompositeOperation = oldData.ctx.globalCompositeOperation;
    return ret
}

function _SDL_CreateRGBSurface(flags, width, height, depth, rmask, gmask, bmask, amask) {
    return SDL.makeSurface(width, height, flags, false, "CreateRGBSurface", rmask, gmask, bmask, amask)
}
var EmterpreterAsync = {
    initted: false,
    state: 0,
    saveStack: "",
    yieldCallbacks: [],
    postAsync: null,
    restartFunc: null,
    asyncFinalizers: [],
    ensureInit: (function() {
        if (this.initted) return;
        this.initted = true;
        abortDecorators.push((function(output, what) {
            if (EmterpreterAsync.state === 1 || EmterpreterAsync.state === 2) {
                return output + "\nThis error happened during an emterpreter-async operation. Was there non-emterpreted code on the stack during save (which is unallowed)? If so, you may want to adjust EMTERPRETIFY_BLACKLIST, EMTERPRETIFY_WHITELIST. For reference, this is what the stack looked like when we tried to save it: " + [EmterpreterAsync.state, EmterpreterAsync.saveStack]
            }
            return output
        }))
    }),
    setState: (function(s) {
        this.ensureInit();
        this.state = s;
        Module["setAsyncState"](s)
    }),
    handle: (function(doAsyncOp, yieldDuring) {
        Module["noExitRuntime"] = true;
        if (EmterpreterAsync.state === 0) {
            var stack = new Int32Array(HEAP32.subarray(EMTSTACKTOP >> 2, Module["emtStackSave"]() >> 2));
            var stacktop = Module["stackSave"]();
            var resumedCallbacksForYield = false;

            function resumeCallbacksForYield() {
                if (resumedCallbacksForYield) return;
                resumedCallbacksForYield = true;
                EmterpreterAsync.yieldCallbacks.forEach((function(func) {
                    func()
                }));
                Browser.resumeAsyncCallbacks()
            }
            var callingDoAsyncOp = 1;
            doAsyncOp(function resume(post) {
                if (ABORT) {
                    return
                }
                if (callingDoAsyncOp) {
                    assert(callingDoAsyncOp === 1);
                    callingDoAsyncOp++;
                    setTimeout((function() {
                        resume(post)
                    }), 0);
                    return
                }
                assert(EmterpreterAsync.state === 1 || EmterpreterAsync.state === 3);
                EmterpreterAsync.setState(3);
                if (yieldDuring) {
                    resumeCallbacksForYield()
                }
                HEAP32.set(stack, EMTSTACKTOP >> 2);
                assert(stacktop === Module["stackSave"]());
                EmterpreterAsync.setState(2);
                if (Browser.mainLoop.func) {
                    Browser.mainLoop.resume()
                }
                assert(!EmterpreterAsync.postAsync);
                EmterpreterAsync.postAsync = post || null;
                var asyncReturnValue;
                if (!EmterpreterAsync.restartFunc) {
                    Module["emterpret"](stack[0])
                } else {
                    asyncReturnValue = EmterpreterAsync.restartFunc()
                }
                if (!yieldDuring && EmterpreterAsync.state === 0) {
                    Browser.resumeAsyncCallbacks()
                }
                if (EmterpreterAsync.state === 0) {
                    EmterpreterAsync.restartFunc = null;
                    var asyncFinalizers = EmterpreterAsync.asyncFinalizers;
                    EmterpreterAsync.asyncFinalizers = [];
                    asyncFinalizers.forEach((function(func) {
                        func(asyncReturnValue)
                    }))
                }
            });
            callingDoAsyncOp = 0;
            EmterpreterAsync.setState(1);
            EmterpreterAsync.saveStack = (new Error).stack;
            if (Browser.mainLoop.func) {
                Browser.mainLoop.pause()
            }
            if (yieldDuring) {
                setTimeout((function() {
                    resumeCallbacksForYield()
                }), 0)
            } else {
                Browser.pauseAsyncCallbacks()
            }
        } else {
            assert(EmterpreterAsync.state === 2);
            EmterpreterAsync.setState(0);
            if (EmterpreterAsync.postAsync) {
                var ret = EmterpreterAsync.postAsync();
                EmterpreterAsync.postAsync = null;
                return ret
            }
        }
    })
};

function _emscripten_sleep(ms) {
    EmterpreterAsync.handle((function(resume) {
        setTimeout((function() {
            resume()
        }), ms)
    }))
}

function _SDL_Delay(delay) {
    _emscripten_sleep(delay)
}

function _SDL_EventState() {}

function _SDL_FillRect(surf, rect, color) {
    var surfData = SDL.surfaces[surf];
    assert(!surfData.locked);
    if (surfData.isFlagSet(2097152)) {
        color = surfData.colors32[color]
    }
    var r = rect ? SDL.loadRect(rect) : {
        x: 0,
        y: 0,
        w: surfData.width,
        h: surfData.height
    };
    if (surfData.clipRect) {
        r = SDL.intersectionOfRects(surfData.clipRect, r);
        if (rect) {
            SDL.updateRect(rect, r)
        }
    }
    surfData.ctx.save();
    surfData.ctx.fillStyle = SDL.translateColorToCSSRGBA(color);
    surfData.ctx.fillRect(r.x, r.y, r.w, r.h);
    surfData.ctx.restore();
    return 0
}

function _SDL_Flip(surf) {}

function _SDL_FreeSurface(surf) {
    if (surf) SDL.freeSurface(surf)
}

function _SDL_GetError() {
    if (!SDL.errorMessage) {
        SDL.errorMessage = allocate(intArrayFromString("unknown SDL-emscripten error"), "i8", ALLOC_NORMAL)
    }
    return SDL.errorMessage
}

function _SDL_GetModState() {
    return SDL.modState
}

function _SDL_GetMouseState(x, y) {
    if (x) HEAP32[x >> 2] = Browser.mouseX;
    if (y) HEAP32[y >> 2] = Browser.mouseY;
    return SDL.buttonState
}

function _SDL_GetVideoInfo() {
    var ret = _malloc(5 * 4);
    HEAP32[ret + 0 >> 2] = 0;
    HEAP32[ret + 4 >> 2] = 0;
    HEAP32[ret + 8 >> 2] = 0;
    HEAP32[ret + 12 >> 2] = Module["canvas"].width;
    HEAP32[ret + 16 >> 2] = Module["canvas"].height;
    return ret
}

function _SDL_Init(initFlags) {
    SDL.startTime = Date.now();
    SDL.initFlags = initFlags;
    if (!Module["doNotCaptureKeyboard"]) {
        var keyboardListeningElement = Module["keyboardListeningElement"] || document;
        keyboardListeningElement.addEventListener("keydown", SDL.receiveEvent);
        keyboardListeningElement.addEventListener("keyup", SDL.receiveEvent);
        keyboardListeningElement.addEventListener("keypress", SDL.receiveEvent);
        window.addEventListener("focus", SDL.receiveEvent);
        window.addEventListener("blur", SDL.receiveEvent);
        document.addEventListener("visibilitychange", SDL.receiveEvent)
    }
    window.addEventListener("unload", SDL.receiveEvent);
    SDL.keyboardState = _malloc(65536);
    _memset(SDL.keyboardState, 0, 65536);
    SDL.DOMEventToSDLEvent["keydown"] = 768;
    SDL.DOMEventToSDLEvent["keyup"] = 769;
    SDL.DOMEventToSDLEvent["keypress"] = 771;
    SDL.DOMEventToSDLEvent["mousedown"] = 1025;
    SDL.DOMEventToSDLEvent["mouseup"] = 1026;
    SDL.DOMEventToSDLEvent["mousemove"] = 1024;
    SDL.DOMEventToSDLEvent["wheel"] = 1027;
    SDL.DOMEventToSDLEvent["touchstart"] = 1792;
    SDL.DOMEventToSDLEvent["touchend"] = 1793;
    SDL.DOMEventToSDLEvent["touchmove"] = 1794;
    SDL.DOMEventToSDLEvent["unload"] = 256;
    SDL.DOMEventToSDLEvent["resize"] = 28673;
    SDL.DOMEventToSDLEvent["visibilitychange"] = 512;
    SDL.DOMEventToSDLEvent["focus"] = 512;
    SDL.DOMEventToSDLEvent["blur"] = 512;
    SDL.DOMEventToSDLEvent["joystick_axis_motion"] = 1536;
    SDL.DOMEventToSDLEvent["joystick_button_down"] = 1539;
    SDL.DOMEventToSDLEvent["joystick_button_up"] = 1540;
    return 0
}

function _SDL_JoystickClose(joystick) {
    delete SDL.lastJoystickState[joystick]
}

function _SDL_JoystickGetAxis(joystick, axis) {
    var gamepad = SDL.getGamepad(joystick - 1);
    if (gamepad && gamepad.axes.length > axis) {
        return SDL.joystickAxisValueConversion(gamepad.axes[axis])
    }
    return 0
}

function _SDL_JoystickGetButton(joystick, button) {
    var gamepad = SDL.getGamepad(joystick - 1);
    if (gamepad && gamepad.buttons.length > button) {
        return SDL.getJoystickButtonState(gamepad.buttons[button]) ? 1 : 0
    }
    return 0
}

function _SDL_JoystickGetHat(joystick, hat) {
    return 0
}

function _SDL_JoystickNumButtons(joystick) {
    var gamepad = SDL.getGamepad(joystick - 1);
    if (gamepad) {
        return gamepad.buttons.length
    }
    return 0
}

function _SDL_JoystickNumHats(joystick) {
    return 0
}

function _SDL_JoystickOpen(deviceIndex) {
    var gamepad = SDL.getGamepad(deviceIndex);
    if (gamepad) {
        var joystick = deviceIndex + 1;
        SDL.recordJoystickState(joystick, gamepad);
        return joystick
    }
    return 0
}

function _SDL_JoystickUpdate() {
    SDL.queryJoysticks()
}

function _SDL_MapRGB(fmt, r, g, b) {
    SDL.checkPixelFormat(fmt);
    return r & 255 | (g & 255) << 8 | (b & 255) << 16 | 4278190080
}

function _SDL_MapRGBA(fmt, r, g, b, a) {
    SDL.checkPixelFormat(fmt);
    return r & 255 | (g & 255) << 8 | (b & 255) << 16 | (a & 255) << 24
}

function _SDL_NumJoysticks() {
    var count = 0;
    var gamepads = SDL.getGamepads();
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i] !== undefined) count++
    }
    return count
}

function _SDL_OpenAudio(desired, obtained) {
    try {
        SDL.audio = {
            freq: HEAPU32[desired >> 2],
            format: HEAPU16[desired + 4 >> 1],
            channels: HEAPU8[desired + 6 >> 0],
            samples: HEAPU16[desired + 8 >> 1],
            callback: HEAPU32[desired + 16 >> 2],
            userdata: HEAPU32[desired + 20 >> 2],
            paused: true,
            timer: null
        };
        if (SDL.audio.format == 8) {
            SDL.audio.silence = 128
        } else if (SDL.audio.format == 32784) {
            SDL.audio.silence = 0
        } else if (SDL.audio.format == 33056) {
            SDL.audio.silence = 0
        } else {
            throw "Invalid SDL audio format " + SDL.audio.format + "!"
        }
        if (SDL.audio.freq <= 0) {
            throw "Unsupported sound frequency " + SDL.audio.freq + "!"
        } else if (SDL.audio.freq <= 22050) {
            SDL.audio.freq = 22050
        } else if (SDL.audio.freq <= 32e3) {
            SDL.audio.freq = 32e3
        } else if (SDL.audio.freq <= 44100) {
            SDL.audio.freq = 44100
        } else if (SDL.audio.freq <= 48e3) {
            SDL.audio.freq = 48e3
        } else if (SDL.audio.freq <= 96e3) {
            SDL.audio.freq = 96e3
        } else {
            throw "Unsupported sound frequency " + SDL.audio.freq + "!"
        }
        if (SDL.audio.channels == 0) {
            SDL.audio.channels = 1
        } else if (SDL.audio.channels < 0 || SDL.audio.channels > 32) {
            throw "Unsupported number of audio channels for SDL audio: " + SDL.audio.channels + "!"
        } else if (SDL.audio.channels != 1 && SDL.audio.channels != 2) {
            console.log("Warning: Using untested number of audio channels " + SDL.audio.channels)
        }
        if (SDL.audio.samples < 128 || SDL.audio.samples > 524288) {
            throw "Unsupported audio callback buffer size " + SDL.audio.samples + "!"
        } else if ((SDL.audio.samples & SDL.audio.samples - 1) != 0) {
            throw "Audio callback buffer size " + SDL.audio.samples + " must be a power-of-two!"
        }
        var totalSamples = SDL.audio.samples * SDL.audio.channels;
        if (SDL.audio.format == 8) {
            SDL.audio.bytesPerSample = 1
        } else if (SDL.audio.format == 32784) {
            SDL.audio.bytesPerSample = 2
        } else if (SDL.audio.format == 33056) {
            SDL.audio.bytesPerSample = 4
        } else {
            throw "Invalid SDL audio format " + SDL.audio.format + "!"
        }
        SDL.audio.bufferSize = totalSamples * SDL.audio.bytesPerSample;
        SDL.audio.bufferDurationSecs = SDL.audio.bufferSize / SDL.audio.bytesPerSample / SDL.audio.channels / SDL.audio.freq;
        SDL.audio.bufferingDelay = 50 / 1e3;
        SDL.audio.buffer = _malloc(SDL.audio.bufferSize);
        SDL.audio.numSimultaneouslyQueuedBuffers = Module["SDL_numSimultaneouslyQueuedBuffers"] || 5;
        SDL.audio.queueNewAudioData = function SDL_queueNewAudioData() {
            if (!SDL.audio) return;
            for (var i = 0; i < SDL.audio.numSimultaneouslyQueuedBuffers; ++i) {
                var secsUntilNextPlayStart = SDL.audio.nextPlayTime - SDL.audioContext["currentTime"];
                if (secsUntilNextPlayStart >= SDL.audio.bufferingDelay + SDL.audio.bufferDurationSecs * SDL.audio.numSimultaneouslyQueuedBuffers) return;
                Module["dynCall_viii"](SDL.audio.callback, SDL.audio.userdata, SDL.audio.buffer, SDL.audio.bufferSize);
                SDL.audio.pushAudio(SDL.audio.buffer, SDL.audio.bufferSize)
            }
        };
        var yieldCallback = (function() {
            if (SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData()
        });
        SDL.audio.yieldCallback = yieldCallback;
        EmterpreterAsync.yieldCallbacks.push(yieldCallback);
        SDL.audio.caller = function SDL_audioCaller() {
            if (!SDL.audio) return;
            --SDL.audio.numAudioTimersPending;
            SDL.audio.queueNewAudioData();
            var secsUntilNextPlayStart = SDL.audio.nextPlayTime - SDL.audioContext["currentTime"];
            var preemptBufferFeedSecs = SDL.audio.bufferDurationSecs / 2;
            if (SDL.audio.numAudioTimersPending < SDL.audio.numSimultaneouslyQueuedBuffers) {
                ++SDL.audio.numAudioTimersPending;
                SDL.audio.timer = Browser.safeSetTimeout(SDL.audio.caller, Math.max(0, 1e3 * (secsUntilNextPlayStart - preemptBufferFeedSecs)));
                if (SDL.audio.numAudioTimersPending < SDL.audio.numSimultaneouslyQueuedBuffers) {
                    ++SDL.audio.numAudioTimersPending;
                    Browser.safeSetTimeout(SDL.audio.caller, 1)
                }
            }
        };
        SDL.audio.audioOutput = new Audio;
        SDL.openAudioContext();
        if (!SDL.audioContext) throw "Web Audio API is not available!";
        SDL.audio.nextPlayTime = 0;
        SDL.audio.pushAudio = (function(ptr, sizeBytes) {
            try {
                if (SDL.audio.paused) return;
                var sizeSamples = sizeBytes / SDL.audio.bytesPerSample;
                var sizeSamplesPerChannel = sizeSamples / SDL.audio.channels;
                if (sizeSamplesPerChannel != SDL.audio.samples) {
                    throw "Received mismatching audio buffer size!"
                }
                var source = SDL.audioContext["createBufferSource"]();
                var soundBuffer = SDL.audioContext["createBuffer"](SDL.audio.channels, sizeSamplesPerChannel, SDL.audio.freq);
                source["connect"](SDL.audioContext["destination"]);
                SDL.fillWebAudioBufferFromHeap(ptr, sizeSamplesPerChannel, soundBuffer);
                source["buffer"] = soundBuffer;
                var curtime = SDL.audioContext["currentTime"];
                if (curtime > SDL.audio.nextPlayTime && SDL.audio.nextPlayTime != 0) {
                    console.log("warning: Audio callback had starved sending audio by " + (curtime - SDL.audio.nextPlayTime) + " seconds.")
                }
                var playtime = Math.max(curtime + SDL.audio.bufferingDelay, SDL.audio.nextPlayTime);
                if (typeof source["start"] !== "undefined") {
                    source["start"](playtime)
                } else if (typeof source["noteOn"] !== "undefined") {
                    source["noteOn"](playtime)
                }
                SDL.audio.nextPlayTime = playtime + SDL.audio.bufferDurationSecs
            } catch (e) {
                console.log("Web Audio API error playing back audio: " + e.toString())
            }
        });
        if (obtained) {
            HEAP32[obtained >> 2] = SDL.audio.freq;
            HEAP16[obtained + 4 >> 1] = SDL.audio.format;
            HEAP8[obtained + 6 >> 0] = SDL.audio.channels;
            HEAP8[obtained + 7 >> 0] = SDL.audio.silence;
            HEAP16[obtained + 8 >> 1] = SDL.audio.samples;
            HEAP32[obtained + 16 >> 2] = SDL.audio.callback;
            HEAP32[obtained + 20 >> 2] = SDL.audio.userdata
        }
        SDL.allocateChannels(32)
    } catch (e) {
        console.log('Initializing SDL audio threw an exception: "' + e.toString() + '"! Continuing without audio.');
        SDL.audio = null;
        SDL.allocateChannels(0);
        if (obtained) {
            HEAP32[obtained >> 2] = 0;
            HEAP16[obtained + 4 >> 1] = 0;
            HEAP8[obtained + 6 >> 0] = 0;
            HEAP8[obtained + 7 >> 0] = 0;
            HEAP16[obtained + 8 >> 1] = 0;
            HEAP32[obtained + 16 >> 2] = 0;
            HEAP32[obtained + 20 >> 2] = 0
        }
    }
    if (!SDL.audio) {
        return -1
    }
    return 0
}

function _SDL_PauseAudio(pauseOn) {
    if (!SDL.audio) {
        return
    }
    if (pauseOn) {
        if (SDL.audio.timer !== undefined) {
            clearTimeout(SDL.audio.timer);
            SDL.audio.numAudioTimersPending = 0;
            SDL.audio.timer = undefined
        }
    } else if (!SDL.audio.timer) {
        SDL.audio.numAudioTimersPending = 1;
        SDL.audio.timer = Browser.safeSetTimeout(SDL.audio.caller, 1)
    }
    SDL.audio.paused = pauseOn
}

function _SDL_PollEvent(ptr) {
    return SDL.pollEvent(ptr)
}

function _SDL_AudioQuit() {
    for (var i = 0; i < SDL.numChannels; ++i) {
        if (SDL.channels[i].audio) {
            SDL.channels[i].audio.pause();
            SDL.channels[i].audio = undefined
        }
    }
    if (SDL.music.audio) SDL.music.audio.pause();
    SDL.music.audio = undefined
}

function _SDL_Quit() {
    _SDL_AudioQuit();
    out("SDL_Quit called (and ignored)")
}

function _SDL_RWFromFile(_name, mode) {
    var id = SDL.rwops.length;
    var name = Pointer_stringify(_name);
    SDL.rwops.push({
        filename: name,
        mimetype: Browser.getMimetype(name)
    });
    return id
}

function _SDL_RWFromConstMem(mem, size) {
    var id = SDL.rwops.length;
    SDL.rwops.push({
        bytes: mem,
        count: size
    });
    return id
}

function _SDL_RWFromMem() {
    return _SDL_RWFromConstMem.apply(null, arguments)
}

function _SDL_SaveBMP_RW() {
    throw "SDL_SaveBMP_RW: TODO"
}

function _SDL_SetColors(surf, colors, firstColor, nColors) {
    var surfData = SDL.surfaces[surf];
    if (!surfData.colors) {
        var buffer = new ArrayBuffer(256 * 4);
        surfData.colors = new Uint8Array(buffer);
        surfData.colors32 = new Uint32Array(buffer)
    }
    for (var i = 0; i < nColors; ++i) {
        var index = (firstColor + i) * 4;
        surfData.colors[index] = HEAPU8[colors + i * 4 >> 0];
        surfData.colors[index + 1] = HEAPU8[colors + (i * 4 + 1) >> 0];
        surfData.colors[index + 2] = HEAPU8[colors + (i * 4 + 2) >> 0];
        surfData.colors[index + 3] = 255
    }
    return 1
}

function _SDL_SetPalette(surf, flags, colors, firstColor, nColors) {
    return _SDL_SetColors(surf, colors, firstColor, nColors)
}
var GL = {
    counter: 1,
    lastError: 0,
    buffers: [],
    mappedBuffers: {},
    programs: [],
    framebuffers: [],
    renderbuffers: [],
    textures: [],
    uniforms: [],
    shaders: [],
    vaos: [],
    contexts: {},
    currentContext: null,
    offscreenCanvases: {},
    timerQueriesEXT: [],
    byteSizeByTypeRoot: 5120,
    byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
    programInfos: {},
    stringCache: {},
    tempFixedLengthArray: [],
    packAlignment: 4,
    unpackAlignment: 4,
    init: (function() {
        GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
        for (var i = 0; i < GL.MINI_TEMP_BUFFER_SIZE; i++) {
            GL.miniTempBufferViews[i] = GL.miniTempBuffer.subarray(0, i + 1)
        }
        for (var i = 0; i < 32; i++) {
            GL.tempFixedLengthArray.push(new Array(i))
        }
    }),
    recordError: function recordError(errorCode) {
        if (!GL.lastError) {
            GL.lastError = errorCode
        }
    },
    getNewId: (function(table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
            table[i] = null
        }
        return ret
    }),
    MINI_TEMP_BUFFER_SIZE: 256,
    miniTempBuffer: null,
    miniTempBufferViews: [0],
    getSource: (function(shader, count, string, length) {
        var source = "";
        for (var i = 0; i < count; ++i) {
            var frag;
            if (length) {
                var len = HEAP32[length + i * 4 >> 2];
                if (len < 0) {
                    frag = Pointer_stringify(HEAP32[string + i * 4 >> 2])
                } else {
                    frag = Pointer_stringify(HEAP32[string + i * 4 >> 2], len)
                }
            } else {
                frag = Pointer_stringify(HEAP32[string + i * 4 >> 2])
            }
            source += frag
        }
        return source
    }),
    createContext: (function(canvas, webGLContextAttributes) {
        if (typeof webGLContextAttributes["majorVersion"] === "undefined" && typeof webGLContextAttributes["minorVersion"] === "undefined") {
            webGLContextAttributes["majorVersion"] = 1;
            webGLContextAttributes["minorVersion"] = 0
        }
        var ctx;
        var errorInfo = "?";

        function onContextCreationError(event) {
            errorInfo = event.statusMessage || errorInfo
        }
        try {
            canvas.addEventListener("webglcontextcreationerror", onContextCreationError, false);
            try {
                if (webGLContextAttributes["majorVersion"] == 1 && webGLContextAttributes["minorVersion"] == 0) {
                    ctx = canvas.getContext("webgl", webGLContextAttributes) || canvas.getContext("experimental-webgl", webGLContextAttributes)
                } else if (webGLContextAttributes["majorVersion"] == 2 && webGLContextAttributes["minorVersion"] == 0) {
                    ctx = canvas.getContext("webgl2", webGLContextAttributes)
                } else {
                    throw "Unsupported WebGL context version " + majorVersion + "." + minorVersion + "!"
                }
            } finally {
                canvas.removeEventListener("webglcontextcreationerror", onContextCreationError, false)
            }
            if (!ctx) throw ":("
        } catch (e) {
            return 0
        }
        if (!ctx) return 0;
        var context = GL.registerContext(ctx, webGLContextAttributes);
        return context
    }),
    registerContext: (function(ctx, webGLContextAttributes) {
        var handle = _malloc(8);
        HEAP32[handle >> 2] = webGLContextAttributes["explicitSwapControl"];
        var context = {
            handle: handle,
            attributes: webGLContextAttributes,
            version: webGLContextAttributes["majorVersion"],
            GLctx: ctx
        };
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes["enableExtensionsByDefault"] === "undefined" || webGLContextAttributes["enableExtensionsByDefault"]) {
            GL.initExtensions(context)
        }
        return handle
    }),
    makeContextCurrent: (function(contextHandle) {
        if (!contextHandle) {
            GLctx = Module.ctx = GL.currentContext = null;
            return true
        }
        var context = GL.contexts[contextHandle];
        if (!context) {
            return false
        }
        GLctx = Module.ctx = context.GLctx;
        GL.currentContext = context;
        return true
    }),
    getContext: (function(contextHandle) {
        return GL.contexts[contextHandle]
    }),
    deleteContext: (function(contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
        if (typeof JSEvents === "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        _free(GL.contexts[contextHandle]);
        GL.contexts[contextHandle] = null
    }),
    initExtensions: (function(context) {
        if (!context) context = GL.currentContext;
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        if (context.version < 2) {
            var instancedArraysExt = GLctx.getExtension("ANGLE_instanced_arrays");
            if (instancedArraysExt) {
                GLctx["vertexAttribDivisor"] = (function(index, divisor) {
                    instancedArraysExt["vertexAttribDivisorANGLE"](index, divisor)
                });
                GLctx["drawArraysInstanced"] = (function(mode, first, count, primcount) {
                    instancedArraysExt["drawArraysInstancedANGLE"](mode, first, count, primcount)
                });
                GLctx["drawElementsInstanced"] = (function(mode, count, type, indices, primcount) {
                    instancedArraysExt["drawElementsInstancedANGLE"](mode, count, type, indices, primcount)
                })
            }
            var vaoExt = GLctx.getExtension("OES_vertex_array_object");
            if (vaoExt) {
                GLctx["createVertexArray"] = (function() {
                    return vaoExt["createVertexArrayOES"]()
                });
                GLctx["deleteVertexArray"] = (function(vao) {
                    vaoExt["deleteVertexArrayOES"](vao)
                });
                GLctx["bindVertexArray"] = (function(vao) {
                    vaoExt["bindVertexArrayOES"](vao)
                });
                GLctx["isVertexArray"] = (function(vao) {
                    return vaoExt["isVertexArrayOES"](vao)
                })
            }
            var drawBuffersExt = GLctx.getExtension("WEBGL_draw_buffers");
            if (drawBuffersExt) {
                GLctx["drawBuffers"] = (function(n, bufs) {
                    drawBuffersExt["drawBuffersWEBGL"](n, bufs)
                })
            }
        }
        GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
        var automaticallyEnabledExtensions = ["OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives", "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture", "OES_element_index_uint", "EXT_texture_filter_anisotropic", "EXT_frag_depth", "WEBGL_draw_buffers", "ANGLE_instanced_arrays", "OES_texture_float_linear", "OES_texture_half_float_linear", "EXT_blend_minmax", "EXT_shader_texture_lod", "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float", "EXT_sRGB", "WEBGL_compressed_texture_etc1", "EXT_disjoint_timer_query", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_astc", "EXT_color_buffer_float", "WEBGL_compressed_texture_s3tc_srgb", "EXT_disjoint_timer_query_webgl2"];
        var exts = GLctx.getSupportedExtensions();
        if (exts && exts.length > 0) {
            GLctx.getSupportedExtensions().forEach((function(ext) {
                if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
                    GLctx.getExtension(ext)
                }
            }))
        }
    }),
    populateUniformTable: (function(program) {
        var p = GL.programs[program];
        GL.programInfos[program] = {
            uniforms: {},
            maxUniformLength: 0,
            maxAttributeLength: -1,
            maxUniformBlockNameLength: -1
        };
        var ptable = GL.programInfos[program];
        var utable = ptable.uniforms;
        var numUniforms = GLctx.getProgramParameter(p, GLctx.ACTIVE_UNIFORMS);
        for (var i = 0; i < numUniforms; ++i) {
            var u = GLctx.getActiveUniform(p, i);
            var name = u.name;
            ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length + 1);
            if (name.indexOf("]", name.length - 1) !== -1) {
                var ls = name.lastIndexOf("[");
                name = name.slice(0, ls)
            }
            var loc = GLctx.getUniformLocation(p, name);
            if (loc != null) {
                var id = GL.getNewId(GL.uniforms);
                utable[name] = [u.size, id];
                GL.uniforms[id] = loc;
                for (var j = 1; j < u.size; ++j) {
                    var n = name + "[" + j + "]";
                    loc = GLctx.getUniformLocation(p, n);
                    id = GL.getNewId(GL.uniforms);
                    GL.uniforms[id] = loc
                }
            }
        }
    })
};

function _SDL_SetVideoMode(width, height, depth, flags) {
    ["touchstart", "touchend", "touchmove", "mousedown", "mouseup", "mousemove", "DOMMouseScroll", "mousewheel", "wheel", "mouseout"].forEach((function(event) {
        Module["canvas"].addEventListener(event, SDL.receiveEvent, true)
    }));
    var canvas = Module["canvas"];
    if (width == 0 && height == 0) {
        width = canvas.width;
        height = canvas.height
    }
    if (!SDL.addedResizeListener) {
        SDL.addedResizeListener = true;
        Browser.resizeListeners.push((function(w, h) {
            if (!SDL.settingVideoMode) {
                SDL.receiveEvent({
                    type: "resize",
                    w: w,
                    h: h
                })
            }
        }))
    }
    SDL.settingVideoMode = true;
    Browser.setCanvasSize(width, height);
    SDL.settingVideoMode = false;
    if (SDL.screen) {
        SDL.freeSurface(SDL.screen);
        assert(!SDL.screen)
    }
    if (SDL.GL) flags = flags | 67108864;
    SDL.screen = SDL.makeSurface(width, height, flags, true, "screen");
    return SDL.screen
}

function _SDL_ShowCursor(toggle) {
    switch (toggle) {
        case 0:
            if (Browser.isFullscreen) {
                Module["canvas"].requestPointerLock();
                return 0
            } else {
                return 1
            }
            break;
        case 1:
            Module["canvas"].exitPointerLock();
            return 1;
            break;
        case -1:
            return !Browser.pointerLock;
            break;
        default:
            console.log("SDL_ShowCursor called with unknown toggle parameter value: " + toggle + ".");
            break
    }
}

function _SDL_UnlockSurface(surf) {
    assert(!SDL.GL);
    var surfData = SDL.surfaces[surf];
    if (!surfData.locked || --surfData.locked > 0) {
        return
    }
    if (surfData.isFlagSet(2097152)) {
        SDL.copyIndexedColorData(surfData)
    } else if (!surfData.colors) {
        var data = surfData.image.data;
        var buffer = surfData.buffer;
        assert(buffer % 4 == 0, "Invalid buffer offset: " + buffer);
        var src = buffer >> 2;
        var dst = 0;
        var isScreen = surf == SDL.screen;
        var num;
        if (typeof CanvasPixelArray !== "undefined" && data instanceof CanvasPixelArray) {
            num = data.length;
            while (dst < num) {
                var val = HEAP32[src];
                data[dst] = val & 255;
                data[dst + 1] = val >> 8 & 255;
                data[dst + 2] = val >> 16 & 255;
                data[dst + 3] = isScreen ? 255 : val >> 24 & 255;
                src++;
                dst += 4
            }
        } else {
            var data32 = new Uint32Array(data.buffer);
            if (isScreen && SDL.defaults.opaqueFrontBuffer) {
                num = data32.length;
                data32.set(HEAP32.subarray(src, src + num));
                var data8 = new Uint8Array(data.buffer);
                var i = 3;
                var j = i + 4 * num;
                if (num % 8 == 0) {
                    while (i < j) {
                        data8[i] = 255;
                        i = i + 4 | 0;
                        data8[i] = 255;
                        i = i + 4 | 0;
                        data8[i] = 255;
                        i = i + 4 | 0;
                        data8[i] = 255;
                        i = i + 4 | 0;
                        data8[i] = 255;
                        i = i + 4 | 0;
                        data8[i] = 255;
                        i = i + 4 | 0;
                        data8[i] = 255;
                        i = i + 4 | 0;
                        data8[i] = 255;
                        i = i + 4 | 0
                    }
                } else {
                    while (i < j) {
                        data8[i] = 255;
                        i = i + 4 | 0
                    }
                }
            } else {
                data32.set(HEAP32.subarray(src, src + data32.length))
            }
        }
    } else {
        var width = Module["canvas"].width;
        var height = Module["canvas"].height;
        var s = surfData.buffer;
        var data = surfData.image.data;
        var colors = surfData.colors;
        for (var y = 0; y < height; y++) {
            var base = y * width * 4;
            for (var x = 0; x < width; x++) {
                var val = HEAPU8[s++ >> 0] * 4;
                var start = base + x * 4;
                data[start] = colors[val];
                data[start + 1] = colors[val + 1];
                data[start + 2] = colors[val + 2]
            }
            s += width * 3
        }
    }
    surfData.ctx.putImageData(surfData.image, 0, 0)
}

function _SDL_UpperBlit(src, srcrect, dst, dstrect) {
    return SDL.blitSurface(src, srcrect, dst, dstrect, false)
}

function _SDL_WM_GrabInput() {}

function _SDL_WM_SetCaption(title, icon) {
    if (title && typeof Module["setWindowTitle"] !== "undefined") {
        Module["setWindowTitle"](Pointer_stringify(title))
    }
    icon = icon && Pointer_stringify(icon)
}

function _SDL_WaitEvent() {
    return 0
}

function _SDL_WarpMouse(x, y) {
    return
}

function ___assert_fail(condition, filename, line, func) {
    abort("Assertion failed: " + Pointer_stringify(condition) + ", at: " + [filename ? Pointer_stringify(filename) : "unknown filename", line, func ? Pointer_stringify(func) : "unknown function"])
}
var ENV = {};

function ___buildEnvironment(environ) {
    var MAX_ENV_VALUES = 64;
    var TOTAL_ENV_SIZE = 1024;
    var poolPtr;
    var envPtr;
    if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        ENV["USER"] = ENV["LOGNAME"] = "web_user";
        ENV["PATH"] = "/";
        ENV["PWD"] = "/";
        ENV["HOME"] = "/home/web_user";
        ENV["LANG"] = "C.UTF-8";
        ENV["_"] = Module["thisProgram"];
        poolPtr = getMemory(TOTAL_ENV_SIZE);
        envPtr = getMemory(MAX_ENV_VALUES * 4);
        HEAP32[envPtr >> 2] = poolPtr;
        HEAP32[environ >> 2] = envPtr
    } else {
        envPtr = HEAP32[environ >> 2];
        poolPtr = HEAP32[envPtr >> 2]
    }
    var strings = [];
    var totalSize = 0;
    for (var key in ENV) {
        if (typeof ENV[key] === "string") {
            var line = key + "=" + ENV[key];
            strings.push(line);
            totalSize += line.length
        }
    }
    if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error("Environment size exceeded TOTAL_ENV_SIZE!")
    }
    var ptrSize = 4;
    for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        writeAsciiToMemory(line, poolPtr);
        HEAP32[envPtr + i * ptrSize >> 2] = poolPtr;
        poolPtr += line.length + 1
    }
    HEAP32[envPtr + strings.length * ptrSize >> 2] = 0
}

function ___lock() {}
var SYSCALLS = {
    DEFAULT_POLLMASK: 5,
    mappings: {},
    umask: 511,
    calculateAt: (function(dirfd, path) {
        if (path[0] !== "/") {
            var dir;
            if (dirfd === -100) {
                dir = FS.cwd()
            } else {
                var dirstream = FS.getStream(dirfd);
                if (!dirstream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                dir = dirstream.path
            }
            path = PATH.join2(dir, path)
        }
        return path
    }),
    doStat: (function(func, path, buf) {
        try {
            var stat = func(path)
        } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                return -ERRNO_CODES.ENOTDIR
            }
            throw e
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[buf + 4 >> 2] = 0;
        HEAP32[buf + 8 >> 2] = stat.ino;
        HEAP32[buf + 12 >> 2] = stat.mode;
        HEAP32[buf + 16 >> 2] = stat.nlink;
        HEAP32[buf + 20 >> 2] = stat.uid;
        HEAP32[buf + 24 >> 2] = stat.gid;
        HEAP32[buf + 28 >> 2] = stat.rdev;
        HEAP32[buf + 32 >> 2] = 0;
        HEAP32[buf + 36 >> 2] = stat.size;
        HEAP32[buf + 40 >> 2] = 4096;
        HEAP32[buf + 44 >> 2] = stat.blocks;
        HEAP32[buf + 48 >> 2] = stat.atime.getTime() / 1e3 | 0;
        HEAP32[buf + 52 >> 2] = 0;
        HEAP32[buf + 56 >> 2] = stat.mtime.getTime() / 1e3 | 0;
        HEAP32[buf + 60 >> 2] = 0;
        HEAP32[buf + 64 >> 2] = stat.ctime.getTime() / 1e3 | 0;
        HEAP32[buf + 68 >> 2] = 0;
        HEAP32[buf + 72 >> 2] = stat.ino;
        return 0
    }),
    doMsync: (function(addr, stream, len, flags) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        FS.msync(stream, buffer, 0, len, flags)
    }),
    doMkdir: (function(path, mode) {
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
        FS.mkdir(path, mode, 0);
        return 0
    }),
    doMknod: (function(path, mode, dev) {
        switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
                break;
            default:
                return -ERRNO_CODES.EINVAL
        }
        FS.mknod(path, mode, dev);
        return 0
    }),
    doReadlink: (function(path, buf, bufsize) {
        if (bufsize <= 0) return -ERRNO_CODES.EINVAL;
        var ret = FS.readlink(path);
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        HEAP8[buf + len] = endChar;
        return len
    }),
    doAccess: (function(path, amode) {
        if (amode & ~7) {
            return -ERRNO_CODES.EINVAL
        }
        var node;
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        node = lookup.node;
        var perms = "";
        if (amode & 4) perms += "r";
        if (amode & 2) perms += "w";
        if (amode & 1) perms += "x";
        if (perms && FS.nodePermissions(node, perms)) {
            return -ERRNO_CODES.EACCES
        }
        return 0
    }),
    doDup: (function(path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd
    }),
    doReadv: (function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break
        }
        return ret
    }),
    doWritev: (function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr
        }
        return ret
    }),
    varargs: 0,
    get: (function(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret
    }),
    getStr: (function() {
        var ret = Pointer_stringify(SYSCALLS.get());
        return ret
    }),
    getStreamFromFD: (function() {
        var stream = FS.getStream(SYSCALLS.get());
        if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return stream
    }),
    getSocketFromFD: (function() {
        var socket = SOCKFS.getSocket(SYSCALLS.get());
        if (!socket) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return socket
    }),
    getSocketAddress: (function(allowNull) {
        var addrp = SYSCALLS.get(),
            addrlen = SYSCALLS.get();
        if (allowNull && addrp === 0) return null;
        var info = __read_sockaddr(addrp, addrlen);
        if (info.errno) throw new FS.ErrnoError(info.errno);
        info.addr = DNS.lookup_addr(info.addr) || info.addr;
        return info
    }),
    get64: (function() {
        var low = SYSCALLS.get(),
            high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low
    }),
    getZero: (function() {
        assert(SYSCALLS.get() === 0)
    })
};

function ___syscall10(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr();
        FS.unlink(path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall140(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            offset_high = SYSCALLS.get(),
            offset_low = SYSCALLS.get(),
            result = SYSCALLS.get(),
            whence = SYSCALLS.get();
        var offset = offset_low;
        FS.llseek(stream, offset, whence);
        HEAP32[result >> 2] = stream.position;
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall145(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            iov = SYSCALLS.get(),
            iovcnt = SYSCALLS.get();
        return SYSCALLS.doReadv(stream, iov, iovcnt)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall146(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            iov = SYSCALLS.get(),
            iovcnt = SYSCALLS.get();
        return SYSCALLS.doWritev(stream, iov, iovcnt)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall195(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr(),
            buf = SYSCALLS.get();
        return SYSCALLS.doStat(FS.stat, path, buf)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall221(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            cmd = SYSCALLS.get();
        switch (cmd) {
            case 0: {
                var arg = SYSCALLS.get();
                if (arg < 0) {
                    return -ERRNO_CODES.EINVAL
                }
                var newStream;
                newStream = FS.open(stream.path, stream.flags, 0, arg);
                return newStream.fd
            };
            case 1:
            case 2:
                return 0;
            case 3:
                return stream.flags;
            case 4: {
                var arg = SYSCALLS.get();
                stream.flags |= arg;
                return 0
            };
            case 12:
            case 12: {
                var arg = SYSCALLS.get();
                var offset = 0;
                HEAP16[arg + offset >> 1] = 2;
                return 0
            };
            case 13:
            case 14:
            case 13:
            case 14:
                return 0;
            case 16:
            case 8:
                return -ERRNO_CODES.EINVAL;
            case 9:
                ___setErrNo(ERRNO_CODES.EINVAL);
                return -1;
            default: {
                return -ERRNO_CODES.EINVAL
            }
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall3(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            buf = SYSCALLS.get(),
            count = SYSCALLS.get();
        return FS.read(stream, HEAP8, buf, count)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall39(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr(),
            mode = SYSCALLS.get();
        return SYSCALLS.doMkdir(path, mode)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall4(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            buf = SYSCALLS.get(),
            count = SYSCALLS.get();
        return FS.write(stream, HEAP8, buf, count)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall5(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var pathname = SYSCALLS.getStr(),
            flags = SYSCALLS.get(),
            mode = SYSCALLS.get();
        var stream = FS.open(pathname, flags, mode);
        return stream.fd
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall54(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            op = SYSCALLS.get();
        switch (op) {
            case 21509:
            case 21505: {
                if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                return 0
            };
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508: {
                if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                return 0
            };
            case 21519: {
                if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                var argp = SYSCALLS.get();
                HEAP32[argp >> 2] = 0;
                return 0
            };
            case 21520: {
                if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                return -ERRNO_CODES.EINVAL
            };
            case 21531: {
                var argp = SYSCALLS.get();
                return FS.ioctl(stream, op, argp)
            };
            case 21523: {
                if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                return 0
            };
            case 21524: {
                if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                return 0
            };
            default:
                abort("bad ioctl syscall " + op)
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall6(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD();
        FS.close(stream);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___unlock() {}

function _atexit(func, arg) {
    warnOnce("atexit() called, but EXIT_RUNTIME is not set, so atexits() will not be called. set EXIT_RUNTIME to 1 (see the FAQ)");
    __ATEXIT__.unshift({
        func: func,
        arg: arg
    })
}

function _emscripten_sleep_with_yield(ms) {
    EmterpreterAsync.handle((function(resume) {
        Browser.safeSetTimeout(resume, ms)
    }), true)
}

function __exit(status) {
    exit(status)
}

function _exit(status) {
    __exit(status)
}

function _getenv(name) {
    if (name === 0) return 0;
    name = Pointer_stringify(name);
    if (!ENV.hasOwnProperty(name)) return 0;
    if (_getenv.ret) _free(_getenv.ret);
    _getenv.ret = allocateUTF8(ENV[name]);
    return _getenv.ret
}

function _llvm_exp2_f32(x) {
    return Math.pow(2, x)
}

function _llvm_exp2_f64() {
    return _llvm_exp2_f32.apply(null, arguments)
}

function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
    return dest
}
FS.staticInit();
__ATINIT__.unshift((function() {
    if (!Module["noFSInit"] && !FS.init.initialized) FS.init()
}));
__ATMAIN__.push((function() {
    FS.ignorePermissions = false
}));
__ATEXIT__.push((function() {
    FS.quit()
}));
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
__ATINIT__.unshift((function() {
    TTY.init()
}));
__ATEXIT__.push((function() {
    TTY.shutdown()
}));
if (ENVIRONMENT_IS_NODE) {
    var fs = require("fs");
    var NODEJS_PATH = require("path");
    NODEFS.staticInit()
}
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas, vrDevice) {
    err("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead.");
    Module["requestFullScreen"] = Module["requestFullscreen"];
    Browser.requestFullScreen(lockPointer, resizeCanvas, vrDevice)
};
Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas, vrDevice) {
    Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice)
};
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
    Browser.requestAnimationFrame(func)
};
Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
    Browser.setCanvasSize(width, height, noUpdates)
};
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
    Browser.mainLoop.pause()
};
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
    Browser.mainLoop.resume()
};
Module["getUserMedia"] = function Module_getUserMedia() {
    Browser.getUserMedia()
};
Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
    return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes)
};
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function _emscripten_get_now_actual() {
        var t = process["hrtime"]();
        return t[0] * 1e3 + t[1] / 1e6
    }
} else if (typeof dateNow !== "undefined") {
    _emscripten_get_now = dateNow
} else if (typeof self === "object" && self["performance"] && typeof self["performance"]["now"] === "function") {
    _emscripten_get_now = (function() {
        return self["performance"]["now"]()
    })
} else if (typeof performance === "object" && typeof performance["now"] === "function") {
    _emscripten_get_now = (function() {
        return performance["now"]()
    })
} else {
    _emscripten_get_now = Date.now
}
var GLctx;
GL.init();
DYNAMICTOP_PTR = staticAlloc(4);
STACK_BASE = STACKTOP = alignMemory(STATICTOP);
STACK_MAX = STACK_BASE + TOTAL_STACK;
DYNAMIC_BASE = alignMemory(STACK_MAX);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
staticSealed = true;
assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array
}

function nullFunc_ii(x) {
    err("Invalid function pointer called with signature 'ii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");
    err("Build with ASSERTIONS=2 for more info.");
    abort(x)
}

function nullFunc_iiii(x) {
    err("Invalid function pointer called with signature 'iiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");
    err("Build with ASSERTIONS=2 for more info.");
    abort(x)
}

function nullFunc_v(x) {
    err("Invalid function pointer called with signature 'v'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");
    err("Build with ASSERTIONS=2 for more info.");
    abort(x)
}

function nullFunc_vi(x) {
    err("Invalid function pointer called with signature 'vi'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");
    err("Build with ASSERTIONS=2 for more info.");
    abort(x)
}

function nullFunc_vid(x) {
    err("Invalid function pointer called with signature 'vid'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");
    err("Build with ASSERTIONS=2 for more info.");
    abort(x)
}

function nullFunc_vii(x) {
    err("Invalid function pointer called with signature 'vii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");
    err("Build with ASSERTIONS=2 for more info.");
    abort(x)
}

function nullFunc_viii(x) {
    err("Invalid function pointer called with signature 'viii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");
    err("Build with ASSERTIONS=2 for more info.");
    abort(x)
}
Module["wasmTableSize"] = 94;
Module["wasmMaxTableSize"] = 94;
Module.asmGlobalArg = {};
Module.asmLibraryArg = {
    "h": abort,
    "w": assert,
    "Z": enlargeMemory,
    "Y": getTotalMemory,
    "m": setTempRet0,
    "i": getTempRet0,
    "$": abortOnCannotGrowMemory,
    "j": abortStackOverflow,
    "_": abortStackOverflowEmterpreter,
    "X": nullFunc_ii,
    "W": nullFunc_iiii,
    "V": nullFunc_v,
    "U": nullFunc_vi,
    "T": nullFunc_vid,
    "S": nullFunc_vii,
    "R": nullFunc_viii,
    "Na": _Mix_FreeChunk,
    "Q": _Mix_GroupAvailable,
    "Ma": _Mix_GroupOldest,
    "P": _Mix_LoadWAV_RW,
    "La": _Mix_PlayChannelTimed,
    "O": _Mix_SetPanning,
    "Ka": _SDL_ConvertSurface,
    "D": _SDL_CreateRGBSurface,
    "o": _SDL_Delay,
    "Ja": _SDL_EventState,
    "C": _SDL_FillRect,
    "B": _SDL_Flip,
    "Ia": _SDL_FreeSurface,
    "v": _SDL_GetError,
    "N": _SDL_GetModState,
    "s": _SDL_GetMouseState,
    "q": _SDL_GetTicks,
    "Ha": _SDL_GetVideoInfo,
    "Ga": _SDL_Init,
    "Fa": _SDL_JoystickClose,
    "M": _SDL_JoystickGetAxis,
    "x": _SDL_JoystickGetButton,
    "Ea": _SDL_JoystickGetHat,
    "Da": _SDL_JoystickNumButtons,
    "Ca": _SDL_JoystickNumHats,
    "Ba": _SDL_JoystickOpen,
    "u": _SDL_JoystickUpdate,
    "n": _SDL_LockSurface,
    "Aa": _SDL_MapRGB,
    "za": _SDL_MapRGBA,
    "L": _SDL_NumJoysticks,
    "ya": _SDL_OpenAudio,
    "xa": _SDL_PauseAudio,
    "p": _SDL_PollEvent,
    "wa": _SDL_Quit,
    "va": _SDL_RWFromFile,
    "K": _SDL_RWFromMem,
    "ua": _SDL_SaveBMP_RW,
    "A": _SDL_SetColors,
    "z": _SDL_SetPalette,
    "ta": _SDL_SetVideoMode,
    "sa": _SDL_ShowCursor,
    "l": _SDL_UnlockSurface,
    "J": _SDL_UpperBlit,
    "I": _SDL_WM_GrabInput,
    "ra": _SDL_WM_SetCaption,
    "qa": _SDL_WaitEvent,
    "pa": _SDL_WarpMouse,
    "k": ___assert_fail,
    "oa": ___buildEnvironment,
    "na": ___lock,
    "ma": ___setErrNo,
    "la": ___syscall10,
    "H": ___syscall140,
    "ka": ___syscall145,
    "G": ___syscall146,
    "ja": ___syscall195,
    "t": ___syscall221,
    "ia": ___syscall3,
    "ha": ___syscall39,
    "ga": ___syscall4,
    "F": ___syscall5,
    "E": ___syscall54,
    "y": ___syscall6,
    "fa": ___unlock,
    "ea": _atexit,
    "da": _emscripten_memcpy_big,
    "ca": _emscripten_sleep_with_yield,
    "r": _exit,
    "ba": _getenv,
    "aa": _llvm_exp2_f64,
    "a": DYNAMICTOP_PTR,
    "b": tempDoublePtr,
    "c": STACKTOP,
    "d": STACK_MAX,
    "e": EMTSTACKTOP,
    "f": EMT_STACK_MAX,
    "g": eb
};
var asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer);
var real____emscripten_environ_constructor = asm["___emscripten_environ_constructor"];
asm["___emscripten_environ_constructor"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real____emscripten_environ_constructor.apply(null, arguments)
});
var real____errno_location = asm["___errno_location"];
asm["___errno_location"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real____errno_location.apply(null, arguments)
});
var real____muldi3 = asm["___muldi3"];
asm["___muldi3"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real____muldi3.apply(null, arguments)
});
var real____udivdi3 = asm["___udivdi3"];
asm["___udivdi3"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real____udivdi3.apply(null, arguments)
});
var real___get_environ = asm["__get_environ"];
asm["__get_environ"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real___get_environ.apply(null, arguments)
});
var real__bitshift64Lshr = asm["_bitshift64Lshr"];
asm["_bitshift64Lshr"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__bitshift64Lshr.apply(null, arguments)
});
var real__bitshift64Shl = asm["_bitshift64Shl"];
asm["_bitshift64Shl"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__bitshift64Shl.apply(null, arguments)
});
var real__fflush = asm["_fflush"];
asm["_fflush"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__fflush.apply(null, arguments)
});
var real__fileno = asm["_fileno"];
asm["_fileno"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__fileno.apply(null, arguments)
});
var real__free = asm["_free"];
asm["_free"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__free.apply(null, arguments)
});
var real__i64Add = asm["_i64Add"];
asm["_i64Add"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__i64Add.apply(null, arguments)
});
var real__i64Subtract = asm["_i64Subtract"];
asm["_i64Subtract"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__i64Subtract.apply(null, arguments)
});
var real__llvm_bswap_i32 = asm["_llvm_bswap_i32"];
asm["_llvm_bswap_i32"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__llvm_bswap_i32.apply(null, arguments)
});
var real__main = asm["_main"];
asm["_main"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__main.apply(null, arguments)
});
var real__malloc = asm["_malloc"];
asm["_malloc"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__malloc.apply(null, arguments)
});
var real__sbrk = asm["_sbrk"];
asm["_sbrk"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real__sbrk.apply(null, arguments)
});
var real_emtStackRestore = asm["emtStackRestore"];
asm["emtStackRestore"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_emtStackRestore.apply(null, arguments)
});
var real_emtStackSave = asm["emtStackSave"];
asm["emtStackSave"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_emtStackSave.apply(null, arguments)
});
var real_emterpret = asm["emterpret"];
asm["emterpret"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_emterpret.apply(null, arguments)
});
var real_establishStackSpace = asm["establishStackSpace"];
asm["establishStackSpace"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_establishStackSpace.apply(null, arguments)
});
var real_getEmtStackMax = asm["getEmtStackMax"];
asm["getEmtStackMax"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_getEmtStackMax.apply(null, arguments)
});
var real_setAsyncState = asm["setAsyncState"];
asm["setAsyncState"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_setAsyncState.apply(null, arguments)
});
var real_setEmtStackMax = asm["setEmtStackMax"];
asm["setEmtStackMax"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_setEmtStackMax.apply(null, arguments)
});
var real_setThrew = asm["setThrew"];
asm["setThrew"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_setThrew.apply(null, arguments)
});
var real_stackAlloc = asm["stackAlloc"];
asm["stackAlloc"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_stackAlloc.apply(null, arguments)
});
var real_stackRestore = asm["stackRestore"];
asm["stackRestore"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_stackRestore.apply(null, arguments)
});
var real_stackSave = asm["stackSave"];
asm["stackSave"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return real_stackSave.apply(null, arguments)
});
Module["asm"] = asm;
var ___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Oa"].apply(null, arguments)
});
var ___errno_location = Module["___errno_location"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Pa"].apply(null, arguments)
});
var ___muldi3 = Module["___muldi3"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Qa"].apply(null, arguments)
});
var ___udivdi3 = Module["___udivdi3"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Ra"].apply(null, arguments)
});
var __get_environ = Module["__get_environ"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Sa"].apply(null, arguments)
});
var _bitshift64Lshr = Module["_bitshift64Lshr"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Ta"].apply(null, arguments)
});
var _bitshift64Shl = Module["_bitshift64Shl"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Ua"].apply(null, arguments)
});
var _fflush = Module["_fflush"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Va"].apply(null, arguments)
});
var _fileno = Module["_fileno"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Wa"].apply(null, arguments)
});
var _free = Module["_free"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Xa"].apply(null, arguments)
});
var _i64Add = Module["_i64Add"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Ya"].apply(null, arguments)
});
var _i64Subtract = Module["_i64Subtract"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["Za"].apply(null, arguments)
});
var _llvm_bswap_i32 = Module["_llvm_bswap_i32"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_a"].apply(null, arguments)
});
var _main = Module["_main"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["$a"].apply(null, arguments)
});
var _malloc = Module["_malloc"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["ab"].apply(null, arguments)
});
var _memcpy = Module["_memcpy"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["bb"].apply(null, arguments)
});
var _memset = Module["_memset"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["cb"].apply(null, arguments)
});
var _sbrk = Module["_sbrk"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["db"].apply(null, arguments)
});
var emtStackRestore = Module["emtStackRestore"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["lb"].apply(null, arguments)
});
var emtStackSave = Module["emtStackSave"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["mb"].apply(null, arguments)
});
var emterpret = Module["emterpret"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["nb"].apply(null, arguments)
});
var establishStackSpace = Module["establishStackSpace"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["ob"].apply(null, arguments)
});
var getEmtStackMax = Module["getEmtStackMax"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["pb"].apply(null, arguments)
});
var setAsyncState = Module["setAsyncState"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["qb"].apply(null, arguments)
});
var setEmtStackMax = Module["setEmtStackMax"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["rb"].apply(null, arguments)
});
var setThrew = Module["setThrew"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["sb"].apply(null, arguments)
});
var stackAlloc = Module["stackAlloc"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["tb"].apply(null, arguments)
});
var stackRestore = Module["stackRestore"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["ub"].apply(null, arguments)
});
var stackSave = Module["stackSave"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["vb"].apply(null, arguments)
});
var dynCall_ii = Module["dynCall_ii"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["eb"].apply(null, arguments)
});
var dynCall_iiii = Module["dynCall_iiii"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["fb"].apply(null, arguments)
});
var dynCall_v = Module["dynCall_v"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["gb"].apply(null, arguments)
});
var dynCall_vi = Module["dynCall_vi"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["hb"].apply(null, arguments)
});
var dynCall_vid = Module["dynCall_vid"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["ib"].apply(null, arguments)
});
var dynCall_vii = Module["dynCall_vii"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["jb"].apply(null, arguments)
});
var dynCall_viii = Module["dynCall_viii"] = (function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["kb"].apply(null, arguments)
});
Module["asm"] = asm;
if (!Module["intArrayFromString"]) Module["intArrayFromString"] = (function() {
    abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["intArrayToString"]) Module["intArrayToString"] = (function() {
    abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["ccall"]) Module["ccall"] = (function() {
    abort("'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["cwrap"]) Module["cwrap"] = (function() {
    abort("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["setValue"]) Module["setValue"] = (function() {
    abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["getValue"]) Module["getValue"] = (function() {
    abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["allocate"]) Module["allocate"] = (function() {
    abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
Module["getMemory"] = getMemory;
if (!Module["Pointer_stringify"]) Module["Pointer_stringify"] = (function() {
    abort("'Pointer_stringify' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["AsciiToString"]) Module["AsciiToString"] = (function() {
    abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["stringToAscii"]) Module["stringToAscii"] = (function() {
    abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["UTF8ArrayToString"]) Module["UTF8ArrayToString"] = (function() {
    abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["UTF8ToString"]) Module["UTF8ToString"] = (function() {
    abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["stringToUTF8Array"]) Module["stringToUTF8Array"] = (function() {
    abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["stringToUTF8"]) Module["stringToUTF8"] = (function() {
    abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["lengthBytesUTF8"]) Module["lengthBytesUTF8"] = (function() {
    abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["UTF16ToString"]) Module["UTF16ToString"] = (function() {
    abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["stringToUTF16"]) Module["stringToUTF16"] = (function() {
    abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["lengthBytesUTF16"]) Module["lengthBytesUTF16"] = (function() {
    abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["UTF32ToString"]) Module["UTF32ToString"] = (function() {
    abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["stringToUTF32"]) Module["stringToUTF32"] = (function() {
    abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["lengthBytesUTF32"]) Module["lengthBytesUTF32"] = (function() {
    abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["allocateUTF8"]) Module["allocateUTF8"] = (function() {
    abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["stackTrace"]) Module["stackTrace"] = (function() {
    abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["addOnPreRun"]) Module["addOnPreRun"] = (function() {
    abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["addOnInit"]) Module["addOnInit"] = (function() {
    abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["addOnPreMain"]) Module["addOnPreMain"] = (function() {
    abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["addOnExit"]) Module["addOnExit"] = (function() {
    abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["addOnPostRun"]) Module["addOnPostRun"] = (function() {
    abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["writeStringToMemory"]) Module["writeStringToMemory"] = (function() {
    abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["writeArrayToMemory"]) Module["writeArrayToMemory"] = (function() {
    abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["writeAsciiToMemory"]) Module["writeAsciiToMemory"] = (function() {
    abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
if (!Module["ENV"]) Module["ENV"] = (function() {
    abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["FS"]) Module["FS"] = (function() {
    abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
if (!Module["GL"]) Module["GL"] = (function() {
    abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["staticAlloc"]) Module["staticAlloc"] = (function() {
    abort("'staticAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["dynamicAlloc"]) Module["dynamicAlloc"] = (function() {
    abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["warnOnce"]) Module["warnOnce"] = (function() {
    abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["loadDynamicLibrary"]) Module["loadDynamicLibrary"] = (function() {
    abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["loadWebAssemblyModule"]) Module["loadWebAssemblyModule"] = (function() {
    abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["getLEB"]) Module["getLEB"] = (function() {
    abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["getFunctionTables"]) Module["getFunctionTables"] = (function() {
    abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["alignFunctionTables"]) Module["alignFunctionTables"] = (function() {
    abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["registerFunctions"]) Module["registerFunctions"] = (function() {
    abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["addFunction"]) Module["addFunction"] = (function() {
    abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["removeFunction"]) Module["removeFunction"] = (function() {
    abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["getFuncWrapper"]) Module["getFuncWrapper"] = (function() {
    abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["prettyPrint"]) Module["prettyPrint"] = (function() {
    abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["makeBigInt"]) Module["makeBigInt"] = (function() {
    abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["dynCall"]) Module["dynCall"] = (function() {
    abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["getCompilerSetting"]) Module["getCompilerSetting"] = (function() {
    abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["stackSave"]) Module["stackSave"] = (function() {
    abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["stackRestore"]) Module["stackRestore"] = (function() {
    abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["stackAlloc"]) Module["stackAlloc"] = (function() {
    abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["establishStackSpace"]) Module["establishStackSpace"] = (function() {
    abort("'establishStackSpace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["print"]) Module["print"] = (function() {
    abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["printErr"]) Module["printErr"] = (function() {
    abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
});
if (!Module["ALLOC_NORMAL"]) Object.defineProperty(Module, "ALLOC_NORMAL", {
    get: (function() {
        abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    })
});
if (!Module["ALLOC_STACK"]) Object.defineProperty(Module, "ALLOC_STACK", {
    get: (function() {
        abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    })
});
if (!Module["ALLOC_STATIC"]) Object.defineProperty(Module, "ALLOC_STATIC", {
    get: (function() {
        abort("'ALLOC_STATIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    })
});
if (!Module["ALLOC_DYNAMIC"]) Object.defineProperty(Module, "ALLOC_DYNAMIC", {
    get: (function() {
        abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    })
});
if (!Module["ALLOC_NONE"]) Object.defineProperty(Module, "ALLOC_NONE", {
    get: (function() {
        abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    })
});

function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status
}
ExitStatus.prototype = new Error;
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var calledMain = false;
dependenciesFulfilled = function runCaller() {
    if (!Module["calledRun"]) run();
    if (!Module["calledRun"]) dependenciesFulfilled = runCaller
};
Module["callMain"] = function callMain(args) {
    assert(runDependencies == 0, "cannot call main when async dependencies remain! (listen on __ATMAIN__)");
    assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
    args = args || [];
    ensureInitRuntime();
    var argc = args.length + 1;
    var argv = stackAlloc((argc + 1) * 4);
    HEAP32[argv >> 2] = allocateUTF8OnStack(Module["thisProgram"]);
    for (var i = 1; i < argc; i++) {
        HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1])
    }
    HEAP32[(argv >> 2) + argc] = 0;
    var initialEmtStackTop = Module["emtStackSave"]();
    try {
        var ret = Module["_main"](argc, argv, 0);
        if (typeof EmterpreterAsync === "object" && EmterpreterAsync.state !== 1) {
            exit(ret, true)
        }
    } catch (e) {
        if (e instanceof ExitStatus) {
            return
        } else if (e == "SimulateInfiniteLoop") {
            Module["noExitRuntime"] = true;
            Module["emtStackRestore"](initialEmtStackTop);
            return
        } else {
            var toLog = e;
            if (e && typeof e === "object" && e.stack) {
                toLog = [e, e.stack]
            }
            err("exception thrown: " + toLog);
            Module["quit"](1, e)
        }
    } finally {
        calledMain = true
    }
};

function run(args) {
    args = args || Module["arguments"];
    if (runDependencies > 0) {
        return
    }
    writeStackCookie();
    preRun();
    if (runDependencies > 0) return;
    if (Module["calledRun"]) return;

    function doRun() {
        if (Module["calledRun"]) return;
        Module["calledRun"] = true;
        if (ABORT) return;
        ensureInitRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        if (Module["_main"] && shouldRunNow) Module["callMain"](args);
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout((function() {
            setTimeout((function() {
                Module["setStatus"]("")
            }), 1);
            doRun()
        }), 1)
    } else {
        doRun()
    }
    checkStackCookie()
}
Module["run"] = run;

function checkUnflushedContent() {
    var print = out;
    var printErr = err;
    var has = false;
    out = err = (function(x) {
        has = true
    });
    try {
        var flush = Module["_fflush"];
        if (flush) flush(0);
        var hasFS = true;
        if (hasFS) {
            ["stdout", "stderr"].forEach((function(name) {
                var info = FS.analyzePath("/dev/" + name);
                if (!info) return;
                var stream = info.object;
                var rdev = stream.rdev;
                var tty = TTY.ttys[rdev];
                if (tty && tty.output && tty.output.length) {
                    has = true
                }
            }))
        }
    } catch (e) {}
    out = print;
    err = printErr;
    if (has) {
        warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.")
    }
}

function exit(status, implicit) {
    checkUnflushedContent();
    if (implicit && Module["noExitRuntime"] && status === 0) {
        return
    }
    if (Module["noExitRuntime"]) {
        if (!implicit) {
            err("exit(" + status + ") called, but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)")
        }
    } else {
        ABORT = true;
        EXITSTATUS = status;
        STACKTOP = initialStackTop;
        exitRuntime();
        if (Module["onExit"]) Module["onExit"](status)
    }
    Module["quit"](status, new ExitStatus(status))
}
var abortDecorators = [];

function abort(what) {
    if (Module["onAbort"]) {
        Module["onAbort"](what)
    }
    if (what !== undefined) {
        out(what);
        err(what);
        what = JSON.stringify(what)
    } else {
        what = ""
    }
    ABORT = true;
    EXITSTATUS = 1;
    var extra = "";
    var output = "abort(" + what + ") at " + stackTrace() + extra;
    if (abortDecorators) {
        abortDecorators.forEach((function(decorator) {
            output = decorator(output, what)
        }))
    }
    throw output
}
Module["abort"] = abort;
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) {
    shouldRunNow = false
}
Module["noExitRuntime"] = true;
run()
