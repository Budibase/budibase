var getOperationShapeNames = require('./get-operation-shape-names').getOperationShapeNames;
var visitRelatedShapeNames = require('./visit-related-shape-names').visitRelatedShapeNames;

function pruneShapes(model) {

    // start by grabbing the input/output shapes on all operations
    var operationShapeNames = getOperationShapeNames(model);
    var shapeMap = model.shapes;

    for (operationShape of operationShapeNames) {
        // traverse the tree and store visited shapes
        visitRelatedShapeNames(operationShape, shapeMap);
    }

    // iterate over the shapeMap and remove any shape that wasn't visited
    var shapeNames = Object.keys(shapeMap);
    for (var name of shapeNames) {
        if (!shapeMap[name].visited) {
            delete shapeMap[name];
        }
    }

};

module.exports = {
    pruneShapes: pruneShapes
};