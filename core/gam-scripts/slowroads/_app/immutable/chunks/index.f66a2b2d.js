var tt = Object.defineProperty;
var et = (t, e, n) => e in t ? tt(t, e, {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: n
}) : t[e] = n;
var z = (t, e, n) => (et(t, typeof e != "symbol" ? e + "" : e, n), n);
import {
  n as w,
  r as E,
  i as C,
  j as S,
  h as L,
  l as G,
  m as nt,
  p as it,
  q as rt,
  v as st,
  w as U,
  x as at,
  y as lt,
  z as ct
} from "./scheduler.6cda8fd7.js";
const V = typeof window < "u";
let M = V ? () => window.performance.now() : () => Date.now(),
  O = V ? t => requestAnimationFrame(t) : w;
const N = new Set;

function W(t) {
  N.forEach(e => {
    e.c(t) || (N.delete(e), e.f())
  }), N.size !== 0 && O(W)
}

function q(t) {
  let e;
  return N.size === 0 && O(W), {
    promise: new Promise(n => {
      N.add(e = {
        c: t,
        f: n
      })
    }),
    abort() {
      N.delete(e)
    }
  }
}
let R = !1;

function ot() {
  R = !0
}

function ut() {
  R = !1
}

function ft(t, e, n, a) {
  for (; t < e;) {
    const l = t + (e - t >> 1);
    n(l) <= a ? t = l + 1 : e = l
  }
  return t
}

function _t(t) {
  if (t.hydrate_init) return;
  t.hydrate_init = !0;
  let e = t.childNodes;
  if (t.nodeName === "HEAD") {
    const s = [];
    for (let c = 0; c < e.length; c++) {
      const _ = e[c];
      _.claim_order !== void 0 && s.push(_)
    }
    e = s
  }
  const n = new Int32Array(e.length + 1),
    a = new Int32Array(e.length);
  n[0] = -1;
  let l = 0;
  for (let s = 0; s < e.length; s++) {
    const c = e[s].claim_order,
      _ = (l > 0 && e[n[l]].claim_order <= c ? l + 1 : ft(1, l, m => e[n[m]].claim_order, c)) - 1;
    a[s] = n[_] + 1;
    const u = _ + 1;
    n[u] = s, l = Math.max(u, l)
  }
  const o = [],
    r = [];
  let i = e.length - 1;
  for (let s = n[l] + 1; s != 0; s = a[s - 1]) {
    for (o.push(e[s - 1]); i >= s; i--) r.push(e[i]);
    i--
  }
  for (; i >= 0; i--) r.push(e[i]);
  o.reverse(), r.sort((s, c) => s.claim_order - c.claim_order);
  for (let s = 0, c = 0; s < r.length; s++) {
    for (; c < o.length && r[s].claim_order >= o[c].claim_order;) c++;
    const _ = c < o.length ? o[c] : null;
    t.insertBefore(r[s], _)
  }
}

function dt(t, e) {
  t.appendChild(e)
}

function J(t) {
  if (!t) return document;
  const e = t.getRootNode ? t.getRootNode() : t.ownerDocument;
  return e && e.host ? e : t.ownerDocument
}

function mt(t) {
  const e = Q("style");
  return e.textContent = "/* empty */", ht(J(t), e), e.sheet
}

function ht(t, e) {
  return dt(t.head || t, e), e.sheet
}

function pt(t, e) {
  if (R) {
    for (_t(t), (t.actual_end_child === void 0 || t.actual_end_child !== null && t.actual_end_child.parentNode !== t) && (t.actual_end_child = t.firstChild); t.actual_end_child !== null && t.actual_end_child.claim_order === void 0;) t.actual_end_child = t.actual_end_child.nextSibling;
    e !== t.actual_end_child ? (e.claim_order !== void 0 || e.parentNode !== t) && t.insertBefore(e, t.actual_end_child) : t.actual_end_child = e.nextSibling
  } else(e.parentNode !== t || e.nextSibling !== null) && t.appendChild(e)
}

function Dt(t, e, n) {
  R && !n ? pt(t, e) : (e.parentNode !== t || e.nextSibling != n) && t.insertBefore(e, n || null)
}

