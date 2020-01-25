import {writable} from "svelte/store";
import { createCoreApi } from "./core";
import { getStateOrValue } from "./state/getState";
import { setState, setStateFromBinding } from "./state/setState";
import { trimSlash } from "./common/trimSlash";
import { isBound } from "./state/isState";
import { _initialiseChildren } from "./render/initialiseChildren";

export const createApp = (componentLibraries, appDefinition, user) => {

    
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
        delete:apiCall("DELETE")
    };

    const safeCallEvent = (event, context) => {
        
        const isFunction = (obj) =>
            !!(obj && obj.constructor && obj.call && obj.apply);

        if(isFunction(event)) event(context);
    }

    const initialiseChildrenParams = (parentContext, hydrate) =>  ({
        bb, coreApi, store, 
        componentLibraries, appDefinition, 
        parentContext, hydrate
    });

    const bb = (context, props) => ({
        hydrateChildren: _initialiseChildren(initialiseChildrenParams(context, true)), 
        appendChildren: _initialiseChildren(initialiseChildrenParams(context, false)), 
        insertChildren: (props, htmlElement, anchor, context) => 
            _initialiseChildren(initialiseChildrenParams(context, false))
                                (props, htmlElement, context, anchor), 
        store,
        relativeUrl,
        api,
        call:safeCallEvent,
        isBound,
        setStateFromBinding: (binding, value) => setStateFromBinding(store, binding, value),
        setState: (path, value) => setState(store, path, value),
        getStateOrValue: (prop, currentContext) => 
            getStateOrValue(globalState, prop, currentContext),
        context,
        props        
    });

    return bb();

}

const buildBindings = (boundProps, boundArrays, contextBoundProps) => {
    const bindings = {};
    if(boundProps && boundProps.length > 0) {
        for(let p of boundProps) {
            bindings[p.propName] = {
                path: p.path,
                fallback: p.fallback,
                source: p.source
            }
        }
    }

    if(contextBoundProps && contextBoundProps.length > 0) {
        for(let p of contextBoundProps) {
            bindings[p.propName] = {
                path: p.path,
                fallback: p.fallback,
                source: p.source
            }
        }
    }

    if(boundArrays && boundArrays.length > 0) {
        for(let a of boundArrays) {
            const arrayOfBindings = [];

            for(let b of a.arrayOfBindings) {
                arrayOfBindings.push(
                    buildBindings(
                        b.boundProps, 
                        b.boundArrays, 
                        b.contextBoundProps)
                );
            }

            bindings[a.propName] = arrayOfBindings;
        }
    }

    return bindings;
}

