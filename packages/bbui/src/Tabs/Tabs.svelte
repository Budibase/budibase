<script>
    import "@spectrum-css/tabs/dist/index-vars.css"
    import { writable } from 'svelte/store'
    import { onMount, setContext } from 'svelte'
    
    export let selected;
    export let vertical = false
    let _id = id()
    const tab = writable({title: selected, id: _id})
    setContext('tab', tab)
    
    let container;

    $: selected = $tab.title

    let top, left, width, height;
    $: calculateIndicatorLength($tab)
    $: calculateIndicatorOffset($tab)

    function calculateIndicatorLength() {
        if (!vertical) {
            width = $tab.info?.width + 24 + 'px'
            height = $tab.info?.height
        } else {
            height = $tab.info?.height + 4 +  'px'
            width = $tab.info?.width
        }
    }

    function calculateIndicatorOffset() {
        console.log(container?.getBoundingClientRect())
        if (!vertical) {
            left = $tab.info?.left - container?.getBoundingClientRect().left - 12 + 'px'
            top = $tab.info?.top
        } else {
            top = $tab.info?.top - container?.getBoundingClientRect().top + 'px'
            left = $tab.info?.left
        }
    }
    
    onMount(() => {
            calculateIndicatorLength()
            calculateIndicatorOffset()
    })

    function id() {
        return (
            "_" +
            Math.random()
            .toString(36)
            .substr(2, 9)
        )
    }
</script>
<div bind:this={container} class="selected-border spectrum-Tabs spectrum-Tabs--{vertical ? 'vertical' : 'horizontal'}">
    <slot />
    <div class="spectrum-Tabs-selectionIndicator indicator-transition" style="width: {width}; height: {height}; left: {left}; top: {top};"></div>
</div>

<div class="spectrum-Tabs-content spectrum-Tabs-content-{_id}" />

<style>
    .spectrum-Tabs-content {
        margin-top: var(--spectrum-global-dimension-static-size-150);
    }
    .indicator-transition {
        transition: all 200ms
    }
</style>