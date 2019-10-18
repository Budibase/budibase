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

    const _initialiseComponent = (parentContext, hydrate) => (props, htmlElement, context, anchor=null) => {

        const {componentName, libName} = splitName(props._component);

        if(!componentName || !libName) return;

        const {
            initialProps, bind, 
            boundProps, boundArrays,
            contextBoundProps
        } = setupBinding(
                store, props, coreApi, 
                context || parentContext, appDefinition.appRootPath);

        const bindings = buildBindings(boundProps, boundArrays, contextBoundProps);

        const componentProps = {
            ...initialProps, 
            _bb:bb(bindings, context || parentContext, props)
        };

        const component = new (componentLibraries[libName][componentName])({
            target: htmlElement,
            props: componentProps,
            hydrate,
            anchor
        });

        bind(component);

        return component;
    }

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

    const bb = (bindings, context, props) => ({
        hydrateComponent: _initialiseComponent(context, true), 
        appendComponent: _initialiseComponent(context, false), 
        insertComponent: (props, htmlElement, anchor, context) => 
            _initialiseComponent(context, false)(props, htmlElement, context, anchor), 
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


const splitName = fullname => {
    const componentName = $(fullname, [
        split("/"),
        last
    ]);

    const libName =fullname.substring(
        0, fullname.length - componentName.length - 1);

    return {libName, componentName}; 
}


