<script lang="ts">
  import "@spectrum-css/tabs/dist/index-vars.css"
  import { writable } from "svelte/store"
  import { onMount, setContext, createEventDispatcher } from "svelte"

  interface TabInfo {
    width?: number
    height?: number
    left?: number
    top?: number
  }

  interface TabState {
    title: string
    id: string
    emphasized: boolean
    info?: TabInfo
  }

  export let selected: string
  export let vertical: boolean = false
  export let noPadding: boolean = false
  // added as a separate option as noPadding is used for vertical padding
  export let noHorizPadding: boolean = false
  export let quiet: boolean = false
  export let emphasized: boolean = false
  export let onTop: boolean = false
  export let size: "S" | "M" | "L" = "M"
  export let beforeSwitch: ((_title: string) => boolean) | null = null

  let thisSelected: string | undefined = undefined
  let container: HTMLElement | undefined

  let _id = id()
  const tab = writable<TabState>({ title: selected, id: _id, emphasized })
  setContext("tab", tab)

  let top: string | undefined
  let left: string | undefined
  let width: string | undefined
  let height: string | undefined

  const dispatch = createEventDispatcher<{
    select: string
  }>()

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
        state.title = thisSelected as string
        return state
      })
    }
  }

  $: $tab && calculateIndicatorLength()
  $: $tab && calculateIndicatorOffset()

  function calculateIndicatorLength() {
    if (!vertical) {
      width = ($tab.info?.width ?? 0) + "px"
    } else {
      height = ($tab.info?.height ?? 0) + 4 + "px"
    }
  }

  function calculateIndicatorOffset() {
    if (!vertical) {
      left =
        ($tab.info?.left ?? 0) -
        (container?.getBoundingClientRect().left ?? 0) +
        "px"
    } else {
      top =
        ($tab.info?.top ?? 0) -
        (container?.getBoundingClientRect().top ?? 0) +
        "px"
    }
  }

  onMount(() => {
    calculateIndicatorLength()
    calculateIndicatorOffset()
  })

  function id(): string {
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
