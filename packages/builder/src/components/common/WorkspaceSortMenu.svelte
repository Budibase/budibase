<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte"
  import { Icon, Menu, MenuItem, TooltipPosition } from "@budibase/bbui"
  import Portal from "svelte-portal"

  export let currentSort: string
  export let open = false
  export let options: { key: string; label: string }[] = []

  const dispatch = createEventDispatcher<{ select: string }>()

  let anchor: HTMLButtonElement | null = null
  let dropdown: HTMLDivElement | null = null
  let left = 0
  let top = 0

  const updatePosition = () => {
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    left = rect.left
    top = rect.bottom + 6
  }

  const toggle = () => {
    open = !open
    if (open) updatePosition()
  }

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node
    if (anchor?.contains(target) || dropdown?.contains(target)) return
    open = false
  }

  onMount(() => {
    window.addEventListener("click", handleClickOutside, true)
  })

  onDestroy(() => {
    window.removeEventListener("click", handleClickOutside, true)
  })
</script>

<button
  type="button"
  class="sort-button"
  aria-label="Sort"
  aria-haspopup="menu"
  aria-expanded={open}
  bind:this={anchor}
  on:click|stopPropagation={toggle}
>
  <Icon
    name="sort-ascending"
    hoverable
    tooltip="Sort"
    tooltipPosition={TooltipPosition.Right}
    color="var(--spectrum-global-color-gray-700)"
    hoverColor="var(--spectrum-global-color-gray-900)"
  />
</button>

{#if open}
  <Portal target=".spectrum">
    <div
      class="dropdown spectrum-Popover is-open"
      style="left: {left}px; top: {top}px"
      bind:this={dropdown}
    >
      <Menu>
        {#each options as option}
          <MenuItem
            keyBind={currentSort === option.key ? "!check" : undefined}
            noClose
            on:click={() => {
              dispatch("select", option.key)
              open = false
            }}
          >
            {option.label}
          </MenuItem>
        {/each}
      </Menu>
    </div>
  </Portal>
{/if}

<style>
  .sort-button {
    display: inline-flex;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .dropdown {
    position: fixed;
    z-index: 10;
    min-width: 180px;
  }
</style>
