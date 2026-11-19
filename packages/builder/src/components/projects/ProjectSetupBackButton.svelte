<script lang="ts">
  import { Button } from "@budibase/bbui"

  let { onReturn }: { onReturn: () => void } = $props()
</script>

<div class="project-setup-return">
  <Button quiet secondary size="S" icon="arrow-left" on:click={onReturn}>
    Back to project setup
  </Button>
</div>

<style>
  .project-setup-return {
    display: flex;
    align-items: center;
    padding: var(--spacing-s) var(--spacing-l);
    background: var(--background);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }
</style>
