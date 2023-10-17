function getOperationShapeNames(model) {
    var operationShapeNames = [];
    var operations = model.operations;

    for (var operationName of Object.keys(operations)) {
        var operation = operations[operationName];
        if (operation.input && operation.input.shape) {
            operationShapeNames.push(operation.input.shape);
        }
        if (operation.output && operation.output.shape) {
            operationShapeNames.push(operation.output.shape);
        }
    }

    return operationShapeNames;
};

module.exports = {
    getOperationShapeNames: getOperationShapeNames
};