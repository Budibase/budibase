<script>
import { onMount } from 'svelte'
import {buildStyle} from "./buildStyle";

export let gridTemplateRows ="";
export let gridTemplateColumns ="";
export let children = [];
export let width = "auto";
export let height = "auto";
export let containerClass="";
export let itemContainerClass="";

/*"gridColumnStart":"string",
"gridColumnEnd":"string",
"gridRowStart":"string",
"gridRowEnd":"string"*/


export let _bb;

let style="";
let htmlElements = {};

$ : {
    if(_bb && htmlElements) {
        for(let el in htmlElements) {
            _bb.hydrateComponent(
                children[el].control,
                htmlElements[el]
            );
        }
    }
}

const childStyle = child => 
    buildStyle({
        "grid-column-start": child.gridColumnStart,
        "grid-column-end": child.gridColumnEnd,
        "grid-column": child.gridColumn,
        "grid-row-start": child.gridRowStart,
        "grid-row-end": child.gridRowStart,
        "grid-row": child.gridRow,
    });

</script>

<div class="root {containerClass}"
     style="width: {width}; height: {height}; grid-template-columns: {gridTemplateColumns}; grid-template-rows: {gridTemplateRows};">
    {#each children as child, index}
    <div class="{itemContainerClass}"
        style={childStyle(child)}
        bind:this={htmlElements[index]}>
    </div>
    {/each}
</div>

<style>

.root {
    display: grid;
}

</style>