import {
    hierarchy as hierarchyFunctions, 
} from "../../../core/src";
import {
    filter, cloneDeep, sortBy, 
    map, last, keys, concat,
    find, isEmpty, reduce
} from "lodash/fp";
import {
    pipe, getNode, validate,
    constructHierarchy, templateApi
} from "../common/core";
import {writable} from "svelte/store";
import { defaultPagesObject } from "../userInterface/pagesParsing/defaultPagesObject"
import { buildPropsHierarchy } from "../userInterface/pagesParsing/buildPropsHierarchy"
import api from "./api";
import { isRootComponent, getExactComponent } from "../userInterface/pagesParsing/searchComponents";
import { rename } from "../userInterface/pagesParsing/renameComponent";
import { 
    getComponentInfo, getNewComponentInfo 
} from "../userInterface/pagesParsing/createProps";
import { loadLibs, loadLibUrls } from "./loadComponentLibraries";

let appname = "";

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
        allComponents:[],
        currentFrontEndItem:null,
        currentComponentInfo:null,
        currentComponentIsNew:false,
        currentFrontEndType:"none",
        currentPageName: "",
        currentNodeIsNew: false,
        errors: [],
        activeNav: "database",
        isBackend:true,
        hasAppPackage: false,
        accessLevels: [],
        currentNode: null,
        libraries:null,
        showSettings:false,
        useAnalytics:true,
    };

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
    store.setCurrentComponent = setCurrentComponent(store);
    store.setCurrentPage = setCurrentPage(store);
    store.createDerivedComponent = createDerivedComponent(store);
    store.removeComponentLibrary =removeComponentLibrary(store);
    store.addStylesheet = addStylesheet(store);
    store.removeStylesheet = removeStylesheet(store);
    store.savePage = savePage(store);
    store.showFrontend = showFrontend(store);
    store.showBackend = showBackend(store);
    store.showSettings = showSettings(store);
    store.useAnalytics = useAnalytics(store);
    return store;
} 

export default getStore;

