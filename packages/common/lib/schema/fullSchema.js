"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.fullSchema = void 0;var fullSchema = function fullSchema(models, views) {
  var findModel = function findModel(idOrName) {return (
      models.find(
      function (m) {return m.id === idOrName || m.name.toLowerCase() === idOrName.toLowerCase();}));};


  var findView = function findView(idOrName) {return (
      views.find(
      function (m) {return m.id === idOrName || m.name.toLowerCase() === idOrName.toLowerCase();}));};


  var findField = function findField(modelIdOrName, fieldName) {
    var model = models.find(
    function (m) {return (
        m.id === modelIdOrName ||
        m.name.toLowerCase() === modelIdOrName.toLowerCase());});

    return model.fields.find(
    function (f) {return f.name.toLowerCase() === fieldName.toLowerCase();});

  };

  var viewsForModel = function viewsForModel(modelId) {return views.filter(function (v) {return v.modelId === modelId;});};

  return {
    models: models,
    views: views,
    findModel: findModel,
    findField: findField,
    findView: findView,
    viewsForModel: viewsForModel };

};exports.fullSchema = fullSchema;
//# sourceMappingURL=fullSchema.js.map