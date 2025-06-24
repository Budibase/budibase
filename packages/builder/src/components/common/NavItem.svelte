<script lang="ts">
  import { Icon, TooltipType, TooltipPosition } from "@budibase/bbui"
  import { createEventDispatcher, getContext } from "svelte"
  import { UserAvatars } from "@budibase/frontend-core"
  import type { UIUser } from "@budibase/types"

  export let icon: string | null = null
  export let iconTooltip: string = ""
  export let withArrow: boolean = false
  export let withActions: boolean = true
  export let showActions: boolean = false
  export let indentLevel: number = 0
  export let text: string
  export let subtext: string | undefined = undefined
  export let border: boolean = true
  export let selected: boolean = false
  export let opened: boolean = false
  export let draggable: boolean = false
  export let iconText: string = ""
  export let iconColor: string = ""
  export let scrollable: boolean = false
  export let highlighted: boolean = false
  export let rightAlignIcon: boolean = false
  export let id: string = ""
  export let showTooltip: boolean = false
  export let selectedBy: UIUser[] | null = null
  export let compact: boolean = false
  export let hovering: boolean = false
  export let disabled: boolean = false
  export let nonSelectable: boolean = false

  const scrollApi = getContext("scroll")
  const dispatch = createEventDispatcher()

  let contentRef: HTMLDivElement

  $: selected && contentRef && scrollToView()
  $: style = getStyle(indentLevel)

  const onClick = () => {
    scrollToView()
    dispatch("click")
  }

  const onIconClick = (e: Event) => {
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

  const getStyle = (indentLevel: number) => {
    let style = `padding-left:calc(${indentLevel * 14}px);`
    return style
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="nav-item"
  class:hovering
  class:border
  class:selected
  class:withActions
  class:showActions
  class:actionsOpen={highlighted && withActions}
  class:scrollable
  class:highlighted
  class:selectedBy
  class:disabled
  class:nonSelectable
  class:multiline={subtext}
  on:dragend
  on:dragstart
  on:dragover
  on:drop
  on:mouseenter
  on:mouseleave
  on:click={onClick}
  on:contextmenu
  on:dragover={e => e.preventDefault()}
  on:dragenter={e => e.preventDefault()}
  {id}
  {style}
  {draggable}
>
  <div
    class="nav-item-content"
    bind:this={contentRef}
    class:right={rightAlignIcon}
  >
    {#if withArrow}
      <div
        class:opened
        class:relative={indentLevel === 0 && !compact}
        class:absolute={indentLevel > 0 && !compact}
        class:compact
        class="icon arrow"
        on:click={onIconClick}
      >
        <Icon size="XS" weight="bold" name="caret-right" />
      </div>
    {/if}

    <slot name="icon" />
    {#if iconText}
      <div class="iconText" style={iconColor ? `color: ${iconColor};` : ""}>
        {iconText}
      </div>
    {:else if icon}
      <div class="icon" class:right={rightAlignIcon}>
        <Icon
          size="S"
          name={icon}
          color={iconColor}
          tooltip={iconTooltip}
          tooltipType={TooltipType.Info}
          tooltipPosition={TooltipPosition.Right}
        />
      </div>
    {/if}
    <div class="nav-item-body" title={showTooltip ? text : null}>
      <div class="text">
        <span title={text}>{text}</span>
        {#if subtext}
          <span class="subtext">
            {subtext}
          </span>
        {/if}
      </div>
      {#if selectedBy}
        <UserAvatars size="XS" users={selectedBy} />
      {/if}
    </div>

    {#if withActions}
      <div class="actions">
        <slot />
      </div>
    {/if}

    {#if $$slots.right}
      <div class="right">
        <slot name="right" />
      </div>
    {/if}
  </div>
</div>

<style>
  .nav-item {
    cursor: pointer;
    color: var(--grey-7);
    transition: background-color
      var(--spectrum-global-animation-duration-100, 50ms) ease-in-out;
    padding: 0 var(--spacing-l) 0;
    height: 32px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
  .nav-item.multiline {
    height: 52px;
  }
  .nav-item.nonSelectable {
    cursor: inherit;
  }
  .nav-item.scrollable {
    flex-direction: column;
  }
  .nav-item.highlighted {
    background-color: var(--spectrum-global-color-gray-200);
    --avatars-background: var(--spectrum-global-color-gray-200);
  }
  .nav-item.selected {
    background-color: var(--spectrum-global-color-gray-300) !important;
    --avatars-background: var(--spectrum-global-color-gray-300);
    color: var(--ink);
  }
  .nav-item.selected .icon {
    color: var(--spectrum-global-color-gray-900) !important;
  }
  .nav-item.disabled span {
    color: var(--spectrum-global-color-gray-700);
  }
  .nav-item:not(.nonSelectable):hover,
  .hovering {
    background-color: var(--spectrum-global-color-gray-200);
    --avatars-background: var(--spectrum-global-color-gray-300);
  }
  .nav-item:hover .actions,
  .hovering .actions,
  .nav-item.withActions.actionsOpen .actions,
  .nav-item.withActions.showActions .actions {
    opacity: 1;
  }
  .nav-item-content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    position: relative;
    padding-left: var(--spacing-l);
    box-sizing: border-box;
  }

  .nav-item-content.right {
    width: 100%;
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
    order: 1;
    margin-right: 2px;
  }
  .icon.right {
    order: 4;
    flex: 1;
    justify-content: flex-end;
  }
  .icon.arrow {
    flex: 0 0 20px;
    pointer-events: all;
    order: 0;
    transition: transform 50ms linear;
  }
  .icon.arrow.absolute {
    position: absolute;
    left: 0;
    padding: 8px;
    margin-left: -8px;
  }

  .compact {
    position: absolute;
    left: 6px;
    padding: 8px;
    margin-left: -8px;
  }
  .icon.arrow :global(svg) {
    width: 12px;
    height: 12px;
  }
  .icon.arrow.compact :global(svg) {
    width: 9px;
    height: 9px;
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

  .nav-item-body {
    font-weight: 600;
    font-size: 12px;
    flex: 1 1 auto;
    color: var(--spectrum-global-color-gray-900);
    order: 2;
    width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
  }
  .nav-item-body span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .scrollable .nav-item-body {
    flex: 0 1 auto;
    width: auto;
  }
  .text {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
    overflow: hidden;
  }
  .subtext {
    color: var(--spectrum-global-color-gray-700);
    font-weight: normal;
  }

  .actions {
    cursor: pointer;
    position: relative;
    display: grid;
    place-items: center;
    order: 3;
    opacity: 0;
    width: 20px;
    height: 20px;
    margin-left: var(--spacing-xs);
  }
  .nav-item.withActions:hover .actions {
    opacity: 1;
  }

  .right {
    margin-left: auto;
    order: 10;
  }
</style>