function K(t) {
  t.parentNode && t.parentNode.removeChild(t)
}

function It(t, e) {
  for (let n = 0; n < t.length; n += 1) t[n] && t[n].d(e)
}

function Q(t) {
  return document.createElement(t)
}

function $t(t) {
  return document.createElementNS("http://www.w3.org/2000/svg", t)
}

function H(t) {
  return document.createTextNode(t)
}

function Pt() {
  return H(" ")
}

function Rt() {
  return H("")
}

function zt(t, e, n, a) {
  return t.addEventListener(e, n, a), () => t.removeEventListener(e, n, a)
}

function Lt(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n)
}

function Mt(t) {
  return t.dataset.svelteH
}

function Ot(t) {
  return t === "" ? null : +t
}

function yt(t) {
  return Array.from(t.childNodes)
}

function gt(t) {
  t.claim_info === void 0 && (t.claim_info = {
    last_index: 0,
    total_claimed: 0
  })
}

function X(t, e, n, a, l = !1) {
  gt(t);
  const o = (() => {
    for (let r = t.claim_info.last_index; r < t.length; r++) {
      const i = t[r];
      if (e(i)) {
        const s = n(i);
        return s === void 0 ? t.splice(r, 1) : t[r] = s, l || (t.claim_info.last_index = r), i
      }
    }
    for (let r = t.claim_info.last_index - 1; r >= 0; r--) {
      const i = t[r];
      if (e(i)) {
        const s = n(i);
        return s === void 0 ? t.splice(r, 1) : t[r] = s, l ? s === void 0 && t.claim_info.last_index-- : t.claim_info.last_index = r, i
      }
    }
    return a()
  })();
  return o.claim_order = t.claim_info.total_claimed, t.claim_info.total_claimed += 1, o
}

function Y(t, e, n, a) {
  return X(t, l => l.nodeName === e, l => {
    const o = [];
    for (let r = 0; r < l.attributes.length; r++) {
      const i = l.attributes[r];
      n[i.name] || o.push(i.name)
    }
    o.forEach(r => l.removeAttribute(r))
  }, () => a(e))
}

function qt(t, e, n) {
  return Y(t, e, n, Q)
}

function Ht(t, e, n) {
  return Y(t, e, n, $t)
}

function xt(t, e) {
  return X(t, n => n.nodeType === 3, n => {
    const a = "" + e;
    if (n.data.startsWith(a)) {
      if (n.data.length !== a.length) return n.splitText(a.length)
    } else n.data = a
  }, () => H(e), !0)
}

function Tt(t) {
  return xt(t, " ")
}

function Ft(t, e) {
  e = "" + e, t.data !== e && (t.data = e)
}

function Gt(t, e) {
  t.value = e ?? ""
}

function Ut(t, e, n, a) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, a ? "important" : "")
}

function Vt(t, e, n) {
  t.classList.toggle(e, !!n)
}

function vt(t, e, {
  bubbles: n = !1,
  cancelable: a = !1
} = {}) {
  return new CustomEvent(t, {
    detail: e,
    bubbles: n,
    cancelable: a
  })
}

function Wt(t, e) {
  return new t(e)
}
const B = new Map;
let D = 0;

function wt(t) {
  let e = 5381,
    n = t.length;
  for (; n--;) e = (e << 5) - e ^ t.charCodeAt(n);
  return e >>> 0
}

function bt(t, e) {
  const n = {
    stylesheet: mt(e),
    rules: {}
  };
  return B.set(t, n), n
}

function I(t, e, n, a, l, o, r, i = 0) {
  const s = 16.666 / a;
  let c = `{
`;
  for (let h = 0; h <= 1; h += s) {
    const $ = e + (n - e) * o(h);
    c += h * 100 + `%{${r($,1-$)}}
`
  }
  const _ = c + `100% {${r(n,1-n)}}
}`,
    u = `__svelte_${wt(_)}_${i}`,
    m = J(t),
    {
      stylesheet: p,
      rules: f
    } = B.get(m) || bt(m, t);
  f[u] || (f[u] = !0, p.insertRule(`@keyframes ${u} ${_}`, p.cssRules.length));
  const d = t.style.animation || "";
  return t.style.animation = `${d?`${d}, `:""}${u} ${a}ms linear ${l}ms 1 both`, D += 1, u
}

