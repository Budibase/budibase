<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte"
  import Checkbox from "../Form/Core/Checkbox.svelte"
  import Icon from "../Icon/Icon.svelte"

  export let selected: boolean = false
  export let checked: boolean | undefined = undefined
  export let open: boolean = false
  export let href: string | null = null
  export let title: string
  export let icon: string | undefined
  export let hasChildren: boolean = false

  interface TreeViewContext {
    selectable: boolean
  }

  const treeViewContext = getContext<TreeViewContext | undefined>("bbui-treeview")

  const dispatch = createEventDispatcher<{ toggle: boolean; select: boolean }>()

  let isOpen = open
  $: isSelectable = !!treeViewContext?.selectable
  $: isChecked = checked ?? selected
  $: if (!hasChildren) {
    isOpen = false
  }

  const toggleOpen = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!hasChildren) {
      return
    }
    isOpen = !isOpen
    dispatch("toggle", isOpen)
  }

  const handleIndicatorKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      if (!hasChildren) {
        return
      }
      isOpen = !isOpen
      dispatch("toggle", isOpen)
    }
  }

  const handleCheckboxChange = (event: CustomEvent<boolean>) => {
    dispatch("select", event.detail)
  }
</script>

<li
  class:is-selected={selected}
  class:is-open={hasChildren && isOpen}
  class="spectrum-TreeView-item"
>
  <a on:click class="spectrum-TreeView-itemLink" {href}>
    {#if isSelectable}
      <span class="spectrum-TreeView-itemPre">
        <Checkbox value={isChecked} size="S" on:change={handleCheckboxChange} />
      </span>
    {/if}

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
  .spectrum-TreeView-itemPre {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-inline-end: var(--spacing-xxs);
  }

  .item-post {
    margin-inline-start: auto;
    padding-inline-end: 8px;
    white-space: nowrap;
  }

  .item-post :global(.spectrum-StatusLight) {
    margin: 0;
  }

  .spectrum-TreeView-itemPre :global(.spectrum-Checkbox) {
    margin: 0;
    min-height: 0;
  }

  .spectrum-TreeView-itemIndicator :global(i) {
    font-size: 12px;
  }
</style>
