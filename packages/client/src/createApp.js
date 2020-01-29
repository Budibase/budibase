import {writable} from "svelte/store";
import { createCoreApi } from "./core";
import { getStateOrValue } from "./state/getState";
import { setState, setStateFromBinding } from "./state/setState";
import { trimSlash } from "./common/trimSlash";
import { isBound } from "./state/isState";
import { _initialiseChildren } from "./render/initialiseChildren";
import { createTreeNode } from "./render/renderComponent";

export const createApp = (document, componentLibraries, appDefinition, user, uiFunctions) => {
    
    const coreApi = createCoreApi(appDefinition, user);
    appDefinition.hierarchy = coreApi.templateApi.constructHierarchy(appDefinition.hierarchy);
    const store = writable({
        _bbuser: user
    });


    let globalState = null;
    store.subscribe(s => {
        globalState = s;
    });

    const relativeUrl = (url) =>  
        appDefinition.appRootPath 
        ? appDefinition.appRootPath + "/" + trimSlash(url)
        : url;


    const apiCall = (method) => (url, body) => 
        fetch(relativeUrl(url), {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body && JSON.stringify(body), 
        });

    const api = {
        post: apiCall("POST"),
        get: apiCall("GET"),
        patch: apiCall("PATCH"),
        delete: apiCall("DELETE")
    };

    const safeCallEvent = (event, context) => {
        
        const isFunction = (obj) =>
            !!(obj && obj.constructor && obj.call && obj.apply);

        if(isFunction(event)) event(context);
    }

    const initialiseChildrenParams = (hydrate, treeNode) =>  ({
        bb, coreApi, store, document,
        componentLibraries, appDefinition, 
        hydrate, uiFunctions, treeNode
    });

    const bb = (treeNode, componentProps) => ({
        hydrateChildren: _initialiseChildren(initialiseChildrenParams(true, treeNode)), 
        appendChildren: _initialiseChildren(initialiseChildrenParams(false, treeNode)), 
        insertChildren: (props, htmlElement, anchor) => 
            _initialiseChildren(initialiseChildrenParams(false, treeNode))
                                (props, htmlElement, anchor), 
        context: treeNode.context,
        props: componentProps,
        call:safeCallEvent,
        setStateFromBinding: (binding, value) => setStateFromBinding(store, binding, value),
        setState: (path, value) => setState(store, path, value),
        getStateOrValue: (prop, currentContext) => 
            getStateOrValue(globalState, prop, currentContext),
        store,
        relativeUrl,
        api,
        isBound,
        parent
    });

    return bb(createTreeNode());

}
