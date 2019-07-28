import {
    hierarchy as hierarchyFunctions, 
    common 
} from "budibase-core";
import {
    filter, 
    cloneDeep, 
    sortBy, 
    map, 
    last, 
    keys,
    cloneDeep, 
    concat,
    find, 
    isEmpty, 
    groupBy, 
    reduce
} from "lodash/fp";
import {
    chain, 
    getNode, 
    validate,
    constructHierarchy, 
    templateApi
} from "../common/core";
import {writable} from "svelte/store";
import { defaultPagesObject } from "../userInterface/pagesParsing/defaultPagesObject"
import api from "./api";

const pipe = common.$;

export const getStore = () => {

    const initial = {
        apps:[],
        appname:"",
        hierarchy: {},
        actions: [],
        triggers: [],
        pages:defaultPagesObject(),
        mainUi:{},
        unauthenticatedUi:{},
        derivedComponents:[],
        rootComponents:[],
        currentNodeIsNew: false,
        errors: [],
        activeNav: "database",
        hasAppPackage: false,
        accessLevels: [],
        currentNode: null};

    const store = writable(initial);

    store.initialise = initialise(store, initial);
    store.newChildRecord = newRecord(store, false);
    store.newRootRecord = newRecord(store, true);
    store.selectExistingNode = selectExistingNode(store);
    store.newChildIndex = newIndex(store, false);
    store.newRootIndex = newIndex(store, true);
    store.saveCurrentNode = saveCurrentNode(store);
    store.importAppDefinition = importAppDefinition(store);
    store.deleteCurrentNode = deleteCurrentNode(store);
    store.saveField = saveField(store);
    store.deleteField = deleteField(store);
    store.saveAction = saveAction(store);
    store.deleteAction = deleteAction(store);
    store.saveTrigger = saveTrigger(store);
    store.deleteTrigger = deleteTrigger(store);
    store.saveLevel = saveLevel(store);
    store.deleteLevel = deleteLevel(store);
    store.setActiveNav = setActiveNav(store);
    store.saveDerivedComponent = saveDerivedComponent(store);
    store.refreshComponents = refreshComponents(store);
    store.addComponentLibrary = addComponentLibrary(store);
    store.renameDerivedComponent = renameDerivedComponent(store);
    store.deleteDerivedComponent = deleteDerivedComponent(store);
    return store;
} 

export default getStore;

const initialise = (store, initial) => async () => {

    const appname = window.location.hash 
                ? last(window.location.hash.substr(1).split("/"))
                : "";

    if(!appname) {
        initial.apps = await api.get(`/_builder/api/apps`);
        initial.hasAppPackage = false;
        store.set(initial);
        return initial;
    }

    const pkg = await api.get(`/_builder/api/${appname}/appPackage`);

    initial.appname = appname;
    initial.hasAppPackage = true;
    initial.hierarchy = pkg.appDefinition.hierarchy;
    initial.accessLevels = pkg.accessLevels;
    initial.derivedComponents = pkg.derivedComponents;
    initial.rootComponents = pkg.rootComponents;
    initial.actions = reduce((arr, action) => {
        arr.push(action);
        return arr;
    })(pkg.appDefinition.actions, []);
    initial.triggers = pkg.appDefinition.triggers;

    if(!!initial.hierarchy && !isEmpty(initial.hierarchy)) {
        initial.hierarchy = constructHierarchy(initial.hierarchy);
        const shadowHierarchy = createShadowHierarchy(initial.hierarchy);
        if(initial.currentNode !== null)
            initial.currentNode = getNode(
                shadowHierarchy, initial.currentNode.nodeId
            );
    }
    store.set(initial);
    return initial;
}

const newRecord = (store, useRoot) => () => {
    store.update(s => {
        s.currentNodeIsNew = true;
        const shadowHierarchy = createShadowHierarchy(s.hierarchy);
        parent = useRoot ? shadowHierarchy
                 : getNode(
                    shadowHierarchy, 
                    s.currentNode.nodeId);
        s.errors = [];
        s.currentNode = templateApi(shadowHierarchy)
                         .getNewRecordTemplate(parent, "", true);
        return s;
    });
}


