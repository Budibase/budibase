"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mitt;
function mitt() {
    const all = Object.create(null);
    return {
        on (type, handler) {
            (all[type] || (all[type] = [])).push(handler);
        },
        off (type, handler) {
            if (all[type]) {
                all[type].splice(all[type].indexOf(handler) >>> 0, 1);
            }
        },
        emit (type, ...evts) {
            (all[type] || []).slice().map((handler)=>{
                handler(...evts);
            });
        }
    };
}

//# sourceMappingURL=mitt.js.map