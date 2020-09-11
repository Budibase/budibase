<script>
  import FlowItem from "./FlowItem.svelte"
  import Arrow from "./Arrow.svelte"
  import { flip } from "svelte/animate"
  import { fade, fly } from "svelte/transition"

  export let workflow
  export let onSelect
  let blocks

  $: {
    blocks = []
    if (workflow) {
      if (workflow.definition.trigger) {
        blocks.push(workflow.definition.trigger)
      }
      blocks = blocks.concat(workflow.definition.steps || [])
    }
  }
</script>

<section>
  {#each blocks as block, idx (block.id)}
    <FlowItem {onSelect} {block} />
    {#if idx !== blocks.length - 1}
      <Arrow />
    {/if}
  {/each}
</section>

<style>
  section {
    position: absolute;
    padding: 20px 40px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>