function P(t, e) {
  const n = (t.style.animation || "").split(", "),
    a = n.filter(e ? o => o.indexOf(e) < 0 : o => o.indexOf("__svelte") === -1),
    l = n.length - a.length;
  l && (t.style.animation = a.join(", "), D -= l, D || Nt())
}

function Nt() {
  O(() => {
    D || (B.forEach(t => {
      const {
        ownerNode: e
      } = t.stylesheet;
      e && K(e)
    }), B.clear())
  })
}
let A;

function T() {
  return A || (A = Promise.resolve(), A.then(() => {
    A = null
  })), A
}

function v(t, e, n) {
  t.dispatchEvent(vt(`${e?"intro":"outro"}${n}`))
}
const k = new Set;
let y;

function Jt() {
  y = {
    r: 0,
    c: [],
    p: y
  }
}

function Kt() {
  y.r || E(y.c), y = y.p
}

function Et(t, e) {
  t && t.i && (k.delete(t), t.i(e))
}

function Qt(t, e, n, a) {
  if (t && t.o) {
    if (k.has(t)) return;
    k.add(t), y.c.push(() => {
      k.delete(t), a && (n && t.d(1), a())
    }), t.o(e)
  } else a && a()
}
const F = {
  duration: 0
};

function Xt(t, e, n) {
  const a = {
    direction: "in"
  };
  let l = e(t, n, a),
    o = !1,
    r, i, s = 0;

  function c() {
    r && P(t, r)
  }

  function _() {
    const {
      delay: m = 0,
      duration: p = 300,
      easing: f = L,
      tick: d = w,
      css: h
    } = l || F;
    h && (r = I(t, 0, 1, p, m, f, h, s++)), d(0, 1);
    const $ = M() + m,
      g = $ + p;
    i && i.abort(), o = !0, S(() => v(t, !0, "start")), i = q(x => {
      if (o) {
        if (x >= g) return d(1, 0), v(t, !0, "end"), c(), o = !1;
        if (x >= $) {
          const b = f((x - $) / p);
          d(b, 1 - b)
        }
      }
      return o
    })
  }
  let u = !1;
  return {
    start() {
      u || (u = !0, P(t), C(l) ? (l = l(a), T().then(_)) : _())
    },
    invalidate() {
      u = !1
    },
    end() {
      o && (c(), o = !1)
    }
  }
}

function Yt(t, e, n) {
  const a = {
    direction: "out"
  };
  let l = e(t, n, a),
    o = !0,
    r;
  const i = y;
  i.r += 1;
  let s;

  function c() {
    const {
      delay: _ = 0,
      duration: u = 300,
      easing: m = L,
      tick: p = w,
      css: f
    } = l || F;
    f && (r = I(t, 1, 0, u, _, m, f));
    const d = M() + _,
      h = d + u;
    S(() => v(t, !1, "start")), "inert" in t && (s = t.inert, t.inert = !0), q($ => {
      if (o) {
        if ($ >= h) return p(0, 1), v(t, !1, "end"), --i.r || E(i.c), !1;
        if ($ >= d) {
          const g = m(($ - d) / u);
          p(1 - g, g)
        }
      }
      return o
    })
  }
  return C(l) ? T().then(() => {
    l = l(a), c()
  }) : c(), {
    end(_) {
      _ && "inert" in t && (t.inert = s), _ && l.tick && l.tick(1, 0), o && (r && P(t, r), o = !1)
    }
  }
}

