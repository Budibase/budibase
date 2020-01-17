<script>

export let children = [];
export let className="";
export let data=[];
export let dataItemComponent;
export let onLoad;

export let _bb;

let rootDiv;
let staticComponentsApplied=false;
let dataBoundComponents = [];
let previousData;
let onLoadCalled = false;
let staticHtmlElements = {};

const hasData = () => 
    Array.isArray(data) && data.length > 0;

const staticElementsInitialised = () => {
 
    if(!children) return false;

    if(children.filter(c => c.className).length ===  Object.keys(staticHtmlElements).length) 
        return true;
}

const getStaticAnchor = (elementIndex) => {
    const nextElements = Object.keys(staticHtmlElements).filter(k => k > elementIndex);

    return nextElements.length === 0 
           ? null 
           : staticHtmlElements[Math.min(...nextElements)];    
}

$: {

    if(rootDiv) {
        if(children && children.length > 0 
        && !staticComponentsApplied
        && staticElementsInitialised()) {
            let index = 0;
            for(let child of _bb.props.children) {
                if(child.className) {
                    _bb.hydrateChildren(
                        child.children,
                        staticHtmlElements[index]);
                } else {
                    const anchor = getStaticAnchor(index);
                    if(!anchor) {
                        _bb.appendChildren(
                            child.children,
                            rootDiv);
                    } else {
                        _bb.insertChildren(
                            child.children,
                            rootDiv,
                            anchor);
                    }
                }
                index += 1;
            }
            staticComponentsApplied = true;
        }
        

        if(previousData !== data) {

            for(let c of dataBoundComponents) {
                dataBoundComponents[c].$destroy();
            }
            dataBoundComponents = [];


            if(hasData()) {
                let index = 0;
                for(let dataItem of data) {
                    _bb.appendChildren(
                        _bb.props.dataItemComponent,
                        rootDiv,
                        dataItem
                    );
                }
            }
        }

        if(!onLoadCalled && onLoad && !onLoad.isPlaceholder) {
            _bb.call(onLoad);
            onLoadCalled = true;
        }
    }
}


</script>

<div class="{className}" bind:this={rootDiv}>
    {#each children as child, index}
    {#if child.className}
    <div class="{child.className}"
        bind:this={staticHtmlElements[index]}>
    </div>
    {/if}
    {/each}
</div>

