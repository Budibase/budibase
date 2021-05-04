<script>
  import { getContext, onMount, createEventDispatcher } from "svelte"
  import Portal from "svelte-portal"
  export let title
  export let icon = ""

  const dispatch = createEventDispatcher()
  const selected = getContext("tab")
  let tab
  let tabInfo
  const setTabInfo = () => {
    tabInfo = tab.getBoundingClientRect()
    if ($selected.title === title) {
      $selected.info = tabInfo
    }
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
