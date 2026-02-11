<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import DuplicateAutomationModal from "@/components/automation/AutomationPanel/DuplicateAutomationModal.svelte"
  import UpdateAutomationModal from "@/components/automation/AutomationPanel/UpdateAutomationModal.svelte"
  import WorkspaceAppModal from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte"
  import AgentModal from "@/pages/builder/workspace/[application]/agent/AgentModal.svelte"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import HomeControls from "./_components/HomeControls.svelte"
  import HomeMetrics from "./_components/HomeMetrics.svelte"
  import HomeTable from "./_components/HomeTable.svelte"
  import {
    appStore,
    automationStore,
    contextMenuStore,
    workspaceAppStore,
    workspaceFavouriteStore,
  } from "@/stores/builder"
  import { API } from "@/api"
  import { agentsStore, auth, featureFlags } from "@/stores/portal"
  import { buildLiveUrl } from "@/helpers/urls"
  import {
    ActionMenu,
    Body,
    Button,
    Icon,
    MenuItem,
    MenuSeparator,
    Modal,
    type ModalAPI,
    notifications,
    PopoverAlignment,
    Tag,
  } from "@budibase/bbui"
  import {
    FeatureFlag,
    type GetWorkspaceHomeMetricsResponse,
    type UIAutomation,
    type UIWorkspaceApp,
    type HomeRow,
    type HomeSortColumn,
    type HomeSortOrder,
    type HomeType,
    PublishResourceState,
    type Agent,
    type Table,
    type WorkspaceFavourite,
    type WorkspaceResource,
  } from "@budibase/types"
  import CreateTableModal from "@/components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import { getHomeTypeIcon, getHomeTypeIconColor } from "./_components/rows"
  import {
    beforeUrlChange,
    goto as gotoStore,
    url as urlStore,
  } from "@roxi/routify"
  import { onMount } from "svelte"
  import {
    buildHomeRows,
    filterHomeRows,
    sortHomeRows,
  } from "./_components/rows"

  import UpdateAgentModal from "../_components/UpdateAgentModal.svelte"

  type HomeCreate = "app" | "automation" | "agent"

  $beforeUrlChange

  $: goto = $gotoStore
  $: url = $urlStore

  let workspaceAppModal: WorkspaceAppModal
  let selectedWorkspaceApp: UIWorkspaceApp | undefined

  let confirmDeleteWorkspaceAppDialog: Pick<ModalAPI, "show" | "hide">
  let isDuplicatingWorkspaceApp = false

  let createAutomationModal: ModalAPI
  let webhookModal: ModalAPI

  let selectedAutomation: UIAutomation | undefined
  let updateAutomationModal: Pick<ModalAPI, "show" | "hide">
  let duplicateAutomationModal: ModalAPI
  let confirmDeleteAutomationDialog: Pick<ModalAPI, "show" | "hide">

  let agentModal: AgentModal

  let createTableModal: ModalAPI
  let tableName = ""

  let selectedAgent: Agent | undefined
  let updateAgentModal: Pick<ModalAPI, "show" | "hide">
  let confirmDeleteAgentDialog: Pick<ModalAPI, "show" | "hide">

  let typeFilter: HomeType = "all"
  let searchTerm = ""
  let metrics: GetWorkspaceHomeMetricsResponse | null = null

  let sortColumn: HomeSortColumn = "created"
  let sortOrder: HomeSortOrder = "desc"

  let highlightedRowId: string | null = null

  let hasMounted = false

  const favourites = workspaceFavouriteStore.lookup
  $: currentUserId = $auth.user?._id || ""

  let getFavourite: (
    _resourceType: WorkspaceResource,
    _resourceId: string
  ) => WorkspaceFavourite

  $: getFavourite = (resourceType, resourceId) => {
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

  const normaliseType = (value: string | null): HomeType | null => {
    if (!value) {
      return null
    }
    if (value === "all" || value === "app" || value === "automation") {
      return value
    }
    if (value === "agent" && $featureFlags.AI_AGENTS) {
      return value
    }
    return null
  }

  const normaliseCreate = (value: string | null): HomeCreate | null => {
    if (!value) {
      return null
    }
    if (value === "app" || value === "automation") {
      return value
    }
    if (value === "agent" && $featureFlags.AI_AGENTS) {
      return value
    }
    return null
  }

  const consumeCreateParam = (urlString?: string) => {
    if (typeof window === "undefined") {
      return
    }

    const parsed = new URL(urlString ?? window.location.href)
    const create = normaliseCreate(parsed.searchParams.get("create"))
    if (!create) {
      return
    }

    if (create === "automation") {
      createAutomation()
    } else if (create === "app") {
      createApp()
    } else if (create === "agent") {
      createAgent()
    }

    parsed.searchParams.delete("create")
    const query = parsed.searchParams.toString()
    history.replaceState(
      {},
      "",
      `${parsed.pathname}${query ? `?${query}` : ""}`
    )
  }

  const normaliseSortColumn = (value: string | null): HomeSortColumn | null => {
    if (!value) {
      return null
    }
    if (
      value === "name" ||
      value === "type" ||
      value === "status" ||
      value === "created"
    ) {
      return value
    }
    return null
  }

  const normaliseSortOrder = (value: string | null): HomeSortOrder | null => {
    if (value === "asc" || value === "desc") {
      return value
    }
    return null
  }

  const readUrlState = () => {
    if (typeof window === "undefined") {
      return {
        q: "",
        create: null as HomeCreate | null,
        sort: null as HomeSortColumn | null,
        order: null as HomeSortOrder | null,
      }
    }
    const params = new URLSearchParams(window.location.search)
    const q = params.get("q") ?? ""
    const sort = normaliseSortColumn(params.get("sort"))
    const order = normaliseSortOrder(params.get("order"))
    const create = normaliseCreate(params.get("create"))
    return { q, sort, order, create }
  }

  const writeUrlState = () => {
    if (!hasMounted || typeof window === "undefined") {
      return
    }

    const params = new URLSearchParams(window.location.search)

    params.delete("create")
    params.delete("type")

    const q = searchTerm.trim()
    if (!q) {
      params.delete("q")
    } else {
      params.set("q", q)
    }

    const defaultSortColumn: HomeSortColumn = "created"
    const defaultSortOrder: HomeSortOrder = "desc"
    const isDefaultSort =
      sortColumn === defaultSortColumn && sortOrder === defaultSortOrder
    if (isDefaultSort) {
      params.delete("sort")
      params.delete("order")
    } else {
      params.set("sort", sortColumn)
      params.set("order", sortOrder)
    }

    const query = params.toString()
    const next = `${window.location.pathname}${query ? `?${query}` : ""}`
    history.replaceState({}, "", next)
  }

  $beforeUrlChange((event: { url?: string } | undefined) => {
    if (typeof window === "undefined") {
      return true
    }

    const nextUrl = typeof event?.url === "string" ? event.url : ""
    if (!nextUrl) {
      return true
    }

    const parsed = new URL(nextUrl, window.location.origin)
    if (!parsed.pathname.endsWith("/home")) {
      return true
    }

    if (!parsed.searchParams.get("create")) {
      return true
    }

    setTimeout(() => {
      consumeCreateParam(parsed.toString())
    }, 0)
    return true
  })

  const setTypeFilter = (value: string) => {
    const normalised = normaliseType(value)
    if (!normalised) {
      return
    }
    typeFilter = normalised
  }

  const setSort = (column: HomeSortColumn) => {
    if (sortColumn === column) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc"
      return
    }
    sortColumn = column
    sortOrder = column === "created" ? "desc" : "asc"
  }

  const createApp = () => {
    selectedWorkspaceApp = undefined
    workspaceAppModal.show()
  }

  const createAutomation = () => {
    createAutomationModal?.show()
  }

  const createAgent = () => {
    agentModal?.show()
  }

  $: workspaceId = $appStore.appId

  const goToCreate = (target: string) => {
    if (!workspaceId) {
      return
    }
    const prefix = `/builder/workspace/${workspaceId}`
    const normalisedTarget = target.startsWith("/")
      ? target
      : `${prefix}/${target.replace(/^\.\//, "")}`
    goto(normalisedTarget)
  }

  const handleTableSave = async (table: Table) => {
    if (!workspaceId) {
      return
    }
    notifications.success("Table created successfully")
    goto(`/builder/workspace/${workspaceId}/data/table/${table._id}`)
  }

  const openCreateTable = () => {
    tableName = ""
    createTableModal?.show()
  }

  const buildLiveWorkspaceAppUrl = (workspaceApp?: UIWorkspaceApp | null) => {
    if (
      !workspaceApp ||
      workspaceApp.publishStatus?.state !== PublishResourceState.PUBLISHED ||
      workspaceApp.disabled
    ) {
      return null
    }

    const liveUrl = buildLiveUrl($appStore, workspaceApp.url ?? "", true)

    return liveUrl || null
  }

  const openLiveWorkspaceApp = (liveUrl: string | null) => {
    if (!liveUrl || typeof window === "undefined") {
      return
    }
    window.open(liveUrl, "_blank", "noopener,noreferrer")
  }

  const duplicateWorkspaceApp = async (workspaceAppId: string) => {
    isDuplicatingWorkspaceApp = true
    try {
      await workspaceAppStore.duplicate(workspaceAppId)
    } catch (e) {
      notifications.error("Failed to duplicate app")
    } finally {
      isDuplicatingWorkspaceApp = false
    }
    await appStore.refresh()
  }

  const deleteWorkspaceApp = async () => {
    if (!selectedWorkspaceApp?._id || !selectedWorkspaceApp._rev) {
      return
    }

    try {
      await workspaceAppStore.delete(
        selectedWorkspaceApp._id,
        selectedWorkspaceApp._rev
      )
      notifications.success(
        `App '${selectedWorkspaceApp.name}' deleted successfully`
      )
    } catch (e: any) {
      let message = "Error deleting app"
      if (e.message) {
        message += ` - ${e.message}`
      }
      notifications.error(message)
    }
  }

  async function deleteAutomation() {
    if (!selectedAutomation) {
      return
    }
    try {
      await automationStore.actions.delete(selectedAutomation)
      notifications.success("Automation deleted successfully")
    } catch (error) {
      console.error(error)
      notifications.error("Error deleting automation")
    }
  }

  async function deleteAgent() {
    const selectedId = selectedAgent?._id
    if (!selectedId) {
      return
    }
    try {
      await agentsStore.deleteAgent(selectedId)
      notifications.success("Agent deleted successfully")
    } catch (error) {
      console.error(error)
      notifications.error("Error deleting agent")
    }
  }

  async function duplicateAgent() {
    const selectedId = selectedAgent?._id
    if (!selectedId) {
      return
    }
    try {
      await agentsStore.duplicateAgent(selectedId)
      notifications.success("Agent duplicated successfully")
    } catch (error) {
      console.error(error)
      notifications.error("Error duplicating agent")
    }
  }

  const getContextMenuItemsForRow = (row: HomeRow) => {
    if (row.type === "app") {
      const workspaceApp = row.resource
      const liveUrl = buildLiveWorkspaceAppUrl(workspaceApp)

      const pause = {
        icon: workspaceApp.disabled ? "play-circle" : "pause-circle",
        name: workspaceApp.disabled ? "Switch on" : "Switch off",
        visible: true,
        callback: async () => {
          await workspaceAppStore.toggleDisabled(
            workspaceApp._id!,
            !workspaceApp.disabled
          )
        },
      }

      return [
        {
          icon: "pencil",
          name: "Edit",
          visible: true,
          callback: () => {
            selectedWorkspaceApp = workspaceApp
            workspaceAppModal.show()
          },
        },
        {
          icon: "globe-simple",
          name: "View live app",
          visible: !!liveUrl,
          callback: () => openLiveWorkspaceApp(liveUrl),
        },
        pause,
        {
          icon: "trash",
          name: "Delete",
          visible: true,
          callback: () => confirmDeleteWorkspaceAppDialog.show(),
        },
        {
          icon: "copy",
          name: "Duplicate",
          visible: true,
          disabled: isDuplicatingWorkspaceApp,
          callback: () =>
            !isDuplicatingWorkspaceApp &&
            duplicateWorkspaceApp(workspaceApp._id as string),
        },
      ]
    }

    if (row.type === "automation") {
      const automation = row.resource
      const edit = {
        icon: "pencil",
        name: "Edit",
        visible: true,
        disabled: !automation.definition.trigger,
        callback: () => updateAutomationModal.show(),
      }

      const pause = {
        icon: automation.disabled ? "play-circle" : "pause-circle",
        name: automation.disabled ? "Switch on" : "Switch off",
        keyBind: null,
        visible: true,
        disabled: !automation.definition.trigger,
        callback: async () => {
          await automationStore.actions.toggleDisabled(automation._id!)
        },
      }

      return [
        edit,
        {
          icon: "copy",
          name: "Duplicate",
          visible: true,
          callback: () => duplicateAutomationModal?.show(),
          tooltip:
            automation.definition.trigger?.name === "Webhook"
              ? "Webhooks automations cannot be duplicated"
              : undefined,
        },
        pause,
        {
          icon: "trash",
          name: "Delete",
          visible: true,
          disabled: false,
          callback: () => confirmDeleteAutomationDialog.show(),
        },
      ]
    }

    if (row.type === "agent") {
      if (!$featureFlags.AI_AGENTS) {
        return []
      }
      return [
        {
          icon: "pencil",
          name: "Edit",
          visible: true,
          callback: () => updateAgentModal.show(),
        },
        {
          icon: "copy",
          name: "Duplicate",
          visible: true,
          callback: duplicateAgent,
        },
        {
          icon: "trash",
          name: "Delete",
          visible: true,
          disabled: false,
          callback: () => confirmDeleteAgentDialog.show(),
        },
      ]
    }

    return []
  }

  const openHomeContextMenu = ({
    row,
    x,
    y,
  }: {
    row: HomeRow
    x: number
    y: number
  }) => {
    selectedWorkspaceApp = undefined
    selectedAutomation = undefined
    selectedAgent = undefined

    highlightedRowId = row._id

    if (row.type === "app") {
      selectedWorkspaceApp = row.resource
    } else if (row.type === "automation") {
      selectedAutomation = row.resource
    } else if (row.type === "agent") {
      if (!$featureFlags.AI_AGENTS) {
        highlightedRowId = null
        return
      }
      selectedAgent = row.resource
    }

    contextMenuStore.open(
      "workspace-home",
      getContextMenuItemsForRow(row),
      { x, y },
      () => {
        highlightedRowId = null
      }
    )
  }

  const openRow = (row: HomeRow) => {
    if (row.type === "app") {
      goto(url(`../design/${row.id}`))
      return
    }
    if (row.type === "automation") {
      goto(url(`../automation/${row.id}`))
      return
    }
    if (row.type === "agent") {
      goto(url(`../agent/${row.id}/config`))
      return
    }
  }

  const loadMetrics = async () => {
    try {
      metrics = await API.workspaceHome.getMetrics()
    } catch (err) {
      console.error(err)
      metrics = null
    }
  }

  $: baseRows = buildHomeRows({
    apps: $workspaceAppStore.workspaceApps,
    automations: $automationStore.automations,
    agents: $agentsStore.agents,
    agentsEnabled: $featureFlags.AI_AGENTS,
    getFavourite,
  })

  $: allRows = sortHomeRows(baseRows, { sortColumn, sortOrder })

  $: filteredRows = filterHomeRows({ rows: allRows, typeFilter, searchTerm })

  $: if (hasMounted) writeUrlState()

  onMount(async () => {
    const workspaceId = $appStore.appId
    if (!workspaceId) {
      return
    }

    if (!$featureFlags[FeatureFlag.WORKSPACE_HOME]) {
      goto(url("../design"))
      return
    }

    const { q, sort, order } = readUrlState()
    if (q) {
      searchTerm = q
    }
    if (sort) {
      sortColumn = sort
    }
    if (order) {
      sortOrder = order
    }

    hasMounted = true
    consumeCreateParam()
    writeUrlState()

    await Promise.all([
      $featureFlags.AI_AGENTS ? agentsStore.fetchAgents() : Promise.resolve(),
      loadMetrics(),
    ])
  })
