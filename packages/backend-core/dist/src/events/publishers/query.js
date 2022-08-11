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
exports.previewed = exports.run = exports.imported = exports.deleted = exports.updated = exports.created = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
/* eslint-disable */
const created = (datasource, query, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = {
        queryId: query._id,
        datasourceId: datasource._id,
        source: datasource.source,
        queryVerb: query.queryVerb,
    };
    yield (0, events_1.publishEvent)(types_1.Event.QUERY_CREATED, properties, timestamp);
});
exports.created = created;
const updated = (datasource, query) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = {
        queryId: query._id,
        datasourceId: datasource._id,
        source: datasource.source,
        queryVerb: query.queryVerb,
    };
    yield (0, events_1.publishEvent)(types_1.Event.QUERY_UPDATED, properties);
});
exports.updated = updated;
const deleted = (datasource, query) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = {
        queryId: query._id,
        datasourceId: datasource._id,
        source: datasource.source,
        queryVerb: query.queryVerb,
    };
    yield (0, events_1.publishEvent)(types_1.Event.QUERY_DELETED, properties);
});
exports.deleted = deleted;
const imported = (datasource, importSource, count) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = {
        datasourceId: datasource._id,
        source: datasource.source,
        count,
        importSource,
    };
    yield (0, events_1.publishEvent)(types_1.Event.QUERY_IMPORT, properties);
});
exports.imported = imported;
const run = (count, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = {
        count,
    };
    yield (0, events_1.publishEvent)(types_1.Event.QUERIES_RUN, properties, timestamp);
});
exports.run = run;
const previewed = (datasource, query) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = {
        queryId: query._id,
        datasourceId: datasource._id,
        source: datasource.source,
        queryVerb: query.queryVerb,
    };
    yield (0, events_1.publishEvent)(types_1.Event.QUERY_PREVIEWED, properties);
});
exports.previewed = previewed;
//# sourceMappingURL=query.js.map