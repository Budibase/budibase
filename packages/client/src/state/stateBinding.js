import {
    isEventType, eventHandlers, EVENT_TYPE_MEMBER_NAME
} from "./eventHandlers";

import {
    getState
} from "./getState";

export const BB_STATE_BINDINGPATH = "##bbstate";
export const BB_STATE_FALLBACK = "##bbstatefallback";
const doNothing = () => {};
export const setupBinding = (store, props, coreApi) => {

    const initialProps = {...props};
    const boundProps = [];
    const componentEventHandlers = [];

    for(let propName in props) {
        const val = initialProps[propName];
        
        if(isState(val)) {

            const binding = stateBinding(val);
            const fallback = stateFallback(val);

            boundProps.push({ 
                stateBinding:binding,
                fallback, propName
            });

            initialProps[propName] = fallback;
        } else if(isEventType(val)) {

            const handlers = { propName, handlers:[] };
            componentEventHandlers.push(handlers);
            
            for(let e of val) {
                handlers.handlers.push({
                    handlerType: e[EVENT_TYPE_MEMBER_NAME],
                    parameters: e.parameters
                })
            }
            
            initialProps[propName] = doNothing;
        }
        
    }

    const bind = (component) => {

        if(boundProps.length === 0 && componentEventHandlers.length === 0) return;

        const handlerTypes = eventHandlers(store, coreApi);

        const unsubscribe = store.subscribe(s => {
            const newProps = {};

            for(let boundProp of boundProps) {
                const val = getState(
                    s, 
                    boundProp.stateBinding, 
                    boundProp.fallback);

                if(val === undefined && newProps[boundProp.propName] !== undefined) {
                    delete newProps[boundProp.propName];
                }

                if(val !== undefined) {
                    newProps[boundProp.propName] = val;
                }
            }

            for(let boundHandler of componentEventHandlers) {

                const closuredHandlers = [];
                for(let h of boundHandler.handlers) {
                    const parameters = {};
                    for(let pname in h.parameters) {
                        const p = h.parameters[pname];
                        parameters[pname] = isState(p) 
                            ? getState(
                                s, p[BB_STATE_BINDINGPATH], p[BB_STATE_FALLBACK])
                            : p;
                        
                    }
                    const handlerType = handlerTypes[h.handlerType];
                    closuredHandlers.push(() => handlerType.execute(parameters));
                }

                newProps[boundHandler.propName] = () => {
                    for(let runHandler of closuredHandlers) {
                        runHandler();
                    }
                }

            }
            

            component.$set(newProps);
        });

        return unsubscribe;
    }

    return {
        initialProps, bind
    };

}


const isState = (prop) => prop[BB_STATE_BINDINGPATH] !== undefined;
const stateBinding = (prop) => prop[BB_STATE_BINDINGPATH];
const stateFallback = (prop) => prop[BB_STATE_FALLBACK];




