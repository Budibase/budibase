<script>
  import { Icon, Popover, Layout } from "@budibase/bbui"
  import { createEventDispatcher, getContext } from "svelte"

  export let anchor
  export let navItem

  const draggable = getContext("draggable")
  const dispatch = createEventDispatcher()

  let popover
  let drawers = []
  let open = false

  $: console.log(anchor)

  // Auto hide the component when another item is selected
  $: if (open && $draggable.selected !== navItem.id) {
    popover.hide()
  }

  // Open automatically if the component is marked as selected
  $: if (!open && $draggable.selected === navItem.id && popover) {
    popover.show()
    open = true
  }

  const updateNavItem = async (setting, value) => {
    dispatch("change", {
      ...navItem,
      [setting]: value,
    })
  }
</script>

<Icon
  name="Settings"
  hoverable
  size="S"
  on:click={() => {
    if (!open) {
      popover.show()
      open = true
    }
  }}
/>

<Popover
  bind:this={popover}
  on:open={() => {
    drawers = []
    $draggable.actions.select(navItem.id)
  }}
  on:close={() => {
    open = false
    if ($draggable.selected === navItem.id) {
      $draggable.actions.select()
    }
  }}
  {anchor}
  align="left-outside"
  showPopover={drawers.length === 0}
  clickOutsideOverride={drawers.length > 0}
  maxHeight={600}
  offset={18}
>
  <span class="popover-wrap">
    <Layout noPadding />
  </span>
</Popover>

<style>
  .popover-wrap {
    background-color: var(--spectrum-alias-background-color-primary);
  }
</style>
