"use strict";
var _ = require("./");
window.next = {
    version: _.version,
    // router is initialized later so it has to be live-binded
    get router () {
        return _.router;
    },
    emitter: _.emitter
};
(0, _).initNext().catch(console.error);

//# sourceMappingURL=next.js.map