<script>
  import { Heading } from "@budibase/bbui"

  export let title
</script>

<div class="header">
  <Heading size="L">{title}</Heading>
  <div class="buttons">
    <slot name="buttons" />
  </div>
</div>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .buttons :global(> div) {
    display: contents;
  }
</style>
