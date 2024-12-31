<script>
  import "@spectrum-css/tabs/dist/index-vars.css"
  import { writable } from "svelte/store"
  import { onMount, setContext, createEventDispatcher } from "svelte"

  export let selected
  export let vertical = false
  export let noPadding = false
  // added as a separate option as noPadding is used for vertical padding
  export let noHorizPadding = false
  export let quiet = false
  export let emphasized = false
  export let onTop = false
  export let size = "M"
  export let beforeSwitch = null

  let thisSelected = undefined

  let _id = id()
  const tab = writable({ title: selected, id: _id, emphasized })
  setContext("tab", tab)

  let container

  const dispatch = createEventDispatcher()

  $: {
    if (thisSelected !== selected) {
      thisSelected = selected
      dispatch("select", thisSelected)
    } else if ($tab.title !== thisSelected) {
      if (typeof beforeSwitch == "function") {
        const proceed = beforeSwitch($tab.title)
        if (proceed) {
          thisSelected = $tab.title
          selected = $tab.title
          dispatch("select", thisSelected)
        }
      } else {
        thisSelected = $tab.title
        selected = $tab.title
        dispatch("select", thisSelected)
      }
    }
    if ($tab.title !== thisSelected) {
      tab.update(state => {
        state.title = thisSelected
        return state
      })
    }
  }

  let top, left, width, height
  $: calculateIndicatorLength($tab)
  $: calculateIndicatorOffset($tab)

  function calculateIndicatorLength() {
    if (!vertical) {
      width = $tab.info?.width + "px"
    } else {
      height = $tab.info?.height + 4 + "px"
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
    return "_" + Math.random().toString(36).slice(2, 9)
  }
</script>

<div
  bind:this={container}
  class:spectrum-Tabs--quiet={quiet}
  class:noHorizPadding
  class:onTop
  class:spectrum-Tabs--vertical={vertical}
  class:spectrum-Tabs--horizontal={!vertical}
  class="spectrum-Tabs spectrum-Tabs--size{size}"
>
  <slot />
  {#if $tab.info}
    <div
      class="spectrum-Tabs-selectionIndicator"
      class:emphasized
      style="width: {width}; height: {height}; left: {left}; top: {top};"
    />
  {/if}
</div>

<div
  class="spectrum-Tabs-content spectrum-Tabs-content-{_id}"
  class:noPadding
/>

<style>
  .spectrum-Tabs--quiet {
    border-bottom: none !important;
  }
  .spectrum-Tabs {
    padding-left: var(--spacing-xl);
    padding-right: var(--spacing-xl);
    position: relative;
    border-bottom-color: var(--spectrum-global-color-gray-200);
  }
  .spectrum-Tabs-content {
    margin-top: var(--spectrum-global-dimension-static-size-150);
  }
  .spectrum-Tabs-selectionIndicator {
    transition: all 200ms;
    background-color: var(--spectrum-global-color-gray-900);
  }
  .spectrum-Tabs-selectionIndicator.emphasized {
    background-color: var(--spectrum-global-color-blue-400);
  }
  .noHorizPadding {
    padding: 0;
  }
  .noPadding {
    margin: 0;
  }
  .onTop {
    z-index: 100;
  }
</style>
