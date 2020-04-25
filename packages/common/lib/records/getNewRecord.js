"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.getNewRecord = void 0;var _shortid = require("shortid");

var getNewRecord = function getNewRecord(schema, modelName) {
  var model = schema.findModel(modelName);

  var record = {
    _id: (0, _shortid.generate)(),
    modelId: model._id 
  };


  for (var field in model.schema.properties) {
    record[field] = field["default"];
  }

  return record;
};exports.getNewRecord = getNewRecord;
//# sourceMappingURL=getNewRecord.js.map