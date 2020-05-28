<script>
  import FlowItem from "./FlowItem.svelte"

  export let blocks = []
  export let onSelect
</script>

<section class="canvas">
  {#each blocks as block, idx}
    <FlowItem {onSelect} {block} />
    {#if idx !== blocks.length - 1}
      <i class="ri-arrow-down-line" />
    {/if}
  {/each}
</section>

<style>
  .canvas {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>
