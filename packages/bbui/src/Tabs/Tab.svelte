<script>
  import { getContext, onMount, createEventDispatcher } from "svelte"
  import Portal from "svelte-portal"
  export let title
  export let icon = ""

  const dispatch = createEventDispatcher()
  let selected = getContext("tab")
  let tab
  let tabInfo

  const setTabInfo = () => {
    // If the tabs are being rendered inside a component which uses
    // a svelte transition to enter, then this initial getBoundingClientRect
    // will return an incorrect position.
    // We just need to get this off the main thread to fix this, by using
    // a 0ms timeout.
    setTimeout(() => {
      tabInfo = tab?.getBoundingClientRect()
      if (tabInfo && $selected.title === title) {
        $selected.info = tabInfo
      }
    }, 0)
  }

  onMount(() => {
    setTabInfo()
  })

  const onClick = () => {
    $selected = { ...$selected, title, info: tab.getBoundingClientRect() }
    dispatch("click")
  }
</script>

<div
  bind:this={tab}
  on:click={onClick}
  class:is-selected={$selected.title === title}
  class="spectrum-Tabs-item"
  class:emphasized={$selected.title === title && $selected.emphasized}
  tabindex="0"
>
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM"
      focusable="false"
      aria-hidden="true"
      aria-label="Folder"
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  <span class="spectrum-Tabs-itemLabel">{title}</span>
</div>
{#if $selected.title === title}
  <Portal target=".spectrum-Tabs-content-{$selected.id}">
    <slot />
  </Portal>
{/if}

<style>
  .emphasized {
    color: var(--spectrum-global-color-blue-600);
  }
</style>
