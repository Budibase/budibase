<script>
  import BlockComponent from "../BlockComponent.svelte"
  import Block from "../Block.svelte"

  export let buttons = []
  export let direction = "row"
  export let hAlign = "left"
  export let vAlign = "top"
  export let gap = "S"
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
  >
    {#each buttons as { text, type, quiet, disabled, onClick, size }}
      <BlockComponent
        type="button"
        props={{
          text: text || "Button",
          onClick,
          type,
          quiet,
          disabled,
          size,
        }}
      />
    {/each}
  </BlockComponent>
</Block>
