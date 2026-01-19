<script lang="ts">
  import DashCard from "@/components/common/DashCard.svelte"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import FavouriteResourceButton from "@/pages/builder/_components/FavouriteResourceButton.svelte"
  import WorkspaceAppModal from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte"
  import AgentModal from "@/pages/builder/workspace/[application]/agent/AgentModal.svelte"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import {
    appStore,
    automationStore,
    workspaceAppStore,
    workspaceFavouriteStore,
  } from "@/stores/builder"
  import { API } from "@/api"
  import { agentsStore, auth, featureFlags } from "@/stores/portal"
  import {
    ActionButton,
    Body,
    Button,
    Heading,
    Helpers,
    Modal,
    type ModalAPI,
    Tag,
  } from "@budibase/bbui"
  import {
    FeatureFlag,
    type GetWorkspaceHomeMetricsResponse,
    type PublishResourceState,
    WorkspaceResource,
    type Agent,
    type UIAutomation,
    type UIWorkspaceApp,
    type WorkspaceFavourite,
  } from "@budibase/types"
  import { goto, url } from "@roxi/routify"
  import { onMount } from "svelte"

  $goto
  $url

  type HomeType = "all" | "app" | "automation" | "agent"

  type HomeRowType = "app" | "automation" | "agent"

  interface HomeRowBase {
    id: string
    name: string
    type: HomeRowType
    updatedAt?: string
    favourite: WorkspaceFavourite
  }

  interface AppRow extends HomeRowBase {
    type: "app"
    resource: UIWorkspaceApp
    status: PublishResourceState
  }

  interface AutomationRow extends HomeRowBase {
    type: "automation"
    resource: UIAutomation
    status: PublishResourceState
  }

  interface AgentRow extends HomeRowBase {
    type: "agent"
    resource: Agent
    live: boolean
  }

  type HomeRow = AppRow | AutomationRow | AgentRow

  let workspaceAppModal: WorkspaceAppModal
  let selectedWorkspaceApp: UIWorkspaceApp | undefined

  let createAutomationModal: ModalAPI
  let webhookModal: ModalAPI

  let agentModal: AgentModal

  let typeFilter: HomeType = "all"
  let metrics: GetWorkspaceHomeMetricsResponse | null = null
  let metricsError = false

  $: favourites = workspaceFavouriteStore.lookup
  $: currentUserId = $auth.user?._id || ""

  const storageKey = (workspaceId: string) =>
    `budibase:workspaceHome:type:${workspaceId}`

  const readTypeFromUrl = (): HomeType | null => {
    if (typeof window === "undefined") {
      return null
    }
    const params = new URLSearchParams(window.location.search)
    const type = params.get("type")

    if (type === "all" || type === "app" || type === "automation") {
      return type
    }
    if (type === "agent" && $featureFlags.AI_AGENTS) {
      return type
    }

    return null
  }

  const readTypeFromStorage = (workspaceId: string): HomeType | null => {
    if (typeof window === "undefined") {
      return null
    }
    const value = window.localStorage.getItem(storageKey(workspaceId))

    if (value === "all" || value === "app" || value === "automation") {
      return value
    }
    if (value === "agent" && $featureFlags.AI_AGENTS) {
      return value
    }

    return null
  }

  const persistType = (workspaceId: string, value: HomeType) => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem(storageKey(workspaceId), value)
  }

  const setTypeFilter = (value: HomeType) => {
    const workspaceId = $appStore.appId
    if (!workspaceId) {
      typeFilter = value
      return
    }
    typeFilter = value
    persistType(workspaceId, value)
  }

  const getFavourite = (
    resourceType: WorkspaceResource,
    resourceId: string
  ): WorkspaceFavourite => {
    const existing = $favourites?.[resourceId]
    if (existing) {
      return existing
    }
    return {
      resourceType,
      resourceId,
      createdBy: currentUserId,
    }
  }

  const createApp = () => {
    selectedWorkspaceApp = undefined
    workspaceAppModal.show()
  }

  const openApp = (app: UIWorkspaceApp) => {
    selectedWorkspaceApp = app
    workspaceAppModal.show()
  }

  const createAutomation = () => {
    createAutomationModal?.show()
  }

  const createAgent = () => {
    agentModal?.show()
  }

  const openRow = (row: HomeRow) => {
    if (row.type === "app") {
      openApp(row.resource)
      return
    }
    if (row.type === "automation") {
      $goto($url(`../automation/${row.id}`))
      return
    }
    $goto($url(`../agent/${row.id}/config`))
  }

  const loadMetrics = async () => {
    metricsError = false
    try {
      metrics = await API.workspaceHome.getMetrics()
    } catch (err) {
      console.error(err)
      metricsError = true
      metrics = null
    }
  }

  const mapApps = (apps: UIWorkspaceApp[]): AppRow[] =>
    apps.map(app => ({
      id: app._id as string,
      name: app.name,
      type: "app",
      status: app.publishStatus.state,
      updatedAt: app.updatedAt,
      resource: app,
      favourite: getFavourite(
        WorkspaceResource.WORKSPACE_APP,
        app._id as string
      ),
    }))

  const mapAutomations = (automations: UIAutomation[]): AutomationRow[] =>
    automations.map(automation => ({
      id: automation._id as string,
      name: automation.name,
      type: "automation",
      status: automation.publishStatus.state,
      updatedAt: automation.updatedAt,
      resource: automation,
      favourite: getFavourite(
        WorkspaceResource.AUTOMATION,
        automation._id as string
      ),
    }))

  const mapAgents = (agents: Agent[]): AgentRow[] =>
    agents.map(agent => ({
      id: agent._id as string,
      name: agent.name,
      type: "agent",
      live: agent.live === true,
      updatedAt: agent.updatedAt,
      resource: agent,
      favourite: getFavourite(WorkspaceResource.AGENT, agent._id as string),
    }))

  const sortRows = (rows: HomeRow[]) =>
    rows.sort((a, b) => {
      const aIsFav = !!a.favourite._id
      const bIsFav = !!b.favourite._id

      if (aIsFav !== bIsFav) {
        return bIsFav ? 1 : -1
      }

      if (a.updatedAt && b.updatedAt) {
        return b.updatedAt.localeCompare(a.updatedAt)
      }

      return a.name.localeCompare(b.name)
    })

  $: allRows = sortRows([
    ...mapApps($workspaceAppStore.workspaceApps),
    ...mapAutomations($automationStore.automations),
    ...($featureFlags.AI_AGENTS ? mapAgents($agentsStore.agents) : []),
  ])

  $: filteredRows = allRows.filter(row => {
    if (typeFilter === "all") {
      return true
    }
    return row.type === typeFilter
  })

  const typeOptions = (agentsEnabled: boolean) => {
    const options: { label: string; value: HomeType }[] = [
      { label: "All", value: "all" },
      { label: "Apps", value: "app" },
      { label: "Automations", value: "automation" },
    ]

    if (agentsEnabled) {
      options.push({ label: "Agents", value: "agent" })
    }

    return options
  }

  onMount(async () => {
    const workspaceId = $appStore.appId
    if (!workspaceId) {
      return
    }

    if (!$featureFlags[FeatureFlag.WORKSPACE_HOME]) {
      $goto($url("../design"))
      return
    }

    const typeFromUrl = readTypeFromUrl()
    if (typeFromUrl) {
      setTypeFilter(typeFromUrl)
    } else {
      const fromStorage = readTypeFromStorage(workspaceId)
      if (fromStorage) {
        typeFilter = fromStorage
      }
    }

    if ($featureFlags.AI_AGENTS) {
      await agentsStore.fetchAgents()
    } else if (typeFilter === "agent") {
      typeFilter = "all"
      persistType(workspaceId, "all")
    }

    await loadMetrics()
  })
