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
  // overlay content from the tab bar onto tabs e.g. for a dropdown
  export let onTop = false

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
      thisSelected = $tab.title
      selected = $tab.title
      dispatch("select", thisSelected)
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
    return "_" + Math.random().toString(36).slice(2, 9)
  }
</script>

<div
  bind:this={container}
  class:quiet
  class:noHorizPadding
  class="selected-border spectrum-Tabs {quiet &&
    'spectrum-Tabs--quiet'} spectrum-Tabs--{vertical
    ? 'vertical'
    : 'horizontal'}"
  class:onTop
>
  <slot />
  {#if $tab.info}
    <div
      class="spectrum-Tabs-selectionIndicator indicator-transition"
      style="{emphasized &&
        'background-color: var(--spectrum-global-color-blue-400)'}; width: {width}; height: {height}; left: {left}; top: {top};"
    />
  {/if}
</div>

<div
  class="spectrum-Tabs-content spectrum-Tabs-content-{_id}"
  class:noPadding
/>

<style>
  .quiet {
    border-bottom: none !important;
  }
  .onTop {
    z-index: 20;
  }
  .spectrum-Tabs {
    padding-left: var(--spacing-xl);
    padding-right: var(--spacing-xl);
    position: relative;
    border-bottom: var(--border-light);
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
  .noHorizPadding {
    padding: 0;
  }
  .noPadding {
    margin: 0;
  }
</style>
