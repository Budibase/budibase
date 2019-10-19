<script>
import { onMount } from 'svelte'
import {buildStyle} from "./buildStyle";

export let gridTemplateRows ="";
export let gridTemplateColumns ="";
export let children = [];
export let containerClass="";
export let itemContainerClass="";

/*"gridColumnStart":"string",
"gridColumnEnd":"string",
"gridRowStart":"string",
"gridRowEnd":"string"*/


export let _bb;

let style="";
let htmlElements = {};
let isInitilised = false;
$ : {
    if(!isInitilised && _bb && htmlElements && Object.keys(htmlElements).length > 0) {
        for(let el in htmlElements) {
            _bb.hydrateComponent(
                _bb.props.children[el].component,
                htmlElements[el]
            );
        }
        isInitilised = true;
    }
}

const childStyle = child => 
    buildStyle({
        "grid-column-start": child.gridColumnStart,
        "grid-column-end": child.gridColumnEnd,
        "grid-row-start": child.gridRowStart,
        "grid-row-end": child.gridRowStart
    });

</script>

<div class="root {containerClass}"
     style="grid-template-columns: {gridTemplateColumns}; grid-template-rows: {gridTemplateRows};">
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
    width: 100%; 
    height: 100%;
}

</style>