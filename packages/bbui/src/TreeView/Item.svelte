<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte"
  import { writable } from "svelte/store"
  import Icon from "../Icon/Icon.svelte"
  import type { TreeViewContext } from "./context"

  export let selected: boolean = false
  export let disabled: boolean = false
  export let open: boolean = false
  export let href: string | null = null
  export let title: string
  export let icon: string | undefined = undefined
  export let hasChildren: boolean = false

  const treeViewContext = getContext<TreeViewContext | undefined>(
    "bbui-treeview"
  ) || {
    selectable: writable(false),
    quiet: writable(false),
  }

  const quietStore = treeViewContext.quiet
  const dispatch = createEventDispatcher<{ toggle: boolean; select: boolean }>()

  $: isQuiet = !!$quietStore
  $: if (!hasChildren) {
    open = false
  }

  const toggleOpen = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!hasChildren) {
      return
    }
    open = !open
    dispatch("toggle", open)
  }

  const handleIndicatorKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      if (!hasChildren) {
        return
      }
      open = !open
      dispatch("toggle", open)
    }
  }
</script>

<li
  class:is-selected={selected && !isQuiet}
  class:is-open={hasChildren && open}
  class="spectrum-TreeView-item"
  class:is-disabled={disabled}
>
  <a
    on:click
    class:spectrum-TreeView-itemLink--selectable={!disabled}
    class="spectrum-TreeView-itemLink"
    {href}
  >
    {#if hasChildren}
      <span
        class="spectrum-TreeView-itemIndicator"
        role="button"
        tabindex="0"
        on:click={toggleOpen}
        on:keydown={handleIndicatorKeydown}
      >
        <Icon name="caret-right" size="M" />
      </span>
    {/if}

    {#if icon}
      <span class="spectrum-TreeView-itemIcon">
        <Icon name={icon} size="M" />
      </span>
    {/if}

    <span class="spectrum-TreeView-itemLabel">{title}</span>

    {#if $$slots.post}
      <span class="item-post">
        <slot name="post" />
      </span>
    {/if}
  </a>

  {#if hasChildren && $$slots.default}
    <ul class="spectrum-TreeView">
      <slot />
    </ul>
  {/if}
</li>

<style>
  .item-post {
    margin-inline-start: auto;
    padding-inline-end: 8px;
    white-space: nowrap;
  }

  .item-post :global(.spectrum-StatusLight) {
    margin: 0;
  }

  .spectrum-TreeView-itemIndicator :global(i) {
    font-size: 12px;
  }

  .spectrum-TreeView-itemLink--selectable .spectrum-TreeView-itemIndicator {
    inset-inline-start: 0;
    inset-block-start: 0;
    margin-inline-start: 0;
    margin-inline-end: var(--spacing-xs);
    margin-block-end: 0;
    padding-inline: 0;
    padding-block: 0;
    flex-shrink: 0;
  }
</style>
