<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import DuplicateAutomationModal from "@/components/automation/AutomationPanel/DuplicateAutomationModal.svelte"
  import UpdateAutomationModal from "@/components/automation/AutomationPanel/UpdateAutomationModal.svelte"
  import WorkspaceAppModal from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte"
  import AgentModal from "@/pages/builder/workspace/[application]/agent/AgentModal.svelte"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import AssignProjectModal from "@/components/projects/AssignProjectModal.svelte"
  import CreateProjectModal from "./_components/CreateProjectModal.svelte"
  import ExportProjectModal from "./_components/ExportProjectModal.svelte"
  import HomeControls from "./_components/HomeControls.svelte"
  import HomeCreateMenu from "./_components/HomeCreateMenu.svelte"
  import HomeHeaderActions from "./_components/HomeHeaderActions.svelte"
  import HomeMetrics from "./_components/HomeMetrics.svelte"
  import HomeProjectTabs from "./_components/HomeProjectTabs.svelte"
  import HomeResourcePanel from "./_components/HomeResourcePanel.svelte"
  import HomeTable from "./_components/HomeTable.svelte"
  import ImportProjectModal from "./_components/ImportProjectModal.svelte"
  import {
    appStore,
    automationStore,
    contextMenuStore,
    datasources,
    integrations,
    tables,
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
    projectsStore,
  } from "@/stores/portal"
  import { getErrorMessage } from "@/helpers/errors"
  import { buildLiveUrl } from "@/helpers/urls"
  import {
    Body,
    Icon,
    Modal,
    type ModalAPI,
    Notification,
    keepOpen,
    notifications,
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
    type ProjectFormPayload,
    type ProjectResponse,
    PublishResourceState,
    type Agent,
    type Table,
    type WorkspaceFavourite,
    type WorkspaceResource,
  } from "@budibase/types"
  import { integrationForDatasource } from "@/stores/selectors"
  import CreateTableModal from "@/components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import { goto as gotoStore, url as urlStore } from "@roxi/routify"
  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import {
    buildHomeRows,
    filterHomeRows,
    getTypeLabel,
    sortHomeRows,
  } from "./_components/rows"
  import {
    buildHomeUrl,
    normaliseHomeSortColumn,
    type HomeUrlState,
  } from "./_components/urlState"

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
  let createTableModalKey = 0

  let selectedAgent: Agent | undefined
  let updateAgentModal: Pick<ModalAPI, "show" | "hide">
  let confirmDeleteAgentDialog: Pick<ModalAPI, "show" | "hide">
  let selectedRow: HomeRow | null = null

  let createProjectModal: ModalAPI
  let editProjectModal: ModalAPI
  let confirmDeleteProjectDialog: Pick<ModalAPI, "show" | "hide">
  let assignProjectModal: ModalAPI
  let exportProjectModal: ModalAPI
  let importProjectModal: ModalAPI
  let createProjectModalKey = 0
  let editProjectModalKey = 0
  let exportProjectModalKey = 0
  let importProjectModalKey = 0

  let typeFilter: HomeType = "all"
  let selectedProjectId = ""
  let searchTerm = ""
  let metrics: GetWorkspaceHomeMetricsResponse | null = null

  let sortColumn: HomeSortColumn = "updated"
  let sortOrder: HomeSortOrder = "desc"

  let highlightedRowId: string | null = null

  let hasMounted = false
  let projectsRequestedForWorkspace = ""

  const favourites = workspaceFavouriteStore.lookup
  $: currentUserId = $auth.user?._id || ""
  $: projectsEnabled = $featureFlags[FeatureFlag.PROJECTS]
  $: initialProjectIds = selectedProjectId ? [selectedProjectId] : []
  $: selectedProjectResource = selectedRow
    ? {
        name: selectedRow.name,
        typeLabel: getTypeLabel(selectedRow.type),
        projectIds: selectedRow.projectIds,
      }
    : null
  $: if (!projectsEnabled && selectedProjectId) selectedProjectId = ""

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
    if (
      value === "all" ||
      value === "app" ||
      value === "automation" ||
      value === "agent" ||
      value === "data"
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
        project: "",
        sort: null as HomeSortColumn | null,
        order: null as HomeSortOrder | null,
      }
    }
    const params = new URLSearchParams(window.location.search)
    const q = params.get("q") ?? ""
    const type = normaliseType(params.get("type"))
    const project = params.get("project") ?? ""
    const sort = normaliseHomeSortColumn(params.get("sort"))
    const order = normaliseSortOrder(params.get("order"))
    return { q, type, project, sort, order }
  }

  const writeUrlState = (state: HomeUrlState) => {
    if (!hasMounted || typeof window === "undefined") {
      return
    }
    const next = buildHomeUrl(
      window.location.pathname,
      window.location.search,
      state
    )
    history.replaceState({}, "", next)
  }

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

  const createProject = () => {
    createProjectModalKey += 1
    createProjectModal?.show()
  }

  const editProject = () => {
    if (!selectedProject) {
      return
    }
    editProjectModalKey += 1
    editProjectModal?.show()
  }

  const exportProject = () => {
    exportProjectModalKey += 1
    exportProjectModal?.show()
  }

  const importProject = () => {
    importProjectModalKey += 1
    importProjectModal?.show()
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
    createTableModalKey += 1
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

  const CONTACT_SALES_URL = "https://budibase.com/contact/"

  const openContactSales = () => {
    window.open(CONTACT_SALES_URL, "_blank", "noopener,noreferrer")
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

  const assignProject = async (projectIds: string[] | undefined) => {
    if (!projectsEnabled || !selectedRow) {
      return keepOpen
    }

    try {
      if (selectedRow.type === "app") {
        const { resource } = selectedRow
        await workspaceAppStore.edit({
          _id: resource._id!,
          _rev: resource._rev!,
          name: resource.name,
          url: resource.url,
          navigation: resource.navigation,
          disabled: resource.disabled,
          isDefault: resource.isDefault,
          projectIds,
        })
      } else if (selectedRow.type === "automation") {
        const { resource } = selectedRow
        const { publishStatus: _publishStatus, ...automation } = resource
        await automationStore.actions.save(
          {
            ...automation,
            projectIds,
          },
          { skipUnpublishedChanges: true }
        )
      } else if (selectedRow.type === "agent") {
        const { resource } = selectedRow
        const { operations: _operations, ...agent } = resource
        await agentsStore.updateAgent({
          ...agent,
          projectIds,
        })
      } else if (selectedRow.type === "datasource") {
        const { resource } = selectedRow
        await datasources.save({
          datasource: {
            ...resource,
            projectIds,
          },
          integration: integrationForDatasource(get(integrations), resource),
          skipConnectionCheck: true,
        })
      } else if (selectedRow.type === "table") {
        const { resource } = selectedRow
        await tables.save({
          ...resource,
          projectIds,
        })
      }

      notifications.success("Projects updated successfully")
      assignProjectModal?.hide()

      try {
        await appStore.refresh()
      } catch (error) {
        console.error(error)
        notifications.warning(
          "Projects updated, but some resources could not be refreshed. Reload the workspace to see all changes."
        )
      }
    } catch (error) {
      console.error(error)
      notifications.error("Unable to update project")
      return keepOpen
    }
  }

  const handleCreateProject = async (project: ProjectFormPayload) => {
    try {
      const createdProject = await projectsStore.create(project)
      selectedProjectId = createdProject._id
      notifications.success("Project created successfully")
      createProjectModal?.hide()
    } catch (error) {
      console.error(error)
      notifications.error("Unable to create project")
      return keepOpen
    }
  }

  const handleUpdateProject = async (project: ProjectFormPayload) => {
    if (!selectedProject) {
      return keepOpen
    }

    try {
      await projectsStore.updateProject({
        _id: selectedProject._id,
        _rev: selectedProject._rev,
        ...project,
      })
      notifications.success("Project updated successfully")
      editProjectModal?.hide()
    } catch (error) {
      notifications.error(getErrorMessage(error) || "Unable to update project")
      return keepOpen
    }
  }

  const deleteProject = async () => {
    if (!selectedProject) {
      return
    }

    const projectName = selectedProject.name
    try {
      await projectsStore.deleteProject(
        selectedProject._id,
        selectedProject._rev
      )
      selectedProjectId = ""
      notifications.success(`Project '${projectName}' deleted successfully`)

      try {
        await appStore.refresh()
      } catch (error) {
        console.error(error)
        notifications.warning(
          "Project deleted, but some resources could not be refreshed. Reload the workspace to see all changes."
        )
      }
    } catch (error) {
      notifications.error(getErrorMessage(error) || "Unable to delete project")
    }
  }

  const handleExportProject = async ({
    id,
    encryptPassword,
  }: {
    id: string
    encryptPassword?: string
  }) => {
    try {
      await projectsStore.exportProject(id, { encryptPassword })
      exportProjectModal?.hide()
    } catch (error) {
      console.error(error)
      notifications.error(getErrorMessage(error) || "Unable to export project")
      return keepOpen
    }
  }

  const notifyImportFollowUps = (
    response: Awaited<ReturnType<typeof projectsStore.importProject>>
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
      notifications.warning(`Some Project content was not imported: ${summary}`)
    }
  }

  const handleImportProject = async ({
    file,
    encryptPassword,
  }: {
    file: File
    encryptPassword?: string
  }) => {
    try {
      const response = await projectsStore.importProject(file, {
        encryptPassword,
      })
      importProjectModal?.hide()
      notifications.success(`Imported project '${response.project.name}'`)
      notifyImportFollowUps(response)

      const refreshes = await Promise.allSettled([
        appStore.refresh(),
        loadMetrics(),
      ])
      if (refreshes.some(result => result.status === "rejected")) {
        notifications.warning(
          "Project imported, but some resources could not be refreshed. Reload the workspace to see all imported resources."
        )
      }
    } catch (error) {
      console.error(error)
      notifications.error(getErrorMessage(error) || "Unable to import project")
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
          name: "Assign project",
          visible: projectsEnabled,
          callback: () => assignProjectModal.show(),
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
          name: "Assign project",
          visible: projectsEnabled,
          callback: () => assignProjectModal.show(),
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
          name: "Assign project",
          visible: projectsEnabled,
          callback: () => assignProjectModal.show(),
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

    if (row.type === "datasource" || row.type === "table") {
      return [
        {
          icon: "arrow-square-out",
          name: "Open",
          visible: true,
          callback: () => openRow(row),
        },
        {
          icon: "stack",
          name: "Assign project",
          visible: projectsEnabled,
          callback: () => assignProjectModal.show(),
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
    if (row.type === "datasource") {
      goto(url(`../data/datasource/${row.id}`))
      return
    }
    if (row.type === "table") {
      goto(url(`../data/table/${row.id}`))
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

  const loadProjects = async (workspaceId: string) => {
    try {
      projectsRequestedForWorkspace = workspaceId
      await projectsStore.ensureFetched(workspaceId)
    } catch (error) {
      projectsRequestedForWorkspace = ""
      if ($appStore.appId === workspaceId && projectsEnabled) {
        notifications.error(getErrorMessage(error) || "Unable to load projects")
      }
    }
  }

  $: baseRows = buildHomeRows({
    apps: $workspaceAppStore.workspaceApps,
    automations: $automationStore.automations,
    agents: $agentsStore.agents,
    datasources: $datasources.list,
    tables: $tables.list,
    getFavourite,
  })

  $: projectLookup = (
    projectsEnabled
      ? Object.fromEntries(
          $projectsStore.map(project => [project._id, project])
        )
      : {}
  ) as Record<string, ProjectResponse>
  $: selectedProjectName = selectedProjectId
    ? projectLookup[selectedProjectId]?.name || ""
    : ""
  $: selectedProject = selectedProjectId
    ? projectLookup[selectedProjectId]
    : undefined
  $: if (
    projectsEnabled &&
    selectedProjectId &&
    projectsStore.hasFetched() &&
    !projectLookup[selectedProjectId]
  ) {
    selectedProjectId = ""
  }

  const openUpgradePage = () => {
    licensing.goToUpgradePage()
  }
  $: allRows = sortHomeRows(baseRows, { sortColumn, sortOrder })

  $: filteredRows = filterHomeRows({
    rows: allRows,
    typeFilter,
    searchTerm,
  }).filter(
    row =>
      !projectsEnabled ||
      !selectedProjectId ||
      row.projectIds?.includes(selectedProjectId)
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
  $: automationStopEntries = Object.entries(targetApp?.automationStops || {})
    .filter(([, logIds]) => logIds.length > 0)
    .map(([automationId]) => ({
      automationId,
      automation: $automationStore.automations.find(
        automation => automation._id === automationId
      ),
    }))

  $: budibaseAICreditLimit =
    $licensing.license?.quotas?.usage.monthly.budibaseAICredits?.value
  $: showBudibaseAIMetric =
    budibaseAICreditLimit != null && budibaseAICreditLimit !== 0

  $: if (
    hasMounted &&
    projectsEnabled &&
    $appStore.appId &&
    projectsRequestedForWorkspace !== $appStore.appId
  ) {
    loadProjects($appStore.appId)
  }

  $: if (hasMounted) {
    writeUrlState({
      searchTerm,
      typeFilter,
      selectedProjectId,
      sortColumn,
      sortOrder,
      projectsEnabled,
    })
  }

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

  const automationStopMessage = (automationName: string | undefined) => {
    const name = automationName || "Automation"
    return `${name} - Automation stopped`
  }

  onMount(async () => {
    const workspaceId = $appStore.appId
    if (!workspaceId) {
      return
    }

    const { q, type, project, sort, order } = readUrlState()
    if (q) {
      searchTerm = q
    }
    if (type) {
      typeFilter = type
    }
    if (project) {
      selectedProjectId = project
    }
    const sortAllowed = sort && (projectsEnabled || sort !== "projects")
    if (sortAllowed) {
      sortColumn = sort
    } else {
      sortColumn = "updated"
    }
    if (order && sortAllowed) {
      sortOrder = order
    }

    hasMounted = true
    writeUrlState({
      searchTerm,
      typeFilter,
      selectedProjectId,
      sortColumn,
      sortOrder,
      projectsEnabled,
    })

    await Promise.all([agentsStore.fetchAgents(), loadMetrics()])
  })
</script>

<div class="workspace-home">
  <div class="content" class:content--projects={projectsEnabled}>
    <div class="header">
      <div class="title">
        <Body
          size="M"
          weight="500"
          color="var(--spectrum-global-color-gray-900)"
        >
          {$appStore.name || "Workspace"}
        </Body>
      </div>

      <HomeHeaderActions
        {projectsEnabled}
        isEnterprisePlan={$licensing.isEnterprisePlan}
        showTrialBanner={$licensing.showTrialBanner}
        onUpgradePlan={openUpgradePage}
        onContactSales={openContactSales}
      />
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

    {#if automationStopEntries.length}
      <div class="automation-errors">
        {#each automationStopEntries as entry (entry.automationId)}
          <Notification
            wide
            dismissable
            type="warning"
            icon="Alert"
            action={() => goToAutomationError(entry.automationId)}
            actionMessage="View"
            message={automationStopMessage(entry.automation?.name)}
            on:dismiss={() => dismissAutomationError(entry.automationId)}
          />
        {/each}
      </div>
    {/if}

    <HomeMetrics {metrics} {showBudibaseAIMetric} />

    {#if projectsEnabled}
      <div class="project-resources">
        <HomeProjectTabs
          projects={$projectsStore}
          {selectedProjectId}
          onSelect={projectId => (selectedProjectId = projectId)}
          onCreateProject={createProject}
          onEditProject={editProject}
          onDeleteProject={() => confirmDeleteProjectDialog?.show()}
          onImportProject={importProject}
          onExportProject={exportProject}
        />

        <HomeResourcePanel>
          {#snippet toolbar()}
            <div class="panel-toolbar">
              <HomeControls
                {typeFilter}
                variant="panel"
                onTypeChange={setTypeFilter}
              />
              <div class="panel-toolbar__right">
                <div class="search-wrapper">
                  <Icon name="magnifying-glass" size="S" />
                  <input
                    class="search-input"
                    type="text"
                    placeholder="Search"
                    bind:value={searchTerm}
                  />
                </div>
                <HomeCreateMenu
                  variant="pill"
                  onCreateAgent={createAgent}
                  onCreateAutomation={createAutomation}
                  onCreateApp={createApp}
                  onCreateConnection={() => goToCreate("data/new")}
                  onCreateTable={openCreateTable}
                  onCreateApi={() => goToCreate("apis/new")}
                />
              </div>
            </div>
          {/snippet}

          <HomeTable
            rows={filteredRows}
            allRowsCount={allRows.length}
            {typeFilter}
            {searchTerm}
            {projectsEnabled}
            {selectedProjectName}
            {sortColumn}
            {sortOrder}
            {highlightedRowId}
            variant="panel"
            onOpenRow={openRow}
            onOpenContextMenu={openHomeContextMenu}
            onClearSearch={() => (searchTerm = "")}
            onResetFilters={() => {
              typeFilter = "all"
              selectedProjectId = ""
            }}
            onSortChange={setSort}
            onCreateAgent={createAgent}
            onCreateAutomation={createAutomation}
            onCreateApp={createApp}
          />
        </HomeResourcePanel>
      </div>
    {:else}
      <div class="controls-row">
        <HomeControls {typeFilter} onTypeChange={setTypeFilter} />
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
          <HomeCreateMenu
            portalTarget=".workspace-home .create-popover-container"
            onCreateAgent={createAgent}
            onCreateAutomation={createAutomation}
            onCreateApp={createApp}
            onCreateConnection={() => goToCreate("data/new")}
            onCreateTable={openCreateTable}
            onCreateApi={() => goToCreate("apis/new")}
          />
        </div>
      </div>

      <HomeTable
        rows={filteredRows}
        allRowsCount={allRows.length}
        {typeFilter}
        {searchTerm}
        {projectsEnabled}
        {selectedProjectName}
        {sortColumn}
        {sortOrder}
        {highlightedRowId}
        onOpenRow={openRow}
        onOpenContextMenu={openHomeContextMenu}
        onClearSearch={() => (searchTerm = "")}
        onResetFilters={() => {
          typeFilter = "all"
          selectedProjectId = ""
        }}
        onSortChange={setSort}
        onCreateAgent={createAgent}
        onCreateAutomation={createAutomation}
        onCreateApp={createApp}
      />
    {/if}
  </div>
</div>

{#if projectsEnabled}
  <Modal bind:this={createProjectModal}>
    {#key createProjectModalKey}
      <CreateProjectModal onConfirm={handleCreateProject} />
    {/key}
  </Modal>

  <Modal bind:this={assignProjectModal}>
    <AssignProjectModal
      resource={selectedProjectResource}
      projects={$projectsStore}
      onConfirm={assignProject}
    />
  </Modal>

  <Modal bind:this={editProjectModal}>
    {#key editProjectModalKey}
      <CreateProjectModal
        project={selectedProject}
        onConfirm={handleUpdateProject}
      />
    {/key}
  </Modal>

  {#if selectedProject}
    <ConfirmDialog
      bind:this={confirmDeleteProjectDialog}
      okText="Delete Project"
      onOk={deleteProject}
      title="Confirm Deletion"
    >
      Deleting <b>{selectedProject.name}</b> will clear its resource assignments.
      The resources themselves will not be deleted. Are you sure?
    </ConfirmDialog>
  {/if}

  <Modal bind:this={exportProjectModal}>
    {#key exportProjectModalKey}
      <ExportProjectModal
        projects={$projectsStore}
        {selectedProjectId}
        onConfirm={handleExportProject}
      />
    {/key}
  </Modal>

  <Modal bind:this={importProjectModal}>
    {#key importProjectModalKey}
      <ImportProjectModal onConfirm={handleImportProject} />
    {/key}
  </Modal>
{/if}

<WorkspaceAppModal
  bind:this={workspaceAppModal}
  workspaceApp={selectedWorkspaceApp}
  {initialProjectIds}
  on:hide={() => (selectedWorkspaceApp = undefined)}
/>

<Modal bind:this={createAutomationModal}>
  <CreateAutomationModal {webhookModal} {initialProjectIds} />
</Modal>
<Modal bind:this={webhookModal}>
  <CreateWebhookModal />
</Modal>

<Modal bind:this={createTableModal} closeOnOutsideClick={false}>
  {#key createTableModalKey}
    <CreateTableModal
      bind:name={tableName}
      {initialProjectIds}
      afterSave={handleTableSave}
    />
  {/key}
</Modal>

<AgentModal bind:this={agentModal} {initialProjectIds} />

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
    max-width: 1280px;
    padding: var(--spacing-xl) 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .content--projects {
    gap: 20px;
  }

  .project-resources {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
  }

  .panel-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    width: 100%;
    flex-wrap: wrap;
  }

  .panel-toolbar__right {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    margin-left: auto;
    flex-shrink: 0;
  }

  .panel-toolbar .search-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    padding: var(--spacing-xs) var(--spacing-s);
    min-width: 140px;
    height: 32px;
    box-sizing: border-box;
  }

  .panel-toolbar .search-input {
    background: transparent;
    border: none;
    outline: none;
    flex: 1;
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-900);
    width: 120px;
  }

  .panel-toolbar .search-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
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
