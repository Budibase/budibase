import { getEventTarget } from "../utils/dom";
if (typeof window.CustomEvent !== "function") {
    function CustomEvent(typeArg, eventInitDict) {
        eventInitDict = eventInitDict || {
            bubbles: false,
            cancelable: false,
            detail: undefined,
        };
        const evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(typeArg, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
}
function delta(e) {
    return Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY));
}
const scroll = (e) => {
    e.preventDefault();
    const ev = new CustomEvent("increment", {
        bubbles: true,
    });
    ev.delta = delta(e);
    getEventTarget(e).dispatchEvent(ev);
};
function scrollMonth(fp) {
    return (e) => {
        e.preventDefault();
        const mDelta = delta(e);
        fp.changeMonth(mDelta);
    };
}
function scrollPlugin() {
    return function (fp) {
        const monthScroller = scrollMonth(fp);
        return {
            onReady() {
                if (fp.timeContainer) {
                    fp.timeContainer.addEventListener("wheel", scroll);
                }
                fp.yearElements.forEach((yearElem) => yearElem.addEventListener("wheel", scroll));
                fp.monthElements.forEach((monthElem) => monthElem.addEventListener("wheel", monthScroller));
                fp.loadedPlugins.push("scroll");
            },
            onDestroy() {
                if (fp.timeContainer) {
                    fp.timeContainer.removeEventListener("wheel", scroll);
                }
                fp.yearElements.forEach((yearElem) => yearElem.removeEventListener("wheel", scroll));
                fp.monthElements.forEach((monthElem) => monthElem.removeEventListener("wheel", monthScroller));
            },
        };
    };
}
export default scrollPlugin;
