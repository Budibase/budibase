<script lang="ts">
  import { Body } from "@budibase/bbui"
  import type { Snippet } from "svelte"

  let {
    title,
    description,
    descriptionContent,
    actions,
  }: {
    title: string
    description?: string
    descriptionContent?: Snippet
    actions?: Snippet
  } = $props()
</script>

<div class="rail-section-header">
  <div class="rail-section-copy">
    <Body size="S" weight="500" color="var(--spectrum-global-color-gray-900)">
      {title}
    </Body>
    <Body size="XS" color="var(--spectrum-global-color-gray-700)">
      {#if descriptionContent}
        {@render descriptionContent()}
      {:else}
        {description}
      {/if}
    </Body>
  </div>
  {#if actions}
    <div class="rail-section-actions">
      {@render actions()}
    </div>
  {/if}
</div>

<style>
  .rail-section-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .rail-section-copy {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .rail-section-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .rail-section-actions :global(.spectrum-Button) {
    border-radius: 100px;
  }
</style>
