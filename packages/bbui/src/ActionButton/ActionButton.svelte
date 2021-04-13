<script>
    import "@spectrum-css/actionbutton/dist/index-vars.css"
    import { createEventDispatcher } from "svelte"
    const dispatch = createEventDispatcher()

    
    /** @type {('S', 'M', 'L', 'XL')} Size of button */
    export let size = "M";
    export let quiet = false;
    export let emphasized = false;
    export let selected = false
    export let longPressable = false;
    export let disabled = false
    export let icon = '';

    function longPress(element) {
        if (!longPressable) return
        let timer

        const listener = () => {
            timer = setTimeout(() => {
                dispatch('longpress')
            }, 700)
        }

        element.addEventListener('pointerdown', listener)

        return {
            destroy() {
                clearTimeout(timer)
                element.removeEventListener('pointerdown', longPress)
            }
        }
    }
</script>
  

<button 
    use:longPress
    class:spectrum-ActionButton--quiet={quiet}
    class:spectrum-ActionButton--emphasized={emphasized}
    class:is-selected={selected}
    class="spectrum-ActionButton spectrum-ActionButton--size{size.toUpperCase()}"
    {disabled}
    on:longPress
    on:click|preventDefault>
    {#if longPressable}
        <svg class="spectrum-Icon spectrum-UIIcon-CornerTriangle100 spectrum-ActionButton-hold" focusable="false" aria-hidden="true">
            <use xlink:href="#spectrum-css-icon-CornerTriangle100" />
        </svg>
    {/if}
    {#if icon}
        <svg class="spectrum-Icon spectrum-Icon--size{size.toUpperCase()}" focusable="false" aria-hidden="true" aria-label="{icon}">
            <use xlink:href="#spectrum-icon-18-{icon}" />
        </svg>
    {/if}
    {#if $$slots} 
        <span class="spectrum-ActionButton-label"><slot /></span>
    {/if}
</button>
  
  <style>
  
  </style>
  