<script lang="ts">
  import { API } from "@/api"
  import { Body, Button, Table } from "@budibase/bbui"
  import type { ActionSession } from "@budibase/types"
  import { onMount } from "svelte"
  import ActivityPage from "./ActivityPage.svelte"
  import ActivityStatusRenderer from "./ActivityStatusRenderer.svelte"
  import ActivityTablePanel from "./ActivityTablePanel.svelte"
  import ActivityTypeRenderer from "./ActivityTypeRenderer.svelte"
  import { toActionSessionRow } from "./actionSessionRows"

  const PAGE_SIZE = 20
  const RELATIVE_TIME_REFRESH_MS = 30000

  const tableSchema = {
    typeLabel: { type: "string", displayName: "Type", width: "180px" },
    assetLabel: {
      type: "string",
      displayName: "Asset",
      width: "minmax(200px, 1.5fr)",
    },
    triggeredByLabel: {
      type: "string",
      displayName: "Triggered by",
      width: "minmax(160px, 1fr)",
    },
    statusLabel: { type: "string", displayName: "Status", width: "150px" },
    actionCount: { type: "number", displayName: "Actions", width: "100px" },
    updatedLabel: { type: "string", displayName: "Updated", width: "130px" },
  }
  const customRenderers = [
    { column: "typeLabel", component: ActivityTypeRenderer },
    { column: "statusLabel", component: ActivityStatusRenderer },
  ]

  let loading = $state(true)
  let loadFailed = $state(false)
  let sessions = $state<ActionSession[]>([])
  // Ticks on an interval purely to force updatedLabel to re-derive
  let now = $state(Date.now())

  let rows = $derived(
    sessions.map(session => toActionSessionRow({ session, now }))
  )

  async function loadSessions() {
    loading = true
    loadFailed = false
    try {
      const response = await API.fetchActionSessions({ limit: PAGE_SIZE })
      sessions = response.sessions
    } catch (error) {
      console.error("Failed to fetch action sessions", error)
      sessions = []
      loadFailed = true
    } finally {
      loading = false
    }
  }

  onMount(() => {
    loadSessions()
  })

  $effect(() => {
    const interval = setInterval(() => {
      now = Date.now()
    }, RELATIVE_TIME_REFRESH_MS)
    return () => clearInterval(interval)
  })
</script>

<ActivityPage>
  {#if loadFailed}
    <div class="load-error" role="alert">
      <Body size="S">Failed to load actions.</Body>
      <Button secondary size="S" on:click={loadSessions}>Try again</Button>
    </div>
  {:else}
    <ActivityTablePanel>
      <Table
        quiet
        compact
        {loading}
        disableSorting
        allowClickRows={false}
        allowEditRows={false}
        allowEditColumns={false}
        allowSelectRows={false}
        data={rows}
        schema={tableSchema}
        {customRenderers}
        placeholderText="No actions tracked yet."
      />
    </ActivityTablePanel>
  {/if}
</ActivityPage>

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
