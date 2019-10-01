import {
    isEventType, eventHandlers, EVENT_TYPE_MEMBER_NAME
} from "./eventHandlers";

import {
    getState
} from "./getState";

import {
    isBound, takeStateFromStore,
    takeStateFromContext, takeStateFromEventParameters,
    BB_STATE_FALLBACK, BB_STATE_BINDINGPATH
} from "./isState";

const doNothing = () => {};
export const setupBinding = (store, rootProps, coreApi, context) => {

    const rootInitialProps = {...rootProps};

    const getBindings = (props, initialProps) => {

        const boundProps = [];
        const componentEventHandlers = [];
        const boundArrays = [];

        for(let propName in props) {
            
            if(propName === "_component") continue;

            const val = initialProps[propName];
            
            if(isBound(val) && takeStateFromStore(val)) {

                const binding = stateBinding(val);
                const fallback = stateFallback(val);

                boundProps.push({ 
                    stateBinding:binding,
                    fallback, propName
                });

                initialProps[propName] = fallback;
            } else if(isBound(val) && takeStateFromContext(val)) {

                const binding = stateBinding(val);
                const fallback = stateFallback(val);

                initialProps[propName] = getState(
                    context || {},
                    binding,
                    fallback
                );

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
            } else if(Array.isArray(val)) {
                const arrayOfBindings = [];
                for(let element of val){
                    arrayOfBindings.push(getBindings(element, {...element}));
                }

                boundArrays.push({ 
                    arrayOfBindings,
                    propName
                });
            }
            
        }

        return {boundProps, componentEventHandlers, boundArrays, initialProps};
    }



    const bind = (rootBindings) => (component) => {

        if(rootBindings.boundProps.length === 0 
            && rootBindings.componentEventHandlers.length === 0
            && rootBindings.boundArrays.length === 0) return;

        const handlerTypes = eventHandlers(store, coreApi);

        const unsubscribe = store.subscribe(rootState => {
           

            const getPropsFromBindings = (s, bindings) => {

                const {boundProps, componentEventHandlers, boundArrays} = bindings;
                const newProps = {...bindings.initialProps};
            
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
                        const handlerType = handlerTypes[h.handlerType];
                        closuredHandlers.push((eventContext) => {

                            const parameters = {};
                            for(let pname in h.parameters) {
                                const p = h.parameters[pname];
                                parameters[pname] = 
                                    !isBound(p) 
                                    ? p 
                                    : takeStateFromStore(p)
                                    ? getState(
                                        s, p[BB_STATE_BINDINGPATH], p[BB_STATE_FALLBACK])
                                    : takeStateFromEventParameters(p)
                                    ? getState(
                                        eventContext, p[BB_STATE_BINDINGPATH], p[BB_STATE_FALLBACK])
                                    : takeStateFromContext(p)
                                    ? getState(
                                        context, p[BB_STATE_BINDINGPATH], p[BB_STATE_FALLBACK])
                                    : p[BB_STATE_FALLBACK];
                                
                            }
                            handlerType.execute(parameters)
                        });
                    }

                    newProps[boundHandler.propName] = async (context) => {
                        for(let runHandler of closuredHandlers) {
                            await runHandler(context);
                        }
                    }

                }

                for(let boundArray of boundArrays) {
                    let index = 0;
                    if(!newProps[boundArray.propName])
                        newProps[boundArray.propName] = [];
                    for(let bindings of boundArray.arrayOfBindings){
                        newProps[boundArray.propName][index] = getPropsFromBindings(
                            s,
                            bindings);
                        index++;
                    }   
                }

                return newProps;

            }

            const rootNewProps = getPropsFromBindings(rootState, rootBindings);
            
            component.$set(rootNewProps);
        });

        return unsubscribe;
    }

    const bindings = getBindings(rootProps, rootInitialProps);

    return {
        initialProps:rootInitialProps, bind:bind(bindings)
    };

}

const stateBinding = (prop) => prop[BB_STATE_BINDINGPATH];
const stateFallback = (prop) => prop[BB_STATE_FALLBACK];




