(() => {
    "use strict";

    function e() {
        let e;
        try {
            e = performance.getEntriesByType("resource").map((e => e.encodedBodySize)).reduce(((e, t) => e + t)), e += performance.getEntriesByType("navigation")[0].encodedBodySize
        } catch {}
        return e
    }

    // Removed query param parser and all uses of window.location
    const o = false, // kids mode disabled
          r = !!window.adBridge, // keep adBridge check
          i = false; // hoist mode disabled

    const a = new class {
        #e = [];
        enqueue(e, t, r, i) {
            const a = {
                fn: e,
                args: t || [],
                resolveFn: r,
                rejectFn: i
            };
            o ? r && r(!0) : this.#e.push(a)
        }
        dequeue() {
            for (; this.#e.length > 0;) {
                const e = this.#e.shift(),
                    {
                        fn: t,
                        args: o
                    } = e;
                if ("function" == typeof window.PokiSDK[t])
                    if (e?.resolveFn || e?.rejectFn) {
                        const r = "init" === t;
                        if (window.PokiSDK[t](...o).catch(((...t) => {
                                "function" == typeof e.rejectFn && e.rejectFn(...t), r && setTimeout((() => {
                                    this.dequeue()
                                }), 0)
                            })).then(((...t) => {
                                "function" == typeof e.resolveFn && e.resolveFn(...t), r && setTimeout((() => {
                                    this.dequeue()
                                }), 0)
                            })), r) break
                    } else window.PokiSDK[t](...o);
                else console.error(`%cPOKI:%c cannot execute ${t}`, "font-weight: bold", "")
            }
        }
        init = (e = {}, t = {}) => new Promise(((o, r) => {
            this.enqueue("init", [e, t], o, r)
        }));
        rewardedBreak = () => new Promise((e => {
            e(!1)
        }));
        commercialBreak = e => new Promise(((t, o) => {
            this.enqueue("commercialBreak", [e], t, o)
        }));
        displayAd = (e, t, o, r) => {
            r && r(!0), o && o()
        };
        withArguments = e => (...t) => {
            this.enqueue(e, t)
        };
        handleAutoResolvePromise = () => new Promise((e => {
            e()
        }));
        throwNotLoaded = () => {
            console.debug("PokiSDK is not loaded yet. Not all methods are available.")
        };
        doNothing = () => {};
        getUser = async () => new Promise(((e, t) => {
            this.enqueue("getUser", [], e, t)
        }));
        login = async () => new Promise(((e, t) => {
            this.enqueue("login", [], e, t)
        }))
    };

    // PokiSDK assignment
    if (window.PokiSDK = {
            init: a.init,
            initWithVideoHB: a.init,
            commercialBreak: a.commercialBreak,
            rewardedBreak: a.rewardedBreak,
            displayAd: a.displayAd,
            destroyAd: a.doNothing,
            getLeaderboard: a.handleAutoResolvePromise,
            shareableURL: () => new Promise(((e, t) => {
                t()
            })),
            getURLParam: e => "", // always return blank
            getLanguage: () => navigator.language.toLowerCase().split("-")[0],
            isAdBlocked: () => {}
        }, ["captureError", "customEvent", "gameInteractive", "gameLoadingFinished", "gameLoadingProgress", "gameLoadingStart", "gameplayStart", "gameplayStop", "happyTime", "logError", "muteAd", "roundEnd", "roundStart", "sendHighscore", "setDebug", "setDebugTouchOverlayController", "setLogging", "setPlayerAge", "setPlaytestCanvas", "enableEventTracking", "playtestSetCanvas", "playtestCaptureHtmlOnce", "playtestCaptureHtmlForce", "playtestCaptureHtmlOn", "playtestCaptureHtmlOff"].forEach((e => {
            window.PokiSDK[e] = a.withArguments(e)
        })), !r && !o) {
        window.pokiCancelProgressInterval = setInterval((() => {
            window.parent.postMessage({
                type: "pokiProgress",
                downloaded: e()
            }, "*")
        }), 1e3);
        try {
            let user_id = localStorage.getItem("poki_events_user_id");
            user_id || (user_id = crypto.randomUUID(), localStorage.setItem("poki_events_user_id", user_id));

            // Instead of query params, set these to your own defaults
            const game_id = "default_game_id";
            const game_version_id = "default_game_version_id";
            if (!game_id || !game_version_id) throw 1;

            const isNewUser = "1" === localStorage.getItem("poki_pbf");
            const isInt = e => /^[-+]?\d+$/.test(e.trim());
            const isAllowed = (e, t, o) => "game" === e && "loading" === t && "start" === o || (
                "game" === e && "loading" === t && "complete" === o ||
                "game" === e && "launch" === t && "" === o ||
                "game" === e && "meaningful" === t && "first" === o ||
                "tutorial" === e && "start" === t && "" === o ||
                "tutorial" === e && "complete" === t && "" === o ||
                (!("progress" !== e || "start" !== t || !isInt(o)) ||
                !("progress" !== e || "complete" !== t || !isInt(o)) ||
                !("progress" !== e || "fail" !== t || !isInt(o)) ||
                "rewarded" === e && "visible" === t ||
                "rewarded" === e && "click" === t ||
                !("rewarded" !== e || "start" !== t || !isInt(o)) ||
                !("rewarded" !== e || "complete" !== t || !isInt(o)) ||
                !("midroll" !== e || "start" !== t || !isInt(o)) ||
                !("midroll" !== e || "complete" !== t || !isInt(o)) ||
                "custom" === e));

            window.PokiSDK.measure = (t, a, s) => {
                "level" === (t = `${t}`) && (t = "progress");
                isAllowed(t, a = void 0 === a ? "" : `${a}`, s = void 0 === s ? "" : `${s}`) ? (
                    window.pokiMeasureBuildin = !0,
                    window.parent.postMessage({
                        type: "pokiMessageEvent",
                        content: {
                            event: "pokiTrackingMeasure",
                            data: {
                                category: t,
                                action: a,
                                label: s
                            }
                        }
                    }, "*"),
                    fetch("https://t.poki.io/game-event", {
                        method: "POST",
                        headers: { "Content-Type": "text/plain" },
                        body: JSON.stringify({
                            category: t,
                            action: a,
                            label: s,
                            p4d_game_id: game_id,
                            p4d_version_id: game_version_id,
                            time_on_page: Math.floor(performance.now()),
                            user_id: user_id,
                            user_new: !isNewUser
                        }),
                        mode: "no-cors",
                        keepalive: !0,
                        credentials: "omit"
                    }).catch((e => {
                        console.warn("%cPOKI:%c failed to measure", "font-weight: bold", "", e)
                    }))
                ) : console.warn(`%cPOKI:%c measure() event not allowed: ${t}-${a}-${s}`, "font-weight: bold", "")
            },
            window.PokiSDK.measure("game", "loading", "start"),
            window.pokiMeasureBuildin = !1
        } catch {
            window.PokiSDK.measure = () => {}
        }
    }

    // Always load the core script (removes location-based logic)
    const sdk_version = window.pokiSDKVersion || "84a4c9242cc184d7ba10f21a56f364e28e96d993";
    const sdk_file = `poki-sdk-core-${sdk_version}.js`;
    const sdk_url = `https://game-cdn.poki.com/scripts/${sdk_version}/${sdk_file}`;
    const s = document.createElement("script");
    s.setAttribute("src", sdk_url);
    s.setAttribute("type", "text/javascript");
    s.setAttribute("crossOrigin", "anonymous");
    s.onload = () => a.dequeue();
    document.head.appendChild(s);
})();
