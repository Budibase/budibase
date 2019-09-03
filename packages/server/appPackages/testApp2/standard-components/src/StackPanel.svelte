<script>
import { onMount } from 'svelte'

export let direction = "horizontal";
export let children = [];
export let width = "auto";
export let height = "auto";
export let containerClass="";
export let itemContainerClass="";


export let _app;

let htmlElements = {};

onMount(() => {
    if(_app && htmlElements) {
        for(let el in htmlElements) {
            _app.initialiseComponent(
                children[el].control,
                htmlElements[el]
            );
        }
    }
});


</script>

<div class="root {containerClass}"
     style="width: {width}; height: {height}">
    {#each children as child, index}
    <div class={direction}>
        <div class="{itemContainerClass}"
            bind:this={htmlElements[index]}>
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