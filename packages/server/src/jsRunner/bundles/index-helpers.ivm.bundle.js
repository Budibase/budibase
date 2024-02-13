"use strict";
var helpers = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../../node_modules/dayjs/dayjs.min.js
  var require_dayjs_min = __commonJS({
    "../../node_modules/dayjs/dayjs.min.js"(exports, module) {
      !function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
      }(exports, function() {
        "use strict";
        var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
          var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
          return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
        } }, m = function(t2, e2, n2) {
          var r2 = String(t2);
          return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
        }, v = { s: m, z: function(t2) {
          var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
          return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
        }, m: function t2(e2, n2) {
          if (e2.date() < n2.date())
            return -t2(n2, e2);
          var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
          return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
        }, a: function(t2) {
          return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
        }, p: function(t2) {
          return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
        }, u: function(t2) {
          return void 0 === t2;
        } }, g = "en", D = {};
        D[g] = M;
        var p = "$isDayjsObject", S = function(t2) {
          return t2 instanceof _ || !(!t2 || !t2[p]);
        }, w = function t2(e2, n2, r2) {
          var i2;
          if (!e2)
            return g;
          if ("string" == typeof e2) {
            var s2 = e2.toLowerCase();
            D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
            var u2 = e2.split("-");
            if (!i2 && u2.length > 1)
              return t2(u2[0]);
          } else {
            var a2 = e2.name;
            D[a2] = e2, i2 = a2;
          }
          return !r2 && i2 && (g = i2), i2 || !r2 && g;
        }, O = function(t2, e2) {
          if (S(t2))
            return t2.clone();
          var n2 = "object" == typeof e2 ? e2 : {};
          return n2.date = t2, n2.args = arguments, new _(n2);
        }, b = v;
        b.l = w, b.i = S, b.w = function(t2, e2) {
          return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
        };
        var _ = function() {
          function M2(t2) {
            this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
          }
          var m2 = M2.prototype;
          return m2.parse = function(t2) {
            this.$d = function(t3) {
              var e2 = t3.date, n2 = t3.utc;
              if (null === e2)
                return /* @__PURE__ */ new Date(NaN);
              if (b.u(e2))
                return /* @__PURE__ */ new Date();
              if (e2 instanceof Date)
                return new Date(e2);
              if ("string" == typeof e2 && !/Z$/i.test(e2)) {
                var r2 = e2.match($);
                if (r2) {
                  var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                  return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
                }
              }
              return new Date(e2);
            }(t2), this.init();
          }, m2.init = function() {
            var t2 = this.$d;
            this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
          }, m2.$utils = function() {
            return b;
          }, m2.isValid = function() {
            return !(this.$d.toString() === l);
          }, m2.isSame = function(t2, e2) {
            var n2 = O(t2);
            return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
          }, m2.isAfter = function(t2, e2) {
            return O(t2) < this.startOf(e2);
          }, m2.isBefore = function(t2, e2) {
            return this.endOf(e2) < O(t2);
          }, m2.$g = function(t2, e2, n2) {
            return b.u(t2) ? this[e2] : this.set(n2, t2);
          }, m2.unix = function() {
            return Math.floor(this.valueOf() / 1e3);
          }, m2.valueOf = function() {
            return this.$d.getTime();
          }, m2.startOf = function(t2, e2) {
            var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
              var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
              return r2 ? i2 : i2.endOf(a);
            }, $2 = function(t3, e3) {
              return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
            }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
            switch (f2) {
              case h:
                return r2 ? l2(1, 0) : l2(31, 11);
              case c:
                return r2 ? l2(1, M3) : l2(0, M3 + 1);
              case o:
                var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
                return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
              case a:
              case d:
                return $2(v2 + "Hours", 0);
              case u:
                return $2(v2 + "Minutes", 1);
              case s:
                return $2(v2 + "Seconds", 2);
              case i:
                return $2(v2 + "Milliseconds", 3);
              default:
                return this.clone();
            }
          }, m2.endOf = function(t2) {
            return this.startOf(t2, false);
          }, m2.$set = function(t2, e2) {
            var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
            if (o2 === c || o2 === h) {
              var y2 = this.clone().set(d, 1);
              y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
            } else
              l2 && this.$d[l2]($2);
            return this.init(), this;
          }, m2.set = function(t2, e2) {
            return this.clone().$set(t2, e2);
          }, m2.get = function(t2) {
            return this[b.p(t2)]();
          }, m2.add = function(r2, f2) {
            var d2, l2 = this;
            r2 = Number(r2);
            var $2 = b.p(f2), y2 = function(t2) {
              var e2 = O(l2);
              return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
            };
            if ($2 === c)
              return this.set(c, this.$M + r2);
            if ($2 === h)
              return this.set(h, this.$y + r2);
            if ($2 === a)
              return y2(1);
            if ($2 === o)
              return y2(7);
            var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
            return b.w(m3, this);
          }, m2.subtract = function(t2, e2) {
            return this.add(-1 * t2, e2);
          }, m2.format = function(t2) {
            var e2 = this, n2 = this.$locale();
            if (!this.isValid())
              return n2.invalidDate || l;
            var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
              return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
            }, d2 = function(t3) {
              return b.s(s2 % 12 || 12, t3, "0");
            }, $2 = f2 || function(t3, e3, n3) {
              var r3 = t3 < 12 ? "AM" : "PM";
              return n3 ? r3.toLowerCase() : r3;
            };
            return r2.replace(y, function(t3, r3) {
              return r3 || function(t4) {
                switch (t4) {
                  case "YY":
                    return String(e2.$y).slice(-2);
                  case "YYYY":
                    return b.s(e2.$y, 4, "0");
                  case "M":
                    return a2 + 1;
                  case "MM":
                    return b.s(a2 + 1, 2, "0");
                  case "MMM":
                    return h2(n2.monthsShort, a2, c2, 3);
                  case "MMMM":
                    return h2(c2, a2);
                  case "D":
                    return e2.$D;
                  case "DD":
                    return b.s(e2.$D, 2, "0");
                  case "d":
                    return String(e2.$W);
                  case "dd":
                    return h2(n2.weekdaysMin, e2.$W, o2, 2);
                  case "ddd":
                    return h2(n2.weekdaysShort, e2.$W, o2, 3);
                  case "dddd":
                    return o2[e2.$W];
                  case "H":
                    return String(s2);
                  case "HH":
                    return b.s(s2, 2, "0");
                  case "h":
                    return d2(1);
                  case "hh":
                    return d2(2);
                  case "a":
                    return $2(s2, u2, true);
                  case "A":
                    return $2(s2, u2, false);
                  case "m":
                    return String(u2);
                  case "mm":
                    return b.s(u2, 2, "0");
                  case "s":
                    return String(e2.$s);
                  case "ss":
                    return b.s(e2.$s, 2, "0");
                  case "SSS":
                    return b.s(e2.$ms, 3, "0");
                  case "Z":
                    return i2;
                }
                return null;
              }(t3) || i2.replace(":", "");
            });
          }, m2.utcOffset = function() {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
          }, m2.diff = function(r2, d2, l2) {
            var $2, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
              return b.m(y2, m3);
            };
            switch (M3) {
              case h:
                $2 = D2() / 12;
                break;
              case c:
                $2 = D2();
                break;
              case f:
                $2 = D2() / 3;
                break;
              case o:
                $2 = (g2 - v2) / 6048e5;
                break;
              case a:
                $2 = (g2 - v2) / 864e5;
                break;
              case u:
                $2 = g2 / n;
                break;
              case s:
                $2 = g2 / e;
                break;
              case i:
                $2 = g2 / t;
                break;
              default:
                $2 = g2;
            }
            return l2 ? $2 : b.a($2);
          }, m2.daysInMonth = function() {
            return this.endOf(c).$D;
          }, m2.$locale = function() {
            return D[this.$L];
          }, m2.locale = function(t2, e2) {
            if (!t2)
              return this.$L;
            var n2 = this.clone(), r2 = w(t2, e2, true);
            return r2 && (n2.$L = r2), n2;
          }, m2.clone = function() {
            return b.w(this.$d, this);
          }, m2.toDate = function() {
            return new Date(this.valueOf());
          }, m2.toJSON = function() {
            return this.isValid() ? this.toISOString() : null;
          }, m2.toISOString = function() {
            return this.$d.toISOString();
          }, m2.toString = function() {
            return this.$d.toUTCString();
          }, M2;
        }(), k = _.prototype;
        return O.prototype = k, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
          k[t2[1]] = function(e2) {
            return this.$g(e2, t2[0], t2[1]);
          };
        }), O.extend = function(t2, e2) {
          return t2.$i || (t2(e2, _, O), t2.$i = true), O;
        }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
          return O(1e3 * t2);
        }, O.en = D[g], O.Ls = D, O.p = {}, O;
      });
    }
  });

  // ../../node_modules/dayjs/plugin/duration.js
  var require_duration = __commonJS({
    "../../node_modules/dayjs/plugin/duration.js"(exports, module) {
      !function(t, s) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = s() : "function" == typeof define && define.amd ? define(s) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_duration = s();
      }(exports, function() {
        "use strict";
        var t, s, n = 1e3, i = 6e4, e = 36e5, r = 864e5, o = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, u = 31536e6, d = 2628e6, a = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/, h = { years: u, months: d, days: r, hours: e, minutes: i, seconds: n, milliseconds: 1, weeks: 6048e5 }, c = function(t2) {
          return t2 instanceof g;
        }, f = function(t2, s2, n2) {
          return new g(t2, n2, s2.$l);
        }, m = function(t2) {
          return s.p(t2) + "s";
        }, l = function(t2) {
          return t2 < 0;
        }, $ = function(t2) {
          return l(t2) ? Math.ceil(t2) : Math.floor(t2);
        }, y = function(t2) {
          return Math.abs(t2);
        }, v = function(t2, s2) {
          return t2 ? l(t2) ? { negative: true, format: "" + y(t2) + s2 } : { negative: false, format: "" + t2 + s2 } : { negative: false, format: "" };
        }, g = function() {
          function l2(t2, s2, n2) {
            var i2 = this;
            if (this.$d = {}, this.$l = n2, void 0 === t2 && (this.$ms = 0, this.parseFromMilliseconds()), s2)
              return f(t2 * h[m(s2)], this);
            if ("number" == typeof t2)
              return this.$ms = t2, this.parseFromMilliseconds(), this;
            if ("object" == typeof t2)
              return Object.keys(t2).forEach(function(s3) {
                i2.$d[m(s3)] = t2[s3];
              }), this.calMilliseconds(), this;
            if ("string" == typeof t2) {
              var e2 = t2.match(a);
              if (e2) {
                var r2 = e2.slice(2).map(function(t3) {
                  return null != t3 ? Number(t3) : 0;
                });
                return this.$d.years = r2[0], this.$d.months = r2[1], this.$d.weeks = r2[2], this.$d.days = r2[3], this.$d.hours = r2[4], this.$d.minutes = r2[5], this.$d.seconds = r2[6], this.calMilliseconds(), this;
              }
            }
            return this;
          }
          var y2 = l2.prototype;
          return y2.calMilliseconds = function() {
            var t2 = this;
            this.$ms = Object.keys(this.$d).reduce(function(s2, n2) {
              return s2 + (t2.$d[n2] || 0) * h[n2];
            }, 0);
          }, y2.parseFromMilliseconds = function() {
            var t2 = this.$ms;
            this.$d.years = $(t2 / u), t2 %= u, this.$d.months = $(t2 / d), t2 %= d, this.$d.days = $(t2 / r), t2 %= r, this.$d.hours = $(t2 / e), t2 %= e, this.$d.minutes = $(t2 / i), t2 %= i, this.$d.seconds = $(t2 / n), t2 %= n, this.$d.milliseconds = t2;
          }, y2.toISOString = function() {
            var t2 = v(this.$d.years, "Y"), s2 = v(this.$d.months, "M"), n2 = +this.$d.days || 0;
            this.$d.weeks && (n2 += 7 * this.$d.weeks);
            var i2 = v(n2, "D"), e2 = v(this.$d.hours, "H"), r2 = v(this.$d.minutes, "M"), o2 = this.$d.seconds || 0;
            this.$d.milliseconds && (o2 += this.$d.milliseconds / 1e3, o2 = Math.round(1e3 * o2) / 1e3);
            var u2 = v(o2, "S"), d2 = t2.negative || s2.negative || i2.negative || e2.negative || r2.negative || u2.negative, a2 = e2.format || r2.format || u2.format ? "T" : "", h2 = (d2 ? "-" : "") + "P" + t2.format + s2.format + i2.format + a2 + e2.format + r2.format + u2.format;
            return "P" === h2 || "-P" === h2 ? "P0D" : h2;
          }, y2.toJSON = function() {
            return this.toISOString();
          }, y2.format = function(t2) {
            var n2 = t2 || "YYYY-MM-DDTHH:mm:ss", i2 = { Y: this.$d.years, YY: s.s(this.$d.years, 2, "0"), YYYY: s.s(this.$d.years, 4, "0"), M: this.$d.months, MM: s.s(this.$d.months, 2, "0"), D: this.$d.days, DD: s.s(this.$d.days, 2, "0"), H: this.$d.hours, HH: s.s(this.$d.hours, 2, "0"), m: this.$d.minutes, mm: s.s(this.$d.minutes, 2, "0"), s: this.$d.seconds, ss: s.s(this.$d.seconds, 2, "0"), SSS: s.s(this.$d.milliseconds, 3, "0") };
            return n2.replace(o, function(t3, s2) {
              return s2 || String(i2[t3]);
            });
          }, y2.as = function(t2) {
            return this.$ms / h[m(t2)];
          }, y2.get = function(t2) {
            var s2 = this.$ms, n2 = m(t2);
            return "milliseconds" === n2 ? s2 %= 1e3 : s2 = "weeks" === n2 ? $(s2 / h[n2]) : this.$d[n2], s2 || 0;
          }, y2.add = function(t2, s2, n2) {
            var i2;
            return i2 = s2 ? t2 * h[m(s2)] : c(t2) ? t2.$ms : f(t2, this).$ms, f(this.$ms + i2 * (n2 ? -1 : 1), this);
          }, y2.subtract = function(t2, s2) {
            return this.add(t2, s2, true);
          }, y2.locale = function(t2) {
            var s2 = this.clone();
            return s2.$l = t2, s2;
          }, y2.clone = function() {
            return f(this.$ms, this);
          }, y2.humanize = function(s2) {
            return t().add(this.$ms, "ms").locale(this.$l).fromNow(!s2);
          }, y2.valueOf = function() {
            return this.asMilliseconds();
          }, y2.milliseconds = function() {
            return this.get("milliseconds");
          }, y2.asMilliseconds = function() {
            return this.as("milliseconds");
          }, y2.seconds = function() {
            return this.get("seconds");
          }, y2.asSeconds = function() {
            return this.as("seconds");
          }, y2.minutes = function() {
            return this.get("minutes");
          }, y2.asMinutes = function() {
            return this.as("minutes");
          }, y2.hours = function() {
            return this.get("hours");
          }, y2.asHours = function() {
            return this.as("hours");
          }, y2.days = function() {
            return this.get("days");
          }, y2.asDays = function() {
            return this.as("days");
          }, y2.weeks = function() {
            return this.get("weeks");
          }, y2.asWeeks = function() {
            return this.as("weeks");
          }, y2.months = function() {
            return this.get("months");
          }, y2.asMonths = function() {
            return this.as("months");
          }, y2.years = function() {
            return this.get("years");
          }, y2.asYears = function() {
            return this.as("years");
          }, l2;
        }(), p = function(t2, s2, n2) {
          return t2.add(s2.years() * n2, "y").add(s2.months() * n2, "M").add(s2.days() * n2, "d").add(s2.hours() * n2, "h").add(s2.minutes() * n2, "m").add(s2.seconds() * n2, "s").add(s2.milliseconds() * n2, "ms");
        };
        return function(n2, i2, e2) {
          t = e2, s = e2().$utils(), e2.duration = function(t2, s2) {
            var n3 = e2.locale();
            return f(t2, { $l: n3 }, s2);
          }, e2.isDuration = c;
          var r2 = i2.prototype.add, o2 = i2.prototype.subtract;
          i2.prototype.add = function(t2, s2) {
            return c(t2) ? p(this, t2, 1) : r2.bind(this)(t2, s2);
          }, i2.prototype.subtract = function(t2, s2) {
            return c(t2) ? p(this, t2, -1) : o2.bind(this)(t2, s2);
          };
        };
      });
    }
  });

  // ../../node_modules/dayjs/plugin/advancedFormat.js
  var require_advancedFormat = __commonJS({
    "../../node_modules/dayjs/plugin/advancedFormat.js"(exports, module) {
      !function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_advancedFormat = t();
      }(exports, function() {
        "use strict";
        return function(e, t) {
          var r = t.prototype, n = r.format;
          r.format = function(e2) {
            var t2 = this, r2 = this.$locale();
            if (!this.isValid())
              return n.bind(this)(e2);
            var s = this.$utils(), a = (e2 || "YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, function(e3) {
              switch (e3) {
                case "Q":
                  return Math.ceil((t2.$M + 1) / 3);
                case "Do":
                  return r2.ordinal(t2.$D);
                case "gggg":
                  return t2.weekYear();
                case "GGGG":
                  return t2.isoWeekYear();
                case "wo":
                  return r2.ordinal(t2.week(), "W");
                case "w":
                case "ww":
                  return s.s(t2.week(), "w" === e3 ? 1 : 2, "0");
                case "W":
                case "WW":
                  return s.s(t2.isoWeek(), "W" === e3 ? 1 : 2, "0");
                case "k":
                case "kk":
                  return s.s(String(0 === t2.$H ? 24 : t2.$H), "k" === e3 ? 1 : 2, "0");
                case "X":
                  return Math.floor(t2.$d.getTime() / 1e3);
                case "x":
                  return t2.$d.getTime();
                case "z":
                  return "[" + t2.offsetName() + "]";
                case "zzz":
                  return "[" + t2.offsetName("long") + "]";
                default:
                  return e3;
              }
            });
            return n.bind(this)(a);
          };
        };
      });
    }
  });

  // ../../node_modules/dayjs/plugin/isoWeek.js
  var require_isoWeek = __commonJS({
    "../../node_modules/dayjs/plugin/isoWeek.js"(exports, module) {
      !function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_isoWeek = t();
      }(exports, function() {
        "use strict";
        var e = "day";
        return function(t, i, s) {
          var a = function(t2) {
            return t2.add(4 - t2.isoWeekday(), e);
          }, d = i.prototype;
          d.isoWeekYear = function() {
            return a(this).year();
          }, d.isoWeek = function(t2) {
            if (!this.$utils().u(t2))
              return this.add(7 * (t2 - this.isoWeek()), e);
            var i2, d2, n2, o, r = a(this), u = (i2 = this.isoWeekYear(), d2 = this.$u, n2 = (d2 ? s.utc : s)().year(i2).startOf("year"), o = 4 - n2.isoWeekday(), n2.isoWeekday() > 4 && (o += 7), n2.add(o, e));
            return r.diff(u, "week") + 1;
          }, d.isoWeekday = function(e2) {
            return this.$utils().u(e2) ? this.day() || 7 : this.day(this.day() % 7 ? e2 : e2 - 7);
          };
          var n = d.startOf;
          d.startOf = function(e2, t2) {
            var i2 = this.$utils(), s2 = !!i2.u(t2) || t2;
            return "isoweek" === i2.p(e2) ? s2 ? this.date(this.date() - (this.isoWeekday() - 1)).startOf("day") : this.date(this.date() - 1 - (this.isoWeekday() - 1) + 7).endOf("day") : n.bind(this)(e2, t2);
          };
        };
      });
    }
  });

  // ../../node_modules/dayjs/plugin/weekYear.js
  var require_weekYear = __commonJS({
    "../../node_modules/dayjs/plugin/weekYear.js"(exports, module) {
      !function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_weekYear = t();
      }(exports, function() {
        "use strict";
        return function(e, t) {
          t.prototype.weekYear = function() {
            var e2 = this.month(), t2 = this.week(), n = this.year();
            return 1 === t2 && 11 === e2 ? n + 1 : 0 === e2 && t2 >= 52 ? n - 1 : n;
          };
        };
      });
    }
  });

  // ../../node_modules/dayjs/plugin/weekOfYear.js
  var require_weekOfYear = __commonJS({
    "../../node_modules/dayjs/plugin/weekOfYear.js"(exports, module) {
      !function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_weekOfYear = t();
      }(exports, function() {
        "use strict";
        var e = "week", t = "year";
        return function(i, n, r) {
          var f = n.prototype;
          f.week = function(i2) {
            if (void 0 === i2 && (i2 = null), null !== i2)
              return this.add(7 * (i2 - this.week()), "day");
            var n2 = this.$locale().yearStart || 1;
            if (11 === this.month() && this.date() > 25) {
              var f2 = r(this).startOf(t).add(1, t).date(n2), s = r(this).endOf(e);
              if (f2.isBefore(s))
                return 1;
            }
            var a = r(this).startOf(t).date(n2).startOf(e).subtract(1, "millisecond"), o = this.diff(a, e, true);
            return o < 0 ? r(this).startOf("week").week() : Math.ceil(o);
          }, f.weeks = function(e2) {
            return void 0 === e2 && (e2 = null), this.week(e2);
          };
        };
      });
    }
  });

  // ../../node_modules/dayjs/plugin/relativeTime.js
  var require_relativeTime = __commonJS({
    "../../node_modules/dayjs/plugin/relativeTime.js"(exports, module) {
      !function(r, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (r = "undefined" != typeof globalThis ? globalThis : r || self).dayjs_plugin_relativeTime = e();
      }(exports, function() {
        "use strict";
        return function(r, e, t) {
          r = r || {};
          var n = e.prototype, o = { future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" };
          function i(r2, e2, t2, o2) {
            return n.fromToBase(r2, e2, t2, o2);
          }
          t.en.relativeTime = o, n.fromToBase = function(e2, n2, i2, d2, u) {
            for (var f, a, s, l = i2.$locale().relativeTime || o, h = r.thresholds || [{ l: "s", r: 44, d: "second" }, { l: "m", r: 89 }, { l: "mm", r: 44, d: "minute" }, { l: "h", r: 89 }, { l: "hh", r: 21, d: "hour" }, { l: "d", r: 35 }, { l: "dd", r: 25, d: "day" }, { l: "M", r: 45 }, { l: "MM", r: 10, d: "month" }, { l: "y", r: 17 }, { l: "yy", d: "year" }], m = h.length, c = 0; c < m; c += 1) {
              var y = h[c];
              y.d && (f = d2 ? t(e2).diff(i2, y.d, true) : i2.diff(e2, y.d, true));
              var p = (r.rounding || Math.round)(Math.abs(f));
              if (s = f > 0, p <= y.r || !y.r) {
                p <= 1 && c > 0 && (y = h[c - 1]);
                var v = l[y.l];
                u && (p = u("" + p)), a = "string" == typeof v ? v.replace("%d", p) : v(p, n2, y.l, s);
                break;
              }
            }
            if (n2)
              return a;
            var M = s ? l.future : l.past;
            return "function" == typeof M ? M(a) : M.replace("%s", a);
          }, n.to = function(r2, e2) {
            return i(r2, e2, this, true);
          }, n.from = function(r2, e2) {
            return i(r2, e2, this);
          };
          var d = function(r2) {
            return r2.$u ? t.utc() : t();
          };
          n.toNow = function(r2) {
            return this.to(d(this), r2);
          }, n.fromNow = function(r2) {
            return this.from(d(this), r2);
          };
        };
      });
    }
  });

  // ../../node_modules/dayjs/plugin/utc.js
  var require_utc = __commonJS({
    "../../node_modules/dayjs/plugin/utc.js"(exports, module) {
      !function(t, i) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_utc = i();
      }(exports, function() {
        "use strict";
        var t = "minute", i = /[+-]\d\d(?::?\d\d)?/g, e = /([+-]|\d\d)/g;
        return function(s, f, n) {
          var u = f.prototype;
          n.utc = function(t2) {
            var i2 = { date: t2, utc: true, args: arguments };
            return new f(i2);
          }, u.utc = function(i2) {
            var e2 = n(this.toDate(), { locale: this.$L, utc: true });
            return i2 ? e2.add(this.utcOffset(), t) : e2;
          }, u.local = function() {
            return n(this.toDate(), { locale: this.$L, utc: false });
          };
          var o = u.parse;
          u.parse = function(t2) {
            t2.utc && (this.$u = true), this.$utils().u(t2.$offset) || (this.$offset = t2.$offset), o.call(this, t2);
          };
          var r = u.init;
          u.init = function() {
            if (this.$u) {
              var t2 = this.$d;
              this.$y = t2.getUTCFullYear(), this.$M = t2.getUTCMonth(), this.$D = t2.getUTCDate(), this.$W = t2.getUTCDay(), this.$H = t2.getUTCHours(), this.$m = t2.getUTCMinutes(), this.$s = t2.getUTCSeconds(), this.$ms = t2.getUTCMilliseconds();
            } else
              r.call(this);
          };
          var a = u.utcOffset;
          u.utcOffset = function(s2, f2) {
            var n2 = this.$utils().u;
            if (n2(s2))
              return this.$u ? 0 : n2(this.$offset) ? a.call(this) : this.$offset;
            if ("string" == typeof s2 && (s2 = function(t2) {
              void 0 === t2 && (t2 = "");
              var s3 = t2.match(i);
              if (!s3)
                return null;
              var f3 = ("" + s3[0]).match(e) || ["-", 0, 0], n3 = f3[0], u3 = 60 * +f3[1] + +f3[2];
              return 0 === u3 ? 0 : "+" === n3 ? u3 : -u3;
            }(s2), null === s2))
              return this;
            var u2 = Math.abs(s2) <= 16 ? 60 * s2 : s2, o2 = this;
            if (f2)
              return o2.$offset = u2, o2.$u = 0 === s2, o2;
            if (0 !== s2) {
              var r2 = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
              (o2 = this.local().add(u2 + r2, t)).$offset = u2, o2.$x.$localOffset = r2;
            } else
              o2 = this.utc();
            return o2;
          };
          var h = u.format;
          u.format = function(t2) {
            var i2 = t2 || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
            return h.call(this, i2);
          }, u.valueOf = function() {
            var t2 = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
            return this.$d.valueOf() - 6e4 * t2;
          }, u.isUTC = function() {
            return !!this.$u;
          }, u.toISOString = function() {
            return this.toDate().toISOString();
          }, u.toString = function() {
            return this.toDate().toUTCString();
          };
          var l = u.toDate;
          u.toDate = function(t2) {
            return "s" === t2 && this.$offset ? n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : l.call(this);
          };
          var c = u.diff;
          u.diff = function(t2, i2, e2) {
            if (t2 && this.$u === t2.$u)
              return c.call(this, t2, i2, e2);
            var s2 = this.local(), f2 = n(t2).local();
            return c.call(s2, f2, i2, e2);
          };
        };
      });
    }
  });

  // ../../node_modules/dayjs/plugin/timezone.js
  var require_timezone = __commonJS({
    "../../node_modules/dayjs/plugin/timezone.js"(exports, module) {
      !function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_timezone = e();
      }(exports, function() {
        "use strict";
        var t = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 }, e = {};
        return function(n, i, o) {
          var r, a = function(t2, n2, i2) {
            void 0 === i2 && (i2 = {});
            var o2 = new Date(t2), r2 = function(t3, n3) {
              void 0 === n3 && (n3 = {});
              var i3 = n3.timeZoneName || "short", o3 = t3 + "|" + i3, r3 = e[o3];
              return r3 || (r3 = new Intl.DateTimeFormat("en-US", { hour12: false, timeZone: t3, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: i3 }), e[o3] = r3), r3;
            }(n2, i2);
            return r2.formatToParts(o2);
          }, u = function(e2, n2) {
            for (var i2 = a(e2, n2), r2 = [], u2 = 0; u2 < i2.length; u2 += 1) {
              var f2 = i2[u2], s2 = f2.type, m = f2.value, c = t[s2];
              c >= 0 && (r2[c] = parseInt(m, 10));
            }
            var d = r2[3], l = 24 === d ? 0 : d, h = r2[0] + "-" + r2[1] + "-" + r2[2] + " " + l + ":" + r2[4] + ":" + r2[5] + ":000", v = +e2;
            return (o.utc(h).valueOf() - (v -= v % 1e3)) / 6e4;
          }, f = i.prototype;
          f.tz = function(t2, e2) {
            void 0 === t2 && (t2 = r);
            var n2 = this.utcOffset(), i2 = this.toDate(), a2 = i2.toLocaleString("en-US", { timeZone: t2 }), u2 = Math.round((i2 - new Date(a2)) / 1e3 / 60), f2 = o(a2, { locale: this.$L }).$set("millisecond", this.$ms).utcOffset(15 * -Math.round(i2.getTimezoneOffset() / 15) - u2, true);
            if (e2) {
              var s2 = f2.utcOffset();
              f2 = f2.add(n2 - s2, "minute");
            }
            return f2.$x.$timezone = t2, f2;
          }, f.offsetName = function(t2) {
            var e2 = this.$x.$timezone || o.tz.guess(), n2 = a(this.valueOf(), e2, { timeZoneName: t2 }).find(function(t3) {
              return "timezonename" === t3.type.toLowerCase();
            });
            return n2 && n2.value;
          };
          var s = f.startOf;
          f.startOf = function(t2, e2) {
            if (!this.$x || !this.$x.$timezone)
              return s.call(this, t2, e2);
            var n2 = o(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
            return s.call(n2, t2, e2).tz(this.$x.$timezone, true);
          }, o.tz = function(t2, e2, n2) {
            var i2 = n2 && e2, a2 = n2 || e2 || r, f2 = u(+o(), a2);
            if ("string" != typeof t2)
              return o(t2).tz(a2);
            var s2 = function(t3, e3, n3) {
              var i3 = t3 - 60 * e3 * 1e3, o2 = u(i3, n3);
              if (e3 === o2)
                return [i3, e3];
              var r2 = u(i3 -= 60 * (o2 - e3) * 1e3, n3);
              return o2 === r2 ? [i3, o2] : [t3 - 60 * Math.min(o2, r2) * 1e3, Math.max(o2, r2)];
            }(o.utc(t2, i2).valueOf(), f2, a2), m = s2[0], c = s2[1], d = o(m).utcOffset(c);
            return d.$x.$timezone = a2, d;
          }, o.tz.guess = function() {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
          }, o.tz.setDefault = function(t2) {
            r = t2;
          };
        };
      });
    }
  });

  // ../string-templates/src/helpers/date.js
  var require_date = __commonJS({
    "../string-templates/src/helpers/date.js"(exports, module) {
      var dayjs = require_dayjs_min();
      dayjs.extend(require_duration());
      dayjs.extend(require_advancedFormat());
      dayjs.extend(require_isoWeek());
      dayjs.extend(require_weekYear());
      dayjs.extend(require_weekOfYear());
      dayjs.extend(require_relativeTime());
      dayjs.extend(require_utc());
      dayjs.extend(require_timezone());
      function isOptions(val) {
        return typeof val === "object" && typeof val.hash === "object";
      }
      function isApp(thisArg) {
        return typeof thisArg === "object" && typeof thisArg.options === "object" && typeof thisArg.app === "object";
      }
      function getContext(thisArg, locals, options) {
        if (isOptions(thisArg)) {
          return getContext({}, locals, thisArg);
        }
        if (isOptions(locals)) {
          return getContext(thisArg, options, locals);
        }
        const appContext = isApp(thisArg) ? thisArg.context : {};
        options = options || {};
        if (!isOptions(options)) {
          locals = Object.assign({}, locals, options);
        }
        if (isOptions(options) && options.hash.root === true) {
          locals = Object.assign({}, options.data.root, locals);
        }
        let context = Object.assign({}, appContext, locals, options.hash);
        if (!isApp(thisArg)) {
          context = Object.assign({}, thisArg, context);
        }
        if (isApp(thisArg) && thisArg.view && thisArg.view.data) {
          context = Object.assign({}, context, thisArg.view.data);
        }
        return context;
      }
      function initialConfig(str, pattern, options) {
        if (isOptions(pattern)) {
          options = pattern;
          pattern = null;
        }
        if (isOptions(str)) {
          options = str;
          pattern = null;
          str = null;
        }
        return { str, pattern, options };
      }
      function setLocale(str, pattern, options) {
        const config = initialConfig(str, pattern, options);
        const defaults = { lang: "en", date: new Date(config.str) };
        const opts = getContext(this, defaults, {});
        dayjs.locale(opts.lang || opts.language);
      }
      module.exports.date = (str, pattern, options) => {
        const config = initialConfig(str, pattern, options);
        if (config.str == null && config.pattern == null) {
          dayjs.locale("en");
          return dayjs().format("MMMM DD, YYYY");
        }
        setLocale(config.str, config.pattern, config.options);
        let date = dayjs(new Date(config.str));
        if (typeof config.options === "string") {
          date = config.options.toLowerCase() === "utc" ? date.utc() : date.tz(config.options);
        } else {
          date = date.tz(dayjs.tz.guess());
        }
        if (config.pattern === "") {
          return date.toISOString();
        }
        return date.format(config.pattern);
      };
      module.exports.duration = (str, pattern, format) => {
        const config = initialConfig(str, pattern);
        setLocale(config.str, config.pattern);
        const duration = dayjs.duration(config.str, config.pattern);
        if (format && !isOptions(format)) {
          return duration.format(format);
        } else {
          return duration.humanize();
        }
      };
    }
  });

  // ../../node_modules/is-buffer/index.js
  var require_is_buffer = __commonJS({
    "../../node_modules/is-buffer/index.js"(exports, module) {
      module.exports = function(obj) {
        return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
      };
      function isBuffer(obj) {
        return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
      }
      function isSlowBuffer(obj) {
        return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
      }
    }
  });

  // ../../node_modules/typeof-article/node_modules/kind-of/index.js
  var require_kind_of = __commonJS({
    "../../node_modules/typeof-article/node_modules/kind-of/index.js"(exports, module) {
      var isBuffer = require_is_buffer();
      var toString = Object.prototype.toString;
      module.exports = function kindOf(val) {
        if (typeof val === "undefined") {
          return "undefined";
        }
        if (val === null) {
          return "null";
        }
        if (val === true || val === false || val instanceof Boolean) {
          return "boolean";
        }
        if (typeof val === "string" || val instanceof String) {
          return "string";
        }
        if (typeof val === "number" || val instanceof Number) {
          return "number";
        }
        if (typeof val === "function" || val instanceof Function) {
          return "function";
        }
        if (typeof Array.isArray !== "undefined" && Array.isArray(val)) {
          return "array";
        }
        if (val instanceof RegExp) {
          return "regexp";
        }
        if (val instanceof Date) {
          return "date";
        }
        var type = toString.call(val);
        if (type === "[object RegExp]") {
          return "regexp";
        }
        if (type === "[object Date]") {
          return "date";
        }
        if (type === "[object Arguments]") {
          return "arguments";
        }
        if (type === "[object Error]") {
          return "error";
        }
        if (isBuffer(val)) {
          return "buffer";
        }
        if (type === "[object Set]") {
          return "set";
        }
        if (type === "[object WeakSet]") {
          return "weakset";
        }
        if (type === "[object Map]") {
          return "map";
        }
        if (type === "[object WeakMap]") {
          return "weakmap";
        }
        if (type === "[object Symbol]") {
          return "symbol";
        }
        if (type === "[object Int8Array]") {
          return "int8array";
        }
        if (type === "[object Uint8Array]") {
          return "uint8array";
        }
        if (type === "[object Uint8ClampedArray]") {
          return "uint8clampedarray";
        }
        if (type === "[object Int16Array]") {
          return "int16array";
        }
        if (type === "[object Uint16Array]") {
          return "uint16array";
        }
        if (type === "[object Int32Array]") {
          return "int32array";
        }
        if (type === "[object Uint32Array]") {
          return "uint32array";
        }
        if (type === "[object Float32Array]") {
          return "float32array";
        }
        if (type === "[object Float64Array]") {
          return "float64array";
        }
        return "object";
      };
    }
  });

  // ../../node_modules/typeof-article/index.js
  var require_typeof_article = __commonJS({
    "../../node_modules/typeof-article/index.js"(exports, module) {
      "use strict";
      var typeOf = require_kind_of();
      var types = {
        "arguments": "an arguments object",
        "array": "an array",
        "boolean": "a boolean",
        "buffer": "a buffer",
        "date": "a date",
        "error": "an error",
        "float32array": "a float32array",
        "float64array": "a float64array",
        "function": "a function",
        "int16array": "an int16array",
        "int32array": "an int32array",
        "int8array": "an int8array",
        "map": "a Map",
        "null": "null",
        "number": "a number",
        "object": "an object",
        "regexp": "a regular expression",
        "set": "a Set",
        "string": "a string",
        "symbol": "a symbol",
        "uint16array": "an uint16array",
        "uint32array": "an uint32array",
        "uint8array": "an uint8array",
        "uint8clampedarray": "an uint8clampedarray",
        "undefined": "undefined",
        "weakmap": "a WeakMap",
        "weakset": "a WeakSet"
      };
      function type(val) {
        return types[typeOf(val)];
      }
      type.types = types;
      type.typeOf = typeOf;
      module.exports = type;
    }
  });

  // ../../node_modules/kind-of/index.js
  var require_kind_of2 = __commonJS({
    "../../node_modules/kind-of/index.js"(exports, module) {
      var toString = Object.prototype.toString;
      module.exports = function kindOf(val) {
        if (val === void 0)
          return "undefined";
        if (val === null)
          return "null";
        var type = typeof val;
        if (type === "boolean")
          return "boolean";
        if (type === "string")
          return "string";
        if (type === "number")
          return "number";
        if (type === "symbol")
          return "symbol";
        if (type === "function") {
          return isGeneratorFn(val) ? "generatorfunction" : "function";
        }
        if (isArray(val))
          return "array";
        if (isBuffer(val))
          return "buffer";
        if (isArguments(val))
          return "arguments";
        if (isDate(val))
          return "date";
        if (isError(val))
          return "error";
        if (isRegexp(val))
          return "regexp";
        switch (ctorName(val)) {
          case "Symbol":
            return "symbol";
          case "Promise":
            return "promise";
          case "WeakMap":
            return "weakmap";
          case "WeakSet":
            return "weakset";
          case "Map":
            return "map";
          case "Set":
            return "set";
          case "Int8Array":
            return "int8array";
          case "Uint8Array":
            return "uint8array";
          case "Uint8ClampedArray":
            return "uint8clampedarray";
          case "Int16Array":
            return "int16array";
          case "Uint16Array":
            return "uint16array";
          case "Int32Array":
            return "int32array";
          case "Uint32Array":
            return "uint32array";
          case "Float32Array":
            return "float32array";
          case "Float64Array":
            return "float64array";
        }
        if (isGeneratorObj(val)) {
          return "generator";
        }
        type = toString.call(val);
        switch (type) {
          case "[object Object]":
            return "object";
          case "[object Map Iterator]":
            return "mapiterator";
          case "[object Set Iterator]":
            return "setiterator";
          case "[object String Iterator]":
            return "stringiterator";
          case "[object Array Iterator]":
            return "arrayiterator";
        }
        return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
      };
      function ctorName(val) {
        return typeof val.constructor === "function" ? val.constructor.name : null;
      }
      function isArray(val) {
        if (Array.isArray)
          return Array.isArray(val);
        return val instanceof Array;
      }
      function isError(val) {
        return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
      }
      function isDate(val) {
        if (val instanceof Date)
          return true;
        return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
      }
      function isRegexp(val) {
        if (val instanceof RegExp)
          return true;
        return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
      }
      function isGeneratorFn(name, val) {
        return ctorName(name) === "GeneratorFunction";
      }
      function isGeneratorObj(val) {
        return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
      }
      function isArguments(val) {
        try {
          if (typeof val.length === "number" && typeof val.callee === "function") {
            return true;
          }
        } catch (err) {
          if (err.message.indexOf("callee") !== -1) {
            return true;
          }
        }
        return false;
      }
      function isBuffer(val) {
        if (val.constructor && typeof val.constructor.isBuffer === "function") {
          return val.constructor.isBuffer(val);
        }
        return false;
      }
    }
  });

  // ../../node_modules/handlebars-utils/index.js
  var require_handlebars_utils = __commonJS({
    "../../node_modules/handlebars-utils/index.js"(exports, module) {
      "use strict";
      var util = __require("util");
      var type = require_typeof_article();
      var typeOf = require_kind_of2();
      var utils = exports = module.exports;
      utils.extend = extend;
      utils.indexOf = indexOf;
      utils.escapeExpression = escapeExpression;
      utils.isEmpty = isEmpty;
      utils.createFrame = createFrame;
      utils.blockParams = blockParams;
      utils.appendContextPath = appendContextPath;
      var escape = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;",
        "=": "&#x3D;"
      };
      var badChars = /[&<>"'`=]/g;
      var possible = /[&<>"'`=]/;
      function escapeChar(chr) {
        return escape[chr];
      }
      function extend(obj) {
        for (var i = 1; i < arguments.length; i++) {
          for (var key in arguments[i]) {
            if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
              obj[key] = arguments[i][key];
            }
          }
        }
        return obj;
      }
      var toString = Object.prototype.toString;
      utils.toString = toString;
      var isFunction = function isFunction2(value2) {
        return typeof value2 === "function";
      };
      if (isFunction(/x/)) {
        utils.isFunction = isFunction = function(value2) {
          return typeof value2 === "function" && toString.call(value2) === "[object Function]";
        };
      }
      utils.isFunction = isFunction;
      var isArray = Array.isArray || function(value2) {
        return value2 && typeof value2 === "object" ? toString.call(value2) === "[object Array]" : false;
      };
      utils.isArray = isArray;
      function indexOf(array, value2) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (array[i] === value2) {
            return i;
          }
        }
        return -1;
      }
      function escapeExpression(string) {
        if (typeof string !== "string") {
          if (string && string.toHTML) {
            return string.toHTML();
          } else if (string == null) {
            return "";
          } else if (!string) {
            return string + "";
          }
          string = "" + string;
        }
        if (!possible.test(string)) {
          return string;
        }
        return string.replace(badChars, escapeChar);
      }
      function createFrame(object) {
        var frame = extend({}, object);
        frame._parent = object;
        return frame;
      }
      function blockParams(params, ids) {
        params.path = ids;
        return params;
      }
      function appendContextPath(contextPath, id) {
        return (contextPath ? contextPath + "." : "") + id;
      }
      utils.expectedType = function(param, expected, actual) {
        var exp = type.types[expected];
        var val = util.inspect(actual);
        return "expected " + param + " to be " + exp + " but received " + type(actual) + ": " + val;
      };
      utils.isBlock = function(options) {
        return utils.isOptions(options) && typeof options.fn === "function" && typeof options.inverse === "function";
      };
      utils.fn = function(val, context, options) {
        if (utils.isOptions(val)) {
          return utils.fn("", val, options);
        }
        if (utils.isOptions(context)) {
          return utils.fn(val, {}, context);
        }
        return utils.isBlock(options) ? options.fn(context) : val;
      };
      utils.inverse = function(val, context, options) {
        if (utils.isOptions(val)) {
          return utils.identity("", val, options);
        }
        if (utils.isOptions(context)) {
          return utils.inverse(val, {}, context);
        }
        return utils.isBlock(options) ? options.inverse(context) : val;
      };
      utils.value = function(val, context, options) {
        if (utils.isOptions(val)) {
          return utils.value(null, val, options);
        }
        if (utils.isOptions(context)) {
          return utils.value(val, {}, context);
        }
        if (utils.isBlock(options)) {
          return !!val ? options.fn(context) : options.inverse(context);
        }
        return val;
      };
      utils.isOptions = function(val) {
        return utils.isObject(val) && utils.isObject(val.hash);
      };
      utils.isUndefined = function(val) {
        return val == null || utils.isOptions(val) && val.hash != null;
      };
      utils.isApp = function(thisArg) {
        return utils.isObject(thisArg) && utils.isObject(thisArg.options) && utils.isObject(thisArg.app);
      };
      utils.options = function(thisArg, locals, options) {
        if (utils.isOptions(thisArg)) {
          return utils.options({}, locals, thisArg);
        }
        if (utils.isOptions(locals)) {
          return utils.options(thisArg, options, locals);
        }
        options = options || {};
        if (!utils.isOptions(options)) {
          locals = Object.assign({}, locals, options);
        }
        var opts = Object.assign({}, locals, options.hash);
        if (utils.isObject(thisArg)) {
          opts = Object.assign({}, thisArg.options, opts);
        }
        if (opts[options.name]) {
          opts = Object.assign({}, opts[options.name], opts);
        }
        return opts;
      };
      utils.context = function(thisArg, locals, options) {
        if (utils.isOptions(thisArg)) {
          return utils.context({}, locals, thisArg);
        }
        if (utils.isOptions(locals)) {
          return utils.context(thisArg, options, locals);
        }
        var appContext = utils.isApp(thisArg) ? thisArg.context : {};
        options = options || {};
        if (!utils.isOptions(options)) {
          locals = Object.assign({}, locals, options);
        }
        if (utils.isOptions(options) && options.hash.root === true) {
          locals = Object.assign({}, options.data.root, locals);
        }
        var context = Object.assign({}, appContext, locals, options.hash);
        if (!utils.isApp(thisArg)) {
          context = Object.assign({}, thisArg, context);
        }
        if (utils.isApp(thisArg) && thisArg.view && thisArg.view.data) {
          context = Object.assign({}, context, thisArg.view.data);
        }
        return context;
      };
      utils.isObject = function(val) {
        return typeOf(val) === "object";
      };
      function isEmpty(val) {
        if (val === 0 || typeof val === "boolean") {
          return false;
        }
        if (val == null) {
          return true;
        }
        if (utils.isObject(val)) {
          val = Object.keys(val);
        }
        if (!val.length) {
          return true;
        }
        return false;
      }
      utils.result = function(val) {
        if (typeof val === "function") {
          return val.apply(this, [].slice.call(arguments, 1));
        }
        return val;
      };
      utils.identity = function(val) {
        return val;
      };
      utils.isString = function(val) {
        return typeof val === "string" && val !== "";
      };
      utils.arrayify = function(val) {
        return val != null ? Array.isArray(val) ? val : [val] : [];
      };
      utils.tryParse = function(str) {
        try {
          return JSON.parse(str);
        } catch (err) {
        }
        return {};
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/utils/index.js
  var require_utils = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/utils/index.js"(exports) {
      "use strict";
      var util = require_handlebars_utils();
      exports.contains = function(val, obj, start) {
        if (val == null || obj == null || isNaN(val.length)) {
          return false;
        }
        return val.indexOf(obj, start) !== -1;
      };
      exports.chop = function(str) {
        if (typeof str !== "string")
          return "";
        var re = /^[-_.\W\s]+|[-_.\W\s]+$/g;
        return str.trim().replace(re, "");
      };
      exports.changecase = function(str, fn) {
        if (typeof str !== "string")
          return "";
        if (str.length === 1) {
          return str.toLowerCase();
        }
        str = exports.chop(str).toLowerCase();
        if (typeof fn !== "function") {
          fn = util.identity;
        }
        var re = /[-_.\W\s]+(\w|$)/g;
        return str.replace(re, function(_, ch) {
          return fn(ch);
        });
      };
      exports.random = function(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/math.js
  var require_math = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/math.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var helpers2 = module.exports;
      helpers2.abs = function(num) {
        if (isNaN(num)) {
          throw new TypeError("expected a number");
        }
        return Math.abs(num);
      };
      helpers2.add = function(a, b) {
        if (!isNaN(a) && !isNaN(b)) {
          return Number(a) + Number(b);
        }
        if (typeof a === "string" && typeof b === "string") {
          return a + b;
        }
        return "";
      };
      helpers2.avg = function() {
        const args = [].concat.apply([], arguments);
        args.pop();
        return helpers2.sum(args) / args.length;
      };
      helpers2.ceil = function(num) {
        if (isNaN(num)) {
          throw new TypeError("expected a number");
        }
        return Math.ceil(num);
      };
      helpers2.divide = function(a, b) {
        if (isNaN(a)) {
          throw new TypeError("expected the first argument to be a number");
        }
        if (isNaN(b)) {
          throw new TypeError("expected the second argument to be a number");
        }
        return Number(a) / Number(b);
      };
      helpers2.floor = function(num) {
        if (isNaN(num)) {
          throw new TypeError("expected a number");
        }
        return Math.floor(num);
      };
      helpers2.minus = function(a, b) {
        if (isNaN(a)) {
          throw new TypeError("expected the first argument to be a number");
        }
        if (isNaN(b)) {
          throw new TypeError("expected the second argument to be a number");
        }
        return Number(a) - Number(b);
      };
      helpers2.modulo = function(a, b) {
        if (isNaN(a)) {
          throw new TypeError("expected the first argument to be a number");
        }
        if (isNaN(b)) {
          throw new TypeError("expected the second argument to be a number");
        }
        return Number(a) % Number(b);
      };
      helpers2.multiply = function(a, b) {
        if (isNaN(a)) {
          throw new TypeError("expected the first argument to be a number");
        }
        if (isNaN(b)) {
          throw new TypeError("expected the second argument to be a number");
        }
        return Number(a) * Number(b);
      };
      helpers2.plus = function(a, b) {
        if (isNaN(a)) {
          throw new TypeError("expected the first argument to be a number");
        }
        if (isNaN(b)) {
          throw new TypeError("expected the second argument to be a number");
        }
        return Number(a) + Number(b);
      };
      helpers2.random = function(min, max) {
        if (isNaN(min)) {
          throw new TypeError("expected minimum to be a number");
        }
        if (isNaN(max)) {
          throw new TypeError("expected maximum to be a number");
        }
        return utils.random(min, max);
      };
      helpers2.remainder = function(a, b) {
        return a % b;
      };
      helpers2.round = function(num) {
        if (isNaN(num)) {
          throw new TypeError("expected a number");
        }
        return Math.round(num);
      };
      helpers2.subtract = function(a, b) {
        if (isNaN(a)) {
          throw new TypeError("expected the first argument to be a number");
        }
        if (isNaN(b)) {
          throw new TypeError("expected the second argument to be a number");
        }
        return Number(a) - Number(b);
      };
      helpers2.sum = function() {
        var args = [].concat.apply([], arguments);
        var len = args.length;
        var sum = 0;
        while (len--) {
          if (!isNaN(args[len])) {
            sum += Number(args[len]);
          }
        }
        return sum;
      };
    }
  });

  // ../../node_modules/isobject/index.js
  var require_isobject = __commonJS({
    "../../node_modules/isobject/index.js"(exports, module) {
      "use strict";
      module.exports = function isObject(val) {
        return val != null && typeof val === "object" && Array.isArray(val) === false;
      };
    }
  });

  // ../../node_modules/get-value/index.js
  var require_get_value = __commonJS({
    "../../node_modules/get-value/index.js"(exports, module) {
      var isObject = require_isobject();
      module.exports = function(target, path, options) {
        if (!isObject(options)) {
          options = { default: options };
        }
        if (!isValidObject(target)) {
          return typeof options.default !== "undefined" ? options.default : target;
        }
        if (typeof path === "number") {
          path = String(path);
        }
        const isArray = Array.isArray(path);
        const isString = typeof path === "string";
        const splitChar = options.separator || ".";
        const joinChar = options.joinChar || (typeof splitChar === "string" ? splitChar : ".");
        if (!isString && !isArray) {
          return target;
        }
        if (isString && path in target) {
          return isValid(path, target, options) ? target[path] : options.default;
        }
        let segs = isArray ? path : split(path, splitChar, options);
        let len = segs.length;
        let idx = 0;
        do {
          let prop = segs[idx];
          if (typeof prop === "number") {
            prop = String(prop);
          }
          while (prop && prop.slice(-1) === "\\") {
            prop = join([prop.slice(0, -1), segs[++idx] || ""], joinChar, options);
          }
          if (prop in target) {
            if (!isValid(prop, target, options)) {
              return options.default;
            }
            target = target[prop];
          } else {
            let hasProp = false;
            let n = idx + 1;
            while (n < len) {
              prop = join([prop, segs[n++]], joinChar, options);
              if (hasProp = prop in target) {
                if (!isValid(prop, target, options)) {
                  return options.default;
                }
                target = target[prop];
                idx = n - 1;
                break;
              }
            }
            if (!hasProp) {
              return options.default;
            }
          }
        } while (++idx < len && isValidObject(target));
        if (idx === len) {
          return target;
        }
        return options.default;
      };
      function join(segs, joinChar, options) {
        if (typeof options.join === "function") {
          return options.join(segs);
        }
        return segs[0] + joinChar + segs[1];
      }
      function split(path, splitChar, options) {
        if (typeof options.split === "function") {
          return options.split(path);
        }
        return path.split(splitChar);
      }
      function isValid(key, target, options) {
        if (typeof options.isValid === "function") {
          return options.isValid(key, target);
        }
        return true;
      }
      function isValidObject(val) {
        return isObject(val) || Array.isArray(val) || typeof val === "function";
      }
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/utils/createFrame.js
  var require_createFrame = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/utils/createFrame.js"(exports, module) {
      "use strict";
      module.exports = function createFrame(data) {
        if (typeof data !== "object") {
          throw new TypeError("createFrame expects data to be an object");
        }
        var frame = Object.assign({}, data);
        frame._parent = data;
        frame.extend = function(data2) {
          Object.assign(this, data2);
        };
        if (arguments.length > 1) {
          var args = [].slice.call(arguments, 1);
          var len = args.length, i = -1;
          while (++i < len) {
            frame.extend(args[i] || {});
          }
        }
        return frame;
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/array.js
  var require_array = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/array.js"(exports, module) {
      "use strict";
      var util = require_handlebars_utils();
      var helpers2 = module.exports;
      var getValue = require_get_value();
      var createFrame = require_createFrame();
      helpers2.after = function(array, n) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          return array.slice(n);
        }
        return "";
      };
      helpers2.arrayify = function(value2) {
        if (util.isUndefined(value2))
          return [];
        return value2 ? Array.isArray(value2) ? value2 : [value2] : [];
      };
      helpers2.before = function(array, n) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          return array.slice(0, n - 1);
        }
        return "";
      };
      helpers2.eachIndex = function(array, options) {
        var result = "";
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          for (var i = 0; i < array.length; i++) {
            result += options.fn({ item: array[i], index: i });
          }
        }
        return result;
      };
      helpers2.filter = function(array, value2, options) {
        if (util.isUndefined(array))
          return options.inverse(this);
        array = util.result(array);
        if (Array.isArray(array)) {
          var content = "";
          var results = [];
          var prop = options.hash && (options.hash.property || options.hash.prop);
          if (prop) {
            results = array.filter(function(val) {
              return value2 === getValue(val, prop);
            });
          } else {
            results = array.filter(function(v) {
              return value2 === v;
            });
          }
          if (results && results.length > 0) {
            for (var i = 0; i < results.length; i++) {
              content += options.fn(results[i]);
            }
            return content;
          }
        }
        return options.inverse(this);
      };
      helpers2.first = function(array, n) {
        if (util.isUndefined(array))
          return [];
        array = util.result(array);
        if (Array.isArray(array)) {
          if (isNaN(n)) {
            return array[0];
          }
          return array.slice(0, n);
        }
        return [];
      };
      helpers2.forEach = function(array, options) {
        if (util.isUndefined(array))
          return options.inverse(this);
        array = util.result(array);
        if (Array.isArray(array)) {
          var data = createFrame(options, options.hash);
          var len = array.length;
          var buffer = "";
          var i = -1;
          while (++i < len) {
            var item = array[i];
            data.index = i;
            item.index = i + 1;
            item.total = len;
            item.isFirst = i === 0;
            item.isLast = i === len - 1;
            buffer += options.fn(item, { data });
          }
          return buffer;
        }
        return options.inverse(this);
      };
      helpers2.inArray = function(array, value2, options) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          return util.value(util.indexOf(array, value2) > -1, this, options);
        }
        return "";
      };
      helpers2.isArray = function(value2) {
        return Array.isArray(value2);
      };
      helpers2.itemAt = function(array, idx) {
        if (util.isUndefined(array))
          return null;
        array = util.result(array);
        if (Array.isArray(array)) {
          idx = !isNaN(idx) ? +idx : 0;
          if (idx < 0) {
            return array[array.length + idx];
          }
          if (idx < array.length) {
            return array[idx];
          }
        }
        return null;
      };
      helpers2.join = function(array, separator) {
        if (util.isUndefined(array))
          return "";
        if (typeof array === "string")
          return array;
        array = util.result(array);
        if (Array.isArray(array)) {
          separator = util.isString(separator) ? separator : ", ";
          return array.join(separator);
        }
        return "";
      };
      helpers2.equalsLength = function(value2, length, options) {
        if (util.isOptions(length)) {
          options = length;
          length = 0;
        }
        var len = helpers2.length(value2);
        return util.value(len === length, this, options);
      };
      helpers2.last = function(array, n) {
        if (util.isUndefined(array))
          return "";
        if (!Array.isArray(array) && typeof value !== "string") {
          return "";
        }
        if (isNaN(n)) {
          return array[array.length - 1];
        }
        return array.slice(-Math.abs(n));
      };
      helpers2.length = function(array) {
        if (util.isUndefined(array))
          return 0;
        if (util.isObject(array) && !util.isOptions(array)) {
          array = Object.keys(array);
        }
        if (typeof array === "string" && array.startsWith("[") && array.endsWith("]")) {
          return array.split(",").length;
        }
        if (typeof array === "string" || Array.isArray(array)) {
          return array.length;
        }
        return 0;
      };
      helpers2.lengthEqual = helpers2.equalsLength;
      helpers2.map = function(array, iter) {
        if (util.isUndefined(array))
          return "";
        if (!Array.isArray(array))
          return "";
        var len = array.length;
        var res = new Array(len);
        var i = -1;
        if (typeof iter !== "function") {
          return array;
        }
        while (++i < len) {
          res[i] = iter(array[i], i, array);
        }
        return res;
      };
      helpers2.pluck = function(array, prop) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          var res = [];
          for (var i = 0; i < array.length; i++) {
            var val = getValue(array[i], prop);
            if (typeof val !== "undefined") {
              res.push(val);
            }
          }
          return res;
        }
        return "";
      };
      helpers2.reverse = function(array) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          array.reverse();
          return array;
        }
        if (array && typeof array === "string") {
          return array.split("").reverse().join("");
        }
        return "";
      };
      helpers2.some = function(array, iter, options) {
        if (util.isUndefined(array))
          return options.inverse(this);
        array = util.result(array);
        if (Array.isArray(array)) {
          for (var i = 0; i < array.length; i++) {
            if (iter(array[i], i, array)) {
              return options.fn(this);
            }
          }
        }
        return options.inverse(this);
      };
      helpers2.sort = function(array, options) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          if (getValue(options, "hash.reverse")) {
            return array.sort().reverse();
          }
          return array.sort();
        }
        return "";
      };
      helpers2.sortBy = function(array, prop, options) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          var args = [].slice.call(arguments);
          args.pop();
          if (!util.isString(prop) && typeof prop !== "function") {
            return array.sort();
          }
          if (typeof prop === "function") {
            return array.sort(prop);
          }
          return array.sort((a, b) => a[prop] > b[prop] ? 1 : -1);
        }
        return "";
      };
      helpers2.withAfter = function(array, idx, options) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          array = array.slice(idx);
          var result = "";
          for (var i = 0; i < array.length; i++) {
            result += options.fn(array[i]);
          }
          return result;
        }
        return "";
      };
      helpers2.withBefore = function(array, idx, options) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          array = array.slice(0, -idx);
          var result = "";
          for (var i = 0; i < array.length; i++) {
            result += options.fn(array[i]);
          }
          return result;
        }
        return "";
      };
      helpers2.withFirst = function(array, idx, options) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          if (!util.isUndefined(idx)) {
            idx = parseFloat(util.result(idx));
          }
          if (util.isUndefined(idx)) {
            options = idx;
            return options.fn(array[0]);
          }
          array = array.slice(0, idx);
          var result = "";
          for (var i = 0; i < array.length; i++) {
            result += options.fn(array[i]);
          }
          return result;
        }
        return "";
      };
      helpers2.withGroup = function(array, size, options) {
        if (util.isUndefined(array))
          return "";
        var result = "";
        array = util.result(array);
        if (Array.isArray(array) && array.length > 0) {
          var subcontext = [];
          for (var i = 0; i < array.length; i++) {
            if (i > 0 && i % size === 0) {
              result += options.fn(subcontext);
              subcontext = [];
            }
            subcontext.push(array[i]);
          }
          result += options.fn(subcontext);
        }
        return result;
      };
      helpers2.withLast = function(array, idx, options) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          if (!util.isUndefined(idx)) {
            idx = parseFloat(util.result(idx));
          }
          if (util.isUndefined(idx)) {
            options = idx;
            return options.fn(array[array.length - 1]);
          }
          array = array.slice(-idx);
          var len = array.length, i = -1;
          var result = "";
          while (++i < len) {
            result += options.fn(array[i]);
          }
          return result;
        }
        return "";
      };
      helpers2.withSort = function(array, prop, options) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          var result = "";
          if (util.isUndefined(prop)) {
            options = prop;
            array = array.sort();
            if (getValue(options, "hash.reverse")) {
              array = array.reverse();
            }
            for (var i = 0, len = array.length; i < len; i++) {
              result += options.fn(array[i]);
            }
            return result;
          }
          array.sort(function(a, b) {
            a = getValue(a, prop);
            b = getValue(b, prop);
            return a > b ? 1 : a < b ? -1 : 0;
          });
          if (getValue(options, "hash.reverse")) {
            array = array.reverse();
          }
          var alen = array.length, j = -1;
          while (++j < alen) {
            result += options.fn(array[j]);
          }
          return result;
        }
        return "";
      };
      helpers2.unique = function(array, options) {
        if (util.isUndefined(array))
          return "";
        array = util.result(array);
        if (Array.isArray(array)) {
          return array.filter(function(item, index, arr) {
            return arr.indexOf(item) === index;
          });
        }
        return "";
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/number.js
  var require_number = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/number.js"(exports, module) {
      "use strict";
      var util = require_handlebars_utils();
      var helpers2 = module.exports;
      helpers2.bytes = function(number, precision, options) {
        if (number == null)
          return "0 B";
        if (isNaN(number)) {
          number = number.length;
          if (!number)
            return "0 B";
        }
        if (isNaN(precision)) {
          precision = 2;
        }
        var abbr = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        precision = Math.pow(10, precision);
        number = Number(number);
        var len = abbr.length - 1;
        while (len-- >= 0) {
          var size = Math.pow(10, len * 3);
          if (size <= number + 1) {
            number = Math.round(number * precision / size) / precision;
            number += " " + abbr[len];
            break;
          }
        }
        return number;
      };
      helpers2.addCommas = function(num) {
        return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      };
      helpers2.phoneNumber = function(num) {
        num = num.toString();
        return "(" + num.substr(0, 3) + ") " + num.substr(3, 3) + "-" + num.substr(6, 4);
      };
      helpers2.toAbbr = function(number, precision) {
        if (isNaN(number)) {
          number = 0;
        }
        if (util.isUndefined(precision)) {
          precision = 2;
        }
        number = Number(number);
        precision = Math.pow(10, precision);
        var abbr = ["k", "m", "b", "t", "q"];
        var len = abbr.length - 1;
        while (len >= 0) {
          var size = Math.pow(10, (len + 1) * 3);
          if (size <= number + 1) {
            number = Math.round(number * precision / size) / precision;
            number += abbr[len];
            break;
          }
          len--;
        }
        return number;
      };
      helpers2.toExponential = function(number, digits) {
        if (isNaN(number)) {
          number = 0;
        }
        if (util.isUndefined(digits)) {
          digits = 0;
        }
        return Number(number).toExponential(digits);
      };
      helpers2.toFixed = function(number, digits) {
        if (isNaN(number)) {
          number = 0;
        }
        if (isNaN(digits)) {
          digits = 0;
        }
        return Number(number).toFixed(digits);
      };
      helpers2.toFloat = function(number) {
        return parseFloat(number);
      };
      helpers2.toInt = function(number) {
        return parseInt(number, 10);
      };
      helpers2.toPrecision = function(number, precision) {
        if (isNaN(number)) {
          number = 0;
        }
        if (isNaN(precision)) {
          precision = 1;
        }
        return Number(number).toPrecision(precision);
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/url.js
  var require_url = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/url.js"(exports, module) {
      "use strict";
      var url = __require("url");
      var util = require_handlebars_utils();
      var querystring = __require("querystring");
      var helpers2 = module.exports;
      helpers2.encodeURI = function(str) {
        if (util.isString(str)) {
          return encodeURIComponent(str);
        }
      };
      helpers2.escape = function(str) {
        if (util.isString(str)) {
          return querystring.escape(str);
        }
      };
      helpers2.decodeURI = function(str) {
        if (util.isString(str)) {
          return decodeURIComponent(str);
        }
      };
      helpers2.urlResolve = function(base, href) {
        return url.resolve(base, href);
      };
      helpers2.urlParse = function(str) {
        return url.parse(str);
      };
      helpers2.stripQuerystring = function(str) {
        if (util.isString(str)) {
          return str.split("?")[0];
        }
      };
      helpers2.stripProtocol = function(str) {
        if (util.isString(str)) {
          var parsed = url.parse(str);
          parsed.protocol = "";
          return parsed.format();
        }
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/string.js
  var require_string = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/string.js"(exports, module) {
      "use strict";
      var util = require_handlebars_utils();
      var utils = require_utils();
      var helpers2 = module.exports;
      helpers2.append = function(str, suffix) {
        if (typeof str === "string" && typeof suffix === "string") {
          return str + suffix;
        }
        return str;
      };
      helpers2.camelcase = function(str) {
        if (typeof str !== "string")
          return "";
        return utils.changecase(str, function(ch) {
          return ch.toUpperCase();
        });
      };
      helpers2.capitalize = function(str) {
        if (typeof str !== "string")
          return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
      };
      helpers2.capitalizeAll = function(str) {
        if (typeof str !== "string")
          return "";
        if (util.isString(str)) {
          return str.replace(/\w\S*/g, function(word) {
            return helpers2.capitalize(word);
          });
        }
      };
      helpers2.center = function(str, spaces) {
        if (typeof str !== "string")
          return "";
        var space = "";
        var i = 0;
        while (i < spaces) {
          space += "&nbsp;";
          i++;
        }
        return space + str + space;
      };
      helpers2.chop = function(str) {
        if (typeof str !== "string")
          return "";
        return utils.chop(str);
      };
      helpers2.dashcase = function(str) {
        if (typeof str !== "string")
          return "";
        return utils.changecase(str, function(ch) {
          return "-" + ch;
        });
      };
      helpers2.dotcase = function(str) {
        if (typeof str !== "string")
          return "";
        return utils.changecase(str, function(ch) {
          return "." + ch;
        });
      };
      helpers2.downcase = function() {
        return helpers2.lowercase.apply(this, arguments);
      };
      helpers2.ellipsis = function(str, limit) {
        if (util.isString(str)) {
          if (str.length <= limit) {
            return str;
          }
          return helpers2.truncate(str, limit) + "\u2026";
        }
      };
      helpers2.hyphenate = function(str) {
        if (typeof str !== "string")
          return "";
        return str.split(" ").join("-");
      };
      helpers2.isString = function(value2) {
        return typeof value2 === "string";
      };
      helpers2.lowercase = function(str) {
        if (util.isObject(str) && str.fn) {
          return str.fn(this).toLowerCase();
        }
        if (typeof str !== "string")
          return "";
        return str.toLowerCase();
      };
      helpers2.occurrences = function(str, substring) {
        if (typeof str !== "string")
          return "";
        var len = substring.length;
        var pos = 0;
        var n = 0;
        while ((pos = str.indexOf(substring, pos)) > -1) {
          n++;
          pos += len;
        }
        return n;
      };
      helpers2.pascalcase = function(str) {
        if (typeof str !== "string")
          return "";
        str = utils.changecase(str, function(ch) {
          return ch.toUpperCase();
        });
        return str.charAt(0).toUpperCase() + str.slice(1);
      };
      helpers2.pathcase = function(str) {
        if (typeof str !== "string")
          return "";
        return utils.changecase(str, function(ch) {
          return "/" + ch;
        });
      };
      helpers2.plusify = function(str, ch) {
        if (typeof str !== "string")
          return "";
        if (!util.isString(ch))
          ch = " ";
        return str.split(ch).join("+");
      };
      helpers2.prepend = function(str, prefix) {
        return typeof str === "string" && typeof prefix === "string" ? prefix + str : str;
      };
      helpers2.raw = function(options) {
        var str = options.fn();
        var opts = util.options(this, options);
        if (opts.escape !== false) {
          var idx = 0;
          while ((idx = str.indexOf("{{", idx)) !== -1) {
            if (str[idx - 1] !== "\\") {
              str = str.slice(0, idx) + "\\" + str.slice(idx);
            }
            idx += 3;
          }
        }
        return str;
      };
      helpers2.remove = function(str, ch) {
        if (typeof str !== "string")
          return "";
        if (!util.isString(ch))
          return str;
        return str.split(ch).join("");
      };
      helpers2.removeFirst = function(str, ch) {
        if (typeof str !== "string")
          return "";
        if (!util.isString(ch))
          return str;
        return str.replace(ch, "");
      };
      helpers2.replace = function(str, a, b) {
        if (typeof str !== "string")
          return "";
        if (!util.isString(a))
          return str;
        if (!util.isString(b))
          b = "";
        return str.split(a).join(b);
      };
      helpers2.replaceFirst = function(str, a, b) {
        if (typeof str !== "string")
          return "";
        if (!util.isString(a))
          return str;
        if (!util.isString(b))
          b = "";
        return str.replace(a, b);
      };
      helpers2.reverse = require_array().reverse;
      helpers2.sentence = function(str) {
        if (typeof str !== "string")
          return "";
        return str.replace(/((?:\S[^\.\?\!]*)[\.\?\!]*)/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };
      helpers2.snakecase = function(str) {
        if (typeof str !== "string")
          return "";
        return utils.changecase(str, function(ch) {
          return "_" + ch;
        });
      };
      helpers2.split = function(str, ch) {
        if (typeof str !== "string")
          return "";
        if (!util.isString(ch))
          ch = ",";
        return str.split(ch);
      };
      helpers2.startsWith = function(prefix, str, options) {
        var args = [].slice.call(arguments);
        options = args.pop();
        if (util.isString(str) && str.indexOf(prefix) === 0) {
          return options.fn(this);
        }
        if (typeof options.inverse === "function") {
          return options.inverse(this);
        }
        return "";
      };
      helpers2.titleize = function(str) {
        if (typeof str !== "string")
          return "";
        var title = str.replace(/[- _]+/g, " ");
        var words = title.split(" ");
        var len = words.length;
        var res = [];
        var i = 0;
        while (len--) {
          var word = words[i++];
          res.push(exports.capitalize(word));
        }
        return res.join(" ");
      };
      helpers2.trim = function(str) {
        return typeof str === "string" ? str.trim() : "";
      };
      helpers2.trimLeft = function(str) {
        if (util.isString(str)) {
          return str.replace(/^\s+/, "");
        }
      };
      helpers2.trimRight = function(str) {
        if (util.isString(str)) {
          return str.replace(/\s+$/, "");
        }
      };
      helpers2.truncate = function(str, limit, suffix) {
        if (util.isString(str)) {
          if (typeof suffix !== "string") {
            suffix = "";
          }
          if (str.length > limit) {
            return str.slice(0, limit - suffix.length) + suffix;
          }
          return str;
        }
      };
      helpers2.truncateWords = function(str, count, suffix) {
        if (util.isString(str) && !isNaN(count)) {
          if (typeof suffix !== "string") {
            suffix = "\u2026";
          }
          var num = Number(count);
          var arr = str.split(/[ \t]/);
          if (num >= arr.length) {
            return str;
          }
          arr = arr.slice(0, num);
          var val = arr.join(" ").trim();
          return val + suffix;
        }
      };
      helpers2.upcase = function() {
        return helpers2.uppercase.apply(this, arguments);
      };
      helpers2.uppercase = function(str) {
        if (util.isObject(str) && str.fn) {
          return str.fn(this).toUpperCase();
        }
        if (typeof str !== "string")
          return "";
        return str.toUpperCase();
      };
    }
  });

  // ../../node_modules/has-values/index.js
  var require_has_values = __commonJS({
    "../../node_modules/has-values/index.js"(exports, module) {
      "use strict";
      var typeOf = require_kind_of2();
      module.exports = function has(val) {
        switch (typeOf(val)) {
          case "boolean":
          case "date":
          case "function":
          case "null":
          case "number":
            return true;
          case "undefined":
            return false;
          case "regexp":
            return val.source !== "(?:)" && val.source !== "";
          case "buffer":
            return val.toString() !== "";
          case "error":
            return val.message !== "";
          case "string":
          case "arguments":
            return val.length !== 0;
          case "file":
          case "map":
          case "set":
            return val.size !== 0;
          case "array":
          case "object":
            for (const key of Object.keys(val)) {
              if (has(val[key])) {
                return true;
              }
            }
            return false;
          default: {
            return true;
          }
        }
      };
    }
  });

  // ../../node_modules/has-value/index.js
  var require_has_value = __commonJS({
    "../../node_modules/has-value/index.js"(exports, module) {
      "use strict";
      var get = require_get_value();
      var has = require_has_values();
      module.exports = function(obj, path, options) {
        if (isObject(obj) && (typeof path === "string" || Array.isArray(path))) {
          return has(get(obj, path, options));
        }
        return false;
      };
      function isObject(val) {
        return val != null && (typeof val === "object" || typeof val === "function" || Array.isArray(val));
      }
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/utils/falsey.js
  var require_falsey = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/utils/falsey.js"(exports, module) {
      "use strict";
      function falsey(val, keywords) {
        if (!val)
          return true;
        let words = keywords || falsey.keywords;
        if (!Array.isArray(words))
          words = [words];
        const lower = typeof val === "string" ? val.toLowerCase() : null;
        for (const word of words) {
          if (word === val) {
            return true;
          }
          if (word === lower) {
            return true;
          }
        }
        return false;
      }
      falsey.keywords = [
        "0",
        "false",
        "nada",
        "nil",
        "nay",
        "nah",
        "negative",
        "no",
        "none",
        "nope",
        "nul",
        "null",
        "nix",
        "nyet",
        "uh-uh",
        "veto",
        "zero"
      ];
      module.exports = falsey;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/utils/odd.js
  var require_odd = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/utils/odd.js"(exports, module) {
      "use strict";
      module.exports = function isOdd(value2) {
        const n = Math.abs(value2);
        if (isNaN(n)) {
          throw new TypeError("expected a number");
        }
        if (!Number.isInteger(n)) {
          throw new Error("expected an integer");
        }
        if (!Number.isSafeInteger(n)) {
          throw new Error("value exceeds maximum safe integer");
        }
        return n % 2 === 1;
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/comparison.js
  var require_comparison = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/comparison.js"(exports, module) {
      "use strict";
      var has = require_has_value();
      var util = require_handlebars_utils();
      var utils = require_utils();
      var falsey = require_falsey();
      var isOdd = require_odd();
      var helpers2 = module.exports;
      helpers2.and = function() {
        var len = arguments.length - 1;
        var options = arguments[len];
        var val = true;
        for (var i = 0; i < len; i++) {
          if (!arguments[i]) {
            val = false;
            break;
          }
        }
        return util.value(val, this, options);
      };
      helpers2.compare = function(a, operator, b, options) {
        if (arguments.length < 4) {
          throw new Error("handlebars Helper {{compare}} expects 4 arguments");
        }
        var result;
        switch (operator) {
          case "==":
            result = a == b;
            break;
          case "===":
            result = a === b;
            break;
          case "!=":
            result = a != b;
            break;
          case "!==":
            result = a !== b;
            break;
          case "<":
            result = a < b;
            break;
          case ">":
            result = a > b;
            break;
          case "<=":
            result = a <= b;
            break;
          case ">=":
            result = a >= b;
            break;
          case "typeof":
            result = typeof a === b;
            break;
          default: {
            throw new Error(
              "helper {{compare}}: invalid operator: `" + operator + "`"
            );
          }
        }
        return util.value(result, this, options);
      };
      helpers2.contains = function(collection, value2, startIndex, options) {
        if (typeof startIndex === "object") {
          options = startIndex;
          startIndex = void 0;
        }
        var val = utils.contains(collection, value2, startIndex);
        return util.value(val, this, options);
      };
      helpers2.default = function() {
        for (var i = 0; i < arguments.length - 1; i++) {
          if (arguments[i] != null)
            return arguments[i];
        }
        return "";
      };
      helpers2.eq = function(a, b, options) {
        if (arguments.length === 2) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a === b, this, options);
      };
      helpers2.gt = function(a, b, options) {
        if (arguments.length === 2) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a > b, this, options);
      };
      helpers2.gte = function(a, b, options) {
        if (arguments.length === 2) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a >= b, this, options);
      };
      helpers2.has = function(value2, pattern, options) {
        if (util.isOptions(value2)) {
          options = value2;
          pattern = null;
          value2 = null;
        }
        if (util.isOptions(pattern)) {
          options = pattern;
          pattern = null;
        }
        if (value2 === null) {
          return util.value(false, this, options);
        }
        if (arguments.length === 2) {
          return util.value(has(this, value2), this, options);
        }
        if ((Array.isArray(value2) || util.isString(value2)) && util.isString(pattern)) {
          if (value2.indexOf(pattern) > -1) {
            return util.fn(true, this, options);
          }
        }
        if (util.isObject(value2) && util.isString(pattern) && pattern in value2) {
          return util.fn(true, this, options);
        }
        return util.inverse(false, this, options);
      };
      helpers2.isFalsey = function(val, options) {
        return util.value(falsey(val), this, options);
      };
      helpers2.isTruthy = function(val, options) {
        return util.value(!falsey(val), this, options);
      };
      helpers2.ifEven = function(num, options) {
        return util.value(!isOdd(num), this, options);
      };
      helpers2.ifNth = function(a, b, options) {
        var isNth = !isNaN(a) && !isNaN(b) && b % a === 0;
        return util.value(isNth, this, options);
      };
      helpers2.ifOdd = function(val, options) {
        return util.value(isOdd(val), this, options);
      };
      helpers2.is = function(a, b, options) {
        if (arguments.length === 2) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a == b, this, options);
      };
      helpers2.isnt = function(a, b, options) {
        if (arguments.length === 2) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a != b, this, options);
      };
      helpers2.lt = function(a, b, options) {
        if (arguments.length === 2) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a < b, this, options);
      };
      helpers2.lte = function(a, b, options) {
        if (arguments.length === 2) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a <= b, this, options);
      };
      helpers2.neither = function(a, b, options) {
        return util.value(!a && !b, this, options);
      };
      helpers2.not = function(val, options) {
        return util.value(!val, this, options);
      };
      helpers2.or = function() {
        var len = arguments.length - 1;
        var options = arguments[len];
        var val = false;
        for (var i = 0; i < len; i++) {
          if (arguments[i]) {
            val = true;
            break;
          }
        }
        return util.value(val, this, options);
      };
      helpers2.unlessEq = function(a, b, options) {
        if (util.isOptions(b)) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a !== b, this, options);
      };
      helpers2.unlessGt = function(a, b, options) {
        if (util.isOptions(b)) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a <= b, this, options);
      };
      helpers2.unlessLt = function(a, b, options) {
        if (util.isOptions(b)) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a >= b, this, options);
      };
      helpers2.unlessGteq = function(a, b, options) {
        if (util.isOptions(b)) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a < b, this, options);
      };
      helpers2.unlessLteq = function(a, b, options) {
        if (util.isOptions(b)) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a > b, this, options);
      };
    }
  });

  // ../../node_modules/is-number/node_modules/kind-of/index.js
  var require_kind_of3 = __commonJS({
    "../../node_modules/is-number/node_modules/kind-of/index.js"(exports, module) {
      var isBuffer = require_is_buffer();
      var toString = Object.prototype.toString;
      module.exports = function kindOf(val) {
        if (typeof val === "undefined") {
          return "undefined";
        }
        if (val === null) {
          return "null";
        }
        if (val === true || val === false || val instanceof Boolean) {
          return "boolean";
        }
        if (typeof val === "string" || val instanceof String) {
          return "string";
        }
        if (typeof val === "number" || val instanceof Number) {
          return "number";
        }
        if (typeof val === "function" || val instanceof Function) {
          return "function";
        }
        if (typeof Array.isArray !== "undefined" && Array.isArray(val)) {
          return "array";
        }
        if (val instanceof RegExp) {
          return "regexp";
        }
        if (val instanceof Date) {
          return "date";
        }
        var type = toString.call(val);
        if (type === "[object RegExp]") {
          return "regexp";
        }
        if (type === "[object Date]") {
          return "date";
        }
        if (type === "[object Arguments]") {
          return "arguments";
        }
        if (type === "[object Error]") {
          return "error";
        }
        if (isBuffer(val)) {
          return "buffer";
        }
        if (type === "[object Set]") {
          return "set";
        }
        if (type === "[object WeakSet]") {
          return "weakset";
        }
        if (type === "[object Map]") {
          return "map";
        }
        if (type === "[object WeakMap]") {
          return "weakmap";
        }
        if (type === "[object Symbol]") {
          return "symbol";
        }
        if (type === "[object Int8Array]") {
          return "int8array";
        }
        if (type === "[object Uint8Array]") {
          return "uint8array";
        }
        if (type === "[object Uint8ClampedArray]") {
          return "uint8clampedarray";
        }
        if (type === "[object Int16Array]") {
          return "int16array";
        }
        if (type === "[object Uint16Array]") {
          return "uint16array";
        }
        if (type === "[object Int32Array]") {
          return "int32array";
        }
        if (type === "[object Uint32Array]") {
          return "uint32array";
        }
        if (type === "[object Float32Array]") {
          return "float32array";
        }
        if (type === "[object Float64Array]") {
          return "float64array";
        }
        return "object";
      };
    }
  });

  // ../../node_modules/is-number/index.js
  var require_is_number = __commonJS({
    "../../node_modules/is-number/index.js"(exports, module) {
      "use strict";
      var typeOf = require_kind_of3();
      module.exports = function isNumber(num) {
        var type = typeOf(num);
        if (type !== "number" && type !== "string") {
          return false;
        }
        var n = +num;
        return n - n + 1 >= 0 && num !== "";
      };
    }
  });

  // ../../node_modules/get-object/index.js
  var require_get_object = __commonJS({
    "../../node_modules/get-object/index.js"(exports, module) {
      "use strict";
      var isNumber = require_is_number();
      module.exports = function getObject(obj, prop) {
        if (!prop)
          return obj;
        if (!obj)
          return {};
        var segs = String(prop).split(/[[.\]]/).filter(Boolean);
        var last = segs[segs.length - 1], res = {};
        while (prop = segs.shift()) {
          obj = obj[prop];
          if (!obj)
            return {};
        }
        if (isNumber(last))
          return [obj];
        res[last] = obj;
        return res;
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/object.js
  var require_object = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/object.js"(exports, module) {
      "use strict";
      var hasOwn = Object.hasOwnProperty;
      var util = require_handlebars_utils();
      var array = require_array();
      var helpers2 = module.exports;
      var getValue = require_get_value();
      var getObject = require_get_object();
      var createFrame = require_createFrame();
      helpers2.extend = function() {
        var args = [].slice.call(arguments);
        var opts = {};
        if (util.isOptions(args[args.length - 1])) {
          opts = args.pop().hash;
          args.push(opts);
        }
        var context = {};
        for (var i = 0; i < args.length; i++) {
          var obj = args[i];
          if (util.isObject(obj)) {
            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j++) {
              var key = keys[j];
              context[key] = obj[key];
            }
          }
        }
        return context;
      };
      helpers2.forIn = function(obj, options) {
        if (!util.isOptions(options)) {
          return obj.inverse(this);
        }
        var data = createFrame(options, options.hash);
        var result = "";
        for (var key in obj) {
          data.key = key;
          result += options.fn(obj[key], { data });
        }
        return result;
      };
      helpers2.forOwn = function(obj, options) {
        if (!util.isOptions(options)) {
          return obj.inverse(this);
        }
        var data = createFrame(options, options.hash);
        var result = "";
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            data.key = key;
            result += options.fn(obj[key], { data });
          }
        }
        return result;
      };
      helpers2.toPath = function() {
        var prop = [];
        for (var i = 0; i < arguments.length; i++) {
          if (typeof arguments[i] === "string" || typeof arguments[i] === "number") {
            prop.push(arguments[i]);
          }
        }
        return prop.join(".");
      };
      helpers2.get = function(prop, context, options) {
        var val = getValue(context, prop);
        if (options && options.fn) {
          return val ? options.fn(val) : options.inverse(context);
        }
        return val;
      };
      helpers2.getObject = function(prop, context) {
        return getObject(context, prop);
      };
      helpers2.hasOwn = function(context, key) {
        return hasOwn.call(context, key);
      };
      helpers2.isObject = function(value2) {
        return typeof value2 === "object";
      };
      helpers2.JSONparse = function(str, options) {
        return JSON.parse(str);
      };
      helpers2.JSONstringify = function(obj, indent) {
        if (isNaN(indent)) {
          indent = 0;
        }
        return JSON.stringify(obj, null, indent);
      };
      helpers2.merge = function(context) {
        var args = [].slice.call(arguments);
        var opts = {};
        if (util.isOptions(args[args.length - 1])) {
          opts = args.pop().hash;
          args.push(opts);
        }
        return Object.assign.apply(null, args);
      };
      helpers2.parseJSON = helpers2.JSONparse;
      helpers2.pick = function(props, context, options) {
        var keys = array.arrayify(props);
        var len = keys.length, i = -1;
        var result = {};
        while (++i < len) {
          result = helpers2.extend({}, result, getObject(context, keys[i]));
        }
        if (options.fn) {
          if (Object.keys(result).length) {
            return options.fn(result);
          }
          return options.inverse(context);
        }
        return result;
      };
      helpers2.stringify = helpers2.JSONstringify;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/regex.js
  var require_regex = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/regex.js"(exports, module) {
      "use strict";
      var util = require_handlebars_utils();
      var helpers2 = module.exports;
      var kindOf = require_kind_of2();
      helpers2.toRegex = function(str, locals, options) {
        var opts = util.options({}, locals, options);
        return new RegExp(str, opts.flags);
      };
      helpers2.test = function(str, regex) {
        if (typeof str !== "string") {
          return false;
        }
        if (kindOf(regex) !== "regexp") {
          throw new TypeError("expected a regular expression");
        }
        return regex.test(str);
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/rng.js
  function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
      import_crypto.default.randomFillSync(rnds8Pool);
      poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
  }
  var import_crypto, rnds8Pool, poolPtr;
  var init_rng = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/rng.js"() {
      import_crypto = __toESM(__require("crypto"));
      rnds8Pool = new Uint8Array(256);
      poolPtr = rnds8Pool.length;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/regex.js
  var regex_default;
  var init_regex = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/regex.js"() {
      regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/validate.js
  function validate(uuid) {
    return typeof uuid === "string" && regex_default.test(uuid);
  }
  var validate_default;
  var init_validate = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/validate.js"() {
      init_regex();
      validate_default = validate;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/stringify.js
  function unsafeStringify(arr, offset = 0) {
    return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
  }
  function stringify(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset);
    if (!validate_default(uuid)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
  }
  var byteToHex, stringify_default;
  var init_stringify = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/stringify.js"() {
      init_validate();
      byteToHex = [];
      for (let i = 0; i < 256; ++i) {
        byteToHex.push((i + 256).toString(16).slice(1));
      }
      stringify_default = stringify;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v1.js
  function v1(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node || _nodeId;
    let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
    if (node == null || clockseq == null) {
      const seedBytes = options.random || (options.rng || rng)();
      if (node == null) {
        node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
      }
      if (clockseq == null) {
        clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
      }
    }
    let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
    let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
    if (dt < 0 && options.clockseq === void 0) {
      clockseq = clockseq + 1 & 16383;
    }
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
      nsecs = 0;
    }
    if (nsecs >= 1e4) {
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;
    msecs += 122192928e5;
    const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
    b[i++] = tl >>> 24 & 255;
    b[i++] = tl >>> 16 & 255;
    b[i++] = tl >>> 8 & 255;
    b[i++] = tl & 255;
    const tmh = msecs / 4294967296 * 1e4 & 268435455;
    b[i++] = tmh >>> 8 & 255;
    b[i++] = tmh & 255;
    b[i++] = tmh >>> 24 & 15 | 16;
    b[i++] = tmh >>> 16 & 255;
    b[i++] = clockseq >>> 8 | 128;
    b[i++] = clockseq & 255;
    for (let n = 0; n < 6; ++n) {
      b[i + n] = node[n];
    }
    return buf || unsafeStringify(b);
  }
  var _nodeId, _clockseq, _lastMSecs, _lastNSecs, v1_default;
  var init_v1 = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v1.js"() {
      init_rng();
      init_stringify();
      _lastMSecs = 0;
      _lastNSecs = 0;
      v1_default = v1;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/parse.js
  function parse(uuid) {
    if (!validate_default(uuid)) {
      throw TypeError("Invalid UUID");
    }
    let v;
    const arr = new Uint8Array(16);
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 255;
    arr[2] = v >>> 8 & 255;
    arr[3] = v & 255;
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 255;
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 255;
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 255;
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
    arr[11] = v / 4294967296 & 255;
    arr[12] = v >>> 24 & 255;
    arr[13] = v >>> 16 & 255;
    arr[14] = v >>> 8 & 255;
    arr[15] = v & 255;
    return arr;
  }
  var parse_default;
  var init_parse = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/parse.js"() {
      init_validate();
      parse_default = parse;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v35.js
  function stringToBytes(str) {
    str = unescape(encodeURIComponent(str));
    const bytes = [];
    for (let i = 0; i < str.length; ++i) {
      bytes.push(str.charCodeAt(i));
    }
    return bytes;
  }
  function v35(name, version2, hashfunc) {
    function generateUUID(value2, namespace, buf, offset) {
      var _namespace;
      if (typeof value2 === "string") {
        value2 = stringToBytes(value2);
      }
      if (typeof namespace === "string") {
        namespace = parse_default(namespace);
      }
      if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
        throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      }
      let bytes = new Uint8Array(16 + value2.length);
      bytes.set(namespace);
      bytes.set(value2, namespace.length);
      bytes = hashfunc(bytes);
      bytes[6] = bytes[6] & 15 | version2;
      bytes[8] = bytes[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = bytes[i];
        }
        return buf;
      }
      return unsafeStringify(bytes);
    }
    try {
      generateUUID.name = name;
    } catch (err) {
    }
    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
  }
  var DNS, URL;
  var init_v35 = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v35.js"() {
      init_stringify();
      init_parse();
      DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
      URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/md5.js
  function md5(bytes) {
    if (Array.isArray(bytes)) {
      bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
      bytes = Buffer.from(bytes, "utf8");
    }
    return import_crypto2.default.createHash("md5").update(bytes).digest();
  }
  var import_crypto2, md5_default;
  var init_md5 = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/md5.js"() {
      import_crypto2 = __toESM(__require("crypto"));
      md5_default = md5;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v3.js
  var v3, v3_default;
  var init_v3 = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v3.js"() {
      init_v35();
      init_md5();
      v3 = v35("v3", 48, md5_default);
      v3_default = v3;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/native.js
  var import_crypto3, native_default;
  var init_native = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/native.js"() {
      import_crypto3 = __toESM(__require("crypto"));
      native_default = {
        randomUUID: import_crypto3.default.randomUUID
      };
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v4.js
  function v4(options, buf, offset) {
    if (native_default.randomUUID && !buf && !options) {
      return native_default.randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  var v4_default;
  var init_v4 = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v4.js"() {
      init_native();
      init_rng();
      init_stringify();
      v4_default = v4;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/sha1.js
  function sha1(bytes) {
    if (Array.isArray(bytes)) {
      bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
      bytes = Buffer.from(bytes, "utf8");
    }
    return import_crypto4.default.createHash("sha1").update(bytes).digest();
  }
  var import_crypto4, sha1_default;
  var init_sha1 = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/sha1.js"() {
      import_crypto4 = __toESM(__require("crypto"));
      sha1_default = sha1;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v5.js
  var v5, v5_default;
  var init_v5 = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/v5.js"() {
      init_v35();
      init_sha1();
      v5 = v35("v5", 80, sha1_default);
      v5_default = v5;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/nil.js
  var nil_default;
  var init_nil = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/nil.js"() {
      nil_default = "00000000-0000-0000-0000-000000000000";
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/version.js
  function version(uuid) {
    if (!validate_default(uuid)) {
      throw TypeError("Invalid UUID");
    }
    return parseInt(uuid.slice(14, 15), 16);
  }
  var version_default;
  var init_version = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/version.js"() {
      init_validate();
      version_default = version;
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/index.js
  var esm_node_exports = {};
  __export(esm_node_exports, {
    NIL: () => nil_default,
    parse: () => parse_default,
    stringify: () => stringify_default,
    v1: () => v1_default,
    v3: () => v3_default,
    v4: () => v4_default,
    v5: () => v5_default,
    validate: () => validate_default,
    version: () => version_default
  });
  var init_esm_node = __esm({
    "../../node_modules/@budibase/handlebars-helpers/node_modules/uuid/dist/esm-node/index.js"() {
      init_v1();
      init_v3();
      init_v4();
      init_v5();
      init_nil();
      init_version();
      init_validate();
      init_stringify();
      init_parse();
    }
  });

  // ../../node_modules/@budibase/handlebars-helpers/lib/uuid.js
  var require_uuid = __commonJS({
    "../../node_modules/@budibase/handlebars-helpers/lib/uuid.js"(exports, module) {
      var uuid = (init_esm_node(), __toCommonJS(esm_node_exports));
      var helpers2 = module.exports;
      helpers2.uuid = function() {
        return uuid.v4();
      };
    }
  });

  // ../string-templates/src/helpers/list.js
  var require_list = __commonJS({
    "../string-templates/src/helpers/list.js"(exports, module) {
      var { date, duration } = require_date();
      var externalCollections = {
        math: require_math(),
        array: require_array(),
        number: require_number(),
        url: require_url(),
        string: require_string(),
        comparison: require_comparison(),
        object: require_object(),
        regex: require_regex(),
        uuid: require_uuid()
      };
      var helpersToRemoveForJs = ["sortBy"];
      module.exports.helpersToRemoveForJs = helpersToRemoveForJs;
      var addedHelpers = {
        date,
        duration
      };
      var helpers2 = void 0;
      module.exports.getJsHelperList = () => {
        if (helpers2) {
          return helpers2;
        }
        helpers2 = {};
        for (let collection of Object.values(externalCollections)) {
          for (let [key, func] of Object.entries(collection)) {
            helpers2[key] = (...props) => func(...props, {});
          }
        }
        for (let key of Object.keys(addedHelpers)) {
          helpers2[key] = addedHelpers[key];
        }
        for (const toRemove of helpersToRemoveForJs) {
          delete helpers2[toRemove];
        }
        Object.freeze(helpers2);
        return helpers2;
      };
    }
  });

  // src/jsRunner/bundles/index-helpers.ts
  var index_helpers_exports = {};
  __export(index_helpers_exports, {
    helpers: () => helpers
  });
  var {
    getJsHelperList
  } = require_list();
  var helpers = {
    ...getJsHelperList(),
    // pointing stripProtocol to a unexisting function to be able to declare it on isolated-vm
    // @ts-ignore
    // eslint-disable-next-line no-undef
    stripProtocol: helpersStripProtocol
  };
  return __toCommonJS(index_helpers_exports);
})();
/*! Bundled license information:

is-buffer/index.js:
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

isobject/index.js:
  (*!
   * isobject <https://github.com/jonschlinkert/isobject>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

get-value/index.js:
  (*!
   * get-value <https://github.com/jonschlinkert/get-value>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   *)

has-values/index.js:
  (*!
   * has-values <https://github.com/jonschlinkert/has-values>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   *)

has-value/index.js:
  (*!
   * has-value <https://github.com/jonschlinkert/has-value>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   *)

is-number/index.js:
  (*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

get-object/index.js:
  (*!
   * get-object <https://github.com/jonschlinkert/get-object>
   *
   * Copyright (c) 2014 Jon Schlinkert, contributors.
   * Licensed under the MIT License
   *)
*/
