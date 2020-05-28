<script>
  import FlowItem from "./FlowItem.svelte"
  import Arrow from "./Arrow.svelte";

  export let blocks = []
  export let onSelect
</script>

<section class="canvas">
  {#each blocks as block, idx}
    <FlowItem {onSelect} {block} />
    {#if idx !== blocks.length - 1}
      <Arrow />
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
