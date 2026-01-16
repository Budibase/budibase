<script>
  import BlockComponent from "../BlockComponent.svelte"
  import Block from "../Block.svelte"
  import { CollapsedButtonGroup } from "@budibase/bbui"
  import { getContext } from "svelte"

  export let buttons = []
  export let direction = "row"
  export let hAlign = "left"
  export let vAlign = "top"
  export let gap = "S"
  export let collapsed = false
  export let collapsedText = "Action"

  const { enrichButtonActions } = getContext("sdk")
  const context = getContext("context")

  $: collapsedButtons = collapsed ? makeCollapsed(buttons) : null

  const makeCollapsed = buttons => {
    return buttons.map(button => ({
      ...button,
      onClick: async () => {
        const fn = enrichButtonActions(button.onClick, $context)
        await fn?.()
      },
    }))
  }
</script>

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
    {#if collapsed}
      <CollapsedButtonGroup
        text={collapsedText || "Action"}
        buttons={collapsedButtons}
      />
    {:else}
      {#each buttons as button}
        <BlockComponent
          type="button"
          props={{
            text: button?.text || "Button",
            onClick: button?.onClick,
            type: button?.type,
            quiet: button?.quiet,
            disabled: button?.disabled,
            icon: button?.icon,
            gap: button?.gap,
            size: button?.size || "M",
            _conditions: button?._conditions || button?.conditions,
          }}
        />
      {/each}
    {/if}
  </BlockComponent>
</Block>
