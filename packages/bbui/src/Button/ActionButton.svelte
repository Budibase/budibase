<script>
    import "@spectrum-css/actionbutton/dist/index-vars.css"
    import { createEventDispatcher } from "svelte"
    const dispatch = createEventDispatcher()

    export let disabled = false
  
    /** @type {('S', 'M', 'L', 'XL')} Size of button */
    export let size = "M";
    /** @type {('cta','primary','secondary','warning', 'overBackground')} Type of button */
    export let type = "primary"
  
    export let quiet = false;

    export let selected = false;

    export let longPressable = false;
    
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
    class="spectrum-ActionButton spectrum-ActionButton--size{size.toUpperCase()} spectrum-ActionButton--{type} {quiet && 'spectrum-ActionButton--quiet'}"
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
  