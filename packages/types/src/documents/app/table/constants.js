"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BBReferenceFieldSubType = exports.FormulaType = exports.JsonFieldSubType = exports.AutoFieldSubType = exports.AutoReason = exports.RelationshipType = void 0;
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["ONE_TO_MANY"] = "one-to-many";
    RelationshipType["MANY_TO_ONE"] = "many-to-one";
    RelationshipType["MANY_TO_MANY"] = "many-to-many";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
var AutoReason;
(function (AutoReason) {
    AutoReason["FOREIGN_KEY"] = "foreign_key";
})(AutoReason || (exports.AutoReason = AutoReason = {}));
var AutoFieldSubType;
(function (AutoFieldSubType) {
    AutoFieldSubType["CREATED_BY"] = "createdBy";
    AutoFieldSubType["CREATED_AT"] = "createdAt";
    AutoFieldSubType["UPDATED_BY"] = "updatedBy";
    AutoFieldSubType["UPDATED_AT"] = "updatedAt";
    AutoFieldSubType["AUTO_ID"] = "autoID";
})(AutoFieldSubType || (exports.AutoFieldSubType = AutoFieldSubType = {}));
var JsonFieldSubType;
(function (JsonFieldSubType) {
    JsonFieldSubType["ARRAY"] = "array";
})(JsonFieldSubType || (exports.JsonFieldSubType = JsonFieldSubType = {}));
var FormulaType;
(function (FormulaType) {
    FormulaType["STATIC"] = "static";
    FormulaType["DYNAMIC"] = "dynamic";
    FormulaType["AI"] = "ai";
})(FormulaType || (exports.FormulaType = FormulaType = {}));
var BBReferenceFieldSubType;
(function (BBReferenceFieldSubType) {
    BBReferenceFieldSubType["USER"] = "user";
    /** @deprecated this should not be used anymore, left here in order to support the existing usages */
    BBReferenceFieldSubType["USERS"] = "users";
})(BBReferenceFieldSubType || (exports.BBReferenceFieldSubType = BBReferenceFieldSubType = {}));
