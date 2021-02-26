<script>
  import FlowItem from "./FlowItem.svelte"
  import Arrow from "./Arrow.svelte"
  import { flip } from "svelte/animate"
  import {dndzone} from "svelte-dnd-action";
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

  const flipDurationMs = 300;
  function handleDndConsider(e) {
      blocks = e.detail.items;
  }
  function handleDndFinalize(e) {
      blocks = e.detail.items;
  }
</script>

{#if !blocks.length}<i>Add a trigger to your automation to get started</i>{/if}
<section class="canvas"  use:dndzone={{items: blocks, flipDurationMs}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
  {#each blocks as block, idx (block.id)}
    <div
      class="block"
      animate:flip={{ duration: flipDurationMs}}
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
    margin: 0 -40px calc(-1 * var(--spacing-l)) -40px;
    padding: var(--spacing-l) 40px 0 40px;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
    flex: 1 1 auto;
  }
  /* Fix for firefox not respecting bottom padding in scrolling containers */
  section > *:last-child {
    padding-bottom: 40px;
  }

  .block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
  }
</style>
