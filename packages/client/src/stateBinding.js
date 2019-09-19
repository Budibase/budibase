
export const BB_STATE_INDICATOR = "##bbstate";
export const BB_STATE_FALLBACK = "##bbstatefallback";

export const bindComponent = (store, component) => {

    const newProps = {...component.props};
    const boundProps = [];

    for(let propName in component.props) {
        const val = newProps[propName];
        
        if(!isState(val)) continue;

        const binding = stateBinding(val);
        const fallback = stateFallback(val);

        boundProps.push({ 
            stateBinding:binding,
            fallback, propName
        });
        
    }

    if(boundProps.length === 0) return;

    const unsubscribe = store.subscribe(s => {
        const newProps = {...component.props};

        for(let boundProp of boundProps) {
            const val = boundValueFromStore(
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

        component.$set(newProps);
    });

    return unsubscribe;

}

const isState = (prop) => prop[BB_STATE_INDICATOR] !== undefined;
const stateBinding = (prop) => prop[BB_STATE_INDICATOR];
const stateFallback = (prop) => prop[BB_STATE_FALLBACK];
const boundValueFromStore = (s, binding, fallback) => {
    const value = s[binding];
    if(value === undefined) return fallback;
    return value;
}
