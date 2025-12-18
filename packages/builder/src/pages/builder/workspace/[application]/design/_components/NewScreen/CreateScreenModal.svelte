<script lang="ts">
  import ScreenDetailsModal from "@/components/design/ScreenDetailsModal.svelte"
  import DatasourceModal from "./DatasourceModal.svelte"
  import TypeModal from "./TypeModal.svelte"
  import AppSelectionModal from "./AppSelectionModal.svelte"
  import tableTypes from "./tableTypes"
  import formTypes from "./formTypes"
  import { Modal, ModalCancelFrom, notifications } from "@budibase/bbui"
  import {
    screenStore,
    permissions as permissionsStore,
    datasources,
    appStore,
    workspaceAppStore,
  } from "@/stores/builder"
  import { goto } from "@roxi/routify"
  import * as screenTemplating from "@/templates/screenTemplating"
  import { Roles } from "@/constants/backend"
  import { AutoScreenTypes } from "@/constants"
  import type { SourceOption } from "./utils"
  import { makeTableOption, makeViewOption } from "./utils"
  import type {
    SaveScreenRequest,
    Screen,
    Table,
    ViewV2,
  } from "@budibase/types"

  let mode: AutoScreenTypes
  let workspaceAppId: string | undefined

  let screenDetailsModal: Modal
  let appSelectionModal: Modal
  let datasourceModal: Modal
  let formTypeModal: Modal
  let tableTypeModal: Modal
  let selectedTablesAndViews: SourceOption[] = []
  let permissions: Record<
    string,
    {
      loading: boolean
      read: string
      write: string
    }
  > = {}

  let modals: Modal[] = []
  let stepIndex: number

  $: screens = $screenStore.screens

  $: {
    modals.forEach(m => m.hide())
    modals[stepIndex]?.show()
  }

  export const show = (
    newMode: AutoScreenTypes,
    preselectedWorkspaceAppId: string | undefined,
    preselectedDatasource: Table | ViewV2 | null = null
  ) => {
    mode = newMode
    selectedTablesAndViews = []
    permissions = {}
    workspaceAppId = preselectedWorkspaceAppId
    if (!workspaceAppId && $workspaceAppStore.workspaceApps.length === 1) {
      workspaceAppId = $workspaceAppStore.workspaceApps[0]._id
    }

    modals = []
    stepIndex = 0
    if (!workspaceAppId) {
      modals.push(appSelectionModal)
    }

    if (mode === AutoScreenTypes.TABLE || mode === AutoScreenTypes.FORM) {
      if (preselectedDatasource) {
        // If preselecting a datasource, skip a step
        const isTable = preselectedDatasource.type === "table"
        const tableOrView = isTable
          ? makeTableOption(preselectedDatasource, $datasources.list)
          : makeViewOption(preselectedDatasource)
        fetchPermission(tableOrView.id)
        selectedTablesAndViews.push(tableOrView)
      }

      if (!preselectedDatasource) {
        modals.push(datasourceModal)
      }

      if (mode === AutoScreenTypes.FORM) {
        modals.push(formTypeModal)
      } else if (mode === AutoScreenTypes.TABLE) {
        modals.push(tableTypeModal)
      }
    } else if (mode === AutoScreenTypes.BLANK || mode === AutoScreenTypes.PDF) {
      screenDetailsModal.show()
    } else {
      throw new Error("Invalid mode provided")
    }
  }

  const ensureWorkspaceApp = async () => {
    if (!workspaceAppId) {
      const workspaceApp = await workspaceAppStore.add({
        name: $appStore.name,
        url: "/",
      })
      workspaceAppId = workspaceApp._id
    }
    return workspaceAppId
  }

  const createScreen = async (
    screenTemplate: SaveScreenRequest
  ): Promise<Screen> => {
    try {
      return await screenStore.save({
        ...screenTemplate,
        workspaceAppId: await ensureWorkspaceApp(),
      })
    } catch (error) {
      console.error(error)
      notifications.error("Error creating screens")
      throw error
    }
  }

  const createScreens = async (
    screenTemplates: { data: Screen; navigationLinkLabel: string | null }[]
  ) => {
    const newScreens: Screen[] = []

    for (let screenTemplate of screenTemplates) {
      newScreens.push(
        await createScreen({
          ...screenTemplate.data,
          navigationLinkLabel: screenTemplate.navigationLinkLabel ?? undefined,
        })
      )
    }

    return newScreens
  }

  const createBasicScreen = async ({ route }: { route: string }) => {
    const workspaceAppId = await ensureWorkspaceApp()

    const screenTemplates =
      mode === AutoScreenTypes.BLANK
        ? screenTemplating.blank({ route, screens, workspaceAppId })
        : screenTemplating.pdf({ route, screens, workspaceAppId })
    const newScreens = await createScreens(screenTemplates)
    loadNewScreen(newScreens[0])
  }

  const createTableScreen = async (type: string) => {
    const workspaceAppId = await ensureWorkspaceApp()

    const safeWorkspaceAppId = workspaceAppId

    const screenTemplates = (
      await Promise.all(
        selectedTablesAndViews.map(tableOrView =>
          screenTemplating.table({
            screens,
            tableOrView,
            type,
            permissions: permissions[tableOrView.id],
            workspaceAppId: safeWorkspaceAppId,
          })
        )
      )
    ).flat()
    const newScreens = await createScreens(screenTemplates)
    loadNewScreen(newScreens[0])
  }

  const createFormScreen = async (type: string | null) => {
    const workspaceAppId = await ensureWorkspaceApp()

    const safeWorkspaceAppId = workspaceAppId
    const screenTemplates = (
      await Promise.all(
        selectedTablesAndViews.map(tableOrView =>
          screenTemplating.form({
            screens,
            tableOrView,
            type,
            permissions: permissions[tableOrView.id],
            workspaceAppId: safeWorkspaceAppId,
          })
        )
      )
    ).flat()
    const newScreens = await createScreens(screenTemplates)
    loadNewScreen(newScreens[0])
  }

  const loadNewScreen = (screen: Screen) => {
    if (screen.props?._children?.length) {
      // Focus on the main component for the screen type
      const mainComponent = screen.props?._children?.[0]._id
      $goto(
        `/builder/workspace/${$appStore.appId}/design/${workspaceAppId}/${screen._id}/${mainComponent}`
      )
    } else {
      $goto(
        `/builder/workspace/${$appStore.appId}/design/${workspaceAppId}/${screen._id}`
      )
    }

    screenStore.select(screen._id!)
  }

  const fetchPermission = (resourceId: string) => {
    permissions[resourceId] = {
      loading: true,
      read: Roles.BASIC,
      write: Roles.BASIC,
    }

    permissionsStore
      .forResource(resourceId)
      .then(permission => {
        if (permissions[resourceId]?.loading) {
          permissions[resourceId] = {
            loading: false,
            read: permission?.read?.role,
            write: permission?.write?.role,
          }
        }
      })
      .catch(e => {
        console.error("Error fetching permission data: ", e)

        if (permissions[resourceId]?.loading) {
          permissions[resourceId] = {
            loading: false,
            read: Roles.BASIC,
            write: Roles.BASIC,
          }
        }
      })
  }

  const deletePermission = (resourceId: string) => {
    delete permissions[resourceId]
    permissions = permissions
  }

  const handleTableOrViewToggle = ({
    detail: tableOrView,
  }: {
    detail: SourceOption
  }) => {
    const alreadySelected = selectedTablesAndViews.some(
      selected => selected.id === tableOrView.id
    )

    if (!alreadySelected) {
      fetchPermission(tableOrView.id)
      selectedTablesAndViews = [...selectedTablesAndViews, tableOrView]
    } else {
      deletePermission(tableOrView.id)
      selectedTablesAndViews = selectedTablesAndViews.filter(
        selected => selected.id !== tableOrView.id
      )
    }
  }
  const onCancel = (e: CustomEvent<ModalCancelFrom>) => {
    if (
      [ModalCancelFrom.CANCEL_BUTTON, ModalCancelFrom.ESCAPE_KEY].includes(
        e.detail
      )
    ) {
      stepIndex--
    }
  }
</script>

<Modal bind:this={appSelectionModal} autoFocus={false} on:cancel>
  <AppSelectionModal
    bind:selectedAppId={workspaceAppId}
    onConfirm={() => {
      stepIndex++
    }}
  />
</Modal>

<Modal bind:this={datasourceModal} autoFocus={false} on:cancel={onCancel}>
  <DatasourceModal
    {selectedTablesAndViews}
    onConfirm={() => {
      stepIndex++
    }}
    on:toggle={handleTableOrViewToggle}
  />
</Modal>

<Modal bind:this={tableTypeModal} on:cancel={onCancel}>
  <TypeModal
    title="Choose how you want to manage rows"
    types={tableTypes}
    onConfirm={createTableScreen}
    showCancelButton={stepIndex > 0}
  />
</Modal>

<Modal bind:this={screenDetailsModal} on:cancel>
  <ScreenDetailsModal onConfirm={createBasicScreen} />
</Modal>

<Modal bind:this={formTypeModal} on:cancel={onCancel}>
  <TypeModal
    title="Select form type"
    types={formTypes}
    onConfirm={createFormScreen}
    showCancelButton={stepIndex > 0}
  />
</Modal>
