<script>
  import { Icon, StatusLight } from "@budibase/bbui"
  import { createEventDispatcher, getContext } from "svelte"

  export let icon
  export let withArrow = false
  export let withActions = true
  export let indentLevel = 0
  export let text
  export let border = true
  export let selected = false
  export let opened = false
  export let draggable = false
  export let iconText
  export let iconColor
  export let scrollable = false
  export let color
  export let highlighted = false

  const scrollApi = getContext("scroll")
  const dispatch = createEventDispatcher()

  let contentRef
  $: selected && contentRef && scrollToView()

  const onClick = () => {
    scrollToView()
    dispatch("click")
  }

  const onIconClick = e => {
    e.stopPropagation()
    dispatch("iconClick")
  }

  const scrollToView = () => {
    if (!scrollApi || !contentRef) {
      return
    }
    const bounds = contentRef.getBoundingClientRect()
    scrollApi.scrollTo(bounds)
  }
</script>

<div
  class="nav-item"
  class:border
  class:selected
  class:withActions
  class:scrollable
  class:highlighted
  style={`padding-left: calc(${indentLevel * 14}px)`}
  {draggable}
  on:dragend
  on:dragstart
  on:dragover
  on:drop
  on:click={onClick}
  ondragover="return false"
  ondragenter="return false"
>
  <div class="nav-item-content" bind:this={contentRef}>
    {#if withArrow}
      <div
        class:opened
        class:relative={indentLevel === 0}
        class:absolute={indentLevel > 0}
        class="icon arrow"
        on:click={onIconClick}
      >
        <Icon size="S" name="ChevronRight" />
      </div>
    {/if}

    <slot name="icon" />
    {#if iconText}
      <div class="iconText" style={iconColor ? `color: ${iconColor};` : ""}>
        {iconText}
      </div>
    {:else if icon}
      <div class="icon">
        <Icon color={iconColor} size="S" name={icon} />
      </div>
    {/if}
    <div class="text">{text}</div>
    {#if withActions}
      <div class="actions">
        <slot />
      </div>
    {/if}
    {#if color}
      <div class="light">
        <StatusLight size="L" {color} />
      </div>
    {/if}
  </div>
</div>

<style>
  .nav-item {
    cursor: pointer;
    color: var(--grey-7);
    transition: background-color
      var(--spectrum-global-animation-duration-100, 130ms) ease-in-out;
    padding: 0 var(--spacing-l) 0;
    height: 32px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .nav-item.scrollable {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .nav-item.highlighted {
    background-color: var(--spectrum-global-color-gray-200);
  }
  .nav-item.selected {
    background-color: var(--spectrum-global-color-gray-300);
    color: var(--ink);
  }
  .nav-item:hover {
    background-color: var(--spectrum-global-color-gray-300);
  }
  .nav-item:hover .actions {
    visibility: visible;
  }
  .nav-item-content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    width: max-content;
    overflow: hidden;
    position: relative;
    padding-left: var(--spacing-l);
    pointer-events: none;
  }

  /* Needed to fully display the actions icon */
  .nav-item.scrollable .nav-item-content {
    padding-right: 1px;
  }

  .icon {
    flex: 0 0 24px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
  }
  .icon.arrow {
    flex: 0 0 20px;
    pointer-events: all;
  }
  .icon.arrow.absolute {
    position: absolute;
    left: 0;
    padding: 8px;
    margin-left: -8px;
  }
  .icon.arrow :global(svg) {
    width: 12px;
    height: 12px;
  }
  .icon.arrow.relative {
    position: relative;
    margin: 0 -6px 0 -4px;
  }
  .icon.arrow.opened {
    transform: rotate(90deg);
  }
  .iconText {
    margin-top: 1px;
    font-size: var(--spectrum-global-dimension-font-size-50);
    flex: 0 0 34px;
  }

  .text {
    font-weight: 600;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1 1 auto;
    color: var(--spectrum-global-color-gray-800);
  }
  .scrollable .text {
    flex: 0 0 auto;
    max-width: 160px;
  }

  .actions {
    cursor: pointer;
    position: relative;
    display: grid;
    place-items: center;
    visibility: hidden;
  }
  .actions,
  .light :global(.spectrum-StatusLight) {
    width: 20px;
    height: 20px;
    margin-left: var(--spacing-s);
  }
  .light {
    position: absolute;
    right: 0;
  }
  .nav-item.withActions:hover .light {
    display: none;
  }
</style>
