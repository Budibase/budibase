import {hierarchy as hierarchyFunctions, 
    common, getTemplateApi, getAuthApi } from "budibase-core"; 
import {find, filter, includes, keyBy, some,
    flatten, map} from "lodash/fp";

export const chain = common.$;

export const events = common.eventsList;

export const getNode = (hierarchy, nodeId) => 
    chain(hierarchy, [
        hierarchyFunctions.getFlattenedHierarchy,
        find(n => n.nodeId === nodeId || n.nodeKey() === nodeId)
    ]);

export const constructHierarchy = node => {
    if(!node) return node;
    return templateApi(node).constructHeirarchy(node);
}

export const createNewHeirarchy = () => {
    return templateApi().getNewRootLevel();
}

export const templateApi = hierarchy => getTemplateApi({heirarchy:hierarchy})
export const authApi = (hierarchy, actions) => getAuthApi({
    heirarchy:hierarchy, actions: keyBy("name")(actions), publish:()=>{}})

export const allTypes = templateApi({}).allTypes;

export const validate = {
    all: templateApi({}).validateAll,
    node: templateApi({}).validateNode,
    field: templateApi({}).validateField
};

export const getPotentialReverseReferenceIndexes = (hierarchy, refIndex) => {
    const res = chain(hierarchy, [
        hierarchyFunctions.getFlattenedHierarchy,
        filter(n => hierarchyFunctions.isAncestor(refIndex)(n)
                    || hierarchyFunctions.isAncestor(refIndex)(n.parent())),
        map(n => n.indexes),
        flatten,
        filter(hierarchyFunctions.isReferenceIndex)
    ]);

    return res;
}

export const getPotentialReferenceIndexes = (hierarchy, record) =>
    chain(hierarchy, [
        hierarchyFunctions.getFlattenedHierarchy,
        filter(hierarchyFunctions.isAncestorIndex),
        filter(i => hierarchyFunctions.isAncestor(record)(i.parent())
                    || i.parent().nodeId === record.parent().nodeId
                    || hierarchyFunctions.isRoot(i.parent()))
    ]);

export const getDefaultTypeOptions = type => 
    !type ? {} : allTypes[type].getDefaultOptions();

export const getNewAction = () => templateApi({}).createAction();
export const getNewTrigger = () => templateApi({}).createTrigger();

export const validateActions = actions => templateApi({}).validateActions(actions);
export const validateTriggers = (triggers, actions) => templateApi({}).validateTriggers(triggers, actions);

export const generateFullPermissions = (hierarchy, actions) => 
    authApi(hierarchy,actions).generateFullPermissions();

export const getNewAccessLevel = () => 
    authApi().getNewAccessLevel();

export const validateAccessLevels = (hierarchy, actions, accessLevels) => 
    authApi(hierarchy, actions).validateAccessLevels(accessLevels);