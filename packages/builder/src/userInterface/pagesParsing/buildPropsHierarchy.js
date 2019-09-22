import { 
    getComponentInfo, createProps, getInstanceProps 
} from "./createProps";

export const buildPropsHierarchy = (allComponents, baseComponent) => {

    const buildProps = (componentName, propsDefinition, derivedFromProps) => {

        const {props} = createProps(componentName, propsDefinition, derivedFromProps);
        props._component = componentName;
        for(let propName in props) {
            if(propName === "_component") continue;

            const propDef = propsDefinition[propName];
            if(propDef.type === "component") {

                const subComponentProps = props[propName];
                
                if(!subComponentProps._component) continue;

                const propComponentInfo = getComponentInfo(
                    allComponents, subComponentProps._component);

                const subComponentInstanceProps = getInstanceProps(
                    propComponentInfo,
                    subComponentProps
                );

                props[propName] = buildProps(
                    propComponentInfo.rootComponent.name,
                    propComponentInfo.propsDefinition,
                    subComponentInstanceProps);

            } else if(propDef.type === "array") {
                const propsArray = props[propName];
                const newPropsArray = [];
                let index = 0;
                for(let element of propsArray) {
                    newPropsArray.push(
                        buildProps(
                            `${propName}#array_element#`,
                            propDef.elementDefinition,
                            element));
                    index++;
                }

                props[propName] = newPropsArray;
            }
        }

        return props;

    }

    if(!baseComponent) return {};

    const baseComponentInfo  = getComponentInfo(allComponents, baseComponent);

    return buildProps(
        baseComponentInfo.rootComponent.name,
        baseComponentInfo.propsDefinition,
        baseComponentInfo.fullProps);

}