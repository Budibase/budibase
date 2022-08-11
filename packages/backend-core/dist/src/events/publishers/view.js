"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculationDeleted = exports.calculationUpdated = exports.calculationCreated = exports.filterDeleted = exports.filterUpdated = exports.filterCreated = exports.exported = exports.deleted = exports.updated = exports.created = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
/* eslint-disable */
function created(view, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: view.tableId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_CREATED, properties, timestamp);
    });
}
exports.created = created;
function updated(view) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: view.tableId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_UPDATED, properties);
    });
}
exports.updated = updated;
function deleted(view) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: view.tableId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_DELETED, properties);
    });
}
exports.deleted = deleted;
function exported(table, format) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: table._id,
            format,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_EXPORTED, properties);
    });
}
exports.exported = exported;
function filterCreated(view, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: view.tableId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_FILTER_CREATED, properties, timestamp);
    });
}
exports.filterCreated = filterCreated;
function filterUpdated(view) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: view.tableId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_FILTER_UPDATED, properties);
    });
}
exports.filterUpdated = filterUpdated;
function filterDeleted(view) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: view.tableId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_FILTER_DELETED, properties);
    });
}
exports.filterDeleted = filterDeleted;
function calculationCreated(view, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: view.tableId,
            calculation: view.calculation,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_CALCULATION_CREATED, properties, timestamp);
    });
}
exports.calculationCreated = calculationCreated;
function calculationUpdated(view) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: view.tableId,
            calculation: view.calculation,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_CALCULATION_UPDATED, properties);
    });
}
exports.calculationUpdated = calculationUpdated;
function calculationDeleted(existingView) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            tableId: existingView.tableId,
            calculation: existingView.calculation,
        };
        yield (0, events_1.publishEvent)(types_1.Event.VIEW_CALCULATION_DELETED, properties);
    });
}
exports.calculationDeleted = calculationDeleted;
//# sourceMappingURL=view.js.map