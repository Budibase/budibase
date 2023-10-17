
/**
 * 
 * @param {string} startingShape 
 * @param {{[key: string]: any}} shapeMap 
 */
function visitRelatedShapeNames(startingShape, shapeMap) {
    var shape = shapeMap[startingShape];
    if (shape.visited) {
        // exit early if the shape has been visited
        return;
    }

    shape.visited = true;

    if (['structure', 'map', 'list'].indexOf(shape.type) < 0) {
        // not a complex shape, so it's a terminal shape
        return;
    }

    if (shape.type === 'structure') {
        var members = shape.members;
        for (var memberName of Object.keys(members)) {
            var memberShapeName = members[memberName].shape;
            visitRelatedShapeNames(memberShapeName, shapeMap);
        }
    } else if (shape.type === 'map') {
        var keyShape = shape.key.shape;
        var valueShape = shape.value.shape;
        visitRelatedShapeNames(keyShape, shapeMap);
        visitRelatedShapeNames(valueShape, shapeMap);
    } else if (shape.type === 'list') {
        var memberShape = shape.member.shape;
        visitRelatedShapeNames(memberShape, shapeMap);
    }
}

module.exports = {
    visitRelatedShapeNames: visitRelatedShapeNames
};