const selectExistingNode = (store) => (nodeId) => {
    store.update(s => {
        const shadowHierarchy = createShadowHierarchy(s.hierarchy);
        s.currentNode = getNode(
            shadowHierarchy, nodeId
        );
        s.currentNodeIsNew = false;
        s.errors = [];
        return s;
    })
}

const newIndex = (store, useRoot) => () => {
    store.update(s => {
        s.currentNodeIsNew = true;
        s.errors = [];
        const shadowHierarchy = createShadowHierarchy(s.hierarchy);
        parent = useRoot ? shadowHierarchy
                 : getNode(
                    shadowHierarchy, 
                    s.currentNode.nodeId);

        s.currentNode = templateApi(shadowHierarchy)
                         .getNewIndexTemplate(parent);
        return s;
    });
}

const saveCurrentNode = (store) => () => {
    store.update(s => {

        const errors = validate.node(s.currentNode);
        s.errors = errors;
        if(errors.length > 0) {
            return s;
        }

        const parentNode = getNode(
            s.hierarchy, s.currentNode.parent().nodeId);

        const existingNode = getNode(
            s.hierarchy, s.currentNode.nodeId);

        let index = parentNode.children.length;
        if(!!existingNode) {
            // remove existing
            index = existingNode.parent().children.indexOf(existingNode);
            existingNode.parent().children = chain(existingNode.parent().children, [
                filter(c => c.nodeId !== existingNode.nodeId)
            ]);
        }

        // should add node into existing hierarchy
        const cloned = cloneDeep(s.currentNode);
        templateApi(s.hierarchy).constructNode(
            parentNode, 
            cloned
        );

        const newIndexOfchild = child => {
            if(child === cloned) return index;
            const currentIndex = parentNode.children.indexOf(child);
            return currentIndex >= index ? currentIndex + 1 : currentIndex;
        }

        parentNode.children = chain(parentNode.children, [
            sortBy(newIndexOfchild)
        ]);

        s.currentNodeIsNew = false;
        
        savePackage(store, s);

        return s;
    });
}

const importAppDefinition = store => appDefinition => {
    store.update(s => {
        s.hierarchy = appDefinition.hierarchy;
        s.currentNode = appDefinition.hierarchy.children.length > 0
                         ? appDefinition.hierarchy.children[0] 
                         : null;
        s.actions = appDefinition.actions;
        s.triggers = appDefinition.triggers;
        s.currentNodeIsNew = false; 
        return s;
    });
} 

const deleteCurrentNode = store => () => {
    store.update(s => {
        const nodeToDelete = getNode(s.hierarchy, s.currentNode.nodeId);
        s.currentNode = hierarchyFunctions.isRoot(nodeToDelete.parent())
                         ? find(n => n != s.currentNode)
                               (s.hierarchy.children)
                         : nodeToDelete.parent();
        if(hierarchyFunctions.isRecord(nodeToDelete)) {
            nodeToDelete.parent().children = filter(c => c.nodeId !== nodeToDelete.nodeId)
                                                   (nodeToDelete.parent().children);
        } else {
            nodeToDelete.parent().indexes = filter(c => c.nodeId !== nodeToDelete.nodeId)
                                                   (nodeToDelete.parent().indexes);
        }
        s.errors = [];
        savePackage(store, s);
        return s;
    });
}

const saveField = databaseStore => (field) => {
    databaseStore.update(db => {
        db.currentNode.fields = filter(f => f.name !== field.name)
                                      (db.currentNode.fields);
            
        templateApi(db.hierarchy).addField(db.currentNode, field);
        return db;
    });
}


const deleteField = databaseStore => field => {
    databaseStore.update(db => {
        db.currentNode.fields = filter(f => f.name !== field.name)
                                      (db.currentNode.fields);

        return db;
    });
}


const saveAction = store => (newAction, isNew, oldAction=null) => {
    store.update(s => {

        const existingAction = isNew 
                               ? null
                               : find(a => a.name === oldAction.name)(s.actions);
            
        if(existingAction) {
            s.actions = chain(s.actions, [
                map(a => a === existingAction ? newAction : a)
            ]);
        } else {
            s.actions.push(newAction);
        }
        savePackage(store, s);
        return s;
    });
}

const deleteAction  = store => action => {
    store.update(s => {
        s.actions = filter(a => a.name !== action.name)(s.actions);
        savePackage(store, s);
        return s;
    });
}

