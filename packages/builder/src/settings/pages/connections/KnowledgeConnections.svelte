<script lang="ts">
  import { onMount } from "svelte"
  import { Layout, Table, Button, notifications } from "@budibase/bbui"
  import { appStore } from "@/stores/builder/app"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import KnowledgeConnectionIconRenderer from "./_components/KnowledgeConnectionIconRenderer.svelte"
  import KnowledgeConnectionReconnectRenderer from "./_components/KnowledgeConnectionReconnectRenderer.svelte"
  import { knowledgeConnectionsStore } from "@/stores/portal"

  const customRenderers = [
    {
      column: "icon",
      component: KnowledgeConnectionIconRenderer,
    },
    {
      column: "reconnect",
      component: KnowledgeConnectionReconnectRenderer,
    },
  ]

  const schema = {
    icon: { width: "40px", displayName: "" },
    connectionName: { width: "160px", displayName: "Connection" },
    account: { width: "1fr", displayName: "Account" },
    reconnect: { width: "auto", displayName: "" },
  }

  let loading = $state(true)
  let appId = $derived($appStore.appId)
  let rows = $derived(
    $knowledgeConnectionsStore.connections
      ?.map(connection => ({
        id: connection._id!,
        icon: connection.sourceType,
        connectionName: "Microsoft",
        account: connection.account || "-",
        reconnect: () => connectSharePoint(connection._id),
      }))
      .sort((a, b) => a.connectionName.localeCompare(b.connectionName))
  )

  const connectSharePoint = (connectionId?: string) => {
    if (!appId) {
      notifications.error("Missing app context to connect SharePoint")
      return
    }
    const returnPath = window.location.pathname
    const params = new URLSearchParams({
      appId,
      returnPath,
    })
    if (connectionId) {
      params.set("connectionId", connectionId)
    }
    const oauthUrl = `/api/agent/knowledge-sources/sharepoint/connect?${params.toString()}`
    window.location.href = oauthUrl
  }

  onMount(async () => {
    try {
      await knowledgeConnectionsStore.fetch()
    } catch (e) {
      console.error("Failed to load knowledge connections", e)
      notifications.error("Failed to load knowledge connections")
    } finally {
      loading = false
    }
  })
</script>

<Layout noPadding gap="XS">
  <RouteActions>
    <div class="section-header">
      <Button cta size="M" on:click={() => connectSharePoint()}
        >Add connection</Button
      >
    </div>
  </RouteActions>

  <Table
    compact
    rounded
    data={rows}
    {loading}
    {schema}
    {customRenderers}
    hideHeader
    allowEditRows={false}
    allowClickRows={false}
    allowEditColumns={false}
  />
</Layout>

<style>
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-l);
    height: 24px;
  }
</style>
