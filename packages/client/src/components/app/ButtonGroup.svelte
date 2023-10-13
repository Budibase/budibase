<script>
  import BlockComponent from "../../BlockComponent.svelte"
  import Block from "../../Block.svelte"

  export let buttons = []
  export let direction
  export let hAlign
  export let vAlign
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
    {#each buttons as { text, type, quiet, disabled, onClick, size }, idx}
      <BlockComponent
        type="button"
        props={{
          text: text || `Button ${idx + 1}`,
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
