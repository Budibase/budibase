"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationFieldTypeEnum = exports.AIOperationEnum = void 0;
var AIOperationEnum;
(function (AIOperationEnum) {
    AIOperationEnum["SUMMARISE_TEXT"] = "SUMMARISE_TEXT";
    AIOperationEnum["CLEAN_DATA"] = "CLEAN_DATA";
    AIOperationEnum["TRANSLATE"] = "TRANSLATE";
    AIOperationEnum["CATEGORISE_TEXT"] = "CATEGORISE_TEXT";
    AIOperationEnum["SENTIMENT_ANALYSIS"] = "SENTIMENT_ANALYSIS";
    AIOperationEnum["PROMPT"] = "PROMPT";
    AIOperationEnum["SEARCH_WEB"] = "SEARCH_WEB";
})(AIOperationEnum || (exports.AIOperationEnum = AIOperationEnum = {}));
var OperationFieldTypeEnum;
(function (OperationFieldTypeEnum) {
    OperationFieldTypeEnum["MULTI_COLUMN"] = "columns";
    OperationFieldTypeEnum["COLUMN"] = "column";
    OperationFieldTypeEnum["BINDABLE_TEXT"] = "prompt";
})(OperationFieldTypeEnum || (exports.OperationFieldTypeEnum = OperationFieldTypeEnum = {}));
