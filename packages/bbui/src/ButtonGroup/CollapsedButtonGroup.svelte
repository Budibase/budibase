<script>
  import Button from "../Button/Button.svelte"
  import Popover from "../Popover/Popover.svelte"
  import Menu from "../Menu/Menu.svelte"
  import MenuItem from "../Menu/Item.svelte"

  export let buttons
  export let text = "Action"
  export let size = "M"
  export let align = "left"
  export let offset

  let anchor
  let popover

  const handleClick = async button => {
    popover.hide()
    await button.onClick?.()
  }
</script>

<Button
  bind:ref={anchor}
  {size}
  icon="ChevronDown"
  cta
  on:click={() => popover?.show()}
>
  {text || "Action"}
</Button>
<Popover bind:this={popover} {align} {anchor} {offset} resizable={false}>
  <Menu>
    {#each buttons as button}
      <MenuItem on:click={() => handleClick(button)} disabled={button.disabled}>
        {button.text || "Button"}
      </MenuItem>
    {/each}
  </Menu>
</Popover>
