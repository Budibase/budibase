<script>

import { emptyProps } from "./emptyProps";

export let direction = "horizontal";
export let children = [];
export let width = "auto";
export let height = "auto";
export let containerClass="";
export let itemContainerClass="";
export let onLoad;

export let data=[];
export let dataItemComponent;

export let _bb;

let staticHtmlElements = {};
let staticComponents = {};
let dataBoundElements = {};
let dataBoundComponents = {};

let onLoadCalled = false;

const hasDataBoundComponents = () => 
    Object.getOwnPropertyNames(dataBoundComponents).length > 0;

const hasData = () => 
    Array.isArray(data) && data.length > 0;

const hasStaticComponents = () => {
    return Object.getOwnPropertyNames(staticComponents).length > 0;
}

$: {

    if(staticHtmlElements) {
        if(hasStaticComponents()) {
            for(let c in staticComponents) {
                staticComponents[c].$destroy();
            }
            staticComponents = {};
        }

        for(let el in staticHtmlElements) {
            staticComponents[el] = _bb.hydrateComponent(
                _bb.props.children[el].control,
                staticHtmlElements[el]
            );
        }
    }
    

    if(hasDataBoundComponents()) {
        for(let c in dataBoundComponents) {
            dataBoundComponents[c].$destroy();
        }
        dataBoundComponents = {};
    }

    if(hasData()) {
        let index = 0;
        for(let d in dataBoundElements) {
            _bb.hydrateComponent(
                _bb.props.dataItemComponent,
                dataBoundElements[d],
                data[parseInt(d)]
            );
        }
    }

    if(!onLoadCalled && onLoad && !onLoad.isPlaceholder) {
        _bb.call(onLoad);
        onLoadCalled = true;
    }
}


</script>

<div class="root {containerClass}"
     style="width: {width}; height: {height}">

    {#if children}
    {#each children as child, index}
    <div class={direction}>
        <div class="{itemContainerClass}"
            bind:this={staticHtmlElements[index]}>
        </div>
    </div>
    {/each}
    {/if}

    {#if data && data.length > 0}
    {#each data as child, index}
    <div class={direction}>
        <div class="{itemContainerClass}"
            bind:this={dataBoundElements[index]}>
        </div>
    </div>
    {/each}
    {/if}
</div>

<style>

.horizontal {
    display:inline-block;
}

.vertical {
    display: block;
}

</style>