import { 
    split,
    last
} from "lodash/fp";
import {writable} from "svelte/store";
import { $ } from "./core/common";
import { 
    setupBinding 
} from "./state/stateBinding";
import { createCoreApi } from "./core";
import { getStateOrValue } from "./state/getState";
import { setState, setStateFromBinding } from "./state/setState";
import { trimSlash } from "./common/trimSlash";
import { isBound } from "./state/isState";


export const createApp = (componentLibraries, appDefinition, user) => {

    const initialiseComponent = (parentContext) => (props, htmlElement, context) => {

        const {componentName, libName} = splitName(props._component);

        if(!componentName || !libName) return;

        const {initialProps, bind, boundProps} = setupBinding(store, props, coreApi, context, appDefinition.appRootPath);

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

        const componentProps = {
            ...initialProps, 
            _bb:bb(bindings, context || parentContext)
        };

        const component = new (componentLibraries[libName][componentName])({
            target: htmlElement,
            props: componentProps,
            hydrate:true
        });

        bind(component);

        return component;
    }

    const coreApi = createCoreApi(appDefinition, user);
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

    const bb = (bindings, context) => ({
        initialiseComponent: initialiseComponent(context), 
        store,
        relativeUrl,
        api,
        call:safeCallEvent,
        isBound,
        setStateFromBinding: (binding, value) => setStateFromBinding(store, binding, value),
        setState: (path, value) => setState(store, path, value),
        getStateOrValue: (prop, currentContext) => 
            getStateOrValue(globalState, prop, currentContext),
        bindings,
        context,        
    });

    return bb();

}


const splitName = fullname => {
    const componentName = $(fullname, [
        split("/"),
        last
    ]);

    const libName =fullname.substring(
        0, fullname.length - componentName.length - 1);

    return {libName, componentName}; 
}