</script>

<div class="workspace-home">
  <div class="content">
    <div class="header">
      <div class="title">
        <Body
          size="M"
          weight="500"
          color="var(--spectrum-global-color-gray-900)"
          >{$appStore.name || "Workspace"} workspace</Body
        >
      </div>

      <div class="header-actions">
        <a href={url("../chat")} class="header-link header-link--with-icons">
          <Icon name="chat-circle" size="XS" color="#8CA171" weight="fill" />
          <Body size="S">Agent chat</Body>
          <Icon
            name="arrow-up-right"
            size="XS"
            color="var(--spectrum-global-color-gray-600)"
            weight="regular"
          />
        </a>
      </div>
    </div>

    <HomeMetrics {metrics} agentsEnabled={$featureFlags.AI_AGENTS} />

    <div class="controls-row">
      <HomeControls
        {typeFilter}
        agentsEnabled={$featureFlags.AI_AGENTS}
        on:typeChange={({ detail }) => setTypeFilter(detail)}
      />
      <div class="controls-right">
        <div class="search-wrapper">
          <Icon name="magnifying-glass" size="S" />
          <input
            class="search-input"
            type="text"
            placeholder="Search"
            bind:value={searchTerm}
          />
        </div>
        <div class="create-popover-container"></div>
        <ActionMenu
          align={PopoverAlignment.Right}
          portalTarget=".workspace-home .create-popover-container"
          animate={false}
        >
          <div slot="control" class="create-menu-control">
            <Button size="M" icon="plus" primary>Create</Button>
          </div>

          {#if $featureFlags.AI_AGENTS}
            <MenuItem
              icon={getHomeTypeIcon("agent")}
              iconColour={getHomeTypeIconColor("agent")}
              iconWeight="fill"
              on:click={createAgent}
            >
              Agent
              <div slot="right">
                <Tag emphasized>Beta</Tag>
              </div>
            </MenuItem>
          {/if}
          <MenuItem
            icon={getHomeTypeIcon("automation")}
            iconColour={getHomeTypeIconColor("automation")}
            iconWeight="fill"
            on:click={createAutomation}
          >
            Automation
          </MenuItem>
          <MenuItem
            icon={getHomeTypeIcon("app")}
            iconColour={getHomeTypeIconColor("app")}
            iconWeight="fill"
            on:click={createApp}
          >
            App
          </MenuItem>

          <MenuSeparator />
          <MenuItem icon="cube" on:click={() => goToCreate("data/new")}>
            Connection
          </MenuItem>
          <MenuItem icon="grid-nine" on:click={openCreateTable}>Table</MenuItem>
          <MenuItem icon="globe-simple" on:click={() => goToCreate("apis/new")}>
            API request
          </MenuItem>
        </ActionMenu>
      </div>
    </div>

    <HomeTable
      rows={filteredRows}
      allRowsCount={allRows.length}
      {typeFilter}
      {searchTerm}
      {sortColumn}
      {sortOrder}
      {highlightedRowId}
      on:openRow={({ detail }) => openRow(detail)}
      on:openContextMenu={({ detail }) => openHomeContextMenu(detail)}
      on:clearSearch={() => (searchTerm = "")}
      on:resetFilters={() => (typeFilter = "all")}
      on:sortChange={({ detail }) => setSort(detail)}
    />
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

<Modal bind:this={createTableModal} closeOnOutsideClick={false}>
  <CreateTableModal bind:name={tableName} afterSave={handleTableSave} />
</Modal>

{#if $featureFlags.AI_AGENTS}
  <AgentModal bind:this={agentModal} />
{/if}

<Modal bind:this={duplicateAutomationModal}>
  {#if selectedAutomation}
    <DuplicateAutomationModal
      automation={selectedAutomation}
      onDuplicateSuccess={() => duplicateAutomationModal.hide()}
    />
  {/if}
</Modal>

{#if selectedAutomation}
  <UpdateAutomationModal
    automation={selectedAutomation}
    bind:this={updateAutomationModal}
  />

  <ConfirmDialog
    bind:this={confirmDeleteAutomationDialog}
    okText="Delete Automation"
    onOk={deleteAutomation}
    title="Confirm Deletion"
  >
    Are you sure you wish to delete the automation
    <b>{selectedAutomation.name}?</b>
    This action cannot be undone.
  </ConfirmDialog>
{/if}

{#if selectedWorkspaceApp}
  <ConfirmDialog
    bind:this={confirmDeleteWorkspaceAppDialog}
    okText="Delete App"
    onOk={deleteWorkspaceApp}
    title="Confirm Deletion"
  >
    Deleting <b>{selectedWorkspaceApp.name}</b> cannot be undone. Are you sure?
  </ConfirmDialog>
{/if}

{#if $featureFlags.AI_AGENTS && selectedAgent}
  <UpdateAgentModal agent={selectedAgent} bind:this={updateAgentModal} />
  <ConfirmDialog
    bind:this={confirmDeleteAgentDialog}
    okText="Delete Agent"
    onOk={deleteAgent}
    title="Confirm Deletion"
  >
    Are you sure you wish to delete the agent
    <b>{selectedAgent.name}?</b>
    This action cannot be undone.
  </ConfirmDialog>
{/if}

<style>
  .workspace-home {
    background: var(--background-alt);
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    justify-content: center;
    overflow-y: auto;
    padding: 0 var(--spacing-l);
    box-sizing: border-box;
  }

  .content {
    width: 100%;
    max-width: 1200px;
    padding: var(--spacing-xl) 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--background-alt);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-l);
  }

  .header-actions {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
  }

  .header-link {
    text-decoration: none;
    color: var(--spectrum-global-color-gray-800);
    transition: color 130ms ease-out;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
  }

  .header-link:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .header-link--with-icons {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    position: relative;
    margin-bottom: -12px;
  }

  .controls-row .controls-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .controls-row .search-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    padding: 3px 8px;
    min-width: 200px;
    height: 32px;
    box-sizing: border-box;
  }

  .controls-row .search-input {
    background: transparent;
    border: none;
    outline: none;
    flex: 1;
    font-family: var(--font-sans);
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }

  .controls-row .search-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .controls-row .create-menu-control :global(button) {
    border-radius: 100px;
    padding: 7px 15px 8px;
    height: 32px;
    box-sizing: border-box;
  }

  .create-popover-container {
    position: absolute;
  }

  .create-popover-container :global(.spectrum-Popover) {
    min-width: 245px;
    border-radius: 6px !important;
    background: var(--background) !important;
    border: 1px solid var(--spectrum-global-color-gray-200) !important;
    padding: 4px !important;
    margin-top: 4px;
    margin-left: 2px;
  }

  .create-popover-container :global(.spectrum-Menu) {
    background: transparent;
    padding: 0;
  }

  .create-popover-container :global(.spectrum-Menu-item) {
    border-radius: 4px;
    margin: 0;
  }

  .create-popover-container :global(.spectrum-Menu-item:hover) {
    background: var(--spectrum-global-color-gray-200);
  }

  .create-popover-container
    :global(.spectrum-Menu-item)
    :global(.spectrum-Menu-itemLabel) {
    font-size: 13px;
    line-height: 17px;
    color: var(--spectrum-global-color-gray-800);
  }

  .create-popover-container :global(.spectrum-Menu-divider) {
    margin: 4px 0;
    background: var(--spectrum-global-color-gray-200);
  }
</style>
