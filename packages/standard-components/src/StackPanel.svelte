<script>
import { onMount } from 'svelte'
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

const hasDataBoundComponents = () => 
    Object.getOwnPropertyNames(dataBoundComponents).length === 0;

const hasData = () => 
    Array.isArray(data) && data.length > 0;

const hasStaticComponents = () => {
    return Object.getOwnPropertyNames(staticComponents).length === 0;
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
            staticComponents[el] = _bb.initialiseComponent(
                children[el].control,
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
            _bb.initialiseComponent(
                dataItemComponent,
                dataBoundElements[d],
                data[parseInt(d)]
            );
        }
    }
}


</script>

<div class="root {containerClass}"
     style="width: {width}; height: {height}">
    {#each children as child, index}
    <div class={direction}>
        <div class="{itemContainerClass}"
            bind:this={staticHtmlElements[index]}>
        </div>
    </div>
    {/each}
    {#each data as child, index}
    <div class={direction}>
        <div class="{itemContainerClass}"
            bind:this={dataBoundElements[index]}>
        </div>
    </div>
    {/each}
</div>

<style>

.horizontal {
    display:inline-block;
}

.vertical {
    display: block;
}

</style>