"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["ROW_SAVE"] = "row:save";
    EventType["ROW_UPDATE"] = "row:update";
    EventType["ROW_DELETE"] = "row:delete";
    EventType["TABLE_SAVE"] = "table:save";
    EventType["TABLE_UPDATED"] = "table:updated";
    EventType["TABLE_DELETE"] = "table:delete";
})(EventType || (exports.EventType = EventType = {}));
