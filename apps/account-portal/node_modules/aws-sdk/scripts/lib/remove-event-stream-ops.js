/**
 * Removes operations from the model if they require event streams.
 * Specifically looks at input and output shapes.
 * @param {Object} model - JSON parsed API model (*.normal.json)
 */
function removeEventStreamOperations(model) {
    var modifiedModel = false;
    // loop over all operations
    var operations = model.operations;
    var operationNames = Object.keys(operations);
    for (var i = 0; i < operationNames.length; i++) {
        var operationName = operationNames[i];
        var operation = operations[operationName];
        // check input and output shapes
        var inputShapeName = operation.input && operation.input.shape;
        var outputShapeName = operation.output && operation.output.shape;

        var requiresEventStream = false;
        if (inputShapeName && hasEventStream(model.shapes[inputShapeName], model)) {
            requiresEventStream = true;
        }

        if (requiresEventStream) {
            modifiedModel = true;
            // remove the operation from the model
            console.log('Removing ' + operationName + ' because it depends on event streams on input.');
            delete model.operations[operationName];
        }
    }
    return modifiedModel;
}

function hasEventStream(shape, model) {
    if (shape.eventstream) {
        return true;
    } else {
        // check each member shape
        var memberNames = Object.keys(shape.members);
        for (var i = 0; i < memberNames.length; i++) {
            var member = shape.members[memberNames[i]];
            if (member.eventstream) {
                return true;
            }
            var memberShape = model.shapes[member.shape];
            if (memberShape.eventstream) {
                return true;
            }
        }
    }
}

module.exports = {
    removeEventStreamOperations: removeEventStreamOperations
};