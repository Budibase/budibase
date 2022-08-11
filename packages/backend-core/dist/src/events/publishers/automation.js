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
exports.stepDeleted = exports.stepCreated = exports.run = exports.tested = exports.deleted = exports.triggerUpdated = exports.created = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
function created(automation, timestamp) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: automation.appId,
            automationId: automation._id,
            triggerId: (_b = (_a = automation.definition) === null || _a === void 0 ? void 0 : _a.trigger) === null || _b === void 0 ? void 0 : _b.id,
            triggerType: (_d = (_c = automation.definition) === null || _c === void 0 ? void 0 : _c.trigger) === null || _d === void 0 ? void 0 : _d.stepId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTOMATION_CREATED, properties, timestamp);
    });
}
exports.created = created;
function triggerUpdated(automation) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: automation.appId,
            automationId: automation._id,
            triggerId: (_b = (_a = automation.definition) === null || _a === void 0 ? void 0 : _a.trigger) === null || _b === void 0 ? void 0 : _b.id,
            triggerType: (_d = (_c = automation.definition) === null || _c === void 0 ? void 0 : _c.trigger) === null || _d === void 0 ? void 0 : _d.stepId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTOMATION_TRIGGER_UPDATED, properties);
    });
}
exports.triggerUpdated = triggerUpdated;
function deleted(automation) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: automation.appId,
            automationId: automation._id,
            triggerId: (_b = (_a = automation.definition) === null || _a === void 0 ? void 0 : _a.trigger) === null || _b === void 0 ? void 0 : _b.id,
            triggerType: (_d = (_c = automation.definition) === null || _c === void 0 ? void 0 : _c.trigger) === null || _d === void 0 ? void 0 : _d.stepId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTOMATION_DELETED, properties);
    });
}
exports.deleted = deleted;
function tested(automation) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: automation.appId,
            automationId: automation._id,
            triggerId: (_b = (_a = automation.definition) === null || _a === void 0 ? void 0 : _a.trigger) === null || _b === void 0 ? void 0 : _b.id,
            triggerType: (_d = (_c = automation.definition) === null || _c === void 0 ? void 0 : _c.trigger) === null || _d === void 0 ? void 0 : _d.stepId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTOMATION_TESTED, properties);
    });
}
exports.tested = tested;
const run = (count, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = {
        count,
    };
    yield (0, events_1.publishEvent)(types_1.Event.AUTOMATIONS_RUN, properties, timestamp);
});
exports.run = run;
function stepCreated(automation, step, timestamp) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: automation.appId,
            automationId: automation._id,
            triggerId: (_b = (_a = automation.definition) === null || _a === void 0 ? void 0 : _a.trigger) === null || _b === void 0 ? void 0 : _b.id,
            triggerType: (_d = (_c = automation.definition) === null || _c === void 0 ? void 0 : _c.trigger) === null || _d === void 0 ? void 0 : _d.stepId,
            stepId: step.id,
            stepType: step.stepId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTOMATION_STEP_CREATED, properties, timestamp);
    });
}
exports.stepCreated = stepCreated;
function stepDeleted(automation, step) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: automation.appId,
            automationId: automation._id,
            triggerId: (_b = (_a = automation.definition) === null || _a === void 0 ? void 0 : _a.trigger) === null || _b === void 0 ? void 0 : _b.id,
            triggerType: (_d = (_c = automation.definition) === null || _c === void 0 ? void 0 : _c.trigger) === null || _d === void 0 ? void 0 : _d.stepId,
            stepId: step.id,
            stepType: step.stepId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTOMATION_STEP_DELETED, properties);
    });
}
exports.stepDeleted = stepDeleted;
//# sourceMappingURL=automation.js.map