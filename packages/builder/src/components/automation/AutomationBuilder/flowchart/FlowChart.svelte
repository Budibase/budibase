<script>
  import FlowItem from "./FlowItem.svelte"
  import Arrow from "./Arrow.svelte"
  import { flip } from "svelte/animate"
  import { fade, fly } from "svelte/transition"
  import { automationStore } from "builderStore"

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
  $: automationCount = $automationStore.automations?.length ?? 0
</script>

{#if automationCount === 0}
  <i>Create your first automation to get started</i>
{:else if automation == null}
  <i>Select an automation to edit</i>
{:else if !blocks.length}
  <i>Add some steps to your automation to get started</i>
{/if}
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
  i {
    font-size: var(--font-size-xl);
    color: var(--grey-4);
    padding: var(--spacing-xl) 40px;
    align-self: flex-start;
  }

  section {
    position: absolute;
    padding: 40px;
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
