"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRelationshipField = isRelationshipField;
exports.isManyToMany = isManyToMany;
exports.isOneToMany = isOneToMany;
exports.isManyToOne = isManyToOne;
// all added by grid/table when defining the
// column size, position and whether it can be viewed
const row_1 = require("../row");
const constants_1 = require("./constants");
function isRelationshipField(field) {
    return field.type === row_1.FieldType.LINK;
}
function isManyToMany(field) {
    return field.relationshipType === constants_1.RelationshipType.MANY_TO_MANY;
}
function isOneToMany(field) {
    return field.relationshipType === constants_1.RelationshipType.ONE_TO_MANY;
}
function isManyToOne(field) {
    return field.relationshipType === constants_1.RelationshipType.MANY_TO_ONE;
}
