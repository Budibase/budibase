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

    const initialiseComponent = (props, htmlElement) => {

        const {componentName, libName} = splitName(props._component);

        if(!componentName || !libName) return;

        const {initialProps, bind} = setupBinding(store, props, coreApi);

        const component = new (componentLibraries[libName][componentName])({
            target: htmlElement,
            props: {...initialProps, _bb},
            hydrate:true
        });

        bind(component);

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

    const _bb = {
        initialiseComponent, 
        store,
        relativeUrl,
        api,
        getStateOrValue: (prop, currentContext) => 
            getStateOrValue(globalState, prop, currentContext)
    };

    return _bb;

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


