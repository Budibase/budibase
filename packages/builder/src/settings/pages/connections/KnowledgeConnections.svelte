<script lang="ts">
  import { onMount } from "svelte"
  import { Layout, Table, Body, notifications } from "@budibase/bbui"
  import { confirm } from "@/helpers"
  import { agentsStore } from "@/stores/portal"
  import {
    AgentKnowledgeSourceType,
    type AgentKnowledgeSource,
    type FetchSharePointKnowledgeConnectionResponse,
  } from "@budibase/types"
  import KnowledgeConnectionIconRenderer from "./_components/KnowledgeConnectionIconRenderer.svelte"
  import KnowledgeConnectionActionsRenderer from "./_components/KnowledgeConnectionActionsRenderer.svelte"

  interface KnowledgeConnectionRow {
    icon: string
    connectionName: string
    sites: string
    usedBy: string
    canDelete: boolean
    onDelete?: () => Promise<void>
  }

  const customRenderers = [
    {
      column: "icon",
      component: KnowledgeConnectionIconRenderer,
    },
    {
      column: "canDelete",
      component: KnowledgeConnectionActionsRenderer,
    },
  ]

  const schema = {
    icon: { width: "40px", displayName: "" },
    connectionName: { width: "220px", displayName: "Connection" },
    sites: { width: "1fr", displayName: "Sites" },
    usedBy: { width: "260px", displayName: "Used by" },
    canDelete: { width: "130px", displayName: "" },
  }

  const compactList = (values: string[], max = 2) => {
    if (values.length <= max) {
      return values.join(", ")
    }
    return `${values.slice(0, max).join(", ")} +${values.length - max} more`
  }

  const toConnectionRows = (): KnowledgeConnectionRow[] => {
    const siteNames = new Set<string>()
    const agentNames = new Set<string>()

    for (const agent of $agentsStore.agents) {
      for (const source of (agent.knowledgeSources ||
        []) as AgentKnowledgeSource[]) {
        if (source.type !== AgentKnowledgeSourceType.SHAREPOINT) {
          continue
        }
        const site = source.config.site
        const siteId = site?.id?.trim()
        if (!siteId) {
          continue
        }
        siteNames.add(site?.name || site?.webUrl || siteId)
        agentNames.add(agent.name || agent._id || "Agent")
      }
    }

    if (!sharePointConnection?.connected && siteNames.size === 0) {
      return []
    }

    const orderedSites = Array.from(siteNames).sort((a, b) =>
      a.localeCompare(b)
    )
    const orderedAgents = Array.from(agentNames).sort((a, b) =>
      a.localeCompare(b)
    )

    return [
      {
        icon: "sharepoint",
        connectionName: "SharePoint",
        sites: orderedSites.length ? compactList(orderedSites) : "-",
        usedBy: orderedAgents.length
          ? compactList(orderedAgents)
          : "Not in use",
        canDelete: orderedAgents.length === 0,
        onDelete: onDeleteSharePointConnection,
      } satisfies KnowledgeConnectionRow,
    ]
  }

  let loading = $state(true)
  let sharePointConnection = $state<
    FetchSharePointKnowledgeConnectionResponse | undefined
  >(undefined)
  let rows = $derived(toConnectionRows())

  async function refreshConnectionState() {
    sharePointConnection =
      await agentsStore.fetchSharePointKnowledgeConnection()
  }

  async function onDeleteSharePointConnection() {
    await confirm({
      title: "Delete SharePoint connection",
      body: "This removes the workspace SharePoint connection. You can reconnect it later.",
      okText: "Delete connection",
      warning: true,
      onConfirm: async () => {
        try {
          await agentsStore.deleteSharePointKnowledgeConnection()
          notifications.success("SharePoint connection deleted")
          await refreshConnectionState()
        } catch (error: any) {
          notifications.error(
            error?.message || "Failed to delete SharePoint connection"
          )
        }
      },
    })
  }

  onMount(async () => {
    try {
      await Promise.all([
        $agentsStore.agentsLoaded ? Promise.resolve() : agentsStore.init(),
        refreshConnectionState(),
      ])
    } finally {
      loading = false
    }
  })
</script>

<Layout noPadding gap="XS">
  <div class="section-header">
    <div class="section-title">Connected knowledge sources</div>
  </div>

  {#if !loading && rows.length === 0}
    <div class="empty-state">
      <Body size="S">No knowledge sources are currently connected.</Body>
    </div>
  {:else}
    <Table
      compact
      rounded
      data={rows}
      {loading}
      {schema}
      {customRenderers}
      allowEditRows={false}
      allowClickRows={false}
      allowEditColumns={false}
    />
  {/if}
</Layout>

<style>
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-l);
    height: 24px;
  }

  .section-title {
    font-size: 13px;
    color: var(--grey-7, #a2a2a2);
  }

  .empty-state {
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-m);
  }
</style>
