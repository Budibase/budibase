<script lang="ts">
  import { Body, Button } from "@budibase/bbui"

  let {
    message,
    onRetry,
  }: {
    message: string
    onRetry: () => void
  } = $props()
</script>

<div class="load-error" role="alert">
  <Body size="S">{message}</Body>
  <Button secondary size="S" on:click={onRetry}>Try again</Button>
</div>

<style>
  .load-error {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-m);
    padding: var(--spacing-l);
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-100);
  }
</style>
