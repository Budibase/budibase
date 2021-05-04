<script>
  import "@spectrum-css/tabs/dist/index-vars.css"
  import { writable } from "svelte/store"
  import { onMount, setContext, createEventDispatcher } from "svelte"

  export let selected
  export let vertical = false
  let _id = id()
  const tab = writable({ title: selected, id: _id })
  setContext("tab", tab)

  let container

  const dispatch = createEventDispatcher()

  $: selected = $tab.title
  $: selected = dispatch("select", selected)

  let top, left, width, height
  $: calculateIndicatorLength($tab)
  $: calculateIndicatorOffset($tab)

  function calculateIndicatorLength() {
    if (!vertical) {
      width = $tab.info?.width + "px"
      height = $tab.info?.height
    } else {
      height = $tab.info?.height + 4 + "px"
      width = $tab.info?.width
    }
  }

  function calculateIndicatorOffset() {
    if (!vertical) {
      left = $tab.info?.left - container?.getBoundingClientRect().left + "px"
    } else {
      top = $tab.info?.top - container?.getBoundingClientRect().top + "px"
    }
  }

  onMount(() => {
    calculateIndicatorLength()
    calculateIndicatorOffset()
  })

  function id() {
    return "_" + Math.random().toString(36).substr(2, 9)
  }
</script>

<div
  bind:this={container}
  class="selected-border spectrum-Tabs spectrum-Tabs--{vertical
    ? 'vertical'
    : 'horizontal'}"
>
  <slot />
  {#if $tab.info}
    <div
      class="spectrum-Tabs-selectionIndicator indicator-transition"
      style="width: {width}; height: {height}; left: {left}; top: {top};"
    />
  {/if}
</div>

<div class="spectrum-Tabs-content spectrum-Tabs-content-{_id}" />

<style>
  .spectrum-Tabs {
    padding-left: var(--spacing-xl);
    padding-right: var(--spacing-xl);
    position: relative;
    border-width: 1px !important;
  }
  .spectrum-Tabs-content {
    margin-top: var(--spectrum-global-dimension-static-size-150);
  }
  .indicator-transition {
    transition: all 200ms;
  }
  .spectrum-Tabs--horizontal .spectrum-Tabs-selectionIndicator {
    bottom: 0 !important;
  }
</style>