</script>

<div class="workspace-home">
  <div class="content">
    <div class="header">
      <div class="title">
        <Heading size="L">Home</Heading>
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          Everything in this workspace.
        </Body>
      </div>

      <div class="actions">
        <Button cta icon="plus" on:click={createApp}>New app</Button>
        <Button cta icon="plus" on:click={createAutomation}
          >New automation</Button
        >

        {#if $featureFlags.AI_AGENTS}
          <Button cta icon="plus" on:click={createAgent}>
            New agent
            <span class="beta-tag"><Tag emphasized>Beta</Tag></span>
          </Button>
        {/if}
      </div>
    </div>

    <div class="metrics">
      <DashCard title="Total users" action={undefined} actionIcon={undefined}>
        <Heading size="L">{metrics ? metrics.totalUsers : "—"}</Heading>
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          In this workspace
        </Body>
      </DashCard>

      <DashCard
        title="Automation runs (this month)"
        action={undefined}
        actionIcon={undefined}
      >
        <Heading size="L">
          {metrics ? metrics.automationRunsThisMonth : "—"}
        </Heading>
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          UTC month-to-date
        </Body>
      </DashCard>

      <DashCard
        title="Agent actions (this month)"
        action={undefined}
        actionIcon={undefined}
      >
        <Heading size="L"
          >{metrics ? metrics.agentActionsThisMonth : "—"}</Heading
        >
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          Agent step executions
        </Body>
      </DashCard>
    </div>

    {#if metricsError}
      <div class="metrics-error">
        <Body size="S" color="var(--spectrum-global-color-static-red-600)">
          Failed to load workspace metrics.
        </Body>
      </div>
    {/if}

    <div class="filters">
      {#each typeOptions($featureFlags.AI_AGENTS) as option}
        <ActionButton
          quiet
          selected={option.value === typeFilter}
          on:click={() => setTypeFilter(option.value)}
        >
          {option.label}
        </ActionButton>
      {/each}
    </div>

    <div class="table">
      <div class="table-header">
        <span>Name</span>
        <span>Type</span>
        <span>Status</span>
        <span>Last updated</span>
        <span></span>
      </div>

      <div class="table-body" class:empty={!filteredRows.length}>
        {#each filteredRows as row}
          <button
            class="row"
            type="button"
            class:favourite={row.favourite?._id}
            on:click={() => openRow(row)}
          >
            <span class="name">{row.name}</span>

            <span class="type">
              {#if row.type === "app"}
                App
              {:else if row.type === "automation"}
                Automation
              {:else}
                Agent
              {/if}
            </span>

            <span class="status">
              {#if row.type === "app" || row.type === "automation"}
                <PublishStatusBadge status={row.status} />
              {:else}
                <Tag emphasized={row.live}>
                  {row.live ? "Live" : "Draft"}
                </Tag>
              {/if}
            </span>

            <span class="updated">
              {#if row.updatedAt}
                {Helpers.getDateDisplayValue(row.updatedAt)}
              {:else}
                —
              {/if}
            </span>

            <span class="row-actions">
              <FavouriteResourceButton favourite={row.favourite} noWrap />
            </span>
          </button>
        {/each}

        {#if !filteredRows.length}
          <div class="empty">
            <Body size="M" color="var(--spectrum-global-color-gray-700)">
              Nothing here yet.
            </Body>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<WorkspaceAppModal
  bind:this={workspaceAppModal}
  workspaceApp={selectedWorkspaceApp}
  on:hide={() => (selectedWorkspaceApp = undefined)}
/>

<Modal bind:this={createAutomationModal}>
  <CreateAutomationModal {webhookModal} />
</Modal>
<Modal bind:this={webhookModal}>
  <CreateWebhookModal />
</Modal>

{#if $featureFlags.AI_AGENTS}
  <AgentModal bind:this={agentModal} />
{/if}

<style>
  .workspace-home {
    background: var(--background);
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    overflow-y: auto;
    padding: 0 var(--spacing-l);
    box-sizing: border-box;
  }

  .content {
    width: 100%;
    max-width: 1400px;
    padding: var(--spacing-xl) 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-l);
  }

  .actions {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }

  .beta-tag {
    margin-left: var(--spacing-xs);
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--spacing-l);
  }

  .metrics-error {
    padding: var(--spacing-s) var(--spacing-m);
    border-radius: 8px;
    background: var(--spectrum-global-color-gray-100);
  }

  .filters {
    display: flex;
    gap: var(--spacing-s);
  }

  .filters :global(.spectrum-ActionButton) {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 3px 10px;
    height: auto;
  }

  .table {
    --border: 1px solid var(--spectrum-global-color-gray-200);
    border: var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--spectrum-alias-background-color-primary);
  }

  .table-header {
    display: grid;
    grid-template-columns: 1fr 140px 180px 240px 60px;
    padding: 8px 12px;
    color: var(--spectrum-global-color-gray-700);
    border-bottom: var(--border);
  }

  .table-body {
    display: flex;
    flex-direction: column;
  }

  .row {
    border: none;
    background: transparent;
    text-align: left;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 140px 180px 240px 60px;
    padding: 10px 12px;
    border-bottom: var(--border);
    align-items: center;
    transition: background 130ms ease-out;
  }

  .row:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }

  .row:last-child {
    border-bottom: none;
  }

  .row-actions {
    display: flex;
    justify-content: flex-end;
  }

  .empty {
    padding: var(--spacing-l);
    display: flex;
    justify-content: center;
  }
</style>
