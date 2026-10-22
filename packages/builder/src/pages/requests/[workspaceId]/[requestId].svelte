<script lang="ts">
  import {
    ActionButton,
    Body,
    Divider,
    Heading,
    Helpers,
    Icon,
    notifications,
  } from "@budibase/bbui"
  import type { FindRequestResponse } from "@budibase/types"
  import { params } from "@roxi/routify"
  import dayjs from "dayjs"
  import { API } from "@/api"
  import ActivityStatusBadge from "@/pages/builder/workspace/[workspaceId]/activity/ActivityStatusBadge.svelte"
  import EscalationCard from "../_components/EscalationCard.svelte"

  let request = $state<FindRequestResponse>()
  let notFound = $state(false)
  let loadFailed = $state(false)

  let workspaceId = $derived<string>($params.workspaceId)
  let requestId = $derived<string>($params.requestId)
  let shortId = $derived(
    request && request.requestId.length > 24
      ? `${request.requestId.slice(0, 17)}...${request.requestId.slice(-4)}`
      : request?.requestId
  )

  const isNotFound = (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 404

  let loadSequence = 0

  const load = async () => {
    const sequence = ++loadSequence
    try {
      const result = await API.findUserRequest({ workspaceId, requestId })
      if (sequence !== loadSequence) {
        return
      }
      request = result
      notFound = false
      loadFailed = false
    } catch (error) {
      if (sequence !== loadSequence) {
        return
      }
      if (isNotFound(error)) {
        request = undefined
        notFound = true
        loadFailed = false
      } else {
        loadFailed = true
        notifications.error("Error loading request")
      }
    }
  }

  const copyId = async () => {
    if (!request) {
      return
    }
    await Helpers.copyToClipboard(request.requestId)
    notifications.success("Copied to clipboard")
  }

  $effect(() => {
    if (workspaceId && requestId) {
      load()
    }
  })
</script>

<a class="back" href="/requests">
  <Icon name="caret-left" size="S" />
  Requests
</a>

{#if loadFailed}
  <div class="load-failed">
    <Body size="S">Couldn't load this request.</Body>
    <ActionButton size="S" on:click={load}>Retry</ActionButton>
  </div>
{/if}

{#if request}
  <div class="panel">
    <div class="header">
      <Heading size="S">{request.title || request.requestId}</Heading>
      <div class="status">
        <ActivityStatusBadge status={request.status} />
      </div>
    </div>
    <Divider noMargin />
    <div class="fields">
      <div class="field">
        <div class="label">Requested</div>
        <div>
          {request.createdAt
            ? dayjs(request.createdAt).format("D MMM YYYY, HH:mm")
            : "-"}
        </div>
      </div>
      <div class="field">
        <div class="label">Submitted by</div>
        <div>{request.submittedBy || "-"}</div>
      </div>
      <div class="field">
        <div class="label">Channel</div>
        <div class="source">{request.source || "-"}</div>
      </div>
      <div class="field">
        <div class="label">ID</div>
        <div class="id">
          <span title={request.requestId}>{shortId}</span>
          <Icon name="copy" size="S" hoverable on:click={copyId} />
        </div>
      </div>
    </div>
    {#if request.escalations.length}
      <Divider noMargin />
      <div class="escalations">
        <div class="label section">
          Escalations · {request.escalations.length}
        </div>
        {#each request.escalations as escalation (escalation.escalationId)}
          <EscalationCard {escalation} {workspaceId} onResponded={load} />
        {/each}
      </div>
    {/if}
  </div>
{:else if notFound}
  <Body size="S">Request not found</Body>
{/if}

<style>
  .load-failed {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .back {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    align-self: flex-start;
    color: var(--spectrum-global-color-gray-700);
  }
  .back:hover {
    color: var(--spectrum-global-color-gray-900);
  }
  .panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-m);
    background: var(--background);
  }
  .status :global(.activity-status-badge .spectrum-Label) {
    font-size: var(--spectrum-global-dimension-font-size-50);
    line-height: var(--spectrum-global-font-line-height-medium, 1.5);
    padding: var(--spectrum-global-dimension-size-40)
      var(--spectrum-global-dimension-size-85);
    border-radius: var(
      --spectrum-alias-border-radius-regular,
      var(--spectrum-global-dimension-size-50)
    );
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-l);
  }
  .fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    min-width: 0;
  }
  .label {
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-700);
  }
  .label.section {
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .source {
    text-transform: capitalize;
  }
  .id {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .escalations {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
</style>
