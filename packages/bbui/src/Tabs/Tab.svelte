<script>
  import { getContext, onDestroy, createEventDispatcher } from "svelte"
  import Portal from "svelte-portal"

  export let title
  export let icon = ""
  export let id
  export let href = "#"
  export let link = false

  const dispatch = createEventDispatcher()
  let selected = getContext("tab")
  let observer
  let ref

  $: isSelected = $selected.title === title
  $: {
    if (isSelected && ref) {
      observe()
    } else {
      stopObserving()
    }
  }

  const setTabInfo = () => {
    const tabInfo = ref?.getBoundingClientRect()
    if (tabInfo) {
      $selected.info = tabInfo
    }
  }

  const onAnchorClick = e => {
    if (e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) return

    e.preventDefault()
    $selected = {
      ...$selected,
      title,
      info: ref.getBoundingClientRect(),
    }
    dispatch("click")
  }

  const onClick = () => {
    $selected = {
      ...$selected,
      title,
      info: ref.getBoundingClientRect(),
    }
  }

  const observe = () => {
    if (!observer) {
      observer = new ResizeObserver(setTabInfo)
      observer.observe(ref)
    }
  }

  const stopObserving = () => {
    if (observer) {
      observer.unobserve(ref)
      observer = null
    }
  }

  onDestroy(stopObserving)
</script>

{#if link}
  <a
    {href}
    {id}
    bind:this={ref}
    on:click={onAnchorClick}
    class="spectrum-Tabs-item link"
    class:is-selected={isSelected}
    class:emphasized={isSelected && $selected.emphasized}
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
  </a>
{:else}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div
    {id}
    bind:this={ref}
    on:click={onClick}
    on:click
    class="spectrum-Tabs-item"
    class:is-selected={isSelected}
    class:emphasized={isSelected && $selected.emphasized}
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
{/if}

{#if isSelected}
  <Portal target=".spectrum-Tabs-content-{$selected.id}">
    <slot />
  </Portal>
{/if}

<style>
  .emphasized {
    color: var(--spectrum-global-color-blue-600);
  }
  .spectrum-Tabs-item {
    color: var(--spectrum-global-color-gray-600);
  }
  .spectrum-Tabs-item.is-selected,
  .spectrum-Tabs-item:hover {
    color: var(--spectrum-global-color-gray-900);
  }
  .link {
    user-select: none;
  }
</style>
