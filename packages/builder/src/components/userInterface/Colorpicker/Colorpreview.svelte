<script>
    import Colorpicker from "./Colorpicker.svelte"
    import CheckedBackground from "./CheckedBackground.svelte"
    import {createEventDispatcher, afterUpdate, beforeUpdate} from "svelte"

    import {buildStyle} from "./helpers.js"
    import { fade } from 'svelte/transition';
    import {getColorFormat} from "./utils.js"

    export let value = "#3ec1d3ff"
    export let open = false;
    export let width = "25px"
    export let height = "25px"

    let format = "hexa";
    let dimensions = {top: 0, left: 0}
    let colorPreview = null

    let previewHeight = null    
    let previewWidth = null
    let pickerWidth = 0
    let pickerHeight = 0

    let anchorEl = null
    let parentNodes = [];
    let errorMsg = null

    $: previewStyle = buildStyle({width, height, background: value})
    $: errorPreviewStyle = buildStyle({width, height})
    $: pickerStyle = buildStyle({top: `${dimensions.top}px`, left: `${dimensions.left}px`})    

    const dispatch = createEventDispatcher()

    beforeUpdate(() => {
       format = getColorFormat(value)
       if(!format) {
           errorMsg = `Colorpicker - ${value} is an unknown color format. Please use a hex, rgb or hsl value`
           console.error(errorMsg)
       }else{
           errorMsg = null
       }
    })

    afterUpdate(() => {
        if(colorPreview && colorPreview.offsetParent && !anchorEl) {
            //Anchor relative to closest positioned ancestor element. If none, then anchor to body
            anchorEl = colorPreview.offsetParent 
                let curEl = colorPreview
                let els = []
                //Travel up dom tree from preview element to find parent elements that scroll
                while(!anchorEl.isSameNode(curEl)) {
                    curEl = curEl.parentNode
                    let elOverflow = window.getComputedStyle(curEl).getPropertyValue("overflow")                    
                    if(/scroll|auto/.test(elOverflow)) {
                        els.push(curEl)
                    }
                } 
                parentNodes = els
        }
    })


    function openColorpicker(event) {
        if(colorPreview) {
            open = true;        
        }
    }

    $: if(open && colorPreview) {
        const {top: spaceAbove, width, bottom, right, left: spaceLeft} = colorPreview.getBoundingClientRect()   
        const {innerHeight, innerWidth} = window

        const {offsetLeft, offsetTop} = colorPreview
        //get the scrollTop value for all scrollable parent elements 
        let scrollTop = parentNodes.reduce((scrollAcc, el) => scrollAcc += el.scrollTop, 0);

        const spaceBelow = (innerHeight - spaceAbove) - previewHeight
        const top = spaceAbove > spaceBelow ? (offsetTop - pickerHeight) - scrollTop : (offsetTop + previewHeight) - scrollTop      
        
        //TOO: Testing and Scroll Awareness for x Scroll
        const spaceRight = (innerWidth - spaceLeft) + previewWidth
        const left = spaceRight > spaceLeft ? (offsetLeft + previewWidth) : offsetLeft - pickerWidth

        dimensions = {top, left}
    }

    function onColorChange(color) {
        value = color.detail;
        dispatch("change", color.detail)
    }

</script>

<div class="color-preview-container">
    {#if !errorMsg}
        <CheckedBackground borderRadius="3px" backgroundSize="8px">
            <div bind:this={colorPreview} bind:clientHeight={previewHeight} bind:clientWidth={previewWidth} class="color-preview" style={previewStyle} on:click={openColorpicker} />        
        </CheckedBackground>

        {#if open}
        <div transition:fade class="picker-container" style={pickerStyle}>
            <Colorpicker on:change={onColorChange} bind:format bind:value bind:pickerHeight bind:pickerWidth />
        </div>
        <div on:click|self={() => open = false} class="overlay"></div>
        {/if}
    {:else}
        <div class="color-preview preview-error" style={errorPreviewStyle}>
            <span>&times;</span>
        </div>
    {/if}
</div>


<style>
    .color-preview-container{
        display: flex;
        flex-flow: row nowrap;
        height: fit-content;
    }

    .color-preview {
        border-radius: 3px;
        border: 1px solid #dedada;        
    }

    .preview-error {
        background: #cccccc;
        color: #808080;
        text-align: center;
        font-size: 18px;
        cursor: not-allowed;
    }

    .picker-container {
        position: absolute;
        z-index: 3;
        width: fit-content;
        height: fit-content;
    }

    .overlay{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;        
    }
</style>

