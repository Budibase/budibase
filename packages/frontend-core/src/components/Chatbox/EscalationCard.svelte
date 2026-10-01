<script lang="ts">
  import { Body, Button, Icon } from "@budibase/bbui"
  import { APPROVAL_REQUIRED_TITLE_PREFIX } from "@budibase/shared-core"
  import type {
    EscalationContextDoc,
    EscalationReviewContext,
  } from "@budibase/types"

  interface Props {
    title?: string
    summary?: string
    reviewContext?: EscalationReviewContext
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
    reviewContext,
    resolution,
    statusMessage,
    showApproval = false,
    resolving = false,
    onApprove,
    onReject,
  }: Props = $props()

  // Resolved either by this card's action (statusMessage) or elsewhere (poll).
  let isResolved = $derived(!!statusMessage || resolution !== "pending")
  let expanded = $state(true)
  let showDetails = $derived(!showApproval || expanded)
  // The card heading already reads "Approval required", so drop the matching
  // prefix that operation escalations put on the title.
  let displayTitle = $derived(
    title?.startsWith(APPROVAL_REQUIRED_TITLE_PREFIX)
      ? title.slice(APPROVAL_REQUIRED_TITLE_PREFIX.length).trim()
      : title
  )
  let hasSharedParameters = $derived(Boolean(reviewContext?.parameters?.length))

  const toggleDetails = () => {
    expanded = !expanded
  }
</script>

<div class="escalation-card" aria-live="polite">
  {#if showApproval}
    <button
      type="button"
      class="escalation-card-header escalation-card-toggle"
      aria-expanded={expanded}
      aria-label={`${expanded ? "Collapse" : "Expand"} approval details${displayTitle ? ` for ${displayTitle}` : ""}`}
      onclick={toggleDetails}
    >
      <Icon name={isResolved ? "check-circle" : "clock"} size="M" />
      <span class="escalation-card-heading">Approval required</span>
      <span class="escalation-card-header-end">
        {#if !isResolved}
          <span class="escalation-card-badge">Test mode</span>
        {/if}
        <span class="escalation-card-chevron" class:expanded>
          <Icon name="caret-down" size="S" />
        </span>
      </span>
    </button>
  {:else}
    <div class="escalation-card-header">
      <Icon name={isResolved ? "check-circle" : "clock"} size="M" />
      <span class="escalation-card-heading">Approval required</span>
    </div>
  {/if}

  {#if showDetails}
    {#if displayTitle}
      <div class="escalation-card-title">{displayTitle}</div>
    {/if}

    {#if reviewContext}
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        {reviewContext.requestedBy} is requesting approval for
        <strong>{reviewContext.action}</strong> as part of
        <strong>{reviewContext.operation}</strong>.
      </Body>
    {/if}

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
    {:else}
      <Body size="XS" color="var(--spectrum-global-color-gray-600)">
        Awaiting a human response.
      </Body>
    {/if}

    {#if hasSharedParameters && reviewContext?.parameters}
      <div class="escalation-card-divider"></div>
      <div class="escalation-card-parameters-heading">
        <span>Tool parameters</span>
        {#if reviewContext.toolName}
          <code>{reviewContext.toolName}</code>
        {/if}
      </div>
      <div class="escalation-card-parameters-list">
        {#each reviewContext.parameters as parameter (parameter.name)}
          <div class="escalation-card-parameter">
            <code>{parameter.name}</code>
            <pre class="escalation-card-parameters">{parameter.value}</pre>
          </div>
        {/each}
      </div>
    {/if}
  {/if}

  {#if showApproval && !isResolved}
    <div class="escalation-card-actions">
      <Button cta disabled={resolving} on:click={() => onApprove?.()}>
        Approve
      </Button>
      <Button secondary disabled={resolving} on:click={() => onReject?.()}>
        Reject
      </Button>
    </div>
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
  .escalation-card-toggle {
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    color: inherit;
    font: inherit;
  }
  .escalation-card-heading,
  .escalation-card-title,
  .escalation-card-parameters-heading {
    font-weight: 600;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }
  .escalation-card-title {
    margin-top: var(--spacing-xs);
  }
  .escalation-card-header-end {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin-left: auto;
  }
  .escalation-card-badge {
    border-radius: 999px;
    border: 1px solid var(--spectrum-global-color-blue-400);
    color: var(--spectrum-global-color-blue-700);
    background: var(--spectrum-global-color-blue-100);
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    padding: 4px 8px;
  }
  .escalation-card-chevron {
    display: flex;
    color: var(--spectrum-global-color-gray-700);
    transition: transform 130ms ease-in-out;
  }
  .escalation-card-chevron.expanded {
    transform: rotate(180deg);
  }
  .escalation-card-actions {
    display: flex;
    gap: var(--spacing-s);
    margin-top: var(--spacing-xs);
  }
  .escalation-card-divider {
    height: 1px;
    margin: var(--spacing-xs) calc(-1 * var(--spacing-m));
    background: var(--spectrum-global-color-gray-300);
  }
  .escalation-card-parameters-heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  .escalation-card-parameters-heading code {
    min-width: 0;
    padding: 2px 5px;
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-200);
    font-size: 12px;
    font-weight: 400;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .escalation-card-parameters-list,
  .escalation-card-parameter {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .escalation-card-parameters {
    box-sizing: content-box;
    min-height: 12px;
    max-height: 360px;
    margin: 0;
    padding: var(--spacing-s);
    overflow: auto;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-800);
    font-family: monospace;
    font-size: 12px;
    line-height: 16px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
