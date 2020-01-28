import {writable} from "svelte/store";
import { createCoreApi } from "./core";
import { getStateOrValue } from "./state/getState";
import { setState, setStateFromBinding } from "./state/setState";
import { trimSlash } from "./common/trimSlash";
import { isBound } from "./state/isState";
import { _initialiseChildren } from "./render/initialiseChildren";

export const createApp = (componentLibraries, appDefinition, user, uiFunctions) => {
    
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

    const initialiseChildrenParams = (hydrate, parentContext) =>  ({
        bb, coreApi, store, parentContext,
        componentLibraries, appDefinition, 
        hydrate, uiFunctions
    });

    const bb = (componentProps, componentContext, parent) => ({
        hydrateChildren: _initialiseChildren(initialiseChildrenParams(true, componentContext)), 
        appendChildren: _initialiseChildren(initialiseChildrenParams(false, componentContext)), 
        insertChildren: (props, htmlElement, anchor) => 
            _initialiseChildren(initialiseChildrenParams(false, componentContext))
                                (props, htmlElement, anchor), 
        context: componentContext,
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

    return bb();

}
