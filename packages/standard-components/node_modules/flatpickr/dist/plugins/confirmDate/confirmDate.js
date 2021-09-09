(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.confirmDatePlugin = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function getEventTarget(event) {
        try {
            if (typeof event.composedPath === "function") {
                var path = event.composedPath();
                return path[0];
            }
            return event.target;
        }
        catch (error) {
            return event.target;
        }
    }

    var defaultConfig = {
        confirmIcon: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='17' height='17' viewBox='0 0 17 17'> <g> </g> <path d='M15.418 1.774l-8.833 13.485-4.918-4.386 0.666-0.746 4.051 3.614 8.198-12.515 0.836 0.548z' fill='#000000' /> </svg>",
        confirmText: "OK ",
        showAlways: false,
        theme: "light",
    };
    function confirmDatePlugin(pluginConfig) {
        var config = __assign(__assign({}, defaultConfig), pluginConfig);
        var confirmContainer;
        var confirmButtonCSSClass = "flatpickr-confirm";
        return function (fp) {
            if (fp.config.noCalendar || fp.isMobile)
                return {};
            return __assign({ onKeyDown: function (_, __, ___, e) {
                    var eventTarget = getEventTarget(e);
                    if (fp.config.enableTime &&
                        e.key === "Tab" &&
                        eventTarget === fp.amPM) {
                        e.preventDefault();
                        confirmContainer.focus();
                    }
                    else if (e.key === "Enter" && eventTarget === confirmContainer)
                        fp.close();
                },
                onReady: function () {
                    confirmContainer = fp._createElement("div", confirmButtonCSSClass + " " + (config.showAlways ? "visible" : "") + " " + config.theme + "Theme", config.confirmText);
                    confirmContainer.tabIndex = -1;
                    confirmContainer.innerHTML += config.confirmIcon;
                    confirmContainer.addEventListener("click", fp.close);
                    fp.calendarContainer.appendChild(confirmContainer);
                    fp.loadedPlugins.push("confirmDate");
                } }, (!config.showAlways
                ? {
                    onChange: function (_, dateStr) {
                        var showCondition = fp.config.enableTime ||
                            fp.config.mode === "multiple" ||
                            fp.loadedPlugins.indexOf("monthSelect") !== -1;
                        var localConfirmContainer = fp.calendarContainer.querySelector("." + confirmButtonCSSClass);
                        if (!localConfirmContainer)
                            return;
                        if (dateStr &&
                            !fp.config.inline &&
                            showCondition &&
                            localConfirmContainer)
                            return localConfirmContainer.classList.add("visible");
                        localConfirmContainer.classList.remove("visible");
                    },
                }
                : {}));
        };
    }

    return confirmDatePlugin;

})));
