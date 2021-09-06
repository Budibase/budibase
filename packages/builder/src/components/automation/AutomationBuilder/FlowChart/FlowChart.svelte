<script>
  import FlowItem from "./FlowItem.svelte"
  import Arrow from "./Arrow.svelte"
  import { flip } from "svelte/animate"
  import { fade, fly } from "svelte/transition"
  import { Body, Detail, Icon, Label, StatusLight } from "@budibase/bbui"

  export let automation
  export let onSelect
  let blocks

  // TODO: ADD LOGIC FOR SWITCHING THIS
  let published = true

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
  <div class="content">
    <div class="title">
      <div class="subtitle">
        <Detail size="L">{automation.name}</Detail>
        <div
          style="display:flex;
          color: var(--spectrum-global-color-gray-400);"
        >
          <span class="iconPadding">
            <Icon name="DeleteOutline" />
          </span>
          <Label>Delete</Label>
        </div>
      </div>
      <div style="margin-left: calc(-1 * var(--spacing-s))">
        <StatusLight positive={published} notice={!published}
          >{#if published}
            <Body size="XS">Automation is published</Body>{:else}
            <Body size="XS">Automation is not published</Body>{/if}</StatusLight
        >
      </div>
    </div>
    {#each blocks as block, idx (block.id)}
      <div
        class="block"
        animate:flip={{ duration: 600 }}
        in:fade|local
        out:fly|local={{ x: 100 }}
      >
        <FlowItem {onSelect} {block} />
        {#if idx !== blocks.length - 1}
          <Arrow />
        {/if}
      </div>
    {/each}
  </div>
</section>

<style>
  .canvas {
    margin: 0 -40px calc(-1 * var(--spacing-l)) -40px;
    padding: var(--spacing-l) 40px 0 40px;
    overflow-y: auto;
    text-align: center;
  }
  /* Fix for firefox not respecting bottom padding in scrolling containers */
  .canvas > *:last-child {
    padding-bottom: 40px;
  }

  .block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .content {
    display: inline-block;
    text-align: left;
  }

  .title {
    padding-bottom: var(--spacing-xl);
  }

  .subtitle {
    padding-bottom: var(--spacing-xl);
    display: flex;
    justify-content: space-between;
  }

  .iconPadding {
    display: flex;
    padding-right: var(--spacing-m);
  }
</style>
