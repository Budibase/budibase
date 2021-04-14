<script>
    import "@spectrum-css/tabs/dist/index-vars.css"
    import { writable } from 'svelte/store'
    import { setContext } from 'svelte'
    
    export let selected;
    export let vertical = false

    const tab = writable(selected)
    setContext('tab', tab)
    $: selected = $tab
</script>
<div class="spectrum-Tabs spectrum-Tabs--{vertical ? 'vertical' : 'horizontal'}">
    <slot />
</div>

<div class="spectrum-Tabs-content" />

<style>
    .spectrum-Tabs-content {
        margin-top: var(--spectrum-global-dimension-static-size-150);
    }
</style>