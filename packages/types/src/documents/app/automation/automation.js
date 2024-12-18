"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopStepType = exports.AutomationEventType = exports.AutomationStoppedReason = exports.AutomationStatus = exports.AutomationStepStatus = exports.AutomationFeature = exports.AutomationStepIdArray = exports.AutomationActionStepId = exports.AutomationStepType = exports.AutomationTriggerStepId = exports.AutomationCustomIOType = exports.AutomationIOType = void 0;
var AutomationIOType;
(function (AutomationIOType) {
    AutomationIOType["OBJECT"] = "object";
    AutomationIOType["STRING"] = "string";
    AutomationIOType["BOOLEAN"] = "boolean";
    AutomationIOType["NUMBER"] = "number";
    AutomationIOType["ARRAY"] = "array";
    AutomationIOType["JSON"] = "json";
    AutomationIOType["DATE"] = "date";
    AutomationIOType["ATTACHMENT"] = "attachment";
})(AutomationIOType || (exports.AutomationIOType = AutomationIOType = {}));
var AutomationCustomIOType;
(function (AutomationCustomIOType) {
    AutomationCustomIOType["TABLE"] = "table";
    AutomationCustomIOType["ROW"] = "row";
    AutomationCustomIOType["ROWS"] = "rows";
    AutomationCustomIOType["WIDE"] = "wide";
    AutomationCustomIOType["QUERY"] = "query";
    AutomationCustomIOType["QUERY_PARAMS"] = "queryParams";
    AutomationCustomIOType["QUERY_LIMIT"] = "queryLimit";
    AutomationCustomIOType["LOOP_OPTION"] = "loopOption";
    AutomationCustomIOType["ITEM"] = "item";
    AutomationCustomIOType["CODE"] = "code";
    AutomationCustomIOType["FILTERS"] = "filters";
    AutomationCustomIOType["COLUMN"] = "column";
    AutomationCustomIOType["TRIGGER_SCHEMA"] = "triggerSchema";
    AutomationCustomIOType["CRON"] = "cron";
    AutomationCustomIOType["WEBHOOK_URL"] = "webhookUrl";
    AutomationCustomIOType["AUTOMATION"] = "automation";
    AutomationCustomIOType["AUTOMATION_FIELDS"] = "automationFields";
    AutomationCustomIOType["MULTI_ATTACHMENTS"] = "multi_attachments";
    AutomationCustomIOType["TRIGGER_FILTER"] = "trigger_filter";
})(AutomationCustomIOType || (exports.AutomationCustomIOType = AutomationCustomIOType = {}));
var AutomationTriggerStepId;
(function (AutomationTriggerStepId) {
    AutomationTriggerStepId["ROW_SAVED"] = "ROW_SAVED";
    AutomationTriggerStepId["ROW_UPDATED"] = "ROW_UPDATED";
    AutomationTriggerStepId["ROW_DELETED"] = "ROW_DELETED";
    AutomationTriggerStepId["WEBHOOK"] = "WEBHOOK";
    AutomationTriggerStepId["APP"] = "APP";
    AutomationTriggerStepId["CRON"] = "CRON";
    AutomationTriggerStepId["ROW_ACTION"] = "ROW_ACTION";
})(AutomationTriggerStepId || (exports.AutomationTriggerStepId = AutomationTriggerStepId = {}));
var AutomationStepType;
(function (AutomationStepType) {
    AutomationStepType["LOGIC"] = "LOGIC";
    AutomationStepType["ACTION"] = "ACTION";
    AutomationStepType["TRIGGER"] = "TRIGGER";
})(AutomationStepType || (exports.AutomationStepType = AutomationStepType = {}));
var AutomationActionStepId;
(function (AutomationActionStepId) {
    AutomationActionStepId["SEND_EMAIL_SMTP"] = "SEND_EMAIL_SMTP";
    AutomationActionStepId["CREATE_ROW"] = "CREATE_ROW";
    AutomationActionStepId["UPDATE_ROW"] = "UPDATE_ROW";
    AutomationActionStepId["DELETE_ROW"] = "DELETE_ROW";
    AutomationActionStepId["EXECUTE_BASH"] = "EXECUTE_BASH";
    AutomationActionStepId["OUTGOING_WEBHOOK"] = "OUTGOING_WEBHOOK";
    AutomationActionStepId["EXECUTE_SCRIPT"] = "EXECUTE_SCRIPT";
    AutomationActionStepId["EXECUTE_QUERY"] = "EXECUTE_QUERY";
    AutomationActionStepId["SERVER_LOG"] = "SERVER_LOG";
    AutomationActionStepId["DELAY"] = "DELAY";
    AutomationActionStepId["FILTER"] = "FILTER";
    AutomationActionStepId["QUERY_ROWS"] = "QUERY_ROWS";
    AutomationActionStepId["LOOP"] = "LOOP";
    AutomationActionStepId["COLLECT"] = "COLLECT";
    AutomationActionStepId["OPENAI"] = "OPENAI";
    AutomationActionStepId["TRIGGER_AUTOMATION_RUN"] = "TRIGGER_AUTOMATION_RUN";
    AutomationActionStepId["BRANCH"] = "BRANCH";
    // these used to be lowercase step IDs, maintain for backwards compat
    AutomationActionStepId["discord"] = "discord";
    AutomationActionStepId["slack"] = "slack";
    AutomationActionStepId["zapier"] = "zapier";
    AutomationActionStepId["integromat"] = "integromat";
    AutomationActionStepId["n8n"] = "n8n";
})(AutomationActionStepId || (exports.AutomationActionStepId = AutomationActionStepId = {}));
exports.AutomationStepIdArray = [
    ...Object.values(AutomationActionStepId),
    ...Object.values(AutomationTriggerStepId),
];
var AutomationFeature;
(function (AutomationFeature) {
    AutomationFeature["LOOPING"] = "LOOPING";
})(AutomationFeature || (exports.AutomationFeature = AutomationFeature = {}));
var AutomationStepStatus;
(function (AutomationStepStatus) {
    AutomationStepStatus["NO_ITERATIONS"] = "no_iterations";
    AutomationStepStatus["MAX_ITERATIONS"] = "max_iterations_reached";
})(AutomationStepStatus || (exports.AutomationStepStatus = AutomationStepStatus = {}));
var AutomationStatus;
(function (AutomationStatus) {
    AutomationStatus["SUCCESS"] = "success";
    AutomationStatus["ERROR"] = "error";
    AutomationStatus["STOPPED"] = "stopped";
    AutomationStatus["STOPPED_ERROR"] = "stopped_error";
    AutomationStatus["NO_CONDITION_MET"] = "No branch condition met";
})(AutomationStatus || (exports.AutomationStatus = AutomationStatus = {}));
var AutomationStoppedReason;
(function (AutomationStoppedReason) {
    AutomationStoppedReason["TRIGGER_FILTER_NOT_MET"] = "Automation did not run. Filter conditions in trigger were not met.";
})(AutomationStoppedReason || (exports.AutomationStoppedReason = AutomationStoppedReason = {}));
var AutomationEventType;
(function (AutomationEventType) {
    AutomationEventType["ROW_SAVE"] = "row:save";
    AutomationEventType["ROW_UPDATE"] = "row:update";
    AutomationEventType["ROW_DELETE"] = "row:delete";
    AutomationEventType["APP_TRIGGER"] = "app:trigger";
    AutomationEventType["CRON_TRIGGER"] = "cron:trigger";
    AutomationEventType["WEBHOOK_TRIGGER"] = "web:trigger";
    AutomationEventType["ROW_ACTION"] = "row:action";
})(AutomationEventType || (exports.AutomationEventType = AutomationEventType = {}));
var LoopStepType;
(function (LoopStepType) {
    LoopStepType["ARRAY"] = "Array";
    LoopStepType["STRING"] = "String";
})(LoopStepType || (exports.LoopStepType = LoopStepType = {}));