const saveTrigger = store => (newTrigger, isNew, oldTrigger=null) => {
    store.update(s => {

        const existingTrigger = isNew 
                               ? null
                               : find(a => a.name === oldTrigger.name)(s.triggers);
            
        if(existingTrigger) {
            s.triggers = chain(s.triggers, [
                map(a => a === existingTrigger ? newTrigger : a)
            ]);
        } else {
            s.triggers.push(newTrigger);
        }
        savePackage(store, s);
        return s;
    });
}

const deleteTrigger  = store => trigger => {
    store.update(s => {
        s.triggers = filter(t => t.name !== trigger.name)(s.triggers);
        return s;
    });
}

const saveLevel = store => (newLevel, isNew, oldLevel=null) => {
    store.update(s => {

        const existingLevel = isNew 
                               ? null
                               : find(a => a.name === oldLevel.name)(s.accessLevels);
            
        if(existingLevel) {
            s.accessLevels = chain(s.accessLevels, [
                map(a => a === existingLevel ? newLevel : a)
            ]);
        } else {
            s.accessLevels.push(newLevel);
        }
        savePackage(store, s);
        return s;
    });
}

const deleteLevel = store => level => {
    store.update(s => {
        s.accessLevels = filter(t => t.name !== level.name)(s.accessLevels);
        savePackage(store, s);
        return s;
    });
}

const setActiveNav = store => navName => {
    store.update(s => {
        s.activeNav = navName;
        return s;
    });
}

const createShadowHierarchy = hierarchy => 
    constructHierarchy(JSON.parse(JSON.stringify(hierarchy)));

const saveDerivedComponent = store => (derivedComponent) => {

    store.update(s => {

        const derivedComponents = pipe(s.derivedComponents, [
            filter(c => c._name !== derivedComponent._name)
        ]);

        s.derivedComponents = derivedComponents;

        api.post(`/_builder/api/${s.appname}/derivedcomponent`, derivedComponent);

        return s;
    })
};

const deleteDerivedComponent = store => name => {
    store.update(s => {

        const derivedComponents = pipe(s.derivedComponents, [
            filter(c => c._name !== name)
        ]);

        s.derivedComponents = derivedComponents;

        api.delete(`/_builder/api/${s.appname}/derivedcomponent/${name}`);

        return s;
    })
}

const renameDerivedComponent = store => (oldname, newname) => {
    store.update(s => {

        const component = pipe(s.derivedComponents, [
            find(c => c._name === name)
        ]);

        component._name = newname;

        const derivedComponents = pipe(s.derivedComponents, [
            filter(c => c._name !== name),
            concat(component)
        ]);

        s.derivedComponent = derivedComponents;

        api.delete(`/_builder/api/${s.appname}/derivedcomponent/${name}`);

        return s;
    })
}

const addComponentLibrary = store => async lib => {

    const response = 
        await api.get(`/_builder/api/${db.appname}/components?${encodeURI(lib)}`,undefined, true);

    const success = response.status === 200;

    const error = response.status === 404 
                  ? `Could not find library ${lib}`
                  : success
                  ? ""
                  : response.statusText;
    
    const components = success
                       ? await response.json()
                       : [];

    store.update(s => {
        s.componentsErrors.addComponent = error;
        if(success) {
            s.pages.componentLibraries.push(lib);
            s.rootComponents = [...s.rootComponents, components];
        }

        return s;
    })
    

}

const refreshComponents = store => async () => {

    const components = 
        await api.get(`/_builder/api/${db.appname}/components`);

    const rootComponents = pipe(components, [
        keys,
        map(k => ({...components[k], _name:k}))
    ]);

    store.update(s => {
        s.rootComponents = rootComponents;
        return s;
    });
};

const savePackage = (store, s) => {

    const appDefinition = {
        hierarchy:s.hierarchy,
        triggers:s.triggers,
        actions: groupBy("name")(s.actions),
        pages:s.pages,
        mainUi: s.mainUi,
        unauthenticatedUi: s.unauthenticatedUi
    };

    const data = {
        appDefinition,
        accessLevels:s.accessLevels
    }

    api.post(`/_builder/api/${s.appname}/appPackage`, data);
}
