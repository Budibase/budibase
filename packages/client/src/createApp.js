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
import { trimSlash } from "./common/trimSlash";


export const createApp = (componentLibraries, appDefinition, user) => {

    const initialiseComponent = (parentContext) => (props, htmlElement, context) => {

        const {componentName, libName} = splitName(props._component);

        if(!componentName || !libName) return;

        const {initialProps, bind} = setupBinding(store, props, coreApi, context, appDefinition.appRootPath);

        const component = new (componentLibraries[libName][componentName])({
            target: htmlElement,
            props: {...initialProps, _bb:bbInContext(context || parentContext)},
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

    const bb = () => ({
        initialiseComponent: initialiseComponent(), 
        store,
        relativeUrl,
        api,
        call:safeCallEvent,
        getStateOrValue: (prop, currentContext) => 
            getStateOrValue(globalState, prop, currentContext)
    });

    const bbRoot = bb();

    const bbInContext = (context) => {
        if(!context) return bbRoot;
        const bbCxt = bb();
        bbCxt.context = context;
        bbCxt.initialiseComponent=initialiseComponent(context);
        return bbCxt;
    }

    return bbRoot;

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


