
export const renderComponent = ({
    componentConstructor, uiFunctions,
    htmlElement, anchor, props, 
    initialProps, bb, document,
    parentNode}) => {

    const func = initialProps._id 
                 ? uiFunctions[initialProps._id]
                 : undefined;

    const parentContext = (parentNode && parentNode.context) || {};
                 
    let renderedNodes = [];
    const render = (context) => {
        
        let componentContext = parentContext;
        if(context) {
            componentContext = {...componentContext};
            componentContext.$parent = parentContext;
        }

        const thisNode = createTreeNode();
        thisNode.context = componentContext;
        thisNode.parentNode = parentNode;

        parentNode.children.push(thisNode);
        renderedNodes.push(thisNode);

        initialProps._bb = bb(thisNode, props);  

        thisNode.component = new componentConstructor({
            target: htmlElement,
            props: initialProps,
            hydrate:false,
            anchor
        });       

        thisNode.rootElement = htmlElement.children[
            htmlElement.children.length - 1];
    }

    if(func) {
        func(render, parentContext);        
    } else {
        render();
    }

    return renderedNodes;
}

export const createTreeNode = () => ({
    context: {},
    rootElement: null,
    parentNode: null,
    children: [],
    component: null,
    unsubscribe: () => {}
});

