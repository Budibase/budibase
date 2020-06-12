<script>
    import Colorpicker from "./Colorpicker.svelte"
    import {createEventDispatcher} from "svelte"
    import {buildStyle} from "./helpers.js"
    import { fade } from 'svelte/transition';

    export let value = "#3ec1d3ff"
    export let format = "hexa";
    export let width = "25px"
    export let open = true;
    export let fullwidth = false;

    let colorPreview = null
    let positionSide = "top"

    $: width = fullwidth ? "100%" : width
    $: style = buildStyle({width, background: value})
    $: colorStyle = buildStyle({[positionSide]: `28px`})

    const dispatch = createEventDispatcher()

    function openColorpicker(event) {
        if(colorPreview) {
            const {top: spaceAbove, width, bottom} = colorPreview.getBoundingClientRect()            
            const spaceBelow = window.innerHeight - bottom;

            if (spaceAbove > spaceBelow) {
                positionSide = "bottom"
            } else {
                positionSide = "top"
            }
        }
        open = true;
    }

    function onColorChange(color) {
        value = color.detail;
        dispatch("change", color.detail)
    }
</script>

<div class="color-preview-container">
    <div bind:this={colorPreview} class="color-preview" {style} on:click={openColorpicker}></div>
    {#if open}
        <div class="color-preview" style={colorStyle}>
            <Colorpicker on:change={onColorChange} {format} {value} />
        </div>
    {/if}
</div>
{#if open}
    <div on:click|self={() => open = false} class="overlay"></div>
{/if}

<style>
    .color-preview-container{
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        height: fit-content;
    }

    .color-preview {
        position: absolute;
        flex: 1;
        height: 25px;
        z-index: 2;
        border-radius: 3px;
    }

    .overlay{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;        
    }
</style>