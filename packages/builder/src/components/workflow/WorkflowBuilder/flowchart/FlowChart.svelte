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

<section class="canvas">
  {#each blocks as block, idx (block.id)}
    <div
      class="block"
      animate:flip={{ duration: 600 }}
      in:fade
      out:fly={{ x: 100 }}>
      <FlowItem {onSelect} {block} />
      {#if idx !== blocks.length - 1}
        <Arrow />
      {/if}
    </div>
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

  .block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>
