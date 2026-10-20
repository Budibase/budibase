<script lang="ts">
  import { Badge, Button, Icon, TextArea, notifications } from "@budibase/bbui"
  import {
    EscalationAction,
    EscalationNotificationChannel,
    type RequestDetailApproval,
    type RequestDetailEscalation,
    type RequestEscalationState,
  } from "@budibase/types"
  import dayjs from "dayjs"
  import { API } from "@/api"
  import { auth } from "@/stores/portal"

  interface Props {
    escalation: RequestDetailEscalation
    workspaceId: string
    onResponded: () => Promise<void>
  }

  let { escalation, workspaceId, onResponded }: Props = $props()

  const channelLabels: Record<EscalationNotificationChannel, string> = {
    [EscalationNotificationChannel.BUDIBASE]: "Budibase",
    [EscalationNotificationChannel.SLACK]: "Slack",
    [EscalationNotificationChannel.MSTEAMS]: "Teams",
  }

  const stateConfig: Record<
    RequestEscalationState,
    { label: string; color: string }
  > = {
    pending: {
      label: "Pending",
      color: "var(--spectrum-global-color-orange-500)",
    },
    approved: {
      label: "Approved",
      color: "var(--spectrum-global-color-green-500)",
    },
    rejected: {
      label: "Rejected",
      color: "var(--spectrum-global-color-red-500)",
    },
    expired: {
      label: "Expired",
      color: "var(--spectrum-global-color-gray-700)",
    },
    cancelled: {
      label: "Cancelled",
      color: "var(--spectrum-global-color-gray-700)",
    },
  }

  const decisionLabel = (approval: RequestDetailApproval) => {
    const approved = approval.actionId === EscalationAction.APPROVE
    if (approval.userId === $auth.user?._id) {
      return approved ? "You approved" : "You rejected"
    }
    return `${approved ? "Approved" : "Rejected"} by ${approval.name}`
  }

  let mode = $state<EscalationAction>()
  let note = $state<string>()
  let submitting = $state(false)

  let canRespond = $derived(
    escalation.isApprover &&
      escalation.state === "pending" &&
      !escalation.responded
  )
  let pill = $derived(stateConfig[escalation.state])
  let meta = $derived.by(() => {
    const parts: string[] = []
    const recipient = escalation.recipients[0]
    if (recipient) {
      parts.push(
        [channelLabels[recipient.type], recipient.label]
          .filter(Boolean)
          .join(" · ")
      )
    }
    if (escalation.expiresAt) {
      const verb = escalation.state === "expired" ? "Expired" : "Expires"
      parts.push(
        `${verb} ${dayjs(escalation.expiresAt).format("D MMM, HH:mm")}`
      )
    }
    if (escalation.approverCount > 1) {
      parts.push(
        `${escalation.approvals.length} of ${escalation.approverCount} responded`
      )
    }
    return parts
  })

  const open = (action: EscalationAction) => {
    note = undefined
    mode = action
  }

  const close = () => {
    mode = undefined
    note = undefined
  }

  const submit = async () => {
    if (!mode) {
      return
    }
    submitting = true
    try {
      const result = await API.respondToEscalation({
        workspaceId,
        escalationId: escalation.escalationId,
        actionId: mode,
        note: note?.trim(),
      })
      if (result.status === "recorded") {
        notifications.success(
          mode === EscalationAction.APPROVE
            ? "Escalation approved"
            : "Escalation rejected"
        )
      } else {
        notifications.error(result.message || "Escalation is no longer open")
      }
      close()
      await onResponded()
    } catch (error) {
      notifications.error("Error responding to escalation")
    } finally {
      submitting = false
    }
  }
</script>

<div class="card" class:interactive={canRespond && !mode}>
  <div class="top">
    <div class="title">{escalation.title || escalation.escalationId}</div>
    <Badge
      size="S"
      backgroundColor={`color-mix(in srgb, ${pill.color} 18%, transparent)`}
      textColor={pill.color}
    >
      {pill.label}
    </Badge>
  </div>
  <div class="bottom">
    <div class="meta">
      {#each meta as part}
        <span>{part}</span>
      {/each}
    </div>
    {#if canRespond && !mode}
      <div class="actions">
        <button
          class="action"
          aria-label="Reject"
          onclick={() => open(EscalationAction.REJECT)}
        >
          <Icon
            name="x"
            size="S"
            color="var(--spectrum-global-color-red-500)"
          />
        </button>
        <button
          class="action"
          aria-label="Accept"
          onclick={() => open(EscalationAction.APPROVE)}
        >
          <Icon
            name="check"
            size="S"
            color="var(--spectrum-global-color-green-500)"
          />
        </button>
      </div>
    {/if}
  </div>
  {#each escalation.approvals as approval}
    <div class="decision">
      <div class="decision-meta">
        {decisionLabel(approval)} · {dayjs(approval.respondedAt).format(
          "D MMM, HH:mm"
        )}
      </div>
      {#if approval.note}
        <div>{approval.note}</div>
      {/if}
    </div>
  {/each}
  {#if mode}
    <div class="respond">
      <TextArea
        label={mode === EscalationAction.REJECT
          ? "Reason (optional)"
          : "Note (optional)"}
        placeholder={mode === EscalationAction.REJECT
          ? "Let them know why..."
          : "Add a note..."}
        bind:value={note}
        updateOnChange
        disabled={submitting}
      />
      <div class="buttons">
        <Button secondary on:click={close} disabled={submitting}>Cancel</Button>
        {#if mode === EscalationAction.REJECT}
          <Button warning on:click={submit} disabled={submitting}>
            Reject
          </Button>
        {:else}
          <Button cta on:click={submit} disabled={submitting}>Accept</Button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    padding: var(--spacing-l);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-100);
    transition: background-color 130ms ease-in-out;
  }
  .card.interactive:hover,
  .card.interactive:focus-within {
    background: var(--spectrum-global-color-gray-200);
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-l);
  }
  .title {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-l);
    min-height: 24px;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-m);
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-700);
  }
  .actions {
    display: flex;
    gap: var(--spacing-s);
    opacity: 0;
    transition: opacity 130ms ease-in-out;
  }
  .card:hover .actions,
  .card:focus-within .actions {
    opacity: 1;
  }
  @media (hover: none) {
    .actions {
      opacity: 1;
    }
  }
  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--border-radius-s);
    border: 1px solid var(--spectrum-global-color-gray-400);
    background: transparent;
    cursor: pointer;
  }
  .decision {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-m);
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-75);
  }
  .decision-meta {
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-700);
  }
  .respond {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    padding-top: var(--spacing-m);
    border-top: 1px solid var(--spectrum-global-color-gray-300);
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-s);
  }
</style>
