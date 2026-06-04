<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import DuplicateAutomationModal from "@/components/automation/AutomationPanel/DuplicateAutomationModal.svelte"
  import UpdateAutomationModal from "@/components/automation/AutomationPanel/UpdateAutomationModal.svelte"
  import WorkspaceAppModal from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte"
  import AgentModal from "@/pages/builder/workspace/[application]/agent/AgentModal.svelte"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import AssignPlaybookModal from "./_components/AssignPlaybookModal.svelte"
  import CreatePlaybookModal from "./_components/CreatePlaybookModal.svelte"
  import ExportPlaybookModal from "./_components/ExportPlaybookModal.svelte"
  import HomeControls from "./_components/HomeControls.svelte"
  import HomeMetrics from "./_components/HomeMetrics.svelte"
  import HomeTable from "./_components/HomeTable.svelte"
  import ImportPlaybookModal from "./_components/ImportPlaybookModal.svelte"
  import {
    appStore,
    automationStore,
    contextMenuStore,
    workspaceAppStore,
    workspaceFavouriteStore,
  } from "@/stores/builder"
  import { API } from "@/api"
  import {
    agentsStore,
    appsStore,
    auth,
    featureFlags,
    licensing,
    playbooksStore,
  } from "@/stores/portal"
  import EnterpriseBasicTrialBanner from "@/components/portal/licensing/EnterpriseBasicTrialBanner.svelte"
  import { getErrorMessage } from "@/helpers/errors"
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
    Notification,
    keepOpen,
    notifications,
    PopoverAlignment,
    Select,
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
    type PlaybookResponse,
    PublishResourceState,
    type Agent,
    type Table,
    type WorkspaceFavourite,
    type WorkspaceResource,
  } from "@budibase/types"
  import CreateTableModal from "@/components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import { getHomeTypeIcon, getHomeTypeIconColor } from "./_components/rows"
  import { goto as gotoStore, url as urlStore } from "@roxi/routify"
  import { onMount } from "svelte"
  import {
    buildHomeRows,
    filterHomeRows,
    sortHomeRows,
  } from "./_components/rows"

  import UpdateAgentModal from "../_components/UpdateAgentModal.svelte"

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
  let selectedRow: HomeRow | null = null

  let createPlaybookModal: ModalAPI
  let assignPlaybookModal: ModalAPI
  let exportPlaybookModal: ModalAPI
  let importPlaybookModal: ModalAPI
  let createPlaybookModalKey = 0
  let exportPlaybookModalKey = 0
  let importPlaybookModalKey = 0

  let typeFilter: HomeType = "all"
  let selectedPlaybookId = ""
  let searchTerm = ""
  let metrics: GetWorkspaceHomeMetricsResponse | null = null

  let sortColumn: HomeSortColumn = "updated"
  let sortOrder: HomeSortOrder = "desc"

  let highlightedRowId: string | null = null

  let hasMounted = false

  const favourites = workspaceFavouriteStore.lookup
  $: currentUserId = $auth.user?._id || ""
  $: playbooksEnabled = $featureFlags[FeatureFlag.PLAYBOOKS]
  $: if (!playbooksEnabled && selectedPlaybookId) selectedPlaybookId = ""

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
    if (value === "agent") {
      return value
    }
    return null
  }

  const normaliseSortColumn = (value: string | null): HomeSortColumn | null => {
    if (!value) {
      return null
    }
    if (value === "created") {
      return "updated"
    }
    if (
      value === "name" ||
      value === "type" ||
      value === "status" ||
      value === "updated"
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
        type: null as HomeType | null,
        playbook: "",
        sort: null as HomeSortColumn | null,
        order: null as HomeSortOrder | null,
      }
    }
    const params = new URLSearchParams(window.location.search)
    const q = params.get("q") ?? ""
    const type = normaliseType(params.get("type"))
    const playbook = params.get("playbook") ?? ""
    const sort = normaliseSortColumn(params.get("sort"))
    const order = normaliseSortOrder(params.get("order"))
    return { q, type, playbook, sort, order }
  }

  const writeUrlState = () => {
    if (!hasMounted || typeof window === "undefined") {
      return
    }

    const params = new URLSearchParams(window.location.search)

    params.delete("create")
    const q = searchTerm.trim()
    if (!q) {
      params.delete("q")
    } else {
      params.set("q", q)
    }

    if (typeFilter === "all") {
      params.delete("type")
    } else {
      params.set("type", typeFilter)
    }

    if (!playbooksEnabled || !selectedPlaybookId) {
      params.delete("playbook")
    } else {
      params.set("playbook", selectedPlaybookId)
    }

    const defaultSortColumn: HomeSortColumn = "updated"
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

  const setTypeFilter = (value: string) => {
    const normalised = normaliseType(value)
    if (!normalised) {
      return
    }
    typeFilter = normalised
  }

  const openPrimaryCreate = () => {
    switch (typeFilter) {
      case "automation":
        return createAutomation()
      case "agent":
        return createAgent()
      case "app":
      case "all":
      default:
        return createApp()
    }
  }

  const setSort = (column: HomeSortColumn) => {
    if (sortColumn === column) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc"
      return
    }
    sortColumn = column
    sortOrder = column === "updated" ? "desc" : "asc"
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

  const createPlaybook = () => {
    createPlaybookModalKey += 1
    createPlaybookModal?.show()
  }

  const exportPlaybook = () => {
    exportPlaybookModalKey += 1
    exportPlaybookModal?.show()
  }

  const importPlaybook = () => {
    importPlaybookModalKey += 1
    importPlaybookModal?.show()
  }

  const goToCreate = (target: "data/new" | "apis/new") => {
    goto(url(`../${target}`))
  }

  const handleTableSave = async (table: Table) => {
    notifications.success("Table created successfully")
    goto(url(`../data/table/${table._id}`))
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
    } catch (error) {
      let message = "Error deleting app"
      const errorMessage = getErrorMessage(error)
      if (errorMessage) {
        message += ` - ${errorMessage}`
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

  const assignPlaybook = async (playbookId: string | undefined) => {
    if (!playbooksEnabled || !selectedRow) {
      return keepOpen
    }

    try {
      if (selectedRow.type === "app") {
        await workspaceAppStore.edit({
          ...selectedRow.resource,
          playbookId,
        })
      } else if (selectedRow.type === "automation") {
        await automationStore.actions.save({
          ...selectedRow.resource,
          playbookId,
        })
      } else if (selectedRow.type === "agent") {
        await agentsStore.updateAgent({
          ...selectedRow.resource,
          playbookId,
        })
      }

      notifications.success("Playbook updated successfully")
      assignPlaybookModal?.hide()
    } catch (error) {
      console.error(error)
      notifications.error("Unable to update playbook")
      return keepOpen
    }
  }

  const handleCreatePlaybook = async (
    playbook: Pick<PlaybookResponse, "name" | "description" | "color">
  ) => {
    try {
      await playbooksStore.create(playbook)
      notifications.success("Playbook created successfully")
      createPlaybookModal?.hide()
    } catch (error) {
      console.error(error)
      notifications.error("Unable to create playbook")
      return keepOpen
    }
  }

  const handleExportPlaybook = async ({
    id,
    encryptPassword,
  }: {
    id: string
    encryptPassword?: string
  }) => {
    try {
      await playbooksStore.exportPlaybook(id, { encryptPassword })
      exportPlaybookModal?.hide()
    } catch (error) {
      console.error(error)
      notifications.error(getErrorMessage(error) || "Unable to export playbook")
      return keepOpen
    }
  }

  const notifyImportFollowUps = (
    response: Awaited<ReturnType<typeof playbooksStore.importPlaybook>>
  ) => {
    if (response.requirements.length) {
      const names = response.requirements
        .map(requirement => requirement.name)
        .join(", ")
      notifications.warning(`Some imported resources need secrets: ${names}`)
    }

    if (response.unsupportedContent.length) {
      const summary = response.unsupportedContent
        .map(item => `${item.count} ${item.type}`)
        .join(", ")
      notifications.warning(
        `Some Playbook content was not imported: ${summary}`
      )
    }
  }

  const handleImportPlaybook = async ({
    file,
    encryptPassword,
  }: {
    file: File
    encryptPassword?: string
  }) => {
    try {
      const response = await playbooksStore.importPlaybook(file, {
        encryptPassword,
      })
      await Promise.all([appStore.refresh(), loadMetrics()])
      importPlaybookModal?.hide()
      notifications.success(`Imported playbook '${response.playbook.name}'`)
      notifyImportFollowUps(response)
    } catch (error) {
      console.error(error)
      notifications.error(getErrorMessage(error) || "Unable to import playbook")
      return keepOpen
    }
  }

  const getContextMenuItemsForRow = (row: HomeRow) => {
    if (row.type === "app") {
      const workspaceApp = row.resource
      const liveUrl = buildLiveWorkspaceAppUrl(workspaceApp)

      const pause = {
        icon: workspaceApp.disabled ? "play-circle" : "stop",
        name: workspaceApp.disabled ? "Set live" : "Stop",
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
          icon: "stack",
          name: "Assign playbook",
          visible: playbooksEnabled,
          callback: () => assignPlaybookModal.show(),
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
        icon: automation.disabled ? "play-circle" : "stop",
        name: automation.disabled ? "Set live" : "Stop",
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
          icon: "stack",
          name: "Assign playbook",
          visible: playbooksEnabled,
          callback: () => assignPlaybookModal.show(),
        },
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
      return [
        {
          icon: "pencil",
          name: "Edit",
          visible: true,
          callback: () => updateAgentModal.show(),
        },
        {
          icon: "stack",
          name: "Assign playbook",
          visible: playbooksEnabled,
          callback: () => assignPlaybookModal.show(),
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
    selectedRow = row

    highlightedRowId = row._id

    if (row.type === "app") {
      selectedWorkspaceApp = row.resource
    } else if (row.type === "automation") {
      selectedAutomation = row.resource
    } else if (row.type === "agent") {
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
    getFavourite,
  })

  $: playbookLookup = (
    playbooksEnabled
      ? Object.fromEntries(
          $playbooksStore.map(playbook => [playbook._id, playbook])
        )
      : {}
  ) as Record<string, PlaybookResponse>
  $: selectedPlaybookName = selectedPlaybookId
    ? playbookLookup[selectedPlaybookId]?.name || ""
    : ""
  $: if (
    playbooksEnabled &&
    selectedPlaybookId &&
    playbooksStore.hasFetched() &&
    !playbookLookup[selectedPlaybookId]
  ) {
    selectedPlaybookId = ""
  }

  $: playbookOptions = [
    { label: "All", value: "", color: undefined },
    ...($playbooksStore || []).map(playbook => ({
      label: playbook.name,
      value: playbook._id,
      color: playbook.color,
    })),
  ]

  $: rowsWithPlaybooks = baseRows.map(row => {
    const playbook = row.playbookId ? playbookLookup[row.playbookId] : undefined
    return {
      ...row,
      playbookName: playbook?.name,
      playbookColor: playbook?.color,
    }
  })

  $: allRows = sortHomeRows(rowsWithPlaybooks, { sortColumn, sortOrder })

  $: filteredRows = filterHomeRows({
    rows: allRows,
    typeFilter,
    searchTerm,
  }).filter(
    row =>
      !playbooksEnabled ||
      !selectedPlaybookId ||
      row.playbookId === selectedPlaybookId
  )
  $: targetApp = $appsStore.apps.find(app => app.devId === $appStore.appId)
  $: automationErrorEntries = Object.entries(targetApp?.automationErrors || {})
    .filter(([, logIds]) => logIds.length > 0)
    .map(([automationId, logIds]) => ({
      automationId,
      errorCount: logIds.length,
      automation: $automationStore.automations.find(
        automation => automation._id === automationId
      ),
    }))

  $: showHeaderActions = $licensing.showTrialBanner
  $: budibaseAICreditLimit =
    $licensing.license?.quotas?.usage.monthly.budibaseAICredits?.value
  $: showBudibaseAIMetric =
    budibaseAICreditLimit != null && budibaseAICreditLimit !== 0

  $: if (hasMounted) writeUrlState()

  const goToAutomationError = (automationId: string) => {
    goto(url(`../automation/${automationId}`))
  }

  const dismissAutomationError = async (automationId: string) => {
    try {
      await automationStore.actions.clearLogErrors({
        automationId,
        appId: $appStore.appId,
      })
      await appsStore.load()
    } catch (err) {
      console.error(err)
      notifications.error("Error dismissing automation error")
    }
  }

  const automationErrorMessage = (
    automationName: string | undefined,
    errorCount: number
  ) => {
    const name = automationName || "Automation"
    return `${name} - Automation error${errorCount > 1 ? ` (${errorCount})` : ""}`
  }

  onMount(async () => {
    const workspaceId = $appStore.appId
    if (!workspaceId) {
      return
    }

    const { q, type, playbook, sort, order } = readUrlState()
    if (q) {
      searchTerm = q
    }
    if (type) {
      typeFilter = type
    }
    if (playbook) {
      selectedPlaybookId = playbook
    }
    if (sort) {
      sortColumn = sort
    }
    if (order) {
      sortOrder = order
    }

    hasMounted = true
    writeUrlState()

    await Promise.all([
      agentsStore.fetchAgents(),
      playbooksEnabled ? playbooksStore.fetch() : Promise.resolve(),
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
          >{$appStore.name || "Workspace"}</Body
        >
      </div>

      {#if showHeaderActions}
        <div class="header-actions">
          <EnterpriseBasicTrialBanner show={$licensing.showTrialBanner} />
        </div>
      {/if}
    </div>

    {#if automationErrorEntries.length}
      <div class="automation-errors">
        {#each automationErrorEntries as entry (entry.automationId)}
          <Notification
            wide
            dismissable
            type="error"
            icon="Alert"
            action={() => goToAutomationError(entry.automationId)}
            actionMessage={entry.errorCount > 1 ? "View errors" : "View error"}
            message={automationErrorMessage(
              entry.automation?.name,
              entry.errorCount
            )}
            on:dismiss={() => dismissAutomationError(entry.automationId)}
          />
        {/each}
      </div>
    {/if}

    <HomeMetrics {metrics} {showBudibaseAIMetric} />

    <div class="controls-row">
      <HomeControls
        {typeFilter}
        on:typeChange={({ detail }) => setTypeFilter(detail)}
      />
      <div class="controls-right">
        {#if playbooksEnabled && $playbooksStore.length}
          <div class="playbook-filter">
            <Select
              placeholder="Playbook"
              bind:value={selectedPlaybookId}
              options={playbookOptions}
              getOptionLabel={option => option.label}
              getOptionValue={option => option.value}
              getOptionColour={option => option.color}
            />
          </div>
        {/if}
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

          {#if playbooksEnabled}
            <MenuSeparator />
            <MenuItem icon="stack" on:click={createPlaybook}>Playbook</MenuItem>
            <MenuItem icon="upload-simple" on:click={importPlaybook}>
              Import playbook
            </MenuItem>
            <MenuItem
              icon="download-simple"
              on:click={exportPlaybook}
              disabled={!$playbooksStore.length}
            >
              Export playbook
            </MenuItem>
          {/if}

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
      {playbooksEnabled}
      {selectedPlaybookName}
      {sortColumn}
      {sortOrder}
      {highlightedRowId}
      on:create={() => openPrimaryCreate()}
      on:openRow={({ detail }) => openRow(detail)}
      on:openContextMenu={({ detail }) => openHomeContextMenu(detail)}
      on:clearSearch={() => (searchTerm = "")}
      on:resetFilters={() => {
        typeFilter = "all"
        selectedPlaybookId = ""
      }}
      on:sortChange={({ detail }) => setSort(detail)}
      on:createAgent={createAgent}
      on:createAutomation={createAutomation}
      on:createApp={createApp}
    />
  </div>
</div>

{#if playbooksEnabled}
  <Modal bind:this={createPlaybookModal}>
    {#key createPlaybookModalKey}
      <CreatePlaybookModal onConfirm={handleCreatePlaybook} />
    {/key}
  </Modal>

  <Modal bind:this={assignPlaybookModal}>
    <AssignPlaybookModal
      row={selectedRow}
      playbooks={$playbooksStore}
      onConfirm={assignPlaybook}
    />
  </Modal>

  <Modal bind:this={exportPlaybookModal}>
    {#key exportPlaybookModalKey}
      <ExportPlaybookModal
        playbooks={$playbooksStore}
        {selectedPlaybookId}
        onConfirm={handleExportPlaybook}
      />
    {/key}
  </Modal>

  <Modal bind:this={importPlaybookModal}>
    {#key importPlaybookModalKey}
      <ImportPlaybookModal onConfirm={handleImportPlaybook} />
    {/key}
  </Modal>
{/if}

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

<AgentModal bind:this={agentModal} />

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

{#if selectedAgent}
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

  .automation-errors {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
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

  .controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m) var(--spacing-l);
    flex-wrap: wrap;
    position: relative;
  }

  .controls-row .controls-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    margin-left: auto;
    flex-shrink: 0;
    justify-content: flex-end;
  }

  .controls-row .playbook-filter {
    flex: 0 0 auto;
    width: 140px;
  }

  .controls-row .search-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    padding: var(--spacing-xs) var(--spacing-s);
    min-width: 140px;
    height: 32px;
    box-sizing: border-box;
    flex: 1 1 160px;
    max-width: 240px;
  }

  .controls-row .search-input {
    background: transparent;
    border: none;
    outline: none;
    flex: 1;
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-900);
  }

  .controls-row .search-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .create-popover-container {
    position: absolute;
  }

  .create-popover-container :global(.spectrum-Popover) {
    min-width: 240px;
    border-radius: var(--border-radius-s);
    background: var(--background);
    border: 1px solid var(--spectrum-global-color-gray-200);
    padding: var(--spacing-xs);
    margin-top: var(--spacing-xs);
  }

  @media (max-width: 1080px) {
    .controls-row .controls-right {
      width: 100%;
      margin-left: 0;
      flex-shrink: 1;
      justify-content: flex-end;
    }

    .controls-row .search-wrapper {
      max-width: none;
    }
  }

  @media (max-width: 720px) {
    .controls-row .controls-right {
      flex-direction: column;
      align-items: stretch;
    }

    .controls-row .search-wrapper {
      width: 100%;
    }

    .controls-row .create-menu-control {
      width: 100%;
    }

    .controls-row .create-menu-control :global(button) {
      width: 100%;
    }
  }

  .create-popover-container :global(.spectrum-Menu) {
    background: transparent;
    padding: 0;
  }

  .create-popover-container :global(.spectrum-Menu-item) {
    border-radius: var(--border-radius-s);
    margin: 0;
  }

  .create-popover-container :global(.spectrum-Menu-item:hover) {
    background: var(--spectrum-global-color-gray-200);
  }

  .create-popover-container
    :global(.spectrum-Menu-item)
    :global(.spectrum-Menu-itemLabel) {
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-800);
  }

  .create-popover-container :global(.spectrum-Menu-divider) {
    margin: var(--spacing-xs) 0;
    background: var(--spectrum-global-color-gray-200);
  }
</style>
