<script>
  import BlockComponent from "../BlockComponent.svelte"
  import Block from "../Block.svelte"
  import { Button, Popover, Menu, MenuItem } from "@budibase/bbui"
  import { getContext } from "svelte"

  export let buttons = []
  export let direction = "row"
  export let hAlign = "left"
  export let vAlign = "top"
  export let gap = "S"
  export let collapsed = false
  export let collapsedText = "Action"

  const { styleable, enrichButtonActions } = getContext("sdk")
  const component = getContext("component")
  const context = getContext("context")

  let popover
  let anchor

  const handleCollapsedClick = async button => {
    const fn = enrichButtonActions(button.onClick, $context)
    await fn?.()
    popover.hide()
  }
</script>

{#if collapsed}
  <div use:styleable={$component.styles}>
    <Button
      bind:ref={anchor}
      on:click={() => popover?.show()}
      icon="ChevronDown"
      cta
    >
      {collapsedText || "Action"}
    </Button>
  </div>
  <Popover bind:this={popover} align="left" {anchor}>
    <Menu>
      {#each buttons as button}
        <MenuItem
          on:click={() => handleCollapsedClick(button)}
          disabled={button.disabled}
        >
          {button.text || "Button"}
        </MenuItem>
      {/each}
    </Menu>
  </Popover>
{:else}
  <Block>
    <BlockComponent
      type="container"
      props={{
        direction,
        hAlign,
        vAlign,
        gap,
        wrap: true,
      }}
      styles={{
        normal: {
          height: "100%",
        },
      }}
    >
      {#each buttons as { text, type, quiet, disabled, onClick, size, icon, gap }}
        <BlockComponent
          type="button"
          props={{
            text: text || "Button",
            onClick,
            type,
            quiet,
            disabled,
            icon,
            gap,
            size: size || "M",
          }}
        />
      {/each}
    </BlockComponent>
  </Block>
{/if}
