
export const renderComponent = ({
    componentConstructor, uiFunctions,
    htmlElement, anchor, parentContext,
    initialProps, bb, childIndex}) => {

    const func = initialProps._id 
                 ? uiFunctions[componentProps._id]
                 : undefined;
                 
    let component;
    let componentContext;
    const render = (context) => {
        
        if(context) {
            componentContext = {...componentContext};
            componentContext.$parent = parentContext;
        } else {
            componentContext = parentContext;
        }

        initialProps._bb = bb(initialProps, componentContext);

        component = new componentConstructor({
            target: htmlElement,
            props: initialProps,
            hydrate:false,
            anchor
        });

        childIndex += 1;
    }

    if(func) {
        func(render, parentContext);        
    } else {
        render();
    }

    return ({
        context: componentContext,
        lastChildIndex: childIndex,
        component
    });
}

