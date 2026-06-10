<script lang="ts">
  import { Body, Table } from "@budibase/bbui"
  import { API } from "@/api"
  import { selectedAgent } from "@/stores/portal"
  import type { AgentRequest } from "@budibase/types"
  import dayjs from "dayjs"

  let currentAgent = $derived($selectedAgent)
  let requests = $state<AgentRequest[]>([])
  let loading = $state(false)

  const formatRequestAge = (value?: string | number) => {
    if (!value) {
      return "Just now"
    }
    return dayjs(value).fromNow()
  }

  const formatRequestStatus = (status: AgentRequest["status"]) =>
    status === "waiting" ? "Waiting" : "Completed"

  let interactionCount = $derived.by(() =>
    requests.reduce((total, request) => total + request.interactionCount, 0)
  )

  let tableRequests = $derived.by(() =>
    requests.map(request => ({
      title:
        request.promptHistory[0] ||
        request.promptHistory[request.promptHistory.length - 1] ||
        "Untitled request",
      subtitle: `${request.interactionCount} interaction${request.interactionCount === 1 ? "" : "s"} • ${formatRequestAge(request.updatedAt || request.createdAt)}`,
      status: formatRequestStatus(request.status),
    }))
  )

  async function loadRequests(agentId?: string) {
    if (!agentId) {
      requests = []
      return
    }

    loading = true
    try {
      const response = await API.fetchAgentRequests(agentId, { limit: 10 })
      requests = response.requests
    } catch (error) {
      console.error("Failed to fetch agent requests", error)
      requests = []
    } finally {
      loading = false
    }
  }

  $effect(() => {
    loadRequests(currentAgent?._id)
  })
</script>

<div class="overview">
  <div class="top-row">
    <div class="card agent-card">
      <Body size="S" color="#efefef" weight="600">
        {currentAgent?.name || "IT assistant"}
      </Body>
      <div class="meta">
        <div><span>AI Model:</span> Budibase AI</div>
        <div><span>Channel:</span> Slack</div>
        <div><span>Operations:</span> 3</div>
      </div>
    </div>
    <div class="card metric-card">
      <Body size="S" color="#a2a2a2">Recent requests</Body>
      <div class="metric">{requests.length}</div>
    </div>
    <div class="card metric-card">
      <Body size="S" color="#a2a2a2">Interactions</Body>
      <div class="metric">{interactionCount}</div>
    </div>
  </div>

  <div class="card requests-card">
    <div class="requests-header">
      <Body size="S" color="#efefef" weight="600">Recent requests</Body>
      <Body size="XS" color="#a2a2a2">Showing latest {requests.length}</Body>
    </div>
    <Table
      compact
      quiet
      hideHeader
      allowClickRows={false}
      allowEditRows={false}
      allowEditColumns={false}
      allowSelectRows={false}
      data={tableRequests}
      schema={{
        title: { displayName: "Request", width: "minmax(0, 1.7fr)" },
        subtitle: { displayName: "Details", width: "minmax(0, 1.3fr)" },
        status: {
          displayName: "Status",
          width: "110px",
          align: "Right",
          preventSelectRow: true,
        },
      }}
    />
    {#if !loading && tableRequests.length === 0}
      <div class="empty-state">No requests tracked yet.</div>
    {/if}
  </div>
</div>

<style>
  .overview {
    width: min(1200px, calc(100vw - 40px));
    margin: 0 auto;
    padding: 32px 0 48px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    color: #efefef;
  }

  .top-row {
    display: flex;
    gap: 16px;
    align-items: stretch;
  }

  .card {
    background: var(--background-alt);
    border-radius: 4px;
  }

  .agent-card {
    width: 600px;
    padding: var(--spacing-m) var(--spacing-l);
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 6px;
    color: var(--spectrum-global-color-gray-900);
    font-size: 14px;
  }

  .meta span {
    display: inline-block;
    width: 80px;
    color: var(--spectrum-global-color-gray-600);
    font-size: 13px;
  }

  .metric-card {
    flex: 1;
    padding: var(--spacing-m) var(--spacing-l);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }

  .metric {
    font-size: 26px;
    color: var(--spectrum-global-color-gray-900);
    line-height: 1;
  }

  .requests-card {
    padding: var(--spacing-l);
  }

  .requests-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .requests-card :global(.spectrum-Table) {
    background: transparent;
  }

  .requests-card :global(.spectrum-Table-cell) {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    border-left: 0;
    border-right: 0;
    color: var(--spectrum-global-color-gray-900);
  }

  .requests-card :global(.spectrum-Table-row:first-child .spectrum-Table-cell) {
    border-top: 0;
  }

  .requests-card :global(.spectrum-Table-cell:last-child) {
    text-align: right;
    white-space: nowrap;
  }

  .empty-state {
    padding-top: 12px;
    color: var(--spectrum-global-color-gray-600);
    font-size: 13px;
  }
</style>
