
export const renderComponent = ({
    componentConstructor, uiFunctions,
    htmlElement, anchor, parentContext,
    initialProps, bb}) => {

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
    }

    if(func) {
        func(render, parentContext);        
    } else {
        render();
    }

    return ({
        context: componentContext,
        component
    });
}