function Zt(t, e, n, a) {
  let o = e(t, n, {
      direction: "both"
    }),
    r = a ? 0 : 1,
    i = null,
    s = null,
    c = null,
    _;

  function u() {
    c && P(t, c)
  }

  function m(f, d) {
    const h = f.b - r;
    return d *= Math.abs(h), {
      a: r,
      b: f.b,
      d: h,
      duration: d,
      start: f.start,
      end: f.start + d,
      group: f.group
    }
  }

  function p(f) {
    const {
      delay: d = 0,
      duration: h = 300,
      easing: $ = L,
      tick: g = w,
      css: x
    } = o || F, b = {
      start: M() + d,
      b: f
    };
    f || (b.group = y, y.r += 1), "inert" in t && (f ? _ !== void 0 && (t.inert = _) : (_ = t.inert, t.inert = !0)), i || s ? s = b : (x && (u(), c = I(t, r, f, h, d, $, x)), f && g(0, 1), i = m(b, h), S(() => v(t, f, "start")), q(j => {
      if (s && j > s.start && (i = m(s, h), s = null, v(t, i.b, "start"), x && (u(), c = I(t, r, i.b, i.duration, 0, $, o.css))), i) {
        if (j >= i.end) g(r = i.b, 1 - r), v(t, i.b, "end"), s || (i.b ? u() : --i.group.r || E(i.group.c)), i = null;
        else if (j >= i.start) {
          const Z = j - i.start;
          r = i.a + i.d * $(Z / i.duration), g(r, 1 - r)
        }
      }
      return !!(i || s)
    }))
  }
  return {
    run(f) {
      C(o) ? T().then(() => {
        o = o({
          direction: f ? "in" : "out"
        }), p(f)
      }) : p(f)
    },
    end() {
      u(), i = s = null
    }
  }
}

function te(t) {
  t && t.c()
}

function ee(t, e) {
  t && t.l(e)
}

function At(t, e, n) {
  const {
    fragment: a,
    after_update: l
  } = t.$$;
  a && a.m(e, n), S(() => {
    const o = t.$$.on_mount.map(at).filter(C);
    t.$$.on_destroy ? t.$$.on_destroy.push(...o) : E(o), t.$$.on_mount = []
  }), l.forEach(S)
}

function St(t, e) {
  const n = t.$$;
  n.fragment !== null && (rt(n.after_update), E(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = [])
}

function Ct(t, e) {
  t.$$.dirty[0] === -1 && (lt.push(t), ct(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31
}

function ne(t, e, n, a, l, o, r = null, i = [-1]) {
  const s = st;
  U(t);
  const c = t.$$ = {
    fragment: null,
    ctx: [],
    props: o,
    update: w,
    not_equal: l,
    bound: G(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (s ? s.$$.context : [])),
    callbacks: G(),
    dirty: i,
    skip_bound: !1,
    root: e.target || s.$$.root
  };
  r && r(c.root);
  let _ = !1;
  if (c.ctx = n ? n(t, e.props || {}, (u, m, ...p) => {
      const f = p.length ? p[0] : m;
      return c.ctx && l(c.ctx[u], c.ctx[u] = f) && (!c.skip_bound && c.bound[u] && c.bound[u](f), _ && Ct(t, u)), m
    }) : [], c.update(), _ = !0, E(c.before_update), c.fragment = a ? a(c.ctx) : !1, e.target) {
    if (e.hydrate) {
      ot();
      const u = yt(e.target);
      c.fragment && c.fragment.l(u), u.forEach(K)
    } else c.fragment && c.fragment.c();
    e.intro && Et(t.$$.fragment), At(t, e.target, e.anchor), ut(), nt()
  }
  U(s)
}
class ie {
  constructor() {
    z(this, "$$");
    z(this, "$$set")
  }
  $destroy() {
    St(this, 1), this.$destroy = w
  }
  $on(e, n) {
    if (!C(n)) return w;
    const a = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return a.push(n), () => {
      const l = a.indexOf(n);
      l !== -1 && a.splice(l, 1)
    }
  }
  $set(e) {
    this.$$set && !it(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1)
  }
}
const jt = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = {
  v: new Set
})).v.add(jt);
export {
  It as A, Vt as B, Gt as C, Ot as D, Zt as E, $t as F, Ht as G, Xt as H, Yt as I, ie as S, Dt as a, Kt as b, Tt as c, Et as d, Rt as e, K as f, Q as g, qt as h, ne as i, yt as j, Lt as k, Ut as l, H as m, xt as n, Ft as o, Jt as p, Wt as q, te as r, Pt as s, Qt as t, ee as u, At as v, St as w, pt as x, Mt as y, zt as z
};