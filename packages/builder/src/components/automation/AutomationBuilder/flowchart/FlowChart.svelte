<script>
  import FlowItem from "./FlowItem.svelte"
  import Arrow from "./Arrow.svelte"
  import { flip } from "svelte/animate"
  import { fade, fly } from "svelte/transition"

  export let automation
  export let onSelect
  let blocks

  $: {
    blocks = []
    if (automation) {
      if (automation.definition.trigger) {
        blocks.push(automation.definition.trigger)
      }
      blocks = blocks.concat(automation.definition.steps || [])
    }
  }
</script>

<section class="canvas">
  {#each blocks as block, idx (block.id)}
    <div
      class="block"
      animate:flip={{ duration: 600 }}
      in:fade|local
      out:fly|local={{ x: 100 }}>
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
