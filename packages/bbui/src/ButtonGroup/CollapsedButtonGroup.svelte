<script lang="ts">
  import Button from "../Button/Button.svelte"
  import Popover, { type PopoverAPI } from "../Popover/Popover.svelte"
  import Menu from "../Menu/Menu.svelte"
  import MenuItem from "../Menu/Item.svelte"
  import type { PopoverAlignment } from "../constants"

  type ButtonSize = "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL"

  interface CollapsedButton {
    icon?: string
    text?: string
    disabled?: boolean
    onClick?: () => void | Promise<void>
  }

  export let buttons: CollapsedButton[]
  export let text: string = "Action"
  export let size: ButtonSize = "M"
  export let align: PopoverAlignment | `${PopoverAlignment}` = "left"
  export let offset: number | undefined = undefined
  export let animate: boolean | undefined = undefined
  export let quiet: boolean = false

  let anchor: HTMLButtonElement | undefined
  let popover: PopoverAPI | undefined

  const handleClick = async (button: CollapsedButton) => {
    popover?.hide()
    await button.onClick?.()
  }
</script>

<Button
  bind:ref={anchor}
  {size}
  icon="caret-down"
  {quiet}
  primary={quiet}
  cta={!quiet}
  newStyles={!quiet}
  on:click={() => popover?.show()}
  on:click
  reverse
>
  {text || "Action"}
</Button>
<Popover
  bind:this={popover}
  {align}
  {anchor}
  {offset}
  {animate}
  resizable={false}
  on:close
  on:open
  on:mouseenter
  on:mouseleave
>
  <Menu>
    {#each buttons as button}
      <MenuItem
        icon={button.icon}
        on:click={() => handleClick(button)}
        disabled={button.disabled}
      >
        {button.text || "Button"}
      </MenuItem>
    {/each}
  </Menu>
</Popover>
