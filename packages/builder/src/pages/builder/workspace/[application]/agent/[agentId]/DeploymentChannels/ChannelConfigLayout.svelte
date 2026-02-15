<script lang="ts">
  import { Button, Label, StatusLight } from "@budibase/bbui"
  import type { Snippet } from "svelte"

  let {
    statusPositive,
    positiveStatusLabel,
    negativeStatusLabel,
    actionLabel,
    actionDisabled = false,
    onAction,
    fields,
    response,
  }: {
    statusPositive: boolean
    positiveStatusLabel: string
    negativeStatusLabel: string
    actionLabel: string
    actionDisabled?: boolean
    onAction: () => void | Promise<void>
    fields: Snippet
    response: Snippet
  } = $props()
</script>

<div class="channel-config">
  <div class="field-grid">
    {@render fields()}
  </div>

  <div class="response-section">
    <Label size="L">Response</Label>
    <div class="status-light">
      <StatusLight positive={statusPositive} neutral={!statusPositive}>
        {statusPositive ? positiveStatusLabel : negativeStatusLabel}
      </StatusLight>
    </div>
    {@render response()}
  </div>

  <div class="actions">
    <Button cta on:click={() => onAction()} disabled={actionDisabled}>
      {actionLabel}
    </Button>
  </div>
</div>

<style>
  .channel-config {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-s) var(--spacing-m);
  }

  .response-section {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    padding-top: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .status-light :global(.spectrum-StatusLight) {
    justify-content: flex-start;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 900px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
