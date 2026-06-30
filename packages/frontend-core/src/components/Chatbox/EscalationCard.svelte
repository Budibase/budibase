<script lang="ts">
  import { Body, Button, Icon } from "@budibase/bbui"
  import type { EscalationContextDoc } from "@budibase/types"

  interface Props {
    title?: string
    summary?: string
    // Live resolution from the poll (not the frozen tool output).
    resolution: EscalationContextDoc["resolution"]
    // Message relayed from resolve ("Response recorded." etc.) - set as soon as
    // the action is taken here, before the poll flips resolution.
    statusMessage?: string
    // Dev-only: whether to show the inline Approve/Reject buttons.
    showApproval?: boolean
    resolving?: boolean
    onApprove?: () => void
    onReject?: () => void
  }

  let {
    title,
    summary,
    resolution,
    statusMessage,
    showApproval = false,
    resolving = false,
    onApprove,
    onReject,
  }: Props = $props()

  // Resolved either by this card's action (statusMessage) or elsewhere (poll).
  let isResolved = $derived(!!statusMessage || resolution !== "pending")
</script>

<div class="escalation-card" aria-live="polite">
  <div class="escalation-card-header">
    <Icon name={isResolved ? "check-circle" : "clock"} size="M" />
    <span class="escalation-card-title">{title || "Approval required"}</span>
    {#if showApproval && !isResolved}
      <span class="escalation-card-badge">Test mode</span>
    {/if}
  </div>

  {#if summary}
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      {summary}
    </Body>
  {/if}

  {#if isResolved}
    <Body size="XS" color="var(--spectrum-global-color-gray-600)">
      {statusMessage || "Response recorded."}
    </Body>
  {:else if showApproval}
    <Body size="XS" color="var(--spectrum-global-color-gray-600)">
      Approve or reject here to simulate a reviewer response.
    </Body>
    <div class="escalation-card-actions">
      <Button cta disabled={resolving} on:click={() => onApprove?.()}>
        Approve
      </Button>
      <Button secondary disabled={resolving} on:click={() => onReject?.()}>
        Reject
      </Button>
    </div>
  {:else}
    <Body size="XS" color="var(--spectrum-global-color-gray-600)">
      Awaiting a human response.
    </Body>
  {/if}
</div>

<style>
  .escalation-card {
    align-self: flex-start;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 12px;
    background: var(--spectrum-global-color-gray-75);
  }
  .escalation-card-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .escalation-card-title {
    font-weight: 600;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }
  .escalation-card-badge {
    margin-left: auto;
    border-radius: 999px;
    border: 1px solid var(--spectrum-global-color-blue-400);
    color: var(--spectrum-global-color-blue-700);
    background: var(--spectrum-global-color-blue-100);
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    padding: 4px 8px;
  }
  .escalation-card-actions {
    display: flex;
    gap: var(--spacing-s);
    margin-top: var(--spacing-xs);
  }
</style>
