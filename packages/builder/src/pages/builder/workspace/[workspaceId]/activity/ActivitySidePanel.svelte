<script lang="ts">
  import type {
    AgentRequest,
    AgentRequestAction,
    AgentRequestStatus,
    EscalationResolvedAction,
  } from "@budibase/types"
  import dayjs from "dayjs"
  import ActivityDetailsList, {
    type ActivityDetail,
  } from "./ActivityDetailsList.svelte"
  import ActivityPanelShell from "./ActivityPanelShell.svelte"
  import ActivityTimeline from "./ActivityTimeline.svelte"

  const statusChangedLabelByStatus: Record<AgentRequestStatus, string> = {
    active: "Processing",
    needs_input: "Needs input",
    completed: "Completed",
    failed: "Failed",
  }

  const escalationOutcomeLabel: Record<
    EscalationResolvedAction["outcome"],
    string
  > = {
    approved: "Escalation approved",
    rejected: "Escalation rejected",
    expired: "Escalation expired without a response",
  }

  const formatActionLabel = (action: AgentRequestAction): string => {
    switch (action.type) {
      case "user_message":
        return action.summary
      case "status_changed":
        return `Status changed to ${statusChangedLabelByStatus[action.to]}`
      case "tool_call":
        return action.summary || action.readableName || action.toolName
      case "escalation_raised":
        return action.recipients.length
          ? `Escalated to ${action.recipients.map(r => r.label).join(", ")}`
          : "Escalated"
      case "escalation_resolved":
        return escalationOutcomeLabel[action.outcome]
      default:
        throw action satisfies never
    }
  }

  let {
    open,
    title,
    request,
    agentName,
    createdBy,
    onClose,
  }: {
    open: boolean
    title: string
    request?: AgentRequest
    agentName: string
    createdBy: string
    onClose: () => void
  } = $props()

  let latestEntry = $derived.by(() => {
    if (!request) {
      return undefined
    }

    return request.entries[request.entries.length - 1]
  })
  let firstEntry = $derived.by(() => {
    if (!request) {
      return undefined
    }

    return request.entries[0]
  })
  let requestOperations = $derived.by(() => {
    if (!latestEntry) {
      return []
    }

    return latestEntry.operationNames
  })
  let details = $derived.by<ActivityDetail[]>(() => {
    if (!request) {
      return []
    }

    return [
      {
        type: "status-badge",
        label: "Status",
        status: request.status,
      },
      {
        type: "text",
        label: "Source",
        value: agentName,
        icon: "sparkle",
        highlight: true,
      },
      {
        type: "text",
        label: "Operation",
        value: requestOperations.join(", ") || "",
        icon: "gear",
      },
      {
        type: "text",
        label: "Created by",
        value: createdBy,
        icon: "user",
      },
      {
        type: "text",
        label: "Channel",
        value: firstEntry?.source,
        icon: "circle",
      },
      {
        type: "text",
        label: "Created at",
        value: request.createdAt
          ? dayjs(request.createdAt).format("MMM D, YYYY h:mm A")
          : undefined,
        icon: "calendar",
      },
    ]
  })
  let timelineEvents = $derived.by(() => {
    if (!request?.actions?.length) {
      return []
    }

    return [...request.actions]
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .map(action => ({
        id: action.id,
        label: formatActionLabel(action),
        timestamp: dayjs(action.timestamp).format("MMM D, YYYY h:mm A"),
      }))
  })
</script>

<ActivityPanelShell open={open && !!request && !!latestEntry} {title} {onClose}>
  <section class="activity-panel-section">
    <div class="section-title">Request details</div>

    <ActivityDetailsList {details} />
  </section>

  <section class="activity-panel-section">
    <div class="section-title">Timeline</div>

    <ActivityTimeline
      items={timelineEvents}
      emptyText="No actions recorded yet."
    />
  </section>
</ActivityPanelShell>