const initialise = (store, initial) => async () => {

    appname = window.location.hash 
              ? last(window.location.hash.substr(1).split("/"))
              : "";

    if(!appname) {
        initial.apps = await api.get(`/_builder/api/apps`).then(r => r.json());
        initial.hasAppPackage = false;
        store.set(initial);
        return initial;
    }

    const pkg = await api.get(`/_builder/api/${appname}/appPackage`)
                         .then(r => r.json());

    initial.libraries = await loadLibs(appname, pkg);
    initial.loadLibraryUrls = () => loadLibUrls(appname, pkg);
    initial.appname = appname;
    initial.pages = pkg.pages;
    initial.hasAppPackage = true;
    initial.hierarchy = pkg.appDefinition.hierarchy;
    initial.accessLevels = pkg.accessLevels.levels;
    initial.derivedComponents = pkg.derivedComponents;
    initial.allComponents = combineComponents(
        pkg.derivedComponents, pkg.rootComponents);
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

const showSettings = store => show => {
    store.update(s => {
        s.showSettings = !s.showSettings;
        return s;
    });
}

const useAnalytics = store => useAnalytics => {
    store.update(s => {
        s.useAnalytics = !s.useAnalytics;
        return s;
    });
}

const showBackend = store => () => {
    store.update(s => {
        s.isBackend = true;
        return s;
    })
}

const showFrontend = store => () => {
    store.update(s => {
        s.isBackend = false;
        return s;
    })
}

const combineComponents = (root, derived) => {
    const all = []
    for(let r in root) {
        all.push(root[r]);
    }
    for(let d in derived) {
        all.push(derived[d]);
    }
    return all;
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
        s.activeNav = "database";
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
            existingNode.parent().children = pipe(existingNode.parent().children, [
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

        parentNode.children = pipe(parentNode.children, [
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
            s.actions = pipe(s.actions, [
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
            s.triggers = pipe(s.triggers, [
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
            s.accessLevels = pipe(s.accessLevels, [
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

        const components = pipe(s.allComponents, [
            filter(c => c.name !== derivedComponent.name),
            concat([derivedComponent])
        ]);

        const derivedComponents = pipe(s.derivedComponents, [
            filter(c => c.name !== derivedComponent.name),
            concat([derivedComponent])
        ]);

        s.allComponents = components;
        s.derivedComponents = derivedComponents;
        s.currentFrontEndItem = derivedComponent;
        s.currentComponentInfo = getNewComponentInfo(
            s.allComponents, derivedComponent.name);
        s.currentComponentIsNew = false;
        
        api.post(`/_builder/api/${s.appname}/derivedcomponent`, derivedComponent)
            .then(() => savePackage(store, s));

        return s;
    })
};

const createDerivedComponent = store => (componentName) => {
    store.update(s => {
        const newComponentInfo = getNewComponentInfo(
            s.allComponents, componentName);

        s.currentFrontEndItem = newComponentInfo.component;
        s.currentComponentInfo = newComponentInfo;
        s.currentFrontEndType = "component";
        s.currentComponentIsNew = true;
        return s;
    });
}

const deleteDerivedComponent = store => name => {
    store.update(s => {

        const allComponents = pipe(s.allComponents, [
            filter(c => c.name !== name)
        ]);

        const derivedComponents = pipe(s.derivedComponents, [
            filter(c => c.name !== name)
        ]);

        s.allComponents = allComponents;
        s.derivedComponents = derivedComponents;
        if(s.currentFrontEndItem.name === name) {
            s.currentFrontEndItem = null;
        }

        api.delete(`/_builder/api/${s.appname}/derivedcomponent/${name}`);

        return s;
    })
}

const renameDerivedComponent = store => (oldname, newname) => {
    store.update(s => {

        const {
            allComponents, pages, error, changedComponents
        } = rename(s.pages, s.allComponents, oldname, newname);

        if(error) {
            // should really do something with this
            return s;
        }

        s.allComponents = allComponents;
        s.pages = pages;
        if(s.currentFrontEndItem.name === oldname)
            s.currentFrontEndItem.name = newname;

        const saveAllChanged = async () => {
            for(let cname of changedComponents) {
                const changedComponent = getExactComponent(allComponents, cname);
                await api.post(`/_builder/api/${s.appname}/derivedcomponent`, changedComponent);
            }
        }

        api.patch(`/_builder/api/${s.appname}/derivedcomponent`, {
            oldname, newname
        })
        .then(() => saveAllChanged())
        .then(() => {
            savePackage(store, s);
        });        

        return s;
    })
}

const savePage = store => async page => {
    store.update(s => {
        if(s.currentFrontEndType !== "page" || !s.currentPageName) {
            return s;
        }

        s.pages[s.currentPageName] = page;
        savePackage(store, s);
        return s;
    });
}

const addComponentLibrary = store => async lib => {

    const response = 
        await api.get(`/_builder/api/${appname}/componentlibrary?lib=${encodeURI(lib)}`,undefined, false);

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
        if(success) {
            
            const componentsArray = [];
            for(let c in components) {
                componentsArray.push(components[c]);
            }

            s.allComponents = pipe(s.allComponents, [
                filter(c => !c.name.startsWith(`${lib}/`)),
                concat(componentsArray)
            ]);

            s.pages.componentLibraries.push(lib);
            savePackage(store, s);
        }

        return s;
    })
    

}

const removeComponentLibrary = store => lib => {
    store.update(s => {
        
        
        s.pages.componentLibraries = filter(l => l !== lib)(
                                        s.pages.componentLibraries);
        savePackage(store, s);
        

        return s;
    })
}

const addStylesheet = store => stylesheet => {
    store.update(s => {
        s.pages.stylesheets.push(stylesheet);
        savePackage(store, s);
        return s;
    })
}

const removeStylesheet = store => stylesheet => {
    store.update(s => {
        s.pages.stylesheets = filter(s => s !== stylesheet)(s.pages.stylesheets);
        savePackage(store, s);
        return s;
    });
}

const refreshComponents = store => async () => {

    const components = 
        await api.get(`/_builder/api/${db.appname}/components`).then(r => r.json());

    const rootComponents = pipe(components, [
        keys,
        map(k => ({...components[k], name:k}))
    ]);

    store.update(s => {
        s.allComponents = pipe(s.allComponents, [
            filter(c => !isRootComponent(c)),
            concat(rootComponents)
        ]);
        return s;
    });
};

const savePackage = (store, s) => {

    const appDefinition = {
        hierarchy:s.hierarchy,
        triggers:s.triggers,
        actions: s.actions,
        props: {
            main: buildPropsHierarchy(s.allComponents, s.pages.main.appBody),
            unauthenticated:  buildPropsHierarchy(s.allComponents, s.pages.unauthenticated.appBody)
        }
    };

    const data = {
        appDefinition,
        accessLevels:s.accessLevels,
        pages:s.pages,
    }

    api.post(`/_builder/api/${s.appname}/appPackage`, data);
}

const setCurrentComponent = store => componentName => {
    store.update(s => {
        const component = getExactComponent(s.allComponents, componentName);
        s.currentFrontEndItem = component;
        s.currentFrontEndType = "component";
        s.currentComponentIsNew = false;
        s.currentComponentInfo = getComponentInfo(s.allComponents, component.name);
        return s;
    })
}

const setCurrentPage = store => pageName => {
    store.update(s => {
        s.currentFrontEndType = "page";
        s.currentPageName = pageName;
        return s;
    })
}
